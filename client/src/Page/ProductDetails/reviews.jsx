import React, { useContext, useEffect, useState } from 'react';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { MyContext } from '../../App';
import { fetchDataFromApi, postData } from '../../utils/api';

const Reviews = (props) => {
  const [reviews, setReviews] = useState({
    image: '',
    userName: '',
    review: '',
    rating: 1,
    userId: '',
    productId: '',
  });

  const [reviewsData, setReviewsData] = useState([]);

  const context = useContext(MyContext);
  useEffect(() => {
    setReviews((prev) => ({
      ...prev,
      image: context?.userData?.avatar,
      userName: context?.userData?.name,
      userId: context?.userData?._id,
      productId: props?.productId,
    }));

    if (props?.productId) {
      getReviews();
    }
  }, [context?.userData, props?.productId]);

  const onChangeInput = (e) => {
    setReviews((prev) => ({
      ...prev,
      review: e.target.value,
    }));
  };

  const addReview = (e) => {
    e.preventDefault();

    if (reviews?.review !== '') {
      postData(`/api/user/addReview`, reviews).then((res) => {
        if (res?.error === false) {
          context.alertBox('success', res?.message);
          setReviews((prev) => ({
            ...prev,
            review: '',
            rating: 1,
          }));

          getReviews();
        } else {
          context.alertBox('error', res?.message);
        }
      });
    } else {
      context.alertBox('error', 'Please add reviews');
    }
  };

  const getReviews = () => {
    fetchDataFromApi(`/api/user/getReviews?productId=${props.productId}`).then((res) => {
      if (res?.error === false) {
        setReviewsData(res?.reviews);
        props.setReviewsCount(res?.reviews.length);
      }
    });
  };

  return (
    <div className="w-full productReviewsContainer">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="eyebrow">Customer review</span>
          <h2 className="mt-3 text-[20px] font-[800] text-[#1f2937]">Customer questions & answers</h2>
        </div>
        <p className="mb-0 max-w-[520px] text-[13px] leading-6 text-[#6b7280]">
          Xem nhanh danh gia tu khach hang va them nhan xet moi de hoan thien trai nghiem mua sam.
        </p>
      </div>

      {reviewsData && reviewsData?.length > 0 && (
        <div className="reviewScroll mt-6 w-full max-h-[360px] overflow-y-scroll overflow-x-hidden pr-2 md:pr-4">
          <div className="flex flex-col gap-4">
            {reviewsData?.map((review, index) => {
              return (
                <div
                  key={index}
                  className="review flex w-full flex-col gap-4 rounded-[24px] border border-[rgba(255,82,82,0.12)] bg-[linear-gradient(135deg,#fff8f5_0%,#ffffff_100%)] p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="info flex w-full items-start gap-3 md:w-[76%]">
                    <div className="img h-[62px] w-[62px] flex-shrink-0 overflow-hidden rounded-full border border-[rgba(255,82,82,0.14)]">
                      <img
                        src={review?.image}
                        className="block h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/80';
                        }}
                      />
                    </div>

                    <div className="w-full">
                      <div className="flex flex-wrap items-center gap-3">
                        <h4 className="text-[15px] font-[800] text-[#1f2937]">{review?.userName}</h4>
                        <span className="rounded-full bg-white px-3 py-1 text-[11px] font-[700] text-[#7c553d]">
                          {review?.createdAt?.split('T')[0]}
                        </span>
                      </div>
                      <p className="mb-0 mt-2 text-[13px] leading-6 text-[#4b5563]">{review?.review}</p>
                    </div>
                  </div>
                  <Rating name="size-small" value={parseInt(review?.rating)} readOnly />
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="reviewFrom mt-6 rounded-[24px] border border-[rgba(255,82,82,0.12)] bg-[linear-gradient(135deg,#fff8f5_0%,#ffffff_100%)] p-4 md:p-5">
        <h2 className="text-[18px] font-[800] text-[#1f2937]">Add a review</h2>
        <p className="mb-0 mt-2 text-[13px] leading-6 text-[#6b7280]">
          Chia se trai nghiem cua ban de nguoi mua sau co them thong tin tham khao.
        </p>

        <form className="mt-5 w-full" onSubmit={addReview}>
          <TextField
            id="outlined-multiline-flexible"
            label="Review"
            className="w-full mb-5"
            onChange={onChangeInput}
            name="review"
            multiline
            rows={5}
            value={reviews.review}
          />
          <Rating
            name="size-small"
            value={reviews.rating}
            onChange={(event, newValue) => {
              setReviews((prev) => ({
                ...prev,
                rating: newValue,
              }));
            }}
          />
          <div className="mt-5 flex items-center">
            <Button type="submit" className="bg-org product-card__cta product-card__cta--primary">
              Submit Review
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Reviews;
