import { icons } from '../data/icons.js';
import { asset } from '../utils/assets.js';
import { cleanText } from '../utils/format.js';

export function Header(state) {
  return `
    <header class="topbar">
      <div class="mobile-top-strip">
        <span>Ưu đãi chọn lọc cho phong cách sống hiện đại</span>
        <button type="button" data-action="toast" data-message="Trung tâm hỗ trợ sẽ dùng luồng client chính.">Hỗ trợ</button>
      </div>
      <div class="topbar-main">
        <div class="topbar-row">
          <div class="brand">
            <img class="brand-logo" src="${asset('logo.png')}" alt="Web-Commerce" />
            <div class="brand-copy">
              <span class="brand-kicker">Trải nghiệm mua sắm</span>
              <span class="brand-title">Web-Commerce</span>
            </div>
          </div>
          <div class="topbar-row topbar-actions">
            <span class="status-pill ${state.apiOnline ? '' : 'is-sample'}">
              <span class="status-dot"></span>
              ${state.apiOnline ? 'Online' : 'Mẫu'}
            </span>
            <button class="icon-button" type="button" aria-label="Tài khoản" data-action="account">
              ${icons.user}
            </button>
          </div>
        </div>
        <label class="search-box">
          <span class="search-icon">${icons.search}</span>
          <input
            id="searchInput"
            type="search"
            inputmode="search"
            autocomplete="off"
            placeholder="Tìm sản phẩm, thương hiệu hoặc danh mục..."
            value="${cleanText(state.query)}"
          />
          <button class="clear-search" type="button" aria-label="Xóa tìm kiếm" data-action="clear-search">
            ${icons.close}
          </button>
        </label>
        <nav class="client-nav-rail" aria-label="Điều hướng nhanh">
          <button type="button" data-action="nav-home">Trang chủ</button>
          <button type="button" data-action="nav-categories">Danh mục</button>
          <button type="button" data-action="nav-favorites">Yêu thích</button>
          <button type="button" data-action="open-cart">Giỏ hàng</button>
        </nav>
      </div>
    </header>
  `;
}
