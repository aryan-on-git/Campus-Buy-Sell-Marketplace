const API_URL = 'http://localhost:5000/api';

let userProducts = [];
let currentToken = null;
let currentUser = null;
let productToDelete = null;
let productToEdit = null;

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

  // Load user's products
  loadMyProducts();

  // Setup event listeners
  setupEventListeners();
});

// Setup all event listeners
function setupEventListeners() {
  document.getElementById('statusFilter').addEventListener('change', handleStatusFilter);
  document.getElementById('logoutBtn').addEventListener('click', handleLogout);

  // Edit modal
  const editModal = document.getElementById('editModal');
  const editCloseBtn = editModal.querySelector('.close');
  const editForm = document.getElementById('editForm');

  editCloseBtn.addEventListener('click', () => {
    editModal.classList.remove('show');
  });

  window.addEventListener('click', (e) => {
    if (e.target === editModal) {
      editModal.classList.remove('show');
    }
  });

  editForm.addEventListener('submit', handleEditProduct);

  // Delete modal
  const deleteModal = document.getElementById('deleteModal');
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

  confirmDeleteBtn.addEventListener('click', handleConfirmDelete);
  cancelDeleteBtn.addEventListener('click', () => {
    deleteModal.classList.remove('show');
    productToDelete = null;
  });

  window.addEventListener('click', (e) => {
    if (e.target === deleteModal) {
      deleteModal.classList.remove('show');
    }
  });
}

// Load user's products from API
async function loadMyProducts() {
  try {
    showSpinner(true);
    const response = await fetch(`${API_URL}/products/user/my-products`, {
      headers: {
        'Authorization': `Bearer ${currentToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to load products');
    }

    const data = await response.json();
    userProducts = data.data || [];
    displayProducts(userProducts);
    showSpinner(false);
  } catch (error) {
    console.error('Error loading products:', error);
    document.getElementById('productsTable').style.display = 'none';
    document.getElementById('noProducts').style.display = 'block';
    showSpinner(false);
  }
}

// Display products in table
function displayProducts(products) {
  const tbody = document.getElementById('productsBody');
  const noProducts = document.getElementById('noProducts');
  const productsTable = document.getElementById('productsTable');

  if (products.length === 0) {
    productsTable.style.display = 'none';
    noProducts.style.display = 'block';
    return;
  }

  noProducts.style.display = 'none';
  productsTable.style.display = 'block';

  tbody.innerHTML = products.map(product => `
    <tr>
      <td>
        <strong>${product.name}</strong>
      </td>
      <td>${formatCategory(product.category)}</td>
      <td class="product-price">₹${product.price}</td>
      <td>
        <span class="status-badge ${product.isAvailable ? 'status-available' : 'status-sold'}">
          ${product.isAvailable ? 'Available' : 'Sold'}
        </span>
      </td>
      <td class="created-date">${formatDate(product.createdAt)}</td>
      <td class="views-count">${product.views || 0}</td>
      <td>
        <div class="action-buttons">
          <button class="btn-edit" onclick="openEditModal('${product._id}')">Edit</button>
          <button class="btn-delete" onclick="openDeleteModal('${product._id}', '${product.name}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// Handle status filter
function handleStatusFilter() {
  const status = document.getElementById('statusFilter').value;

  if (status === '') {
    displayProducts(userProducts);
  } else if (status === 'available') {
    const filtered = userProducts.filter(p => p.isAvailable === true);
    displayProducts(filtered);
  } else if (status === 'sold') {
    const filtered = userProducts.filter(p => p.isAvailable === false);
    displayProducts(filtered);
  }
}

// Open edit modal
function openEditModal(productId) {
  const product = userProducts.find(p => p._id === productId);

  if (!product) {
    alert('Product not found');
    return;
  }

  productToEdit = product;

  // Populate form
  document.getElementById('editProductName').value = product.name;
  document.getElementById('editProductDescription').value = product.description;
  document.getElementById('editProductCategory').value = product.category;
  document.getElementById('editProductPrice').value = product.price;
  document.getElementById('editProductCondition').value = product.condition;
  document.getElementById('editProductStatus').value = product.isAvailable;

  // Show modal
  document.getElementById('editModal').classList.add('show');
}

// Handle edit product
async function handleEditProduct(e) {
  e.preventDefault();

  if (!productToEdit) return;

  const name = document.getElementById('editProductName').value;
  const description = document.getElementById('editProductDescription').value;
  const category = document.getElementById('editProductCategory').value;
  const price = parseFloat(document.getElementById('editProductPrice').value);
  const condition = document.getElementById('editProductCondition').value;
  const isAvailable = document.getElementById('editProductStatus').value === 'true';
  const messageDiv = document.getElementById('editMessage');

  try {
    const response = await fetch(`${API_URL}/products/${productToEdit._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentToken}`
      },
      body: JSON.stringify({
        name,
        description,
        category,
        price,
        condition,
        isAvailable
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update product');
    }

    // Update local state
    const index = userProducts.findIndex(p => p._id === productToEdit._id);
    if (index !== -1) {
      userProducts[index] = data.data;
    }

    messageDiv.textContent = 'Product updated successfully!';
    messageDiv.className = 'form-message success';

    setTimeout(() => {
      document.getElementById('editModal').classList.remove('show');
      displayProducts(userProducts);
      messageDiv.textContent = '';
      messageDiv.className = 'form-message';
      productToEdit = null;
    }, 1500);
  } catch (error) {
    messageDiv.textContent = error.message;
    messageDiv.className = 'form-message error';
  }
}

// Open delete confirmation modal
function openDeleteModal(productId, productName) {
  productToDelete = productId;
  document.getElementById('deleteProductName').textContent = productName;
  document.getElementById('deleteModal').classList.add('show');
}

// Handle confirm delete
async function handleConfirmDelete() {
  if (!productToDelete) return;

  try {
    const response = await fetch(`${API_URL}/products/${productToDelete}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${currentToken}`
      }
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to delete product');
    }

    // Remove from local state
    userProducts = userProducts.filter(p => p._id !== productToDelete);

    // Close modal and refresh display
    document.getElementById('deleteModal').classList.remove('show');
    productToDelete = null;
    displayProducts(userProducts);
  } catch (error) {
    alert('Error: ' + error.message);
    document.getElementById('deleteModal').classList.remove('show');
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

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}
