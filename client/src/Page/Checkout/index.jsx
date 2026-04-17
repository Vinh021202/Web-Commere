import React, { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { BsFillBagCheckFill } from 'react-icons/bs';
import { Button } from '@mui/material';
import { MyContext } from '../../App';
import { FaPlus } from 'react-icons/fa';
import Radio from '@mui/material/Radio';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { deleteData, fetchDataFromApi, postData } from '../../utils/api';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiCreditCard, FiMapPin, FiPackage, FiTruck } from 'react-icons/fi';

const VITE_APP_STRIPE_ID = import.meta.env.VITE_APP_STRIPE_ID;
const VITE_APP_PAYPAL_CLIENT_ID = import.meta.env.VITE_APP_PAYPAL_CLIENT_ID;
const VITE_API_URL = import.meta.env.VITE_API_URL || '';

const Checkout = () => {
  const [userData, setUserData] = useState(null);
  const [isChecked, setIsChecked] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentClientSecret, setPaymentClientSecret] = useState(null);
  const [paymentOrderPayload, setPaymentOrderPayload] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const context = useContext(MyContext);
  const histoty = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);

    setUserData(context?.userData);
    setSelectedAddress(context?.userData?.address_details?.[0]?._id || null);

    fetchDataFromApi(`/api/order/order-list`).then((res) => {
      console.log('User orders:', res);
    });
  }, [context?.userData, userData]);

  useEffect(() => {
    const numericTotal =
      context.cartData?.length !== 0
        ? context.cartData
            ?.map((item) => parseInt(item?.price) * item?.quantity)
            .reduce((total, value) => total + value, 0)
        : 0;

    setTotalAmount(numericTotal);
    localStorage.setItem('totalAmount', numericTotal.toString());
  }, [context?.cartData]);

  const cartItems = context?.cartData || [];
  const totalProducts = cartItems.length;
  const totalUnits = cartItems.reduce((total, item) => total + (item?.quantity || 0), 0);
  const selectedAddressData =
    userData?.address_details?.find((address) => address?._id === selectedAddress) || null;

  const paypalRendered = useRef(false);

  useEffect(() => {
    if (!totalAmount || totalAmount <= 0) return;
    if (paypalRendered.current) return;

    const existingScript = document.querySelector(`script[src*="paypal.com/sdk/js"]`);

    const initPayPal = () => {
      const container = document.getElementById('paypal-button-container');
      if (!container) return;
      container.innerHTML = '';

      window.paypal
        .Buttons({
          createOrder: async () => {
            try {
              if (!totalAmount || totalAmount <= 0) throw new Error('Invalid total amount');

              let amountInUSD = 0;
              try {
                const resp = await fetch(
                  'https://v6.exchangerate-api.com/v6/d87ef6e24185a0fe30ad9d8f/latest/VND'
                );
                const respData = await resp.json();
                if (respData.result === 'success' && respData.conversion_rates?.USD) {
                  amountInUSD = parseFloat(
                    (totalAmount * respData.conversion_rates.USD).toFixed(2)
                  );
                } else throw new Error('Invalid exchange rate');
              } catch {
                amountInUSD = parseFloat((totalAmount / 24000).toFixed(2));
              }

              const token = localStorage.getItem('accesstoken');
              if (!token) throw new Error('No auth token');

              const response = await axios.get(
                `${VITE_API_URL}/api/order/create-order-paypal?userId=${context?.userData?._id}&totalAmount=${amountInUSD}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );

              if (!response?.data?.id) throw new Error('No order ID');
              return response.data.id;
            } catch (error) {
              console.error('PayPal createOrder error:', error);
              throw error;
            }
          },
          onApprove: async (data) => {
            onApprovePayment(data);
          },
          onError: (err) => {
            histoty('/orders/failed');
            console.error('PayPal onError:', err);
          },
        })
        .render('#paypal-button-container');

      paypalRendered.current = true;
    };

    if (existingScript) {
      if (window.paypal) {
        initPayPal();
      } else {
        existingScript.addEventListener('load', initPayPal);
      }
    } else {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${VITE_APP_PAYPAL_CLIENT_ID}&disable-funding=card`;
      script.async = true;
      script.onload = initPayPal;
      document.body.appendChild(script);
    }
  }, [totalAmount]);

  const onApprovePayment = async (data) => {
    try {
      const userId = context?.userData?._id || localStorage.getItem('userId');

      if (!userId) {
        context?.alertBox('error', 'User not found. Please log in again.');
        return;
      }

      if (!context?.cartData?.length || context.cartData.length === 0) {
        context?.alertBox('error', 'Your cart is empty.');
        return;
      }

      const token = localStorage.getItem('accesstoken');
      if (!token) throw new Error('No authentication token');

      const info = {
        userId,
        products: context.cartData,
        payment_status: 'COMPLETE',
        delivery_address: selectedAddress,
        totalAmount,
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
        }),
      };

      const response = await axios.post(
        `${VITE_API_URL}/api/order/capture-order-paypal`,
        { ...info, paymentId: data.orderID },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        await deleteData(`/api/cart/emptyCart/${userId}`);
        if (context?.getCartItems) await context.getCartItems();
        context?.alertBox('success', 'Order completed!');
        histoty('/orders/success');
      }
    } catch (error) {
      console.error('Payment Error:', error);
      context?.alertBox('error', 'Something went wrong during payment.');
    }
  };

  const editAddress = (id) => {
    context.setOpenAddressPanel(true);
    context.setAddressMode('edit');
    context.setAddressId(id);
  };

  const handleChange = (e, index) => {
    if (e.target.checked) {
      setIsChecked(index);
      setSelectedAddress(e.target.value);
    }
  };

  const checkout = async (e) => {
    e.preventDefault();

    if (!selectedAddress) {
      context?.alertBox('error', 'Vui lÃ²ng chá»n Ä‘á»‹a chá»‰ giao hÃ ng trÆ°á»›c khi thanh toÃ¡n.');
      return;
    }

    const numericTotal =
      context?.cartData && context.cartData.length
        ? context.cartData.reduce(
            (sum, item) => sum + parseInt(item?.price || 0) * (item?.quantity || 1),
            0
          )
        : 0;

    if (numericTotal === 0) {
      context?.alertBox('error', 'Giá» hÃ ng cá»§a báº¡n Ä‘ang trá»‘ng.');
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/stripe/create-payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: numericTotal }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const cleanProducts = (context?.cartData || []).map((item) => ({
        productId: item?.productId || item?._id || item?.id || '',
        productTitle: item?.productTitle || item?.title || item?.name || '',
        quantity: parseInt(item?.quantity) || 1,
        price: parseInt(item?.price) || 0,
        image: item?.image || '',
      }));

      const orderPayload = {
        userId: context?.userData?._id,
        products: cleanProducts,
        paymentId: data.paymentIntentId || '',
        payment_status: 'PENDING',
        delivery_address: selectedAddress,
        totalAmt: numericTotal,
      };

      setPaymentClientSecret(data.clientSecret);
      setPaymentOrderPayload(orderPayload);
      setShowPaymentModal(true);
    } catch (err) {
      console.error('Checkout error:', err);
      context?.alertBox('error', 'KhÃ´ng thá»ƒ khá»Ÿi táº¡o thanh toÃ¡n. Vui lÃ²ng thá»­ láº¡i.');
    }
  };

  const cashOnDeLivery = async (e) => {
    e.preventDefault();
    if (!selectedAddress) {
      context?.alertBox('error', 'Vui lÃ²ng chá»n Ä‘á»‹a chá»‰ giao hÃ ng trÆ°á»›c khi thanh toÃ¡n.');
      return;
    }

    const numericTotal =
      context?.cartData && context.cartData.length
        ? context.cartData.reduce(
            (sum, item) => sum + parseInt(item?.price || 0) * (item?.quantity || 1),
            0
          )
        : 0;

    try {
      const cleanProducts = (context?.cartData || []).map((item) => ({
        productId: item?.productId || item?._id || item?.id || '',
        productTitle: item?.productTitle || item?.title || item?.name || '',
        quantity: parseInt(item?.quantity) || 1,
        price: parseInt(item?.price) || 0,
        image: item?.image || '',
      }));

      const codOrderPayload = {
        userId: context?.userData?._id,
        products: cleanProducts,
        paymentId: 'CASH ON DELIVERY',
        payment_status: 'PENDING',
        delivery_address: selectedAddress,
        totalAmt: numericTotal,
      };

      const orderRes = await postData('/api/order/create', codOrderPayload);

      if (orderRes.success || orderRes.order) {
        context?.alertBox('ÄÆ¡n hÃ ng táº¡o thÃ nh cÃ´ng! Thanh toÃ¡n khi nháº­n hÃ ng.');
        try {
          await deleteData(`/api/cart/emptyCart/${context?.userData?._id}`);
          context?.getCartItems();
          histoty('/orders/success');
        } catch (cartErr) {
          console.error('Error clearing cart:', cartErr);
          histoty('/orders/failed');
        }
      } else {
        context?.alertBox('CÃ³ lá»—i táº¡o Ä‘Æ¡n hÃ ng. Vui lÃ²ng thá»­ láº¡i.');
      }
    } catch (err) {
      console.error('COD checkout error:', err);
      context?.alertBox('CÃ³ lá»—i xáº£y ra. Vui lÃ²ng thá»­ láº¡i.');
    }
  };

  const stripePromise = loadStripe(VITE_APP_STRIPE_ID);

  const PaymentModal = ({ clientSecret, onClose, orderPayload }) => {
    const options = { clientSecret };
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(15,23,42,0.55)] px-3 py-3 sm:px-4 sm:py-4">
        <div className="section-shell max-h-[calc(100vh-24px)] w-full max-w-[460px] overflow-y-auto px-4 py-4 sm:max-h-[calc(100vh-32px)] sm:max-w-[520px] sm:px-6 sm:py-6">
          <div className="mb-5 flex items-center justify-between gap-4 border-b border-[rgba(255,82,82,0.12)] pb-4">
            <div>
              <span className="listing-stat__label">Secure payment</span>
              <h3 className="mt-2 text-[20px] font-[800] text-[#201714] sm:text-[24px]">Complete your payment</h3>
            </div>
            <Button className="bg-org btn-border" onClick={onClose}>
              Cancel
            </Button>
          </div>
          <Elements stripe={stripePromise} options={options}>
            <InnerPaymentForm onClose={onClose} orderPayload={orderPayload} histoty={histoty} />
          </Elements>
        </div>
      </div>
    );
  };

  const InnerPaymentForm = ({ onClose, orderPayload }) => {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmitPayment = async (ev) => {
      ev.preventDefault();
      if (!stripe || !elements) return;
      try {
        const { error } = await stripe.confirmPayment({
          elements,
          confirmParams: {},
          redirect: 'if_required',
        });

        if (error) {
          console.error('Payment confirmation error', error);
          alert(error.message || 'Payment failed');
        } else {
          try {
            if (orderPayload) {
              const orderRes = await postData('/api/order/create', {
                ...orderPayload,
                payment_status: 'COMPLETED',
              });
              console.log('Order created:', orderRes);
              if (orderRes.success || orderRes.order) {
                alert('Thanh toÃ¡n vÃ  táº¡o Ä‘Æ¡n hÃ ng thÃ nh cÃ´ng!');
                try {
                  await deleteData(`/api/cart/emptyCart/${context?.userData?._id}`);
                  context?.getCartItems();
                  histoty('/orders/success');
                } catch (cartErr) {
                  console.error('Error clearing cart:', cartErr);
                  histoty('/orders/failed');
                }
              } else {
                alert('Thanh toÃ¡n thÃ nh cÃ´ng nhÆ°ng cÃ³ lá»—i táº¡o Ä‘Æ¡n hÃ ng. Vui lÃ²ng liÃªn há»‡ há»— trá»£.');
              }
            } else {
              alert('Thanh toÃ¡n thÃ nh cÃ´ng');
            }
          } catch (orderErr) {
            console.error('Order creation error:', orderErr);
            alert('Thanh toÃ¡n thÃ nh cÃ´ng nhÆ°ng cÃ³ lá»—i táº¡o Ä‘Æ¡n hÃ ng');
          }
          onClose();
        }
      } catch (err) {
        console.error(err);
        alert('CÃ³ lá»—i xáº£y ra');
      }
    };

    return (
      <form onSubmit={handleSubmitPayment}>
        <div className="checkout-stripe-element">
          <PaymentElement />
        </div>
        <div className="mt-5 flex gap-3">
          <Button type="submit" className="bg-org btn-lg w-full">
            Pay now
          </Button>
          <Button type="button" className="bg-org btn-border" onClick={onClose}>
            Close
          </Button>
        </div>
      </form>
    );
  };

  return (
    <>
      {showPaymentModal && paymentClientSecret && (
        <PaymentModal
          clientSecret={paymentClientSecret}
          orderPayload={paymentOrderPayload}
          histoty={histoty}
          onClose={() => {
            setShowPaymentModal(false);
            setPaymentClientSecret(null);
            setPaymentOrderPayload(null);
          }}
        />
      )}

      <section className="py-8">
        <form onSubmit={checkout}>
          <div className="container max-w-[1280px]">
            <div className="section-shell listing-hero overflow-hidden px-5 py-6 md:px-6 md:py-7">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-[720px]">
                  <span className="eyebrow mb-3">Checkout</span>
                  <h1 className="mb-2 text-[32px] font-[800] leading-[1.15] tracking-[-0.03em] text-[#201714] md:text-[38px]">
                    Choose your delivery details and payment method.
                  </h1>
                  <p className="mb-0 max-w-[580px] text-[13px] text-[rgba(31,41,55,0.72)] md:text-[14px]">
                    Confirm where we should ship your order, then complete payment securely in one place.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[390px]">
                  <div className="soft-card p-3">
                    <span className="listing-stat__label">Products</span>
                    <strong className="listing-stat__value !mt-2 !text-[1.4rem]">{totalProducts}</strong>
                  </div>
                  <div className="soft-card p-3">
                    <span className="listing-stat__label">Units</span>
                    <strong className="listing-stat__value !mt-2 !text-[1.4rem]">{totalUnits}</strong>
                  </div>
                  <div className="soft-card p-3">
                    <span className="listing-stat__label">Total</span>
                    <strong className="listing-stat__value !mt-2 !text-[1.2rem]">
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

            <div className="mt-5 flex flex-col gap-5 xl:flex-row xl:items-start">
              <div className="xl:w-[64%]">
                <div className="section-shell overflow-hidden px-0 py-0">
                  <div className="border-b border-[rgba(255,82,82,0.12)] px-5 py-4 md:px-6 md:py-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[14px] bg-[#fff1eb] text-[#ff5252]">
                          <FiMapPin className="text-[20px]" />
                        </div>
                        <div>
                          <h2 className="m-0 text-[22px] font-[800] text-[#201714] md:text-[24px]">Select delivery address</h2>
                          <p className="mb-0 mt-1 text-[13px] text-[rgba(31,41,55,0.68)]">
                            Pick where you want this order delivered.
                          </p>
                        </div>
                      </div>

                      <Button
                        className="bg-org btn-border"
                        onClick={() => {
                          context?.setOpenAddressPanel(true);
                          context?.setAddressMode('add');
                        }}
                      >
                        <FaPlus className="mr-2" /> Add new address
                      </Button>
                    </div>
                  </div>

                  <div className="px-4 py-4 md:px-5">
                    <div className="flex flex-col gap-4">
                      {context?.userData?.address_details?.length !== 0 ? (
                        userData?.address_details?.map((address, index) => (
                          <label
                            className={`soft-card relative flex cursor-pointer gap-4 p-4 transition-all ${
                              isChecked === index
                                ? 'border-[rgba(255,82,82,0.28)] bg-[linear-gradient(135deg,#fff2ef_0%,#ffffff_100%)] shadow-[0_16px_28px_rgba(255,82,82,0.08)]'
                                : ''
                            }`}
                            key={address?._id || index}
                          >
                            <div className="pt-1">
                              <Radio
                                size="small"
                                onChange={(e) => handleChange(e, index)}
                                checked={isChecked === index}
                                value={address?._id}
                              />
                            </div>

                            <div className="min-w-0 flex-1 pr-20">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-full bg-[#fff1eb] px-3 py-1 text-[11px] font-[800] uppercase tracking-[0.1em] text-[#a65434]">
                                  {address?.addressType}
                                </span>
                                {isChecked === index ? (
                                  <span className="rounded-full bg-[#eefbf3] px-3 py-1 text-[11px] font-[800] uppercase tracking-[0.1em] text-[#1f8f52]">
                                    Selected
                                  </span>
                                ) : null}
                              </div>

                              <h3 className="mt-3 text-[18px] font-[800] text-[#201714]">
                                {userData?.name}
                              </h3>

                              <p className="mb-0 mt-2 text-[13px] leading-6 text-[rgba(31,41,55,0.68)]">
                                {address?.address_line1} {address?.city} {address?.country}{' '}
                                {address?.pincode} {address?.state} {address?.lamdmark}
                              </p>
                              <p className="mb-0 mt-2 text-[13px] font-[700] text-[#1f2937]">
                                +{userData?.mobile}
                              </p>
                            </div>

                            <Button
                              variant="text"
                              className="!absolute right-[16px] top-[16px] !rounded-full !px-4 !py-2 !text-[12px] !font-[800]"
                              size="small"
                              onClick={() => editAddress(address?._id)}
                            >
                              Edit
                            </Button>
                          </label>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-4 px-6 py-14 text-center">
                          <div className="flex h-[92px] w-[92px] items-center justify-center rounded-full bg-[#fff1eb] text-[#ff5252] shadow-[0_16px_32px_rgba(255,82,82,0.12)]">
                            <FiMapPin className="text-[38px]" />
                          </div>
                          <div>
                            <h2 className="text-[24px] font-[800] text-[#201714]">No address found</h2>
                            <p className="mt-2 text-[14px] text-[rgba(31,41,55,0.66)]">
                              Add a delivery address before placing your order.
                            </p>
                          </div>
                          <Button
                            className="bg-org btn-lg"
                            onClick={() => {
                              context?.setOpenAddressPanel(true);
                              context?.setAddressMode('add');
                            }}
                          >
                            Add Address
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="xl:w-[36%]">
                <div className="section-shell sticky top-6 overflow-hidden px-0 py-0">
                  <div className="border-b border-[rgba(255,82,82,0.12)] px-5 py-4 md:px-6 md:py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-[40px] w-[40px] items-center justify-center rounded-[14px] bg-[#fff1eb] text-[#ff5252]">
                        <FiCreditCard className="text-[19px]" />
                      </div>
                      <div>
                        <h2 className="m-0 text-[22px] font-[800] text-[#201714] md:text-[23px]">Your order</h2>
                        <p className="mb-0 mt-1 text-[13px] text-[rgba(31,41,55,0.68)]">
                          Review items and choose how you want to pay.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="px-5 py-5 md:px-6 md:py-5">
                    <div className="rounded-[24px] border border-[rgba(255,82,82,0.12)] bg-[linear-gradient(180deg,#ffffff_0%,#fff8f5_100%)] p-4 shadow-[0_16px_30px_rgba(15,23,42,0.06)] md:p-5">
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-[800] uppercase tracking-[0.08em] text-[#a65434]">
                          Delivery to
                        </span>
                        {selectedAddressData ? (
                          <span className="rounded-full bg-[#eefbf3] px-3 py-1 text-[11px] font-[800] text-[#1f8f52]">
                            Ready
                          </span>
                        ) : (
                          <span className="rounded-full bg-[#fff1eb] px-3 py-1 text-[11px] font-[800] text-[#a65434]">
                            Needed
                          </span>
                        )}
                      </div>

                      <div className="mt-3 rounded-[18px] border border-[rgba(255,82,82,0.1)] bg-white px-4 py-4">
                        {selectedAddressData ? (
                          <>
                            <h4 className="text-[15px] font-[800] text-[#201714]">
                              {userData?.name}
                            </h4>
                            <p className="mb-0 mt-2 text-[12px] leading-6 text-[rgba(31,41,55,0.66)]">
                              {selectedAddressData?.address_line1} {selectedAddressData?.city}{' '}
                              {selectedAddressData?.country} {selectedAddressData?.pincode}{' '}
                              {selectedAddressData?.state} {selectedAddressData?.lamdmark}
                            </p>
                          </>
                        ) : (
                          <p className="mb-0 text-[13px] leading-6 text-[rgba(31,41,55,0.58)]">
                            Select an address on the left before completing payment.
                          </p>
                        )}
                      </div>

                      <div className="mt-5 flex items-center justify-between border-t border-[rgba(255,82,82,0.1)] pt-4">
                        <span className="text-[14px] font-[700] text-[#6b7280]">Products</span>
                        <span className="text-[14px] font-[800] text-[#1f2937]">{totalProducts}</span>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-[14px] font-[700] text-[#6b7280]">Units</span>
                        <span className="text-[14px] font-[800] text-[#1f2937]">{totalUnits}</span>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-[14px] font-[700] text-[#6b7280]">Shipping</span>
                        <span className="inline-flex items-center gap-2 rounded-full bg-[#eefbf3] px-3 py-1 text-[12px] font-[800] text-[#1f8f52]">
                          <FiTruck className="text-[14px]" /> Free
                        </span>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-dashed border-[rgba(255,82,82,0.16)] pt-4">
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

                    <div className="mt-4 rounded-[22px] border border-[rgba(255,82,82,0.12)] bg-white/75 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-[16px] font-[800] text-[#201714]">Order items</h3>
                        <span className="text-[12px] font-[700] text-[rgba(31,41,55,0.55)]">
                          {totalProducts} products
                        </span>
                      </div>

                      <div className="scroll max-h-[260px] space-y-3 overflow-y-auto overflow-x-hidden pr-1">
                        {cartItems.length !== 0 &&
                          cartItems.map((item, index) => (
                            <div
                              className="flex items-center justify-between gap-3 rounded-[18px] border border-[rgba(255,82,82,0.1)] bg-white px-3 py-3"
                              key={item?._id || index}
                            >
                              <div className="flex min-w-0 items-center gap-3">
                                <div className="h-[56px] w-[56px] overflow-hidden rounded-[14px] bg-[#fff4ef]">
                                  <img
                                    src={item?.image}
                                    alt={item?.productTitle || 'Product'}
                                    className="h-full w-full object-cover"
                                  />
                                </div>

                                <div className="min-w-0">
                                  <h4 className="truncate text-[13px] font-[700] text-[#1f2937]" title={item?.productTitle}>
                                    {item?.productTitle}
                                  </h4>
                                  <span className="mt-1 inline-flex items-center gap-2 text-[12px] font-[700] text-[rgba(31,41,55,0.55)]">
                                    <FiPackage className="text-[13px]" /> Qty: {item?.quantity}
                                  </span>
                                </div>
                              </div>

                              <span className="shrink-0 text-[13px] font-[800] text-[#1f2937]">
                                {(item?.quantity * item?.price)?.toLocaleString('vi-VN', {
                                  style: 'currency',
                                  currency: 'VND',
                                  minimumFractionDigits: 0,
                                })}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div className="checkout-payment-stack mt-5">
                      <Button
                        type="submit"
                        className="checkout-payment-btn bg-org flex w-full gap-2"
                        disabled={!selectedAddress || totalProducts === 0}
                      >
                        <BsFillBagCheckFill className="text-[20px]" /> Pay with card
                      </Button>

                      <div
                        id="paypal-button-container"
                        className={`checkout-paypal-shell ${!selectedAddress ? 'pointer-events-none opacity-60' : ''}`}
                      ></div>

                      <Button
                        type="button"
                        className="checkout-payment-btn bg-drack flex w-full gap-2"
                        onClick={cashOnDeLivery}
                        disabled={!selectedAddress || totalProducts === 0}
                      >
                        <BsFillBagCheckFill className="text-[20px]" /> Cash On Delivery
                      </Button>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3 rounded-[20px] border border-[rgba(255,82,82,0.1)] bg-white/75 p-4">
                      <p className="mb-0 text-[12px] leading-6 text-[rgba(31,41,55,0.6)]">
                        Need to update your basket before paying?
                      </p>
                      <Link
                        to="/cart"
                        className="inline-flex shrink-0 items-center gap-2 text-[13px] font-[800] text-[#7c553d]"
                      >
                        Back to cart <FiArrowRight className="text-[15px]" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default Checkout;
