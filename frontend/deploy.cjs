const { exec } = require('child_process');
const { readdir, readFile } = require('fs').promises;
const path = require('path');

const SERVER = 'root@72.60.202.218';
const REMOTE_PATH = '/var/www/schoolm/frontend/dist';
const LOCAL_DIST = path.join(__dirname, 'dist');

async function deployFiles() {
  console.log('📦 Starting deployment...\n');

  // Step 1: Clear remote dist folder
  console.log('🧹 Clearing remote dist folder...');
  await execCommand(`ssh ${SERVER} "rm -rf ${REMOTE_PATH}/* && mkdir -p ${REMOTE_PATH}/assets ${REMOTE_PATH}/images"`);

  // Step 2: Upload index.html and root files
  console.log('📄 Uploading root files...');
  const rootFiles = ['index.html', 'gentime-logo.svg', 'manifest.json', 'vite.svg'];
  for (const file of rootFiles) {
    const localFile = path.join(LOCAL_DIST, file);
    try {
      await execCommand(`scp "${localFile}" ${SERVER}:${REMOTE_PATH}/`);
      console.log(`  ✓ ${file}`);
    } catch (e) {
      console.log(`  ⚠ ${file} (not found, skipping)`);
    }
  }

  // Step 3: Upload assets folder
  console.log('\n📦 Uploading assets...');
  await execCommand(`scp -r "${LOCAL_DIST}/assets"/* ${SERVER}:${REMOTE_PATH}/assets/`);
  console.log('  ✓ All assets uploaded');

  // Step 4: Upload images folder
  console.log('\n🖼️  Uploading images...');
  await execCommand(`scp -r "${LOCAL_DIST}/images"/* ${SERVER}:${REMOTE_PATH}/images/`);
  console.log('  ✓ All images uploaded');

  // Step 5: Reload Nginx
  console.log('\n🔄 Reloading Nginx...');
  await execCommand(`ssh ${SERVER} "systemctl reload nginx"`);
  console.log('  ✓ Nginx reloaded');

  console.log('\n✅ Deployment complete!');
  console.log('🌐 Visit: https://www.schoolm.gentime.in\n');
}

function execCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error && !stderr.includes('Warning')) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
}

deployFiles().catch(err => {
  console.error('❌ Deployment failed:', err.message);
  process.exit(1);
});
