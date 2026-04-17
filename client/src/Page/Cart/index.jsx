import React, { useContext, useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { BsFillBagCheckFill } from 'react-icons/bs';
import { FiArrowRight, FiShoppingBag, FiTruck } from 'react-icons/fi';
import CartItems from './cartItems';
import { MyContext } from '../../App';
import { fetchDataFromApi } from '../../utils/api';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const context = useContext(MyContext);
  const [productSizeData, setProductSizeData] = useState([]);
  const [producRamData, setProductRamData] = useState([]);
  const [productWeightData, setProductWeightData] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    fetchDataFromApi(`/api/product/productSize/get`).then((res) => {
      if (res?.success === true) {
        setProductSizeData(res?.data);
      }
    });

    fetchDataFromApi(`/api/product/productRams/get`).then((res) => {
      if (res?.success === true) {
        setProductRamData(res?.data);
      }
    });

    fetchDataFromApi(`/api/product/productWeight/get`).then((res) => {
      if (res?.success === true) {
        setProductWeightData(res?.data);
      }
    });
  }, []);

  const cartItems = context?.cartData || [];
  const totalAmount = cartItems.reduce(
    (total, item) => total + parseInt(item?.price || 0, 10) * (item?.quantity || 0),
    0
  );
  const totalProducts = cartItems.length;
  const totalUnits = cartItems.reduce((total, item) => total + (item?.quantity || 0), 0);

  const selectedSize = (item) => {
    if (item?.size !== '') return item?.size;
    if (item?.ram !== '') return item?.ram;
    if (item?.weight !== '') return item?.weight;
    return '';
  };

  return (
    <section className="py-10">
      <div className="container">
        <div className="section-shell listing-hero overflow-hidden px-6 py-8 md:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[720px]">
              <span className="eyebrow mb-4">Your Basket</span>
              <h1 className="section-heading mb-3">Review your cart before checkout.</h1>
              <p className="mb-0 max-w-[620px] text-[14px] text-[rgba(31,41,55,0.72)]">
                Update quantities, switch variants, and confirm your order summary in one place.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[430px]">
              <div className="soft-card p-4">
                <span className="listing-stat__label">Products</span>
                <strong className="listing-stat__value">{totalProducts}</strong>
              </div>
              <div className="soft-card p-4">
                <span className="listing-stat__label">Units</span>
                <strong className="listing-stat__value">{totalUnits}</strong>
              </div>
              <div className="soft-card p-4">
                <span className="listing-stat__label">Subtotal</span>
                <strong className="listing-stat__value !text-[1.3rem]">
                  {totalAmount.toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                    minimumFractionDigits: 0,
                  })}
                </strong>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-6 xl:flex-row xl:items-start">
          <div className="xl:w-[68%]">
            <div className="section-shell overflow-hidden px-0 py-0">
              <div className="flex min-h-[124px] items-center border-b border-[rgba(255,82,82,0.12)] px-6 py-5">
                <div className="flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="m-0 text-[26px] font-[800] text-[#201714]">Shopping cart</h2>
                    <p className="mb-0 mt-1 text-[14px] text-[rgba(31,41,55,0.7)]">
                      There are <span className="font-[800] text-primary">{totalProducts}</span>{' '}
                      products in your cart.
                    </p>
                  </div>

                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,82,82,0.14)] bg-white px-4 py-3 text-[13px] font-[800] text-[#7c553d] transition-all hover:border-[rgba(255,82,82,0.3)] hover:bg-[#fff4ef]"
                  >
                    Continue shopping <FiArrowRight className="text-[16px]" />
                  </Link>
                </div>
              </div>

              {totalProducts !== 0 ? (
                <div className="px-4 py-4 md:px-5">
                  {cartItems.map((item) => (
                    <CartItems
                      key={item?._id || item?.productId}
                      selectedSize={() => selectedSize(item)}
                      size={item?.size}
                      qty={item?.quantity}
                      item={item}
                      productSizeData={productSizeData}
                      productRamsData={producRamData}
                      productWeightData={productWeightData}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-5 px-6 py-14 text-center">
                  <div className="flex h-[92px] w-[92px] items-center justify-center rounded-full bg-[#fff1eb] text-[#ff5252] shadow-[0_16px_32px_rgba(255,82,82,0.12)]">
                    <FiShoppingBag className="text-[38px]" />
                  </div>
                  <div>
                    <h4 className="text-[24px] font-[800] text-[#201714]">Your cart is empty</h4>
                    <p className="mx-auto mt-2 max-w-[420px] text-[14px] text-[rgba(31,41,55,0.66)]">
                      Add a few products to your basket and come back here to review everything.
                    </p>
                  </div>
                  <Link to="/">
                    <Button className="bg-org btn-lg">Continue Shopping</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="xl:w-[32%]">
            <div className="section-shell sticky top-6 overflow-hidden px-0 py-0">
              <div className="flex min-h-[124px] items-center border-b border-[rgba(255,82,82,0.12)] px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-[48px] w-[48px] items-center justify-center rounded-[16px] bg-[#fff1eb] text-[#ff5252]">
                    <BsFillBagCheckFill className="text-[22px]" />
                  </div>
                  <div>
                    <h3 className="m-0 text-[24px] font-[800] text-[#201714]">Cart totals</h3>
                    <p className="mb-0 mt-1 text-[13px] text-[rgba(31,41,55,0.62)]">
                      Taxes and shipping are finalized at checkout.
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-6">
                <div className="rounded-[28px] border border-[rgba(255,82,82,0.12)] bg-[linear-gradient(180deg,#ffffff_0%,#fff8f5_100%)] p-5 shadow-[0_16px_30px_rgba(15,23,42,0.06)]">
                <div className="flex items-center justify-between py-3">
                  <span className="text-[14px] font-[700] text-[#6b7280]">Subtotal</span>
                  <span className="text-[15px] font-[800] text-[#1f2937]">
                    {totalAmount.toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                      minimumFractionDigits: 0,
                    })}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-[rgba(255,82,82,0.1)] py-3">
                  <span className="text-[14px] font-[700] text-[#6b7280]">Shipping</span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#eefbf3] px-3 py-1 text-[12px] font-[800] text-[#1f8f52]">
                    <FiTruck className="text-[14px]" /> Free
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-[rgba(255,82,82,0.1)] py-3">
                  <span className="text-[14px] font-[700] text-[#6b7280]">Destination</span>
                  <span className="text-[14px] font-[800] text-[#1f2937]">Viet Nam</span>
                </div>

                <div className="mt-2 flex items-center justify-between border-t border-dashed border-[rgba(255,82,82,0.16)] pt-4">
                  <span className="text-[15px] font-[800] text-[#201714]">Total</span>
                  <span className="text-primary text-[24px] font-[800]">
                    {totalAmount.toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                      minimumFractionDigits: 0,
                    })}
                  </span>
                </div>
                </div>

                <div className="mt-5 space-y-3">
                  <Link to="/checkout" className="block">
                    <Button
                      className="bg-org btn-lg flex w-full gap-2"
                      disabled={totalProducts === 0}
                    >
                      <BsFillBagCheckFill className="text-[20px]" /> Checkout
                    </Button>
                  </Link>

                  <Link to="/" className="block">
                    <Button className="bg-org btn-border btn-lg w-full">Keep browsing</Button>
                  </Link>
                </div>

                <div className="mt-5 rounded-[22px] border border-[rgba(255,82,82,0.1)] bg-white/75 p-4">
                  <p className="mb-0 text-[12px] leading-6 text-[rgba(31,41,55,0.6)]">
                    Need a moment? Your selected items stay here while you continue browsing the
                    store.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartPage;
