import React from 'react';
import { IoMdTime } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { MdArrowForwardIos } from 'react-icons/md';

const BlogItem = (props) => {
  return (
    <>
      <div className="BlogItem group soft-card overflow-hidden">
        <div className="imgWrapper relative w-full cursor-pointer overflow-hidden rounded-[24px] rounded-b-none">
          <img
            src={props?.item?.images[0]}
            alt="blog"
            className="h-[240px] w-full object-cover transition-all duration-700 group-hover:scale-105"
          />

          <span
            className="absolute bottom-[16px] right-[16px] z-50 flex items-center justify-between gap-3 rounded-full bg-[#ff5252] px-3 py-2 text-[12px] font-[600] text-white shadow-[0_12px_24px_rgba(255,82,82,0.28)]"
          >
            <IoMdTime className="text-[18px]" />
            {props?.item?.createdAt?.split('T')[0]}
          </span>
        </div>

        <div className="info p-5">
          <h2 className="text-[18px] font-[700] leading-7 text-black">
            <Link to={'/'} className="link">
              {props?.item?.title}
            </Link>
          </h2>
          <div
            dangerouslySetInnerHTML={{
              __html: props?.item?.description?.substr(0, 100) + '...',
            }}
            style={{
              wordBreak: 'break-word',
              whiteSpace: 'normal',
            }}
          ></div>
          <Link className="link mt-4 flex items-center gap-1 text-[14px] font-[700] text-[#ff5252]">
            Read More <MdArrowForwardIos />
          </Link>
        </div>
      </div>
    </>
  );
};

export default BlogItem;
