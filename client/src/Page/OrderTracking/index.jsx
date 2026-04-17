import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import { FiArrowRight, FiMail, FiMapPin, FiPackage, FiSearch, FiTruck } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const trackingSteps = [
  { title: 'Order confirmed', detail: 'Your order has been received and verified.' },
  { title: 'Packed carefully', detail: 'Items are packed and prepared for handoff.' },
  { title: 'In transit', detail: 'The carrier is moving your package to the destination city.' },
  { title: 'Out for delivery', detail: 'Your parcel is on the final route to your address.' },
];

const OrderTracking = () => {
  const [orderCode, setOrderCode] = useState('');
  const [contactValue, setContactValue] = useState('');

  return (
    <section className="pb-10 pt-[220px] md:pt-[245px] xl:pt-[265px]">
      <div className="container">
        <div className="section-shell listing-hero overflow-hidden px-5 py-7 md:px-8 md:py-9">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[760px]">
              <span className="eyebrow mb-4">Tracking</span>
              <h1 className="section-heading max-w-[760px]">
                Track your order and review shipping progress in one view.
              </h1>
              <p className="muted-copy mt-4 max-w-[620px] text-[15px] leading-7">
                Enter your order code and contact information to check the latest delivery milestone,
                current route, and support options.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[430px]">
              <div className="soft-card p-4">
                <span className="listing-stat__label">Live status</span>
                <strong className="listing-stat__value">4 steps</strong>
              </div>
              <div className="soft-card p-4">
                <span className="listing-stat__label">Coverage</span>
                <strong className="listing-stat__value">Nationwide</strong>
              </div>
              <div className="soft-card p-4">
                <span className="listing-stat__label">Support</span>
                <strong className="listing-stat__value !text-[1.2rem]">Help anytime</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="section-shell px-5 py-6 md:px-7 md:py-7">
            <div className="mb-6">
              <span className="eyebrow mb-4">Find your parcel</span>
              <h2 className="text-[28px] font-[800] leading-[1.15] text-[#201714]">
                Check order status with your order code.
              </h2>
              <p className="mb-0 mt-3 text-[14px] leading-7 text-[rgba(31,41,55,0.68)]">
                Use the same email or phone number you entered during checkout for the fastest result.
              </p>
            </div>

            <div className="space-y-4">
              <TextField
                className="w-full"
                label="Order code"
                placeholder="Example: ORD-2026-00128"
                value={orderCode}
                onChange={(event) => setOrderCode(event.target.value)}
              />
              <TextField
                className="w-full"
                label="Email or phone number"
                placeholder="your@email.com or 09xxxxxxxx"
                value={contactValue}
                onChange={(event) => setContactValue(event.target.value)}
              />
              <Button className="bg-org btn-lg flex w-full gap-2">
                <FiSearch className="text-[18px]" /> Track Order
              </Button>
            </div>

            <div className="mt-6 rounded-[24px] border border-[rgba(255,82,82,0.12)] bg-[linear-gradient(135deg,#fff8f5_0%,#ffffff_100%)] p-5">
              <h3 className="text-[18px] font-[800] text-[#1f2937]">Need help with an order?</h3>
              <p className="mb-0 mt-2 text-[14px] leading-7">
                If you cannot find your order, our support team can help verify your purchase and
                check carrier updates manually.
              </p>
              <Link
                to="/help-center"
                className="mt-4 inline-flex items-center gap-2 text-[13px] font-[800] text-[#7c553d]"
              >
                Visit Help Center <FiArrowRight className="text-[15px]" />
              </Link>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="section-shell px-5 py-6 md:px-7 md:py-7">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-[48px] w-[48px] items-center justify-center rounded-[16px] bg-[#fff1eb] text-[#ff5252]">
                  <FiPackage className="text-[22px]" />
                </div>
                <div>
                  <h2 className="text-[26px] font-[800] text-[#201714]">Sample delivery timeline</h2>
                  <p className="mb-0 mt-1 text-[14px] text-[rgba(31,41,55,0.66)]">
                    A preview of the status flow customers usually see.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {trackingSteps.map((step, index) => (
                  <div key={step.title} className="flex gap-4 rounded-[22px] border border-[rgba(255,82,82,0.12)] bg-white p-4">
                    <div className="flex flex-col items-center">
                      <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#fff1eb] text-[14px] font-[800] text-[#ff5252]">
                        {index + 1}
                      </div>
                      {index !== trackingSteps.length - 1 ? (
                        <div className="mt-2 h-full w-[2px] bg-[linear-gradient(180deg,rgba(255,82,82,0.35),rgba(255,82,82,0.05))]" />
                      ) : null}
                    </div>
                    <div className="pb-1">
                      <h3 className="text-[18px] font-[800] text-[#1f2937]">{step.title}</h3>
                      <p className="mb-0 mt-2 text-[14px] leading-7">{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="section-shell px-5 py-6">
                <div className="flex h-[48px] w-[48px] items-center justify-center rounded-[16px] bg-[#fff1eb] text-[#ff5252]">
                  <FiTruck className="text-[22px]" />
                </div>
                <h3 className="mt-4 text-[22px] font-[800] text-[#201714]">Shipping updates</h3>
                <p className="mb-0 mt-2 text-[14px] leading-7">
                  Estimated delivery windows, dispatch milestones, and in-transit progress.
                </p>
              </div>

              <div className="section-shell px-5 py-6">
                <div className="flex h-[48px] w-[48px] items-center justify-center rounded-[16px] bg-[#fff1eb] text-[#ff5252]">
                  <FiMail className="text-[22px]" />
                </div>
                <h3 className="mt-4 text-[22px] font-[800] text-[#201714]">Notifications</h3>
                <p className="mb-0 mt-2 text-[14px] leading-7">
                  Receive shipment changes and delivery confirmations through your saved contact.
                </p>
              </div>

              <div className="section-shell px-5 py-6 md:col-span-2">
                <div className="flex items-start gap-4">
                  <div className="flex h-[48px] w-[48px] items-center justify-center rounded-[16px] bg-[#fff1eb] text-[#ff5252]">
                    <FiMapPin className="text-[22px]" />
                  </div>
                  <div>
                    <h3 className="text-[22px] font-[800] text-[#201714]">Delivery destination</h3>
                    <p className="mb-0 mt-2 text-[14px] leading-7">
                      Keep your address details accurate so the carrier reaches the correct location
                      without delays.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderTracking;
