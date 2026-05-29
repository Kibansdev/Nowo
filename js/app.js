/**
 * Espacio Alvarado — App Principal
 * Panel de gestión para espacio holístico & consultorios
 */

// Simple State Store
const store = {
    currentPage: 'dashboard',
    user: {
        name: 'Sofi',
        role: 'Administradora'
    }
};

// Router / App Logic
function initApp() {
    const root = document.getElementById('app');
    render(root);
}

function render(root) {
    root.innerHTML = '';

    const mainContainer = document.createElement('div');
    mainContainer.className = 'main-container';

    // Sidebar
    mainContainer.appendChild(createSidebar());

    // Content Area
    const contentArea = document.createElement('main');
    contentArea.className = 'content-area';

    // Render Current Page
    if (store.currentPage === 'dashboard') {
        if (window.renderMarket) {
            window.renderMarket(contentArea);
        } else {
            contentArea.appendChild(createDashboard());
        }
    } else if (store.currentPage === 'assistant') {
        if (window.renderAssistant) {
            window.renderAssistant(contentArea);
        } else {
            contentArea.innerHTML = '<p>Cargando Asistente IA...</p>';
        }
    } else if (store.currentPage === 'rooms') {
        if (window.renderMarket) {
            window.renderMarket(contentArea);
        } else {
            contentArea.innerHTML = '<p>Cargando Consultorios...</p>';
        }
    } else if (store.currentPage === 'workshops') {
        if (window.renderWorkshops) {
            window.renderWorkshops(contentArea);
        } else {
            contentArea.innerHTML = '<p>Cargando Talleres...</p>';
        }
    } else if (store.currentPage === 'professionals') {
        if (window.renderNUWOConnect) {
            window.renderNUWOConnect(contentArea);
        } else {
            contentArea.innerHTML = '<p>Cargando Profesionales...</p>';
        }
    } else if (store.currentPage === 'activity') {
        if (window.renderActivity) {
            window.renderActivity(contentArea);
        } else {
            contentArea.innerHTML = '<p>Cargando Consultorios...</p>';
        }
    } else if (store.currentPage === 'analytics') {
        if (window.renderAnalytics) {
            window.renderAnalytics(contentArea);
        } else {
            contentArea.innerHTML = '<p>Cargando Finanzas...</p>';
        }
    }

    mainContainer.appendChild(contentArea);
    root.appendChild(mainContainer);
}

function createSidebar() {
    const sidebar = document.createElement('aside');
    sidebar.className = 'sidebar';

    // Logo Espacio Alvarado
    const logoWrap = document.createElement('div');
    logoWrap.className = 'sidebar-logo';
    logoWrap.innerHTML = `
      <div class="logo-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="9" stroke="white" stroke-width="1.5" fill="none" opacity="0.9"/>
          <path d="M12 6 C12 6 8 10 8 13 C8 15.2 9.8 17 12 17 C14.2 17 16 15.2 16 13 C16 10 12 6 12 6Z" fill="white" opacity="0.85"/>
          <circle cx="12" cy="13" r="2" fill="#7A8B6F"/>
        </svg>
      </div>
      <div class="sidebar-logo-text">
        <span class="logo-brand">Espacio Alvarado</span>
        <span class="logo-sub">Holístico</span>
      </div>
    `;
    sidebar.appendChild(logoWrap);

    const nav = document.createElement('nav');

    // Section label
    const label = document.createElement('div');
    label.className = 'nav-section-label';
    label.textContent = 'Gestión';
    label.style.marginTop = '4px';
    nav.appendChild(label);

    const items = [
        { id: 'dashboard',     label: 'Inicio',         icon: 'home' },
        { id: 'assistant',     label: 'Asistente IA',   icon: 'message-circle' },
        { id: 'activity',      label: 'Consultorios',   icon: 'grid' },
        { id: 'workshops',     label: 'Talleres',       icon: 'calendar' },
        { id: 'professionals', label: 'Profesionales',  icon: 'activity' },
        { id: 'analytics',     label: 'Finanzas',       icon: 'dollar-sign' }
    ];

    items.forEach(item => {
        const btn = document.createElement('button');
        const iconHtml = window.getIcon ? window.getIcon(item.icon, 'currentColor', 18) : '';
        btn.innerHTML = `${iconHtml} <span>${item.label}</span>`;
        btn.className = `nav-item ${store.currentPage === item.id ? 'active' : ''}`;
        btn.onclick = () => {
            store.currentPage = item.id;
            render(document.getElementById('app'));
        };
        nav.appendChild(btn);
    });

    sidebar.appendChild(nav);

    // Assistance Button at the bottom
    const panicBtn = document.createElement('button');
    const bellIcon = window.getIcon ? window.getIcon('bell', '#9BAF93', 18) : '';
    panicBtn.innerHTML = `${bellIcon} <span>Asistencia</span>`;
    panicBtn.className = 'nav-item';
    panicBtn.style.marginTop = 'auto';
    panicBtn.style.color = 'rgba(255,255,255,0.4)';
    panicBtn.style.border = '1px solid rgba(255,255,255,0.12)';
    panicBtn.style.justifyContent = 'center';

    panicBtn.onclick = () => {
        if (window.renderPanicModal) {
            window.renderPanicModal();
        } else {
            alert('Cargando módulo de asistencia...');
        }
    };

    sidebar.appendChild(panicBtn);

    return sidebar;
}

function createDashboard() {
    const div = document.createElement('div');
    div.innerHTML = `
    <div class="dashboard-header">
      <div>
        <h1>Bienvenida, ${store.user.name}</h1>
        <p class="dashboard-subtitle">Espacio holístico & consultorios · Alvarado</p>
      </div>
    </div>
    <div class="smart-widgets-area"></div>
    
    <div class="dashboard-grid">
      <div class="card">
        <h3>Resumen del día</h3>
        <p style="color: var(--color-text-secondary); line-height: 1.7;">
          Hoy tenés <strong>12 turnos</strong> programados en 4 consultorios.<br>
          El bot agendó <strong>3 turnos nuevos</strong> esta mañana.<br>
          <strong>2 consultorios</strong> están ocupados ahora.
        </p>
      </div>
      <div class="card">
        <h3>Profesionales interesados</h3>
        <p style="color: var(--color-text-secondary); line-height: 1.7;">
          <strong>3 profesionales</strong> nuevos se contactaron vía el bot.<br>
          <span style="color: var(--color-accent);">→ Revisalos en la sección Profesionales</span>
        </p>
      </div>
    </div>
  `;

    setTimeout(() => {
        if (window.renderSmartWidgets) {
            window.renderSmartWidgets(div.querySelector('.smart-widgets-area'));
        }
    }, 0);

    return div;
}

// Initialize on load with dynamic data loading
document.addEventListener('DOMContentLoaded', async () => {
    if (window.loadDataFromServer) {
        await window.loadDataFromServer();
    }
    initApp();
});
