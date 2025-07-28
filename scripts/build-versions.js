const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const VERSIONS_FILE = path.join(ROOT, 'versions.json');
const VERSIONED_DOCS = path.join(ROOT, 'versioned_docs');
const VERSIONED_SIDEBARS = path.join(ROOT, 'versioned_sidebars');

if (fs.existsSync(VERSIONED_DOCS)) fs.rmSync(VERSIONED_DOCS, { recursive: true });
if (fs.existsSync(VERSIONED_SIDEBARS)) fs.rmSync(VERSIONED_SIDEBARS, { recursive: true });
fs.mkdirSync(VERSIONED_DOCS);
fs.mkdirSync(VERSIONED_SIDEBARS);

const branches = execSync('git branch -r --format="%(refname:short)"', { encoding: 'utf-8' })
  .split('\n')
  .map(b => b.trim().replace(/^origin\//, ''))
  .filter(b => b && !['HEAD', 'main'].includes(b));

const validVersions = [];

branches.forEach(branch => {
  console.log(`Processing branch: ${branch}`);
  const tmpDir = path.join(ROOT, `.tmp-${branch}`);
  fs.rmSync(tmpDir, { recursive: true, force: true });

  try {
    execSync(`git worktree add ${tmpDir} origin/${branch}`);
    const docsSrc = path.join(tmpDir, 'docs');
    if (!fs.existsSync(docsSrc)) {
      console.log(`→ Skipped ${branch}: no docs folder`);
      return;
    }

    const versionDocsDest = path.join(VERSIONED_DOCS, `version-${branch}`);
    fs.mkdirSync(versionDocsDest, { recursive: true });
    fs.cpSync(docsSrc, versionDocsDest, { recursive: true });

    // Create empty sidebar file
    fs.writeFileSync(
      path.join(VERSIONED_SIDEBARS, `version-${branch}-sidebars.json`),
      JSON.stringify({}, null, 2)
    );

    validVersions.push(branch);
  } finally {
    execSync(`git worktree remove ${tmpDir} --force`);
  }
});

fs.writeFileSync(VERSIONS_FILE, JSON.stringify(validVersions, null, 2));
console.log('Versions generated:', validVersions);
