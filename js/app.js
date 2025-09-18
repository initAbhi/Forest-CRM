// Main application entry point for Hello Forest CRM

import Router from './router.js';
import { cases, knowledgebase, officers, dashboardData } from './demo-data.js';

class HelloForestApp {
  constructor() {
    this.router = new Router();
    this.currentData = {
      cases: [...cases],
      knowledgebase: [...knowledgebase],
      officers: { ...officers }
    };
    this.init();
  }

  init() {
    this.setupRoutes();
    this.setupEventListeners();
    this.setupComponents();
  }

  setupRoutes() {
    this.router.register('/login', () => this.renderLogin());
    this.router.register('/dashboard', () => this.renderDashboard());
    this.router.register('/cases', () => this.renderCases());
    this.router.register('/knowledgebase', () => this.renderKnowledgebase());
    this.router.register('/officers/:tab', (params) => this.renderOfficers(params.tab));
    this.router.register('/upload', () => this.renderUpload());
  }

  setupEventListeners() {
    // Sidebar submenu toggle
    document.addEventListener('click', (e) => {
      if (e.target.closest('.submenu-toggle')) {
        e.preventDefault();
        const submenu = e.target.closest('.nav-submenu').querySelector('.submenu');
        submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
      }
    });

    // Modal and drawer close handlers
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay') || e.target.closest('.modal-close')) {
        this.closeModal();
      }
      if (e.target.classList.contains('drawer-overlay') || e.target.closest('.drawer-close')) {
        this.closeDrawer();
      }
    });

    // Escape key handler
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModal();
        this.closeDrawer();
      }
    });
  }

  setupComponents() {
    // Initialize toast system
    this.toastContainer = document.getElementById('toast-container');
  }

  renderLogin() {
    const content = `
      <div class="login-container" style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, var(--forest-900) 0%, var(--forest-800) 50%, var(--stone-800) 100%);">
        <div class="login-card glass" style="width: 400px; padding: var(--space-2xl); text-align: center;">
          <div class="logo mb-lg">
            <svg width="48" height="48" viewBox="0 0 32 32" fill="none" style="margin: 0 auto var(--space-md);">
              <path d="M16 2L22 8L16 14L10 8L16 2Z" fill="var(--sun-400)"/>
              <path d="M8 12L14 18L8 24L2 18L8 12Z" fill="var(--moss-500)"/>
              <path d="M24 12L30 18L24 24L18 18L24 12Z" fill="var(--moss-500)"/>
              <path d="M16 18L22 24L16 30L10 24L16 18Z" fill="var(--leaf-300)"/>
            </svg>
            <h1 style="font-size: var(--font-size-3xl); font-weight: 700; color: var(--text-primary); margin-bottom: var(--space-sm);">Hello Forest</h1>
            <p style="color: var(--text-muted); font-size: var(--font-size-sm);">Forest Resource Management System</p>
          </div>
          
          <form id="login-form" class="login-form">
            <div class="form-group">
              <label for="username" class="form-label">Username</label>
              <input type="text" id="username" name="username" class="form-input" required placeholder="Enter your username">
            </div>
            
            <div class="form-group">
              <label for="password" class="form-label">Password</label>
              <div style="position: relative;">
                <input type="password" id="password" name="password" class="form-input" required placeholder="Enter your password">
                <button type="button" id="toggle-password" style="position: absolute; right: var(--space-md); top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--text-muted); cursor: pointer;">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 3C5 3 1.73 7.11 1 10C1.73 12.89 5 17 10 17S18.27 12.89 19 10C18.27 7.11 15 3 10 3ZM10 15C7.24 15 5 12.76 5 10S7.24 5 10 5S15 7.24 15 10S12.76 15 10 15ZM10 7C8.34 7 7 8.34 7 10S8.34 13 10 13S13 11.66 13 10S11.66 7 10 7Z"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <button type="submit" class="btn btn-primary btn-lg" style="width: 100%; margin-top: var(--space-lg);">
              Log In
            </button>
          </form>
        </div>
      </div>
    `;

    document.getElementById('page-content').innerHTML = content;

    // Handle login form submission
    document.getElementById('login-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.router.go('/dashboard');
      this.showToast('Login successful!', 'success');
    });

    // Password toggle
    document.getElementById('toggle-password').addEventListener('click', () => {
      const passwordInput = document.getElementById('password');
      const type = passwordInput.type === 'password' ? 'text' : 'password';
      passwordInput.type = type;
    });
  }

  renderDashboard() {
    const content = `
      <div class="dashboard-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: var(--space-lg); margin-bottom: var(--space-xl);">
        <div class="kpi-card card card-hover">
          <h3 style="color: var(--text-muted); font-size: var(--font-size-sm); margin-bottom: var(--space-sm);">Today's Calls</h3>
          <div style="font-size: var(--font-size-3xl); font-weight: 700; color: var(--moss-500);">${dashboardData.kpis.todaysCalls}</div>
        </div>
        <div class="kpi-card card card-hover">
          <h3 style="color: var(--text-muted); font-size: var(--font-size-sm); margin-bottom: var(--space-sm);">Open Cases</h3>
          <div style="font-size: var(--font-size-3xl); font-weight: 700; color: var(--sun-400);">${dashboardData.kpis.openCases}</div>
        </div>
        <div class="kpi-card card card-hover">
          <h3 style="color: var(--text-muted); font-size: var(--font-size-sm); margin-bottom: var(--space-sm);">Avg Response</h3>
          <div style="font-size: var(--font-size-3xl); font-weight: 700; color: var(--leaf-300);">${dashboardData.kpis.avgResponse}</div>
        </div>
        <div class="kpi-card card card-hover">
          <h3 style="color: var(--text-muted); font-size: var(--font-size-sm); margin-bottom: var(--space-sm);">Public KB</h3>
          <div style="font-size: var(--font-size-3xl); font-weight: 700; color: var(--moss-400);">${dashboardData.kpis.publicKB}</div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: var(--space-xl);">
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Activity Overview</h2>
          </div>
          <canvas id="activity-chart" width="400" height="200"></canvas>
        </div>

        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Recent Activity</h2>
          </div>
          <div class="activity-list">
            ${dashboardData.recentActivity.map(activity => `
              <div style="padding: var(--space-md) 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                <div style="font-size: var(--font-size-sm); color: var(--text-primary); margin-bottom: var(--space-xs);">${activity.description}</div>
                <div style="font-size: var(--font-size-xs); color: var(--text-muted);">by ${activity.user} • ${this.formatDate(activity.timestamp)}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <div style="margin-top: var(--space-xl);" class="card">
        <div class="card-header">
          <h2 class="card-title">Quick Actions</h2>
        </div>
        <div style="display: flex; gap: var(--space-md);">
          <button class="btn btn-primary" onclick="window.location.hash='/cases'">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 5V15M5 10H15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Create Case
          </button>
          <button class="btn btn-secondary" onclick="window.location.hash='/knowledgebase'">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4 2H16C17.1 2 18 2.9 18 4V16C18 17.1 17.1 18 16 18H4C2.9 18 2 17.1 2 16V4C2 2.9 2.9 2 4 2Z"/>
            </svg>
            New Article
          </button>
        </div>
      </div>
    `;

    document.getElementById('page-content').innerHTML = content;
    this.drawActivityChart();
  }

  renderCases() {
    const content = `
      <div class="cases-page">
        <div style="display: flex; justify-content: between; align-items: center; margin-bottom: var(--space-xl);">
          <div class="filters" style="display: flex; gap: var(--space-md); flex-wrap: wrap; flex: 1;">
            <input type="text" placeholder="Case No" class="form-input" style="width: 120px;">
            <input type="text" placeholder="Name" class="form-input" style="width: 150px;">
            <input type="text" placeholder="Phone" class="form-input" style="width: 130px;">
            <select class="form-select" style="width: 150px;">
              <option value="">All Categories</option>
              <option value="Wildlife Protection">Wildlife Protection</option>
              <option value="Fire Prevention">Fire Prevention</option>
              <option value="Environmental Impact">Environmental Impact</option>
              <option value="Resource Management">Resource Management</option>
            </select>
            <button class="btn btn-secondary">Reset</button>
          </div>
          <button class="btn btn-primary" id="create-case-btn">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 5V15M5 10H15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Create Case
          </button>
        </div>

        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th><input type="checkbox" id="select-all"></th>
                <th>Case No</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Category</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${this.currentData.cases.map(caseItem => `
                <tr data-id="${caseItem.id}">
                  <td><input type="checkbox" value="${caseItem.id}"></td>
                  <td>${caseItem.caseNo}</td>
                  <td>${caseItem.name}</td>
                  <td>${caseItem.phone}</td>
                  <td>${caseItem.category}</td>
                  <td><span class="status-badge ${caseItem.status.toLowerCase().replace(' ', '-')}">${caseItem.status}</span></td>
                  <td><span class="priority-badge ${caseItem.priority.toLowerCase()}">${caseItem.priority}</span></td>
                  <td>${this.formatDate(caseItem.createdAt)}</td>
                  <td>
                    <button class="btn btn-sm btn-secondary" onclick="app.viewCase('${caseItem.id}')">View</button>
                    <button class="btn btn-sm btn-secondary" onclick="app.editCase('${caseItem.id}')">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="app.deleteCase('${caseItem.id}')">Delete</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div style="margin-top: var(--space-lg); display: flex; justify-content: between; align-items: center;">
          <div>
            <button class="btn btn-secondary" id="bulk-close-btn" disabled>Close Selected</button>
          </div>
          <div style="display: flex; gap: var(--space-md); align-items: center;">
            <span style="color: var(--text-muted); font-size: var(--font-size-sm);">Showing ${this.currentData.cases.length} cases</span>
            <select class="form-select" style="width: auto;">
              <option value="10">10 per page</option>
              <option value="25">25 per page</option>
              <option value="50">50 per page</option>
            </select>
          </div>
        </div>
      </div>
    `;

    document.getElementById('page-content').innerHTML = content;
    this.setupCasesEventListeners();
  }

  renderKnowledgebase() {
    const content = `
      <div class="kb-page">
        <div style="display: flex; justify-content: between; align-items: center; margin-bottom: var(--space-xl);">
          <div class="filters" style="display: flex; gap: var(--space-md);">
            <input type="text" placeholder="Search articles..." class="form-input" style="width: 300px;">
            <select class="form-select" style="width: 150px;">
              <option value="">All Status</option>
              <option value="Public">Public</option>
              <option value="Private">Private</option>
            </select>
          </div>
          <button class="btn btn-primary" id="new-article-btn">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 5V15M5 10H15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            New Article
          </button>
        </div>

        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Status</th>
                <th>Category</th>
                <th>Author</th>
                <th>Updated</th>
                <th>Views</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${this.currentData.knowledgebase.map(article => `
                <tr data-id="${article.id}">
                  <td>${article.id}</td>
                  <td>${article.title}</td>
                  <td><span class="status-badge ${article.status.toLowerCase()}">${article.status}</span></td>
                  <td>${article.category}</td>
                  <td>${article.author}</td>
                  <td>${this.formatDate(article.updatedAt)}</td>
                  <td>${article.views}</td>
                  <td>
                    <button class="btn btn-sm btn-secondary" onclick="app.previewArticle('${article.id}')">Preview</button>
                    <button class="btn btn-sm btn-secondary" onclick="app.editArticle('${article.id}')">Edit</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    document.getElementById('page-content').innerHTML = content;
    this.setupKnowledgebaseEventListeners();
  }

  renderOfficers(tab = 'ccf') {
    const officers = this.currentData.officers[tab] || [];
    const tabs = ['ccf', 'dcf', 'acf', 'rfo'];

    const content = `
      <div class="officers-page">
        <div class="tabs" style="margin-bottom: var(--space-xl);">
          <div class="tab-list" style="display: flex; gap: var(--space-md); border-bottom: 1px solid rgba(255,255,255,0.1);">
            ${tabs.map(t => `
              <button class="tab-button ${t === tab ? 'active' : ''}" data-tab="${t}" style="padding: var(--space-md) var(--space-lg); background: none; border: none; color: ${t === tab ? 'var(--text-primary)' : 'var(--text-muted)'}; cursor: pointer; border-bottom: 2px solid ${t === tab ? 'var(--moss-500)' : 'transparent'}; text-transform: uppercase; font-weight: 600;">
                ${t.toUpperCase()}
              </button>
            `).join('')}
          </div>
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
              ${officers.map(officer => `
                <tr data-id="${officer.id}">
                  <td>${officer.id}</td>
                  <td>${officer.name}</td>
                  <td>${officer.circle}</td>
                  <td>${officer.email}</td>
                  <td>${officer.phone}</td>
                  <td>
                    <label class="toggle-switch">
                      <input type="checkbox" ${officer.status === 'Active' ? 'checked' : ''} onchange="app.toggleOfficerStatus('${officer.id}', '${tab}')">
                      <span class="toggle-slider"></span>
                    </label>
                  </td>
                  <td>
                    <button class="btn btn-sm btn-secondary" onclick="app.editOfficer('${officer.id}', '${tab}')">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="app.deleteOfficer('${officer.id}', '${tab}')">Delete</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    document.getElementById('page-content').innerHTML = content;
    this.setupOfficersEventListeners();
  }

  renderUpload() {
    const content = `
      <div class="upload-page">
        <div class="card" style="max-width: 600px; margin: 0 auto;">
          <div class="card-header">
            <h2 class="card-title">Upload CSV Data</h2>
          </div>
          
          <div id="upload-area" class="upload-area" style="border: 2px dashed rgba(255,255,255,0.3); border-radius: var(--radius); padding: var(--space-3xl); text-align: center; cursor: pointer; transition: all var(--trans);">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="currentColor" style="margin-bottom: var(--space-lg); color: var(--text-muted);">
              <path d="M24 8L32 16H28V28H20V16H16L24 8ZM8 32H40V36H8V32Z"/>
            </svg>
            <h3 style="color: var(--text-primary); margin-bottom: var(--space-md);">Drop CSV file here</h3>
            <p style="color: var(--text-muted); margin-bottom: var(--space-lg);">or click to browse</p>
            <button class="btn btn-secondary">Choose File</button>
            <input type="file" id="file-input" accept=".csv" style="display: none;">
          </div>

          <div id="preview-container" class="hidden" style="margin-top: var(--space-xl);">
            <h3 style="margin-bottom: var(--space-lg);">Preview (First 50 rows)</h3>
            <div id="preview-table" class="table-container" style="max-height: 400px; overflow-y: auto;"></div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('page-content').innerHTML = content;
    this.setupUploadEventListeners();
  }

  // Event listeners setup methods
  setupCasesEventListeners() {
    document.getElementById('create-case-btn')?.addEventListener('click', () => {
      this.openCreateCaseDrawer();
    });

    // Bulk selection
    document.getElementById('select-all')?.addEventListener('change', (e) => {
      const checkboxes = document.querySelectorAll('tbody input[type="checkbox"]');
      checkboxes.forEach(cb => cb.checked = e.target.checked);
      this.updateBulkActions();
    });

    document.querySelectorAll('tbody input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', () => this.updateBulkActions());
    });
  }

  setupKnowledgebaseEventListeners() {
    document.getElementById('new-article-btn')?.addEventListener('click', () => {
      this.openNewArticleDrawer();
    });
  }

  setupOfficersEventListeners() {
    document.querySelectorAll('.tab-button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.target.dataset.tab;
        this.router.go(`/officers/${tab}`);
      });
    });
  }

  setupUploadEventListeners() {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');

    uploadArea.addEventListener('click', () => fileInput.click());
    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.style.borderColor = 'var(--moss-500)';
      uploadArea.style.backgroundColor = 'rgba(62, 143, 106, 0.1)';
    });
    
    uploadArea.addEventListener('dragleave', () => {
      uploadArea.style.borderColor = 'rgba(255,255,255,0.3)';
      uploadArea.style.backgroundColor = 'transparent';
    });

    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        this.handleFileUpload(files[0]);
      }
      uploadArea.style.borderColor = 'rgba(255,255,255,0.3)';
      uploadArea.style.backgroundColor = 'transparent';
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        this.handleFileUpload(e.target.files[0]);
      }
    });
  }

  // Utility methods
  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  drawActivityChart() {
    const canvas = document.getElementById('activity-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw simple line chart
    ctx.strokeStyle = '#3e8f6a';
    ctx.lineWidth = 2;
    ctx.beginPath();

    const data = dashboardData.chartData.calls;
    const stepX = width / (data.length - 1);
    const maxValue = Math.max(...data);

    data.forEach((value, index) => {
      const x = index * stepX;
      const y = height - (value / maxValue) * height * 0.8;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();
  }

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    this.toastContainer.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  openModal(title, content, footer = '') {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = content;
    document.getElementById('modal-footer').innerHTML = footer;
    document.getElementById('modal-overlay').classList.remove('hidden');
  }

  closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
  }

  openDrawer(title, content, footer = '') {
    document.getElementById('drawer-title').textContent = title;
    document.getElementById('drawer-body').innerHTML = content;
    document.getElementById('drawer-footer').innerHTML = footer;
    document.getElementById('drawer-overlay').classList.remove('hidden');
  }

  closeDrawer() {
    document.getElementById('drawer-overlay').classList.add('hidden');
  }

  // Action methods (placeholders that show toasts)
  viewCase(id) {
    const caseItem = this.currentData.cases.find(c => c.id === id);
    if (caseItem) {
      this.openModal('Case Details', `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-lg);">
          <div><strong>Case No:</strong> ${caseItem.caseNo}</div>
          <div><strong>Status:</strong> ${caseItem.status}</div>
          <div><strong>Name:</strong> ${caseItem.name}</div>
          <div><strong>Priority:</strong> ${caseItem.priority}</div>
          <div><strong>Phone:</strong> ${caseItem.phone}</div>
          <div><strong>Category:</strong> ${caseItem.category}</div>
          <div style="grid-column: 1 / -1;"><strong>Description:</strong> ${caseItem.description}</div>
        </div>
      `);
    }
  }

  editCase(id) {
    this.openDrawer('Edit Case', `
      <form id="edit-case-form">
        <div class="form-group">
          <label class="form-label">Case Number</label>
          <input type="text" class="form-input" value="FOR-2025-001" readonly>
        </div>
        <div class="form-group">
          <label class="form-label">Name</label>
          <input type="text" class="form-input" value="John Smith">
        </div>
        <div class="form-group">
          <label class="form-label">Phone</label>
          <input type="tel" class="form-input" value="+1-555-0123">
        </div>
        <div class="form-group">
          <label class="form-label">Category</label>
          <select class="form-select">
            <option>Wildlife Protection</option>
            <option>Fire Prevention</option>
            <option>Environmental Impact</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea class="form-textarea">Illegal logging reported in sector 7</textarea>
        </div>
      </form>
    `, `
      <button class="btn btn-secondary" onclick="app.closeDrawer()">Cancel</button>
      <button class="btn btn-primary" onclick="app.saveCase()">Save</button>
    `);
  }

  deleteCase(id) {
    this.openModal('Confirm Delete', 'Are you sure you want to delete this case?', `
      <button class="btn btn-secondary" onclick="app.closeModal()">Cancel</button>
      <button class="btn btn-danger" onclick="app.confirmDeleteCase('${id}')">Delete</button>
    `);
  }

  confirmDeleteCase(id) {
    this.currentData.cases = this.currentData.cases.filter(c => c.id !== id);
    this.closeModal();
    this.renderCases();
    this.showToast('Case deleted successfully', 'success');
  }

  openCreateCaseDrawer() {
    this.openDrawer('Create New Case', `
      <form id="create-case-form">
        <div class="form-group">
          <label class="form-label">Name *</label>
          <input type="text" class="form-input" required>
        </div>
        <div class="form-group">
          <label class="form-label">Phone *</label>
          <input type="tel" class="form-input" required>
        </div>
        <div class="form-group">
          <label class="form-label">Email</label>
          <input type="email" class="form-input">
        </div>
        <div class="form-group">
          <label class="form-label">Category *</label>
          <select class="form-select" required>
            <option value="">Select Category</option>
            <option>Wildlife Protection</option>
            <option>Fire Prevention</option>
            <option>Environmental Impact</option>
            <option>Resource Management</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea class="form-textarea"></textarea>
        </div>
      </form>
    `, `
      <button class="btn btn-secondary" onclick="app.closeDrawer()">Cancel</button>
      <button class="btn btn-primary" onclick="app.createCase()">Create Case</button>
    `);
  }

  createCase() {
    this.closeDrawer();
    this.showToast('Case created successfully', 'success');
  }

  saveCase() {
    this.closeDrawer();
    this.showToast('Case updated successfully', 'success');
  }

  previewArticle(id) {
    const article = this.currentData.knowledgebase.find(a => a.id === id);
    if (article) {
      this.openModal('Article Preview', `
        <h3 style="margin-bottom: var(--space-md);">${article.title}</h3>
        <div style="margin-bottom: var(--space-md); color: var(--text-muted); font-size: var(--font-size-sm);">
          ${article.category} • by ${article.author} • ${this.formatDate(article.updatedAt)}
        </div>
        <div style="line-height: 1.6;">${article.content}</div>
      `);
    }
  }

  editArticle(id) {
    this.openDrawer('Edit Article', `
      <form id="edit-article-form">
        <div class="form-group">
          <label class="form-label">Title</label>
          <input type="text" class="form-input" value="Forest Fire Prevention Guidelines">
        </div>
        <div class="form-group">
          <label class="form-label">Category</label>
          <select class="form-select">
            <option>Safety</option>
            <option>Conservation</option>
            <option>Operations</option>
            <option>Emergency</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Status</label>
          <select class="form-select">
            <option>Public</option>
            <option>Private</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Content</label>
          <div class="editor-toolbar" style="margin-bottom: var(--space-sm); display: flex; gap: var(--space-sm);">
            <button type="button" class="btn btn-sm btn-secondary">Bold</button>
            <button type="button" class="btn btn-sm btn-secondary">Italic</button>
            <button type="button" class="btn btn-sm btn-secondary">List</button>
            <button type="button" class="btn btn-sm btn-secondary">Link</button>
          </div>
          <div contenteditable="true" class="form-textarea" style="min-height: 200px;">Comprehensive guidelines for preventing forest fires...</div>
        </div>
      </form>
    `, `
      <button class="btn btn-secondary" onclick="app.closeDrawer()">Cancel</button>
      <button class="btn btn-primary" onclick="app.saveArticle()">Save</button>
    `);
  }

  openNewArticleDrawer() {
    this.openDrawer('New Article', `
      <form id="new-article-form">
        <div class="form-group">
          <label class="form-label">Title *</label>
          <input type="text" class="form-input" required>
        </div>
        <div class="form-group">
          <label class="form-label">Category *</label>
          <select class="form-select" required>
            <option value="">Select Category</option>
            <option>Safety</option>
            <option>Conservation</option>
            <option>Operations</option>
            <option>Emergency</option>
            <option>Environment</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Status</label>
          <select class="form-select">
            <option>Public</option>
            <option>Private</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Content</label>
          <div class="editor-toolbar" style="margin-bottom: var(--space-sm); display: flex; gap: var(--space-sm);">
            <button type="button" class="btn btn-sm btn-secondary">Bold</button>
            <button type="button" class="btn btn-sm btn-secondary">Italic</button>
            <button type="button" class="btn btn-sm btn-secondary">List</button>
            <button type="button" class="btn btn-sm btn-secondary">Link</button>
          </div>
          <div contenteditable="true" class="form-textarea" style="min-height: 200px;" placeholder="Start writing your article..."></div>
        </div>
      </form>
    `, `
      <button class="btn btn-secondary" onclick="app.closeDrawer()">Cancel</button>
      <button class="btn btn-primary" onclick="app.createArticle()">Create Article</button>
    `);
  }

  saveArticle() {
    this.closeDrawer();
    this.showToast('Article updated successfully', 'success');
  }

  createArticle() {
    this.closeDrawer();
    this.showToast('Article created successfully', 'success');
  }

  editOfficer(id, tab) {
    this.openModal('Edit Officer', `
      <form id="edit-officer-form">
        <div class="form-group">
          <label class="form-label">Name</label>
          <input type="text" class="form-input" value="Robert Anderson">
        </div>
        <div class="form-group">
          <label class="form-label">Circle</label>
          <input type="text" class="form-input" value="Pine Circle">
        </div>
        <div class="form-group">
          <label class="form-label">Email</label>
          <input type="email" class="form-input" value="r.anderson@forest.gov">
        </div>
        <div class="form-group">
          <label class="form-label">Phone</label>
          <input type="tel" class="form-input" value="+1-555-1001">
        </div>
        <div class="form-group">
          <label class="form-label">Address</label>
          <textarea class="form-textarea">123 Forest Ave, Pine City</textarea>
        </div>
      </form>
    `, `
      <button class="btn btn-secondary" onclick="app.closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="app.saveOfficer()">Save</button>
    `);
  }

  deleteOfficer(id, tab) {
    this.openModal('Confirm Delete', 'Are you sure you want to delete this officer?', `
      <button class="btn btn-secondary" onclick="app.closeModal()">Cancel</button>
      <button class="btn btn-danger" onclick="app.confirmDeleteOfficer('${id}', '${tab}')">Delete</button>
    `);
  }

  confirmDeleteOfficer(id, tab) {
    this.currentData.officers[tab] = this.currentData.officers[tab].filter(o => o.id !== id);
    this.closeModal();
    this.renderOfficers(tab);
    this.showToast('Officer deleted successfully', 'success');
  }

  saveOfficer() {
    this.closeModal();
    this.showToast('Officer updated successfully', 'success');
  }

  toggleOfficerStatus(id, tab) {
    const officer = this.currentData.officers[tab].find(o => o.id === id);
    if (officer) {
      officer.status = officer.status === 'Active' ? 'Inactive' : 'Active';
      this.showToast(`Officer status updated to ${officer.status}`, 'success');
    }
  }

  updateBulkActions() {
    const selected = document.querySelectorAll('tbody input[type="checkbox"]:checked').length;
    const bulkBtn = document.getElementById('bulk-close-btn');
    if (bulkBtn) {
      bulkBtn.disabled = selected === 0;
    }
  }

  handleFileUpload(file) {
    if (!file.name.endsWith('.csv')) {
      this.showToast('Please select a CSV file', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target.result;
      this.parseAndPreviewCSV(csv);
    };
    reader.readAsText(file);
  }

  parseAndPreviewCSV(csv) {
    const lines = csv.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    const rows = lines.slice(1, 51).map(line => line.split(',').map(cell => cell.trim()));

    const tableHTML = `
      <table class="table">
        <thead>
          <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
        </tbody>
      </table>
    `;

    document.getElementById('preview-table').innerHTML = tableHTML;
    document.getElementById('preview-container').classList.remove('hidden');
    this.showToast(`Preview showing ${Math.min(rows.length, 50)} of ${lines.length - 1} rows`, 'info');
  }
}

// Initialize application
const app = new HelloForestApp();
window.app = app; // Make app globally available for inline event handlers

// Add CSS for status badges and toggle switches
const additionalCSS = document.createElement('style');
additionalCSS.textContent = `
  .status-badge {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
  }
  .status-badge.open { background: var(--warning); color: var(--forest-900); }
  .status-badge.in-progress { background: var(--info); color: var(--forest-900); }
  .status-badge.closed { background: var(--success); color: white; }
  .status-badge.public { background: var(--success); color: white; }
  .status-badge.private { background: var(--stone-600); color: white; }
  
  .priority-badge {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
  }
  .priority-badge.high { background: var(--danger); color: white; }
  .priority-badge.medium { background: var(--warning); color: var(--forest-900); }
  .priority-badge.low { background: var(--moss-400); color: white; }
  
  .toggle-switch {
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;
  }
  
  .toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  .toggle-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 24px;
  }
  
  .toggle-slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
  
  input:checked + .toggle-slider {
    background-color: var(--moss-500);
  }
  
  input:checked + .toggle-slider:before {
    transform: translateX(20px);
  }
`;
document.head.appendChild(additionalCSS);