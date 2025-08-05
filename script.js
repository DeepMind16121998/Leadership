// Simulate user database
const users = [];

// DOM elements
const authSection = document.getElementById('authentication');
const dashboardSection = document.getElementById('dashboard');
const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const switchToLogin = document.getElementById('switchToLogin');
const switchToRegister = document.getElementById('switchToRegister');
const notification = document.getElementById('notification');
const notificationMessage = document.getElementById('notification-message');

// Mobile navigation
function setupMobileNavigation() {
  document.querySelectorAll('.mobile-nav-btn[data-page]').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Hide all dashboard pages
      document.querySelectorAll('.dashboard-page').forEach(page => {
        page.style.display = 'none';
      });
      
      // Show the selected page
      const pageId = 'page-' + btn.getAttribute('data-page');
      const pageDiv = document.getElementById(pageId);
      if (pageDiv) {
        pageDiv.style.display = 'block';
      }
      
      // Update active state
      document.querySelectorAll('.mobile-nav-btn').forEach(nav => {
        nav.classList.remove('active');
      });
      btn.classList.add('active');
    });
  });
  
  // Handle feature grid navigation
  document.querySelectorAll('[data-page]').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const page = this.getAttribute('data-page');
      const navBtn = document.querySelector(`.mobile-nav-btn[data-page="${page}"]`);
      if (navBtn) {
        navBtn.click();
      } else {
        // Handle pages not in bottom nav
        document.querySelectorAll('.dashboard-page').forEach(p => p.style.display = 'none');
        const pageDiv = document.getElementById('page-' + page);
        if (pageDiv) {
          pageDiv.style.display = 'block';
        }
      }
    });
  });
}

// Profile modal functionality
function openUserProfile() {
  // Create profile modal if it doesn't exist
  let modal = document.getElementById('profileModal');
  if (!modal) {
    modal = createProfileModal();
    document.body.appendChild(modal);
  }
  modal.classList.add('show');
  modal.style.display = 'flex';
}

function createProfileModal() {
  const modal = document.createElement('div');
  modal.id = 'profileModal';
  modal.className = 'profile-modal';
  modal.innerHTML = `
    <div class="profile-modal-content">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-bold">Profile</h3>
        <button onclick="closeProfileModal()" class="text-gray-400 hover:text-gray-600">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>
      
      <div class="space-y-4">
        <div class="flex items-center p-4 bg-gray-50 rounded-2xl">
          <div class="w-12 h-12 rounded-full bg-[#43cea2] bg-opacity-10 text-[#43cea2] flex items-center justify-center mr-4">
            <i class="fas fa-user"></i>
          </div>
          <div>
            <h4 class="font-medium">Account Settings</h4>
            <p class="text-gray-500 text-sm">Manage your account preferences</p>
          </div>
        </div>
        
        <div class="flex items-center p-4 bg-gray-50 rounded-2xl">
          <div class="w-12 h-12 rounded-full bg-[#43cea2] bg-opacity-10 text-[#43cea2] flex items-center justify-center mr-4">
            <i class="fas fa-shield-alt"></i>
          </div>
          <div>
            <h4 class="font-medium">Security</h4>
            <p class="text-gray-500 text-sm">Password and security settings</p>
          </div>
        </div>
        
        <div class="flex items-center p-4 bg-gray-50 rounded-2xl">
          <div class="w-12 h-12 rounded-full bg-[#43cea2] bg-opacity-10 text-[#43cea2] flex items-center justify-center mr-4">
            <i class="fas fa-bell"></i>
          </div>
          <div>
            <h4 class="font-medium">Notifications</h4>
            <p class="text-gray-500 text-sm">Manage notification preferences</p>
          </div>
        </div>
        
        <button onclick="logout()" class="w-full bg-red-500 text-white py-3 rounded-2xl font-medium hover:bg-red-600 transition-colors">
          <i class="fas fa-sign-out-alt mr-2"></i>Logout
        </button>
      </div>
    </div>
  `;
  
  // Close modal when clicking outside
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeProfileModal();
    }
  });
  
  return modal;
}

function closeProfileModal() {
  const modal = document.getElementById('profileModal');
  if (modal) {
    modal.classList.remove('show');
    setTimeout(() => {
      modal.style.display = 'none';
    }, 300);
  }
}

// Enhanced logout function
function logout() {
  localStorage.removeItem('loggedInUser');
  authSection.style.display = 'block';
  dashboardSection.style.display = 'none';
  closeProfileModal();
  showNotification('You have been logged out successfully.');
}

// Toggle completed missions
function toggleCompletedMissions() {
  const content = document.getElementById('completedMissionsContent');
  const btn = document.getElementById('toggleCompletedMissions');
  
  if (content.style.display === 'none') {
    content.style.display = 'block';
    btn.innerHTML = '<i class="fas fa-chevron-up"></i>';
  } else {
    content.style.display = 'none';
    btn.innerHTML = '<i class="fas fa-chevron-down"></i>';
  }
}

// Show notification
function showNotification(message, isSuccess = true) {
  notificationMessage.textContent = message;
  notification.className = `notification ${isSuccess ? 'success' : 'error'} show`;
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

// Switch between login/register tabs
switchToLogin.addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('login-tab').click();
});

switchToRegister.addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('register-tab').click();
});

// Form validation functions
function validateName(name) {
  return name.trim().length >= 2;
}

function validatePhone(phone) {
  return /^\d{10}$/.test(phone);
}

function validatePassword(password) {
  return password.length >= 8;
}

// Register form submission
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // Get form values
  const name = document.getElementById('regName').value;
  const phone = document.getElementById('regPhone').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  const confirmPassword = document.getElementById('regConfirmPassword').value;
  
  // Add loading state
  const submitBtn = registerForm.querySelector('.btn-submit');
  const buttonText = submitBtn.querySelector('.button-text');
  const spinner = submitBtn.querySelector('.loading-spinner');
  submitBtn.disabled = true;
  buttonText.textContent = 'Creating Account...';
  spinner.style.display = 'inline-block';
  
  // Simulate network delay
  setTimeout(() => {
    // Validation
    let isValid = true;
    
    if (!validateName(name)) {
      document.getElementById('regName').classList.add('is-invalid');
      isValid = false;
    }
    
    if (!validatePhone(phone)) {
      document.getElementById('regPhone').classList.add('is-invalid');
      isValid = false;
    }
    
    if (!validatePassword(password)) {
      document.getElementById('regPassword').classList.add('is-invalid');
      isValid = false;
    }
    
    if (password !== confirmPassword) {
      document.getElementById('regConfirmPassword').classList.add('is-invalid');
      isValid = false;
    }
    
    if (!document.getElementById('termsCheck').checked) {
      document.getElementById('termsCheck').classList.add('is-invalid');
      isValid = false;
    }
    
    if (!isValid) {
      submitBtn.disabled = false;
      buttonText.textContent = 'Create Account';
      spinner.style.display = 'none';
      showNotification('Please fix the errors in the form!', false);
      return;
    }
    
    // Create new user
    const newUser = {
      id: Date.now(),
      name,
      email: email || null,
      phone,
      password,
      balance: 1260,
      votes: 250,
      level: 2,
      joinDate: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Log user in
    loginUser(newUser);
    showNotification('Account created successfully! Welcome to VotePay.');
  }, 1000);
});

// Login form submission
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // Load users from localStorage
  const usersData = localStorage.getItem('users');
  if (usersData) {
    users.length = 0;
    users.push(...JSON.parse(usersData));
  }
  
  const identifier = document.getElementById('loginIdentifier').value;
  const password = document.getElementById('loginPassword').value;
  
  // Add loading state
  const submitBtn = loginForm.querySelector('.btn-submit');
  const buttonText = submitBtn.querySelector('.button-text');
  const spinner = submitBtn.querySelector('.loading-spinner');
  submitBtn.disabled = true;
  buttonText.textContent = 'Signing In...';
  spinner.style.display = 'inline-block';
  
  // Simulate network delay
  setTimeout(() => {
    // Find user by phone or email
    let user = users.find(u => u.phone === identifier);
    if (!user) {
      user = users.find(u => u.email === identifier);
    }
    
    if (!user || user.password !== password) {
      submitBtn.disabled = false;
      buttonText.textContent = 'Sign In';
      spinner.style.display = 'none';
      showNotification('Invalid credentials!', false);
      return;
    }
    
    loginUser(user);
    showNotification('Login successful! Welcome back.');
  }, 1000);
});

// Logout function
document.addEventListener('click', function(e) {
  if (e.target && e.target.id === 'sidebarLogout') {
    e.preventDefault();
    logout();
  }
});

// Login user
function loginUser(user) {
  authSection.style.display = 'none';
  dashboardSection.style.display = 'block';
  
  // Update username in mobile header
  document.getElementById('username').textContent = user.name;
  
  // Show dashboard and set up navigation
  document.querySelectorAll('.dashboard-page').forEach(function(page) {
    page.style.display = 'none';
  });
  
  document.getElementById('page-dashboard').style.display = 'block';
  
  // Set active nav button
  document.querySelectorAll('.mobile-nav-btn').forEach(function(nav) {
    nav.classList.remove('active');
  });
  document.querySelector('.mobile-nav-btn[data-page="dashboard"]').classList.add('active');
  
  localStorage.setItem('loggedInUser', JSON.stringify(user));
  setupMobileNavigation();
}

// Dashboard functions
function openWithdrawModal() {
  const modal = new bootstrap.Modal(document.getElementById('withdrawModal'));
  modal.show();
}

function openBuyModal() {
  const modal = new bootstrap.Modal(document.getElementById('buyModal'));
  modal.show();
}

// Select payment method
function selectPaymentMethod(method) {
  // Remove selected class from all payment methods
  document.querySelectorAll('.payment-method-card').forEach(card => {
    card.classList.remove('selected');
  });
  
  // Add selected class to clicked payment method
  const selectedCard = event.currentTarget;
  selectedCard.classList.add('selected');
  
  // Update hidden radio button
  document.querySelector(`input[name="method"][value="${method}"]`).checked = true;
  
  // Show/hide fields
  document.getElementById('bankFields').style.display = method === 'Bank Transfer' ? 'block' : 'none';
  document.getElementById('upiField').style.display = method === 'UPI' ? 'block' : 'none';
  document.getElementById('qrField').style.display = method === 'QR Code' ? 'block' : 'none';
}

// Setup mobile sidebar (legacy function - now empty)
function setupMobileSidebar() {
  // Function kept for compatibility but no longer needed
}

// Setup collapsible sections (legacy function - now empty)  
function setupCollapsibleSections() {
  // Function kept for compatibility but no longer needed
}

// Initialize charts (simplified for mobile)
function initCharts() {
  // Charts removed for mobile-first design
  // Can be re-implemented later if needed
}

// Render users table function
function renderUsersTable(tableId = 'usersTable') {
    const tableBody = document.querySelector(`#${tableId} tbody`);
    if (!tableBody) return;
    
    // Generate sample users data
    const sampleUsers = [
        { name: 'Rajesh Kumar', votes: 1250, balance: '₹8,760', level: 'Gold', online: true },
        { name: 'Priya Sharma', votes: 980, balance: '₹6,200', level: 'Silver', online: false },
        { name: 'Amit Singh', votes: 1450, balance: '₹9,850', level: 'Platinum', online: true },
        { name: 'Sneha Patel', votes: 750, balance: '₹4,320', level: 'Bronze', online: true },
        { name: 'Rohit Gupta', votes: 1180, balance: '₹7,650', level: 'Silver', online: false },
        { name: 'Kavya Reddy', votes: 1670, balance: '₹12,400', level: 'Platinum', online: true },
        { name: 'Arjun Nair', votes: 890, balance: '₹5,890', level: 'Bronze', online: false },
        { name: 'Deepika Joshi', votes: 1320, balance: '₹8,970', level: 'Gold', online: true }
    ];
    
    tableBody.innerHTML = sampleUsers.map(user => `
        <tr>
            <td>
                <div class="d-flex align-items-center">
                    <div class="avatar me-2">
                        <div class="avatar-initial bg-primary rounded-circle text-white">
                            ${user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                    </div>
                    <div>
                        <strong>${user.name}</strong>
                        <div class="text-muted small">
                            <i class="fas fa-circle ${user.online ? 'text-success' : 'text-secondary'}" style="font-size: 8px;"></i>
                            ${user.online ? 'Online' : 'Offline'}
                        </div>
                    </div>
                </div>
            </td>
            <td><span class="badge bg-info">${user.votes}</span></td>
            <td><strong class="text-success">${user.balance}</strong></td>
            <td>
                <span class="badge ${getLevelBadgeClass(user.level)}">${user.level}</span>
            </td>
        </tr>
    `).join('');
}

function getLevelBadgeClass(level) {
    switch(level) {
        case 'Bronze': return 'bg-warning';
        case 'Silver': return 'bg-secondary';
        case 'Gold': return 'bg-warning text-dark';
        case 'Platinum': return 'bg-primary';
        default: return 'bg-light text-dark';
    }
}

function animateTableScroll(tableId = 'usersTable') {
    const container = document.querySelector(`#${tableId}`).closest('.table-responsive');
    if (!container) return;
    let scrollAmount = 0;
    const maxScroll = container.scrollHeight - container.clientHeight;
    container.scrollTop = maxScroll;
    const interval = setInterval(() => {
        if (container.scrollTop > 0) {
            container.scrollTop -= 1;
        } else {
            clearInterval(interval);
        }
    }, 20);
}

// Setup period filter buttons
document.querySelectorAll('.btn-group button[data-period]').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.btn-group button').forEach(b => {
      b.classList.remove('active');
    });
    this.classList.add('active');
  });
});

// Setup interactive elements
document.querySelectorAll('.interactive-element').forEach(el => {
  el.addEventListener('click', function() {
    this.classList.add('pulse-once');
    setTimeout(() => {
      this.classList.remove('pulse-once');
    }, 500);
  });
});

// Initialize charts if dashboard is active
if (dashboardSection.style.display !== 'none') {
  initCharts();
}

// Setup refresh button
document.getElementById('refreshDashboard').addEventListener('click', function() {
  const spinner = this.querySelector('.fa-sync-alt');
  spinner.classList.add('fa-spin');
  
  // Simulate data refresh
  setTimeout(() => {
    spinner.classList.remove('fa-spin');
    showNotification('Dashboard data refreshed successfully');
  }, 800);
});

// DOMContentLoaded event
window.addEventListener('DOMContentLoaded', () => {
  // Restore users array
  const usersData = localStorage.getItem('users');
  if (usersData) {
    users.push(...JSON.parse(usersData));
  }
  
  // Restore logged-in user
  const userData = localStorage.getItem('loggedInUser');
  if (userData) {
    const user = JSON.parse(userData);
    loginUser(user);
  }
  
  // Setup mobile navigation
  setupMobileNavigation();
  
  // Setup table rendering
  renderUsersTable('usersTableDashboard');
  setTimeout(() => animateTableScroll('usersTableDashboard'), 300);
  
  // Setup mobile nav buttons with enhanced functionality
  document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const page = this.getAttribute('data-page');
      
      // Hide all pages
      document.querySelectorAll('.dashboard-page').forEach(pg => pg.style.display = 'none');
      
      // Update active state
      document.querySelectorAll('.mobile-nav-btn').forEach(navBtn => {
        navBtn.classList.remove('text-[#43cea2]');
        navBtn.classList.add('text-gray-400');
      });
      this.classList.remove('text-gray-400');
      this.classList.add('text-[#43cea2]');
      
      // Show selected page
      if (page === 'platform-users') {
        document.getElementById('page-platform-users').style.display = 'block';
        renderUsersTable();
        setTimeout(() => animateTableScroll(), 300);
      } else if (page) {
        const el = document.getElementById('page-' + page);
        if (el) el.style.display = 'block';
      }
    });
  });
  
  // Setup sidebar navigation
  document.querySelectorAll('.sidebar-nav-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      // Hide sidebar
      document.getElementById('sidebarMenu').style.display = 'none';
      document.getElementById('sidebarOverlay').style.display = 'none';
      
      const page = this.getAttribute('data-page');
      document.querySelectorAll('.dashboard-page').forEach(pg => pg.style.display = 'none');
      
      if (page === 'platform-users') {
        document.getElementById('page-platform-users').style.display = 'block';
        renderUsersTable();
        setTimeout(() => animateTableScroll(), 300);
      } else if (page) {
        const el = document.getElementById('page-' + page);
        if (el) el.style.display = 'block';
      }
    });
  });
  
  // Setup mobile menu button
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const sidebarMenu = document.getElementById('sidebarMenu');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  
  if (mobileMenuBtn && sidebarMenu && sidebarOverlay) {
    mobileMenuBtn.addEventListener('click', function() {
      sidebarMenu.style.display = 'block';
      sidebarOverlay.style.display = 'block';
    });
    
    sidebarOverlay.addEventListener('click', function() {
      sidebarMenu.style.display = 'none';
      sidebarOverlay.style.display = 'none';
    });
  }
  
  // Setup interactive elements
  document.querySelectorAll('.interactive-element').forEach(el => {
    el.addEventListener('click', function() {
      this.classList.add('pulse-once');
      setTimeout(() => {
        this.classList.remove('pulse-once');
      }, 500);
    });
  });
  
  // Setup refresh button
  const refreshBtn = document.getElementById('refreshDashboard');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', function() {
      const spinner = this.querySelector('.fa-sync-alt');
      if (spinner) {
        spinner.classList.add('fa-spin');
        
        // Simulate data refresh
        setTimeout(() => {
          spinner.classList.remove('fa-spin');
          showNotification('Dashboard data refreshed successfully');
        }, 800);
      }
    });
  }
});