import { icons } from '../data/icons.js';

export function BottomNav(state, stats) {
  const favCount = state.favorites.size;
  const items = [
    { id: 'home', label: 'Home', icon: icons.home, action: 'nav-home' },
    { id: 'categories', label: 'Danh mục', icon: icons.grid, action: 'nav-categories' },
    { id: 'favorites', label: 'Lưu', icon: icons.heart, action: 'nav-favorites', badge: favCount },
    { id: 'cart', label: 'Giỏ', icon: icons.bag, action: 'open-cart', badge: stats.count },
    { id: 'account', label: 'Tôi', icon: icons.user, action: 'account' }
  ];

  return `
    <nav class="bottom-nav" aria-label="Điều hướng">
      ${items
        .map(
          (item) => `
            <button class="nav-button ${state.nav === item.id ? 'is-active' : ''}" data-action="${item.action}">
              ${item.icon}
              <span>${item.label}</span>
              ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
            </button>
          `
        )
        .join('')}
    </nav>
  `;
}
