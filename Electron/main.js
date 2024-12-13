const { app, BrowserWindow, ipcMain } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');  // Import the file system module

let mainWindow;
let savedData = [];  // Array to store the team data
let lastTeamId = 0;  // Track the last processed team ID

const dataFilePath = path.join(__dirname, 'team_data.json');  // Path to save JSON data

// Load previously saved data if available
function loadSavedData() {
    if (fs.existsSync(dataFilePath)) {
        const fileData = fs.readFileSync(dataFilePath);
        const parsedData = JSON.parse(fileData);
        savedData = parsedData.teams || [];
        lastTeamId = parsedData.lastTeamId || 0;
    }
}

// Save data to a JSON file
function saveDataToFile() {
    const jsonData = {
        teams: savedData,
        lastTeamId: lastTeamId
    };
    fs.writeFileSync(dataFilePath, JSON.stringify(jsonData, null, 2));
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        icon: path.join(__dirname, 'source/icons/roboviz_icon.ico'), // Set the path to your icon
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.loadFile('source/html/index.html');

    mainWindow.maximize();
    // Send saved data to the renderer process after loading the window
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('load-saved-data', savedData);
    });

    mainWindow.on('close', () => {
        saveDataToFile();
    });
}

function startPythonStatbotics() {
    const scriptPath = path.join(__dirname, 'statboticsAPI.py');
    const pythonProcess = spawn('python', [scriptPath, lastTeamId]);  // Pass lastTeamId to Python script

    pythonProcess.stdout.on('data', (data) => {
        const output = data.toString();
        const jsonObjects = output.split('\n').filter(line => line.trim() !== '');

        jsonObjects.forEach(jsonData => {
            try {
                const parsedData = JSON.parse(jsonData);
                
                // Only push active teams and update lastTeamId
                if (parsedData.team.active) {
                    savedData.push(parsedData.team);
                    lastTeamId = parsedData.team.team;
                    
                    // Send data to the renderer to display in the table
                    mainWindow.webContents.send('data-from-python', parsedData.team);
                }
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        });
    });
}

app.whenReady().then(() => {
    loadSavedData();  // Load saved data on app start
    createWindow();
    startPythonStatbotics();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
