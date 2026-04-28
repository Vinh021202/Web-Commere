import { icons } from '../data/icons.js';
import { asset } from '../utils/assets.js';
import { money } from '../utils/format.js';

export function Sheets(state, products, items, stats) {
  const isOpen = Boolean(state.sheet);

  return `
    <div class="sheet-backdrop ${isOpen ? 'is-open' : ''}" data-action="close-sheet"></div>
    <section class="bottom-sheet ${isOpen ? 'is-open' : ''}" aria-modal="true" role="dialog">
      <div class="sheet-handle"></div>
      <div class="sheet-content">
        ${state.sheet ? SheetContent(state, products, items, stats) : ''}
      </div>
    </section>
  `;
}

function SheetContent(state, products, items, stats) {
  if (state.sheet?.type === 'product') {
    const product = products.find((item) => item.id === state.sheet.id);
    return product ? ProductDetail(product) : '';
  }

  if (state.sheet?.type === 'cart') {
    return CartSheet(items, stats);
  }

  if (state.sheet?.type === 'account') {
    return AccountSheet(state);
  }

  return '';
}

function ProductDetail(product) {
  return `
    <div class="sheet-head">
      <h2 class="sheet-title">Chi tiết sản phẩm</h2>
      <button class="icon-button" aria-label="Đóng" data-action="close-sheet">${icons.close}</button>
    </div>
    <div class="detail-layout">
      <img class="detail-image" src="${product.image}" alt="${product.name}" />
      <div class="detail-meta">
        <span class="badge">${product.category}</span>
        <span class="rating">★ ${product.rating.toFixed(1)}</span>
      </div>
      <h3 class="detail-name">${product.name}</h3>
      <p class="detail-copy">
        ${product.brand} đang có giá tốt trong giao diện mobile lấy cảm hứng trực tiếp từ client: thẻ mềm, màu đỏ cam và thao tác mua nhanh.
      </p>
      <div class="option-row" aria-label="Tùy chọn mẫu">
        <button class="option-chip">S</button>
        <button class="option-chip">M</button>
        <button class="option-chip">L</button>
        <button class="option-chip">XL</button>
      </div>
      <div class="price-line">
        <span class="price">${money(product.price)}</span>
        ${product.oldPrice ? `<span class="old-price">${money(product.oldPrice)}</span>` : ''}
      </div>
      <button class="primary-button" data-action="add-cart" data-id="${product.id}">${icons.bag} Thêm vào giỏ</button>
    </div>
  `;
}

function CartSheet(items, stats) {
  return `
    <div class="sheet-head">
      <h2 class="sheet-title">Giỏ hàng</h2>
      <button class="icon-button" aria-label="Đóng" data-action="close-sheet">${icons.close}</button>
    </div>
    ${
      items.length === 0
        ? `
          <div class="empty-state">
            <img src="${asset('cartfoot.png')}" alt="Giỏ hàng trống" />
            <h3>Giỏ hàng đang trống</h3>
            <p>Thêm vài sản phẩm để xem phần tóm tắt thanh toán.</p>
            <button class="primary-button" data-action="close-sheet">Tiếp tục mua</button>
          </div>
        `
        : `
          <div class="cart-list">
            ${items
              .map(
                ({ product, quantity }) => `
                  <article class="cart-item">
                    <img src="${product.image}" alt="${product.name}" />
                    <div>
                      <h3>${product.name}</h3>
                      <div class="cart-item-row">
                        <span class="price">${money(product.price)}</span>
                        <div class="qty-control" aria-label="Số lượng">
                          <button data-action="decrease" data-id="${product.id}">-</button>
                          <span>${quantity}</span>
                          <button data-action="increase" data-id="${product.id}">+</button>
                        </div>
                      </div>
                    </div>
                  </article>
                `
              )
              .join('')}
          </div>
          <div class="summary-box">
            <div class="summary-row"><span>Tạm tính</span><strong>${money(stats.total)}</strong></div>
            <div class="summary-row"><span>Vận chuyển</span><strong>Miễn phí</strong></div>
            <button class="primary-button" data-action="checkout">Thanh toán</button>
          </div>
        `
    }
  `;
}

function AccountSheet(state) {
  return `
    <div class="sheet-head">
      <h2 class="sheet-title">Tài khoản</h2>
      <button class="icon-button" aria-label="Đóng" data-action="close-sheet">${icons.close}</button>
    </div>
    <div class="account-panel">
      <div class="account-card">
        <span class="avatar">WC</span>
        <div>
          <strong>Khách mua hàng</strong>
          <p class="section-subtitle">Đăng nhập sẽ dùng lại luồng từ client chính.</p>
        </div>
      </div>
      <button class="ghost-button" data-action="toast" data-message="Màn đăng nhập sẽ nối với client chính khi tích hợp route.">${icons.user} Đăng nhập</button>
      <button class="ghost-button" data-action="toast" data-message="API hiện tại: ${state.apiBase}">${icons.filter} Xem API</button>
    </div>
  `;
}
