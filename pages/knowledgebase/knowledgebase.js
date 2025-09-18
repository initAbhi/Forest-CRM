// Knowledge Base page functionality

let currentArticles = [];
let filteredArticles = [];

document.addEventListener('DOMContentLoaded', () => {
  // Check if user is logged in
  if (!localStorage.getItem('isLoggedIn')) {
    window.location.href = '../login/login.html';
    return;
  }

  // Initialize knowledge base page
  initializeKnowledgeBase();
  setupEventListeners();
});

function initializeKnowledgeBase() {
  if (!window.knowledgebase) {
    console.error('Knowledge base data not available');
    return;
  }

  currentArticles = [...window.knowledgebase];
  filteredArticles = [...window.knowledgebase];
  
  renderKnowledgeBasePage();
}

function renderKnowledgeBasePage() {
  const pageContent = document.getElementById('page-content');
  
  const content = `
    <div class="page-knowledgebase">
      <div class="page-knowledgebase__filters">
        <div class="page-knowledgebase__filter-group">
          <input type="text" placeholder="Search articles..." class="form-input page-knowledgebase__search-input" id="search-input">
          <select class="form-select page-knowledgebase__status-filter" id="status-filter">
            <option value="">All Status</option>
            <option value="Public">Public</option>
            <option value="Private">Private</option>
          </select>
        </div>
        <button class="btn btn-primary page-knowledgebase__create-btn" id="new-article-btn">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 5V15M5 10H15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          New Article
        </button>
      </div>

      <div class="page-knowledgebase__articles" id="articles-container">
        ${renderArticles()}
      </div>
    </div>

    <!-- Modal for article preview -->
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
  setupKnowledgeBaseEventListeners();
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

function setupKnowledgeBaseEventListeners() {
  // Search functionality
  document.getElementById('search-input')?.addEventListener('input', filterArticles);
  document.getElementById('status-filter')?.addEventListener('change', filterArticles);

  // New article button
  document.getElementById('new-article-btn')?.addEventListener('click', () => {
    showToast('New article functionality would be implemented here', 'info');
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

function renderArticles() {
  if (filteredArticles.length === 0) {
    return `
      <div class="page-knowledgebase__empty">
        <div class="page-knowledgebase__empty-icon">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="currentColor">
            <path d="M8 8H56C58.2 8 60 9.8 60 12V52C60 54.2 58.2 56 56 56H8C5.8 56 4 54.2 4 52V12C4 9.8 5.8 8 8 8ZM8 16V24H56V16H8ZM8 28V36H48V28H8ZM8 40V48H40V40H8Z"/>
          </svg>
        </div>
        <h3>No articles found</h3>
        <p>Try adjusting your search or create a new article.</p>
      </div>
    `;
  }

  return filteredArticles.map(article => `
    <div class="page-knowledgebase__article-card" data-id="${article.id}">
      <div class="page-knowledgebase__article-header">
        <div>
          <h3 class="page-knowledgebase__article-title">${article.title}</h3>
          <div class="page-knowledgebase__article-meta">
            <span class="page-knowledgebase__article-category">${article.category}</span>
            <span class="status-badge ${article.status.toLowerCase()}">${article.status}</span>
            <span>by ${article.author}</span>
            <span>${formatDate(article.updatedAt)}</span>
          </div>
        </div>
      </div>
      
      <div class="page-knowledgebase__article-content">
        ${truncateText(article.content, 200)}
      </div>
      
      <div class="page-knowledgebase__article-footer">
        <div class="page-knowledgebase__article-stats">
          <div class="page-knowledgebase__views-count">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 2C4.5 2 1.73 4.11 1 6C1.73 7.89 4.5 10 8 10S14.27 7.89 15 6C14.27 4.11 11.5 2 8 2ZM8 8.5C6.62 8.5 5.5 7.38 5.5 6S6.62 3.5 8 3.5S10.5 4.62 10.5 6S9.38 8.5 8 8.5ZM8 5C7.45 5 7 5.45 7 6S7.45 7 8 7S9 6.55 9 6S8.55 5 8 5Z"/>
            </svg>
            ${article.views} views
          </div>
        </div>
        <div class="page-knowledgebase__article-actions">
          <button class="btn btn-sm btn-secondary page-knowledgebase__action-btn" onclick="previewArticle('${article.id}')">Preview</button>
          <button class="btn btn-sm btn-secondary page-knowledgebase__action-btn" onclick="editArticle('${article.id}')">Edit</button>
        </div>
      </div>
    </div>
  `).join('');
}

function filterArticles() {
  const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';
  const statusFilter = document.getElementById('status-filter')?.value || '';

  filteredArticles = currentArticles.filter(article => {
    const matchesSearch = !searchTerm || 
      article.title.toLowerCase().includes(searchTerm) ||
      article.content.toLowerCase().includes(searchTerm) ||
      article.category.toLowerCase().includes(searchTerm) ||
      article.author.toLowerCase().includes(searchTerm);
    
    const matchesStatus = !statusFilter || article.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  updateArticlesDisplay();
}

function updateArticlesDisplay() {
  const container = document.getElementById('articles-container');
  if (container) {
    container.innerHTML = renderArticles();
  }
}

// Global functions for inline event handlers
window.previewArticle = function(id) {
  const article = currentArticles.find(a => a.id === id);
  if (article) {
    openModal('Article Preview', `
      <div class="page-knowledgebase__preview-header">
        <h3 class="page-knowledgebase__preview-title">${article.title}</h3>
        <div class="page-knowledgebase__preview-meta">
          <span class="page-knowledgebase__article-category">${article.category}</span> • 
          by ${article.author} • 
          ${formatDate(article.updatedAt)} • 
          <span class="status-badge ${article.status.toLowerCase()}">${article.status}</span>
        </div>
      </div>
      <div class="page-knowledgebase__preview-content">
        ${article.content.replace(/\n/g, '<br>')}
      </div>
    `);
  }
};

window.editArticle = function(id) {
  showToast('Edit article functionality would be implemented here', 'info');
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

function truncateText(text, maxLength = 100) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
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