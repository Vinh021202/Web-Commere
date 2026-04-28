import { money } from '../utils/format.js';

export function MiniCart(stats) {
  if (stats.count === 0) {
    return '';
  }

  return `
    <aside class="mini-cart">
      <div>
        <strong>${stats.count} sản phẩm trong giỏ</strong>
        <span>${money(stats.total)}</span>
      </div>
      <button data-action="open-cart">Xem giỏ</button>
    </aside>
  `;
}
