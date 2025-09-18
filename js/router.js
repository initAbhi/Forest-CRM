// Hash-based router for Hello Forest CRM

class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    this.init();
  }

  init() {
    // Listen for hash changes
    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('load', () => this.handleRoute());
    
    // Update active nav links
    this.updateActiveNav();
  }

  register(path, handler) {
    this.routes.set(path, handler);
  }

  go(path) {
    window.location.hash = path;
  }

  handleRoute() {
    const hash = window.location.hash.slice(1) || '/login';
    let route = hash;
    let params = {};

    // Extract route parameters (e.g., /officers/ccf)
    const routeParts = hash.split('/');
    if (routeParts.length > 2) {
      route = `/${routeParts[1]}/:tab`;
      params.tab = routeParts[2];
    }

    // Find matching route
    const handler = this.routes.get(route) || this.routes.get(hash);
    
    if (handler) {
      this.currentRoute = hash;
      handler(params);
      this.updatePageTitle();
      this.updateActiveNav();
    } else {
      // Default to login if route not found
      this.go('/login');
    }
  }

  updatePageTitle() {
    const titleMap = {
      '/login': 'Login',
      '/dashboard': 'Dashboard',
      '/cases': 'Cases',
      '/knowledgebase': 'Knowledge Base',
      '/officers/ccf': 'Officers - CCF',
      '/officers/dcf': 'Officers - DCF',
      '/officers/acf': 'Officers - ACF',
      '/officers/rfo': 'Officers - RFO',
      '/upload': 'Upload Data'
    };

    const title = titleMap[this.currentRoute] || 'Hello Forest';
    const titleElement = document.getElementById('page-title');
    if (titleElement) {
      titleElement.textContent = title;
    }
    document.title = `${title} - Hello Forest CRM`;
  }

  updateActiveNav() {
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });

    // Add active class to current route
    const currentLink = document.querySelector(`[data-route="${this.currentRoute}"]`);
    if (currentLink) {
      currentLink.classList.add('active');
    }

    // Handle submenu for officers section
    if (this.currentRoute && this.currentRoute.startsWith('/officers/')) {
      const officersToggle = document.querySelector('.submenu-toggle');
      if (officersToggle) {
        officersToggle.classList.add('active');
      }
    }
  }

  getCurrentRoute() {
    return this.currentRoute;
  }
}

export default Router;