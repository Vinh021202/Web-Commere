import { asset } from '../utils/assets.js';
import { ProductCard } from './ProductCard.js';

export function ProductSection(state) {
  return `
    <section class="section section-shell" id="products">
      <div class="section-head">
        <div>
          <span class="eyebrow">${state.nav === 'favorites' ? 'Danh sách đã lưu' : 'Bán chạy'}</span>
          <h2 class="section-title">${state.nav === 'favorites' ? 'Yêu thích' : 'Gợi ý hôm nay'}</h2>
          <p class="section-subtitle" id="productSubtitle">Sản phẩm hợp với nhịp mua sắm mobile</p>
        </div>
        <button class="link-button" data-action="refresh">${state.apiOnline ? 'Làm mới' : 'API'}</button>
      </div>
      <div class="product-toolbar">
        <span class="product-count" id="productCount"></span>
        <div class="segmented" aria-label="Kiểu hiển thị">
          <button class="${state.view === 'grid' ? 'is-active' : ''}" data-action="view" data-view="grid">Lưới</button>
          <button class="${state.view === 'row' ? 'is-active' : ''}" data-action="view" data-view="row">Ngang</button>
        </div>
      </div>
      <div id="productsGrid"></div>
    </section>
  `;
}

export function ProductArea(state, products) {
  if (state.loading) {
    return `<div class="product-grid"><div class="skeleton"></div><div class="skeleton"></div></div>`;
  }

  if (products.length === 0) {
    return `
      <div class="empty-state">
        <img src="${asset('cartfoot.png')}" alt="Không có sản phẩm" />
        <h3>Chưa có sản phẩm phù hợp</h3>
        <p>Thử đổi danh mục hoặc xóa từ khóa tìm kiếm.</p>
        <button class="primary-button" data-action="reset-filter">Xem tất cả</button>
      </div>
    `;
  }

  return `
    <div class="${state.view === 'row' ? 'product-row' : 'product-grid'}">
      ${products.map((product) => ProductCard(product, state)).join('')}
    </div>
  `;
}
