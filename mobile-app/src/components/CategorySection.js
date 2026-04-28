export function CategorySection() {
  return `
    <section class="section section-shell" id="categories">
      <div class="section-head">
        <div>
          <span class="eyebrow">Mua theo danh mục</span>
          <h2 class="section-title">Danh mục</h2>
          <p class="section-subtitle">Lướt nhanh theo nhóm hàng</p>
        </div>
        <button class="link-button" data-action="all-categories">Tất cả</button>
      </div>
      <div id="categoryRail"></div>
    </section>
  `;
}

export function CategoryRail(state) {
  return `
    <div class="category-rail">
      ${state.categories
        .map(
          (category) => `
            <button class="category-card ${category.id === state.selectedCategory ? 'is-active' : ''}" data-action="category" data-id="${category.id}">
              <img class="category-image" src="${category.image}" alt="${category.name}" />
              <span class="category-name">${category.name}</span>
            </button>
          `
        )
        .join('')}
    </div>
  `;
}
