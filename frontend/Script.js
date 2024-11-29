// Charger les données du tableau depuis le Local Storage au chargement de la page
window.onload = function () {
    loadTableData();
    displayConnectedUser(); // Afficher l'utilisateur connecté
};

function displayConnectedUser() {
    const nom = localStorage.getItem('nom') || 'Inconnu';
    const prenom = localStorage.getItem('prenom') || 'Inconnu';
    const connectedUserDiv = document.getElementById('connectedUser');
    connectedUserDiv.innerText = `Connecté : ${prenom} ${nom}`;
}

// Écouter l'événement de soumission du formulaire
document.getElementById('form').addEventListener('submit', function (e) {
    e.preventDefault();
    const id_piece = document.getElementById('id_piece').value;
    const continuite = document.getElementById('continuite').value;
    const temperature = document.getElementById('temperature').value;
    const maj_firmware = document.getElementById('maj_firmware').checked ? 'Oui' : 'Non';
    const nom = localStorage.getItem('nom') || 'Inconnu'; // Récupérer le nom du Local Storage ou mettre "Inconnu"
    const prenom = localStorage.getItem('prenom') || 'Inconnu'; // Récupérer le prénom du Local Storage ou mettre "Inconnu"

    // Ajouter une nouvelle ligne au tableau avec les nouvelles données
    addRowToTable(new Date().toISOString().slice(0, 10), new Date().toLocaleTimeString(), id_piece, continuite, temperature, maj_firmware, nom, prenom);

    // Sauvegarder les données dans le Local Storage
    saveTableData();

    // Réinitialiser le formulaire
    document.getElementById('form').reset();
});

// Fonction pour ajouter une ligne au tableau
function addRowToTable(date, heure, id_piece, continuite, temperature, maj_firmware, nom, prenom) {
    const tableBody = document.getElementById("tableBody");
    const newRow = tableBody.insertRow();

    newRow.insertCell(0).innerText = date; // Date actuelle ou récupérée
    newRow.insertCell(1).innerText = heure; // Heure actuelle ou récupérée
    newRow.insertCell(2).innerText = id_piece;
    newRow.insertCell(3).innerText = continuite;
    newRow.insertCell(4).innerText = temperature;
    newRow.insertCell(5).innerText = maj_firmware;
    newRow.insertCell(6).innerText = nom;
    newRow.insertCell(7).innerText = prenom;

    // Appliquer les classes pour les valeurs non conformes
    if (continuite === 'Non Conforme') {
        newRow.cells[3].classList.add('non-conforme'); // Ajout de la classe pour "Non Conforme"
    }

    if (maj_firmware === 'Non') {
        newRow.cells[5].classList.add('non-conforme'); // Ajout de la classe pour "Non" dans MAJ firmware
    }
}

function saveTableData() {
    const tableBody = document.getElementById("tableBody");
    const rows = [];

    // Récupérer chaque ligne du tableau
    for (let i = 0; i < tableBody.rows.length; i++) {
        const row = tableBody.rows[i];
        rows.push({
            date: row.cells[0].innerText,
            heure: row.cells[1].innerText,
            id_piece: row.cells[2].innerText,
            continuite: row.cells[3].innerText,
            temperature: row.cells[4].innerText,
            maj_firmware: row.cells[5].innerText,
            nom: row.cells[6].innerText,
            prenom: row.cells[7].innerText
        });
    }

    // Stocker les données dans le Local Storage
    localStorage.setItem("historiqueData", JSON.stringify(rows));
}

function loadTableData() {
    const storedData = localStorage.getItem("historiqueData");
    if (storedData) {
        const rows = JSON.parse(storedData);
        rows.forEach(row => {
            addRowToTable(row.date, row.heure, row.id_piece, row.continuite, row.temperature, row.maj_firmware, row.nom, row.prenom);
        });
    }
}

// Fonction pour effacer le tableau et le Local Storage
document.getElementById('clearButton').addEventListener('click', function () {
    const tableBody = document.getElementById("tableBody");
    while (tableBody.rows.length > 0) {
        tableBody.deleteRow(0);
    }
    localStorage.removeItem("historiqueData");
    document.getElementById('message').innerText = 'Historique effacé.';
});

// Fonction de tri des colonnes
function sortTable(columnIndex) {
    const tableBody = document.getElementById("tableBody");
    const rows = Array.from(tableBody.rows);
    const isAscending = tableBody.getAttribute('data-sort-direction') === 'asc';

    rows.sort((a, b) => {
        const cellA = a.cells[columnIndex].innerText;
        const cellB = b.cells[columnIndex].innerText;

        if (!isNaN(cellA) && !isNaN(cellB)) {
            return isAscending ? cellA - cellB : cellB - cellA;
        }
        return isAscending ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
    });

    // Réaffecter les lignes triées au tableau
    rows.forEach(row => tableBody.appendChild(row));
    tableBody.setAttribute('data-sort-direction', isAscending ? 'desc' : 'asc');
}
