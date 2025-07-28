const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const versionsFile = path.join(__dirname, '..', 'versions.json');
const versionedDocsDir = path.join(__dirname, '..', 'versioned_docs');

if (fs.existsSync(versionedDocsDir)) {
  fs.rmSync(versionedDocsDir, { recursive: true });
}
fs.mkdirSync(versionedDocsDir);

// Get branches (filtering out HEAD and main)
const branches = execSync('git branch -r --format="%(refname:short)"', { encoding: 'utf-8' })
  .split('\n')
  .map(b => b.trim().replace(/^origin\//, ''))
  .filter(b => b && !['HEAD', 'main'].includes(b));

branches.forEach(branch => {
  console.log(`Fetching docs for ${branch}...`);
  const tempDir = path.join(__dirname, '..', `.tmp-${branch}`);
  fs.rmSync(tempDir, { recursive: true, force: true });
  fs.mkdirSync(tempDir);

  execSync(`git worktree add ${tempDir} origin/${branch}`);
  const docsSrc = path.join(tempDir, 'docs');
  const docsDest = path.join(versionedDocsDir, branch);
  fs.cpSync(docsSrc, docsDest, { recursive: true });

  execSync(`git worktree remove ${tempDir}`);
});

fs.writeFileSync(versionsFile, JSON.stringify(branches, null, 2));
console.log('Versions built:', branches);
