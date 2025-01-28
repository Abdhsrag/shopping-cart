// function to get the current user's cart key
const getCartKey = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    return null;
  }
  return `cart_${currentUser.email}`;
};

// Display the cart items
const displayCart = () => {
  const cartKey = getCartKey();
  if (!cartKey) return;

  let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

  // Ensure every product in the cart has a quantity property
  cart = cart.map((product) => {
    if (!product.quantity) {
      product.quantity = 1;
    }
    return product;
  });

  // Save updated cart back to localStorage
  localStorage.setItem(cartKey, JSON.stringify(cart));

  const cartContainer = document.getElementById("cart-container");

  if (cart.length === 0) {
    cartContainer.innerHTML = `<p>Cart is empty</p>`;
  } else {
    cartContainer.innerHTML = "";
    cart.forEach((product, index) => {
      const productHTML = `
      <div class="cart-item card shadow col-12 my-3">
        <div class="row my-3">
          <div class="col-md-5 col-sm-12">
            <img src="${product.img}" alt="${product.name}" class="cart-item-image img-fluid card-img-top p-3">
          </div>
          <div class="cart-item-details col-md-7 col-sm-12 d-flex justify-content-center flex-column align-items-start ps-5">
            <h4>${product.name}</h4>
            <p>${product.description}</p>
            <p>Price: $${product.price}</p>
            <div class="d-flex align-items-center mt-3">
              <button class="btn cart-btns btn-danger btn-sm remove-btn me-3" onclick="removeOne(${index})">-</button>
              <span class="quantity fs-4">${product.quantity}</span>
              <button class="btn cart-btns btn-success btn-sm add-btn ms-3" onclick="addOne(${index})">+</button>
            </div>
            <button class="btn cart-btns btn-danger btn-lg mt-3" onclick="removeFromCart(${index})">Remove Product</button>
          </div>
        </div>
      </div>`;
      cartContainer.innerHTML += productHTML;
    });
  }
};

// Increment the quantity of a product
const addOne = (productId) => {
  const cartKey = getCartKey();
  if (!cartKey) return;

  const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  cart[productId].quantity += 1;
  localStorage.setItem(cartKey, JSON.stringify(cart));
  displayCart();
  displayTotal();
};

// Decrement the quantity of a product
const removeOne = (productId) => {
  const cartKey = getCartKey();
  if (!cartKey) return;

  const cart = JSON.parse(localStorage.getItem(cartKey)) || [];

  if (cart[productId].quantity > 1) {
    cart[productId].quantity -= 1;
  } else {
    cart.splice(productId, 1);
  }

  localStorage.setItem(cartKey, JSON.stringify(cart));
  displayCart();
  displayTotal();
};

// Remove the entire product from the cart
const removeFromCart = (productId) => {
  const cartKey = getCartKey();
  if (!cartKey) return;

  let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  cart.splice(productId, 1);
  localStorage.setItem(cartKey, JSON.stringify(cart));
  displayCart();
  displayTotal();
};

// Add a product to the cart
const addToCart = (product) => {
  const cartKey = getCartKey();
  if (!cartKey) return;

  const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  const existingProductIndex = cart.findIndex(
    (item) => item.name === product.name
  );

  if (existingProductIndex !== -1) {
    cart[existingProductIndex].quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem(cartKey, JSON.stringify(cart));
  displayCart();
  displayTotal();
};

// Calculate the total price of the cart
const calculateTotalPrice = () => {
  const cartKey = getCartKey();
  if (!cartKey) return 0;

  const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  return cart.reduce(
    (total, product) => total + product.price * (product.quantity || 1),
    0
  );
};

// Display the total price
const displayTotal = () => {
  const totalPriceElement = document.getElementById("total-price");
  const total = calculateTotalPrice();
  totalPriceElement.innerHTML = `Total: $${total}`;
};

// One-time function to fix existing cart data
const fixCartData = () => {
  const cartKey = getCartKey();
  if (!cartKey) return;

  let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

  cart = cart.map((product) => {
    if (!product.quantity) {
      product.quantity = 1;
    }
    return product;
  });

  localStorage.setItem(cartKey, JSON.stringify(cart));
};

// Initialize the cart on page load
document.addEventListener("DOMContentLoaded", () => {
  if (!checkAuth()) {
    console.log("Auth check failed - stopping page load");
    return;
  }

  fixCartData();
  displayCart();
  displayTotal();

  // Display the current user's name
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  document.getElementById(
    "userName"
  ).textContent = `Welcome, ${currentUser.name}`;
});

// Auth check function
function checkAuth() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const token = localStorage.getItem("token");

  if (!currentUser || !token) {
    console.log("No auth data found - redirecting to login");
    window.location.replace("../index.html");
    return false;
  }
  return true;
}