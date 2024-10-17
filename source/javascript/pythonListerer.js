const { ipcRenderer } = require('electron');

// Listen for data from the main process
ipcRenderer.on('data-from-python', (event, data) => {
    // Check if data has a team property
    if (data.team) {
        console.log('Data received from Python:', data.team);
        // Call the function to display data in the HTML table
        displayDataInTable(data.team); // Pass the single team data object
    }
});

// Function to display a single team's data in the HTML table
function displayDataInTable(team) {
    const output = document.getElementById('output');
    const header = document.getElementById('table-header').querySelector('tr');
    
    // Create headers based on the keys of the team object if it's the first team
    if (header.children.length === 0) {
        for (const key of Object.keys(team)) {
            const headerCell = document.createElement('th'); // Create a header cell for each field
            headerCell.textContent = key; // Set the header text
            header.appendChild(headerCell); // Append header cell to the header row
        }
    }

    // Create a new table row for the team values
    const valueRow = document.createElement('tr'); // Create a new table row for values

    // Create cells for each value
    for (const value of Object.values(team)) {
        const cell = document.createElement('td'); // Create a cell for the value
        cell.textContent = value; // Set the value text
        valueRow.appendChild(cell); // Append value cell to the value row
    }

    output.appendChild(valueRow); // Append the value row to the output tbody
}
