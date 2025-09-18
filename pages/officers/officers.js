// Officers page functionality

let currentOfficers = {};
let currentTab = 'ccf';

document.addEventListener('DOMContentLoaded', () => {
  // Check if user is logged in
  if (!localStorage.getItem('isLoggedIn')) {
    window.location.href = '../login/login.html';
    return;
  }

  // Get tab from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  currentTab = urlParams.get('tab') || 'ccf';

  // Initialize officers page
  initializeOfficers();
  setupEventListeners();
});

function initializeOfficers() {
  if (!window.officers) {
    console.error('Officers data not available');
    return;
  }

  currentOfficers = { ...window.officers };
  
  renderOfficersPage();
  updateActiveTab();
}

function renderOfficersPage() {
  const pageContent = document.getElementById('page-content');
  const officers = currentOfficers[currentTab] || [];
  
  const content = `
    <div class="page-officers">
      <div class="page-officers__tabs">
        <div class="page-officers__tab-list">
          <button class="page-officers__tab-button ${currentTab === 'ccf' ? 'active' : ''}" data-tab="ccf">CCF</button>
          <button class="page-officers__tab-button ${currentTab === 'dcf' ? 'active' : ''}" data-tab="dcf">DCF</button>
          <button class="page-officers__tab-button ${currentTab === 'acf' ? 'active' : ''}" data-tab="acf">ACF</button>
          <button class="page-officers__tab-button ${currentTab === 'rfo' ? 'active' : ''}" data-tab="rfo">RFO</button>
        </div>
      </div>

      <div class="page-officers__header">
        <h2 class="page-officers__title">${currentTab.toUpperCase()} Officers</h2>
        <button class="btn btn-primary page-officers__add-btn" id="add-officer-btn">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 5V15M5 10H15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          Add Officer
        </button>
      </div>

      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Circle</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${renderOfficersTable(officers)}
          </tbody>
        </table>
      </div>

      <!-- Mobile card view -->
      <div class="page-officers__cards">
        ${renderOfficersCards(officers)}
      </div>

      <div class="page-officers__table-actions">
        <span class="page-officers__count">${officers.length} officers</span>
      </div>
    </div>

    <!-- Modal for officer details -->
    <div id="modal-overlay" class="modal-overlay hidden" role="dialog" aria-hidden="true">
      <div class="modal-content" role="document">
        <div class="modal-header">
          <h2 class="modal-title" id="modal-title"></h2>
          <button class="modal-close" aria-label="Close modal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/>
            </svg>
          </button>
        </div>
        <div class="modal-body" id="modal-body"></div>
        <div class="modal-footer" id="modal-footer"></div>
      </div>
    </div>
  `;

  pageContent.innerHTML = content;
  setupOfficersEventListeners();
}

function setupEventListeners() {
  // Sidebar submenu toggle
  document.addEventListener('click', (e) => {
    if (e.target.closest('.submenu-toggle')) {
      e.preventDefault();
      const submenu = e.target.closest('.nav-submenu').querySelector('.submenu');
      const isVisible = submenu.style.display === 'block';
      submenu.style.display = isVisible ? 'none' : 'block';
    }
  });

  // Logout functionality
  document.querySelector('.logout-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    window.location.href = '../login/login.html';
  });
}

function setupOfficersEventListeners() {
  // Tab switching
  document.querySelectorAll('.page-officers__tab-button').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tab = e.target.dataset.tab;
      switchTab(tab);
    });
  });

  // Add officer button
  document.getElementById('add-officer-btn')?.addEventListener('click', () => {
    showToast('Add officer functionality would be implemented here', 'info');
  });

  // Modal close handlers
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay') || e.target.closest('.modal-close')) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });
}

function switchTab(tab) {
  currentTab = tab;
  
  // Update URL without page reload
  const url = new URL(window.location);
  url.searchParams.set('tab', tab);
  window.history.replaceState({}, '', url);
  
  // Update page title
  document.getElementById('page-title').textContent = `Officers - ${tab.toUpperCase()}`;
  
  // Re-render content
  renderOfficersPage();
  updateActiveTab();
}

function updateActiveTab() {
  // Update sidebar navigation
  document.querySelectorAll('#nav-ccf, #nav-dcf, #nav-acf, #nav-rfo').forEach(link => {
    link.removeAttribute('aria-current');
  });
  
  const activeNavLink = document.getElementById(`nav-${currentTab}`);
  if (activeNavLink) {
    activeNavLink.setAttribute('aria-current', 'page');
  }
}

function renderOfficersTable(officers) {
  if (officers.length === 0) {
    return `
      <tr>
        <td colspan="7" class="page-officers__empty">
          <div class="page-officers__empty-icon">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="currentColor">
              <path d="M32 8C40.84 8 48 15.16 48 24C48 32.84 40.84 40 32 40C23.16 40 16 32.84 16 24C16 15.16 23.16 8 32 8ZM32 16C27.58 16 24 19.58 24 24C24 28.42 27.58 32 32 32C36.42 32 40 28.42 40 24C40 19.58 36.42 16 32 16ZM32 44C23.16 44 8 48.42 8 56V60H56V56C56 48.42 40.84 44 32 44Z"/>
            </svg>
          </div>
          <h3>No officers found</h3>
          <p>No officers are currently assigned to this category.</p>
        </td>
      </tr>
    `;
  }

  return officers.map(officer => `
    <tr data-id="${officer.id}">
      <td>${officer.id}</td>
      <td>${officer.name}</td>
      <td>${officer.circle}</td>
      <td>${officer.email}</td>
      <td>${officer.phone}</td>
      <td class="page-officers__status-cell">
        <label class="toggle-switch">
          <input type="checkbox" ${officer.status === 'Active' ? 'checked' : ''} onchange="toggleOfficerStatus('${officer.id}')">
          <span class="toggle-slider"></span>
        </label>
      </td>
      <td>
        <div class="page-officers__action-buttons">
          <button class="btn btn-sm btn-secondary page-officers__action-btn" onclick="viewOfficer('${officer.id}')" aria-label="View officer ${officer.name}">View</button>
          <button class="btn btn-sm btn-secondary page-officers__action-btn" onclick="editOfficer('${officer.id}')" aria-label="Edit officer ${officer.name}">Edit</button>
          <button class="btn btn-sm btn-danger page-officers__action-btn" onclick="deleteOfficer('${officer.id}')" aria-label="Delete officer ${officer.name}">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function renderOfficersCards(officers) {
  if (officers.length === 0) {
    return `
      <div class="page-officers__empty">
        <div class="page-officers__empty-icon">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="currentColor">
            <path d="M32 8C40.84 8 48 15.16 48 24C48 32.84 40.84 40 32 40C23.16 40 16 32.84 16 24C16 15.16 23.16 8 32 8ZM32 16C27.58 16 24 19.58 24 24C24 28.42 27.58 32 32 32C36.42 32 40 28.42 40 24C40 19.58 36.42 16 32 16ZM32 44C23.16 44 8 48.42 8 56V60H56V56C56 48.42 40.84 44 32 44Z"/>
          </svg>
        </div>
        <h3>No officers found</h3>
        <p>No officers are currently assigned to this category.</p>
      </div>
    `;
  }

  return officers.map(officer => `
    <div class="page-officers__card" data-id="${officer.id}">
      <div class="page-officers__card-header">
        <div>
          <div class="page-officers__card-name">${officer.name}</div>
          <div class="page-officers__card-circle">${officer.circle}</div>
        </div>
        <label class="toggle-switch">
          <input type="checkbox" ${officer.status === 'Active' ? 'checked' : ''} onchange="toggleOfficerStatus('${officer.id}')">
          <span class="toggle-slider"></span>
        </label>
      </div>
      
      <div class="page-officers__card-info">
        <div class="page-officers__card-field">
          <div class="page-officers__card-label">Email</div>
          <div class="page-officers__card-value">${officer.email}</div>
        </div>
        <div class="page-officers__card-field">
          <div class="page-officers__card-label">Phone</div>
          <div class="page-officers__card-value">${officer.phone}</div>
        </div>
      </div>
      
      <div class="page-officers__card-actions">
        <button class="btn btn-sm btn-secondary" onclick="viewOfficer('${officer.id}')">View</button>
        <button class="btn btn-sm btn-secondary" onclick="editOfficer('${officer.id}')">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteOfficer('${officer.id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

// Global functions for inline event handlers
window.viewOfficer = function(id) {
  const officer = currentOfficers[currentTab]?.find(o => o.id === id);
  if (officer) {
    openModal('Officer Details', `
      <div class="page-officers__modal-grid">
        <div class="page-officers__modal-field">
          <div class="page-officers__modal-label">ID:</div>
          <div class="page-officers__modal-value">${officer.id}</div>
        </div>
        <div class="page-officers__modal-field">
          <div class="page-officers__modal-label">Status:</div>
          <div class="page-officers__modal-value">${officer.status}</div>
        </div>
        <div class="page-officers__modal-field">
          <div class="page-officers__modal-label">Name:</div>
          <div class="page-officers__modal-value">${officer.name}</div>
        </div>
        <div class="page-officers__modal-field">
          <div class="page-officers__modal-label">Circle:</div>
          <div class="page-officers__modal-value">${officer.circle}</div>
        </div>
        <div class="page-officers__modal-field">
          <div class="page-officers__modal-label">Email:</div>
          <div class="page-officers__modal-value">${officer.email}</div>
        </div>
        <div class="page-officers__modal-field">
          <div class="page-officers__modal-label">Phone:</div>
          <div class="page-officers__modal-value">${officer.phone}</div>
        </div>
        <div class="page-officers__modal-field page-officers__modal-description">
          <div class="page-officers__modal-label">Address:</div>
          <div class="page-officers__modal-value">${officer.address || 'Not provided'}</div>
        </div>
        <div class="page-officers__modal-field page-officers__modal-description">
          <div class="page-officers__modal-label">Description:</div>
          <div class="page-officers__modal-value">${officer.description || 'No description available'}</div>
        </div>
      </div>
    `);
  }
};

window.editOfficer = function(id) {
  showToast('Edit officer functionality would be implemented here', 'info');
};

window.deleteOfficer = function(id) {
  if (confirm('Are you sure you want to delete this officer?')) {
    currentOfficers[currentTab] = currentOfficers[currentTab].filter(o => o.id !== id);
    renderOfficersPage();
    showToast('Officer deleted successfully', 'success');
  }
};

window.toggleOfficerStatus = function(id) {
  const officer = currentOfficers[currentTab]?.find(o => o.id === id);
  if (officer) {
    officer.status = officer.status === 'Active' ? 'Inactive' : 'Active';
    showToast(`Officer status updated to ${officer.status}`, 'success');
  }
};

function openModal(title, content, footer = '') {
  const modal = document.getElementById('modal-overlay');
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = content;
  document.getElementById('modal-footer').innerHTML = footer;
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
  const modal = document.getElementById('modal-overlay');
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
}

function showToast(message, type = 'info') {
  // Simple toast implementation
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    z-index: 1100;
    min-width: 300px;
    animation: slideInRight 0.3s ease-out;
  `;
  
  if (type === 'success') {
    toast.style.borderLeft = '4px solid #3e8f6a';
  } else if (type === 'error') {
    toast.style.borderLeft = '4px solid #e65a5a';
  }
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}