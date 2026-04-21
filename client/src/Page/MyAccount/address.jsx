import React, { useContext, useEffect, useState } from 'react';
import AccountSidebar from '../../componets/AccountSidebar';
import { MyContext } from '../../App';
import { deleteData, fetchDataFromApi } from '../../utils/api';
import AddressBox from './addressBox';

const Address = () => {
  const [address, setAddress] = useState([]);
  const context = useContext(MyContext);

  useEffect(() => {
    if (context?.userData?._id !== '' && context?.userData?._id !== undefined) {
      setAddress(context?.userData?.address_details || []);
    }
  }, [context?.userData]);

  const removeAddress = (id) => {
    deleteData(`/api/address/${id}`).then(() => {
      fetchDataFromApi(`/api/address/get?userId=${context?.userData?._id}`).then((res) => {
        setAddress(res.data);
        context.getUserAddress();
      });
    });
  };

  return (
    <section className="pb-10 pt-6 md:pt-8">
      <div className="container">
        <div className="section-shell overflow-hidden px-4 py-6 md:px-8 md:py-8">
          <div className="absolute inset-y-0 right-0 hidden w-[34%] bg-[radial-gradient(circle_at_top_right,rgba(255,82,82,0.12),transparent_58%)] lg:block" />

          <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-[760px]">
              <span className="eyebrow">Sổ địa chỉ</span>
              <h1 className="section-heading mt-4 max-w-[700px]">
                Luu tru va quan ly địa chỉ giao hàng trong mot b? c?c gon gang hon.
              </h1>
              <p className="muted-copy mt-4 max-w-[620px] text-[15px] leading-7">
                Thêm, chỉnh sửa hoặc xóa địa chỉ để việc đặt hàng và giao nhận trở nên nhanh hơn.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="listing-chip">Địa chỉ giao hàng</span>
                <span className="listing-chip">Cap nhat nhanh</span>
                <span className="listing-chip">Quản lý ngay tại một chỗ</span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[460px]">
              <div className="soft-card p-4">
                <span className="listing-stat__label">Tổng địa chỉ</span>
                <strong className="listing-stat__value !text-[1.2rem]">{address?.length || 0}</strong>
              </div>
              <div className="soft-card p-4">
                <span className="listing-stat__label">Che do</span>
                <strong className="listing-stat__value !text-[1.2rem]">Đã lưu</strong>
              </div>
              <div className="soft-card p-4">
                <span className="listing-stat__label">T?i kho?n</span>
                <strong className="listing-stat__value !text-[1.2rem]">
                  {context?.userData?.name || '--'}
                </strong>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)]">
          <div className="xl:sticky xl:top-[160px] xl:self-start">
            <AccountSidebar />
          </div>

          <div className="section-shell overflow-hidden px-4 py-4 md:px-6 md:py-6">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="listing-stat__label">Địa chỉ đã lưu</span>
                <h2 className="mt-2 text-[24px] font-[800] text-[#1f2937]">Địa chỉ</h2>
              </div>

              <button
                type="button"
                className="flex min-h-[88px] w-full items-center justify-center rounded-[24px] border border-dashed border-[rgba(255,82,82,0.22)] bg-[linear-gradient(135deg,#fff8f5_0%,#ffffff_100%)] px-5 text-[14px] font-[800] text-[#a65434] transition hover:border-[rgba(255,82,82,0.34)] hover:bg-[#fff5f2] sm:w-[220px]"
                onClick={() => {
                  context?.setOpenAddressPanel(true);
                  context?.setAddressMode('add');
                }}
              >
                + Thêm địa chỉ
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {address?.length > 0 ? (
                address.map((addressItem, index) => (
                  <AddressBox
                    address={addressItem}
                    key={addressItem?._id || index}
                    removeAddress={removeAddress}
                  />
                ))
              ) : (
                <div className="soft-card rounded-[24px] border border-dashed border-[rgba(255,82,82,0.18)] bg-[linear-gradient(135deg,#fff8f5_0%,#ffffff_100%)] p-8 text-center">
                  <h3 className="text-[18px] font-[800] text-[#1f2937]">Chưa có địa chỉ nào</h3>
                  <p className="mb-0 mt-3 text-[14px] leading-7 text-[#6b7280]">
                    Thêm địa chỉ mới để sử dụng nhanh khi đặt hàng.
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

export default Address;
