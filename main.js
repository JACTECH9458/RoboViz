const { app, BrowserWindow } = require('electron');

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,    // Width of the window
    height: 600,   // Height of the window
    webPreferences: {
      nodeIntegration: true,  // Enable Node.js integration
      contextIsolation: false, // Disable context isolation for simplicity
    },
  });

  // Load a URL or HTML file into the window.
  mainWindow.loadFile('source/html/index.html'); // Replace with your HTML file
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
