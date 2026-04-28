import { BottomNav } from './components/BottomNav.js';
import { CategoryRail, CategorySection } from './components/CategorySection.js';
import { Deals } from './components/Deals.js';
import { Header } from './components/Header.js';
import { Hero } from './components/Hero.js';
import { MiniCart } from './components/MiniCart.js';
import { ProductArea, ProductSection } from './components/ProductSection.js';
import { Sheets } from './components/Sheets.js';
import { showToast } from './components/Toast.js';
import {
  addCart,
  cartItems,
  cartStats,
  filteredProducts,
  hydrateStore,
  state,
  toggleFavorite
} from './state/store.js';

export function createApp(root) {
  function render() {
    root.innerHTML = `
      <div class="mobile-shell">
        <main class="app-screen">
          ${Header(state)}
          ${Hero()}
          ${Deals()}
          ${CategorySection()}
          ${ProductSection(state)}
        </main>
        <div id="miniCartRoot"></div>
        <div id="bottomNavRoot"></div>
        <div id="sheetRoot"></div>
        <div class="toast" id="toast"></div>
      </div>
    `;

    renderCategoryRail();
    renderProductArea();
    renderMiniCart();
    renderBottomNav();
    renderSheet();
  }

  function renderCategoryRail() {
    const rail = document.querySelector('#categoryRail');
    if (rail) {
      rail.innerHTML = CategoryRail(state);
    }
  }

  function renderProductArea() {
    const grid = document.querySelector('#productsGrid');
    const count = document.querySelector('#productCount');
    const subtitle = document.querySelector('#productSubtitle');
    const products = filteredProducts();

    if (!grid || !count) {
      return;
    }

    const selected = state.categories.find((category) => category.id === state.selectedCategory);
    count.textContent = `${products.length} sản phẩm`;

    if (subtitle) {
      subtitle.textContent =
        state.nav === 'favorites'
          ? 'Những món bạn đã lưu để xem lại'
          : selected?.id === 'all'
            ? 'Sản phẩm hợp với nhịp mua sắm mobile'
            : `Đang xem nhóm ${selected?.name || 'sản phẩm'}`;
    }

    grid.innerHTML = ProductArea(state, products);
  }

  function renderMiniCart() {
    const miniCart = document.querySelector('#miniCartRoot');
    if (miniCart) {
      miniCart.innerHTML = MiniCart(cartStats());
    }
  }

  function renderBottomNav() {
    const nav = document.querySelector('#bottomNavRoot');
    if (nav) {
      nav.innerHTML = BottomNav(state, cartStats());
    }
  }

  function renderSheet() {
    const sheet = document.querySelector('#sheetRoot');
    if (sheet) {
      sheet.innerHTML = Sheets(state, state.products, cartItems(), cartStats());
    }
  }

  function renderPurchaseSurfaces() {
    renderProductArea();
    renderMiniCart();
    renderBottomNav();
    renderSheet();
  }

  async function refreshData() {
    state.loading = true;
    renderProductArea();
    await hydrateStore();
    render();
    showToast(state.apiOnline ? 'Đã cập nhật dữ liệu API' : 'Đang dùng dữ liệu mẫu');
  }

  function bindEvents() {
    root.addEventListener('input', (event) => {
      if (event.target?.id === 'searchInput') {
        state.query = event.target.value;
        state.nav = state.nav === 'favorites' ? 'favorites' : 'home';
        renderProductArea();
        renderBottomNav();
      }
    });

    root.addEventListener('click', async (event) => {
      const target = event.target.closest('[data-action]');
      if (!target) {
        return;
      }

      const { action, id, view, message } = target.dataset;

      if (action === 'category') {
        state.selectedCategory = id;
        state.nav = 'categories';
        renderCategoryRail();
        renderProductArea();
        renderBottomNav();
        return;
      }

      if (action === 'all-categories' || action === 'reset-filter') {
        state.selectedCategory = 'all';
        state.query = '';
        state.nav = 'home';
        render();
        return;
      }

      if (action === 'clear-search') {
        state.query = '';
        render();
        return;
      }

      if (action === 'view') {
        state.view = view;
        renderProductArea();
        return;
      }

      if (action === 'favorite') {
        showToast(toggleFavorite(id) ? 'Đã lưu vào yêu thích' : 'Đã bỏ khỏi yêu thích');
        renderProductArea();
        renderBottomNav();
        return;
      }

      if (action === 'open-product') {
        state.sheet = { type: 'product', id };
        renderSheet();
        return;
      }

      if (action === 'add-cart') {
        addCart(id, 1);
        renderPurchaseSurfaces();
        showToast('Đã thêm vào giỏ hàng');
        return;
      }

      if (action === 'increase') {
        addCart(id, 1);
        renderPurchaseSurfaces();
        return;
      }

      if (action === 'decrease') {
        addCart(id, -1);
        renderPurchaseSurfaces();
        return;
      }

      if (action === 'open-cart') {
        state.nav = 'cart';
        state.sheet = { type: 'cart' };
        renderBottomNav();
        renderSheet();
        return;
      }

      if (action === 'account') {
        state.nav = 'account';
        state.sheet = { type: 'account' };
        renderBottomNav();
        renderSheet();
        return;
      }

      if (action === 'close-sheet') {
        state.sheet = null;
        if (state.nav === 'cart' || state.nav === 'account') {
          state.nav = 'home';
        }
        renderBottomNav();
        renderSheet();
        return;
      }

      if (action === 'nav-home') {
        state.nav = 'home';
        state.sheet = null;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        renderProductArea();
        renderBottomNav();
        renderSheet();
        return;
      }

      if (action === 'nav-categories') {
        state.nav = 'categories';
        state.sheet = null;
        document.querySelector('#categories')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        renderProductArea();
        renderBottomNav();
        renderSheet();
        return;
      }

      if (action === 'nav-favorites') {
        state.nav = 'favorites';
        state.sheet = null;
        document.querySelector('#products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        renderProductArea();
        renderBottomNav();
        renderSheet();
        return;
      }

      if (action === 'refresh') {
        await refreshData();
        return;
      }

      if (action === 'checkout') {
        showToast('Luồng thanh toán có thể nối với client chính');
        return;
      }

      if (action === 'toast') {
        showToast(message || 'Đã nhận thao tác');
      }
    });
  }

  async function init() {
    bindEvents();
    render();
    await hydrateStore();
    render();
  }

  return { init, render };
}
