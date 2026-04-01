const API_URL = 'http://localhost:5000/api';

let allProducts = [];
let currentToken = null;
let currentUser = null;

// Check authentication on page load
window.addEventListener('load', () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (!token || !user) {
    window.location.href = '/auth.html';
    return;
  }

  currentToken = token;
  currentUser = JSON.parse(user);
  
  // Display user name in navbar
  document.getElementById('userDisplayName').textContent = currentUser.name || 'User';

  // Load products
  loadProducts();

  // Setup event listeners
  setupEventListeners();
});

// Setup all event listeners
function setupEventListeners() {
  document.getElementById('searchBtn').addEventListener('click', handleSearch);
  document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
  });

  document.getElementById('categoryFilter').addEventListener('change', handleFilter);
  document.getElementById('clearFilters').addEventListener('click', clearFilters);
  document.getElementById('logoutBtn').addEventListener('click', handleLogout);
  document.getElementById('sellLink').addEventListener('click', (e) => {
    e.preventDefault();
    openSellModal();
  });

  // Modal handlers
  const modal = document.getElementById('sellModal');
  const closeBtn = document.querySelector('.close');
  const sellForm = document.getElementById('sellForm');

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('show');
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('show');
    }
  });

  sellForm.addEventListener('submit', handleCreateProduct);
}

// Load products from API
async function loadProducts() {
  try {
    showSpinner(true);
    const response = await fetch(`${API_URL}/products`, {
      headers: {
        'Authorization': `Bearer ${currentToken}`
      }
    });

    if (!response.ok) {
      // If 404, it means no products endpoint yet (during development)
      // Create mock data for demo
      allProducts = generateMockProducts();
    } else {
      const data = await response.json();
      allProducts = data.data || [];
    }

    displayProducts(allProducts);
    showSpinner(false);
  } catch (error) {
    console.error('Error loading products:', error);
    // Use mock data if API fails
    allProducts = generateMockProducts();
    displayProducts(allProducts);
    showSpinner(false);
  }
}

// Generate mock products for demo
function generateMockProducts() {
  return [
    {
      _id: '1',
      name: 'JavaScript Book',
      description: 'Learn JavaScript from scratch - practically new condition',
      category: 'books',
      price: 250,
      condition: 'like-new',
      seller: { name: 'Aryan' }
    },
    {
      _id: '2',
      name: 'Used Laptop Bag',
      description: 'Durable laptop bag, perfect for college. Good condition',
      category: 'other',
      price: 400,
      condition: 'good',
      seller: { name: 'Priya' }
    },
    {
      _id: '3',
      name: 'Study Table',
      description: 'Wooden study table, compact design. Excellent for dorms',
      category: 'furniture',
      price: 1500,
      condition: 'good',
      seller: { name: 'Rohan' }
    },
    {
      _id: '4',
      name: 'Arduino Kit',
      description: 'Complete Arduino starter kit with sensors and documentation',
      category: 'electronics',
      price: 800,
      condition: 'new',
      seller: { name: 'Dev' }
    },
    {
      _id: '5',
      name: 'Cricket Bat',
      description: 'Premium cricket bat, used but in excellent condition',
      category: 'sports',
      price: 1200,
      condition: 'like-new',
      seller: { name: 'Aditya' }
    },
    {
      _id: '6',
      name: 'Winter Jacket',
      description: 'Warm winter jacket, XL size, perfect for campus',
      category: 'clothing',
      price: 600,
      condition: 'good',
      seller: { name: 'Neha' }
    }
  ];
}

// Display products in grid
function displayProducts(products) {
  const grid = document.getElementById('productsGrid');
  const noProducts = document.getElementById('noProducts');
  const productCount = document.getElementById('productCount');

  if (products.length === 0) {
    grid.innerHTML = '';
    noProducts.style.display = 'block';
    productCount.textContent = 'No products found';
    return;
  }

  noProducts.style.display = 'none';
  productCount.textContent = `${products.length} product${products.length !== 1 ? 's' : ''} found`;

  grid.innerHTML = products.map(product => `
    <div class="product-card">
      <div class="product-image">📦</div>
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <span class="product-category">${formatCategory(product.category)}</span>
        <p class="product-description">${product.description}</p>
        <div class="product-footer">
          <span class="product-price">₹${product.price}</span>
          <span class="product-condition">${formatCondition(product.condition)}</span>
        </div>
      </div>
    </div>
  `).join('');
}

// Handle search
function handleSearch() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const category = document.getElementById('categoryFilter').value;

  const filtered = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                         product.description.toLowerCase().includes(searchTerm);
    const matchesCategory = category === '' || product.category === category;
    return matchesSearch && matchesCategory;
  });

  displayProducts(filtered);
}

// Handle filter
function handleFilter() {
  handleSearch();
}

// Clear filters
function clearFilters() {
  document.getElementById('searchInput').value = '';
  document.getElementById('categoryFilter').value = '';
  displayProducts(allProducts);
}

// Open sell modal
function openSellModal() {
  const modal = document.getElementById('sellModal');
  modal.classList.add('show');
}

// Handle create product
async function handleCreateProduct(e) {
  e.preventDefault();

  const name = document.getElementById('productName').value;
  const description = document.getElementById('productDescription').value;
  const category = document.getElementById('productCategory').value;
  const price = parseFloat(document.getElementById('productPrice').value);
  const condition = document.getElementById('productCondition').value;
  const messageDiv = document.getElementById('sellMessage');

  try {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentToken}`
      },
      body: JSON.stringify({
        name,
        description,
        category,
        price,
        condition
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create product');
    }

    // Add to mock products for demo
    allProducts.push({
      ...data,
      seller: { name: currentUser.name }
    });

    messageDiv.textContent = 'Product listed successfully!';
    messageDiv.className = 'form-message success';

    // Reset form and close modal
    document.getElementById('sellForm').reset();
    setTimeout(() => {
      document.getElementById('sellModal').classList.remove('show');
      displayProducts(allProducts);
    }, 1500);
  } catch (error) {
    messageDiv.textContent = error.message;
    messageDiv.className = 'form-message error';
  }
}

// Handle logout
function handleLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/auth.html';
}

// Utility functions
function showSpinner(show) {
  const spinner = document.getElementById('loadingSpinner');
  if (show) {
    spinner.classList.add('show');
  } else {
    spinner.classList.remove('show');
  }
}

function formatCategory(category) {
  const categories = {
    'books': 'Books',
    'electronics': 'Electronics',
    'furniture': 'Furniture',
    'clothing': 'Clothing',
    'sports': 'Sports Equipment',
    'other': 'Other'
  };
  return categories[category] || category;
}

function formatCondition(condition) {
  const conditions = {
    'new': 'New',
    'like-new': 'Like New',
    'good': 'Good',
    'fair': 'Fair'
  };
  return conditions[condition] || condition;
}
