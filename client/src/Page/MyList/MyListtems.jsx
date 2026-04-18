import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { IoCloseSharp } from 'react-icons/io5';
import { Rating } from '@mui/material';
import { MyContext } from '../../App';
import { deleteData } from '../../utils/api';

const MyListtems = (props) => {
  const context = useContext(MyContext);

  const removeItem = (id) => {
    deleteData(`/api/myList/${id}`).then(() => {
      context.alertBox('success', 'Đã xóa sản phẩm khỏi danh sách yêu thích');
      context.getMyListData();
    });
  };

  return (
    <div className="group relative flex w-full flex-col gap-4 rounded-[24px] border border-[rgba(255,82,82,0.12)] bg-[linear-gradient(135deg,#fff8f5_0%,#ffffff_100%)] p-4 shadow-[0_12px_26px_rgba(15,23,42,0.06)] md:flex-row md:items-center">
      <div className="img h-[150px] w-full overflow-hidden rounded-[20px] bg-white md:w-[150px] md:min-w-[150px]">
        <Link to={`/product/${props?.item?.productId}`} className="group block h-full w-full">
          <img
            src={props?.item?.image}
            alt={props?.item?.name || 'Ảnh sản phẩm'}
            className="h-full w-full object-cover transition-all duration-300 group-hover:scale-[1.05]"
          />
        </Link>
      </div>

      <div className="info min-w-0 flex-1 pr-0 md:pr-10">
        <div className="mb-2 flex flex-wrap items-center gap-3">
          <span className="inline-flex rounded-full bg-[#fff1eb] px-3 py-1 text-[11px] font-[800] uppercase tracking-[0.08em] text-[#a65434]">
            {props?.item?.brand || 'Bo suu tap'}
          </span>
          <span className="inline-flex rounded-full bg-white px-3 py-1 text-[11px] font-[700] text-[#7c553d]">
            Da luu
          </span>
        </div>

        <h3 className="text-[17px] font-[800] leading-7 text-[#1f2937]">
          <Link to={`/product/${props?.item?.productId}`} className="link transition-all hover:text-primary">
            {props?.item?.name?.length > 70 ? `${props?.item?.name.slice(0, 70)}...` : props?.item?.name}
          </Link>
        </h3>

        <div className="mt-3 flex items-center gap-2">
          <Rating name={`wishlist-rating-${props?.item?._id}`} value={props?.item?.rating || 0} size="small" readOnly />
          <span className="text-[12px] font-[700] text-[#6b7280]">({props?.item?.rating || 0})</span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <span className="price text-[16px] font-[800] text-[#1f2937]">
            &#8363; {props?.item?.price}
          </span>
          <span className="oldPrice text-[14px] font-[500] text-gray-400 line-through">
            &#8363; {props?.item?.oldPrice}
          </span>
          <span className="rounded-full border border-[rgba(255,82,82,0.16)] bg-white px-3 py-1 text-[11px] font-[800] uppercase tracking-[0.06em] text-[#ff5252]">
            Giam {props?.item?.discount}%
          </span>
        </div>
      </div>

      <button
        type="button"
        className="absolute right-[14px] top-[14px] flex h-[36px] w-[36px] items-center justify-center rounded-full border border-[rgba(255,82,82,0.14)] bg-white text-[18px] text-[#6b7280] transition hover:border-[#ff5252] hover:text-[#ff5252]"
        onClick={() => removeItem(props?.item?._id)}
        aria-label="Xóa sản phẩm"
      >
        <IoCloseSharp />
      </button>
    </div>
  );
};

export default MyListtems;
