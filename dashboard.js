/**
 * AxsenWebsite AI - Dashboard Logic
 * Provides real-time insights and lead management
 */

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('stats-grid')) {
        initDashboard();
    }
});

function initDashboard() {
    renderStats();
    renderRecentLeads();
    initCharts();
}

function renderStats() {
    const stats = [
        { label: 'Progetti AI Generati', value: '1,284', icon: 'fa-robot', color: 'text-cyan-400' },
        { label: 'Siti Web Attivi', value: '452', icon: 'fa-globe', color: 'text-blue-400' },
        { label: 'Lead Qualificati', value: '89%', icon: 'fa-user-check', color: 'text-green-400' },
        { label: 'Tempo Risparmiato', value: '12.4k ore', icon: 'fa-clock', color: 'text-purple-400' }
    ];

    const container = document.getElementById('stats-grid');
    if (container) {
        container.innerHTML = stats.map(stat => `
            <div class="glass-card p-6 flex items-center gap-4">
                <div class="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-2xl ${stat.color}">
                    <i class="fas ${stat.icon}"></i>
                </div>
                <div>
                    <p class="text-gray-400 text-sm">${stat.label}</p>
                    <h3 class="text-2xl font-bold">${stat.value}</h3>
                </div>
            </div>
        `).join('');
    }
}

function renderRecentLeads() {
    const leads = [
        { name: 'Marco Rossi', project: 'E-commerce Bio', status: 'Nuovo', quality: 'Alta' },
        { name: 'Elena Bianchi', project: 'Portfolio Artistico', status: 'Contattato', quality: 'Media' },
        { name: 'Studio Legale Verdi', project: 'Sito Istituzionale', status: 'Qualificato', quality: 'Alta' }
    ];

    const container = document.getElementById('recent-leads');
    if (container) {
        container.innerHTML = leads.map(lead => `
            <div class="flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/5 transition-colors">
                <div>
                    <h4 class="font-bold">${lead.name}</h4>
                    <p class="text-xs text-gray-400">${lead.project}</p>
                </div>
                <div class="text-right">
                    <span class="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">${lead.status}</span>
                    <p class="text-xs mt-1 ${lead.quality === 'Alta' ? 'text-green-400' : 'text-yellow-400'}">Qualità: ${lead.quality}</p>
                </div>
            </div>
        `).join('');
    }
}

function initCharts() {
    if (typeof Chart !== 'undefined') {
        const ctx = document.getElementById('analyticsChart')?.getContext('2d');
        if (ctx) {
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu'],
                    datasets: [{
                        label: 'Performance AI',
                        data: [65, 78, 72, 85, 82, 95],
                        borderColor: '#00f0ff',
                        backgroundColor: 'rgba(0, 240, 255, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: { display: false },
                        x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
                    }
                }
            });
        }
    }
}
