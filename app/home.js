// function to get the current user's cart key
const getCartKey = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    return null;
  }
  return `cart_${currentUser.email}`;
};

// Fetch products from products.json
fetch("../app/products.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    console.log("Received data:", data);
    const products = Array.isArray(data.products) ? data.products : data;
    if (!Array.isArray(products)) {
      throw new Error("Products data is not in the expected format");
    }
    displayProducts(products);
  })
  .catch((error) => {
    console.error("There was a problem with the fetch operation:", error);
  });

// Display products on the page
function displayProducts(products) {
  const productContainer = document.querySelector(".product-container");

  if (!productContainer) {
    return;
  }

  products.forEach((product) => {
    const productElement = document.createElement("div");
    productElement.classList.add(
      "product",
      "col-md-4",
      "col-lg-3",
      "col-sm-12",
      "mb-5"
    );

    productElement.innerHTML = `
      <div class="card shadow">
        <img src="${product.img}" alt="${
      product.name
    }" class="img-fluid card-img-top p-3"></img>
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
    productElement
      .querySelector(".addToCart")
      .addEventListener("click", function () {
        addToCart(product);
      });
  });
}

// Add a product to the cart
const addToCart = (product) => {
  const cartKey = getCartKey();
  if (!cartKey) return;

  let cartItems = JSON.parse(localStorage.getItem(cartKey)) || [];
  const existingProductIndex = cartItems.findIndex(
    (item) => item.id === product.id
  );

  if (existingProductIndex !== -1) {
    cartItems[existingProductIndex].quantity += 1;
  } else {
    cartItems.push({ ...product, quantity: 1 });
  }

  localStorage.setItem(cartKey, JSON.stringify(cartItems));
  updateCartCount();
};

// Update the cart count in the navbar
function updateCartCount() {
  const cartKey = getCartKey();
  if (!cartKey) return;

  const cartItems = JSON.parse(localStorage.getItem(cartKey)) || [];
  const cartCountElement = document.getElementById("cart-count");
  if (cartCountElement) {
    cartCountElement.textContent = cartItems.length;
  }
}

// Check if user is logged in
function checkAuth() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const token = localStorage.getItem("token");

  if (!currentUser || !token) {
    window.location.replace("../index.html");
    return false;
  }
  return true;
}

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  if (!checkAuth()) {
    return;
  }

  // Display the user's name in the navbar
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  document.getElementById(
    "userName"
  ).textContent = `Welcome, ${currentUser.name}`;

  // Update the cart count display initially
  updateCartCount();
});
