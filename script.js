(function () {
    'use strict';

    var STORAGE = { products: 'apex-products-v2', cart: 'apex-cart-v1', orders: 'apex-orders-v1' };
    var WHATSAPP = '519854471784';
    var defaultProducts = [
        ['audifonos-hoco-w48', 'Audífonos Bluetooth HOCO W48 RGB', 'Audífonos', 59.90, 'imgAudifonos/AUDIFONO-VINCHA-HOCO-W48-RGB-NEGRO-1.png'],
        ['cargador-usbc-20w', 'Cargador rápido USB-C 20W', 'Cargadores', 39.90, ''],
        ['cargador-auto', 'Cargador para auto doble USB', 'Cargadores', 29.90, ''],
        ['mouse-inalambrico', 'Mouse inalámbrico ergonómico', 'Mouse', 34.90, ''],
        ['teclado-mecanico', 'Teclado mecánico RGB', 'Teclados', 129.90, ''],
        ['camara-seguridad', 'Cámara de seguridad Wi-Fi', 'Cámaras', 149.90, ''],
        ['power-bank', 'Power Bank 10,000 mAh', 'Cargadores', 69.90, ''],
        ['audifonos-tws', 'Audífonos TWS compactos', 'Audífonos', 49.90, '']
    ].map(function (item) {
        return { id: item[0], name: item[1], category: item[2], price: item[3], stock: 12, image: item[4] };
    });

    function read(key, fallback) {
        try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch (error) { return fallback; }
    }
    function write(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
    function money(value) { return 'S/ ' + Number(value).toFixed(2); }
    function orderId() {
        var now = new Date(), stamp = now.getFullYear().toString() + String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0') + '-' + String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0') + String(now.getSeconds()).padStart(2, '0');
        var random = Math.random().toString(36).slice(2, 7).toUpperCase();
        return 'PED-' + stamp + '-' + random;
    }
    function escapeHtml(value) {
        return String(value).replace(/[&<>"']/g, function (char) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char]; });
    }
    function products() {
        var saved = read(STORAGE.products, null);
        if (!saved || !Array.isArray(saved) || !saved.length) { write(STORAGE.products, defaultProducts); return defaultProducts.slice(); }
        return saved;
    }
    function setCart(cart) { write(STORAGE.cart, cart.filter(function (line) { return line.quantity > 0; })); renderCart(); updateCartCount(); }
    function cart() { return read(STORAGE.cart, []); }
    function updateCartCount() { var node = document.getElementById('cart-count'); if (node) node.textContent = cart().reduce(function (sum, line) { return sum + line.quantity; }, 0); }
    function addToCart(id) {
        var product = products().find(function (item) { return item.id === id; });
        var currentCart = cart();
        var current = currentCart.find(function (line) { return line.id === id; });
        if (!product || (current && current.quantity >= product.stock)) return;
        if (current) current.quantity += 1; else currentCart.push({ id: id, quantity: 1 });
        setCart(currentCart);
    }
    function renderProducts() {
        var grid = document.getElementById('product-grid'); if (!grid) return;
        var query = (document.getElementById('product-search').value || '').toLowerCase();
        var category = document.getElementById('category-filter').value;
        var visible = products().filter(function (item) { return item.name.toLowerCase().indexOf(query) >= 0 && (category === 'all' || item.category === category); });
        grid.innerHTML = visible.length ? visible.map(function (item) {
            var disabled = item.stock < 1 ? ' disabled' : '';
            var image = item.image ? '<img src="' + escapeHtml(item.image) + '" alt="' + escapeHtml(item.name) + '">' : '<div class="product-image-placeholder" role="img" aria-label="Imagen pendiente de ' + escapeHtml(item.name) + '">Imagen del producto pendiente</div>';
            return '<article class="product-card">' + image + '<span class="product-category">' + escapeHtml(item.category) + '</span><h3>' + escapeHtml(item.name) + '</h3><p class="price">' + money(item.price) + '</p><p class="stock">' + (item.stock ? item.stock + ' disponibles' : 'Agotado') + '</p><button class="button add-product" data-id="' + escapeHtml(item.id) + '"' + disabled + '>Añadir al carrito</button></article>';
        }).join('') : '<p>No encontramos productos con esos filtros.</p>';
        grid.querySelectorAll('.add-product').forEach(function (button) { button.addEventListener('click', function () { addToCart(button.dataset.id); }); });
    }
    function renderCart() {
        var node = document.getElementById('cart-items'); if (!node) return;
        var all = products(), lines = cart();
        node.innerHTML = lines.length ? lines.map(function (line) {
            var item = all.find(function (product) { return product.id === line.id; }); if (!item) return '';
            return '<div class="cart-line"><div><strong>' + escapeHtml(item.name) + '</strong><small>' + money(item.price) + ' c/u</small></div><div class="quantity-controls"><button type="button" data-action="minus" data-id="' + item.id + '">−</button><span>' + line.quantity + '</span><button type="button" data-action="plus" data-id="' + item.id + '">+</button><button type="button" class="remove" data-action="remove" data-id="' + item.id + '">Eliminar</button></div></div>';
        }).join('') : '<p>Tu carrito está vacío.</p>';
        var total = lines.reduce(function (sum, line) { var item = all.find(function (product) { return product.id === line.id; }); return sum + (item ? item.price * line.quantity : 0); }, 0);
        var totalNode = document.getElementById('cart-total'); if (totalNode) totalNode.textContent = money(total);
        node.querySelectorAll('[data-action]').forEach(function (button) { button.addEventListener('click', function () {
            var line = cart().find(function (entry) { return entry.id === button.dataset.id; });
            if (!line) return;
            if (button.dataset.action === 'remove') line.quantity = 0;
            if (button.dataset.action === 'minus') line.quantity -= 1;
            if (button.dataset.action === 'plus') { var item = all.find(function (product) { return product.id === line.id; }); if (item && line.quantity < item.stock) line.quantity += 1; }
            setCart(cart());
        }); });
    }
    function renderAdmin() {
        var productsNode = document.getElementById('admin-products'), ordersNode = document.getElementById('admin-orders'); if (!productsNode) return;
        productsNode.innerHTML = products().map(function (item) { return '<div class="admin-row"><strong>' + escapeHtml(item.name) + '</strong><label>Precio <input class="price-input" data-id="' + item.id + '" type="number" min="0" step="0.01" value="' + item.price + '"></label><label>Stock <input class="stock-input" data-id="' + item.id + '" type="number" min="0" value="' + item.stock + '"></label><label>Imagen <input class="image-input" data-id="' + item.id + '" type="text" placeholder="ruta/imagen.jpg" value="' + escapeHtml(item.image || '') + '"></label></div>'; }).join('');
        productsNode.querySelectorAll('.stock-input, .price-input, .image-input').forEach(function (input) { input.addEventListener('change', function () { var list = products(); var item = list.find(function (entry) { return entry.id === input.dataset.id; }); if (input.classList.contains('stock-input')) item.stock = Math.max(0, Number(input.value) || 0); if (input.classList.contains('price-input')) item.price = Math.max(0, Number(input.value) || 0); if (input.classList.contains('image-input')) item.image = input.value.trim(); write(STORAGE.products, list); renderProducts(); }); });
        var orders = read(STORAGE.orders, []);
        ordersNode.innerHTML = orders.length ? orders.map(function (order) { return '<div class="order-row"><strong>' + escapeHtml(order.name) + '</strong><span>' + escapeHtml(order.deliveryDate) + ' · ' + escapeHtml(order.deliveryMethod) + '</span><span>' + money(order.total) + ' · ' + escapeHtml(order.payment) + '</span></div>'; }).join('') : '<p>Aún no hay pedidos.</p>';
    }
    function setup() {
        products(); updateCartCount(); renderProducts(); renderCart();
        var search = document.getElementById('product-search'), filter = document.getElementById('category-filter');
        if (search) search.addEventListener('input', renderProducts);
        if (filter) { Array.from(new Set(products().map(function (item) { return item.category; }))).forEach(function (category) { filter.insertAdjacentHTML('beforeend', '<option value="' + escapeHtml(category) + '">' + escapeHtml(category) + '</option>'); }); filter.addEventListener('change', renderProducts); }
        var form = document.getElementById('checkout-form');
        if (form) form.addEventListener('submit', function (event) {
            event.preventDefault(); var lines = cart(), all = products();
            if (!lines.length) { document.getElementById('checkout-message').textContent = 'Añade al menos un producto antes de enviar el pedido.'; return; }
            var data = Object.fromEntries(new FormData(form).entries()), total = 0;
            lines.forEach(function (line) { var item = all.find(function (product) { return product.id === line.id; }); total += item.price * line.quantity; item.stock -= line.quantity; });
            data.id = orderId(); data.total = total; data.items = lines; data.createdAt = new Date().toISOString();
            var orders = read(STORAGE.orders, []); orders.unshift(data); write(STORAGE.orders, orders); write(STORAGE.products, all); write(STORAGE.cart, []); form.reset(); renderProducts(); renderCart(); updateCartCount(); document.getElementById('checkout-message').textContent = 'Pedido ' + data.id + ' recibido. Te contactaremos para confirmar el pago y la entrega.';
            var paymentPanel = document.getElementById('yape-payment');
            if (paymentPanel) paymentPanel.hidden = data.payment.indexOf('Yape') === -1;
            form.dataset.orderId = data.id;
            form.dataset.orderTotal = money(data.total);
            renderAdmin();
        });
        var login = document.getElementById('admin-login');
        if (login) {
            var content = document.getElementById('admin-content'), message = document.getElementById('admin-login-message');
            if (sessionStorage.getItem('benlyn-admin-auth') === 'ok') { login.hidden = true; content.hidden = false; renderAdmin(); }
            login.addEventListener('submit', function (event) {
                event.preventDefault();
                if (document.getElementById('admin-pin').value === 'BENLYN-ADMIN') { sessionStorage.setItem('benlyn-admin-auth', 'ok'); login.hidden = true; content.hidden = false; renderAdmin(); }
                else message.textContent = 'Clave incorrecta.';
            });
            document.getElementById('admin-logout').addEventListener('click', function () { sessionStorage.removeItem('benlyn-admin-auth'); content.hidden = true; login.hidden = false; login.reset(); });
        }
        var proofButton = document.getElementById('send-proof');
        if (proofButton) proofButton.addEventListener('click', function () {
            var fileInput = document.getElementById('payment-proof'), file = fileInput.files[0], message = document.getElementById('proof-message');
            if (!file) { message.textContent = 'Selecciona primero la captura del pago.'; return; }
            var text = 'Hola BENLYNSOLUTIONS. Envío el comprobante Yape del pedido ' + (form.dataset.orderId || '') + '. Total pagado: ' + (form.dataset.orderTotal || '') + '.';
            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                navigator.share({ title: 'Comprobante Yape', text: text, files: [file] }).catch(function () { window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(text), '_blank', 'noopener'); });
                return;
            }
            window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(text + ' Adjuntaré la captura en este chat.'), '_blank', 'noopener');
            message.textContent = 'WhatsApp se abrió. Adjunta la captura en el chat y envíala.';
        });
    }
    document.addEventListener('DOMContentLoaded', setup);
}());
