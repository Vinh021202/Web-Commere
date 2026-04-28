import { asset } from '../utils/assets.js';

export const fallbackCategories = [
  { id: 'all', name: 'Tất cả', image: asset('logo.png') },
  { id: 'fashion', name: 'Thời trang', image: asset('category-fashion.jpg') },
  { id: 'beauty', name: 'Làm đẹp', image: asset('category-beauty.jpg') },
  { id: 'bags', name: 'Túi xách', image: asset('category-bags.jpg') },
  { id: 'electronics', name: 'Công nghệ', image: asset('category-electronics.png') },
  { id: 'wellness', name: 'Sức khỏe', image: asset('category-wellness.jpg') }
];

export const fallbackProducts = [
  {
    id: 'set-style',
    name: 'Set phụ kiện phong cách tối giản',
    brand: 'Modern Home',
    price: 259000,
    oldPrice: 329000,
    discount: 21,
    rating: 4.8,
    countInStock: 18,
    categoryId: 'fashion',
    category: 'Thời trang',
    image: asset('product1.jpg')
  },
  {
    id: 'beauty-kit',
    name: 'Bộ chăm sóc cá nhân cao cấp',
    brand: 'Daily Care',
    price: 189000,
    oldPrice: 249000,
    discount: 24,
    rating: 4.7,
    countInStock: 23,
    categoryId: 'beauty',
    category: 'Làm đẹp',
    image: asset('product2.jpg')
  },
  {
    id: 'smart-bag',
    name: 'Túi tiện ích đi làm và du lịch',
    brand: 'Urban Pack',
    price: 399000,
    oldPrice: 479000,
    discount: 17,
    rating: 4.9,
    countInStock: 9,
    categoryId: 'bags',
    category: 'Túi xách',
    image: asset('product3.jpg')
  },
  {
    id: 'speaker-mini',
    name: 'Loa mini không dây pin dài',
    brand: 'Soundly',
    price: 329000,
    oldPrice: 429000,
    discount: 23,
    rating: 4.6,
    countInStock: 16,
    categoryId: 'electronics',
    category: 'Công nghệ',
    image: asset('bannerV2.jpg')
  }
];
