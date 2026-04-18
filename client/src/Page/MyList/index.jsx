import React, { useContext } from 'react';
import { Button } from '@mui/material';
import MyListtems from './MyListtems';
import AccountSidebar from '../../componets/AccountSidebar';
import { MyContext } from '../../App';
import { Link } from 'react-router-dom';

const MyList = () => {
  const context = useContext(MyContext);
  const listCount = context?.myListData?.length || 0;

  return (
    <section className="pb-10 pt-[220px] md:pt-[240px] xl:pt-[260px]">
      <div className="container">
        <div className="section-shell overflow-hidden px-4 py-6 md:px-8 md:py-8">
          <div className="absolute inset-y-0 right-0 hidden w-[34%] bg-[radial-gradient(circle_at_top_right,rgba(255,82,82,0.12),transparent_58%)] lg:block" />

          <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-[760px]">
              <span className="eyebrow">Danh sách yêu thích</span>
              <h1 className="section-heading mt-4 max-w-[700px]">
                Danh sách sản phẩm yêu thích được sắp xếp gọn, dễ xem và quay lại mua hơn.
              </h1>
              <p className="muted-copy mt-4 max-w-[620px] text-[15px] leading-7">
                Lưu lại những sản phẩm bạn quan tâm để so sánh nhanh, xem lại giá và tiếp tục mua
                sắm bất cứ lúc nào.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="listing-chip">Sản phẩm yêu thích</span>
                <span className="listing-chip">Xem lại nhanh</span>
                <span className="listing-chip">Mua sắm thông minh</span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[460px]">
              <div className="soft-card p-4">
                <span className="listing-stat__label">Tổng sản phẩm</span>
                <strong className="listing-stat__value !text-[1.2rem]">{listCount}</strong>
              </div>
              <div className="soft-card p-4">
                <span className="listing-stat__label">Trạng thái</span>
                <strong className="listing-stat__value !text-[1.2rem]">
                  {listCount > 0 ? 'Đã lưu' : 'Trống'}
                </strong>
              </div>
              <div className="soft-card p-4">
                <span className="listing-stat__label">Tài khoản</span>
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
            <div className="mb-5">
              <span className="listing-stat__label">Tổng quan danh sách yêu thích</span>
              <h2 className="mt-2 text-[24px] font-[800] text-[#1f2937]">Danh sách của tôi</h2>
              <p className="mb-0 mt-2 text-[14px] leading-7 text-[#6b7280]">
                Hiện có <span className="font-[800] text-primary">{listCount}</span> sản phẩm trong
                danh sách yêu thích của bạn.
              </p>
            </div>

            {listCount > 0 ? (
              <div className="flex flex-col gap-4">
                {context.myListData.map((item, index) => (
                  <MyListtems key={item?._id || index} item={item} />
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center flex-col rounded-[28px] border border-dashed border-[rgba(255,82,82,0.16)] bg-[linear-gradient(135deg,#fff8f5_0%,#ffffff_100%)] py-12 px-4 text-center">
                <img src="/list.png" className="w-[110px]" alt="Danh sách trống" />
                <h3 className="mt-5 text-[22px] font-[800] text-[#1f2937]">Danh sách yêu thích đang trống</h3>
                <p className="mb-0 mt-3 max-w-[480px] text-[14px] leading-7 text-[#6b7280]">
                  Lưu những sản phẩm bạn thích để quay lại nhanh hơn khi cần xem lại giá và chi
                  tiết.
                </p>
                <Link to={'/'} className="mt-6">
                  <Button className="bg-org product-card__cta product-card__cta--primary !px-6">
                    Tiếp tục mua sắm
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyList;
