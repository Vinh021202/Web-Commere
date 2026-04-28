let toastTimer = null;

export function showToast(message) {
  const toast = document.querySelector('#toast');
  if (!toast) {
    return;
  }

  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('is-open');
  toastTimer = window.setTimeout(() => {
    toast.classList.remove('is-open');
  }, 1800);
}
