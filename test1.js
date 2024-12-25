import * as XLSX from 'xlsx';
src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.0/xlsx.full.min.js"
const XLSX = require('xlsx');

function displayData(data) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Clear previous results

    if (data.length === 0) {
        resultsDiv.textContent = 'No data found in the Excel sheet.';
        return;
    }

    data.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.textContent = JSON.stringify(row); // Display each row as JSON
        resultsDiv.appendChild(rowDiv);
    });
}

function fetchExcelData() {
    src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.0/xlsx.full.min.js"
    fetch('Project_Data_4.xlsx') // Replace with your actual Excel file path
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.arrayBuffer();
        })
        .then(data => {
            const workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
            const sheetName = workbook.SheetNames[0]; // Get the first sheet
            const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

            console.log(sheetData); // Log the data to check if it's being read correctly
            displayData(sheetData);
        })
        .catch(error => console.error('Error fetching Excel file:', error));
}
/// NEW CODE
let sheetData = [];


fetch('IIT ROUND 1.xlsx')
    .then(response => response.arrayBuffer())
    .then(data => {
        const workbook = XLSX.read(data, {type: 'array'});
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        sheetData = XLSX.utils.sheet_to_json(sheet);
        populateInstituteOptions();
    });

    


function populateInstituteOptions() {
    const instituteSelect = document.getElementById('institute');
    const uniqueInstitutes = [...new Set(sheetData.map(row => row['Institute']))];

    uniqueInstitutes.forEach(institute => {
        const option = document.createElement('option');
        option.value = institute;
        option.text = institute;
        instituteSelect.appendChild(option);
    });
}

// Apply filters and display results
function applyFilters() {
    const institute = document.getElementById('institute').value;
    const quota = document.getElementById('quota').value;
    const seatType = document.getElementById('seatType').value;
    const gender = document.getElementById('gender').value;
    const rank = parseInt(document.getElementById('rank').value);

    const filteredData = sheetData.filter(row => {
        return (!institute || row['Institute'] === institute) &&
               (!quota || row['Quota'] === quota) &&
               (!seatType || row['Seat Type'] === seatType) &&
               (!gender || row['Gender'] === gender) &&
               (!isNaN(rank) ? (row['Opening Rank'] <= rank && row['Closing Rank'] >= rank) : true);
    });

    displayResults(filteredData);
}

// Display the filtered results in the table
function displayResults(data) {
    const resultsTable = document.getElementById('resultsTable');
    resultsTable.innerHTML = `
        <tr>
            <th>Institute</th>
            <th>Program</th>
            <th>Quota</th>
            <th>Seat Type</th>
            <th>Gender</th>
            <th>Opening Rank</th>
            <th>Closing Rank</th>
        </tr>
    `;

    data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row['Institute']}</td>
            <td>${row['Academic Program Name']}</td>
            <td>${row['Quota']}</td>
            <td>${row['Seat Type']}</td>
            <td>${row['Gender']}</td>
            <td>${row['Opening Rank']}</td>
            <td>${row['Closing Rank']}</td>
        `;
        resultsTable.appendChild(tr);
    });
}

// Modal functionality
const loginModal = document.getElementById("loginModal");
const signupModal = document.getElementById("signupModal");

document.getElementById("loginBtn").onclick = function() {
    loginModal.style.display = "block";
}

document.getElementById("signupBtn").onclick = function() {
    signupModal.style.display = "block";
}

document.getElementById("closeLogin").onclick = function() {
    loginModal.style.display = "none";
}

document.getElementById("closeSignup").onclick = function() {
    signupModal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target === loginModal) {
        loginModal.style.display = "none";
    }
    if (event.target === signupModal) {
        signupModal.style.display = "none";
    }
}

// Handle login
function handleLogin() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    // Add login logic here (e.g., API call, validation, etc.)
    alert(`Logged in as: ${email}`);
    loginModal.style.display = "none";
}

// Handle signup
function handleSignup() {
    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    // Add signup logic here (e.g., API call, validation, etc.)
    alert(`Signed up as: ${name}`);
    signupModal.style.display = "none";
}
