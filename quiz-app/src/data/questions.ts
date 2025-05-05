// Type definitions for quiz questions and answers
export interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  text: string;
  answers: Answer[];
  explanation?: string;
  image?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

export interface QuestionSet {
  id: string;
  name: string;
  description: string;
  questions: Question[];
}

// Sample question data for different age groups
export const questionSets: Record<string, QuestionSet> = {
  young: {
    id: 'young',
    name: 'Young Heroes',
    description: 'Fun and educational biodiversity questions for ages 5-12',
    questions: [
      {
        id: 'y1',
        text: 'Which of these animals is a mammal?',
        answers: [
          { id: 'y1a', text: 'Fish', isCorrect: false },
          { id: 'y1b', text: 'Frog', isCorrect: false },
          { id: 'y1c', text: 'Dolphin', isCorrect: true },
          { id: 'y1d', text: 'Snake', isCorrect: false }
        ],
        explanation: 'Dolphins are mammals because they breathe air, have hair (though very little), give birth to live young, and feed their babies milk.',
        image: '/images/questions/dolphin.jpg',
        difficulty: 'easy',
        points: 10
      },
      {
        id: 'y2',
        text: 'Which part of a plant makes food using sunlight?',
        answers: [
          { id: 'y2a', text: 'Roots', isCorrect: false },
          { id: 'y2b', text: 'Stem', isCorrect: false },
          { id: 'y2c', text: 'Leaves', isCorrect: true },
          { id: 'y2d', text: 'Flowers', isCorrect: false }
        ],
        explanation: 'Leaves make food for the plant through a process called photosynthesis, which uses sunlight, water, and carbon dioxide.',
        image: '/images/questions/plant-leaf.jpg',
        difficulty: 'easy',
        points: 10
      },
      {
        id: 'y3',
        text: 'Which of these is NOT a way to help protect wildlife?',
        answers: [
          { id: 'y3a', text: 'Planting trees', isCorrect: false },
          { id: 'y3b', text: 'Using less plastic', isCorrect: false },
          { id: 'y3c', text: 'Recycling paper', isCorrect: false },
          { id: 'y3d', text: 'Leaving lights on all night', isCorrect: true }
        ],
        explanation: 'Leaving lights on wastes energy and can confuse nocturnal animals. Turning lights off when not needed helps save energy and protect wildlife.',
        difficulty: 'medium',
        points: 15
      },
      {
        id: 'y4',
        text: 'Which of these animals lays eggs?',
        answers: [
          { id: 'y4a', text: 'Dog', isCorrect: false },
          { id: 'y4b', text: 'Cat', isCorrect: false },
          { id: 'y4c', text: 'Turtle', isCorrect: true },
          { id: 'y4d', text: 'Sheep', isCorrect: false }
        ],
        explanation: 'Turtles lay eggs on land, often burying them in sand or soil to keep them safe until they hatch.',
        image: '/images/questions/turtle.jpg',
        difficulty: 'easy',
        points: 10
      },
      {
        id: 'y5',
        text: 'What do bees collect from flowers?',
        answers: [
          { id: 'y5a', text: 'Nectar', isCorrect: true },
          { id: 'y5b', text: 'Water', isCorrect: false },
          { id: 'y5c', text: 'Soil', isCorrect: false },
          { id: 'y5d', text: 'Seeds', isCorrect: false }
        ],
        explanation: 'Bees collect nectar from flowers and use it to make honey. They also collect pollen which they use as food for their young.',
        image: '/images/questions/bee.jpg',
        difficulty: 'easy',
        points: 10
      },
      {
        id: 'y6',
        text: 'Which animal helps plants grow by spreading their seeds?',
        answers: [
          { id: 'y6a', text: 'Birds', isCorrect: true },
          { id: 'y6b', text: 'Fish', isCorrect: false },
          { id: 'y6c', text: 'Spiders', isCorrect: false },
          { id: 'y6d', text: 'Whales', isCorrect: false }
        ],
        explanation: 'Birds help spread plant seeds when they eat fruits and berries. The seeds pass through their digestive systems and are deposited elsewhere when the bird poops.',
        difficulty: 'medium',
        points: 15
      },
      {
        id: 'y7',
        text: 'Which of these is a habitat?',
        answers: [
          { id: 'y7a', text: 'A pencil', isCorrect: false },
          { id: 'y7b', text: 'A forest', isCorrect: true },
          { id: 'y7c', text: 'A bicycle', isCorrect: false },
          { id: 'y7d', text: 'A telephone', isCorrect: false }
        ],
        explanation: 'A habitat is the natural home or environment where a plant or animal lives. A forest is a habitat for many animals and plants.',
        image: '/images/questions/forest.jpg',
        difficulty: 'easy',
        points: 10
      },
      {
        id: 'y8',
        text: 'What does "endangered" mean?',
        answers: [
          { id: 'y8a', text: 'Very common', isCorrect: false },
          { id: 'y8b', text: 'Lives a long time', isCorrect: false },
          { id: 'y8c', text: 'At risk of dying out forever', isCorrect: true },
          { id: 'y8d', text: 'Lives in water', isCorrect: false }
        ],
        explanation: 'An endangered species is one that is at risk of becoming extinct (dying out completely) if we don\'t help protect it.',
        difficulty: 'medium',
        points: 15
      }
    ]
  },
  mid: {
    id: 'mid',
    name: 'Mid-Generation Protectors',
    description: 'Challenging biodiversity questions for ages 13-30',
    questions: [
      {
        id: 'm1',
        text: 'Which of the following is NOT one of the main causes of biodiversity loss?',
        answers: [
          { id: 'm1a', text: 'Habitat destruction', isCorrect: false },
          { id: 'm1b', text: 'Climate change', isCorrect: false },
          { id: 'm1c', text: 'Recycling programs', isCorrect: true },
          { id: 'm1d', text: 'Invasive species', isCorrect: false }
        ],
        explanation: 'Recycling programs actually help protect biodiversity by reducing waste and conserving resources. The other options are major threats to biodiversity.',
        difficulty: 'medium',
        points: 15
      },
      {
        id: 'm2',
        text: 'What is the term for species that are at risk of extinction but not yet critically endangered?',
        answers: [
          { id: 'm2a', text: 'Vulnerable', isCorrect: false },
          { id: 'm2b', text: 'Threatened', isCorrect: false },
          { id: 'm2c', text: 'Endangered', isCorrect: true },
          { id: 'm2d', text: 'Near Threatened', isCorrect: false }
        ],
        explanation: 'The IUCN Red List classifies species as: Least Concern, Near Threatened, Vulnerable, Endangered, Critically Endangered, Extinct in Wild, and Extinct.',
        difficulty: 'medium',
        points: 15
      },
      {
        id: 'm3',
        text: 'Which ecosystem typically has the highest biodiversity?',
        answers: [
          { id: 'm3a', text: 'Desert', isCorrect: false },
          { id: 'm3b', text: 'Tundra', isCorrect: false },
          { id: 'm3c', text: 'Tropical rainforest', isCorrect: true },
          { id: 'm3d', text: 'Grassland', isCorrect: false }
        ],
        explanation: 'Tropical rainforests contain the highest biodiversity of any ecosystem on Earth, hosting approximately 50% of Earth\'s species while covering just 6% of the land surface.',
        image: '/images/questions/rainforest.jpg',
        difficulty: 'medium',
        points: 15
      },
      {
        id: 'm4',
        text: 'What percentage of Earth\'s species are estimated to remain undiscovered?',
        answers: [
          { id: 'm4a', text: 'Less than 10%', isCorrect: false },
          { id: 'm4b', text: 'Around 25%', isCorrect: false },
          { id: 'm4c', text: 'Between 50-80%', isCorrect: true },
          { id: 'm4d', text: 'Over 90%', isCorrect: false }
        ],
        explanation: 'Scientists estimate that between 50-80% of Earth\'s species remain undiscovered, with most of these being insects, fungi, and microorganisms.',
        difficulty: 'hard',
        points: 20
      },
      {
        id: 'm5',
        text: 'Which of these is an example of a keystone species?',
        answers: [
          { id: 'm5a', text: 'Common house fly', isCorrect: false },
          { id: 'm5b', text: 'Gray squirrel', isCorrect: false },
          { id: 'm5c', text: 'Sea otter', isCorrect: true },
          { id: 'm5d', text: 'Earthworm', isCorrect: false }
        ],
        explanation: 'Sea otters are keystone species because they control sea urchin populations, which would otherwise destroy kelp forests that provide habitat for many other species.',
        image: '/images/questions/sea-otter.jpg',
        difficulty: 'hard',
        points: 20
      },
      {
        id: 'm6',
        text: 'What is the Holocene extinction?',
        answers: [
          { id: 'm6a', text: 'An ancient ice age', isCorrect: false },
          { id: 'm6b', text: 'The current ongoing mass extinction of species', isCorrect: true },
          { id: 'm6c', text: 'The extinction of the dinosaurs', isCorrect: false },
          { id: 'm6d', text: 'A hypothetical future extinction event', isCorrect: false }
        ],
        explanation: 'The Holocene extinction, also called the sixth mass extinction, is the ongoing extinction event of species due to human activity. It has accelerated since the Industrial Revolution.',
        difficulty: 'hard',
        points: 20
      },
      {
        id: 'm7',
        text: 'Which of these is a benefit of biodiversity conservation?',
        answers: [
          { id: 'm7a', text: 'Increased risk of disease outbreaks', isCorrect: false },
          { id: 'm7b', text: 'Reduced agricultural productivity', isCorrect: false },
          { id: 'm7c', text: 'Enhanced ecosystem services like water purification', isCorrect: true },
          { id: 'm7d', text: 'Faster depletion of natural resources', isCorrect: false }
        ],
        explanation: 'Biodiversity conservation enhances ecosystem services like water purification, air quality regulation, pollination, and natural pest control that benefit humans.',
        difficulty: 'medium',
        points: 15
      },
      {
        id: 'm8',
        text: 'What is an ecological niche?',
        answers: [
          { id: 'm8a', text: 'A type of habitat', isCorrect: false },
          { id: 'm8b', text: 'A species\' role and position in its environment', isCorrect: true },
          { id: 'm8c', text: 'A conservation area', isCorrect: false },
          { id: 'm8d', text: 'A small ecological footprint', isCorrect: false }
        ],
        explanation: 'An ecological niche is the role and position a species has in its environment, including how it meets its needs for food and shelter, how it survives, and how it reproduces.',
        difficulty: 'medium',
        points: 15
      }
    ]
  },
  elder: {
    id: 'elder',
    name: 'Wisdom Keepers',
    description: 'In-depth biodiversity questions for ages 31+',
    questions: [
      {
        id: 'e1',
        text: 'Which international agreement aims to ensure the conservation and sustainable use of biodiversity?',
        answers: [
          { id: 'e1a', text: 'Kyoto Protocol', isCorrect: false },
          { id: 'e1b', text: 'Convention on Biological Diversity (CBD)', isCorrect: true },
          { id: 'e1c', text: 'Paris Agreement', isCorrect: false },
          { id: 'e1d', text: 'Montreal Protocol', isCorrect: false }
        ],
        explanation: 'The Convention on Biological Diversity (CBD) was established at the Earth Summit in Rio de Janeiro in 1992 with three main goals: conservation of biodiversity, sustainable use of biodiversity, and fair sharing of benefits from genetic resources.',
        difficulty: 'hard',
        points: 20
      },
      {
        id: 'e2',
        text: 'What term describes the process by which one species evolves in response to changes in another species?',
        answers: [
          { id: 'e2a', text: 'Natural selection', isCorrect: false },
          { id: 'e2b', text: 'Genetic drift', isCorrect: false },
          { id: 'e2c', text: 'Coevolution', isCorrect: true },
          { id: 'e2d', text: 'Convergent evolution', isCorrect: false }
        ],
        explanation: 'Coevolution occurs when two or more species reciprocally affect each other\'s evolution. Classic examples include flowers and their pollinators, or parasites and their hosts.',
        difficulty: 'har

// Type definitions for quiz questions and answers
export interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  text: string;
  answers: Answer[];
  explanation?: string;
  image?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

export interface QuestionSet {
  id: string;
  name: string;
  description: string;
  questions: Question[];
}

// Sample question data for different age groups
export const questionSets: Record<string, QuestionSet> = {
  young: {
    id: 'young',
    name: 'Young Heroes',
    description: 'Fun and educational biodiversity questions for ages 5-12',
    questions: [
      {
        id: 'y1',
        text: 'Which of these animals is a mammal?',
        answers: [
          { id: 'y1a', text: 'Fish', isCorrect: false },
          { id: 'y1b', text: 'Frog', isCorrect: false },
          { id: 'y1c', text: 'Dolphin', isCorrect: true },
          { id: 'y1d', text: 'Snake', isCorrect: false }
        ],
        explanation: 'Dolphins are mammals because they breathe air, have hair (though very little), give birth to live young, and feed their babies milk.',
        image: '/images/questions/dolphin.jpg',
        difficulty: 'easy',
        points: 10
      },
      {
        id: 'y2',
        text: 'Which part of a plant makes food using sunlight?',
        answers: [
          { id: 'y2a', text: 'Roots', isCorrect: false },
          { id: 'y2b', text: 'Stem', isCorrect: false },
          { id: 'y2c', text: 'Leaves', isCorrect: true },
          { id: 'y2d', text: 'Flowers', isCorrect: false }
        ],
        explanation: 'Leaves make food for the plant through a process called photosynthesis, which uses sunlight, water, and carbon dioxide.',
        image: '/images/questions/plant-leaf.jpg',
        difficulty: 'easy',
        points: 10
      },
      {
        id: 'y3',
        text: 'Which of these is NOT a way to help protect wildlife?',
        answers: [
          { id: 'y3a', text: 'Planting trees', isCorrect: false },
          { id: 'y3b', text: 'Using less plastic', isCorrect: false },
          { id: 'y3c', text: 'Recycling paper', isCorrect: false },
          { id: 'y3d', text: 'Leaving lights on all night', isCorrect: true }
        ],
        explanation: 'Leaving lights on wastes energy and can confuse nocturnal animals. Turning lights off when not needed helps save energy and protect wildlife.',
        difficulty: 'medium',
        points: 15
      },
      {
        id: 'y4',
        text: 'Which of these animals lays eggs?',
        answers: [
          { id: 'y4a', text: 'Dog', isCorrect: false },
          { id: 'y4b', text: 'Cat', isCorrect: false },
          { id: 'y4c', text: 'Turtle', isCorrect: true },
          { id: 'y4d', text: 'Sheep', isCorrect: false }
        ],
        explanation: 'Turtles lay eggs on land, often burying them in sand or soil to keep them safe until they hatch.',
        image: '/images/questions/turtle.jpg',
        difficulty: 'easy',
        points: 10
      },
      {
        id: 'y5',
        text: 'What do bees collect from flowers?',
        answers: [
          { id: 'y5a', text: 'Nectar', isCorrect: true },
          { id: 'y5b', text: 'Water', isCorrect: false },
          { id: 'y5c', text: 'Soil', isCorrect: false },
          { id: 'y5d', text: 'Seeds', isCorrect: false }
        ],
        explanation: 'Bees collect nectar from flowers and use it to make honey. They also collect pollen which they use as food for their young.',
        image: '/images/questions/bee.jpg',
        difficulty: 'easy',
        points: 10
      }
    ]
  },
  mid: {
    id: 'mid',
    name: 'Mid-Generation Protectors',
    description: 'Challenging biodiversity questions for ages 13-30',
    questions: [
      {
        id: 'm1',
        text: 'Which of the following is NOT one of the main causes of biodiversity loss?',
        answers: [
          { id: 'm1a', text: 'Habitat destruction', isCorrect: false },
          { id: 'm1b', text: 'Climate change', isCorrect: false },
          { id: 'm1c', text: 'Recycling programs', isCorrect: true },
          { id: 'm1d', text: 'Invasive species', isCorrect: false }
        ],
        explanation: 'Recycling programs actually help protect biodiversity by reducing waste and conserving resources. The other options are major threats to biodiversity.',
        difficulty: 'medium',
        points: 15
      },
      {
        id: 'm2',
        text: 'What is the term for species that are at risk of extinction but not yet critically endangered?',
        answers: [
          { id: 'm2a', text: 'Vulnerable', isCorrect: false },
          { id: 'm2b', text: 'Threatened', isCorrect: false },
          { id: 'm2c', text: 'Endangered', isCorrect: true },
          { id: 'm2d', text: 'Near Threatened', isCorrect: false }
        ],
        explanation: 'The IUCN Red List classifies species as: Least Concern, Near Threatened, Vulnerable, Endangered, Critically Endangered, Extinct in Wild, and Extinct.',
        difficulty: 'medium',
        points: 15
      },
      {
        id: 'm3',
        text: 'Which ecosystem typically has the highest biodiversity?',
        answers: [
          { id: 'm3a', text: 'Desert', isCorrect: false },
          { id: 'm3b', text: 'Tundra', isCorrect: false },
          { id: 'm3c', text: 'Rainforest', isCorrect: true },
          { id: 'm3d', text: 'Grassland', isCorrect: false }
        ],
        explanation: 'Tropical rainforests contain the highest biodiversity of any ecosystem on Earth, hosting approximately 50% of Earth\'s species while covering just 6% of the land surface.',
        image: '/images/questions/rainforest.jpg',
        difficulty: 'medium',
        points: 15
      },
      {
        id: 'm4',
        text: 'What percentage of Earth\'s species are estimated to remain undiscovered?',
        answers: [
          { id: 'm4a', text: 'Less than 10%', isCorrect: false },
          { id: 'm4b', text: 'Around 25%', isCorrect: false },
          { id: 'm4c', text: 'Between 50-80%', isCorrect: true },
          { id: 'm4d', text: 'Over 90%', isCorrect: false }
        ],
        explanation: 'Scientists estimate that between 50-80% of Earth\'s species remain undiscovered, with most of these being insects, fungi, and microorganisms.',
        difficulty: 'hard',
        points: 20
      },
      {
        id: 'm5',
        text: 'Which of these is an example of a keystone species?',
        answers: [
          { id: 'm5a', text: 'Common house fly', isCorrect: false },
          { id: 'm5b', text: 'Gray squirrel', isCorrect: false },
          { id: 'm5c', text: 'Sea otter', isCorrect: true },
          { id: 'm5d', text: 'Earthworm', isCorrect: false }
        ],
        explanation: 'Sea otters are keystone species because they control sea urchin populations, which would otherwise destroy kelp forests that provide habitat for many other species.',
        image: '/images/questions/sea-otter.jpg',
        difficulty: 'hard',
        points: 20
      }
    ]
  },
  elder: {
    id: 'elder',
    name: 'Wisdom Keepers',
    description: 'In-depth biodiversity questions for ages 31+',
    questions: [
      {
        id: 'e1',
        text: 'Which international agreement aims to ensure the conservation and sustainable use of biodiversity?',
        answers: [
          { id: 'e1a', text: 'Kyoto Protocol', isCorrect: false },
          { id: 'e1b', text: 'Convention on Biological Diversity (CBD)', isCorrect: true },
          { id: 'e1c', text: 'Paris Agreement', isCorrect: false },
          { id: 'e1d', text: 'Montreal Protocol', isCorrect: false }
        ],
        explanation: 'The Convention on Biological Diversity (CBD) was established at the Earth Summit in Rio de Janeiro in 1992 with three main goals: conservation of biodiversity, sustainable use of biodiversity, and fair sharing of benefits from genetic resources.',
        difficulty: 'hard',
        points: 20
      },
      {
        id: 'e2',
        text: 'What term describes the process by which one species evolves in response to changes in another species?',
        answers: [
          { id: 'e2a', text: 'Natural selection', isCorrect: false },
          { id: 'e2b', text: 'Genetic drift', isCorrect: false },
          { id: 'e2c', text: 'Coevolution', isCorrect: true },
          { id: 'e2d', text: 'Convergent evolution', isCorrect: false }
        ],
        explanation: 'Coevolution occurs when two or more species reciprocally affect each other\'s evolution. Classic examples include flowers and their pollinators, or parasites and their hosts.',
        difficulty: 'hard',
        points: 20
      },
      {
        id: 'e3',
        text: 'Which of these approaches is LEAST effective for conserving biodiversity?',
        answers: [
          { id: 'e3a', text: 'Creating wildlife corridors between fragmented habitats', isCorrect: false },
          { id: 'e3b', text: 'Ex-situ conservation in zoos and botanical gardens', isCorrect: false },
          { id: 'e3c', text: 'Single-species focus without ecosystem consideration', isCorrect: true },
          { id: 'e3d', text: 'Community-based sustainable resource management', isCorrect: false }
        ],
        explanation: 'Single-species conservation without considering the whole ecosystem often fails because species depend on complex ecological relationships. Effective conservation typically requires broader ecosystem-based approaches.',
        difficulty: 'hard',
        points: 20
      },
      {
        id: 'e4',
        text: 'What is the term for the genetic diversity within a single species?',
        answers: [
          { id: 'e4a', text: 'Species diversity', isCorrect: false },
          { id: 'e4b', text: 'Ecosystem diversity', isCorrect: false },
          { id: 'e4c', text: 'Genetic diversity', isCorrect: true },
          { id: 'e4d', text: 'Functional diversity', isCorrect: false }
        ],
        explanation: 'Genetic diversity refers to the variety of genes within a species. High genetic diversity helps species adapt to environmental changes and resist diseases.',
        difficulty: 'medium',
        points: 15
      },
      {
        id: 'e5',
        text: 'Which ecological concept refers to the maximum population size that an environment can sustain indefinitely?',
        answers: [
          { id: 'e5a', text: 'Carrying capacity', isCorrect: true },
          { id: 'e5b', text: 'Ecological footprint', isCorrect: false },
          { id: 'e5c', text: 'Biotic potential', isCorrect: false },
          { id: 'e5d', text: 'Trophic efficiency', isCorrect: false }
        ],
        explanation: 'Carrying capacity is the maximum population size that an environment can sustain indefinitely given the food, habitat, water, and other resources available in that environment.',
        difficulty: 'medium',
        points: 15
      }
    ]
  }
};

// Helper function to get questions for a specific age group
export const getQuestionsByAgeGroup = (ageGroup: string): Question[] => {
  return questionSets[ageGroup]?.questions || [];
};

