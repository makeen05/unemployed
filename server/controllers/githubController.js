import { Octokit } from 'octokit';
import axios from 'axios';

// Helper: Get Octokit instance (creates it with current env vars)
const getOctokit = () => {
  return new Octokit({ 
    auth: process.env.GITHUB_TOKEN 
  });
};

// Helper: Filter files based on importance
const getImportantFiles = (tree) => {
  const configFiles = ['package.json', 'requirements.txt', 'Gemfile', 'pom.xml', 
    'Cargo.toml', 'go.mod', 'composer.json', 'pubspec.yaml', 'tsconfig.json'];
  
  const importantPaths = ['src/', 'app/', 'lib/', 'backend/', 'frontend/', 'server/', 'client/'];
  const codeExtensions = ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.go', '.rs', '.php', '.rb'];
  const ignorePaths = ['node_modules/', 'dist/', 'build/', '__pycache__/', '.git/', 'vendor/'];

  const files = tree
    .filter(item => item.type === 'blob')
    .filter(item => !ignorePaths.some(ignore => item.path.includes(ignore)))
    .map(item => ({
      path: item.path,
      url: item.url,
      name: item.path.split('/').pop(),
      isConfig: configFiles.includes(item.path.split('/').pop()),
      isCode: codeExtensions.some(ext => item.path.endsWith(ext)),
      isImportant: importantPaths.some(p => item.path.startsWith(p)),
      priority: 0
    }));

  files.forEach(file => {
    if (file.isConfig) file.priority += 100;
    if (file.isImportant) file.priority += 50;
    if (file.name.toLowerCase().includes('index')) file.priority += 30;
    if (file.name.toLowerCase().includes('main')) file.priority += 30;
    if (file.name.toLowerCase().includes('app')) file.priority += 20;
    if (file.isCode) file.priority += 10;
  });

  return files
    .filter(f => f.priority > 0)
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 15);
};

export const analyzeRepository = async (req, res) => {
  try {
    const { repoUrl } = req.body;

    if (!repoUrl) {
      return res.status(400).json({ error: 'Repository URL is required' });
    }

    // Parse GitHub URL
    const urlParts = repoUrl.replace('https://github.com/', '').split('/');
    const owner = urlParts[0];
    const repo = urlParts[1];

    if (!owner || !repo) {
      return res.status(400).json({ error: 'Invalid GitHub URL format' });
    }

    console.log(`📥 Analyzing: ${owner}/${repo}`);

    // Create Octokit instance with current env token
    const octokit = getOctokit();

    // STEP 1: Get default branch
    const { data: repoData } = await octokit.request('GET /repos/{owner}/{repo}', {
      owner,
      repo,
    });
    const defaultBranch = repoData.default_branch;
    console.log(`✅ Default branch: ${defaultBranch}`);

    // STEP 2: Fetch README
    let readmeContent = '';
    try {
      const readmeData = await octokit.request('GET /repos/{owner}/{repo}/readme', {
        owner,
        repo,
        headers: { 'X-GitHub-Api-Version': '2022-11-28' }
      });
      readmeContent = Buffer.from(readmeData.data.content, 'base64').toString('utf-8');
      console.log('✅ README fetched');
    } catch (error) {
      console.log('⚠️  No README found');
    }

    // STEP 3: Fetch languages
    const languagesData = await octokit.request('GET /repos/{owner}/{repo}/languages', {
      owner,
      repo,
    });
    const languages = Object.keys(languagesData.data);
    console.log('✅ Languages:', languages);

    // STEP 4: Get entire file tree (recursive)
    const { data: treeData } = await octokit.request('GET /repos/{owner}/{repo}/git/trees/{tree_sha}', {
      owner,
      repo,
      tree_sha: defaultBranch,
      recursive: 'true',
    });

    console.log(`✅ Found ${treeData.tree.length} total files in repo`);

    // STEP 5: Filter important files
    const importantFiles = getImportantFiles(treeData.tree);
    console.log(`✅ Selected ${importantFiles.length} important files to analyze`);

    // STEP 6: Fetch file contents
    const fileContents = {};
    
    for (const file of importantFiles) {
      try {
        const { data: blob } = await octokit.request('GET /repos/{owner}/{repo}/git/blobs/{file_sha}', {
          owner,
          repo,
          file_sha: file.url.split('/').pop(),
        });

        const content = Buffer.from(blob.content, 'base64').toString('utf-8');
        fileContents[file.path] = content.substring(0, 2000);
        console.log(`✅ Fetched: ${file.path} (priority: ${file.priority})`);
      } catch (error) {
        console.log(`⚠️  Could not fetch ${file.path}`);
      }
    }

    // STEP 7: Send to AI for analysis (CHANGED PORT TO 5001)
    console.log('🤖 Sending to AI for analysis...');
    
    const aiResponse = await axios.post('http://localhost:5001/analyze-repo', {
      owner,
      repo,
      languages,
      readme: readmeContent.substring(0, 3000),
      files: fileContents
    });

    const aiAnalysis = aiResponse.data.analysis;
    console.log('✅ AI analysis received');

    // STEP 8: Prepare final response
    const analysisData = {
      owner,
      repo,
      repoUrl,
      readme: readmeContent.substring(0, 3000),
      languages,
      files: fileContents,
      fileCount: Object.keys(fileContents).length,
      aiAnalysis: aiAnalysis, // Include AI-generated keywords and description
      timestamp: new Date().toISOString(),
    };

    console.log('✅ Analysis complete -', analysisData.fileCount, 'files analyzed');

    res.json({
      success: true,
      message: 'Repository analyzed successfully',
      data: analysisData,
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.status === 404) {
      return res.status(404).json({ error: 'Repository not found' });
    }
    if (error.status === 403) {
      return res.status(403).json({ error: 'GitHub API rate limit exceeded or invalid token' });
    }
    
    res.status(500).json({ 
      error: 'Failed to analyze repository',
      details: error.message 
    });
  }
};

export const checkRateLimit = async (req, res) => {
  try {
    // Create Octokit instance with current env token
    const octokit = getOctokit();
    const { data } = await octokit.request('GET /rate_limit');
    
    res.json({
      core: {
        limit: data.resources.core.limit,
        remaining: data.resources.core.remaining,
        reset: new Date(data.resources.core.reset * 1000).toLocaleString(),
      },
      message: data.resources.core.remaining === 0 
        ? '⚠️  Rate limit exhausted! Wait until reset time.'
        : '✅ You have API calls remaining'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};