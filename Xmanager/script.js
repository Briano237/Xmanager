// Fonction pour sauvegarder les données dans le localStorage
function saveData() {
    localStorage.setItem('clientsData', JSON.stringify(clientsData));
    localStorage.setItem('chargesData', JSON.stringify(chargesData));
}

// Fonction pour charger les données depuis le localStorage
function loadData() {
    const storedClients = localStorage.getItem('clientsData');
    const storedCharges = localStorage.getItem('chargesData');
    
    if (storedClients) {
        clientsData = JSON.parse(storedClients);
        const maxId = clientsData.reduce((max, client) => Math.max(max, client.id), 0);
        nextClientId = maxId + 1;
    } else {
        clientsData = [
            { id: 1, name: "Loic", month: "janvier", subscriptionDate: "2025-01-06", contact: "690330705", amount: 10000, status: "payé", paymentDate: "2025-01-06" },
            { id: 2, name: "Cedric", month: "janvier", subscriptionDate: "2025-01-10", contact: "655282540", amount: 5000, status: "payé", paymentDate: "2025-01-10" },
            { id: 3, name: "Darel Zomloa", month: "janvier", subscriptionDate: "2025-01-15", contact: "694834094", amount: 2000, status: "en-retard", paymentDate: "" },
            { id: 4, name: "Frantz", month: "janvier", subscriptionDate: "2025-01-22", contact: "657767522", amount: 3000, status: "payé", paymentDate: "2025-01-22" },
            { id: 5, name: "Dive", month: "janvier", subscriptionDate: "2025-01-25", contact: "651111111", amount: 15000, status: "en-attente", paymentDate: "" }
        ];
    }

    if (storedCharges) {
        chargesData = JSON.parse(storedCharges);
        const maxId = chargesData.reduce((max, charge) => Math.max(max, charge.id), 0);
        nextChargeId = maxId + 1;
    } else {
        chargesData = [
            { id: 1, month: "janvier", type: "loyer", description: "Loyer bureau", amount: 50000, date: "2025-01-01" },
            { id: 2, month: "janvier", type: "salaires", description: "Salaires équipe", amount: 20000, date: "2025-01-31" }
        ];
    }
}

// Chargement des données au démarrage de l'application
let clientsData;
let chargesData;
let nextClientId = 1;
let nextChargeId = 1;

loadData();

// Fonction pour mettre à jour automatiquement les statuts des clients
function updateClientStatuses() {
    const today = new Date();
    let statusChanged = false;

    clientsData.forEach(client => {
        if (client.status !== 'payé') {
            const dueDate = new Date(client.subscriptionDate);
            dueDate.setDate(dueDate.getDate() + 30);
            
            if (today > dueDate) {
                if (client.status !== 'en-retard') {
                    client.status = 'en-retard';
                    statusChanged = true;
                }
            } else {
                if (client.status !== 'en-attente') {
                    client.status = 'en-attente';
                    statusChanged = true;
                }
            }
        }
    });

    if (statusChanged) {
        saveData();
        showNotification("Les statuts des clients ont été mis à jour.", "info");
    }
}

// Fonction pour marquer un client comme payé
function markAsPaid(clientId) {
    const client = clientsData.find(c => c.id === clientId);
    if (client) {
        client.status = 'payé';
        client.paymentDate = new Date().toISOString().split('T')[0];
        // MODIFICATION : Mise à jour de la date de souscription pour le prochain cycle
        client.subscriptionDate = client.paymentDate;
        saveData();
        showNotification('Statut du client mis à jour : Payé !');
        updateDashboard();
        renderClientsTable();
        renderPaymentsTable();
    }
}


// Fonction pour afficher une notification
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = 'notification show ' + type;
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Fonction pour gérer les onglets
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');
    document.querySelector(`.tab[onclick="switchTab('${tabName}')"]`).classList.add('active');
}

// Fonction pour ouvrir les modales
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
    if (modalId === 'addPayment') {
        const clientSelect = document.getElementById('paymentClient');
        clientSelect.innerHTML = clientsData.map(client => `<option value="${client.id}">${client.name}</option>`).join('');
    }
}

// Fonction pour fermer les modales
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Rendu des tableaux
function renderClientsTable() {
    const tableBody = document.querySelector("#clientsTable tbody");
    if (!tableBody) return;
    tableBody.innerHTML = '';
    
    const filteredClients = clientsData.filter(c => {
        const searchInput = document.getElementById('clientSearch').value.toLowerCase();
        const statusFilter = document.getElementById('clientStatusFilter').value;
        const searchMatch = c.name.toLowerCase().includes(searchInput) || c.contact.includes(searchInput);
        const statusMatch = statusFilter === 'all' || c.status === statusFilter;
        return searchMatch && statusMatch;
    });

    filteredClients.forEach(client => {
        const row = tableBody.insertRow();
        const daysRemaining = Math.ceil((new Date(client.subscriptionDate).getTime() + 30 * 24 * 60 * 60 * 1000 - new Date().getTime()) / (1000 * 3600 * 24));
        const statusClass = client.status === 'payé' ? 'status-paid' : client.status === 'en-retard' ? 'status-late' : 'status-pending';

        let actionButtons = `<button class="btn btn-edit" onclick="editClient(${client.id})">Modifier</button>
                             <button class="btn btn-delete" onclick="deleteClient(${client.id})">Supprimer</button>`;
        
        // Ajout du bouton "Marquer comme payé" si le statut n'est pas "payé"
        if (client.status !== 'payé') {
            actionButtons = `<button class="btn btn-paid" onclick="markAsPaid(${client.id})">Marquer comme payé</button>` + actionButtons;
        }

        row.innerHTML = `
            <td>${client.name}</td>
            <td>${client.month}</td>
            <td>${client.subscriptionDate}</td>
            <td>${new Date(new Date(client.subscriptionDate).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}</td>
            <td>${client.contact}</td>
            <td>${client.amount.toLocaleString()}</td>
            <td><span class="status-badge ${statusClass}">${client.status}</span></td>
            <td>${actionButtons}</td>
        `;
    });
}

function renderPaymentsTable() {
    const tableBody = document.querySelector("#paymentsTable tbody");
    if (!tableBody) return;
    tableBody.innerHTML = '';
    
    const filteredPayments = clientsData.filter(p => {
        const monthFilter = document.getElementById('paymentMonthFilter').value;
        const statusFilter = document.getElementById('paymentStatusFilter').value;
        return (monthFilter === 'all' || p.month === monthFilter) && (statusFilter === 'all' || p.status === statusFilter);
    });

    filteredPayments.forEach(payment => {
        const row = tableBody.insertRow();
        const statusClass = payment.status === 'payé' ? 'status-paid' : payment.status === 'en-retard' ? 'status-late' : 'status-pending';
        row.innerHTML = `
            <td>${payment.month}</td>
            <td>${payment.name}</td>
            <td>${payment.subscriptionDate}</td>
            <td>${payment.paymentDate || 'N/A'}</td>
            <td>${new Date(new Date(payment.subscriptionDate).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}</td>
            <td>${payment.amount.toLocaleString()}</td>
            <td><span class="status-badge ${statusClass}">${payment.status}</span></td>
            <td>
                <button class="btn btn-edit" onclick="editPayment(${payment.id})">Modifier</button>
                <button class="btn btn-delete" onclick="deletePayment(${payment.id})">Supprimer</button>
            </td>
        `;
    });
}

function renderChargesTable() {
    const tableBody = document.querySelector("#chargesTable tbody");
    if (!tableBody) return;
    tableBody.innerHTML = '';

    const monthFilter = document.getElementById('chargesMonthFilter').value;
    
    // Si le filtre est sur "tous les mois", on affiche tout, sinon on filtre par le mois sélectionné
    const filteredCharges = chargesData.filter(c => {
        return monthFilter === 'all' || c.month === monthFilter;
    });

    filteredCharges.forEach(charge => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${charge.month}</td>
            <td>${charge.type}</td>
            <td>${charge.description}</td>
            <td>${charge.amount.toLocaleString()}</td>
            <td>${charge.date}</td>
            <td>
                <button class="btn btn-edit" onclick="editCharge(${charge.id})">Modifier</button>
                <button class="btn btn-delete" onclick="deleteCharge(${charge.id})">Supprimer</button>
            </td>
        `;
    });
}

// Logique pour les boutons d'action
function deleteClient(clientId) {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
        clientsData = clientsData.filter(c => c.id !== clientId);
        showNotification('Client supprimé avec succès.');
        saveData();
        updateDashboard();
        renderClientsTable();
    }
}

function deleteCharge(chargeId) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette charge ?")) {
        chargesData = chargesData.filter(c => c.id !== chargeId);
        showNotification('Charge supprimée avec succès.');
        saveData();
        updateDashboard();
        renderChargesTable();
    }
}

function editClient(clientId) {
    const client = clientsData.find(c => c.id === clientId);
    if (!client) return;

    document.getElementById('clientForm').dataset.editId = clientId;
    document.getElementById('clientName').value = client.name;
    document.getElementById('clientContact').value = client.contact;
    document.getElementById('clientMonth').value = client.month;
    document.getElementById('subscriptionDate').value = client.subscriptionDate;
    document.getElementById('clientAmount').value = client.amount;
    document.getElementById('clientStatus').value = client.status;

    openModal('addClient');
}

function editCharge(chargeId) {
    const charge = chargesData.find(c => c.id === chargeId);
    if (!charge) return;

    document.getElementById('chargeForm').dataset.editId = chargeId;
    document.getElementById('chargeType').value = charge.type;
    document.getElementById('chargeAmount').value = charge.amount;
    document.getElementById('chargeDate').value = charge.date;
    document.getElementById('chargeDescription').value = charge.description;

    openModal('addCharge');
}

function editPayment(paymentId) {
    const payment = clientsData.find(p => p.id === paymentId);
    if (!payment) return;

    document.getElementById('paymentForm').dataset.editId = paymentId;
    document.getElementById('paymentClient').value = payment.id;
    document.getElementById('paymentMonth').value = payment.month;
    document.getElementById('paymentAmount').value = payment.amount;
    document.getElementById('paymentDate').value = payment.paymentDate || new Date().toISOString().split('T')[0];
    
    openModal('addPayment');
}

// Fonction pour le tableau de bord
function updateDashboard() {
    const currentMonthForClients = document.getElementById('monthFilter').value;
    const filteredClients = clientsData.filter(c => currentMonthForClients === 'all' || c.month === currentMonthForClients);

    const currentMonth = new Date().toLocaleString('fr-FR', { month: 'long' });
    const currentMonthCharges = chargesData.filter(c => c.month === currentMonth);
    
    const totalRevenue = filteredClients.filter(c => c.status === 'payé').reduce((sum, c) => sum + c.amount, 0);
    const totalCharges = currentMonthCharges.reduce((sum, c) => sum + c.amount, 0);
    const totalProfit = totalRevenue - totalCharges;
    const totalClients = clientsData.length;
    const lateClients = clientsData.filter(c => c.status === 'en-retard').length;

    document.getElementById('totalRevenue').textContent = `${totalRevenue.toLocaleString()} FCFA`;
    document.getElementById('totalCharges').textContent = `${totalCharges.toLocaleString()} FCFA`;
    document.getElementById('totalProfit').textContent = `${totalProfit.toLocaleString()} FCFA`;
    document.getElementById('totalClients').textContent = totalClients;
    document.getElementById('lateClients').textContent = lateClients;
    
    renderUpcomingPayments();
    updateAnalyticsCharts();
}

// Fonction pour afficher les prochains paiements
function renderUpcomingPayments() {
    const tableBody = document.querySelector("#upcomingPayments tbody");
    if (!tableBody) return;
    tableBody.innerHTML = '';
    
    const upcoming = clientsData.filter(c => {
        if (c.status === 'en-retard') return true;
        const dueDate = new Date(c.subscriptionDate);
        dueDate.setDate(dueDate.getDate() + 30);
        const today = new Date();
        const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
        return diffDays >= 0 && diffDays <= 7;
    }).sort((a, b) => {
        const dateA = new Date(a.subscriptionDate).getTime() + 30 * 24 * 60 * 60 * 1000;
        const dateB = new Date(b.subscriptionDate).getTime() + 30 * 24 * 60 * 60 * 1000;
        return dateA - dateB;
    });

    upcoming.forEach(client => {
        const row = tableBody.insertRow();
        const dueDate = new Date(new Date(client.subscriptionDate).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const today = new Date();
        const daysRemaining = Math.ceil((new Date(dueDate).getTime() - today.getTime()) / (1000 * 3600 * 24));
        
        const statusClass = client.status === 'en-retard' ? 'status-late' : 'status-pending';

        row.innerHTML = `
            <td>${client.name}</td>
            <td>${client.subscriptionDate}</td>
            <td>${dueDate}</td>
            <td>${daysRemaining >= 0 ? daysRemaining : Math.abs(daysRemaining)}</td>
            <td>${client.amount.toLocaleString()}</td>
            <td>${client.contact}</td>
            <td><span class="status-badge ${statusClass}">${client.status}</span></td>
            <td><button class="btn btn-edit" onclick="editClient(${client.id})">Modifier</button></td>
        `;
    });
}

// Déclaration des variables de graphiques
let revenueChart, clientsChart, statusChart, profitChart, chargesSummaryChart;

// Fonction pour mettre à jour TOUS les graphiques d'analyse
function updateAnalyticsCharts() {
    const monthsOrder = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
    
    // Données des revenus et des charges par mois
    const monthlyData = {};
    monthsOrder.forEach(month => {
        monthlyData[month] = { revenue: 0, charges: 0, profit: 0 };
    });

    clientsData.forEach(client => {
        if (client.status === 'payé' && monthlyData[client.month]) {
            monthlyData[client.month].revenue += client.amount;
        }
    });

    chargesData.forEach(charge => {
        if (monthlyData[charge.month]) {
            monthlyData[charge.month].charges += charge.amount;
        }
    });
    
    monthsOrder.forEach(month => {
        monthlyData[month].profit = monthlyData[month].revenue - monthlyData[month].charges;
    });

    const labels = monthsOrder;
    const revenueData = labels.map(month => monthlyData[month].revenue);
    const chargesDataPoints = labels.map(month => monthlyData[month].charges);
    const profitData = labels.map(month => monthlyData[month].profit);

    // Données des clients par statut
    const statusCounts = {
        'payé': clientsData.filter(c => c.status === 'payé').length,
        'en-attente': clientsData.filter(c => c.status === 'en-attente').length,
        'en-retard': clientsData.filter(c => c.status === 'en-retard').length
    };

    // Données pour le graphique de nombre de clients
    const clientsPerMonth = {};
    monthsOrder.forEach(month => clientsPerMonth[month] = 0);
    clientsData.forEach(client => {
        if (clientsPerMonth[client.month] !== undefined) {
            clientsPerMonth[client.month]++;
        }
    });
    const clientsDataPoints = labels.map(month => clientsPerMonth[month]);


    // Mise à jour des graphiques
    if (revenueChart) revenueChart.destroy();
    if (clientsChart) clientsChart.destroy();
    if (statusChart) statusChart.destroy();
    if (profitChart) profitChart.destroy();
    if (chargesSummaryChart) chargesSummaryChart.destroy();
    
    // On initialise les nouveaux graphiques avec les données mises à jour
    initializeRevenueChart(labels, revenueData, chargesDataPoints);
    initializeClientsChart(labels, clientsDataPoints);
    initializeStatusChart(statusCounts);
    initializeProfitChart(labels, profitData);
    initializeChargesSummaryChart();
}

// Initialisation des graphiques avec des options améliorées
function initializeRevenueChart(labels, revenueData, chargesData) {
    const ctx = document.getElementById('revenueChart').getContext('2d');
    revenueChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Revenus',
                data: revenueData,
                backgroundColor: '#00c46a',
                borderColor: '#009b53',
                borderWidth: 1,
            }, {
                label: 'Charges',
                data: chargesData,
                backgroundColor: '#f44336',
                borderColor: '#c62828',
                borderWidth: 1,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: '#a0a0a0' },
                    grid: { color: '#333' }
                },
                x: {
                    ticks: { color: '#a0a0a0' },
                    grid: { color: '#333' }
                }
            },
            plugins: {
                legend: {
                    labels: { color: '#e0e0e0' }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y.toLocaleString()} FCFA`;
                        }
                    }
                }
            }
        }
    });
}

function initializeClientsChart(labels, data) {
    const ctx = document.getElementById('clientsChart').getContext('2d');
    clientsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Nouveaux Clients',
                data: data,
                fill: false,
                borderColor: '#55b6ff',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: '#a0a0a0' },
                    grid: { color: '#333' }
                },
                x: {
                    ticks: { color: '#a0a0a0' },
                    grid: { color: '#333' }
                }
            },
            plugins: {
                legend: {
                    labels: { color: '#e0e0e0' }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y}`;
                        }
                    }
                }
            }
        }
    });
}

function initializeStatusChart(data) {
    const ctx = document.getElementById('statusChart').getContext('2d');
    statusChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Payé', 'En attente', 'En retard'],
            datasets: [{
                data: [data['payé'], data['en-attente'], data['en-retard']],
                backgroundColor: ['#00c46a', '#ff9800', '#f44336'],
                borderColor: '#1e1e1e',
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#e0e0e0' }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((sum, current) => sum + current, 0);
                            const percentage = total > 0 ? ((value / total) * 100).toFixed(2) + '%' : '0%';
                            return `${label}: ${value} (${percentage})`;
                        }
                    }
                }
            }
        }
    });
}

function initializeProfitChart(labels, data) {
    const ctx = document.getElementById('profitChart').getContext('2d');
    profitChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Bénéfice Net',
                data: data,
                backgroundColor: 'rgba(85, 182, 255, 0.2)',
                borderColor: '#55b6ff',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: '#a0a0a0' },
                    grid: { color: '#333' }
                },
                x: {
                    ticks: { color: '#a0a0a0' },
                    grid: { color: '#333' }
                }
            },
            plugins: {
                legend: {
                    labels: { color: '#e0e0e0' }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y.toLocaleString()} FCFA`;
                        }
                    }
                }
            }
        }
    });
}

function initializeChargesSummaryChart() {
    const ctx = document.getElementById('chargesSummaryChart').getContext('2d');
    
    // Déterminer le mois en cours
    const currentMonth = new Date().toLocaleString('fr-FR', { month: 'long' });
    const currentMonthCharges = chargesData.filter(c => c.month === currentMonth);
    
    // Grouper les charges par type pour le mois en cours
    const chargesByType = currentMonthCharges.reduce((acc, charge) => {
        acc[charge.type] = (acc[charge.type] || 0) + charge.amount;
        return acc;
    }, {});

    const labels = Object.keys(chargesByType);
    const data = Object.values(chargesByType);
    const backgroundColors = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
    ];
    
    chargesSummaryChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: { color: '#e0e0e0' }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((sum, current) => sum + current, 0);
                            const percentage = total > 0 ? ((value / total) * 100).toFixed(2) + '%' : '0%';
                            return `${label}: ${value.toLocaleString()} FCFA (${percentage})`;
                        }
                    }
                }
            }
        }
    });
}

// Écouteurs d'événements
document.addEventListener('DOMContentLoaded', () => {
    updateClientStatuses();
    
    // Déterminer le mois en cours et initialiser le filtre des charges
    const currentMonth = new Date().toLocaleString('fr-FR', { month: 'long' });
    const chargesMonthFilter = document.getElementById('chargesMonthFilter');
    if (chargesMonthFilter) {
        chargesMonthFilter.value = currentMonth;
    }

    document.getElementById('monthFilter').addEventListener('change', updateDashboard);
    document.getElementById('clientSearch').addEventListener('input', renderClientsTable);
    document.getElementById('clientStatusFilter').addEventListener('change', renderClientsTable);
    document.getElementById('paymentMonthFilter').addEventListener('change', renderPaymentsTable);
    document.getElementById('paymentStatusFilter').addEventListener('change', renderPaymentsTable);
    document.getElementById('chargesMonthFilter').addEventListener('change', renderChargesTable);

    document.getElementById('clientForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const editId = this.dataset.editId;
        const clientName = document.getElementById('clientName').value;
        const clientContact = document.getElementById('clientContact').value;
        const clientMonth = document.getElementById('clientMonth').value;
        const subscriptionDate = document.getElementById('subscriptionDate').value;
        const clientAmount = parseFloat(document.getElementById('clientAmount').value);
        const clientStatus = document.getElementById('clientStatus').value;

        if (editId) {
            const clientIndex = clientsData.findIndex(c => c.id == editId);
            if (clientIndex > -1) {
                clientsData[clientIndex] = {
                    ...clientsData[clientIndex],
                    name: clientName,
                    contact: clientContact,
                    month: clientMonth,
                    subscriptionDate: subscriptionDate,
                    amount: clientAmount,
                    status: clientStatus,
                };
            }
            showNotification('Client modifié avec succès.');
        } else {
            const newClient = {
                id: nextClientId++,
                name: clientName,
                contact: clientContact,
                month: clientMonth,
                subscriptionDate: subscriptionDate,
                amount: clientAmount,
                status: clientStatus,
                paymentDate: clientStatus === 'payé' ? new Date().toISOString().split('T')[0] : ""
            };
            clientsData.push(newClient);
            showNotification('Client ajouté avec succès.');
        }
        
        saveData();
        closeModal('addClient');
        updateDashboard();
        renderClientsTable();
        this.reset();
        delete this.dataset.editId;
    });

    document.getElementById('paymentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const editId = this.dataset.editId;
        const paymentClientId = document.getElementById('paymentClient').value;
        const paymentAmount = parseFloat(document.getElementById('paymentAmount').value);
        const paymentDate = document.getElementById('paymentDate').value;
        const month = new Date(paymentDate).toLocaleString('fr-FR', { month: 'long' });

        if (editId) {
            const client = clientsData.find(c => c.id == editId);
            if (client) {
                client.amount = paymentAmount;
                client.paymentDate = paymentDate;
                client.status = 'payé';
                client.subscriptionDate = paymentDate;
                client.month = month;
            }
            showNotification('Paiement modifié avec succès.');
        } else {
            const client = clientsData.find(c => c.id == paymentClientId);
            if (client) {
                client.amount = paymentAmount;
                client.paymentDate = paymentDate;
                client.status = 'payé';
                client.subscriptionDate = paymentDate;
                client.month = month;
            }
            showNotification('Paiement ajouté avec succès.');
        }

        saveData();
        closeModal('addPayment');
        updateDashboard();
        renderPaymentsTable();
        renderClientsTable();
        this.reset();
        delete this.dataset.editId;
    });
    
    document.getElementById('chargeForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const editId = this.dataset.editId;
        const type = document.getElementById('chargeType').value;
        const description = document.getElementById('chargeDescription').value;
        const amount = parseFloat(document.getElementById('chargeAmount').value);
        const date = document.getElementById('chargeDate').value;
        
        // Le mois est maintenant déterminé automatiquement
        const month = new Date(date).toLocaleString('fr-FR', { month: 'long' });

        if (editId) {
            const chargeIndex = chargesData.findIndex(c => c.id == editId);
            if (chargeIndex > -1) {
                chargesData[chargeIndex] = {
                    ...chargesData[chargeIndex],
                    type,
                    description,
                    amount,
                    date,
                    month,
                };
            }
            showNotification('Charge modifiée avec succès.');
        } else {
            const newCharge = {
                id: nextChargeId++,
                month,
                type,
                description,
                amount,
                date,
            };
            chargesData.push(newCharge);
            showNotification('Charge ajoutée avec succès.');
        }
        
        saveData();
        closeModal('addCharge');
        updateDashboard();
        renderChargesTable();
        this.reset();
        delete this.dataset.editId;
    });

    updateDashboard();
    renderClientsTable();
    renderPaymentsTable();
    renderChargesTable();
    updateAnalyticsCharts();
});

window.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
    }
});

function exportToExcel() {
    // Le code d'exportation reste inchangé
}