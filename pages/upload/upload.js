// Upload page functionality

let currentFile = null;
let previewData = null;

document.addEventListener('DOMContentLoaded', () => {
  // Check if user is logged in
  if (!localStorage.getItem('isLoggedIn')) {
    window.location.href = '../login/login.html';
    return;
  }

  // Initialize upload page
  initializeUpload();
  setupEventListeners();
});

function initializeUpload() {
  renderUploadPage();
}

function renderUploadPage() {
  const pageContent = document.getElementById('page-content');
  
  const content = `
    <div class="page-upload__container">
      <div class="page-upload__card">
        <div class="page-upload__header">
          <h2 class="page-upload__title">Upload CSV Data</h2>
          <p class="page-upload__description">Upload CSV files to import data into the system</p>
        </div>
        
        <div id="upload-area" class="page-upload__drop-zone">
          <svg class="page-upload__drop-icon" viewBox="0 0 48 48" fill="currentColor">
            <path d="M24 8L32 16H28V28H20V16H16L24 8ZM8 32H40V36H8V32Z"/>
          </svg>
          <h3 class="page-upload__drop-title">Drop CSV file here</h3>
          <p class="page-upload__drop-subtitle">or click to browse</p>
          <button class="page-upload__browse-btn" type="button">Choose File</button>
          <input type="file" id="file-input" accept=".csv" class="page-upload__file-input">
        </div>

        <div id="file-info" class="page-upload__file-info hidden">
          <div class="page-upload__file-name" id="file-name"></div>
          <div class="page-upload__file-size" id="file-size"></div>
        </div>

        <div id="progress" class="page-upload__progress">
          <div class="page-upload__progress-bar">
            <div class="page-upload__progress-fill" id="progress-fill"></div>
          </div>
          <div class="page-upload__progress-text" id="progress-text">Uploading...</div>
        </div>

        <div id="error-message" class="page-upload__error">
          <strong>Error:</strong> <span id="error-text"></span>
        </div>

        <div id="success-message" class="page-upload__success">
          <strong>Success:</strong> File uploaded and processed successfully!
        </div>

        <div id="preview-container" class="page-upload__preview hidden">
          <div class="page-upload__preview-header">
            <h3 class="page-upload__preview-title">Preview</h3>
            <span class="page-upload__preview-info" id="preview-info"></span>
          </div>
          <div class="page-upload__preview-table" id="preview-table"></div>
          
          <div class="page-upload__actions">
            <button class="btn btn-secondary" id="cancel-btn">Cancel</button>
            <button class="btn btn-primary" id="import-btn">Import Data</button>
          </div>
        </div>

        <div class="page-upload__formats">
          <h4 class="page-upload__formats-title">Supported File Formats & Requirements</h4>
          <div class="page-upload__formats-list">
            <p><strong>CSV Files:</strong> Comma-separated values with proper headers</p>
            <ul>
              <li>Maximum file size: 10MB</li>
              <li>UTF-8 encoding recommended</li>
              <li>First row should contain column headers</li>
              <li>Supported data types: Cases, Officers, Knowledge Base articles</li>
            </ul>
            <p><strong>Example CSV structure for Cases:</strong></p>
            <code>caseNo,name,phone,email,category,status,priority,description</code>
          </div>
        </div>
      </div>
    </div>
  `;

  pageContent.innerHTML = content;
  setupUploadEventListeners();
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

function setupUploadEventListeners() {
  const uploadArea = document.getElementById('upload-area');
  const fileInput = document.getElementById('file-input');
  const browseBtn = document.querySelector('.page-upload__browse-btn');

  // Click to browse
  uploadArea.addEventListener('click', () => fileInput.click());
  browseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput.click();
  });

  // Drag and drop
  uploadArea.addEventListener('dragover', handleDragOver);
  uploadArea.addEventListener('dragleave', handleDragLeave);
  uploadArea.addEventListener('drop', handleDrop);

  // File input change
  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  });

  // Action buttons
  document.getElementById('cancel-btn')?.addEventListener('click', resetUpload);
  document.getElementById('import-btn')?.addEventListener('click', importData);

  // Prevent default drag behaviors on document
  document.addEventListener('dragover', (e) => e.preventDefault());
  document.addEventListener('drop', (e) => e.preventDefault());
}

function handleDragOver(e) {
  e.preventDefault();
  e.currentTarget.classList.add('dragover');
}

function handleDragLeave(e) {
  e.preventDefault();
  e.currentTarget.classList.remove('dragover');
}

function handleDrop(e) {
  e.preventDefault();
  const uploadArea = e.currentTarget;
  uploadArea.classList.remove('dragover');
  uploadArea.classList.add('drop-success');
  
  setTimeout(() => {
    uploadArea.classList.remove('drop-success');
  }, 300);

  const files = e.dataTransfer.files;
  if (files.length > 0) {
    handleFileSelection(files[0]);
  }
}

function handleFileSelection(file) {
  // Validate file type
  if (!file.name.toLowerCase().endsWith('.csv')) {
    showError('Please select a CSV file');
    return;
  }

  // Validate file size (10MB limit)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    showError('File size must be less than 10MB');
    return;
  }

  currentFile = file;
  showFileInfo(file);
  processFile(file);
}

function showFileInfo(file) {
  const fileInfo = document.getElementById('file-info');
  const fileName = document.getElementById('file-name');
  const fileSize = document.getElementById('file-size');

  fileName.textContent = file.name;
  fileSize.textContent = `${formatFileSize(file.size)} • ${file.type || 'CSV file'}`;
  
  fileInfo.classList.remove('hidden');
  hideError();
  hideSuccess();
}

function processFile(file) {
  showProgress();
  
  const reader = new FileReader();
  
  reader.onload = function(e) {
    try {
      const csv = e.target.result;
      const parsedData = parseCSV(csv);
      
      if (parsedData.rows.length === 0) {
        throw new Error('CSV file appears to be empty');
      }
      
      previewData = parsedData;
      showPreview(parsedData);
      hideProgress();
      
    } catch (error) {
      hideProgress();
      showError(`Failed to process file: ${error.message}`);
    }
  };
  
  reader.onerror = function() {
    hideProgress();
    showError('Failed to read file');
  };
  
  // Simulate progress
  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += Math.random() * 30;
    if (progress >= 90) {
      clearInterval(progressInterval);
      progress = 90;
    }
    updateProgress(progress);
  }, 100);
  
  setTimeout(() => {
    clearInterval(progressInterval);
    updateProgress(100);
    reader.readAsText(file);
  }, 1000);
}

function parseCSV(csv) {
  const lines = csv.split('\n').filter(line => line.trim());
  
  if (lines.length === 0) {
    throw new Error('CSV file is empty');
  }
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const rows = lines.slice(1, 51).map(line => {
    return line.split(',').map(cell => cell.trim().replace(/"/g, ''));
  });
  
  return {
    headers,
    rows,
    totalRows: lines.length - 1
  };
}

function showPreview(data) {
  const container = document.getElementById('preview-container');
  const table = document.getElementById('preview-table');
  const info = document.getElementById('preview-info');
  
  info.textContent = `Showing first ${Math.min(data.rows.length, 50)} of ${data.totalRows} rows`;
  
  const tableHTML = `
    <table class="table">
      <thead>
        <tr>${data.headers.map(h => `<th>${h}</th>`).join('')}</tr>
      </thead>
      <tbody>
        ${data.rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
      </tbody>
    </table>
  `;
  
  table.innerHTML = tableHTML;
  container.classList.remove('hidden');
}

function importData() {
  if (!previewData) {
    showError('No data to import');
    return;
  }
  
  showProgress();
  updateProgress(0);
  
  // Simulate import process
  let progress = 0;
  const importInterval = setInterval(() => {
    progress += Math.random() * 20;
    if (progress >= 90) {
      clearInterval(importInterval);
      progress = 90;
    }
    updateProgress(progress);
  }, 200);
  
  setTimeout(() => {
    clearInterval(importInterval);
    updateProgress(100);
    hideProgress();
    showSuccess();
    
    // Reset after success
    setTimeout(() => {
      resetUpload();
    }, 3000);
  }, 2000);
}

function resetUpload() {
  currentFile = null;
  previewData = null;
  
  // Reset file input
  document.getElementById('file-input').value = '';
  
  // Hide all sections
  document.getElementById('file-info').classList.add('hidden');
  document.getElementById('preview-container').classList.add('hidden');
  hideProgress();
  hideError();
  hideSuccess();
}

function showProgress() {
  document.getElementById('progress').style.display = 'block';
}

function hideProgress() {
  document.getElementById('progress').style.display = 'none';
}

function updateProgress(percent) {
  const fill = document.getElementById('progress-fill');
  const text = document.getElementById('progress-text');
  
  fill.style.width = `${percent}%`;
  text.textContent = `${Math.round(percent)}% complete`;
}

function showError(message) {
  const errorDiv = document.getElementById('error-message');
  const errorText = document.getElementById('error-text');
  
  errorText.textContent = message;
  errorDiv.style.display = 'block';
}

function hideError() {
  document.getElementById('error-message').style.display = 'none';
}

function showSuccess() {
  document.getElementById('success-message').style.display = 'block';
}

function hideSuccess() {
  document.getElementById('success-message').style.display = 'none';
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}