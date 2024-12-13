const toggleButton = document.getElementById('toggle-mode');

// Function to switch modes
function toggleMode() {
    const body = document.body;
    const tableContainer = document.querySelector('.table-container');

    // Toggle between light and dark modes
    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        tableContainer.classList.remove('dark-mode');
        tableContainer.classList.add('light-mode');
        localStorage.setItem('theme', 'light'); // Save preference
    } else {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        tableContainer.classList.remove('light-mode');
        tableContainer.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark'); // Save preference
    }
}

// Load saved theme on page load
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const body = document.body;
    const tableContainer = document.querySelector('.table-container');

    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        tableContainer.classList.add('dark-mode');
    } else {
        body.classList.add('light-mode');
        tableContainer.classList.add('light-mode');
    }
}

// Attach event listener to the toggle button
toggleButton.addEventListener('click', toggleMode);

// Load the theme on page load
loadTheme();