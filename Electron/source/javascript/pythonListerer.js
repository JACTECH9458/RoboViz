const { ipcRenderer } = require('electron');

let tableData = [];  // Store all the team data
let sortDirection = {};  // Track sort order for each column

// Load saved data into the table
ipcRenderer.on('load-saved-data', (event, teams) => {
    teams.forEach(team => {
        tableData.push(team);  // Store team data
        displayDataInTable(team);  // Display each saved team
    });
});

// Listen for new data from Python
ipcRenderer.on('data-from-python', (event, data) => {
    if (data.team) {
        tableData.push(data.team);  // Store the new team data
        displayDataInTable(data.team);  // Display the new team data
    }
});

// Function to display data in the table
function displayDataInTable(team) {
    const output = document.getElementById('output');
    const header = document.getElementById('table-header').querySelector('tr');

    // Define which keys to include
    const keysToInclude = [
        'team', 'name', 'state', 'country', 
        'rookie_year', 'wins', 'losses', 
        'winrate', 'full_wins', 'full_losses', 'full_winrate'
    ];

    // Skip if any values are undefined or blank
    if (keysToInclude.some(key => team[key] === undefined || team[key] === '')) {
        return; // Skip displaying this team
    }

    // Create headers only if they are not already created
    if (header.children.length === 0) {
        keysToInclude.forEach(key => {
            const headerCell = document.createElement('th');
            headerCell.textContent = key;
            headerCell.classList.add('sortable'); // Add sortable class for styling
            headerCell.onclick = () => sortTable(key); // Call sort function
            header.appendChild(headerCell);
        });
    }

    // Create a row for the team's data
    const valueRow = document.createElement('tr');
    keysToInclude.forEach(key => {
        const cell = document.createElement('td');
        cell.textContent = team[key]; // Use only the selected keys
        valueRow.appendChild(cell);
    });

    output.appendChild(valueRow);
}


// Function to sort the table by column
function sortTable(columnKey) {
    // Toggle sorting direction
    if (!sortDirection[columnKey] || sortDirection[columnKey] === 'desc') {
        sortDirection[columnKey] = 'asc'; // Set to ascending
    } else {
        sortDirection[columnKey] = 'desc'; // Set to descending
    }

    // Clear existing sorting classes from all headers
    const headers = document.querySelectorAll('#table-header th');
    headers.forEach(header => {
        header.classList.remove('sort-asc', 'sort-desc');
    });

    // Add the appropriate sorting class to the clicked header
    const clickedHeader = [...headers].find(header => header.textContent === columnKey);
    if (clickedHeader) {
        clickedHeader.classList.add(sortDirection[columnKey] === 'asc' ? 'sort-asc' : 'sort-desc');
    }

    // Sort the teams based on the selected column
    const sortedTeams = [...tableData].sort((a, b) => {
        const valueA = a[columnKey];
        const valueB = b[columnKey];

        // Handle numeric sorting if applicable
        const comparison = (typeof valueA === 'number' && typeof valueB === 'number')
            ? valueA - valueB
            : String(valueA).localeCompare(String(valueB));

        return sortDirection[columnKey] === 'asc' ? comparison : -comparison;
    });

    // Clear the table and re-display sorted data
    const output = document.getElementById('output');
    output.innerHTML = ''; // Clear existing rows
    sortedTeams.forEach(team => displayDataInTable(team)); // Re-display sorted teams
}
