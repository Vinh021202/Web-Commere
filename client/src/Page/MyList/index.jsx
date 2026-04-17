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
              <span className="eyebrow">Saved favorites</span>
              <h1 className="section-heading mt-4 max-w-[700px]">
                Danh sach san pham yeu thich duoc sap xep gon, de xem va quay lai mua hon.
              </h1>
              <p className="muted-copy mt-4 max-w-[620px] text-[15px] leading-7">
                Luu lai nhung san pham ban quan tam de so sanh nhanh, xem lai gia va tiep tuc mua
                sam bat cu luc nao.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="listing-chip">Favorite products</span>
                <span className="listing-chip">Quick revisit</span>
                <span className="listing-chip">Smart shopping flow</span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[460px]">
              <div className="soft-card p-4">
                <span className="listing-stat__label">Tong san pham</span>
                <strong className="listing-stat__value !text-[1.2rem]">{listCount}</strong>
              </div>
              <div className="soft-card p-4">
                <span className="listing-stat__label">Trang thai</span>
                <strong className="listing-stat__value !text-[1.2rem]">
                  {listCount > 0 ? 'Saved' : 'Empty'}
                </strong>
              </div>
              <div className="soft-card p-4">
                <span className="listing-stat__label">Tai khoan</span>
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
              <span className="listing-stat__label">Wishlist overview</span>
              <h2 className="mt-2 text-[24px] font-[800] text-[#1f2937]">My List</h2>
              <p className="mb-0 mt-2 text-[14px] leading-7 text-[#6b7280]">
                There are <span className="font-[800] text-primary">{listCount}</span> products in
                your My List
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
                <img src="/list.png" className="w-[110px]" alt="Empty list" />
                <h3 className="mt-5 text-[22px] font-[800] text-[#1f2937]">My List is currently empty</h3>
                <p className="mb-0 mt-3 max-w-[480px] text-[14px] leading-7 text-[#6b7280]">
                  Luu nhung san pham ban thich de quay lai nhanh hon khi can xem lai gia va chi
                  tiet.
                </p>
                <Link to={'/'} className="mt-6">
                  <Button className="bg-org product-card__cta product-card__cta--primary !px-6">
                    Continue Shopping
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
