const fs = require('fs');
const path = require('path');

// Function to increment version number
function incrementVersion(version) {
    const parts = version.split('.');
    const last = parts.length - 1;
    parts[last] = (parseInt(parts[last], 10) + 1).toString();
    return parts.join('.');
}

// Function to update version in a file
function updateVersionInFile(filePath) {
    const fileContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    fileContent.version = incrementVersion(fileContent.version);
    fs.writeFileSync(filePath, JSON.stringify(fileContent, null, 2) + '\n');
    console.log(`Updated version in ${path.basename(filePath)} to ${fileContent.version}`);
}

// Paths to the files
const packagePath = path.join(__dirname, 'package.json');
const appPath = path.join(__dirname, 'app.json');

// Update versions in both files
updateVersionInFile(packagePath);

// Update version in app.json (inside expo object)
const appJson = JSON.parse(fs.readFileSync(appPath, 'utf8'));
appJson.expo.version = incrementVersion(appJson.expo.version);

// Increment Android versionCode
if (appJson.expo.android && typeof appJson.expo.android.versionCode === 'number') {
    appJson.expo.android.versionCode += 1;
    console.log(`Updated Android versionCode to ${appJson.expo.android.versionCode}`);
} else {
    console.log("Android versionCode not found or invalid in app.json");
}

fs.writeFileSync(appPath, JSON.stringify(appJson, null, 2) + '\n');