// Dashboard page functionality

document.addEventListener('DOMContentLoaded', () => {
  // Check if user is logged in
  if (!localStorage.getItem('isLoggedIn')) {
    window.location.href = '../login/login.html';
    return;
  }

  // Initialize dashboard
  initializeDashboard();
  setupEventListeners();
});

function initializeDashboard() {
  const pageContent = document.getElementById('page-content');
  
  if (!window.dashboardData) {
    console.error('Dashboard data not available');
    return;
  }

  const content = `
    <div class="page-dashboard__widgets">
      <div class="page-dashboard__kpi-card">
        <h3 class="page-dashboard__kpi-title">Today's Calls</h3>
        <div class="page-dashboard__kpi-value page-dashboard__kpi-value--calls">${window.dashboardData.kpis.todaysCalls}</div>
      </div>
      <div class="page-dashboard__kpi-card">
        <h3 class="page-dashboard__kpi-title">Open Cases</h3>
        <div class="page-dashboard__kpi-value page-dashboard__kpi-value--cases">${window.dashboardData.kpis.openCases}</div>
      </div>
      <div class="page-dashboard__kpi-card">
        <h3 class="page-dashboard__kpi-title">Avg Response</h3>
        <div class="page-dashboard__kpi-value page-dashboard__kpi-value--response">${window.dashboardData.kpis.avgResponse}</div>
      </div>
      <div class="page-dashboard__kpi-card">
        <h3 class="page-dashboard__kpi-title">Public KB</h3>
        <div class="page-dashboard__kpi-value page-dashboard__kpi-value--kb">${window.dashboardData.kpis.publicKB}</div>
      </div>
    </div>

    <div class="page-dashboard__main-grid">
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Activity Overview</h2>
        </div>
        <div class="page-dashboard__chart-container">
          <canvas id="activity-chart" class="page-dashboard__chart"></canvas>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Recent Activity</h2>
        </div>
        <div class="page-dashboard__activity-list">
          ${window.dashboardData.recentActivity.map(activity => `
            <div class="page-dashboard__activity-item">
              <div class="page-dashboard__activity-description">${activity.description}</div>
              <div class="page-dashboard__activity-meta">by ${activity.user} • ${formatDate(activity.timestamp)}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Quick Actions</h2>
      </div>
      <div class="page-dashboard__quick-actions">
        <a href="../cases/cases.html" class="page-dashboard__quick-action page-dashboard__quick-action--primary">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 5V15M5 10H15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          Create Case
        </a>
        <a href="../knowledgebase/knowledgebase.html" class="page-dashboard__quick-action">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M4 2H16C17.1 2 18 2.9 18 4V16C18 17.1 17.1 18 16 18H4C2.9 18 2 17.1 2 16V4C2 2.9 2.9 2 4 2Z"/>
          </svg>
          New Article
        </a>
      </div>
    </div>
  `;

  pageContent.innerHTML = content;
  
  // Draw the activity chart
  setTimeout(() => {
    drawActivityChart();
  }, 100);
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

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function drawActivityChart() {
  const canvas = document.getElementById('activity-chart');
  if (!canvas || !window.dashboardData) return;

  const ctx = canvas.getContext('2d');
  const rect = canvas.getBoundingClientRect();
  
  // Set canvas size to match display size
  canvas.width = rect.width * window.devicePixelRatio;
  canvas.height = rect.height * window.devicePixelRatio;
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  
  const width = rect.width;
  const height = rect.height;

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Draw simple line chart
  ctx.strokeStyle = '#3e8f6a';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  const data = window.dashboardData.chartData.calls;
  const padding = 40;
  const chartWidth = width - (padding * 2);
  const chartHeight = height - (padding * 2);
  
  if (data.length < 2) return;
  
  const stepX = chartWidth / (data.length - 1);
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const valueRange = maxValue - minValue || 1;

  // Draw grid lines
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  
  // Horizontal grid lines
  for (let i = 0; i <= 4; i++) {
    const y = padding + (chartHeight / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }
  
  // Vertical grid lines
  for (let i = 0; i < data.length; i++) {
    const x = padding + stepX * i;
    ctx.beginPath();
    ctx.moveTo(x, padding);
    ctx.lineTo(x, height - padding);
    ctx.stroke();
  }

  // Draw data line
  ctx.strokeStyle = '#3e8f6a';
  ctx.lineWidth = 3;
  ctx.beginPath();

  data.forEach((value, index) => {
    const x = padding + index * stepX;
    const normalizedValue = (value - minValue) / valueRange;
    const y = height - padding - (normalizedValue * chartHeight);
    
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();

  // Draw data points
  ctx.fillStyle = '#2f6b4f';
  data.forEach((value, index) => {
    const x = padding + index * stepX;
    const normalizedValue = (value - minValue) / valueRange;
    const y = height - padding - (normalizedValue * chartHeight);
    
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  // Draw labels
  ctx.fillStyle = '#718096';
  ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  
  // X-axis labels (days)
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Today'];
  data.forEach((value, index) => {
    if (index < days.length) {
      const x = padding + index * stepX;
      ctx.fillText(days[index], x, height - 10);
    }
  });
  
  // Y-axis labels
  ctx.textAlign = 'right';
  for (let i = 0; i <= 4; i++) {
    const value = minValue + (valueRange / 4) * (4 - i);
    const y = padding + (chartHeight / 4) * i + 4;
    ctx.fillText(Math.round(value).toString(), padding - 10, y);
  }
}

// Handle window resize for chart
window.addEventListener('resize', () => {
  setTimeout(drawActivityChart, 100);
});