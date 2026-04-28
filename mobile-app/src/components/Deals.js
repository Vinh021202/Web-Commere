import { icons } from '../data/icons.js';

export function Deals() {
  return `
    <section class="deal-strip section-shell" aria-label="Quyền lợi mua hàng">
      <div class="deal-item">
        <span class="deal-icon is-primary">${icons.truck}</span>
        <span>
          <span class="deal-label">Giao nhanh</span>
          <span class="deal-sub">Từ 2 giờ</span>
        </span>
      </div>
      <div class="deal-item">
        <span class="deal-icon is-teal">${icons.shield}</span>
        <span>
          <span class="deal-label">Thanh toán</span>
          <span class="deal-sub">An toàn</span>
        </span>
      </div>
    </section>
  `;
}
