import axios from 'axios';
import fs from 'fs';
import path from 'path';

// GitHub username
const username = 'charfimohamed';
const token ="not going to share my token :)";

// GitHub API endpoint for repositories
const apiEndpoint = `https://api.github.com/users/${username}/repos`;

async function fetchAllRepositories() {
    try {
        const response = await axios.get(apiEndpoint, {
            headers: {
//                Authorization: `token ${token}`,
                Accept: 'application/vnd.github.v3+json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching repositories:', error);
        return [];
    }
}

async function fetchReadme(repoName) {
    try {
        const readmeEndpoint = `https://api.github.com/repos/${username}/${repoName}/readme`;
        console.log(readmeEndpoint);
        const response = await axios.get(readmeEndpoint, {
            headers: {
//                Authorization: `token ${token}`,
                Accept: 'application/vnd.github.v3.raw'
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching README for ${repoName}:`, error);
        return '';
    }
}

function extractDemoLink(readmeContent) {
    const urlRegex = /(https?:\/\/[^\s\)]+)/g;
    const matches = readmeContent.match(urlRegex);
    return matches ? matches[0] : null;
}

async function createProjectEntry(id, repoData, demoLink) {
    const imageUrl = `https://raw.githubusercontent.com/${username}/${repoData.name}/main/project-image.svg`;

    // Function to check if the image exists
    async function imageExists(url) {
        try {
            const response = await axios.head(url);
            return response.status === 200;
        } catch (error) {
            return false;
        }
    }

    // Check if the image exists, else get a random image
    let finalImageUrl = imageUrl;
    if (!(await imageExists(imageUrl))) {
        // Get random SVG from the local folder
        const svgFolderPath = path.join(__dirname, '../assets/svg/projects');
        const svgFiles = fs.readdirSync(svgFolderPath).filter(file => file.endsWith('.svg'));

        // Select a random SVG file
        if (svgFiles.length > 0) {
            const randomSvg = svgFiles[Math.floor(Math.random() * svgFiles.length)];
            finalImageUrl = path.join(svgFolderPath, randomSvg);
        }
    }

    return {
        id: id,
        projectName: repoData.name.replace(/_/g, ' '),
        projectDesc: repoData.description || 'No description available.',
        tags: [],
        code: repoData.html_url,
        demo: demoLink || repoData.html_url,
        image: finalImageUrl
    };
}

export async function fetchProjectsData() {
    const repositories = await fetchAllRepositories();
    const projectsData = [];

    const filteredRepositories = repositories.filter(repo => !repo.name.toLowerCase().includes('github'));

    for (const [index, repo] of filteredRepositories.entries()) {
        const readmeContent = await fetchReadme(repo.name);
        const demoLink = extractDemoLink(readmeContent);
        const projectEntry = await createProjectEntry(index + 1, repo, demoLink);
        projectsData.push(projectEntry);
    }

    // Shuffle the projectsData array
    for (let i = projectsData.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [projectsData[i], projectsData[j]] = [projectsData[j], projectsData[i]];
    }

    return projectsData;
}
