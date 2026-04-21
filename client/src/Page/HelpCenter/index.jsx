import React from 'react';
import { FiArrowRight, FiHeadphones, FiMail, FiMessageCircle, FiPhoneCall, FiShield, FiTruck } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const helpTopics = [
  {
    icon: <FiTruck />,
    title: 'Vận chuyển và giao hàng',
    description: 'Tìm hiểu thời gian giao, khu vực hỗ trợ và chi phí vận chuyển.',
  },
  {
    icon: <FiShield />,
    title: 'Đổi trả và hoàn tiền',
    description: 'Xem thời gian đổi trả, điều kiện hoàn tiền và hỗ trợ đổi sản phẩm.',
  },
  {
    icon: <FiHeadphones />,
    title: 'Tài khoản và đơn hàng',
    description: 'Nhận hỗ trợ cập nhật tài khoản, kiểm tra đơn hàng và xử lý sự cố đăng nhập.',
  },
];

const supportChannels = [
  {
    icon: <FiPhoneCall />,
    label: 'Hỗ trợ điện thoại',
    value: '(+84) 9465-65-316',
    detail: 'Hỗ trợ mỗi ngày từ 8:00 đến 20:00.',
  },
  {
    icon: <FiMail />,
    label: 'Hỗ trợ qua email',
    value: 'quocvinhtran.0212@gmail.com',
    detail: 'Thông thường phản hồi trong vòng 24 giờ.',
  },
  {
    icon: <FiMessageCircle />,
    label: 'Hỗ trợ trực tuyến',
    value: 'Chat với đội ngũ hỗ trợ',
    detail: 'Sử dụng khung chat trên trang chủ để nhận hướng dẫn nhanh.',
  },
];

const faqs = [
  {
    question: 'Làm sao để theo dõi đơn hàng?',
    answer: 'Mở trang theo dõi đơn hàng, nhập mã đơn và email hoặc số điện thoại để xem cập nhật mới nhất.',
  },
  {
    question: 'Tôi có thể đổi địa chỉ sau khi đặt hàng không?',
    answer: 'Nếu đơn hàng chưa đóng gói, hãy liên hệ hỗ trợ sớm nhất để chúng tôi cập nhật địa chỉ giao hàng.',
  },
  {
    question: 'Hoàn tiền mất bao lâu?',
    answer: 'Thông thường tiền được hoàn trong 3 đến 7 ngày làm việc sau khi gói hàng hoàn trả được xác nhận.',
  },
];

const HelpCenter = () => {
  return (
    <section className="pb-10 pt-[150px] md:pt-[168px] xl:pt-[178px]">
      <div className="container">
        <div className="section-shell listing-hero overflow-hidden px-5 py-7 md:px-8 md:py-9">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[760px]">
              <span className="eyebrow mb-4">Hỗ trợ</span>
              <h1 className="section-heading max-w-[760px]">
                Trung tâm hỗ trợ giúp mua sắm dễ dàng hơn và chăm sóc sau bán hàng tốt hơn.
              </h1>
              <p className="muted-copy mt-4 max-w-[620px] text-[15px] leading-7">
                Tất cả thông tin cần thiết đều ở một nơi, từ giao hàng, hoàn tiền đến cách liên hệ trực tiếp khi cần.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[430px]">
              <div className="soft-card p-4">
                <span className="listing-stat__label">Hỗ trợ nhanh</span>
                <strong className="listing-stat__value">24h</strong>
              </div>
              <div className="soft-card p-4">
                <span className="listing-stat__label">Kênh liên hệ</span>
                <strong className="listing-stat__value">3</strong>
              </div>
              <div className="soft-card p-4">
                <span className="listing-stat__label">Phạm vi</span>
                <strong className="listing-stat__value !text-[1.2rem]">Đơn hàng và hỗ trợ</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="section-shell px-5 py-6 md:px-7 md:py-7">
            <div className="mb-6">
              <span className="eyebrow mb-4">Chủ đề phổ biến</span>
              <h2 className="text-[28px] font-[800] leading-[1.15] text-[#201714]">
                Bắt đầu với những vấn đề được hỏi nhiều nhất.
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
                  <h2 className="text-[26px] font-[800] text-[#201714]">Liên hệ trực tiếp</h2>
                  <p className="mb-0 mt-1 text-[14px] text-[rgba(31,41,55,0.66)]">
                    Chọn kênh liên hệ phù hợp nhất với bạn.
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
                  <span className="eyebrow mb-3">Trả lời nhanh</span>
                  <h2 className="text-[26px] font-[800] text-[#201714]">Câu hỏi thường gặp</h2>
                </div>
                <Link
                  to="/order-tracking"
                  className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,82,82,0.14)] bg-white px-4 py-3 text-[13px] font-[800] text-[#7c553d] transition-all hover:border-[rgba(255,82,82,0.28)] hover:bg-[#fff4ef]"
                >
                  Theo dõi đơn <FiArrowRight className="text-[15px]" />
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
