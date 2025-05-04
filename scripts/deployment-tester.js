#!/usr/bin/env node

/**
 * Automated Deployment Testing Script
 * 
 * This script automates checks from the DEPLOYMENT_CHECKLIST.md to validate
 * the website deployment. It focuses on technical validations that can be automated.
 * 
 * Usage: node scripts/deployment-tester.js [baseUrl]
 * Default baseUrl: http://localhost:8080
 */

const http = require('http');
const https = require('https');
const { URL } = require('url');
const fs = require('fs');
const path = require('path');

// Configuration
const baseUrl = process.argv[2] || 'http://localhost:8080';
const pagesToCheck = [
    '/',
    '/index.html',
    '/play2learn.html',
    '/fraction-action.html'
];

// Results storage
const results = {
    passed: 0,
    failed: 0,
    warnings: 0,
    details: []
};

// Color codes for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m'
};

/**
 * Main function to run all tests
 */
async function runTests() {
    console.log(`${colors.bright}Starting deployment tests for: ${colors.blue}${baseUrl}${colors.reset}\n`);
    
    try {
        // Check site availability
        await checkSiteAvailability();
        
        // Check all pages
        for (const page of pagesToCheck) {
            await checkPage(page);
        }
        
        // Check for broken links
        await checkLinks();
        
        // Check essential HTML elements
        await checkEssentialElements();
        
        // Check for CSS issues
        await checkCssIntegrity();
        
        // Check responsive meta tag
        await checkResponsiveMeta();
        
        // Check JavaScript errors
        await checkJavaScriptErrors();

        // Generate and display report
        generateReport();
        
    } catch (error) {
        console.error(`${colors.red}Test execution failed:${colors.reset}`, error);
        process.exit(1);
    }
}

/**
 * Check if the site is available
 */
async function checkSiteAvailability() {
    logTestStart('Site Availability');
    
    try {
        const response = await fetchUrl(baseUrl);
        if (response.statusCode === 200) {
            logSuccess('Site is accessible');
        } else {
            logFailure(`Site returned status code: ${response.statusCode}`);
        }
    } catch (error) {
        logFailure(`Failed to connect to site: ${error.message}`);
    }
}

/**
 * Check a specific page
 */
async function checkPage(page) {
    const url = `${baseUrl}${page}`;
    logTestStart(`Page Check: ${page}`);
    
    try {
        const response = await fetchUrl(url);
        
        if (response.statusCode === 200) {
            logSuccess(`Page ${page} loaded successfully`);
            
            // Check for title
            const titleMatch = response.body.match(/<title>(.*?)<\/title>/i);
            if (titleMatch && titleMatch[1]) {
                logSuccess(`Page has title: ${titleMatch[1]}`);
            } else {
                logWarning('Page is missing title tag');
            }
            
            // Check for required meta tags
            if (response.body.includes('<meta name="viewport"')) {
                logSuccess('Page has viewport meta tag');
            } else {
                logWarning('Page is missing viewport meta tag');
            }
            
            // Check for heading structure
            const h1Count = (response.body.match(/<h1/gi) || []).length;
            if (h1Count === 1) {
                logSuccess('Page has exactly one H1 element');
            } else if (h1Count === 0) {
                logWarning('Page has no H1 element');
            } else {
                logWarning(`Page has ${h1Count} H1 elements, should have exactly one`);
            }
            
        } else {
            logFailure(`Page ${page} returned status code: ${response.statusCode}`);
        }
    } catch (error) {
        logFailure(`Failed to test page ${page}: ${error.message}`);
    }
}

/**
 * Check all links on the site
 */
async function checkLinks() {
    logTestStart('Link Validation');
    
    try {
        const homepage = await fetchUrl(baseUrl);
        const links = extractLinks(homepage.body, baseUrl);
        
        let brokenLinks = 0;
        let workingLinks = 0;
        
        for (const link of links) {
            if (link.startsWith('mailto:') || link.startsWith('tel:')) {
                logSuccess(`Skipping protocol link: ${link}`);
                continue;
            }
            
            try {
                const response = await fetchUrl(link);
                
                if (response.statusCode >= 200 && response.statusCode < 400) {
                    workingLinks++;
                } else {
                    brokenLinks++;
                    logWarning(`Broken link: ${link} (Status: ${response.statusCode})`);
                }
            } catch (error) {
                brokenLinks++;
                logWarning(`Failed to check link: ${link} (${error.message})`);
            }
        }
        
        if (brokenLinks === 0) {
            logSuccess(`All ${workingLinks} links are working`);
        } else {
            logWarning(`Found ${brokenLinks} broken links out of ${workingLinks + brokenLinks} total links`);
        }
    } catch (error) {
        logFailure(`Failed to check links: ${error.message}`);
    }
}

/**
 * Check for essential HTML elements
 */
async function checkEssentialElements() {
    logTestStart('Essential Elements Check');
    
    try {
        const homepage = await fetchUrl(baseUrl);
        
        // Check for header
        if (homepage.body.includes('<header')) {
            logSuccess('Page has header element');
        } else {
            logWarning('Page is missing header element');
        }
        
        // Check for main
        if (homepage.body.includes('<main')) {
            logSuccess('Page has main element');
        } else {
            logWarning('Page is missing main element');
        }
        
        // Check for footer
        if (homepage.body.includes('<footer')) {
            logSuccess('Page has footer element');
        } else {
            logWarning('Page is missing footer element');
        }
        
        // Check for navigation
        if (homepage.body.includes('<nav')) {
            logSuccess('Page has navigation element');
        } else {
            logWarning('Page is missing navigation element');
        }
    } catch (error) {
        logFailure(`Failed to check essential elements: ${error.message}`);
    }
}

/**
 * Check for CSS integrity
 */
async function checkCssIntegrity() {
    logTestStart('CSS Integrity Check');
    
    try {
        const homepage = await fetchUrl(baseUrl);
        const cssLinks = extractCssLinks(homepage.body, baseUrl);
        
        if (cssLinks.length === 0) {
            logWarning('No CSS files found on the page');
            return;
        }
        
        let cssErrors = 0;
        
        for (const cssLink of cssLinks) {
            try {
                const response = await fetchUrl(cssLink);
                
                if (response.statusCode === 200) {
                    logSuccess(`CSS file loaded successfully: ${cssLink}`);
                    
                    // Basic CSS validation - check for parsing errors
                    const cssErrors = basicCssValidation(response.body);
                    if (cssErrors.length === 0) {
                        logSuccess('CSS file passes basic validation');
                    } else {
                        logWarning(`CSS file has ${cssErrors.length} potential issues`);
                        cssErrors.forEach(error => logWarning(`  - ${error}`));
                    }
                } else {
                    cssErrors++;
                    logWarning(`Failed to load CSS file: ${cssLink} (Status: ${response.statusCode})`);
                }
            } catch (error) {
                cssErrors++;
                logWarning(`Failed to test CSS file: ${cssLink} (${error.message})`);
            }
        }
        
        if (cssErrors === 0) {
            logSuccess('All CSS files loaded successfully');
        } else {
            logWarning(`Found issues with ${cssErrors} CSS files`);
        }
    } catch (error) {
        logFailure(`Failed to check CSS integrity: ${error.message}`);
    }
}

/**
 * Check for responsive meta tag
 */
async function checkResponsiveMeta() {
    logTestStart('Responsive Design Check');
    
    try {
        const homepage = await fetchUrl(baseUrl);
        
        // Check for viewport meta tag
        const viewportRegex = /<meta\s+name=["']viewport["']\s+content=["'](.+?)["']/i;
        const viewportMatch = homepage.body.match(viewportRegex);
        
        if (viewportMatch) {
            const viewportContent = viewportMatch[1];
            logSuccess(`Viewport meta tag found: ${viewportContent}`);
            
            // Check for width=device-width
            if (viewportContent.includes('width=device-width')) {
                logSuccess('Viewport includes width=device-width');
            } else {
                logWarning('Viewport missing width=device-width setting');
            }
            
            // Check for initial-scale
            if (viewportContent.includes('initial-scale=1')) {
                logSuccess('Viewport includes initial-scale=1');
            } else {
                logWarning('Viewport missing initial-scale=1 setting');
            }
        } else {
            logWarning('No viewport meta tag found');
        }
        
        // Check for media queries in CSS
        const cssLinks = extractCssLinks(homepage.body, baseUrl);
        let foundMediaQueries = false;
        
        for (const cssLink of cssLinks) {
            try {
                const response = await fetchUrl(cssLink);
                
                if (response.statusCode === 200) {
                    // Check for media queries
                    const mediaQueriesCount = (response.body.match(/@media/g) || []).length;
                    
                    if (mediaQueriesCount > 0) {
                        foundMediaQueries = true;
                        logSuccess(`Found ${mediaQueriesCount} media queries in ${cssLink}`);
                    }
                }
            } catch (error) {
                // Skip failed CSS files
            }
        }
        
        if (!foundMediaQueries) {
            logWarning('No media queries found in CSS files');
        }
    } catch (error) {
        logFailure(`Failed to check responsive design: ${error.message}`);
    }
}

/**
 * Check for JavaScript errors
 */
async function checkJavaScriptErrors() {
    logTestStart('JavaScript Check');
    
    try {
        const homepage = await fetchUrl(baseUrl);
        const jsLinks = extractJsLinks(homepage.body, baseUrl);
        
        if (jsLinks.length === 0) {
            logWarning('No JavaScript files found on the page');
            return;
        }
        
        let jsErrors = 0;
        
        for (const jsLink of jsLinks) {
            try {
                const response = await fetchUrl(jsLink);
                
                if (response.statusCode === 200) {
                    logSuccess(`JavaScript file loaded successfully: ${jsLink}`);
                    
                    // Basic JS validation - check for syntax errors
                    try {
                        new Function(response.body);
                        logSuccess('JavaScript file passes basic syntax validation');
                    } catch (syntaxError) {
                        jsErrors++;
                        logWarning(`JavaScript syntax error in ${jsLink}: ${syntaxError.message}`);
                    }
                } else {
                    jsErrors++;
                    logWarning(`Failed to load JavaScript file: ${jsLink} (Status: ${response.statusCode})`);
                }
            } catch (error) {
                jsErrors++;
                logWarning(`Failed to test JavaScript file: ${jsLink} (${error.message})`);
            }
        }
        
        if (jsErrors === 0) {
            logSuccess('All JavaScript files loaded successfully');
        } else {
            logWarning(`Found issues with ${jsErrors} JavaScript files`);
        }
    } catch (error) {
        logFailure(`Failed to check JavaScript: ${error.message}`);
    }
}

/**
 * Generate and display final report
 */
function generateReport() {
    console.log(`\n${colors.bright}--------- Test Summary ---------${colors.reset}`);
    console.log(`Total tests: ${results.passed + results.failed + results.warnings}`);
    console.log(`${colors.green}Passed: ${results.passed}${colors.reset}`);
    console.log(`${colors.red}Failed: ${results.failed}${colors.reset}`);
    console.log(`${colors.yellow}Warnings: ${results.warnings}${colors.reset}`);
    
    // Calculate pass percentage
    const total = results.passed + results.failed;
    const passRate = total > 0 ? Math.round((results.passed / total) * 100) : 0;
    console.log(`Pass rate: ${passRate}%`);
    
    // Write report to file
    const reportData = {
        timestamp: new Date().toISOString(),
        baseUrl: baseUrl,
        summary: {
            total: results.passed + results.failed + results.warnings,
            passed: results.passed,
            failed: results.failed,
            warnings: results.warnings,
            passRate: `${passRate}%`
        },
        details: results.details
    };
    
    const reportFile = path.join(process.cwd(), 'deployment-test-report.json');
    fs.writeFileSync(reportFile, JSON.stringify(reportData, null, 2));
    console.log(`\nDetailed report saved to: ${reportFile}`);
    
    // Exit with error code if any failures
    if (results.failed > 0) {
        console.log(`\n${colors.red}Deployment tests failed with ${results.failed} errors${colors.reset}`);
        process.exit(1);
    } else {
        console.log(`\n${colors.green}Deployment tests completed successfully${colors.reset}`);
    }
}

/**
 * Extract all links from HTML content
 */
function extractLinks(html, baseUrl) {
    const links = [];
    const linkRegex = /href=["'](.*?)["']/g;
    let match;
    
    while ((match = linkRegex.exec(html)) !== null) {
        const link = match[1];
        
        // Skip anchors, javascript: links, and empty links
        if (link.startsWith('#') || 
            link.startsWith('javascript:') || 
            link === '') {
            continue;
        }
        
        // Handle relative links
        if (link.startsWith('/')) {
            const baseUrlObj = new URL(baseUrl);
            links.push(`${baseUrlObj.protocol}//${baseUrlObj.host}${link}`);
        } else if (!link.startsWith('http')) {
            // Handle relative paths without leading slash
            links.push(`${baseUrl.replace(/\/$/, '')}/${link.replace(/^\//, '')}`);
        } else {
            // Absolute URL
            links.push(link);
        }
    }
    
    // Remove duplicates
    return [...new Set(links)];
}

/**
 * Extract CSS file links from HTML content
 */
function extractCssLinks(html, baseUrl) {
    const links = [];
    // Find all stylesheet links
    const cssRegex = /<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi;
    let match;
    
    while ((match = cssRegex.exec(html)) !== null) {
        const link = match[1];
        
        // Handle relative and absolute paths like in extractLinks
        if (link.startsWith('/')) {
            const baseUrlObj = new URL(baseUrl);
            links.push(`${baseUrlObj.protocol}//${baseUrlObj.host}${link}`);
        } else if (!link.startsWith('http')) {
            links.push(`${baseUrl.replace(/\/$/, '')}/${link.replace(/^\//, '')}`);
        } else {
            links.push(link);
        }
    }
    
    // Also check for inline style tags
    const styleCount = (html.match(/<style[^>]*>/gi) || []).length;
    if (styleCount > 0) {
        logSuccess(`Found ${styleCount} inline style elements`);
    }
    
    return [...new Set(links)];
}

/**
 * Extract JavaScript file links from HTML content
 */
function extractJsLinks(html, baseUrl) {
    const links = [];
    // Find all script src attributes
    const jsRegex = /<script[^>]*src=["']([^"']+)["'][^>]*>/gi;
    let match;
    
    while ((match = jsRegex.exec(html)) !== null) {
        const link = match[1];
        
        // Handle relative and absolute paths
        if (link.startsWith('/')) {
            const baseUrlObj = new URL(baseUrl);
            links.push(`${baseUrlObj.protocol}//${baseUrlObj.host}${link}`);
        } else if (!link.startsWith('http')) {
            links.push(`${baseUrl.replace(/\/$/, '')}/${link.replace(/^\//, '')}`);
        } else {
            links.push(link);
        }
    }
    
    // Also check for inline scripts
    const inlineScriptCount = (html.match(/<script(?! src=)[^>]*>/gi) || []).length;
    if (inlineScriptCount > 0) {
        logSuccess(`Found ${inlineScriptCount} inline script elements`);
    }
    
    return [...new Set(links)];
}

/**
 * Basic CSS validation
 */
function basicCssValidation(css) {
    const errors = [];
    
    // Check for unmatched braces
    const openBraces = (css.match(/{/g) || []).length;
    const closeBraces = (css.match(/}/g) || []).length;
    if (openBraces !== closeBraces) {
        errors.push(`Unmatched braces: ${openBraces} opening vs ${closeBraces} closing`);
    }
    
    // Check for potentially invalid CSS properties
    const invalidPropertyRegex = /([a-z-]+)\s*:\s*(?:;|\})/g;
    let invalidPropMatch;
    while ((invalidPropMatch = invalidPropertyRegex.exec(css)) !== null) {
        errors.push(`Empty or invalid property value for: ${invalidPropMatch[1]}`);
    }
    
    // Check for missing semicolons (potential issue)
    const missingSemicolonRegex = /([a-z-]+)\s*:\s*[^;}]+\}/g;
    let missingSemiMatch;
    while ((missingSemiMatch = missingSemicolonRegex.exec(css)) !== null) {
        errors.push(`Possible missing semicolon for property: ${missingSemiMatch[1]}`);
    }
    
    return errors;
}

/**
 * Fetch URL and return response with body
 */
async function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(url);
        const options = {
            hostname: parsedUrl.hostname,
            path: parsedUrl.pathname + parsedUrl.search,
            method: 'GET',
            headers: {
                'User-Agent': 'DeploymentTestingScript/1.0'
            }
        };
        
        const client = parsedUrl.protocol === 'https:' ? https : http;
        const req = client.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                res.body = data;
                resolve(res);
            });
        });
        
        req.on('error', (error) => {
            reject(error);
        });
        
        req.end();
    });
}

/**
 * Logging utilities
 */
function logTestStart(testName) {
    console.log(`\n${colors.bright}Testing: ${testName}${colors.reset}`);
}

function logSuccess(message) {
    console.log(`${colors.green}✓ ${message}${colors.reset}`);
    results.passed++;
    results.details.push({ type: 'success', message });
}

function logFailure(message) {
    console.log(`${colors.red}✗ ${message}${colors.reset}`);
    results.failed++;
    results.details.push({ type: 'failure', message });
}

function logWarning(message) {
    console.log(`${colors.yellow}! ${message}${colors.reset}`);
    results.warnings++;
    results.details.push({ type: 'warning', message });
}

// Run the tests
runTests().catch(error => {
    console.error(`${colors.red}Unhandled error:${colors.reset}`, error);
    process.exit(1);
});

