import React from 'react';
import '../bannerBoxV2/style.css';
import { Link } from 'react-router-dom';

const BannerBoxV2 = (props) => {
  const title = props?.item?.bannerTitle || props?.item?.name || 'Ưu đãi nổi bật';
  const price = props?.item?.price;

  return (
    <>
      <div className="bannerBoxV2 group relative w-full overflow-hidden rounded-[16px] md:rounded-md">
        <img
          src={props.image}
          className="block min-h-[180px] w-full object-cover transition-all duration-150 group-hover:scale-105 sm:min-h-[220px] md:min-h-0"
        />

        <div
          className={`info absolute top-0 z-50 flex h-full w-[78%] flex-col items-start justify-end gap-2 p-4 sm:w-[70%] sm:justify-center sm:p-5 ${
              props.info === 'left' ? 'left-0' : 'right-0'
            } ${
              props.info === 'left' ? '' : 'sm:pl-15'
            } `}
        >
          <h2 className="text-[16px] font-[700] text-[#1f2937] sm:text-[20px]">{title}</h2>
          {price && (
            <span className="text-primary w-full text-[16px] font-[700] sm:text-[20px]">
              &#8363; {price}
            </span>
          )}

          <div className="w-full">
            <Link to={'/'} className="link text-[14px] font-[600] sm:text-[16px]">
              SHOP NOW
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default BannerBoxV2;
