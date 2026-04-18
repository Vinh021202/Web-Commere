import React, { useEffect, useState } from 'react';
import AccountSidebar from '../../componets/AccountSidebar';
import Button from '@mui/material/Button';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa6';
import Badge from '../../componets/Badge';
import { fetchDataFromApi } from '../../utils/api';

const Orders = () => {
  const [isOpenOrderdProduct, setIsOpenOrderdProduct] = useState(null);
  const [orders, setOrders] = useState([]);

  const isShowOrderdProduct = (index) => {
    if (isOpenOrderdProduct === index) {
      setIsOpenOrderdProduct(null);
    } else {
      setIsOpenOrderdProduct(index);
    }
  };

  useEffect(() => {
    fetchDataFromApi(`/api/order/order-list`).then((res) => {
      if (res?.error === false) {
        setOrders(res?.data);
      }
    });
  }, []);

  return (
    <section className="pb-10 pt-[220px] md:pt-[240px] xl:pt-[260px]">
      <div className="container">
        <div className="section-shell overflow-hidden px-4 py-6 md:px-8 md:py-8">
          <div className="absolute inset-y-0 right-0 hidden w-[34%] bg-[radial-gradient(circle_at_top_right,rgba(255,82,82,0.12),transparent_58%)] lg:block" />

          <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-[760px]">
              <span className="eyebrow">Lịch sử đơn hàng</span>
              <h1 className="section-heading mt-4 max-w-[700px]">
                Theo dõi đơn hàng trong mot b? c?c r? r?ng, de xem nhanh va de doi chieu hon.
              </h1>
              <p className="muted-copy mt-4 max-w-[620px] text-[15px] leading-7">
                Xem trạng thái, tổng tiền, thông tin giao nhận và chi tiết sản phẩm của từng đơn
                ngay tai mot noi.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="listing-chip">Tóm tắt đơn hàng</span>
                <span className="listing-chip">Thong tin giao nhan</span>
                <span className="listing-chip">Chi tiết sản phẩm</span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[460px]">
              <div className="soft-card p-4">
                <span className="listing-stat__label">Tổng đơn hàng</span>
                <strong className="listing-stat__value !text-[1.2rem]">{orders?.length || 0}</strong>
              </div>
              <div className="soft-card p-4">
                <span className="listing-stat__label">Tr?ng th?i</span>
                <strong className="listing-stat__value !text-[1.2rem]">
                  {orders?.length > 0 ? 'Đang theo dõi' : 'Trống'}
                </strong>
              </div>
              <div className="soft-card p-4">
                <span className="listing-stat__label">Che do</span>
                <strong className="listing-stat__value !text-[1.2rem]">Don cua toi</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)]">
          <div className="xl:sticky xl:top-[160px] xl:self-start">
            <AccountSidebar />
          </div>

          <div className="section-shell overflow-hidden px-4 py-4 md:px-6 md:py-6">
            <div className="mb-5">
              <span className="listing-stat__label">Lich su mua hang</span>
              <h2 className="mt-2 text-[24px] font-[800] text-[#1f2937]">Đơn hàng của tôi</h2>
              <p className="mb-0 mt-2 text-[14px] leading-7 text-[#6b7280]">
                Ban co <span className="font-[800] text-primary">{orders?.length || 0}</span> don
                hang trong lich su mua s?m.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {orders?.length > 0 ? (
                orders.map((order, index) => (
                  <div
                    key={order?._id || index}
                    className="orders-card rounded-[24px] border border-[rgba(255,82,82,0.12)] bg-[linear-gradient(135deg,#fff8f5_0%,#ffffff_100%)] p-4 shadow-[0_12px_26px_rgba(15,23,42,0.06)]"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex-1">
                        <div className="mb-3 flex flex-wrap items-center gap-3">
                          <span className="inline-flex rounded-full bg-[#fff1eb] px-3 py-1 text-[11px] font-[800] uppercase tracking-[0.08em] text-[#a65434]">
                            Đơn hàng
                          </span>
                          <Badge status={order?.order_status} />
                          <span className="inline-flex rounded-full bg-white px-3 py-1 text-[11px] font-[700] text-[#7c553d]">
                            {order?.createdAt?.split('T')[0]}
                          </span>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                          <div>
                            <span className="block text-[11px] font-[800] uppercase tracking-[0.08em] text-[#a65434]">
                              Ma don
                            </span>
                            <p className="mb-0 mt-2 break-all text-[13px] font-[700] text-[#1f2937]">
                              {order?._id}
                            </p>
                          </div>

                          <div>
                            <span className="block text-[11px] font-[800] uppercase tracking-[0.08em] text-[#a65434]">
                              Thanh toán
                            </span>
                            <p className="mb-0 mt-2 break-all text-[13px] font-[700] text-[#1f2937]">
                              {order?.paymentId ? order?.paymentId : 'Thanh toán khi nhan hang'}
                            </p>
                          </div>

                          <div>
                            <span className="block text-[11px] font-[800] uppercase tracking-[0.08em] text-[#a65434]">
                              T?ng ti?n
                            </span>
                            <p className="mb-0 mt-2 text-[15px] font-[800] text-primary">
                              {Number(order?.totalAmt || 0).toLocaleString('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                                minimumFractionDigits: 0,
                              })}
                            </p>
                          </div>

                          <div>
                            <span className="block text-[11px] font-[800] uppercase tracking-[0.08em] text-[#a65434]">
                              Khach hang
                            </span>
                            <p className="mb-0 mt-2 text-[13px] font-[700] text-[#1f2937]">
                              {order?.userId?.name}
                            </p>
                            <p className="mb-0 mt-1 text-[12px] text-[#6b7280]">
                              {order?.userId?.email}
                            </p>
                            <p className="mb-0 mt-1 text-[12px] text-[#6b7280]">
                              {order?.userId?.mobile}
                            </p>
                          </div>

                          <div className="md:col-span-2">
                            <span className="block text-[11px] font-[800] uppercase tracking-[0.08em] text-[#a65434]">
                              Địa chỉ giao hàng
                            </span>
                            <p className="mb-0 mt-2 text-[13px] leading-7 text-[#4b5563]">
                              {`${order?.delivery_address?.address_line1 || ''}, ${order?.delivery_address?.city || ''}, ${order?.delivery_address?.lamdmark || ''}, ${order?.delivery_address?.state || ''}, ${order?.delivery_address?.country || ''}, ${order?.delivery_address?.pincode || ''}`}
                            </p>
                          </div>
                        </div>
                      </div>

                      <Button
                        className="!min-w-[160px] !rounded-full !border !border-[rgba(255,82,82,0.16)] !bg-white !px-5 !py-2 !text-[13px] !font-[800] !capitalize !text-[#1f2937]"
                        onClick={() => isShowOrderdProduct(index)}
                      >
                        {isOpenOrderdProduct === index ? (
                          <>
                            <FaAngleUp className="mr-2 text-[14px]" />
                            Ẩn sản phẩm
                          </>
                        ) : (
                          <>
                            <FaAngleDown className="mr-2 text-[14px]" />
                            Xem sản phẩm
                          </>
                        )}
                      </Button>
                    </div>

                    {isOpenOrderdProduct === index && (
                      <div className="mt-5 border-t border-[rgba(255,82,82,0.12)] pt-5">
                        <div className="grid gap-4">
                          {order?.products?.map((item, itemIndex) => (
                            <div
                              key={item?._id || itemIndex}
                              className="orders-card__product flex flex-col gap-4 rounded-[20px] border border-[rgba(255,82,82,0.12)] bg-white p-4 md:flex-row md:items-center"
                            >
                              <div className="h-[74px] w-[74px] overflow-hidden rounded-[16px] bg-[#fff8f5]">
                                <img
                                  src={item?.image}
                                  alt={item?.productTitle || 'Ảnh sản phẩm'}
                                  className="h-full w-full object-cover"
                                />
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="mb-0 text-[13px] font-[800] text-[#1f2937]">
                                  {item?.productTitle}
                                </p>
                                <p className="mb-0 mt-1 break-all text-[11px] text-[#6b7280]">
                                  Mã sản phẩm: {item?._id}
                                </p>
                              </div>

                              <div className="grid gap-3 sm:grid-cols-3 md:min-w-[320px]">
                                <div>
                                  <span className="block text-[11px] font-[800] uppercase tracking-[0.08em] text-[#a65434]">
                                    Số lượng
                                  </span>
                                  <p className="mb-0 mt-1 text-[13px] font-[700] text-[#1f2937]">
                                    {item?.quantity}
                                  </p>
                                </div>
                                <div>
                                  <span className="block text-[11px] font-[800] uppercase tracking-[0.08em] text-[#a65434]">
                                    Gia
                                  </span>
                                  <p className="mb-0 mt-1 text-[13px] font-[700] text-[#1f2937]">
                                    {item?.price?.toLocaleString('vi-VN', {
                                      style: 'currency',
                                      currency: 'VND',
                                      minimumFractionDigits: 0,
                                    })}
                                  </p>
                                </div>
                                <div>
                                  <span className="block text-[11px] font-[800] uppercase tracking-[0.08em] text-[#a65434]">
                                    Tạm tính
                                  </span>
                                  <p className="mb-0 mt-1 text-[13px] font-[800] text-primary">
                                    {(item?.price * item?.quantity)?.toLocaleString('vi-VN', {
                                      style: 'currency',
                                      currency: 'VND',
                                      minimumFractionDigits: 0,
                                    })}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="rounded-[28px] border border-dashed border-[rgba(255,82,82,0.16)] bg-[linear-gradient(135deg,#fff8f5_0%,#ffffff_100%)] p-10 text-center">
                  <h3 className="text-[22px] font-[800] text-[#1f2937]">Chưa có đơn hàng nào</h3>
                  <p className="mb-0 mt-3 text-[14px] leading-7 text-[#6b7280]">
                    Khi bạn mua hàng, lịch sử đơn hàng sẽ hiển thị tại đây để theo dõi dễ hơn.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Orders;
