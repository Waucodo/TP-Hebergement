let variableHistory = [];
let chart; // Chart.js instance
let currentVariableName = "";

// Charger les variables de la Zone 3 depuis le backend
async function loadZone3Variables() {
    try {
        const response = await fetch('http://localhost:3000/api/variables?zone=Zone 3');
        if (!response.ok) throw new Error('Erreur lors du chargement des variables.');
        const data = await response.json();

        const variablesTable = document.getElementById('variablesTableBody');
        const alarmsList = document.getElementById('alarms-list');
        variablesTable.innerHTML = '';
        alarmsList.innerHTML = '';

        data.forEach(variable => {
            const row = variablesTable.insertRow();
            row.innerHTML = `
                <td>${variable.nom_variable}</td>
                <td>${variable.adresse_ip}</td>
                <td>${variable.unite}</td>
                <td>${variable.seuil_alerte_min ?? 'N/A'}</td>
                <td>${variable.seuil_alerte_max ?? 'N/A'}</td>
                <td>${variable.valeur_actuelle ?? 'N/A'}</td>
                <td>${variable.enregistrement_modbus}</td>
                <td><button class="btn btn-info btn-sm" onclick="loadVariableHistory(${variable.id_variable}, '${variable.nom_variable}')">Voir Historique</button></td>
                <td><button class="btn btn-danger btn-sm" onclick="deleteVariable(${variable.id_variable})">Supprimer</button></td>
            `;

            // Vérifier si c'est une alarme et l'ajouter au bandeau
            if (variable.nom_variable.toLowerCase().includes('alarme') && variable.valeur_actuelle === 0) {
                const alarmItem = document.createElement('li');
                alarmItem.textContent = `${variable.nom_variable}`;
                alarmsList.appendChild(alarmItem);
            }
        });
    } catch (error) {
        console.error('Erreur lors du chargement des variables:', error);
    }
}

// Ajouter une nouvelle variable
async function addVariable() {
    const nom_variable = document.getElementById('nom_variable').value.trim();
    const adresse_ip = document.getElementById('adresse_ip').value.trim();
    const unite = document.getElementById('unite').value.trim();
    const seuil_alerte_min = document.getElementById('seuil_alerte_min').value.trim();
    const seuil_alerte_max = document.getElementById('seuil_alerte_max').value.trim();
    const enregistrement_modbus = document.getElementById('enregistrement_modbus').value.trim();
    const type = document.getElementById('type').value;

    if (!nom_variable || !adresse_ip || !unite || !seuil_alerte_min || !seuil_alerte_max || !enregistrement_modbus || !type) {
        alert('Veuillez remplir tous les champs.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/variables', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nom_variable,
                adresse_ip,
                unite,
                seuil_alerte_min: Number(seuil_alerte_min),
                seuil_alerte_max: Number(seuil_alerte_max),
                enregistrement_modbus,
                type,
                zone: 'Zone 3'
            })
        });

        if (!response.ok) throw new Error('Erreur lors de la création de la variable.');
        alert('Variable créée avec succès.');
        loadZone3Variables(); // Recharger la liste des variables
    } catch (error) {
        console.error('Erreur lors de la création de la variable:', error);
    }
}

// Supprimer une variable
async function deleteVariable(id_variable) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette variable ?')) return;

    try {
        const response = await fetch(`http://localhost:3000/api/variables/${id_variable}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Erreur lors de la suppression de la variable.');
        alert('Variable supprimée avec succès.');
        loadZone3Variables(); // Recharger les variables après suppression
    } catch (error) {
        console.error('Erreur lors de la suppression de la variable:', error);
    }
}

// Charger l'historique d'une variable
async function loadVariableHistory(id_variable, nom_variable) {
    currentVariableName = nom_variable;
    document.getElementById('variableNameTitle').textContent = nom_variable; // Mettre à jour le titre

    try {
        const response = await fetch(`http://localhost:3000/api/variables/${id_variable}/historique`);
        if (!response.ok) throw new Error('Erreur lors du chargement de l\'historique.');
        const data = await response.json();

        variableHistory = data; // Stocker toutes les données pour le graphique et l'export

        // Mettre à jour le tableau d'historique avec les 10 dernières valeurs
        const historiqueTable = document.getElementById('historiqueTable').getElementsByTagName('tbody')[0];
        historiqueTable.innerHTML = '';
        variableHistory.slice(-10).forEach(entry => {
            const row = historiqueTable.insertRow();
            row.innerHTML = `
                <td>${new Date(entry.horodatage).toLocaleString()}</td>
                <td>${entry.valeur !== null && entry.valeur !== undefined ? entry.valeur : 'N/A'}</td>
            `;
        });

        // Mettre à jour le graphique avec toutes les valeurs
        updateChart();
    } catch (error) {
        console.error('Erreur lors du chargement de l\'historique:', error);
    }
}

// Mettre à jour le graphique
function updateChart() {
    const ctx = document.getElementById('variableChart').getContext('2d');
    const labels = variableHistory.map(entry => new Date(entry.horodatage).toLocaleString());
    const data = variableHistory.map(entry => entry.valeur);

    if (chart) {
        chart.destroy(); // Supprimer l'ancien graphique
    }

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels, // Utiliser toutes les valeurs
            datasets: [{
                label: `Valeur de la variable "${currentVariableName}"`,
                data: data, // Utiliser toutes les valeurs
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Temps'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Valeur'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            }
        }
    });
}

// Exporter toutes les valeurs en CSV
function exportCSV() {
    let csvContent = `data:text/csv;charset=utf-8,Horodatage, Valeur\n`;
    variableHistory.forEach(entry => {
        csvContent += `${entry.horodatage}, ${entry.valeur}\n`; // Inclure toutes les valeurs
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `historique_${currentVariableName}.csv`); // Ajouter le nom de la variable
    document.body.appendChild(link);
    link.click();
}

// Exporter toutes les données
async function exportAllVariables() {
    try {
        const response = await fetch('http://localhost:3000/api/variables/zone3/historique/csv');
        if (!response.ok) throw new Error('Erreur lors de l\'exportation des données.');
        const blob = await response.blob();

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'historique_zone3.csv';
        document.body.appendChild(a);
        a.click();
        a.remove();
    } catch (error) {
        console.error('Erreur lors de l\'exportation des données:', error);
    }
}

// Mise à jour automatique
function startAutoUpdate() {
    loadZone3Variables(); // Charger immédiatement
    setInterval(loadZone3Variables, 5000); // Actualiser toutes les 5 secondes
}

window.onload = startAutoUpdate;
