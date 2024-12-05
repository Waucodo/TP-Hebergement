let variableHistory = [];
let chart; // Chart.js instance

// Charger les variables de la Zone 3 depuis le backend
function loadZone3Variables() {
    fetch('http://localhost:3000/api/variables?zone=Zone 3')
        .then(response => response.json())
        .then(data => {
            const variablesTable = document.getElementById('variablesTable').getElementsByTagName('tbody')[0];
            variablesTable.innerHTML = '';

            data.forEach(variable => {
                const row = variablesTable.insertRow();

                row.innerHTML = `
                    <td>${variable.nom_variable}</td>
                    <td>${variable.adresse_ip}</td>
                    <td>${variable.unite}</td>
                    <td>${variable.seuil_alerte_min}</td>
                    <td>${variable.seuil_alerte_max}</td>
                    <td>${variable.enregistrement_modbus}</td>
                    <td>${variable.valeur ? variable.valeur : 'N/A'}</td>
                    <td>${variable.type}</td>
                    <td><button onclick="loadVariableHistory(${variable.id_variable})">Voir Historique</button></td>
                    <td><button onclick="deleteVariable(${variable.id_variable})">Supprimer</button></td>
                `;
            });
        })
        .catch(error => {
            console.error('Erreur lors du chargement des variables de la Zone 3:', error);
        });
}

// Ajouter une nouvelle variable
function addVariable() {
    const nom_variable = document.getElementById('nom_variable').value;
    const adresse_ip = document.getElementById('adresse_ip').value;
    const unite = document.getElementById('unite').value;
    const seuil_alerte_min = document.getElementById('seuil_alerte_min').value;
    const seuil_alerte_max = document.getElementById('seuil_alerte_max').value;
    const enregistrement_modbus = document.getElementById('enregistrement_modbus').value;
    const zone = document.getElementById('zone').value;
    const type = document.getElementById('type').value;

    fetch('http://localhost:3000/api/variables', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nom_variable,
            adresse_ip,
            unite,
            seuil_alerte_min,
            seuil_alerte_max,
            enregistrement_modbus,
            zone,
            type,
        }),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        loadZone3Variables(); // Recharger les variables après ajout
    })
    .catch(error => {
        console.error('Erreur lors de l\'ajout de la variable :', error);
    });
}

// Supprimer une variable
function deleteVariable(id_variable) {
    fetch(`http://localhost:3000/api/variables/${id_variable}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        loadZone3Variables(); // Recharger les variables après suppression
    })
    .catch(error => {
        console.error('Erreur lors de la suppression de la variable :', error);
    });
}

// Charger l'historique d'une variable
function loadVariableHistory(id_variable) {
    fetch(`http://localhost:3000/api/variables/${id_variable}/historique`)
        .then(response => response.json())
        .then(data => {
            variableHistory = data;
            const historiqueTable = document.getElementById('historiqueTable').getElementsByTagName('tbody')[0];
            historiqueTable.innerHTML = '';

            data.forEach(entry => {
                const row = historiqueTable.insertRow();
                row.innerHTML = `
                    <td>${entry.horodatage}</td>
                    <td>${entry.valeur}</td>
                `;
            });

            updateChart();
        })
        .catch(error => {
            console.error('Erreur lors du chargement de l\'historique de la variable:', error);
        });
}

// Mettre à jour le graphique dynamique
function updateChart() {
    const ctx = document.getElementById('variableChart').getContext('2d');
    const labels = variableHistory.map(entry => entry.horodatage);
    const data = variableHistory.map(entry => entry.valeur);

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Valeur de la variable au fil du temps',
                data: data,
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'minute'
                    }
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Exporter tout l'historique des variables de Zone 3 en CSV
function exportAllToCSV() {
    fetch('http://localhost:3000/api/variables/zone3/historique/csv')
        .then(response => {
            if (response.ok) {
                return response.blob();
            }
            throw new Error('Erreur lors de l\'exportation des données en CSV.');
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'historique_zone3.csv';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error('Erreur :', error);
        });
}

// Exporter l'historique d'une seule variable en CSV
function exportCSV() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Horodatage, Valeur\n";

    variableHistory.forEach(entry => {
        csvContent += `${entry.horodatage}, ${entry.valeur}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "historique_variable.csv");
    document.body.appendChild(link);
    link.click();
}

// Charger les variables de Zone 3 au chargement de la page
window.onload = loadZone3Variables;
