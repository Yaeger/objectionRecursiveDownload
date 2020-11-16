// Global Variables Setup
const fs = require("fs");
var appName = new String;
var device = new String;
var localBasePath = new String;
var directoryList = new Array;
var directoryAppDelimeter = new String;
var objectionOptions = new String;

// Command Line argument Processing
for (let j = 0; j < process.argv.length; j++) {  
    if (process.argv[j] == "-j") { 
        if (process.argv[j+1]) {
            objectionOptions = process.argv[j+1];
        } else {
            console.log(`Usage: node dl.js [options]`);
            console.log();
            console.log(`This script wraps the objection tool from sensepost to recursively download application files from a connected device.`);
            console.log();
            console.log(`Options:`);
            console.log(`                -j --gadget option passed to objection`);
            console.log();
            console.log(`Example: node dl.js -j '--gadget "App Name"'`);
            console.log();
            console.log(`                -i dynamic ios injection suppoort`);
            process.exit();
        }
    } else if (process.argv[j] == "-i") {
            objectionOptions = "";
    } else if (process.argv[j] == "-h") {
        console.log(`Usage: node dl.js [options]`);
        console.log();
        console.log(`This script wraps the objection tool from sensepost to recursively download application files from a connected device.`);
        console.log();
        console.log(`Options:`);
        console.log(`                -j --gadget option passed to objection`);
        console.log();
        console.log(`Example: node dl.js -j '--gadget "App Name"'`);
        console.log();
        console.log(`                -i dynamic ios injection suppoort`);
        process.exit();
    }
}

// Query device and set variables and initial application search path
var initialize = async () => {
    console.log(`Seeding the initial recursive search....`);
        
    // Query Device Information
    var deviceTypeResults = await executeCMD(`objection ${objectionOptions} device-type`);
    var deviceEnvResults = await executeCMD(`objection ${objectionOptions} run env`);
    appName = deviceTypeResults.match(/Name.*/g)[0].split(' ')[1];
    var system = deviceTypeResults.match(/System.*/g)[0].split(' ')[1]; 

    console.log(`Applicaiton Name: ${appName}`);
    console.log(`Device Type: ${device}`);
    console.log(``);

    if (system == "iOS") { 
        device = "iOS"; 
        directoryAppDelimeter = deviceEnvResults.match(/.*LibraryDirectory.*/g)[0].match(/\/.*$/)[0].split('\/Library')[0].split('\/Application\/')[1]
        addDir(deviceEnvResults.match(/.*LibraryDirectory.*/g)[0].match(/\/.*$/)[0].split('Library')[0]);
    } else { 
        device = "android";
        directoryAppDelimeter = appName;
        addDir("/data/user/0/" + directoryAppDelimeter);
    }

    localBasePath = `./${appName}-${device}/`;
    await createDir(localBasePath);
}

// List device directory and call createDir or downloadFile for eash item listed. Then call addDir for any directories.
var processDir = async (directory) => {
    if ( !directory.match(/.*\/$/) ) { directory = directory + "/"; }
    const { exec } = require('child_process');
    console.log(``);
    console.log(`Processing App Directory: ${directory} (Count: ${directoryList.length})`);
    var listDirectoryResults = await executeCMD(`objection ${objectionOptions} run ls ${directory}`);

    var list = listDirectoryResults.split("\n") 

    for (var i=0; i<list.length; i++) { 
        var v = list[i];
        var object = v.split(/\s+/)[0];
        var objectName =v.split(/\s+/)[v.split(/\s+/).length-1];
        if (object.match(/^(Directory|File|Regular)$/)) {
            if (objectName.match(/.*(frida-gadget|\)).*/)) { 
                console.log(` --Not Processed: ${v}`);
            } else if ( v.match(/ 0.0 /)) {
                if (object == "Regular") {object = "File";}
                console.log(` --${object} Size 0 - Not Processed: ${objectName}`); 
            } else if (object.match(/^Directory$/)) {             
                remoteDirPath = directory + objectName;
                localDirPath = `${localBasePath}${directory.split(directoryAppDelimeter)[1]}${objectName}`;
                console.log(` - DIRECTORY: ${remoteDirPath}`);
                await createDir(localDirPath);
                await addDir(remoteDirPath);
            } else if (object.match(/^(File|Regular)$/)) {
                var remoteFilePath = `${directory}${objectName}`; 
                console.log(` - FILE: ${remoteFilePath}`);
                var localFilePath = `${localBasePath}${directory.split(directoryAppDelimeter)[1]}${objectName}`;
                await downloadFile(remoteFilePath,localFilePath);
            } 
        }
    } 
    return;
}

// Create a local directory
var createDir = async (localDirectory) => {
    console.log(` -- Creating Local Directory: ${localDirectory}`);
    if (fs.existsSync(localDirectory)) { 
        console.log(` --- Local Directory Already Exists`);
    } else { 
        var createDirectoryResults = await executeCMD(`mkdir -p ${localDirectory}`);
        console.log(` --- Directory Created: ${localDirectory}`);
    }
}

// Execute a OS command
var executeCMD = (cmd) => {
    return new Promise((resolve, reject) => {
        console.log(`Executing: ${cmd}`);
        const { exec } = require('child_process');
        exec(cmd, (err, stdout, stderr) => {
            if (err) {
                // node couldn't execute the command
                console.log(`stderr: ${stderr}`);
                return reject(err);
            }

            // Debug Log Information
            //console.debug(``);
            //console.debug(`---------------------------------------------------------------------`);
            //console.debug(`stdout: ${stdout}`);
            //console.debug(`---------------------------------------------------------------------`);
            //console.debug(``);
            console.log(`Executing: ${cmd} - SUCCESS`);
            resolve(stdout);
        })
    });
}

// Add a directory to DirectoryList
var addDir = (directory) => {
    directoryList.push(directory);
    console.log(` -- Added Directory to Queue: ${directory} (Count: ${directoryList.length})`);
}

// Download a file
var downloadFile = async (remoteFile, LocalPath) => {
    console.log(` -- Downloading File - from: ${remoteFile} To: ${LocalPath}`);
    if (fs.existsSync(LocalPath)) { 
        console.log(` --- Local File Already Exists`);
    } else {
        var downloadFileResults = await executeCMD(`objection ${objectionOptions} run file download  ${remoteFile} ${LocalPath}`);
        console.log(` --- File Download Successful: ${LocalPath}`);
    }   
}

// Main Function
async function main () {
    console.log(`############## Starting Recursive Application Download ##############`);
    await initialize();

    // While a unprocessed directories exists pop a directory from the list and process it.
    while (directoryList.length > 0) {
        await processDir(directoryList.pop());
    }
    console.log(`File download complete!`);
}

main();
