let products = [];
const cart = [];

const container = document.getElementById('products-container');
const searchInput = document.getElementById('search');
const categoryFilter = document.getElementById('category-filter');
const cartCount = document.getElementById('cart-count');
const cartButton = document.getElementById('cart-button');
const cartPanel  = document.getElementById('cart-panel');

// 1) Veri Yükle & UI Hazırla
fetch('./data/products.json')
  .then(res => res.json())
  .then(data => {
    products = data;
    populateCategoryFilter();
    renderProducts(products);
  });

// 2) Filtre & Arama
searchInput.addEventListener('input', () => filterAndRender());
categoryFilter.addEventListener('change', () => filterAndRender());

function filterAndRender() {
  const term = searchInput.value.toLowerCase();
  const cat  = categoryFilter.value;
  const filtered = products.filter(p =>
    (!cat || p.category === cat) &&
    p.name.toLowerCase().includes(term)
  );
  renderProducts(filtered);
}

// 3) Ürün Kartlarını Oluştur
function renderProducts(list) {
  container.innerHTML = '';
  list.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}" />
      <h3>${p.name}</h3>
      <p>$${p.price.toFixed(2)}</p>
      <button>${cart.find(item => item.id === p.id) ? 'Remove from Cart' : 'Add to Cart'}</button>
    `;
    // Buton event
    card.querySelector('button').addEventListener('click', () => {
      toggleCart(p);
      renderProducts(list);  // buton metnini güncellemek için yeniden çiz
    });
    container.appendChild(card);
  });
}

// 4) Category select doldur
function populateCategoryFilter() {
  const cats = [...new Set(products.map(p => p.category))];
  cats.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    categoryFilter.appendChild(opt);
  });
}

// 5) Cart toggle ve count güncelle
function toggleCart(product) {
  const idx = cart.findIndex(item => item.id === product.id);
  if (idx >= 0) {
    cart.splice(idx, 1);
  } else {
    cart.push(product);
  }
  updateCartUI();
}

// 6) Cart UI: badge ve panel içeriği
function updateCartUI() {
  cartCount.textContent = cart.length;
  // Panel içeriği
  cartPanel.innerHTML = '<h4>Your Cart</h4>';
  if (cart.length === 0) {
    cartPanel.innerHTML += '<p>No items in cart.</p>';
  } else {
    cart.forEach(item => {
      cartPanel.innerHTML += `
        <div class="cart-item">
          <span>${item.name}</span>
          <span>$${item.price.toFixed(2)}</span>
        </div>
      `;
    });
    const total = cart.reduce((sum, i) => sum + i.price, 0);
    cartPanel.innerHTML += `<div class="cart-total">Total: $${total.toFixed(2)}</div>`;
  }
}

// 7) Cart panel toggle
cartButton.addEventListener('click', () => {
  cartPanel.classList.toggle('visible');
});

// Başlangıçta UI güncelle
updateCartUI();
