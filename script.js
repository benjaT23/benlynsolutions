(function () {
    'use strict';

    var STORAGE = { products: 'apex-products-v2', cart: 'apex-cart-v1', orders: 'apex-orders-v1' };
    var WHATSAPP = '519854471784';
    var defaultProducts = [
        ['audifonos-hoco-w48', 'Audífonos Bluetooth HOCO W48 RGB', 'Audífonos', 59.90, 'imgAudifonos/AUDIFONO-VINCHA-HOCO-W48-RGB-NEGRO-1.png', 'Audífonos inalámbricos con Bluetooth 5.3, iluminación RGB, micrófono y hasta 8 horas de reproducción con luces encendidas.', ['imgAudifonos/AUDIFONO-VINCHA-HOCO-W48-RGB-NEGRO-1.png', 'imgAudifonos/AUDIFONO-VINCHA-HOCO-W48-RGB-NEGRO2.png', 'imgAudifonos/AUDIFONO-VINCHA-HOCO-W48-RGB-NEGRO-3.png', 'imgAudifonos/AUDIFONO-VINCHA-HOCO-W48-RGB-NEGRO-4.png']],
        ['cargador-usbc-20w', 'Cargador rápido USB-C 20W', 'Cargadores', 39.90, '', 'Cargador compacto para carga rápida de dispositivos compatibles. Imagen pendiente de actualización.', []],
        ['cargador-auto', 'Cargador para auto doble USB', 'Cargadores', 29.90, '', 'Cargador vehicular con dos puertos USB para mantener tus dispositivos cargados durante el viaje.', []],
        ['mouse-inalambrico', 'Mouse inalámbrico ergonómico', 'Mouse', 34.90, '', 'Mouse inalámbrico cómodo para trabajo, estudio y uso diario.', []],
        ['teclado-mecanico', 'Teclado mecánico RGB', 'Teclados', 129.90, '', 'Teclado mecánico con iluminación RGB para productividad y gaming.', []],
        ['camara-seguridad', 'Cámara de seguridad Wi-Fi', 'Cámaras', 149.90, '', 'Cámara Wi-Fi para monitoreo del hogar desde dispositivos compatibles.', []],
        ['power-bank', 'Power Bank 10,000 mAh', 'Cargadores', 69.90, '', 'Batería portátil de 10,000 mAh para cargar tus dispositivos donde estés.', []],
        ['audifonos-tws', 'Audífonos TWS compactos', 'Audífonos', 49.90, '', 'Audífonos completamente inalámbricos, compactos y fáciles de transportar.', []]
    ].map(function (item) {
        return { id: item[0], name: item[1], category: item[2], price: item[3], stock: 12, image: item[4], description: item[5], images: item[6] };
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
        return saved.map(function (item) {
            var base = defaultProducts.find(function (product) { return product.id === item.id; }) || {};
            return Object.assign({}, base, item, { description: item.description || base.description || 'Descripción pendiente.', images: item.images && item.images.length ? item.images : (base.images || (item.image ? [item.image] : [])) });
        });
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
            return '<article class="product-card">' + image + '<span class="product-category">' + escapeHtml(item.category) + '</span><h3>' + escapeHtml(item.name) + '</h3><p class="price">' + money(item.price) + '</p><p class="stock">' + (item.stock ? item.stock + ' disponibles' : 'Agotado') + '</p><div class="product-card-actions"><button class="button button-secondary view-product" data-id="' + escapeHtml(item.id) + '" type="button">Ver detalles</button><button class="button add-product" data-id="' + escapeHtml(item.id) + '"' + disabled + '>Añadir al carrito</button></div></article>';
        }).join('') : '<p>No encontramos productos con esos filtros.</p>';
        grid.querySelectorAll('.add-product').forEach(function (button) { button.addEventListener('click', function () { addToCart(button.dataset.id); }); });
        grid.querySelectorAll('.view-product').forEach(function (button) { button.addEventListener('click', function () { showProduct(button.dataset.id); }); });
    }
    function showProduct(id) {
        var item = products().find(function (product) { return product.id === id; }), dialog = document.getElementById('product-dialog'), detail = document.getElementById('product-detail');
        if (!item || !dialog || !detail) return;
        var gallery = item.images && item.images.length ? item.images : (item.image ? [item.image] : []);
        var main = gallery[0] ? '<img id="detail-main-image" src="' + escapeHtml(gallery[0]) + '" alt="' + escapeHtml(item.name) + '">' : '<div class="product-image-placeholder">Imagen pendiente</div>';
        detail.innerHTML = '<div class="product-detail-grid"><div><div class="detail-main-image">' + main + '</div><div class="detail-thumbnails">' + gallery.map(function (src) { return '<button type="button" class="detail-thumbnail" data-src="' + escapeHtml(src) + '"><img src="' + escapeHtml(src) + '" alt="Vista de ' + escapeHtml(item.name) + '"></button>'; }).join('') + '</div></div><div class="product-detail-copy"><span class="product-category">' + escapeHtml(item.category) + '</span><h2>' + escapeHtml(item.name) + '</h2><p class="price">' + money(item.price) + '</p><p>' + escapeHtml(item.description) + '</p><p class="stock">' + item.stock + ' disponibles</p><button class="button detail-add" type="button">Añadir al carrito</button></div></div>';
        detail.querySelector('.detail-add').addEventListener('click', function () { addToCart(item.id); dialog.close(); });
        detail.querySelectorAll('.detail-thumbnail').forEach(function (thumb) { thumb.addEventListener('click', function () { document.getElementById('detail-main-image').src = thumb.dataset.src; }); });
        dialog.showModal();
    }
    function renderCart() {
        var node = document.getElementById('cart-items'); if (!node) return;
        var all = products(), lines = cart();
        node.innerHTML = lines.length ? lines.map(function (line) {
            var item = all.find(function (product) { return product.id === line.id; }); if (!item) return '';
            var itemImage = item.image ? '<img src="' + escapeHtml(item.image) + '" alt="">': '<span class="cart-image-placeholder">IMG</span>';
            return '<div class="cart-line"><div class="cart-product">' + itemImage + '<div><strong>' + escapeHtml(item.name) + '</strong><small>' + escapeHtml(item.category) + ' · ' + money(item.price) + ' c/u</small></div></div><div class="cart-line-actions"><div class="quantity-controls"><button type="button" data-action="minus" data-id="' + item.id + '" aria-label="Disminuir cantidad">−</button><span>' + line.quantity + '</span><button type="button" data-action="plus" data-id="' + item.id + '" aria-label="Aumentar cantidad">+</button></div><strong>' + money(item.price * line.quantity) + '</strong><button type="button" class="remove" data-action="remove" data-id="' + item.id + '">Eliminar</button></div></div>';
        }).join('') : '<p>Tu carrito está vacío.</p>';
        var total = lines.reduce(function (sum, line) { var item = all.find(function (product) { return product.id === line.id; }); return sum + (item ? item.price * line.quantity : 0); }, 0);
        var totalNode = document.getElementById('cart-total'); if (totalNode) totalNode.textContent = money(total);
        var continueButton = document.getElementById('continue-checkout');
        if (continueButton) continueButton.disabled = !lines.length;
        node.querySelectorAll('[data-action]').forEach(function (button) { button.addEventListener('click', function () {
            var currentCart = cart();
            var line = currentCart.find(function (entry) { return entry.id === button.dataset.id; });
            if (!line) return;
            if (button.dataset.action === 'remove') line.quantity = 0;
            if (button.dataset.action === 'minus') line.quantity -= 1;
            if (button.dataset.action === 'plus') { var item = all.find(function (product) { return product.id === line.id; }); if (item && line.quantity < item.stock) line.quantity += 1; }
            setCart(currentCart);
        }); });
    }
    function renderAdmin() {
        var productsNode = document.getElementById('admin-products'), ordersNode = document.getElementById('admin-orders'); if (!productsNode) return;
        productsNode.innerHTML = products().map(function (item) { return '<div class="admin-row"><strong>' + escapeHtml(item.name) + '</strong><label>Precio <input class="price-input" data-id="' + item.id + '" type="number" min="0" step="0.01" value="' + item.price + '"></label><label>Stock <input class="stock-input" data-id="' + item.id + '" type="number" min="0" value="' + item.stock + '"></label><label>Imagen <input class="image-input" data-id="' + item.id + '" type="text" placeholder="ruta/imagen.jpg" value="' + escapeHtml(item.image || '') + '"></label></div>'; }).join('');
        productsNode.querySelectorAll('.stock-input, .price-input, .image-input').forEach(function (input) { input.addEventListener('change', function () { var list = products(); var item = list.find(function (entry) { return entry.id === input.dataset.id; }); if (input.classList.contains('stock-input')) item.stock = Math.max(0, Number(input.value) || 0); if (input.classList.contains('price-input')) item.price = Math.max(0, Number(input.value) || 0); if (input.classList.contains('image-input')) item.image = input.value.trim(); write(STORAGE.products, list); renderProducts(); }); });
        var orders = read(STORAGE.orders, []);
        ordersNode.innerHTML = orders.length ? orders.map(function (order) { return '<div class="order-row"><strong>' + escapeHtml(order.id) + ' · ' + escapeHtml(order.name) + '</strong><span>' + escapeHtml(order.phone) + ' · ' + escapeHtml(order.email) + '</span><span>' + escapeHtml(order.address) + '</span><span>' + escapeHtml(order.deliveryZone === 'huamachuco' ? 'Huamachuco · gratis' : 'Otro destino · courier: ' + (order.courier || 'por definir')) + '</span><span>' + escapeHtml(order.deliveryDate) + ' · ' + escapeHtml(order.deliveryMethod) + '</span><span>' + money(order.total) + ' · ' + escapeHtml(order.payment) + '</span></div>'; }).join('') : '<p>Aún no hay pedidos.</p>';
    }
    function setup() {
        products(); updateCartCount(); renderProducts(); renderCart();
        var cartDialog = document.getElementById('cart-dialog');
        document.querySelectorAll('.cart-link').forEach(function (link) {
            link.addEventListener('click', function (event) {
                event.preventDefault();
                if (cartDialog) cartDialog.showModal();
            });
        });
        var closeCart = document.getElementById('close-cart');
        if (closeCart && cartDialog) closeCart.addEventListener('click', function () { cartDialog.close(); });
        var search = document.getElementById('product-search'), filter = document.getElementById('category-filter');
        if (search) search.addEventListener('input', renderProducts);
        if (filter) { Array.from(new Set(products().map(function (item) { return item.category; }))).forEach(function (category) { filter.insertAdjacentHTML('beforeend', '<option value="' + escapeHtml(category) + '">' + escapeHtml(category) + '</option>'); }); filter.addEventListener('change', renderProducts); }
        var form = document.getElementById('checkout-form');
        var paymentSelect = form && form.querySelector('[name="payment"]');
        var paymentHelp = document.getElementById('payment-help');
        var deliveryZone = document.getElementById('delivery-zone');
        var courierField = document.getElementById('courier-field');
        if (deliveryZone && courierField) deliveryZone.addEventListener('change', function () {
            var isOther = deliveryZone.value === 'otro';
            courierField.hidden = !isOther;
            courierField.querySelector('input').required = isOther;
            var method = form.querySelector('[name="deliveryMethod"]');
            if (isOther) method.value = 'Envío por courier';
        });
        if (paymentSelect && paymentHelp) paymentSelect.addEventListener('change', function () {
            var messages = {
                'Yape / Plin (coordinar confirmación)': 'Yape / Plin: al confirmar el pedido aparecerá el QR y podrás adjuntar tu comprobante.',
                'Transferencia bancaria': 'Transferencia: solicita nuestros datos bancarios por WhatsApp antes de pagar. Verifica que el titular y la cuenta coincidan con BENLYNSOLUTIONS.',
                'Pago contra entrega': 'Contra entrega: coordinaremos disponibilidad, fecha y monto del envío antes de despachar.'
            };
            paymentHelp.textContent = messages[paymentSelect.value];
        });
        var continueButton = document.getElementById('continue-checkout');
        var cartMessage = document.getElementById('cart-message');
        if (continueButton && form) continueButton.addEventListener('click', function () {
            if (!cart().length) { cartMessage.textContent = 'Añade un producto para continuar.'; return; }
            form.hidden = false;
            continueButton.closest('.panel').classList.add('cart-review-complete');
            form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        var backToCart = document.getElementById('back-to-cart');
        if (backToCart && form) backToCart.addEventListener('click', function () {
            form.hidden = true;
            var cartPanel = document.getElementById('cart-items').closest('.panel');
            cartPanel.classList.remove('cart-review-complete');
            cartPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        if (form) form.addEventListener('submit', function (event) {
            event.preventDefault(); var lines = cart(), all = products();
            if (!lines.length) { document.getElementById('checkout-message').textContent = 'Añade al menos un producto antes de enviar el pedido.'; return; }
            var data = Object.fromEntries(new FormData(form).entries()), total = 0;
            lines.forEach(function (line) { var item = all.find(function (product) { return product.id === line.id; }); total += item.price * line.quantity; item.stock -= line.quantity; });
            data.id = orderId(); data.total = total; data.items = lines; data.createdAt = new Date().toISOString();
            var orders = read(STORAGE.orders, []); orders.unshift(data); write(STORAGE.orders, orders); write(STORAGE.products, all); write(STORAGE.cart, []); form.reset(); renderProducts(); renderCart(); updateCartCount(); document.getElementById('checkout-message').textContent = 'Pedido ' + data.id + ' recibido. Te contactaremos para confirmar el pago y la entrega.';
            var paymentPanel = document.getElementById('yape-payment');
            var transferPanel = document.getElementById('transfer-payment');
            if (paymentPanel) paymentPanel.hidden = data.payment.indexOf('Yape') === -1;
            if (transferPanel) transferPanel.hidden = data.payment !== 'Transferencia bancaria';
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
        var dialog = document.getElementById('product-dialog'), closeDialog = document.getElementById('close-product-dialog');
        if (dialog && closeDialog) closeDialog.addEventListener('click', function () { dialog.close(); });
    }
    document.addEventListener('DOMContentLoaded', setup);
}());
