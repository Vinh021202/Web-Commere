export function money(value) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

export function cleanText(value, fallback = '') {
  return String(value ?? fallback)
    .replace(/[<>"']/g, '')
    .trim();
}

export function remoteImage(path, fallback, apiBase) {
  if (!path) {
    return fallback;
  }

  if (/^https?:\/\//i.test(path) || path.startsWith('./')) {
    return path;
  }

  if (path.startsWith('/')) {
    return `${apiBase}${path}`;
  }

  return path;
}
