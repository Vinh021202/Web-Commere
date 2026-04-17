import React, { useContext, useState } from 'react';
import { MdOutlineShoppingCart } from 'react-icons/md';
import { FaRegHeart } from 'react-icons/fa';
import { IoIosGitCompare } from 'react-icons/io';
import Button from '@mui/material/Button';
import QtyBox from '../../componets/QtyBox';
import Rating from '@mui/material/Rating';
import { MyContext } from '../../App';
import CircularProgress from '@mui/material/CircularProgress';
import { postData } from '../../utils/api';

const ProductDetailsComponent = (props) => {
  const [productActionsIndex, setProductActionsIndex] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTabName, setSelcetedTabName] = useState(null);
  const [tabError, setTabError] = useState(false);

  const context = useContext(MyContext);
  const hasSizeOptions = (props?.item?.size?.length || 0) > 0;
  const hasWeightOptions = (props?.item?.productWeight?.length || 0) > 0;
  const hasRamOptions = (props?.item?.productRam?.length || 0) > 0;
  const hasVariantOptions = hasSizeOptions || hasWeightOptions || hasRamOptions;

  const handleSelecteQty = (qty) => {
    setQuantity(qty);
  };

  const handleClickActivetab = (index, name) => {
    setProductActionsIndex(index);
    setSelcetedTabName(name);
    setTabError(false);
  };

  const addToCart = (product, userId, quantity) => {
    if (userId === undefined) {
      context?.alertBox('error', 'you are not login please login first');
      return false;
    }

    if (hasVariantOptions && !selectedTabName) {
      setTabError(true);
      context?.alertBox(
        'error',
        hasSizeOptions ? 'Please select a size first' : 'Please select an option first'
      );
      return false;
    }

    const producItem = {
      productId: product?._id,
      productTitle: product?.name,
      image: product?.images?.[0],
      rating: product?.rating,
      price: product?.price,
      oldPrice: product?.oldPrice,
      discount: product?.discount,
      quantity,
      subTotal: parseInt(product?.price * quantity),
      countInStock: product?.countInStock,
      brand: product?.brand,
      size: hasSizeOptions ? selectedTabName || '' : '',
      weight: hasWeightOptions ? selectedTabName || '' : '',
      ram: hasRamOptions ? selectedTabName || '' : '',
    };

    setIsLoading(true);

    postData(`/api/cart/add`, producItem).then((res) => {
      if (res?.error === false) {
        context?.alertBox('success', res?.message);
        context?.getCartItems();
      } else {
        context?.alertBox('error', res?.message);
      }

      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    });
  };

  return (
    <>
      <div>
        <h1 className="mb-2 text-[24px] font-[600]">{props?.item?.name}</h1>
        <div className="flex items-center gap-3">
          <span className="text-[13px] text-gray-400">
            Brands :<span className="font-[500] text-black opacity-75"> {props?.item?.brand}</span>
          </span>
          <Rating name="size-small" defaultValue={4} size="small" readOnly />
          <span className="cursor-pointer text-[13px] text-gray-500" onClick={props?.gotoReviews}>
            Review ({props?.reviewsCount})
          </span>
        </div>
        <div className="mt-4 flex items-center gap-4">
          <span className="oldPrice text-[18px] font-[500] text-gray-500 line-through">
            &#8363; {props?.item?.price}
          </span>
          <span className="price text-[18px] font-[600] text-primary">
            &#8363; {props?.item?.oldPrice}
          </span>
          <span className="text-[14px]">
            Available In Stock:
            <span className="font-bold text-green-600"> {props?.item?.countInStock}</span>
          </span>
        </div>

        <br />
        <p className="mb-5 mt-3 pr-10">{props?.item?.description}</p>

        {props?.item?.productRam?.length !== 0 && (
          <div className="flex items-center gap-5">
            <span className="text-[16px]">Ram:</span>
            <div className={`actions product-option-group flex items-center gap-2 ${tabError && !selectedTabName ? 'product-option-group--error' : ''}`}>
              {props?.item?.productRam?.map((item, index) => {
                return (
                  <Button
                    key={`${item}-${index}`}
                    className={`product-option-btn !min-w-[54px] !h-[36px] !rounded-full !px-4 !font-[700] !uppercase ${
                      selectedTabName === item
                        ? '!border-[#ff5252] !bg-[#ff5252] !text-white shadow-[0_12px_24px_rgba(255,82,82,0.22)]'
                        : '!border-[rgba(255,82,82,0.14)] !bg-[#fff5f2] !text-[#111827]'
                    }`}
                    onClick={() => handleClickActivetab(index, item)}
                  >
                    {item}
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {props?.item?.size?.length !== 0 && (
          <div className="flex items-center gap-5">
            <span className="text-[16px]">Size:</span>
            <div className={`actions product-option-group flex items-center gap-2 ${tabError && !selectedTabName ? 'product-option-group--error' : ''}`}>
              {props?.item?.size?.map((item, index) => {
                return (
                  <Button
                    key={`${item}-${index}`}
                    className={`product-option-btn !min-w-[54px] !h-[36px] !rounded-full !px-4 !font-[700] !uppercase ${
                      selectedTabName === item
                        ? '!border-[#ff5252] !bg-[#ff5252] !text-white shadow-[0_12px_24px_rgba(255,82,82,0.22)]'
                        : '!border-[rgba(255,82,82,0.14)] !bg-[#fff5f2] !text-[#111827]'
                    }`}
                    onClick={() => handleClickActivetab(index, item)}
                  >
                    {item}
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {props?.item?.productWeight?.length !== 0 && (
          <div className="flex items-center gap-5">
            <span className="text-[16px]">Weight:</span>
            <div className={`actions product-option-group flex items-center gap-2 ${tabError && !selectedTabName ? 'product-option-group--error' : ''}`}>
              {props?.item?.productWeight?.map((item, index) => {
                return (
                  <Button
                    key={`${item}-${index}`}
                    className={`product-option-btn !min-w-[54px] !h-[36px] !rounded-full !px-4 !font-[700] !uppercase ${
                      selectedTabName === item
                        ? '!border-[#ff5252] !bg-[#ff5252] !text-white shadow-[0_12px_24px_rgba(255,82,82,0.22)]'
                        : '!border-[rgba(255,82,82,0.14)] !bg-[#fff5f2] !text-[#111827]'
                    }`}
                    onClick={() => handleClickActivetab(index, item)}
                  >
                    {item}
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {tabError && !selectedTabName && (
          <p className="product-option-error mb-0 mt-3">
            {hasSizeOptions ? 'Vui long chon size truoc khi them vao gio hang.' : 'Vui long chon mot tuy chon truoc khi them vao gio hang.'}
          </p>
        )}

        <p className="mb-2 mt-5 !text-[#000] text-[14px]">Free Shipping (Est. Delivery Time 2-3 Days)</p>
        <div className="flex items-center gap-4 py-4">
          <div className="qtyBoxWrapper w-[70px]">
            <QtyBox handleSelecteQty={handleSelecteQty} />
          </div>
          <Button
            className="bg-org flex gap-2 !min-w-[150px]"
            onClick={() => addToCart(props?.item, context?.userData?._id, quantity)}
          >
            {isLoading === true ? (
              <CircularProgress color="inherit" />
            ) : (
              <>
                <MdOutlineShoppingCart className="text-[22px]" />
                Add To Cart
              </>
            )}
          </Button>
        </div>
        <div className="mt-4 flex items-center gap-4">
          <span className="link flex cursor-pointer items-center gap-2 text-[15px] font-[500]">
            <FaRegHeart className="text-[18px]" />
            Add to Wishlist
          </span>
          <span className="link flex cursor-pointer items-center gap-2 text-[15px] font-[500]">
            <IoIosGitCompare className="text-[18px]" />
            Add to Compare
          </span>
        </div>
      </div>
    </>
  );
};

export default ProductDetailsComponent;
