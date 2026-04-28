import { asset } from '../utils/assets.js';

export function Hero() {
  const slides = [
    {
      image: asset('banner1.webp'),
      tag: 'Bộ sưu tập mùa xuân 2026',
      title: 'Mua sắm gọn hơn, sang hơn trên mobile',
      text: 'Hero, danh mục, sản phẩm và giỏ hàng được thu lại theo nhịp của client.'
    },
    {
      image: asset('banner2.webp'),
      tag: 'Giá tốt mỗi tuần',
      title: 'Chọn món yêu thích chỉ vài chạm',
      text: 'Giữ phong cách đỏ cam, thẻ mềm và CTA bo tròn của giao diện web.'
    },
    {
      image: asset('bannerV2.jpg'),
      tag: 'Gợi ý được tuyển chọn',
      title: 'Không gian mua hàng nhẹ và dễ quét',
      text: 'Tối ưu cho màn hình nhỏ nhưng vẫn giống mặt tiền client.'
    }
  ];

  return `
    <section class="hero-track" aria-label="Ưu đãi nổi bật">
      ${slides
        .map(
          (slide) => `
            <article class="hero-card">
              <img src="${slide.image}" alt="${slide.title}" />
              <div class="hero-overlay">
                <span class="hero-tag">${slide.tag}</span>
                <h1 class="hero-title">${slide.title}</h1>
                <p class="hero-text">${slide.text}</p>
              </div>
            </article>
          `
        )
        .join('')}
    </section>
  `;
}
