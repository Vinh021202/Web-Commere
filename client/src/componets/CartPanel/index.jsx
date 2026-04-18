import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { Button } from '@mui/material';
import { MyContext } from '../../App';
import { deleteData } from '../../utils/api';

const CartPanel = ({ data = [], onClose }) => {
  const context = useContext(MyContext);
  const cartItems = Array.isArray(data) ? data : [];
  const totalAmount = cartItems.reduce(
    (total, item) => total + parseInt(item?.price || 0, 10) * (item?.quantity || 0),
    0
  );
  const totalQuantity = cartItems.reduce((total, item) => total + (item?.quantity || 0), 0);

  const removeItem = (id) => {
    deleteData(`/api/cart/delete-cart-item/${id}`).then(() => {
      context.alertBox('success', context?.language === 'en' ? 'Product removed' : 'Đã xóa sản phẩm');
      context?.getCartItems();
    });
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b border-[rgba(255,82,82,0.12)] bg-[linear-gradient(180deg,rgba(255,245,242,0.96),rgba(255,255,255,0.92))] px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="eyebrow !px-3 !py-2 !text-[10px]">{context?.t('cartSummary')}</span>
            <h5 className="mt-3 text-[18px] font-[800] text-[#201714]">{context?.t('readyToCheckout')}</h5>
            <p className="mb-0 mt-1 text-[13px] text-[rgba(31,41,55,0.72)]">
              {context?.t('reviewBeforeCheckout')}
            </p>
          </div>

          <div className="rounded-[22px] border border-[rgba(255,82,82,0.16)] bg-white px-4 py-3 text-right shadow-[0_12px_24px_rgba(255,82,82,0.08)]">
            <span className="block text-[11px] font-[800] uppercase tracking-[0.12em] text-[#a65434]">
              {context?.t('total')}
            </span>
            <strong className="mt-1 block text-[18px] leading-none text-[#ff5252]">
              {context?.formatCurrency(totalAmount)}
            </strong>
          </div>
        </div>
      </div>

      <div className="scroll min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[rgba(255,255,255,0.65)] px-4 py-4">
        {cartItems.map((item) => (
          <div
            key={item?._id || item?.productId}
            className="soft-card mb-4 flex w-full items-center gap-4 p-3 last:mb-0"
          >
            <div className="h-[108px] w-[30%] overflow-hidden rounded-[18px] bg-[#fff4ef]">
              <Link to={`/product/${item?.productId}`} className="group block h-full" onClick={onClose}>
                <img
                  src={item?.image}
                  alt={item?.productTitle || context?.t('cartItemAlt')}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </Link>
            </div>

            <div className="relative w-[70%]">
              <div className="mb-2 flex items-start justify-between gap-3">
                <span className="rounded-full bg-[#fff1eb] px-3 py-1 text-[10px] font-[800] uppercase tracking-[0.12em] text-[#a65434]">
                  {context?.t('cartTitle')}
                </span>

                <button
                  type="button"
                  className="flex h-[34px] w-[34px] items-center justify-center rounded-full border border-[rgba(255,82,82,0.16)] bg-white text-[#7c553d] transition-all hover:border-[#ff5252] hover:bg-[#fff1eb] hover:text-[#ff5252]"
                  onClick={() => removeItem(item?._id)}
                  aria-label={context?.language === 'en' ? 'Remove product' : 'Xóa sản phẩm'}
                >
                  <MdOutlineDeleteOutline className="text-[18px]" />
                </button>
              </div>

              <h4 className="text-[14px] font-[700] leading-5 text-[#201714]">
                <Link to={`/product/${item?.productId}`} className="link transition-all" onClick={onClose}>
                  {item?.productTitle
                    ? `${item.productTitle.substring(0, 34)}${item.productTitle.length > 34 ? '...' : ''}`
                    : context?.t('productAlt')}
                </Link>
              </h4>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-[rgba(255,82,82,0.12)] bg-white px-3 py-1 text-[11px] font-[700] text-[#7c553d]">
                  {context?.t('quantity')}: {item?.quantity || 0}
                </span>
                <span className="rounded-full border border-[rgba(31,41,55,0.08)] bg-[#f8fafc] px-3 py-1 text-[11px] font-[700] text-[#475569]">
                  {context?.t('subtotal')}
                </span>
              </div>

              <div className="mt-3 flex items-end justify-between gap-3">
                <div>
                  <span className="block text-[11px] font-[700] uppercase tracking-[0.08em] text-[rgba(31,41,55,0.52)]">
                    {context?.language === 'en' ? 'Price' : 'Giá'}
                  </span>
                  <strong className="text-primary block text-[16px] font-[800] leading-none">
                    {context?.formatCurrency(Number(item?.price || 0))}
                  </strong>
                </div>

                <span className="text-right text-[12px] font-[700] text-[#1f2937]">
                  {context?.t('subtotal')}
                  <strong className="text-primary mt-1 block text-[15px]">
                    {context?.formatCurrency(Number(item?.price || 0) * Number(item?.quantity || 0))}
                  </strong>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-[rgba(255,82,82,0.12)] bg-white px-4 py-4">
        <div className="rounded-[24px] border border-[rgba(255,82,82,0.12)] bg-[linear-gradient(180deg,#ffffff_0%,#fff8f5_100%)] p-4 shadow-[0_14px_26px_rgba(15,23,42,0.06)]">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-[700] text-[#6b7280]">{context?.t('itemCount')}</span>
            <span className="text-[13px] font-[800] text-[#1f2937]">
              {context?.t('productsCount', { count: cartItems.length })}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[13px] font-[700] text-[#6b7280]">{context?.t('quantity')}</span>
            <span className="text-[13px] font-[800] text-[#1f2937]">{totalQuantity}</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-dashed border-[rgba(255,82,82,0.16)] pt-3">
            <span className="text-[13px] font-[700] text-[#6b7280]">{context?.t('total')}</span>
            <span className="text-primary text-[18px] font-[800]">{context?.formatCurrency(totalAmount)}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-[rgba(255,82,82,0.12)] bg-[rgba(255,255,255,0.96)] px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <Link to="/cart" className="block w-1/2" onClick={onClose}>
            <Button className="bg-org btn-border btn-lg w-full">{context?.t('viewCart')}</Button>
          </Link>
          <Link to="/checkout" className="block w-1/2" onClick={onClose}>
            <Button className="bg-org btn-lg w-full">{context?.t('checkout')}</Button>
          </Link>
        </div>
        <p className="mb-0 mt-3 text-center text-[11px] leading-5 text-[rgba(31,41,55,0.58)]">
          {context?.t('shippingAtCheckout')}
        </p>
      </div>
    </div>
  );
};

export default CartPanel;
