// Cases page functionality

let currentCases = [];
let filteredCases = [];
let currentSort = { field: null, direction: 'asc' };

document.addEventListener('DOMContentLoaded', () => {
  // Check if user is logged in
  if (!localStorage.getItem('isLoggedIn')) {
    window.location.href = '../login/login.html';
    return;
  }

  // Initialize cases page
  initializeCases();
  setupEventListeners();
});

function initializeCases() {
  if (!window.cases) {
    console.error('Cases data not available');
    return;
  }

  currentCases = [...window.cases];
  filteredCases = [...window.cases];
  
  renderCasesPage();
}

function renderCasesPage() {
  const pageContent = document.getElementById('page-content');
  
  const content = `
    <div class="page-cases">
      <div class="page-cases__filters">
        <div class="page-cases__filter-group">
          <input type="text" placeholder="Case No" class="form-input page-cases__filter-input case-filter" data-field="caseNo">
          <input type="text" placeholder="Name" class="form-input page-cases__filter-input page-cases__filter-input--name case-filter" data-field="name">
          <input type="text" placeholder="Phone" class="form-input page-cases__filter-input page-cases__filter-input--phone case-filter" data-field="phone">
          <select class="form-select page-cases__filter-select case-filter" data-field="category">
            <option value="">All Categories</option>
            <option value="Wildlife Protection">Wildlife Protection</option>
            <option value="Fire Prevention">Fire Prevention</option>
            <option value="Environmental Impact">Environmental Impact</option>
            <option value="Resource Management">Resource Management</option>
          </select>
          <button class="btn btn-secondary" id="reset-filters">Reset</button>
        </div>
        <button class="btn btn-primary page-cases__create-btn" id="create-case-btn">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 5V15M5 10H15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          Create Case
        </button>
      </div>

      <div class="table-container">
        <table class="table page-cases__table" id="cases-table">
          <thead>
            <tr>
              <th><input type="checkbox" id="select-all" class="page-cases__checkbox" aria-label="Select all cases"></th>
              <th class="sortable" data-sort="caseNo">Case No <span class="page-cases__sort-indicator"></span></th>
              <th class="sortable" data-sort="name">Name <span class="page-cases__sort-indicator"></span></th>
              <th class="sortable" data-sort="phone">Phone <span class="page-cases__sort-indicator"></span></th>
              <th class="sortable" data-sort="category">Category <span class="page-cases__sort-indicator"></span></th>
              <th class="sortable" data-sort="status">Status <span class="page-cases__sort-indicator"></span></th>
              <th class="sortable" data-sort="priority">Priority <span class="page-cases__sort-indicator"></span></th>
              <th class="sortable" data-sort="createdAt">Created <span class="page-cases__sort-indicator"></span></th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="cases-tbody">
            ${renderCasesTable()}
          </tbody>
        </table>
      </div>

      <div class="page-cases__table-actions">
        <div class="page-cases__bulk-actions">
          <button class="btn btn-secondary" id="bulk-close-btn" disabled>Close Selected</button>
        </div>
        <div class="page-cases__table-info">
          <span class="page-cases__count" id="cases-count">Showing ${filteredCases.length} of ${currentCases.length} cases</span>
          <select class="form-select page-cases__page-size" id="page-size">
            <option value="10">10 per page</option>
            <option value="25">25 per page</option>
            <option value="50">50 per page</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Modal for case details -->
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
  setupCasesEventListeners();
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

function setupCasesEventListeners() {
  // Filter event listeners
  document.querySelectorAll('.case-filter').forEach(filter => {
    filter.addEventListener('input', filterCases);
  });

  document.getElementById('reset-filters')?.addEventListener('click', () => {
    document.querySelectorAll('.case-filter').forEach(filter => {
      filter.value = '';
    });
    filterCases();
  });

  // Sorting event listeners
  document.querySelectorAll('.sortable').forEach(header => {
    header.addEventListener('click', () => {
      const field = header.dataset.sort;
      sortCases(field);
    });
  });

  // Bulk selection
  document.getElementById('select-all')?.addEventListener('change', (e) => {
    const checkboxes = document.querySelectorAll('#cases-tbody input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = e.target.checked);
    updateBulkActions();
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

  // Create case button
  document.getElementById('create-case-btn')?.addEventListener('click', () => {
    showToast('Create case functionality would be implemented here', 'info');
  });

  // Bulk close button
  document.getElementById('bulk-close-btn')?.addEventListener('click', () => {
    const selectedIds = Array.from(document.querySelectorAll('#cases-tbody input[type="checkbox"]:checked'))
      .map(cb => cb.value);
    
    if (selectedIds.length > 0) {
      bulkCloseCases(selectedIds);
    }
  });

  setupCheckboxListeners();
}

function setupCheckboxListeners() {
  document.querySelectorAll('#cases-tbody input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', updateBulkActions);
  });
}

function renderCasesTable() {
  if (filteredCases.length === 0) {
    return `
      <tr>
        <td colspan="9" class="page-cases__empty">
          <div class="page-cases__empty-icon">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="currentColor">
              <path d="M32 8L40 16L32 24L24 16L32 8ZM16 24L24 32L16 40L8 32L16 24ZM48 24L56 32L48 40L40 32L48 24ZM32 40L40 48L32 56L24 48L32 40Z"/>
            </svg>
          </div>
          <h3>No cases found</h3>
          <p>Try adjusting your filters or create a new case.</p>
        </td>
      </tr>
    `;
  }

  return filteredCases.map(caseItem => `
    <tr data-id="${caseItem.id}">
      <td><input type="checkbox" value="${caseItem.id}" class="page-cases__checkbox" aria-label="Select case ${caseItem.caseNo}"></td>
      <td>${caseItem.caseNo}</td>
      <td>${caseItem.name}</td>
      <td>${caseItem.phone}</td>
      <td>${caseItem.category}</td>
      <td><span class="status-badge ${caseItem.status.toLowerCase().replace(' ', '-')}">${caseItem.status}</span></td>
      <td><span class="priority-badge ${caseItem.priority.toLowerCase()}">${caseItem.priority}</span></td>
      <td>${formatDate(caseItem.createdAt)}</td>
      <td>
        <div class="page-cases__action-buttons">
          <button class="btn btn-sm btn-secondary page-cases__action-btn" onclick="viewCase('${caseItem.id}')" aria-label="View case ${caseItem.caseNo}">View</button>
          <button class="btn btn-sm btn-secondary page-cases__action-btn" onclick="editCase('${caseItem.id}')" aria-label="Edit case ${caseItem.caseNo}">Edit</button>
          <button class="btn btn-sm btn-danger page-cases__action-btn" onclick="deleteCase('${caseItem.id}')" aria-label="Delete case ${caseItem.caseNo}">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function filterCases() {
  const filters = {};
  document.querySelectorAll('.case-filter').forEach(filter => {
    const field = filter.dataset.field;
    const value = filter.value.toLowerCase();
    if (value) filters[field] = value;
  });

  filteredCases = currentCases.filter(caseItem => {
    return Object.entries(filters).every(([field, value]) => {
      return caseItem[field].toLowerCase().includes(value);
    });
  });

  applySorting();
  updateCasesTable();
}

function sortCases(field) {
  if (currentSort.field === field) {
    currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
  } else {
    currentSort.field = field;
    currentSort.direction = 'asc';
  }
  
  applySorting();
  updateSortIndicators();
  updateCasesTable();
}

function applySorting() {
  if (!currentSort.field) return;

  filteredCases.sort((a, b) => {
    let aVal = a[currentSort.field];
    let bVal = b[currentSort.field];

    if (currentSort.field === 'createdAt') {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    } else {
      aVal = aVal.toString().toLowerCase();
      bVal = bVal.toString().toLowerCase();
    }

    if (aVal < bVal) return currentSort.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return currentSort.direction === 'asc' ? 1 : -1;
    return 0;
  });
}

function updateSortIndicators() {
  document.querySelectorAll('.page-cases__sort-indicator').forEach(indicator => {
    indicator.textContent = '';
  });

  if (currentSort.field) {
    const header = document.querySelector(`[data-sort="${currentSort.field}"] .page-cases__sort-indicator`);
    if (header) {
      header.textContent = currentSort.direction === 'asc' ? ' ↑' : ' ↓';
    }
  }
}

function updateCasesTable() {
  const tbody = document.getElementById('cases-tbody');
  if (tbody) {
    tbody.innerHTML = renderCasesTable();
    setupCheckboxListeners();
    updateBulkActions();
    document.getElementById('cases-count').textContent = `Showing ${filteredCases.length} of ${currentCases.length} cases`;
  }
}

function updateBulkActions() {
  const selected = document.querySelectorAll('#cases-tbody input[type="checkbox"]:checked').length;
  const bulkBtn = document.getElementById('bulk-close-btn');
  if (bulkBtn) {
    bulkBtn.disabled = selected === 0;
    bulkBtn.textContent = selected > 0 ? `Close Selected (${selected})` : 'Close Selected';
  }

  const selectAll = document.getElementById('select-all');
  const totalCheckboxes = document.querySelectorAll('#cases-tbody input[type="checkbox"]').length;
  if (selectAll) {
    selectAll.indeterminate = selected > 0 && selected < totalCheckboxes;
    selectAll.checked = selected === totalCheckboxes && totalCheckboxes > 0;
  }
}

function bulkCloseCases(caseIds) {
  caseIds.forEach(id => {
    const caseItem = currentCases.find(c => c.id === id);
    if (caseItem) {
      caseItem.status = 'Closed';
    }
  });
  
  filterCases();
  showToast(`${caseIds.length} cases closed successfully`, 'success');
  
  // Uncheck all checkboxes
  document.querySelectorAll('#cases-tbody input[type="checkbox"]').forEach(cb => {
    cb.checked = false;
  });
  document.getElementById('select-all').checked = false;
  updateBulkActions();
}

// Global functions for inline event handlers
window.viewCase = function(id) {
  const caseItem = currentCases.find(c => c.id === id);
  if (caseItem) {
    openModal('Case Details', `
      <div class="page-cases__modal-grid">
        <div class="page-cases__modal-field">
          <div class="page-cases__modal-label">Case No:</div>
          <div class="page-cases__modal-value">${caseItem.caseNo}</div>
        </div>
        <div class="page-cases__modal-field">
          <div class="page-cases__modal-label">Status:</div>
          <div class="page-cases__modal-value"><span class="status-badge ${caseItem.status.toLowerCase().replace(' ', '-')}">${caseItem.status}</span></div>
        </div>
        <div class="page-cases__modal-field">
          <div class="page-cases__modal-label">Name:</div>
          <div class="page-cases__modal-value">${caseItem.name}</div>
        </div>
        <div class="page-cases__modal-field">
          <div class="page-cases__modal-label">Priority:</div>
          <div class="page-cases__modal-value"><span class="priority-badge ${caseItem.priority.toLowerCase()}">${caseItem.priority}</span></div>
        </div>
        <div class="page-cases__modal-field">
          <div class="page-cases__modal-label">Phone:</div>
          <div class="page-cases__modal-value">${caseItem.phone}</div>
        </div>
        <div class="page-cases__modal-field">
          <div class="page-cases__modal-label">Category:</div>
          <div class="page-cases__modal-value">${caseItem.category}</div>
        </div>
        <div class="page-cases__modal-field page-cases__modal-description">
          <div class="page-cases__modal-label">Description:</div>
          <div class="page-cases__modal-value">${caseItem.description}</div>
        </div>
      </div>
    `);
  }
};

window.editCase = function(id) {
  showToast('Edit case functionality would be implemented here', 'info');
};

window.deleteCase = function(id) {
  if (confirm('Are you sure you want to delete this case?')) {
    currentCases = currentCases.filter(c => c.id !== id);
    filterCases();
    showToast('Case deleted successfully', 'success');
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

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
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