const { app, BrowserWindow, ipcMain } = require('electron');
const { spawn } = require('child_process');
const path = require('path');

let mainWindow; // Declare mainWindow in a scope accessible to all functions

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,    // Width of the window
    height: 600,   // Height of the window
    webPreferences: {
      nodeIntegration: true,  // Enable Node.js integration
      contextIsolation: false, // Disable context isolation for simplicity
    },
  });

  // Load a URL or HTML file into the window.
  mainWindow.loadFile('source/html/index.html'); // Replace with your HTML file

  // Start the Python server after the window is created
  startPythonStatbotics();
}

// Function to start the Python server
function startPythonStatbotics() {
  // Path to your Python script using __dirname
  const scriptPath = path.join(__dirname, 'statboticsAPI.py'); // Replace with the actual path

  // Spawn the Python process
  const pythonProcess = spawn("python", [scriptPath]);

  // Handle data from the Python process
  pythonProcess.stdout.on('data', (data) => {
    const output = data.toString(); // Convert Buffer to String
    try {
      const jsonData = JSON.parse(output); // Parse JSON data
      // Check if mainWindow is defined before sending data
      if (mainWindow) {
        mainWindow.webContents.send('data-from-python', jsonData); // Send data to renderer process
      } else {
        console.error('mainWindow is not defined yet.');
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
  });

  // Handle any error output from the Python process
  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  // Log when the Python process exits
  pythonProcess.on('close', (code) => {
    console.log(`Python process exited with code ${code}`);
  });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Re-create a window in the app when the dock icon is clicked (macOS specific)
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
