const simpleGit = require('simple-git');
const fs = require('fs').promises;
const path = require('path');
const git = simpleGit();

const REPO_PATH = path.resolve(__dirname);
const REMOTE = 'origin';
const BRANCH = 'master';

// Function to generate random string
function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// Function to create a random file
async function createRandomFile() {
    const fileName = `random_${generateRandomString(8)}.txt`;
    const content = Array.from({ length: Math.floor(Math.random() * 10) + 1 })
        .map(() => generateRandomString(Math.floor(Math.random() * 20) + 5))
        .join('\n');
    
    await fs.writeFile(
        path.join(REPO_PATH, fileName),
        content
    );
    return fileName;
}

// Function to commit changes
async function makeRandomCommit() {
    try {
        // Generate random content
        const fileName = await createRandomFile();
        
        // Git operations
        await git.add(fileName);
        const commitMessage = `Random commit: ${generateRandomString(10)}`;
        await git.commit(commitMessage);
        await git.push(REMOTE, BRANCH);
        
        console.log(`Committed: ${commitMessage}`);
    } catch (error) {
        console.error('Error during commit:', error.message);
    }
}

// Spam commits at random intervals
function start(minIntervalMs = 5000, maxIntervalMs = 30000) {
    function scheduleNextCommit() {
        const delay = Math.floor(Math.random() * (maxIntervalMs - minIntervalMs) + minIntervalMs);
        
        setTimeout(async () => {
            await makeRandomCommit();
            scheduleNextCommit();
        }, delay);
    }
    
    console.log('Starting commit spam...');
    scheduleNextCommit();
}

// Clean up old random files (optional)
async function cleanupRandomFiles() {
    const files = await fs.readdir(REPO_PATH);
    const randomFiles = files.filter(file => file.startsWith('random_'));
    
    for (const file of randomFiles) {
        await fs.unlink(path.join(REPO_PATH, file));
    }
    console.log(`Cleaned up ${randomFiles.length} random files`);
}

start(1000, 3000);
