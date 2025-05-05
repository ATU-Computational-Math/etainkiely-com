import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp, 
  Timestamp,
  DocumentReference,
  DocumentData
} from 'firebase/firestore';
import { db } from './firebase';
import { 
  UserProfile, 
  QuizQuestion, 
  QuizAttempt, 
  LeaderboardEntry, 
  Badge, 
  UserBadge,
  WeeklyTheme,
  School
} from '../types/database';

// Collection references
const usersCollection = collection(db, 'users');
const questionsCollection = collection(db, 'questions');
const quizAttemptsCollection = collection(db, 'quizAttempts');
const leaderboardCollection = collection(db, 'leaderboard');
const badgesCollection = collection(db, 'badges');
const userBadgesCollection = collection(db, 'userBadges');
const themesCollection = collection(db, 'themes');
const schoolsCollection = collection(db, 'schools');

// User Data Operations
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() } as UserProfile;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId: string, data: Partial<UserProfile>): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...data,
      lastActive: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Quiz Data Operations
export const getQuestionsByAgeGroup = async (ageGroup: string): Promise<QuizQuestion[]> => {
  try {
    const q = query(questionsCollection, where('ageGroup', '==', ageGroup));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as QuizQuestion);
  } catch (error) {
    console.error('Error getting questions:', error);
    throw error;
  }
};

export const getCurrentTheme = async (): Promise<WeeklyTheme | null> => {
  try {
    const now = Timestamp.now();
    const q = query(
      themesCollection, 
      where('startDate', '<=', now), 
      where('endDate', '>=', now)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const themeDoc = querySnapshot.docs[0];
      return { id: themeDoc.id, ...themeDoc.data() } as WeeklyTheme;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting current theme:', error);
    throw error;
  }
};

// Quiz Attempts and Results
export const saveQuizAttempt = async (quizAttempt: Omit<QuizAttempt, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(quizAttemptsCollection, {
      ...quizAttempt,
      dateCompleted: serverTimestamp()
    });
    
    // Update user stats
    const userRef = doc(db, 'users', quizAttempt.userId);
    await updateDoc(userRef, {
      completedQuizzes: quizAttempt.quizType === 'standard' 
        ? [quizAttempt.ageGroup] 
        : ['ultimate'],
      totalPoints: quizAttempt.score,
      lastActive: serverTimestamp()
    });
    
    // Add to leaderboard if score is good
    if (quizAttempt.score / quizAttempt.totalPossible >= 0.5) {
      await addToLeaderboard(quizAttempt);
    }
    
    // Check for badges
    await checkAndAwardBadges(quizAttempt);
    
    return docRef.id;
  } catch (error) {
    console.error('Error saving quiz attempt:', error);
    throw error;
  }
};

export const getUserQuizHistory = async (userId: string): Promise<QuizAttempt[]> => {
  try {
    const q = query(
      quizAttemptsCollection, 
      where('userId', '==', userId),
      orderBy('dateCompleted', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as QuizAttempt);
  } catch (error) {
    console.error('Error getting user quiz history:', error);
    throw error;
  }
};

// Leaderboard Operations
const addToLeaderboard = async (quizAttempt: Omit<QuizAttempt, 'id'>): Promise<void> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', quizAttempt.userId));
    
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }
    
    const userData = userDoc.data() as Partial<UserProfile>;
    
    // Get week and month IDs
    const now = new Date();
    const weekId = `${now.getFullYear()}-W${Math.ceil(now.getDate() / 7)}`;
    const monthId = `${now.getFullYear()}-${now.getMonth() + 1}`;
    
    // Get user badges
    const badgesQuery = query(userBadgesCollection, where('userId', '==', quizAttempt.userId));
    const badgesSnapshot = await getDocs(badgesQuery);
    const userBadgeIds = badgesSnapshot.docs.map(doc => doc.data().badgeId);
    
    const leaderboardEntry: Omit<LeaderboardEntry, 'id'> = {
      userId: quizAttempt.userId,
      displayName: userData.displayName || 'Anonymous',
      ageGroup: quizAttempt.ageGroup as 'young' | 'mid' | 'elder',
      score: quizAttempt.score,
      dateCompleted: Timestamp.fromDate(now),
      badges: userBadgeIds,
      schoolCode: userData.schoolCode,
      weekId,
      monthId
    };
    
    await addDoc(leaderboardCollection, leaderboardEntry);
    
    // If user has a school code, update school stats
    if (userData.schoolCode) {
      await updateSchoolStats(userData.schoolCode as string, quizAttempt.score);
    }
  } catch (error) {
    console.error('Error adding to leaderboard:', error);
    throw error;
  }
};

export const getLeaderboard = async (
  timeFrame: 'weekly' | 'monthly' | 'all-time' = 'all-time',
  ageGroup?: string,
  schoolCode?: string,
  limit = 50
): Promise<LeaderboardEntry[]> => {
  try {
    let q = query(leaderboardCollection, orderBy('score', 'desc'), limit(limit));
    
    // Apply filters
    if (timeFrame === 'weekly') {
      // Get current week ID
      const now = new Date();
      const weekId = `${now.getFullYear()}-W${Math.ceil(now.getDate() / 7)}`;
      q = query(q, where('weekId', '==', weekId));
    } else if (timeFrame === 'monthly') {
      // Get current month ID
      const now = new Date();
      const monthId = `${now.getFullYear()}-${now.getMonth() + 1}`;
      q = query(q, where('monthId', '==', monthId));
    }
    
    if (ageGroup) {
      q = query(q, where('ageGroup', '==', ageGroup));
    }
    
    if (schoolCode) {
      q = query(q, where('schoolCode', '==', schoolCode));
    }
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc, index) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Add position/rank based on query order
        rank: index + 1
      } as LeaderboardEntry;
    });
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    throw error;
  }
};

export const getUserRanking = async (
  userId: string,
  timeFrame: 'weekly' | 'monthly' | 'all-time' = 'all-time',
  ageGroup?: string
): Promise<{ rank: number; totalParticipants: number; entry: LeaderboardEntry | null }> => {
  try {
    // Get full leaderboard
    const leaderboard = await getLeaderboard(timeFrame, ageGroup);
    
    // Find user's entry
    const userIndex = leaderboard.findIndex(entry => entry.userId === userId);
    
    if (userIndex === -1) {
      return {
        rank: -1,
        totalParticipants: leaderboard.length,
        entry: null
      };
    }
    
    return {
      rank: userIndex + 1,
      totalParticipants: leaderboard.length,
      entry: leaderboard[userIndex]
    };
  } catch (error) {
    console.error('Error getting user ranking:', error);
    throw error;
  }
};

export const updateLeaderboardEntry = async (
  entryId: string,
  data: Partial<LeaderboardEntry>
): Promise<void> => {
  try {
    const entryRef = doc(db, 'leaderboard', entryId);
    await updateDoc(entryRef, data);
  } catch (error) {
    console.error('Error updating leaderboard entry:', error);
    throw error;
  }
};

// Badge Operations
export const checkAndAwardBadges = async (quizAttempt: Omit<QuizAttempt, 'id'>): Promise<string[]> => {
  try {
    // Get all available badges
    const badgesSnap = await getDocs(badgesCollection);
    const badges = badgesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Badge);
    
    // Get user's quiz history
    const history = await getUserQuizHistory(quizAttempt.userId);
    
    // Get user's existing badges
    const userBadgesSnap = await getDocs(
      query(userBadgesCollection, where('userId', '==', quizAttempt.userId))
    );
    const existingBadges = userBadgesSnap.docs.map(doc => doc.data().badgeId as string);
    
    // Check each badge criteria
    const newBadgeIds: string[] = [];
    
    for (const badge of badges) {
      // Skip if user already has this badge
      if (existingBadges.includes(badge.id)) {
        continue;
      }
      
      // Check criteria
      let shouldAward = false;
      let progress = { current: 0, target: badge.criteria.target };
      
      switch (badge.criteria.type) {
        case 'score':
          // Check if user achieved a specific score percentage
          const scorePercentage = (quizAttempt.score / quizAttempt.totalPossible) * 100;
          shouldAward = scorePercentage >= badge.criteria.target;
          progress.current = scorePercentage;
          break;
          
        case 'completion':
          // Check if user completed a specific number of quizzes
          const completedCount = history.length;
          shouldAward = completedCount >= badge.criteria.target;
          progress.current = completedCount;
          break;
          
        case 'streak':
          // Check for consecutive days with quizzes
          // This is a simplified implementation - a real one would be more complex
          const sortedHistory = [...history].sort((a, b) => {
            return (b.dateCompleted as any).toDate().getTime() - 
                   (a.dateCompleted as any).toDate().getTime();
          });
          
          let streak = 1;
          let lastDate: Date | null = null;
          
          for (const attempt of sortedHistory) {
            const attemptDate = (attempt.dateCompleted as any).toDate();
            
            if (!lastDate) {
              lastDate = attemptDate;
              continue;
            }
            
            const dayDiff = Math.floor((lastDate.getTime() - attemptDate.getTime()) / (1000 * 60 * 60 * 24));
            
            if (dayDiff === 1) {
              streak++;
              lastDate = attemptDate;
            } else if (dayDiff > 1) {
              break;
            }
          }
          
          shouldAward = streak >= badge.criteria.target;
          progress.current = streak;
          break;
          
        case 'time':
          // Check if user completed quizzes within time limit
          if (quizAttempt.timeSpent <= badge.criteria.target) {
            shouldAward = true;
          }
          progress.current = quizAttempt.timeSpent;
          break;
          
        case 'special':
          // Special badges typically awarded manually or through special events
          shouldAward = false;
          break;
      }
      
      // Award badge if criteria met
      if (shouldAward) {
        await awardBadge(quizAttempt.userId, badge.id, progress);
        newBadgeIds.push(badge.id);
      } else {
        // Update progress even if not awarded
        await updateBadgeProgress(quizAttempt.userId, badge.id, progress);
      }
    }
    
    return newBadgeIds;
  } catch (error) {
    console.error('Error checking and awarding badges:', error);
    throw error;
  }
};

export const getUserBadges = async (userId: string): Promise<UserBadge[]> => {
  try {
    const q = query(userBadgesCollection, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as UserBadge);
  } catch (error) {
    console.error('Error getting user badges:', error);
    throw error;
  }
};

export const awardBadge = async (
  userId: string,
  badgeId: string,
  progress?: { current: number; target: number }
): Promise<string> => {
  try {
    const userBadgeData: Omit<UserBadge, 'id'> = {
      userId,
      badgeId,
      dateEarned: Timestamp.now(),
      progress
    };
    
    const docRef = await addDoc(userBadgesCollection, userBadgeData);
    
    // Update user profile
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      badges: badgeId
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error awarding badge:', error);
    throw error;
  }
};

export const updateBadgeProgress = async (
  userId: string,
  badgeId: string,
  progress: { current: number; target: number }
): Promise<void> => {
  try {
    // Check if a progress record already exists
    const q = query(
      userBadgesCollection, 
      where('userId', '==', userId),
      where('badgeId', '==', badgeId)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      // Update existing record
      const docRef = doc(db, 'userBadges', querySnapshot.docs[0].id);
      await updateDoc(docRef, { progress });
    } else {
      // Create a new progress record without marking as earned
      const userBadgeData = {
        userId,
        badgeId,
        dateEarned: null,
        progress
      };
      
      await addDoc(userBadgesCollection, userBadgeData);
    }
  } catch (error) {
    console.error('Error updating badge progress:', error);
    throw error;
  }
};

// School/Team Operations
export const getSchoolLeaderboard = async (
  schoolCode: string,
  timeFrame: 'weekly' | 'monthly' | 'all-time' = 'all-time'
): Promise<LeaderboardEntry[]> => {
  try {
    return getLeaderboard(timeFrame, undefined, schoolCode);
  } catch (error) {
    console.error('Error getting school leaderboard:', error);
    throw error;
  }
};

export const updateSchoolStats = async (
  schoolCode: string,
  points: number
): Promise<void> => {
  try {
    // Check if school exists
    const schoolRef = doc(db, 'schools', schoolCode);
    const schoolSnap = await getDoc(schoolRef);
    
    if (schoolSnap.exists()) {
      // Update existing school
      await updateDoc(schoolRef, {
        totalPoints: (schoolSnap.data().totalPoints || 0) + points,
      });
    } else {
      // Create new school record
      await setDoc(schoolRef, {
        id: schoolCode,
        code: schoolCode,
        name: `School ${schoolCode}`, // Default name
        memberCount: 1,
        totalPoints: points,
        createdAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error updating school stats:', error);
    throw error;
  }
};

export const getSchool = async (schoolCode: string): Promise<School | null> => {
  try {
    const schoolRef = doc(db, 'schools', schoolCode);
    const schoolSnap = await getDoc(schoolRef);
    
    if (schoolSnap.exists()) {
      return { id: schoolSnap.id, ...schoolSnap.data() } as School;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting school:', error);
    throw error;
  }
};

export const addUserToSchool = async (userId: string, schoolCode: string): Promise<void> => {
  try {
    // Update user profile
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      schoolCode
    });
    
    // Update school member count
    const schoolRef = doc(db, 'schools', schoolCode);
    const schoolSnap = await getDoc(schoolRef);
    
    if (schoolSnap.exists()) {
      await updateDoc(schoolRef, {
        memberCount: (schoolSnap.data().memberCount || 0) + 1
      });
    } else {
      // Create school if it doesn't exist
      await setDoc(schoolRef, {
        id: schoolCode,
        code: schoolCode,
        name: `School ${schoolCode}`, // Default name
        memberCount: 1,
        totalPoints: 0,
        createdAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error adding user to school:', error);
    throw error;
  }
};

