import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import { FiArrowRight, FiMail, FiMapPin, FiPackage, FiSearch, FiTruck } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const trackingSteps = [
  { title: 'Đã xác nhận đơn', detail: 'Đơn hàng của bạn đã được tiếp nhận và xác thực.' },
  { title: 'Đã đóng gói', detail: 'Sản phẩm đã được đóng gói và sẵn sàng bàn giao.' },
  { title: 'Đang vận chuyển', detail: 'Đơn vị vận chuyển đang đưa hàng tới thành phố đích.' },
  { title: 'Đang giao hàng', detail: 'Bưu kiện đang trên chặng cuối cùng tới địa chỉ của bạn.' },
];

const OrderTracking = () => {
  const [orderCode, setOrderCode] = useState('');
  const [contactValue, setContactValue] = useState('');

  return (
    <section className="pb-10 pt-[150px] md:pt-[168px] xl:pt-[178px]">
      <div className="container">
        <div className="section-shell listing-hero overflow-hidden px-5 py-7 md:px-8 md:py-9">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[760px]">
              <span className="eyebrow mb-4">Theo dõi</span>
              <h1 className="section-heading max-w-[760px]">
                Theo dõi đơn hàng va tien trinh giao nhan trong cung mot man hinh.
              </h1>
              <p className="muted-copy mt-4 max-w-[620px] text-[15px] leading-7">
                Nhập mã đơn hàng và thông tin liên hệ để xem mốc giao hàng mới nhất, lộ trình hiện
                tại và cách nhận hỗ trợ.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[430px]">
              <div className="soft-card p-4">
                <span className="listing-stat__label">Trạng thái</span>
                <strong className="listing-stat__value">4 bước</strong>
              </div>
              <div className="soft-card p-4">
                <span className="listing-stat__label">Phạm vi</span>
                <strong className="listing-stat__value">Toàn quốc</strong>
              </div>
              <div className="soft-card p-4">
                <span className="listing-stat__label">Hỗ trợ</span>
                <strong className="listing-stat__value !text-[1.2rem]">Sẵn sàng mọi lúc</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="section-shell px-5 py-6 md:px-7 md:py-7">
            <div className="mb-6">
              <span className="eyebrow mb-4">Tìm đơn hàng</span>
              <h2 className="text-[28px] font-[800] leading-[1.15] text-[#201714]">
                Kiểm tra trạng thái bằng mã đơn hàng.
              </h2>
              <p className="mb-0 mt-3 text-[14px] leading-7 text-[rgba(31,41,55,0.68)]">
                Sử dụng email hoặc số điện thoại bạn đã nhập khi đặt hàng để tìm nhanh hơn.
              </p>
            </div>

            <div className="space-y-4">
              <TextField
                className="w-full"
                label="Mã đơn hàng"
                placeholder="Vi du: ORD-2026-00128"
                value={orderCode}
                onChange={(event) => setOrderCode(event.target.value)}
              />
              <TextField
                className="w-full"
                label="Email hoặc số điện thoại"
                placeholder="your@email.com hoac 09xxxxxxxx"
                value={contactValue}
                onChange={(event) => setContactValue(event.target.value)}
              />
              <Button className="bg-org btn-lg flex w-full gap-2">
                <FiSearch className="text-[18px]" /> Tra cứu đơn hàng
              </Button>
            </div>

            <div className="mt-6 rounded-[24px] border border-[rgba(255,82,82,0.12)] bg-[linear-gradient(135deg,#fff8f5_0%,#ffffff_100%)] p-5">
              <h3 className="text-[18px] font-[800] text-[#1f2937]">Cần hỗ trợ về đơn hàng?</h3>
              <p className="mb-0 mt-2 text-[14px] leading-7">
                Nếu bạn không tìm thấy đơn hàng, đội ngũ hỗ trợ sẽ giúp xác minh giao dịch và kiểm
                tra cập nhật thủ công.
              </p>
              <Link
                to="/help-center"
                className="mt-4 inline-flex items-center gap-2 text-[13px] font-[800] text-[#7c553d]"
              >
                Mở trung tâm hỗ trợ <FiArrowRight className="text-[15px]" />
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
                  <h2 className="text-[26px] font-[800] text-[#201714]">
                    Tiến trình giao hàng mẫu
                  </h2>
                  <p className="mb-0 mt-1 text-[14px] text-[rgba(31,41,55,0.66)]">
                    Xem trước lượng trạng thái mà khách hàng thường gặp.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {trackingSteps.map((step, index) => (
                  <div
                    key={step.title}
                    className="flex gap-4 rounded-[22px] border border-[rgba(255,82,82,0.12)] bg-white p-4"
                  >
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
                <h3 className="mt-4 text-[22px] font-[800] text-[#201714]">Cập nhật vận chuyển</h3>
                <p className="mb-0 mt-2 text-[14px] leading-7">
                  Thời gian giao dự kiến, các mốc xuất kho và tiến trình vận chuyển.
                </p>
              </div>

              <div className="section-shell px-5 py-6">
                <div className="flex h-[48px] w-[48px] items-center justify-center rounded-[16px] bg-[#fff1eb] text-[#ff5252]">
                  <FiMail className="text-[22px]" />
                </div>
                <h3 className="mt-4 text-[22px] font-[800] text-[#201714]">Thông báo</h3>
                <p className="mb-0 mt-2 text-[14px] leading-7">
                  Nhận thông báo thay đổi lộ trình và xác nhận giao hàng qua thông tin liên hệ đã
                  lưu.
                </p>
              </div>

              <div className="section-shell px-5 py-6 md:col-span-2">
                <div className="flex items-start gap-4">
                  <div className="flex h-[48px] w-[48px] items-center justify-center rounded-[16px] bg-[#fff1eb] text-[#ff5252]">
                    <FiMapPin className="text-[22px]" />
                  </div>
                  <div>
                    <h3 className="text-[22px] font-[800] text-[#201714]">Địa chỉ nhận hàng</h3>
                    <p className="mb-0 mt-2 text-[14px] leading-7">
                      Giữ thông tin địa chỉ chính xác để đơn vị vận chuyển giao đúng nơi mà không bị
                      chậm trễ.
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
