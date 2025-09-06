// ===== DONNÃ‰ES INITIALES =====

// DonnÃ©es clients
let clientsData = [
    { id: 1, name: "Loic", month: "janvier", subscriptionDate: "2025-01-06", contact: "690330705", amount: 10000, status: "payÃ©", paymentDate: "2025-01-06" },
    { id: 2, name: "Cedric", month: "janvier", subscriptionDate: "2025-01-10", contact: "655282540", amount: 5000, status: "payÃ©", paymentDate: "2025-01-10" },
    { id: 3, name: "Darel Zomloa", month: "janvier", subscriptionDate: "2025-01-15", contact: "694834094", amount: 2000, status: "en-retard", paymentDate: "" },
    { id: 4, name: "Frantz", month: "janvier", subscriptionDate: "2025-01-22", contact: "657767522", amount: 3000, status: "payÃ©", paymentDate: "2025-01-22" },
    { id: 5, name: "Dive", month: "janvier", subscriptionDate: "2025-01-25", contact: "656760487", amount: 5000, status: "en-attente", paymentDate: "" },
    { id: 6, name: "William", month: "janvier", subscriptionDate: "2025-01-28", contact: "696335287", amount: 5000, status: "en-attente", paymentDate: "" },
    { id: 7, name: "Rodri", month: "fÃ©vrier", subscriptionDate: "2025-02-01", contact: "681176708", amount: 5000, status: "en-attente", paymentDate: "" },
    { id: 8, name: "Yves", month: "fÃ©vrier", subscriptionDate: "2025-02-05", contact: "678727647", amount: 5000, status: "en-attente", paymentDate: "" },
    { id: 9, name: "Asim", month: "fÃ©vrier", subscriptionDate: "2025-02-10", contact: "694344572", amount: 3000, status: "en-attente", paymentDate: "" },
    { id: 10, name: "Wadaka", month: "fÃ©vrier", subscriptionDate: "2025-02-15", contact: "679173265", amount: 10000, status: "en-attente", paymentDate: "" },
    { id: 11, name: "Ayo", month: "mars", subscriptionDate: "2025-03-01", contact: "654903046", amount: 1000, status: "en-attente", paymentDate: "" },
    { id: 12, name: "Axel", month: "mars", subscriptionDate: "2025-03-05", contact: "652735278", amount: 3000, status: "en-attente", paymentDate: "" },
    { id: 13, name: "Client Axel", month: "mars", subscriptionDate: "2025-03-10", contact: "620872817", amount: 3000, status: "en-attente", paymentDate: "" },
    { id: 14, name: "Armel", month: "mars", subscriptionDate: "2025-03-15", contact: "695323254", amount: 5000, status: "en-attente", paymentDate: "" },
    { id: 15, name: "Arnaud", month: "mars", subscriptionDate: "2025-03-20", contact: "696685562", amount: 5000, status: "en-attente", paymentDate: "" }
];

// DonnÃ©es des charges d'entreprise
let chargesData = [
    { id: 1, month: "janvier", type: "loyer", description: "Loyer du local", amount: 150000, date: "2025-01-05" },
    { id: 2, month: "janvier", type: "salaires", description: "Salaires du personnel", amount: 300000, date: "2025-01-30" },
    { id: 3, month: "janvier", type: "internet", description: "Abonnement internet", amount: 50000, date: "2025-01-10" },
    { id: 4, month: "fÃ©vrier", type: "loyer", description: "Loyer du local", amount: 150000, date: "2025-02-05" },
    { id: 5, month: "fÃ©vrier", type: "salaires", description: "Salaires du personnel", amount: 300000, date: "2025-02-28" },
    { id: 6, month: "mars", type: "loyer", description: "Loyer du local", amount: 150000, date: "2025-03-05" },
    { id: 7, month: "mars", type: "Ã©quipement", description: "Nouveau routeur", amount: 75000, date: "2025-03-15" }
];

// Variable pour stocker le prochain ID disponible
let nextClientId = 16;
let nextChargeId = 8;

// RÃ©fÃ©rences aux graphiques
let revenueChart, clientsChart, statusChart, profitChart, chargesSummaryChart;

// ===== FONCTIONS D'AFFICHAGE =====

// Fonction pour changer d'onglet
function switchTab(tabId) {
    // DÃ©sactiver tous les onglets et contenus
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Activer l'onglet et le contenu sÃ©lectionnÃ©s
    event.currentTarget.classList.add('active');
    document.getElementById(tabId).classList.add('active');
    
    // Recharger les donnÃ©es selon l'onglet
    if (tabId === 'dashboard') {
        updateDashboard();
    } else if (tabId === 'clients') {
        renderClientsTable();
    } else if (tabId === 'payments') {
        renderPaymentsTable();
    } else if (tabId === 'analytics') {
        initializeCharts();
    } else if (tabId === 'charges') {
        renderChargesTable();
        initializeChargesChart();
    }
}

// Mettre Ã  jour le tableau de bord avec les statistiques
function updateDashboard() {
    // Calculer les totaux
    const totalRevenue = clientsData.reduce((sum, client) => sum + client.amount, 0);
    const totalCharges = chargesData.reduce((sum, charge) => sum + charge.amount, 0);
    const totalProfit = totalRevenue - totalCharges;
    const totalClients = clientsData.filter(client => client.name && client.name.trim() !== '').length;
    const lateClients = clientsData.filter(client => client.status === 'en-retard').length;
    
    // Mettre Ã  jour l'affichage des statistiques
    document.getElementById('totalRevenue').textContent = totalRevenue.toLocaleString() + ' FCFA';
    document.getElementById('totalCharges').textContent = totalCharges.toLocaleString() + ' FCFA';
    document.getElementById('totalProfit').textContent = totalProfit.toLocaleString() + ' FCFA';
    document.getElementById('totalClients').textContent = totalClients;
    document.getElementById('lateClients').textContent = lateClients;
    
    // Mettre Ã  jour le tableau des prochains paiements
    renderUpcomingPayments();
}

// Afficher les prochains paiements
function renderUpcomingPayments() {
    const table = document.getElementById('upcomingPayments').querySelector('tbody');
    table.innerHTML = '';
    
    // Filtrer les clients avec des paiements Ã  venir
    const upcomingClients = clientsData.filter(client => 
        client.name && client.name.trim() !== '' && client.status !== 'payÃ©'
    );
    
    upcomingClients.forEach(client => {
        // Calculer la date d'Ã©chÃ©ance (approximative)
        let dueDate = 'N/A';
        let daysRemaining = 0;
        
        if (client.subscriptionDate) {
            const subDate = new Date(client.subscriptionDate);
            const due = new Date(subDate);
            due.setDate(due.getDate() + 30); // 30 jours d'abonnement
            dueDate = due.toISOString().split('T')[0];
            
            // Calculer les jours restants
            const today = new Date();
            daysRemaining = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
        }
        
        const row = document.createElement('tr');
        
        // DÃ©terminer la classe pour les jours restants
        let daysClass = '';
        let daysText = '';
        
        if (daysRemaining < 0) {
            daysClass = 'overdue';
            daysText = `${Math.abs(daysRemaining)} jours de retard`;
        } else if (daysRemaining === 0) {
            daysClass = 'due-soon';
            daysText = 'Aujourd\'hui';
        } else if (daysRemaining <= 7) {
            daysClass = 'due-soon';
            daysText = `${daysRemaining} jours`;
        } else {
            daysText = `${daysRemaining} jours`;
        }
        
        row.innerHTML = `
            <td>${client.name}</td>
            <td>${client.subscriptionDate || 'N/A'}</td>
            <td>${dueDate}</td>
            <td><span class="status-badge ${daysClass}">${daysText}</span></td>
            <td>${client.amount.toLocaleString()} FCFA</td>
            <td>${client.contact || 'N/A'}</td>
            <td><span class="status-badge ${getStatusClass(client.status)}">${getStatusText(client.status)}</span></td>
            <td>
                <button class="btn" onclick="markAsPaid(${client.id})">Marquer comme payÃ©</button>
            </td>
        `;
        
        table.appendChild(row);
    });
}

// Afficher le tableau des clients
function renderClientsTable() {
    const table = document.getElementById('clientsTable').querySelector('tbody');
    table.innerHTML = '';
    
    clientsData.forEach(client => {
        if (!client.name || client.name.trim() === '') return;
        
        // Calculer la date d'Ã©chÃ©ance
        let dueDate = 'N/A';
        if (client.subscriptionDate) {
            const subDate = new Date(client.subscriptionDate);
            const due = new Date(subDate);
            due.setDate(due.getDate() + 30);
            dueDate = due.toISOString().split('T')[0];
        }
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${client.name}</td>
            <td>${capitalizeFirstLetter(client.month)}</td>
            <td>${client.subscriptionDate || 'N/A'}</td>
            <td>${dueDate}</td>
            <td>${client.contact || 'N/A'}</td>
            <td>${client.amount.toLocaleString()}</td>
            <td><span class="status-badge ${getStatusClass(client.status)}">${getStatusText(client.status)}</span></td>
            <td>
                <button class="btn" onclick="editClient(${client.id})">Modifier</button>
                <button class="btn btn-delete" onclick="deleteClient(${client.id})">Supprimer</button>
            </td>
        `;
        
        table.appendChild(row);
    });
}

// Afficher le tableau des paiements
function renderPaymentsTable() {
    const table = document.getElementById('paymentsTable').querySelector('tbody');
    table.innerHTML = '';
    
    clientsData.forEach(client => {
        if (!client.name || client.name.trim() === '') return;
        
        // Calculer la date d'Ã©chÃ©ance
        let dueDate = 'N/A';
        if (client.subscriptionDate) {
            const subDate = new Date(client.subscriptionDate);
            const due = new Date(subDate);
            due.setDate(due.getDate() + 30);
            dueDate = due.toISOString().split('T')[0];
        }
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${capitalizeFirstLetter(client.month)}</td>
            <td>${client.name}</td>
            <td>${client.subscriptionDate || 'N/A'}</td>
            <td>${client.paymentDate || 'N/A'}</td>
            <td>${dueDate}</td>
            <td>${client.amount.toLocaleString()}</td>
            <td><span class="status-badge ${getStatusClass(client.status)}">${getStatusText(client.status)}</span></td>
            <td>
                <button class="btn" onclick="editClient(${client.id})">Modifier</button>
            </td>
        `;
        
        table.appendChild(row);
    });
}

// Afficher le tableau des charges d'entreprise
function renderChargesTable() {
    const table = document.getElementById('chargesTable').querySelector('tbody');
    table.innerHTML = '';
    
    chargesData.forEach(charge => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${capitalizeFirstLetter(charge.month)}</td>
            <td>${charge.type}</td>
            <td>${charge.description || 'N/A'}</td>
            <td>${charge.amount.toLocaleString()} FCFA</td>
            <td>${charge.date}</td>
            <td>
                <button class="btn btn-delete" onclick="deleteCharge(${charge.id})">Supprimer</button>
            </td>
        `;
        
        table.appendChild(row);
    });
}

// ===== FONCTIONS UTILITAIRES =====

// Obtenir la classe CSS pour le statut
function getStatusClass(status) {
    switch (status) {
        case 'payÃ©': return 'status-paid';
        case 'en-attente': return 'status-pending';
        case 'en-retard': return 'status-late';
        default: return 'status-pending';
    }
}

// Obtenir le texte pour le statut
function getStatusText(status) {
    switch (status) {
        case 'payÃ©': return 'PayÃ©';
        case 'en-attente': return 'En attente';
        case 'en-retard': return 'En retard';
        default: return 'En attente';
    }
}

// Capitaliser la premiÃ¨re lettre
function capitalizeFirstLetter(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Afficher une notification
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// ===== GESTION DES MODALS =====

// Ouvrir une modal
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
    
    // PrÃ©-remplir les listes dÃ©roulantes si nÃ©cessaire
    if (modalId === 'addPayment') {
        const clientSelect = document.getElementById('paymentClient');
        clientSelect.innerHTML = '';
        
        // Obtenir la liste des clients uniques
        const uniqueClients = [...new Set(clientsData.map(client => client.name))].filter(name => name !== '');
        
        uniqueClients.forEach(client => {
            const option = document.createElement('option');
            option.value = client;
            option.textContent = client;
            clientSelect.appendChild(option);
        });
    }
    
    // DÃ©finir la date du jour par dÃ©faut
    if (modalId === 'addClient' || modalId === 'addPayment' || modalId === 'addCharge') {
        const today = new Date().toISOString().split('T')[0];
        if (document.getElementById('subscriptionDate')) document.getElementById('subscriptionDate').value = today;
        if (document.getElementById('paymentDate')) document.getElementById('paymentDate').value = today;
        if (document.getElementById('chargeDate')) document.getElementById('chargeDate').value = today;
    }
}

// Fermer une modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    
    // RÃ©initialiser le formulaire si c'est la modal d'ajout de client
    if (modalId === 'addClient') {
        resetEditForm();
    }
}

// RÃ©initialiser le formulaire d'Ã©dition
function resetEditForm() {
    const form = document.getElementById('clientForm');
    if (form.dataset.editingId) {
        delete form.dataset.editingId;
        document.querySelector('#addClient .btn').textContent = 'Enregistrer';
    }
    form.reset();
}

// ===== ACTIONS SUR LES DONNÃ‰ES =====

// Marquer un client comme payÃ©
function markAsPaid(id) {
    const client = clientsData.find(c => c.id === id);
    if (client) {
        client.status = 'payÃ©';
        client.paymentDate = new Date().toISOString().split('T')[0];
        updateDashboard();
        renderClientsTable();
        renderPaymentsTable();
        showNotification(`Le paiement de ${client.name} a Ã©tÃ© marquÃ© comme payÃ©.`);
    }
}

// Supprimer un client
function deleteClient(id) {
    if (confirm('ÃŠtes-vous sÃ»r de vouloir supprimer ce client ?')) {
        clientsData = clientsData.filter(client => client.id !== id);
        renderClientsTable();
        renderPaymentsTable();
        updateDashboard();
        showNotification('Client supprimÃ© avec succÃ¨s.');
    }
}

// Supprimer une charge d'entreprise
function deleteCharge(id) {
    if (confirm('ÃŠtes-vous sÃ»r de vouloir supprimer cette charge ?')) {
        chargesData = chargesData.filter(charge => charge.id !== id);
        renderChargesTable();
        updateDashboard();
        initializeChargesChart();
        showNotification('Charge supprimÃ©e avec succÃ¨s.');
    }
}

// Ã‰diter un client
function editClient(id) {
    const client = clientsData.find(c => c.id === id);
    if (client) {
        // Stocker l'ID du client en cours d'Ã©dition
        document.getElementById('clientForm').dataset.editingId = id;
        
        // PrÃ©-remplir le formulaire
        document.getElementById('clientName').value = client.name;
        document.getElementById('clientContact').value = client.contact;
        document.getElementById('clientMonth').value = client.month;
        document.getElementById('subscriptionDate').value = client.subscriptionDate;
        document.getElementById('clientAmount').value = client.amount;
        document.getElementById('clientStatus').value = client.status;
        
        // Ouvrir la modal
        openModal('addClient');
        
        // Changer le texte du bouton
        document.querySelector('#addClient .btn').textContent = 'Modifier le client';
    }
}

// Exporter vers Excel
function exportToExcel() {
    // CrÃ©er un CSV simple
    let csv = 'Nom Client,Mois,Date Abonnement,Contact,Montant VersÃ©,Statut\n';
    
    clientsData.forEach(client => {
        if (client.name && client.name.trim() !== '') {
            csv += `"${client.name}",${client.month},${client.subscriptionDate || ''},${client.contact || ''},${client.amount},${client.status}\n`;
        }
    });
    
    // TÃ©lÃ©charger le fichier
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'xtrem_net_clients.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    showNotification('Export CSV tÃ©lÃ©chargÃ© avec succÃ¨s !');
}

// ===== GRAPHIQUES =====

// Initialiser les graphiques
function initializeCharts() {
    // DonnÃ©es pour les graphiques
    const months = ['Janvier', 'FÃ©vrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'AoÃ»t', 'Septembre', 'Octobre', 'Novembre', 'DÃ©cembre'];
    
    // Calculer les revenus par mois
    const revenueByMonth = months.map(month => {
        return clientsData
            .filter(client => client.month === month.toLowerCase())
            .reduce((sum, client) => sum + client.amount, 0);
    });
    
    // Calculer les charges par mois
    const chargesByMonth = months.map(month => {
        return chargesData
            .filter(charge => charge.month === month.toLowerCase())
            .reduce((sum, charge) => sum + charge.amount, 0);
    });
    
    // Calculer les bÃ©nÃ©fices par mois
    const profitByMonth = revenueByMonth.map((revenue, index) => {
        return revenue - chargesByMonth[index];
    });
    
    // Compter les clients par mois
    const clientsByMonth = months.map(month => {
        return clientsData.filter(client => client.month === month.toLowerCase()).length;
    });
    
    // Compter les statuts de paiement
    const paidCount = clientsData.filter(client => client.status === 'payÃ©').length;
    const pendingCount = clientsData.filter(client => client.status === 'en-attente').length;
    const lateCount = clientsData.filter(client => client.status === 'en-retard').length;
    
    // Graphique des revenus et charges
    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    if (revenueChart) revenueChart.destroy();
    revenueChart = new Chart(revenueCtx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'Revenus (FCFA)',
                    data: revenueByMonth,
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Charges (FCFA)',
                    data: chargesByMonth,
                    backgroundColor: 'rgba(255, 99, 132, 0.7)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Montant (FCFA)'
                    }
                }
            }
        }
    });
    
    // Graphique de rÃ©partition des clients
    const clientsCtx = document.getElementById('clientsChart').getContext('2d');
    if (clientsChart) clientsChart.destroy();
    clientsChart = new Chart(clientsCtx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [{
                label: 'Nombre de clients',
                data: clientsByMonth,
                backgroundColor: 'rgba(75, 192, 192, 0.7)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Nombre de clients'
                    }
                }
            }
        }
    });
    
    // Graphique des statuts de paiement
    const statusCtx = document.getElementById('statusChart').getContext('2d');
    if (statusChart) statusChart.destroy();
    statusChart = new Chart(statusCtx, {
        type: 'pie',
        data: {
            labels: ['PayÃ©', 'En attente', 'En retard'],
            datasets: [{
                data: [paidCount, pendingCount, lateCount],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(255, 205, 86, 0.7)',
                    'rgba(255, 99, 132, 0.7)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
    
    // Graphique d'Ã©volution des bÃ©nÃ©fices
    const profitCtx = document.getElementById('profitChart').getContext('2d');
    if (profitChart) profitChart.destroy();
    profitChart = new Chart(profitCtx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'BÃ©nÃ©fice Net (FCFA)',
                data: profitByMonth,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'BÃ©nÃ©fice Net (FCFA)'
                    }
                }
            }
        }
    });
}

// Initialiser le graphique des charges
function initializeChargesChart() {
    const months = ['Janvier', 'FÃ©vrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'AoÃ»t', 'Septembre', 'Octobre', 'Novembre', 'DÃ©cembre'];
    
    // Calculer les charges par mois
    const chargesByMonth = months.map(month => {
        return chargesData
            .filter(charge => charge.month === month.toLowerCase())
            .reduce((sum, charge) => sum + charge.amount, 0);
    });
    
    // Graphique des charges
    const chargesCtx = document.getElementById('chargesSummaryChart').getContext('2d');
    if (chargesSummaryChart) chargesSummaryChart.destroy();
    chargesSummaryChart = new Chart(chargesCtx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [{
                label: 'Charges (FCFA)',
                data: chargesByMonth,
                backgroundColor: 'rgba(255, 99, 132, 0.7)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Montant (FCFA)'
                    }
                }
            }
        }
    });
}

// ===== INITIALISATION =====

// Initialiser l'application
document.addEventListener('DOMContentLoaded', function() {
    // RÃ©initialiser le formulaire d'Ã©dition
    resetEditForm();
    
    // Initialiser le formulaire client
    document.getElementById('clientForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // RÃ©cupÃ©rer les valeurs du formulaire
        const name = document.getElementById('clientName').value;
        const contact = document.getElementById('clientContact').value;
        const month = document.getElementById('clientMonth').value;
        const subscriptionDate = document.getElementById('subscriptionDate').value;
        const amount = parseFloat(document.getElementById('clientAmount').value);
        const status = document.getElementById('clientStatus').value;
        
        // VÃ©rifier si on est en mode Ã©dition
        const editingId = this.dataset.editingId;
        
        if (editingId) {
            // Trouver le client Ã  modifier
            const clientIndex = clientsData.findIndex(c => c.id === parseInt(editingId));
            
            if (clientIndex !== -1) {
                // Mettre Ã  jour le client
                clientsData[clientIndex] = {
                    ...clientsData[clientIndex],
                    name,
                    contact,
                    month,
                    subscriptionDate,
                    amount,
                    status,
                    paymentDate: status === 'payÃ©' && !clientsData[clientIndex].paymentDate 
                        ? new Date().toISOString().split('T')[0] 
                        : clientsData[clientIndex].paymentDate
                };
                
                showNotification('Client modifiÃ© avec succÃ¨s.');
            }
            
            // Supprimer l'ID d'Ã©dition
            delete this.dataset.editingId;
            
            // RÃ©initialiser le texte du bouton
            document.querySelector('#addClient .btn').textContent = 'Enregistrer';
        } else {
            // Ajouter un nouveau client
            const newClient = {
                id: nextClientId++,
                name,
                month,
                subscriptionDate,
                contact,
                amount,
                status: status,
                paymentDate: status === 'payÃ©' ? new Date().toISOString().split('T')[0] : ''
            };
            
            clientsData.push(newClient);
            showNotification('Nouveau client ajoutÃ© avec succÃ¨s.');
        }
        
        // Fermer la modal et actualiser les donnÃ©es
        closeModal('addClient');
        updateDashboard();
        renderClientsTable();
        renderPaymentsTable();
        
        // RÃ©initialiser le formulaire
        this.reset();
    });
    
    // Initialiser le formulaire de paiement
    document.getElementById('paymentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const clientName = document.getElementById('paymentClient').value;
        const month = document.getElementById('paymentMonth').value;
        const paymentDate = document.getElementById('paymentDate').value;
        const amount = parseFloat(document.getElementById('paymentAmount').value);
        
        // Trouver le client
        const clientIndex = clientsData.findIndex(c => c.name === clientName && c.month === month);
        
        if (clientIndex !== -1) {
            // Mettre Ã  jour le client
            clientsData[clientIndex] = {
                ...clientsData[clientIndex],
                paymentDate,
                amount,
                status: 'payÃ©'
            };
            
            showNotification(`Paiement de ${clientName} enregistrÃ© avec succÃ¨s.`);
            
            // Fermer la modal et actualiser les donnÃ©es
            closeModal('addPayment');
            updateDashboard();
            renderClientsTable();
            renderPaymentsTable();
            
            // RÃ©initialiser le formulaire
            this.reset();
        } else {
            showNotification('Client non trouvÃ© pour ce mois.', 'error');
        }
    });
    
    // Initialiser le formulaire de charges
    document.getElementById('chargeForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const month = document.getElementById('chargeMonth').value;
        const type = document.getElementById('chargeType').value;
        const description = document.getElementById('chargeDescription').value;
        const amount = parseFloat(document.getElementById('chargeAmount').value);
        const date = document.getElementById('chargeDate').value;
        
        // Ajouter la charge
        const newCharge = {
            id: nextChargeId++,
            month,
            type,
            description,
            amount,
            date
        };
        
        chargesData.push(newCharge);
        showNotification('Charge ajoutÃ©e avec succÃ¨s.');
        
        // Fermer la modal et actualiser les donnÃ©es
        closeModal('addCharge');
        updateDashboard();
        renderChargesTable();
        initializeChargesChart();
        
        // RÃ©initialiser le formulaire
        this.reset();
    });
    
    // Initialiser l'affichage
    updateDashboard();
    renderClientsTable();
    renderPaymentsTable();
    renderChargesTable();
    initializeCharts();
    initializeChargesChart();
});

// Fermer les modals en cliquant Ã  l'extÃ©rieur
window.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
    }
});