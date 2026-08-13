/* =============================================
   CART.JS — Giỏ hàng & Thanh toán
   Buddhist Tantric Site
============================================= */

// ── Tiện ích ──
function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function sanitizeForAttribute(value) {
  return escapeHtml(String(value ?? '')).replace(/[`$\\]/g, '');
}

function formatVND(n) {
  return n.toLocaleString('vi-VN') + '₫';
}

function generateOrderId() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return 'TTH' + d.getFullYear() + pad(d.getMonth()+1) + pad(d.getDate()) +
         '-' + pad(d.getHours()) + pad(d.getMinutes()) + pad(d.getSeconds());
}

// ── Cart CRUD (localStorage) ──
function getCart() {
  try { return JSON.parse(localStorage.getItem('tth_cart') || '[]'); }
  catch { return []; }
}

function saveCart(cart) {
  try { localStorage.setItem('tth_cart', JSON.stringify(cart)); } catch {}
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart(cart);
  updateCartBadge();
  showAddedToast(product.name);
}

function removeFromCart(productId) {
  let cart = getCart().filter(item => item.id !== productId);
  saveCart(cart);
  updateCartBadge();
  renderCartPage();
}

function updateQty(productId, newQty) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  if (newQty <= 0) {
    removeFromCart(productId);
    return;
  }
  item.qty = newQty;
  saveCart(cart);
  updateCartBadge();
  renderCartPage();
}

function clearCart() {
  saveCart([]);
  updateCartBadge();
  renderCartPage();
}

function getCartTotal() {
  return getCart().reduce((sum, i) => sum + i.price * i.qty, 0);
}

function getCartCount() {
  return getCart().reduce((sum, i) => sum + i.qty, 0);
}

// ── Badge cập nhật ──
function updateCartBadge() {
  const badges = document.querySelectorAll('.cart-badge, #cartBadge');
  const count = getCartCount();
  badges.forEach(b => {
    b.textContent = count;
    b.style.display = 'inline-flex';
    b.classList.toggle('is-empty', count === 0);
  });

  const cartLinks = document.querySelectorAll('.cart-header-link');
  cartLinks.forEach(link => {
    link.setAttribute('aria-label', `Giỏ hàng, ${count} sản phẩm`);
    link.title = count > 0 ? `Giỏ hàng (${count})` : 'Giỏ hàng trống';
  });
}

// ── Toast thông báo ──
function showAddedToast(name) {
  let toast = document.getElementById('cartToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'cartToast';
    toast.className = 'cart-toast';
    document.body.appendChild(toast);
  }

  toast.textContent = '';
  toast.appendChild(document.createTextNode('✅ Đã thêm '));

  const strong = document.createElement('strong');
  strong.textContent = String(name ?? '');
  toast.appendChild(strong);

  const suffix = document.createTextNode(' vào giỏ hàng');
  toast.appendChild(suffix);

  const link = document.createElement('a');
  link.href = 'cart.html';
  link.className = 'toast-cart-link';
  link.textContent = 'Xem giỏ hàng →';
  toast.appendChild(link);

  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3500);
}

// ── Render trang cart.html ──
function renderCartPage() {
  const cartBody = document.getElementById('cartBody');
  const cartEmpty = document.getElementById('cartEmpty');
  const cartContent = document.getElementById('cartContent');
  if (!cartBody) return; // not on cart page

  const cart = getCart();

  if (cart.length === 0) {
    cartEmpty.style.display = 'block';
    cartContent.style.display = 'none';
    return;
  }

  cartEmpty.style.display = 'none';
  cartContent.style.display = 'block';

  cartBody.innerHTML = '';

  cart.forEach(item => {
    const row = document.createElement('tr');

    const productCell = document.createElement('td');
    productCell.className = 'cart-product-cell';

    const img = document.createElement('div');
    img.className = 'cart-product-img';
    img.style.backgroundImage = `url('${sanitizeForAttribute(item.image)}')`;

    const info = document.createElement('div');
    const name = document.createElement('strong');
    name.textContent = item.name;
    const cat = document.createElement('small');
    cat.textContent = item.cat || '';
    info.appendChild(name);
    info.appendChild(cat);

    productCell.appendChild(img);
    productCell.appendChild(info);

    const priceCell = document.createElement('td');
    priceCell.className = 'cart-price';
    priceCell.textContent = formatVND(item.price);

    const qtyCell = document.createElement('td');
    const qtyControl = document.createElement('div');
    qtyControl.className = 'qty-control';

    const minusBtn = document.createElement('button');
    minusBtn.type = 'button';
    minusBtn.className = 'qty-btn';
    minusBtn.textContent = '−';
    minusBtn.addEventListener('click', () => updateQty(item.id, item.qty - 1));

    const qtyValue = document.createElement('span');
    qtyValue.className = 'qty-value';
    qtyValue.textContent = String(item.qty);

    const plusBtn = document.createElement('button');
    plusBtn.type = 'button';
    plusBtn.className = 'qty-btn';
    plusBtn.textContent = '+';
    plusBtn.addEventListener('click', () => updateQty(item.id, item.qty + 1));

    qtyControl.appendChild(minusBtn);
    qtyControl.appendChild(qtyValue);
    qtyControl.appendChild(plusBtn);
    qtyCell.appendChild(qtyControl);

    const totalCell = document.createElement('td');
    totalCell.className = 'cart-price';
    totalCell.textContent = formatVND(item.price * item.qty);

    const actionCell = document.createElement('td');
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'remove-btn';
    removeBtn.title = 'Xóa';
    removeBtn.textContent = '✕';
    removeBtn.addEventListener('click', () => removeFromCart(item.id));
    actionCell.appendChild(removeBtn);

    row.appendChild(productCell);
    row.appendChild(priceCell);
    row.appendChild(qtyCell);
    row.appendChild(totalCell);
    row.appendChild(actionCell);
    cartBody.appendChild(row);
  });

  const total = getCartTotal();
  document.getElementById('cartSubtotal').textContent = formatVND(total);
  document.getElementById('cartTotal').textContent = formatVND(total);
}

// ── Render sidebar checkout.html ──
function renderCheckoutSidebar() {
  const container = document.getElementById('checkoutItems');
  if (!container) return;

  const cart = getCart();
  if (cart.length === 0) {
    window.location.href = 'cart.html';
    return;
  }

  container.replaceChildren();

  cart.forEach(item => {
    const itemRow = document.createElement('div');
    itemRow.className = 'ck-item';

    const image = document.createElement('div');
    image.className = 'ck-item-img';
    image.style.backgroundImage = `url('${sanitizeForAttribute(item.image)}')`;

    const qty = document.createElement('span');
    qty.className = 'ck-item-qty';
    qty.textContent = String(item.qty);
    image.appendChild(qty);

    const info = document.createElement('div');
    info.className = 'ck-item-info';

    const name = document.createElement('strong');
    name.textContent = item.name;
    const total = document.createElement('span');
    total.textContent = formatVND(item.price * item.qty);

    info.appendChild(name);
    info.appendChild(total);

    itemRow.appendChild(image);
    itemRow.appendChild(info);
    container.appendChild(itemRow);
  });

  const total = getCartTotal();
  const ckSub = document.getElementById('ckSubtotal');
  const ckTotal = document.getElementById('ckTotal');
  if (ckSub) ckSub.textContent = formatVND(total);
  if (ckTotal) ckTotal.textContent = formatVND(total);
}

// ── Xử lý đặt hàng ──
async function handleOrder(e) {
  e.preventDefault();
  const form = e.target;
  const fd = new FormData(form);
  const data = Object.fromEntries(fd.entries());

  // Validate
  if (!data.fullname || !data.email || !data.phone || !data.address || !data.city) {
    alert('Vui lòng điền đầy đủ thông tin bắt buộc.');
    return;
  }

  const orderId = generateOrderId();
  const cart = getCart();
  const total = getCartTotal();

  // Disable submit button and show processing
  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Đang xử lý đơn hàng...';
  }

  try {
    // Prepare order data - match actual Supabase columns
    const orderData = {
      order_code: orderId,
      fullname: data.fullname,
      email: data.email,
      phone: data.phone,
      address: data.address || '',
      city: data.city || '',
      district: data.district || '',
      note: data.note || '',
      payment_method: data.payment || 'cod'
    };

    // Call Supabase to insert order
    const { data: insertData, error } = await supabaseClient
      .from('orders')
      .insert([orderData]);

    if (error) {
      console.error('Lỗi Supabase:', error);
      if (submitBtn) {
        submitBtn.textContent = `❌ Lỗi: ${error.message}`;
        submitBtn.disabled = false;
      }
      setTimeout(() => {
        if (submitBtn) submitBtn.textContent = '✅ Đặt hàng';
      }, 3000);
      return;
    }

    // Order successfully inserted - send confirmation email
    const emailTemplate = window.ResendEmailService?.getOrderConfirmationTemplate({
      order_code: orderId,
      fullname: data.fullname,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      district: data.district || '',
      note: data.note || '',
      payment_method: data.payment || 'cod'
    });

    if (window.ResendEmailService && emailTemplate) {
      await window.ResendEmailService.sendEmail(
        data.email,
        `✅ Xác nhận đơn hàng #${orderId} - Mật Tông Việt`,
        emailTemplate
      ).catch(err => {
        console.warn('Email send warning:', err);
        // Continue even if email fails - order is already saved
      });
    }

    // Show success page
    document.getElementById('checkoutForm').style.display = 'none';
    const steps = document.querySelector('.checkout-steps');
    if (steps) {
      steps.querySelectorAll('.step')[2].classList.add('active');
      steps.querySelectorAll('.step-line')[1].classList.add('done');
    }

    const successEl = document.getElementById('orderSuccess');
    if (successEl) successEl.style.display = 'block';
    
    const orderIdEl = document.getElementById('orderId');
    if (orderIdEl) orderIdEl.textContent = orderId;

    const paymentLabels = { cod: 'Thanh toán khi nhận hàng', bank: 'Chuyển khoản ngân hàng', momo: 'Ví MoMo / ZaloPay' };

    const successDetails = document.getElementById('successDetails');
    if (successDetails) {
      successDetails.textContent = '';

      const successGrid = document.createElement('div');
      successGrid.className = 'success-info-grid';

      const fields = [
        ['Người nhận:', data.fullname],
        ['Điện thoại:', data.phone],
        ['Email:', data.email],
        ['Địa chỉ:', `${data.address}, ${data.district || ''}, ${data.city}`],
        ['Thanh toán:', paymentLabels[data.payment] || data.payment],
        ['Tổng tiền:', formatVND(total)],
        ['Số sản phẩm:', String(cart.reduce((s, i) => s + i.qty, 0))]
      ];

      fields.forEach(([label, value]) => {
        const item = document.createElement('div');
        const strong = document.createElement('strong');
        strong.textContent = label;
        item.appendChild(strong);
        item.appendChild(document.createTextNode(` ${String(value || '')}`));
        successGrid.appendChild(item);
      });

      successDetails.appendChild(successGrid);
    }

    // Xóa giỏ hàng
    clearCart();

    // Cuộn lên đầu
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Redirect sau 5 seconds
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 5000);

  } catch (err) {
    console.error('Lỗi khi xử lý đơn hàng:', err);
    if (submitBtn) {
      submitBtn.textContent = '❌ Lỗi: Không thể xử lý đơn hàng';
      submitBtn.disabled = false;
    }
    setTimeout(() => {
      if (submitBtn) submitBtn.textContent = '✅ Đặt hàng';
    }, 3000);
  }
}

// ── Phương thức thanh toán toggle ──
function setupPaymentToggle() {
  const radios = document.querySelectorAll('input[name="payment"]');
  const bankInfo = document.getElementById('bankInfo');
  const options = document.querySelectorAll('.payment-option');

  radios.forEach(r => {
    r.addEventListener('change', () => {
      options.forEach(o => o.classList.remove('selected'));
      r.closest('.payment-option').classList.add('selected');
      if (bankInfo) bankInfo.style.display = r.value === 'bank' ? 'block' : 'none';
    });
  });
}

// ── Nút "Thêm vào giỏ" trên trang sản phẩm ──
function setupAddToCartButtons() {
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const product = {
        id: btn.dataset.id,
        name: btn.dataset.name,
        price: parseInt(btn.dataset.price, 10) || 0,
        image: btn.dataset.image || '',
        cat: btn.dataset.cat || ''
      };
      addToCart(product);
    });
  });
}

// ── Khởi tạo ──
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();

  // Trang cart
  renderCartPage();
  const clearBtn = document.getElementById('clearCartBtn');
  if (clearBtn) clearBtn.addEventListener('click', () => {
    if (confirm('Bạn muốn xóa toàn bộ giỏ hàng?')) clearCart();
  });

  // Trang checkout
  renderCheckoutSidebar();
  const orderForm = document.getElementById('orderForm');
  if (orderForm) {
    orderForm.addEventListener('submit', handleOrder);
    setupPaymentToggle();
  }

  // Nút mua hàng
  setupAddToCartButtons();
});
