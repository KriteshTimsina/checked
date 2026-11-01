const fs = require('fs');
const path = require('path');

function patchFile(relativePath, replacements) {
  const fullPath = path.join(__dirname, '..', relativePath);
  if (!fs.existsSync(fullPath)) return;
  let content = fs.readFileSync(fullPath, 'utf8');
  let changed = false;
  for (const [target, replacement] of replacements) {
    if (content.includes(target) && !content.includes(replacement)) {
      content = content.replace(target, replacement);
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Patched ${relativePath}`);
  }
}

patchFile('node_modules/@expo/cli/build/src/start/doctor/apple/SimulatorAppPrerequisite.js', [
  [
    `async function getSimulatorAppIdAsync() {
    try {
        return (await (0, _osascript().execAsync)('id of app "Simulator"')).trim();
    } catch  {
    // This error may occur in CI where the users intends to install just the simulators but no Xcode.
    }
    return null;
}`,
    `async function getSimulatorAppIdAsync() {
    for (const appName of ['Simulator', 'DeviceHub']) {
        try {
            return (await (0, _osascript().execAsync)(\`id of app "\${appName}"\`)).trim();
        } catch  {
        // This error may occur in CI where the users intends to install just the simulators but no Xcode.
        }
    }
    return null;
}`
  ],
  [
    `if (result !== 'com.apple.iphonesimulator' && result !== 'com.apple.CoreSimulator.SimulatorTrampoline')`,
    `if (result !== 'com.apple.iphonesimulator' && result !== 'com.apple.CoreSimulator.SimulatorTrampoline' && result !== 'com.apple.dt.Devices')`
  ]
]);

patchFile('node_modules/@expo/cli/build/src/start/platforms/ios/ensureSimulatorAppRunning.js', [
  [
    `const zeroMeansNo = (await _osascript().execAsync('tell app "System Events" to count processes whose name is "Simulator"')).trim();`,
    `const zeroMeansNo = (await _osascript().execAsync('tell app "System Events" to count processes whose name is "Simulator" or name is "DeviceHub"')).trim();`
  ],
  [
    `async function openSimulatorAppAsync(device) {
    const args = [
        '-a',
        'Simulator'
    ];`,
    `async function openSimulatorAppAsync(device) {
    let appName = 'Simulator';
    try {
        await _osascript().execAsync('id of app "Simulator"');
    } catch {
        appName = 'DeviceHub';
    }
    const args = [
        '-a',
        appName
    ];`
  ]
]);

patchFile('node_modules/@expo/cli/build/src/start/platforms/ios/AppleDeviceManager.js', [
  [
    `        await _osascript().execAsync(\`tell application "Simulator" to activate\`);`,
    `        try {
            await _osascript().execAsync(\`tell application "Simulator" to activate\`);
        } catch {
            await _osascript().execAsync(\`tell application "DeviceHub" to activate\`);
        }`
  ]
]);
