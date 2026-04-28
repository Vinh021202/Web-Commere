import { icons } from '../data/icons.js';
import { money } from '../utils/format.js';

export function ProductCard(product, state) {
  const isFavorite = state.favorites.has(product.id);
  const productQuantity = state.cart[product.id] || 0;

  return `
    <article class="product-card">
      <div class="product-card__glow"></div>
      <div class="product-media" data-action="open-product" data-id="${product.id}">
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
        ${product.discount ? `<span class="badge">-${product.discount}%</span>` : ''}
        <button class="favorite-button ${isFavorite ? 'is-active' : ''}" type="button" aria-label="Yêu thích" data-action="favorite" data-id="${product.id}">
          ${isFavorite ? icons.heartFill : icons.heart}
        </button>
      </div>
      <div class="product-info">
        <span class="product-brand">${product.brand}</span>
        <h3 class="product-name" data-action="open-product" data-id="${product.id}">${product.name}</h3>
        <div class="rating-line">
          <span class="rating">★ ${product.rating.toFixed(1)}</span>
          <span class="stock">${product.countInStock > 0 ? 'Còn hàng' : 'Hết hàng'}</span>
        </div>
        <div class="product-meta-box">
          <div class="price-line">
            <span class="price">${money(product.price)}</span>
            ${product.oldPrice ? `<span class="old-price">${money(product.oldPrice)}</span>` : ''}
          </div>
          <div class="trust-line">
            <span>Giao nhanh</span>
            <span>Chính hãng</span>
          </div>
        </div>
        <div class="card-actions">
          <button class="primary-button" data-action="add-cart" data-id="${product.id}">
            ${productQuantity ? `Đã thêm ${productQuantity}` : 'Thêm giỏ'}
          </button>
          <button class="ghost-button" aria-label="Xem nhanh" data-action="open-product" data-id="${product.id}">
            ${icons.plus}
          </button>
        </div>
      </div>
    </article>
  `;
}
