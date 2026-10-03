(function () {
    'use strict';

    var STORAGE = { products: 'apex-products-v2', cart: 'apex-cart-v1', orders: 'apex-orders-v1' };
    var WHATSAPP = '519854471784';
    var defaultProducts = [
        ['audifonos-hoco-w48', 'Audífonos Bluetooth HOCO W48 RGB', 'Audífonos', 59.90, 'imgAudifonos/AUDIFONO-VINCHA-HOCO-W48-RGB-NEGRO-1.png', 'Audífonos inalámbricos con Bluetooth 5.3, iluminación RGB, micrófono y hasta 8 horas de reproducción con luces encendidas.', ['imgAudifonos/AUDIFONO-VINCHA-HOCO-W48-RGB-NEGRO-1.png', 'imgAudifonos/AUDIFONO-VINCHA-HOCO-W48-RGB-NEGRO2.png', 'imgAudifonos/AUDIFONO-VINCHA-HOCO-W48-RGB-NEGRO-3.png', 'imgAudifonos/AUDIFONO-VINCHA-HOCO-W48-RGB-NEGRO-4.png']],
        ['cargador-usbc-20w', 'Cargador rápido USB-C 20W', 'Cargadores', 39.90, '', 'Cargador compacto para carga rápida de dispositivos compatibles. Imagen pendiente de actualización.', []],
        ['cargador-auto', 'Cargador para auto doble USB', 'Cargadores', 29.90, '', 'Cargador vehicular con dos puertos USB para mantener tus dispositivos cargados durante el viaje.', []],
        ['cargador-xiaomi-67w', 'Cargador Xiaomi 67 W con cable', 'Cargadores', 65.00, 'img Cargadores/Xiomi 67 W/Xiomi67W.png', 'Potencia máxima anunciada de 67 W para carga rápida. Incluye cable de 1 m y protección contra sobrecarga. La ficha indica una carga en menos de una hora y compatibilidad con Xiaomi Mi 11 Ultra y Mi 11 Pro; el tiempo y la potencia reales dependen del dispositivo y sus condiciones de carga.', ['img Cargadores/Xiomi 67 W/Xiomi67W.png', 'img Cargadores/Xiomi 67 W/Xiomi67W (2).png', 'img Cargadores/Xiomi 67 W/Xiomi67W(3).png']],
        ['cargador-samsung-45w-negro', 'Cargador Samsung 45 W PD negro con cable', 'Cargadores', 55.00, 'img CargadoresSamsung/cargadorSamsung.png', 'Adaptador Samsung USB-C de hasta 45 W con USB Power Delivery 3.0 (PDO/PPS) y entrada de 100–240 V. Salidas indicadas: 5 V/3 A, 9 V/3 A, 15 V/3 A y 20 V/2.25 A; PPS de 3.3–21 V. Incluye cable USB-C de 5 A. La carga máxima requiere un dispositivo compatible.', ['img CargadoresSamsung/cargadorSamsung.png', 'img CargadoresSamsung/cargadorSamsung2.png', 'img CargadoresSamsung/cargadorSamsung3.png']],
        ['cargador-samsung-45w-blanco', 'Cargador Samsung 45 W PD blanco con cable', 'Cargadores', 55.00, 'img CargadoresSamsung/cargadorSamsungBlanco.png', 'Adaptador Samsung USB-C de hasta 45 W con USB Power Delivery 3.0 (PDO/PPS) y entrada de 100–240 V. Salidas indicadas: 5 V/3 A, 9 V/3 A, 15 V/3 A y 20 V/2.25 A; PPS de 3.3–21 V. Incluye cable USB-C de 5 A. La carga máxima requiere un dispositivo compatible.', ['img CargadoresSamsung/cargadorSamsungBlanco.png', 'img CargadoresSamsung/cargadorSamsungBlanco2.png']],
        ['cable-samsung-usbc-negro', 'Cable Samsung USB-C a USB-C negro 5 A', 'Cables', 18.00, 'img Cables Samsung/cable.png', 'Cable USB-C a USB-C de hasta 5 A y 100 W (20 V/5 A), con transferencia USB 2.0 de hasta 480 Mb/s. La ficha indica carga superrápida Samsung de hasta 25 W y Super Fast Charging 2.0 de hasta 45 W en equipos compatibles. Para alcanzar la potencia máxima se requiere un cargador compatible de más de 45 W.', ['img Cables Samsung/cable.png', 'img Cables Samsung/cable2.png', 'img Cables Samsung/cable3.png']],
        ['cable-samsung-usbc-blanco', 'Cable Samsung USB-C a USB-C blanco 5 A', 'Cables', 18.00, 'img Cables Samsung/cableblanco.png', 'Cable USB-C a USB-C de hasta 5 A y 100 W (20 V/5 A), con transferencia USB 2.0 de hasta 480 Mb/s. La ficha indica carga superrápida Samsung de hasta 25 W y Super Fast Charging 2.0 de hasta 45 W en equipos compatibles. Para alcanzar la potencia máxima se requiere un cargador compatible de más de 45 W.', ['img Cables Samsung/cableblanco.png', 'img Cables Samsung/cableblanco2.png']],
        ['mouse-inalambrico', 'Mouse inalámbrico ergonómico', 'Mouse', 34.90, '', 'Mouse inalámbrico cómodo para trabajo, estudio y uso diario.', []],
        ['teclado-mecanico', 'Teclado mecánico RGB', 'Teclados', 129.90, '', 'Teclado mecánico con iluminación RGB para productividad y gaming.', []],
        ['camara-seguridad', 'Cámara de seguridad Wi-Fi', 'Cámaras', 149.90, '', 'Cámara Wi-Fi para monitoreo del hogar desde dispositivos compatibles.', []],
        ['power-bank', 'Power Bank 10,000 mAh', 'Cargadores', 69.90, '', 'Batería portátil de 10,000 mAh para cargar tus dispositivos donde estés.', []],
        ['audifonos-tws', 'Audífonos TWS compactos', 'Audífonos', 49.90, '', 'Audífonos completamente inalámbricos, compactos y fáciles de transportar.', []]
    ].map(function (item) {
        return { id: item[0], name: item[1], category: item[2], price: item[3], purchaseCost: null, stock: 12, image: item[4], description: item[5], images: item[6] };
    });

    function read(key, fallback) {
        try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch (error) { return fallback; }
    }
    function write(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
    function money(value) { return 'S/ ' + Number(value).toFixed(2); }
    function escapeHtml(value) {
        return String(value).replace(/[&<>"']/g, function (char) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char]; });
    }
    function products() {
        var saved = read(STORAGE.products, null);
        if (!saved || !Array.isArray(saved) || !saved.length) { write(STORAGE.products, defaultProducts); return defaultProducts.slice(); }
        var previousDescriptions = {
            'cargador-xiaomi-67w': 'Cargador de pared Xiaomi de 67 W para carga rápida. Incluye cable de 1 m y protección contra sobrecarga. La velocidad depende del dispositivo compatible.',
            'cargador-samsung-45w-negro': 'Adaptador Samsung USB-C de 45 W con cable USB-C de 5 A. Compatible con carga rápida en dispositivos compatibles; la potencia efectiva depende del equipo.',
            'cargador-samsung-45w-blanco': 'Adaptador Samsung USB-C de 45 W con cable USB-C de 5 A. Compatible con carga rápida en dispositivos compatibles; la potencia efectiva depende del equipo.',
            'cable-samsung-usbc-negro': 'Cable USB-C a USB-C de hasta 5 A, diseñado para carga rápida y transferencia de datos. La potencia depende del cargador y del dispositivo compatibles.',
            'cable-samsung-usbc-blanco': 'Cable USB-C a USB-C de hasta 5 A, diseñado para carga rápida y transferencia de datos. La potencia depende del cargador y del dispositivo compatibles.'
        };
        var descriptionUpdated = false;
        var result = saved.map(function (item) {
            var base = defaultProducts.find(function (product) { return product.id === item.id; }) || {};
            var product = Object.assign({}, base, item, { description: item.description || base.description || 'Descripción pendiente.', images: item.images && item.images.length ? item.images : (base.images || (item.image ? [item.image] : [])) });
            if (previousDescriptions[item.id] && item.description === previousDescriptions[item.id]) {
                product.description = base.description;
                descriptionUpdated = true;
            }
            return product;
        });
        var addedDefaults = defaultProducts.filter(function (product) {
            return !result.some(function (savedProduct) { return savedProduct.id === product.id; });
        });
        if (addedDefaults.length || descriptionUpdated) {
            result = result.concat(addedDefaults);
            write(STORAGE.products, result);
        }
        return result;
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
    function getReportSales() {
        var from = document.getElementById('report-from').value, to = document.getElementById('report-to').value;
        return read(STORAGE.orders, []).filter(function (order) {
            if (!order.isSale || !order.soldAt) return false;
            var day = order.soldAt.slice(0, 10);
            return (!from || day >= from) && (!to || day <= to);
        }).sort(function (left, right) { return right.soldAt.localeCompare(left.soldAt); });
    }
    function saleHasCompleteCost(sale) {
        return sale.saleCostComplete === true || (typeof sale.saleCostComplete === 'undefined' && typeof sale.saleCostTotal === 'number' && Number.isFinite(sale.saleCostTotal));
    }
    function localDateKey(value) {
        var date = new Date(value);
        if (Number.isNaN(date.getTime())) return '';
        return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
    }
    function orderDateKey(order) {
        var key = localDateKey(order.createdAt || order.soldAt);
        if (key) return key;
        var match = String(order.id || '').match(/^PED-(\d{4})(\d{2})(\d{2})-/);
        return match ? match[1] + '-' + match[2] + '-' + match[3] : '';
    }
    function renderSalesReport() {
        var summary = document.getElementById('sales-summary'), rows = document.getElementById('sales-report-rows');
        if (!summary || !rows) return;
        var sales = getReportSales(), revenue = 0, cost = 0, profit = 0, units = 0, pendingCostSales = 0;
        sales.forEach(function (sale) {
            revenue += Number(sale.saleTotal) || 0;
            if (saleHasCompleteCost(sale)) {
                cost += Number(sale.saleCostTotal) || 0;
                profit += (Number(sale.saleTotal) || 0) - (Number(sale.saleCostTotal) || 0);
            } else pendingCostSales += 1;
            units += (sale.saleItems || []).reduce(function (sum, item) { return sum + Number(item.quantity || 0); }, 0);
        });
        summary.innerHTML = '<article class="report-card"><span>Ventas registradas</span><strong>' + sales.length + '</strong></article><article class="report-card"><span>Unidades vendidas</span><strong>' + units + '</strong></article><article class="report-card"><span>Ingresos</span><strong>' + money(revenue) + '</strong></article><article class="report-card"><span>Costos de ventas completos</span><strong>' + money(cost) + '</strong></article><article class="report-card"><span>Ganancia bruta (ventas con costo)</span><strong>' + money(profit) + '</strong></article><article class="report-card"><span>Ventas con costo pendiente</span><strong>' + pendingCostSales + '</strong></article>';
        rows.innerHTML = sales.length ? sales.map(function (sale) {
            var itemNames = (sale.saleItems || []).map(function (item) { return escapeHtml(item.name) + ' × ' + Number(item.quantity); }).join(', ');
            var hasCost = saleHasCompleteCost(sale);
            var costText = hasCost ? money(sale.saleCostTotal) : 'Pendiente';
            var profitText = hasCost ? money(sale.saleTotal - sale.saleCostTotal) : 'Pendiente';
            return '<tr><td>' + escapeHtml(sale.receiptNumber) + '</td><td>' + escapeHtml(new Date(sale.soldAt).toLocaleString('es-PE')) + '</td><td>' + escapeHtml(sale.name) + '</td><td>' + itemNames + '</td><td>' + money(sale.saleTotal) + '</td><td>' + costText + '</td><td>' + profitText + '</td></tr>';
        }).join('') : '<tr><td colspan="7">No hay ventas registradas en este período.</td></tr>';
    }
    function printReceipt(order, receipt) {
        receipt = receipt || window.open('', '_blank');
        if (!receipt) return false;
        var rows = (order.saleItems || []).map(function (item) {
            return '<tr><td>' + escapeHtml(item.name) + '</td><td>' + Number(item.quantity) + '</td><td>' + money(item.unitPrice) + '</td><td>' + money(item.unitPrice * item.quantity) + '</td></tr>';
        }).join('');
        var issuedAt = new Date(order.soldAt).toLocaleString('es-PE');
        receipt.document.open();
        receipt.document.write('<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Comprobante interno ' + escapeHtml(order.receiptNumber) + '</title><style>body{font:15px Arial,sans-serif;color:#111;margin:2rem auto;max-width:760px;padding:0 1rem}h1,h2{text-align:center}p{margin:.4rem 0}table{border-collapse:collapse;margin:1.5rem 0;width:100%}th,td{border:1px solid #999;padding:.55rem;text-align:left}th{background:#eee}.total{text-align:right;font-size:1.2rem;font-weight:bold}.notice{border:2px solid #a00;color:#a00;font-weight:bold;margin-top:2rem;padding:1rem;text-align:center}.print{display:block;margin:1rem auto;padding:.7rem 1.5rem}@media print{.print{display:none}body{margin:0 auto}}</style></head><body><h1>BENLYNSOLUTIONS</h1><h2>Comprobante interno de venta</h2><p><strong>Número interno:</strong> ' + escapeHtml(order.receiptNumber) + '</p><p><strong>Fecha:</strong> ' + escapeHtml(issuedAt) + '</p><p><strong>Pedido:</strong> ' + escapeHtml(order.id) + '</p><p><strong>Cliente:</strong> ' + escapeHtml(order.name) + '</p><p><strong>Teléfono:</strong> ' + escapeHtml(order.phone) + '</p><table><thead><tr><th>Producto</th><th>Cant.</th><th>Precio unit.</th><th>Subtotal</th></tr></thead><tbody>' + rows + '</tbody></table><p class="total">Total: ' + money(order.saleTotal) + '</p><p class="notice">DOCUMENTO INTERNO. NO ES UNA BOLETA ELECTRÓNICA NI ES VÁLIDO COMO COMPROBANTE TRIBUTARIO SUNAT.</p><button class="print" onclick="window.print()">Imprimir / Guardar como PDF</button></body></html>');
        receipt.document.close();
        receipt.focus();
        return true;
    }
    function registerSale(orderIdValue, receiptWindow) {
        var orders = read(STORAGE.orders, []), order = orders.find(function (item) { return item.id === orderIdValue; });
        if (!order) {
            if (receiptWindow) receiptWindow.close();
            document.getElementById('admin-message').textContent = 'No se encontró el pedido. Actualiza la página y vuelve a intentarlo.';
            return;
        }
        if (order.status === 'not-sold') {
            if (receiptWindow) receiptWindow.close();
            document.getElementById('admin-message').textContent = 'Este pedido ya se marcó como no vendido y su stock fue devuelto; no se puede registrar como venta.';
            return;
        }
        if (order.isSale) {
            if (!printReceipt(order, receiptWindow)) document.getElementById('admin-message').textContent = 'El comprobante ya existe. Permite las ventanas emergentes para imprimirlo.';
            return;
        }
        var inventory = products(), saleItems = [];
        for (var index = 0; index < (order.items || []).length; index += 1) {
            var line = order.items[index], product = inventory.find(function (item) { return item.id === line.id; });
            if (!product) {
                if (receiptWindow) receiptWindow.close();
                document.getElementById('admin-message').textContent = 'No se puede registrar la venta: falta un producto del pedido en el inventario.';
                return;
            }
            var hasCost = product.purchaseCost !== null && product.purchaseCost !== '' && Number.isFinite(Number(product.purchaseCost)) && Number(product.purchaseCost) >= 0;
            saleItems.push({
                id: product.id,
                name: line.name || product.name,
                quantity: Number(line.quantity),
                unitCost: hasCost ? Number(product.purchaseCost) : null,
                unitPrice: Number.isFinite(Number(line.unitPrice)) ? Number(line.unitPrice) : Number(product.price)
            });
        }
        if (!saleItems.length || saleItems.some(function (item) { return !Number.isFinite(item.quantity) || item.quantity < 1 || !Number.isFinite(item.unitPrice) || item.unitPrice < 0; })) {
            if (receiptWindow) receiptWindow.close();
            document.getElementById('admin-message').textContent = 'No se puede registrar la venta: revisa las cantidades y precios del pedido.';
            return;
        }
        var saleTotal = saleItems.reduce(function (sum, item) { return sum + item.quantity * item.unitPrice; }, 0);
        if (Number.isFinite(Number(order.total)) && Math.round(saleTotal * 100) !== Math.round(Number(order.total) * 100)) {
            if (receiptWindow) receiptWindow.close();
            document.getElementById('admin-message').textContent = 'No se registró la venta: el precio actual no coincide con el total original del pedido. Revisa el precio acordado antes de emitir el comprobante.';
            return;
        }
        order.saleItems = saleItems;
        order.saleTotal = saleTotal;
        order.saleCostComplete = saleItems.every(function (item) { return item.unitCost !== null; });
        order.saleCostTotal = order.saleCostComplete ? saleItems.reduce(function (sum, item) { return sum + item.quantity * item.unitCost; }, 0) : null;
        order.soldAt = new Date().toISOString();
        order.receiptNumber = 'INT-' + order.soldAt.replace(/\D/g, '').slice(0, 14) + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
        order.isSale = true;
        order.status = 'sold';
        try {
            write(STORAGE.orders, orders);
        } catch (error) {
            if (receiptWindow) receiptWindow.close();
            document.getElementById('admin-message').textContent = 'No se pudo guardar la venta en este navegador. Comprueba que tenga espacio disponible y que permita el almacenamiento del sitio.';
            return;
        }
        renderAdmin();
        renderSalesReport();
        if (!printReceipt(order, receiptWindow)) document.getElementById('admin-message').textContent = 'Venta registrada. Permite las ventanas emergentes del navegador y pulsa "Imprimir comprobante interno".' + (order.saleCostComplete ? '' : ' El costo pendiente se puede completar en Inventario para calcular la ganancia.');
        else document.getElementById('admin-message').textContent = 'Venta registrada y comprobante interno generado.' + (order.saleCostComplete ? '' : ' El costo queda pendiente; complétalo en Inventario para calcular la ganancia.');
    }
    function markOrderNotSold(orderIdValue) {
        var orders = read(STORAGE.orders, []), order = orders.find(function (item) { return item.id === orderIdValue; });
        var message = document.getElementById('admin-message');
        if (!order) {
            message.textContent = 'No se encontró el pedido. Actualiza la página y vuelve a intentarlo.';
            return;
        }
        if (order.isSale || order.status === 'sold') {
            message.textContent = 'Esta venta ya está registrada y no se puede devolver el stock desde aquí.';
            return;
        }
        if (order.status === 'not-sold' || order.stockReturnedAt) {
            message.textContent = 'Este pedido ya está marcado como no vendido y su stock ya fue devuelto.';
            return;
        }
        if (!Array.isArray(order.items) || !order.items.length) {
            message.textContent = 'No se puede devolver el stock: el pedido no contiene productos para inventariar.';
            return;
        }
        var inventory = products(), previousInventory = JSON.stringify(inventory);
        for (var index = 0; index < (order.items || []).length; index += 1) {
            var line = order.items[index], product = inventory.find(function (item) { return item.id === line.id; });
            if (!product || !Number.isInteger(Number(line.quantity)) || Number(line.quantity) < 1) {
                message.textContent = 'No se puede devolver el stock: verifica los productos y cantidades del pedido en Inventario.';
                return;
            }
        }
        order.items.forEach(function (line) {
            var product = inventory.find(function (item) { return item.id === line.id; });
            product.stock = Number(product.stock) + Number(line.quantity);
        });
        var previousOrderState = { status: order.status, stockReturnedAt: order.stockReturnedAt };
        order.status = 'not-sold';
        order.stockReturnedAt = new Date().toISOString();
        try {
            write(STORAGE.orders, orders);
            write(STORAGE.products, inventory);
        } catch (error) {
            order.status = previousOrderState.status;
            if (previousOrderState.stockReturnedAt === undefined) delete order.stockReturnedAt;
            else order.stockReturnedAt = previousOrderState.stockReturnedAt;
            try {
                write(STORAGE.orders, orders);
                write(STORAGE.products, JSON.parse(previousInventory));
            } catch (rollbackError) {
                message.textContent = 'No se pudo completar o revertir el cambio de inventario. Revisa los pedidos y el stock antes de continuar.';
                return;
            }
            message.textContent = 'No se pudo guardar el cambio de inventario. Comprueba el almacenamiento del navegador y vuelve a intentarlo.';
            return;
        }
        renderProducts();
        renderAdmin();
        message.textContent = 'Pedido marcado como no vendido. Las unidades se devolvieron al inventario y el pedido quedó guardado en el historial.';
    }
    function exportSalesReport() {
        var sales = getReportSales(), fields = ['Comprobante interno', 'Fecha', 'Cliente', 'Productos', 'Ingresos', 'Costo', 'Ganancia bruta'];
        var csvRows = [fields].concat(sales.map(function (sale) {
            var hasCost = saleHasCompleteCost(sale);
            return [sale.receiptNumber, sale.soldAt, sale.name, (sale.saleItems || []).map(function (item) { return item.name + ' x' + item.quantity; }).join(', '), sale.saleTotal, hasCost ? sale.saleCostTotal : 'Pendiente', hasCost ? sale.saleTotal - sale.saleCostTotal : 'Pendiente'];
        }));
        var csv = '\uFEFF' + csvRows.map(function (row) { return row.map(function (value) { return '"' + String(value == null ? '' : value).replace(/"/g, '""') + '"'; }).join(';'); }).join('\r\n');
        var url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
        var link = document.createElement('a');
        link.href = url;
        link.download = 'reporte-ventas-' + new Date().toISOString().slice(0, 10) + '.csv';
        link.click();
        window.setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    }
    function renderAdmin() {
        var productsNode = document.getElementById('admin-products'), ordersNode = document.getElementById('admin-orders'), historyNode = document.getElementById('admin-order-history'); if (!productsNode || !ordersNode || !historyNode) return;
        productsNode.innerHTML = products().map(function (item) { return '<div class="admin-row"><strong>' + escapeHtml(item.name) + '</strong><label>Precio de compra (S/) <input class="purchase-cost-input" data-id="' + escapeHtml(item.id) + '" type="number" min="0" step="0.01" value="' + (item.purchaseCost == null ? '' : Number(item.purchaseCost)) + '" required></label><label>Precio de venta (S/) <input class="price-input" data-id="' + escapeHtml(item.id) + '" type="number" min="0" step="0.01" value="' + Number(item.price) + '"></label><label>Stock <input class="stock-input" data-id="' + escapeHtml(item.id) + '" type="number" min="0" step="1" value="' + Number(item.stock) + '"></label><label>Imagen <input class="image-input" data-id="' + escapeHtml(item.id) + '" type="text" placeholder="ruta/imagen.jpg" value="' + escapeHtml(item.image || '') + '"></label></div>'; }).join('');
        productsNode.querySelectorAll('.stock-input, .price-input, .purchase-cost-input, .image-input').forEach(function (input) { input.addEventListener('change', function () {
            var list = products(), item = list.find(function (entry) { return entry.id === input.dataset.id; });
            if (!item) return;
            var message = document.getElementById('admin-message'), value = Number(input.value);
            if (input.classList.contains('stock-input')) {
                if (input.value.trim() === '' || !Number.isInteger(value) || value < 0) { message.textContent = 'El stock debe ser un número entero igual o mayor que cero.'; input.value = item.stock; return; }
                item.stock = value;
            } else if (input.classList.contains('price-input')) {
                if (input.value.trim() === '' || !Number.isFinite(value) || value < 0) { message.textContent = 'El precio de venta debe ser un número igual o mayor que cero.'; input.value = item.price; return; }
                item.price = value;
            } else if (input.classList.contains('purchase-cost-input')) {
                if (input.value.trim() === '') item.purchaseCost = null;
                else if (!Number.isFinite(value) || value < 0) { message.textContent = 'El precio de compra debe ser un número igual o mayor que cero.'; input.value = item.purchaseCost == null ? '' : item.purchaseCost; return; }
                else item.purchaseCost = value;
            } else if (input.classList.contains('image-input')) item.image = input.value.trim();
            message.textContent = '';
            write(STORAGE.products, list);
            renderProducts();
        }); });
        var orders = read(STORAGE.orders, []), today = localDateKey(new Date().toISOString());
        var todayOrders = orders.filter(function (order) { return order.status !== 'not-sold' && !order.stockReturnedAt && orderDateKey(order) === today; });
        var historicalOrders = orders.filter(function (order) { return order.status === 'not-sold' || order.stockReturnedAt || orderDateKey(order) !== today; });
        function renderOrderCards(orderList, emptyMessage) {
            return orderList.length ? orderList.map(function (order) {
            var items = (order.items || []).map(function (line) { var product = products().find(function (item) { return item.id === line.id; }); return (product ? product.name : line.id) + ' x' + line.quantity; }).join(', ');
            var destination = order.deliveryZone === 'huamachuco' ? 'Huamachuco (entrega local gratis)' : 'Otro destino, courier: ' + (order.courier || 'por definir');
            var message = 'Hola ' + order.name + ', somos BENLYNSOLUTIONS. Confirmamos tu pedido ' + order.id + ': ' + items + '. Total: ' + money(order.total) + '. Entrega: ' + destination + '. Fecha solicitada: ' + order.deliveryDate + '. Método de pago: ' + order.payment + '. Te escribimos para coordinar los detalles. Gracias por comprar con nosotros.';
            var phone = String(order.phone || '').replace(/\D/g, '');
            if (phone.length === 9) phone = '51' + phone;
            var pending = !order.isSale && order.status !== 'not-sold';
            var statusLabel = order.isSale || order.status === 'sold' ? ' · Vendido' : order.status === 'not-sold' ? ' · No vendido (stock devuelto)' : ' · Pendiente de confirmar';
            var receiptButton = order.isSale ? '<button class="button button-secondary" type="button" data-action="print-receipt" data-id="' + escapeHtml(order.id) + '">Imprimir comprobante interno</button>' : pending ? '<button class="button" type="button" data-action="register-sale" data-id="' + escapeHtml(order.id) + '">Marcar vendido e imprimir</button>' : '';
            var notSoldButton = pending ? '<button class="button button-secondary" type="button" data-action="mark-not-sold" data-id="' + escapeHtml(order.id) + '">No vendido · devolver stock</button>' : '';
            return '<div class="order-row"><div class="order-main"><strong>' + escapeHtml(order.id) + ' · ' + escapeHtml(order.name) + statusLabel + '</strong><span>' + escapeHtml(order.phone) + ' · ' + escapeHtml(order.email) + '</span><span>' + escapeHtml(order.address) + '</span><span>' + escapeHtml(destination) + '</span><span>' + escapeHtml(order.deliveryDate) + ' · ' + escapeHtml(order.deliveryMethod) + '</span><span>' + money(order.isSale ? order.saleTotal : order.total) + ' · ' + escapeHtml(order.payment) + '</span></div><div class="order-actions">' + receiptButton + notSoldButton + '<a class="whatsapp-order" href="https://wa.me/' + encodeURIComponent(phone) + '?text=' + encodeURIComponent(message) + '" target="_blank" rel="noopener" aria-label="Enviar pedido por WhatsApp">WhatsApp</a></div></div>';
            }).join('') : '<p>' + escapeHtml(emptyMessage) + '</p>';
        }
        ordersNode.innerHTML = renderOrderCards(todayOrders, 'Todavía no hay pedidos de hoy.');
        historyNode.innerHTML = renderOrderCards(historicalOrders, 'Aún no hay pedidos anteriores ni pedidos no vendidos.');
        document.querySelectorAll('#admin-orders [data-action], #admin-order-history [data-action]').forEach(function (button) {
            button.addEventListener('click', function () {
                if (button.dataset.action === 'mark-not-sold') {
                    markOrderNotSold(button.dataset.id);
                    return;
                }
                var receiptWindow = window.open('', '_blank');
                if (button.dataset.action === 'register-sale') registerSale(button.dataset.id, receiptWindow);
                else {
                    var sale = read(STORAGE.orders, []).find(function (order) { return order.id === button.dataset.id; });
                    if (sale && !printReceipt(sale, receiptWindow)) document.getElementById('admin-message').textContent = 'Permite las ventanas emergentes del navegador para imprimir el comprobante.';
                }
            });
        });
        renderSalesReport();
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
            event.preventDefault();
            document.getElementById('checkout-message').textContent = 'La compra todavía no está habilitada. No se registró el pedido ni se realizó ningún cobro.';
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
        document.querySelectorAll('.admin-tab').forEach(function (tab) {
            tab.addEventListener('click', function () {
                document.querySelectorAll('.admin-tab').forEach(function (item) { item.classList.toggle('active', item === tab); });
                document.querySelectorAll('.admin-section').forEach(function (section) { section.hidden = section.id !== tab.dataset.adminSection; });
            });
        });
        ['report-from', 'report-to'].forEach(function (id) {
            var input = document.getElementById(id);
            if (input) input.addEventListener('change', renderSalesReport);
        });
        var exportButton = document.getElementById('export-sales-report');
        if (exportButton) exportButton.addEventListener('click', exportSalesReport);
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
