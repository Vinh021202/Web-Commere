import React from 'react';
import { FiArrowRight, FiHeadphones, FiMail, FiMessageCircle, FiPhoneCall, FiShield, FiTruck } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const helpTopics = [
  {
    icon: <FiTruck />,
    title: 'Shipping & Delivery',
    description: 'Learn how long delivery takes, supported locations, and shipping costs.',
  },
  {
    icon: <FiShield />,
    title: 'Returns & Refunds',
    description: 'Find return timelines, refund conditions, and support for exchanged items.',
  },
  {
    icon: <FiHeadphones />,
    title: 'Account & Orders',
    description: 'Get help updating account details, checking order status, or login issues.',
  },
];

const supportChannels = [
  {
    icon: <FiPhoneCall />,
    label: 'Phone support',
    value: '(+84) 9465-65-316',
    detail: 'Available every day from 8:00 to 20:00.',
  },
  {
    icon: <FiMail />,
    label: 'Email support',
    value: 'quocvinhtran.0212@gmail.com',
    detail: 'We usually respond within 24 hours.',
  },
  {
    icon: <FiMessageCircle />,
    label: 'Live assistance',
    value: 'Chat with our team',
    detail: 'Use the chat box on the homepage for instant guidance.',
  },
];

const faqs = [
  {
    question: 'How can I track my order?',
    answer: 'Open the Order Tracking page, enter your order code and email or phone number, then review the latest shipment updates.',
  },
  {
    question: 'Can I change my address after ordering?',
    answer: 'If your order has not been packed yet, contact support as soon as possible and we will help update the delivery address.',
  },
  {
    question: 'How long does a refund take?',
    answer: 'Refunds are usually processed within 3 to 7 business days after the returned package is approved.',
  },
];

const HelpCenter = () => {
  return (
    <section className="pb-10 pt-[220px] md:pt-[245px] xl:pt-[265px]">
      <div className="container">
        <div className="section-shell listing-hero overflow-hidden px-5 py-7 md:px-8 md:py-9">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[760px]">
              <span className="eyebrow mb-4">Support</span>
              <h1 className="section-heading max-w-[760px]">
                Help Center for smooth shopping, support, and after-sales care.
              </h1>
              <p className="muted-copy mt-4 max-w-[620px] text-[15px] leading-7">
                Everything you need in one place, from delivery questions and refunds to direct
                contact options when you need a real person.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[430px]">
              <div className="soft-card p-4">
                <span className="listing-stat__label">Fast help</span>
                <strong className="listing-stat__value">24h</strong>
              </div>
              <div className="soft-card p-4">
                <span className="listing-stat__label">Channels</span>
                <strong className="listing-stat__value">3</strong>
              </div>
              <div className="soft-card p-4">
                <span className="listing-stat__label">Coverage</span>
                <strong className="listing-stat__value !text-[1.2rem]">Orders & support</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="section-shell px-5 py-6 md:px-7 md:py-7">
            <div className="mb-6">
              <span className="eyebrow mb-4">Popular topics</span>
              <h2 className="text-[28px] font-[800] leading-[1.15] text-[#201714]">
                Start with the most common support requests.
              </h2>
            </div>

            <div className="grid gap-4">
              {helpTopics.map((topic) => (
                <div key={topic.title} className="soft-card p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-[54px] w-[54px] items-center justify-center rounded-[18px] bg-[#fff1eb] text-[#ff5252]">
                      <span className="text-[24px]">{topic.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-[20px] font-[800] text-[#1f2937]">{topic.title}</h3>
                      <p className="mb-0 mt-2 text-[14px] leading-7">{topic.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6">
            <div className="section-shell px-5 py-6 md:px-7 md:py-7">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-[48px] w-[48px] items-center justify-center rounded-[16px] bg-[#fff1eb] text-[#ff5252]">
                  <FiHeadphones className="text-[22px]" />
                </div>
                <div>
                  <h2 className="text-[26px] font-[800] text-[#201714]">Talk to us directly</h2>
                  <p className="mb-0 mt-1 text-[14px] text-[rgba(31,41,55,0.66)]">
                    Choose the contact channel that fits you best.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {supportChannels.map((channel) => (
                  <div key={channel.label} className="rounded-[24px] border border-[rgba(255,82,82,0.12)] bg-[linear-gradient(135deg,#fff8f5_0%,#ffffff_100%)] p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-[44px] w-[44px] items-center justify-center rounded-[14px] bg-white text-[#ff5252] shadow-[0_10px_20px_rgba(255,82,82,0.08)]">
                        <span className="text-[20px]">{channel.icon}</span>
                      </div>
                      <div>
                        <span className="text-[12px] font-[800] uppercase tracking-[0.08em] text-[#a65434]">
                          {channel.label}
                        </span>
                        <h3 className="mt-2 text-[18px] font-[800] text-[#1f2937]">{channel.value}</h3>
                        <p className="mb-0 mt-1 text-[13px] leading-6">{channel.detail}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="section-shell px-5 py-6 md:px-7 md:py-7">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <span className="eyebrow mb-3">Quick answers</span>
                  <h2 className="text-[26px] font-[800] text-[#201714]">FAQs</h2>
                </div>
                <Link
                  to="/order-tracking"
                  className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,82,82,0.14)] bg-white px-4 py-3 text-[13px] font-[800] text-[#7c553d] transition-all hover:border-[rgba(255,82,82,0.28)] hover:bg-[#fff4ef]"
                >
                  Track order <FiArrowRight className="text-[15px]" />
                </Link>
              </div>

              <div className="space-y-4">
                {faqs.map((faq) => (
                  <div key={faq.question} className="rounded-[22px] border border-[rgba(255,82,82,0.12)] bg-white p-4">
                    <h3 className="text-[17px] font-[800] text-[#1f2937]">{faq.question}</h3>
                    <p className="mb-0 mt-2 text-[14px] leading-7">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HelpCenter;
