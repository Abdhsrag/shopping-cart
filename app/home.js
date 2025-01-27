// Fetch products from products.json
fetch('../app/products.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log('Received data:', data); 
    const products = Array.isArray(data.products) ? data.products : data;
    if (!Array.isArray(products)) {
      throw new Error('Products data is not in the expected format');
    }
    displayProducts(products); 
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });

let cartItems = JSON.parse(localStorage.getItem('cartItems')) || []; 
let cartCount = cartItems.length; 

function displayProducts(products) {
  const productContainer = document.querySelector('.product-container');
  
  if (!productContainer) {
    console.error('Product container not found');
    return;
  }
  
  products.forEach(product => {
    const productElement = document.createElement('div');
    productElement.classList.add('product', 'col-md-4','col-lg-3', 'col-sm-12', 'mb-5');

    productElement.innerHTML = `
      <div class="card shadow">
        <img src="${product.img}" alt="${product.name}" class="img-fluid card-img-top p-3"></img>
        <div class="card-body">
          <h3 class="card-title">${product.name}</h3>
          <p class="card-text">${product.description}</p>
          <p class="price">$${product.price.toFixed(2)}</p>
          <a class="btn btn-primary addToCart">Add to Cart</a>
        </div>
      </div>
    `; 
    productContainer.appendChild(productElement);
    
    // Add event listener for the "Add to Cart" button
    productElement.querySelector('.addToCart').addEventListener('click', function() {
      if (!cartItems.some(item => item.id === product.id)) {
        cartItems.push(product); 
        cartCount++; 
        document.getElementById('cart-count').textContent = cartCount; 
        localStorage.setItem('cartItems', JSON.stringify(cartItems)); 
      }
    });
  });
}

// Check if user is logged in
const userData = JSON.parse(localStorage.getItem('user'));
if (!userData) {
  // Redirect to login page if not logged in
  window.location.href = '../index.html';
} else {
  // Display the user's name in the navbar
  document.getElementById('userName').textContent = `Welcome, ${userData.name}`;
}

const count = document.getElementById('cart-count');

// Get the cart count element
const cartCountElement = document.getElementById('cart-count');

// Function to update the cart count display
function updateCartCount() {
  cartCountElement.textContent = cartItems.length;
}

// Add event listener for the "Add to Cart" button
document.querySelectorAll('.addToCart').forEach(button => {
  button.addEventListener('click', function() {
    const productId = this.closest('.product').dataset.productId;
    const existingItem = cartItems.find(item => item.id === productId);
    
    if (!existingItem) {
      const newItem = { id: productId };
      cartItems.push(newItem);
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      updateCartCount();
    }
  });
});

// Update the cart count display initially
updateCartCount();
