import { fallbackCategories, fallbackProducts } from '../data/fallbackData.js';
import { fetchJson, getApiBase } from '../utils/api.js';
import { cleanText, remoteImage } from '../utils/format.js';
import { loadJson, saveJson } from '../utils/storage.js';

const CART_KEY = 'web-commerce-mobile-cart';
const FAVORITES_KEY = 'web-commerce-mobile-favorites';

export const state = {
  apiBase: getApiBase(),
  apiOnline: false,
  loading: true,
  categories: fallbackCategories,
  products: fallbackProducts,
  selectedCategory: 'all',
  query: '',
  view: 'grid',
  nav: 'home',
  sheet: null,
  cart: loadJson(CART_KEY, {}),
  favorites: new Set(loadJson(FAVORITES_KEY, []))
};

export function saveState() {
  saveJson(CART_KEY, state.cart);
  saveJson(FAVORITES_KEY, [...state.favorites]);
}

export async function hydrateStore() {
  try {
    const [categoryResponse, productResponse] = await Promise.all([
      fetchJson(state.apiBase, '/api/category'),
      fetchJson(state.apiBase, '/api/product/getAllProducts')
    ]);

    const apiCategories = Array.isArray(categoryResponse?.data) ? categoryResponse.data : [];
    const apiProducts = Array.isArray(productResponse?.products)
      ? productResponse.products
      : Array.isArray(productResponse?.data)
        ? productResponse.data
        : [];

    if (apiCategories.length > 0) {
      state.categories = [fallbackCategories[0], ...apiCategories.map(normalizeCategory)];
    }

    if (apiProducts.length > 0) {
      state.products = apiProducts.map(normalizeProduct);
    }

    state.apiOnline = apiCategories.length > 0 || apiProducts.length > 0;
  } catch {
    state.apiOnline = false;
  } finally {
    state.loading = false;
  }
}

export function filteredProducts() {
  return state.products.filter(productMatches);
}

export function cartItems() {
  return Object.entries(state.cart)
    .map(([id, quantity]) => {
      const product =
        state.products.find((item) => item.id === id) ||
        fallbackProducts.find((item) => item.id === id);
      return product ? { product, quantity } : null;
    })
    .filter(Boolean);
}

export function cartStats() {
  return cartItems().reduce(
    (stats, item) => {
      stats.count += item.quantity;
      stats.total += item.product.price * item.quantity;
      return stats;
    },
    { count: 0, total: 0 }
  );
}

export function addCart(id, amount = 1) {
  state.cart[id] = Math.max(0, (state.cart[id] || 0) + amount);

  if (state.cart[id] === 0) {
    delete state.cart[id];
  }

  saveState();
}

export function toggleFavorite(id) {
  if (state.favorites.has(id)) {
    state.favorites.delete(id);
    saveState();
    return false;
  }

  state.favorites.add(id);
  saveState();
  return true;
}

function productMatches(product) {
  const query = state.query.toLowerCase().trim();
  const selected = state.selectedCategory;
  const selectedCategory = state.categories.find((category) => category.id === selected);
  const inCategory =
    selected === 'all' ||
    product.categoryId === selected ||
    product.category?.toLowerCase() === selectedCategory?.name?.toLowerCase();
  const inQuery =
    !query ||
    [product.name, product.brand, product.category].some((value) =>
      String(value || '').toLowerCase().includes(query)
    );
  const inFavorites = state.nav !== 'favorites' || state.favorites.has(product.id);

  return inCategory && inQuery && inFavorites;
}

function normalizeCategory(item, index) {
  const id = cleanText(item?._id || item?.id || item?.name || `category-${index}`);

  return {
    id,
    name: cleanText(item?.name || item?.catName || `Danh mục ${index + 1}`),
    image: remoteImage(
      item?.images?.[0] || item?.image || item?.icon,
      fallbackCategories[index + 1]?.image,
      state.apiBase
    )
  };
}

function normalizeProduct(item, index) {
  const fallback = fallbackProducts[index % fallbackProducts.length];
  const id = cleanText(item?._id || item?.id || `product-${index}`);
  const categoryId = cleanText(
    item?.catId?._id || item?.categoryId || item?.catName || item?.category?.name || fallback.categoryId
  );
  const category = cleanText(
    item?.catName || item?.category?.name || item?.categoryName || fallback.category
  );

  return {
    id,
    name: cleanText(item?.name || item?.productTitle || fallback.name),
    brand: cleanText(item?.brand || fallback.brand),
    price: Number(item?.price || fallback.price),
    oldPrice: Number(item?.oldPrice || fallback.oldPrice),
    discount: Number(item?.discount || fallback.discount || 0),
    rating: Number(item?.rating || fallback.rating || 0),
    countInStock: Number(item?.countInStock ?? fallback.countInStock ?? 0),
    categoryId,
    category,
    image: remoteImage(
      item?.images?.[0] || item?.image || item?.bannerimages?.[0],
      fallback.image,
      state.apiBase
    )
  };
}
