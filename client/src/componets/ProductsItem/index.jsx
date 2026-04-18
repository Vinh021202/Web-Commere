import React, { useContext, useEffect, useState } from 'react';
import '../ProductsItem/style.css';
import { Link } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import { Button } from '@mui/material';
import { FaRegHeart } from 'react-icons/fa';
import { IoIosGitCompare } from 'react-icons/io';
import { MdOutlineShoppingCart, MdOutlineZoomOutMap } from 'react-icons/md';
import { MyContext } from '../../App';
import { FaMinus } from 'react-icons/fa6';
import { FaPlus } from 'react-icons/fa';
import { deleteData, editData, postData } from '../../utils/api';
import CircularProgress from '@mui/material/CircularProgress';
import { MdClose } from 'react-icons/md';
import { IoMdHeart } from 'react-icons/io';

const ProductsItem = (props) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isAddedInMyList, setIsAddedInMyList] = useState(false);
  const [cartItem, setCartItem] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [isShowTabs, setIsShowTabs] = useState(false);
  const [selectedTabName, setSelcetedTabName] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const context = useContext(MyContext);

  const primaryImage = props?.item?.images?.[0] || '/bannerBox1.jpg';
  const hoverImage = props?.item?.images?.[1] || primaryImage;
  const brandName = props?.item?.brand || 'B? s?u t?p';
  const productName = props?.item?.name || 'Sản phẩm nổi bật';
  const hasVariantOptions =
    props?.item?.size?.length !== 0 ||
    props?.item?.productRam?.length !== 0 ||
    props?.item?.productWeight?.length !== 0;
  const hasSizeOptions = (props?.item?.size?.length || 0) > 0;
  const isInStock = (props?.item?.countInStock || 0) > 0;
  const ratingValue = Number(props?.item?.rating || 0);
  const priceText = props?.item?.price?.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  });
  const oldPriceText = props?.item?.oldPrice?.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  });

  const optionChips = [
    ...(props?.item?.size || []),
    ...(props?.item?.productRam || []),
    ...(props?.item?.productWeight || []),
  ];

  const addToCart = (product, userId, quantity) => {
    if (!userId) {
      context?.alertBox('error', context?.t ? context.t('alertLoginRequired') : 'Vui long dang nhap');
      setIsShowTabs(false);
      setIsAdded(false);
      setActiveTab(null);
      setSelcetedTabName(null);
      setQuantity(1);
      return;
    }

    const producItem = {
      _id: product?._id,
      name: product?.name,
      image: product?.images?.[0],
      rating: product?.rating,
      price: product?.price,
      oldPrice: product?.oldPrice,
      discount: product?.discount,
      quantity,
      subTotal: parseInt(product?.price * quantity),
      countInStock: product?.countInStock,
      brand: product?.brand,
      size: props?.item?.size?.length !== 0 ? selectedTabName || '' : '',
      weight: props?.item?.productWeight?.length !== 0 ? selectedTabName || '' : '',
      ram: props?.item?.productRam?.length !== 0 ? selectedTabName || '' : '',
    };

    if (hasVariantOptions && !selectedTabName) {
      setIsShowTabs(true);
      context?.alertBox(
        'error',
        hasSizeOptions ? 'Vui lòng chọn kích thước trước' : 'Vui lòng chọn tùy chọn trước'
      );
      return;
    }

    setIsLoading(true);
    const didAdd = context?.addToCart(producItem, userId, quantity);

    if (didAdd === false) {
      setIsLoading(false);
      setIsAdded(false);
      return;
    }

    setIsAdded(true);
    setIsShowTabs(false);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const handleClickActivetab = (index, name) => {
    setActiveTab(index);
    setSelcetedTabName(name);
  };

  useEffect(() => {
    const item = context?.cartData?.filter((cartDataItem) =>
      cartDataItem.productId.includes(props?.item?._id)
    );
    const myListItem = context?.myListData?.filter((listItem) =>
      listItem.productId.includes(props?.item?._id)
    );

    if (item?.length !== 0) {
      setCartItem(item);
      setIsAdded(true);
      setQuantity(item[0]?.quantity);
    } else {
      setQuantity(1);
      setIsAdded(false);
    }

    if (myListItem?.length !== 0) {
      setIsAddedInMyList(true);
    } else {
      setIsAddedInMyList(false);
    }
  }, [context?.cartData, context?.myListData, props?.item?._id]);

  const minusQyt = () => {
    if (quantity !== 1 && quantity > 1) {
      setQuantity(quantity - 1);
    } else {
      setQuantity(1);
    }

    if (quantity === 1) {
      deleteData(`/api/cart/delete-cart-item/${cartItem[0]?._id}`).then(() => {
        setIsAdded(false);
        context.alertBox('success', 'Đã xóa sản phẩm');
        context?.getCartItems();
        setIsShowTabs(false);
        setActiveTab(null);
      });
    } else {
      const obj = {
        _id: cartItem[0]?._id,
        qty: quantity - 1,
        subTotal: props?.item?.price * (quantity - 1),
      };

      editData(`/api/cart/update-qty`, obj).then((res) => {
        context.alertBox('success', res?.data?.message);
        context?.getCartItems();
      });
    }
  };

  const addQyt = () => {
    setQuantity(quantity + 1);

    const obj = {
      _id: cartItem[0]?._id,
      qty: quantity + 1,
      subTotal: props?.item?.price * (quantity + 1),
    };

    editData(`/api/cart/update-qty`, obj).then((res) => {
      context.alertBox('success', res?.data?.message);
      context?.getCartItems();
    });
  };

  const handleAddToMyList = (item) => {
    if (context?.userData === null) {
      context?.alertBox('error', 'Bạn chưa đăng nhập, vui lòng đăng nhập trước');
      return false;
    }

    const obj = {
      productId: item?._id,
      userId: context?.userData?._id,
      productTitle: item?.name,
      image: item?.images?.[0],
      brand: item?.brand,
      rating: item?.rating,
      price: item?.price,
      oldPrice: item?.oldPrice,
      discount: item?.discount,
    };

    postData(`/api/myList/add`, obj).then((res) => {
      if (res?.error === false) {
        context?.alertBox('success', res?.message);
        setIsAddedInMyList(true);
        context?.getMyListData();
      } else {
        context?.alertBox('error', res?.message);
      }
    });
  };

  return (
    <div className="productsItem product-card product-card--enhanced overflow-hidden rounded-[22px] border border-[rgba(255,255,255,0.72)] bg-white shadow-[0_14px_30px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_42px_rgba(15,23,42,0.12)]">
      <div className="product-card__glow pointer-events-none absolute inset-x-[12%] top-0 h-[90px] rounded-full blur-3xl" />

      <div className="group imgWrapper relative overflow-hidden rounded-[22px] rounded-bl-none rounded-br-none">
        <Link to={`/product/${props?.item?._id}`}>
          <div className="img product-card__media relative h-[198px] overflow-hidden bg-[linear-gradient(180deg,#fff8f5_0%,#fff1eb_100%)] sm:h-[210px]">
            <img
              src={primaryImage}
              alt={productName}
              className="product-card__mediaImage h-full w-full object-contain transition-all duration-500 group-hover:scale-[1.03]"
            />
            <img
              src={hoverImage}
              alt={`${productName} hover`}
              className="product-card__mediaImage absolute left-0 top-0 h-full w-full object-contain opacity-0 transition-all duration-700 group-hover:scale-[1.05] group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.28),transparent_36%)]" />
            <div className="absolute inset-x-0 bottom-0 h-[58%] bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(17,24,39,0.26)_100%)]" />
            <div className="product-card__image-badge absolute bottom-[12px] left-[12px] z-40 rounded-full px-2.5 py-1 text-[10px] font-[800] uppercase tracking-[0.08em] text-white">
              {isInStock ? 'Săn sàng giao' : 'Het hang'}
            </div>
          </div>
        </Link>

        {isShowTabs === true && (
          <div className="absolute left-0 top-0 z-[60] flex h-full w-full flex-wrap items-center justify-center gap-2 bg-[rgba(17,24,39,0.72)] p-3 opacity-100 backdrop-blur-[4px]">
            <Button
              className="!absolute right-[10px] top-[10px] !h-[30px] !min-h-[30px] !w-[30px] !min-w-[30px] !rounded-full !bg-white/80 text-black"
              onClick={() => setIsShowTabs(false)}
            >
              <MdClose className="pointer-events-none text-[18px] text-black" />
            </Button>

            {optionChips.map((option, index) => (
              <span
                key={`${option}-${index}`}
                className={`flex h-[30px] min-w-[42px] cursor-pointer items-center justify-center rounded-full px-2.5 text-[11px] font-[700] transition-colors duration-200 ${
                  activeTab === index
                    ? '!bg-[#ff5252] text-white'
                    : 'bg-white/85 text-[#1f2937] hover:bg-white'
                }`}
                onClick={() => handleClickActivetab(index, option)}
              >
                {option}
              </span>
            ))}
          </div>
        )}

        <div className="absolute left-[12px] top-[12px] z-50 flex flex-wrap items-center gap-1.5">
          {props?.item?.discount && (
            <span className="discount rounded-full bg-[#1f2937] px-2.5 py-1 text-[10px] font-[800] uppercase tracking-[0.06em] text-white shadow-[0_10px_25px_rgba(17,24,39,0.18)]">
              -{props?.item?.discount}
            </span>
          )}
          {hasVariantOptions && (
            <span className="rounded-full bg-white/88 px-2.5 py-1 text-[10px] font-[800] uppercase tracking-[0.06em] text-[#7c553d] shadow-[0_10px_20px_rgba(255,255,255,0.24)]">
              Tuy chon
            </span>
          )}
        </div>

        <div className="actions absolute right-[10px] top-[10px] z-50 flex w-[34px] translate-y-2 flex-col items-center gap-1.5 opacity-100 duration-300 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
          <Button
            className="product-card__icon-btn !h-[32px] !min-w-[32px] !w-[32px] !rounded-full !bg-white/95 text-black shadow-[0_8px_18px_rgba(0,0,0,0.12)] hover:!bg-[#ff5252] hover:text-white group"
            onClick={() => context.handleOpenProductDetailsModal(true, props?.item)}
          >
            <MdOutlineZoomOutMap className="!text-black text-[15px] group-hover:text-white hover:!text-white" />
          </Button>
          <Button className="product-card__icon-btn !h-[32px] !min-w-[32px] !w-[32px] !rounded-full !bg-white/95 text-black shadow-[0_8px_18px_rgba(0,0,0,0.12)] hover:!bg-[#ff5252] hover:text-white group">
            <IoIosGitCompare className="!text-black text-[15px] group-hover:text-white hover:!text-white" />
          </Button>
          <Button
            className="product-card__icon-btn !h-[32px] !min-w-[32px] !w-[32px] !rounded-full !bg-white/95 text-black shadow-[0_8px_18px_rgba(0,0,0,0.12)] hover:!bg-[#ff5252] hover:text-white group"
            onClick={() => handleAddToMyList(props?.item)}
          >
            {isAddedInMyList === true ? (
              <IoMdHeart className="!text-[#ff5252] text-[15px] group-hover:text-white hover:!text-white" />
            ) : (
              <FaRegHeart className="!text-black text-[15px] group-hover:text-white hover:!text-white" />
            )}
          </Button>
        </div>
      </div>

      <div className="info product-card__info flex min-h-[200px] flex-col p-3">
        <div className="product-card__top mb-2 flex items-start justify-between gap-2">
          <span className="product-card__brand rounded-full px-2.5 py-1 text-[10px] font-[800] uppercase tracking-[0.08em] text-[#8a3b1f]">
            {brandName}
          </span>
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-[800] uppercase tracking-[0.08em] ${
              isInStock ? 'bg-[#eefbf3] text-[#1f8f52]' : 'bg-[#fff1f1] text-[#d14343]'
            }`}
          >
            {isInStock ? 'Con hang' : 'Het hang'}
          </span>
        </div>

        <h3 className="product-card__heading text-[13px] font-[800] leading-5 text-[#1f2937]">
          <Link
            to={`/product/${props?.item?._id}`}
            className="link product-card__title transition-all"
          >
            <span className="product-card__titleText">{productName}</span>
          </Link>
        </h3>

        <div className="product-card__ratingRow mt-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Rating
              name={`rating-${props?.item?._id}`}
              value={ratingValue}
              precision={0.5}
              size="small"
              readOnly
            />
            <span className="text-[11px] font-[700] text-[#6b7280]">({ratingValue})</span>
          </div>
          <span className="text-[10px] font-[700] text-[#8b5e3c]">Noi bat</span>
        </div>

        <div className="product-card__meta product-card__priceBlock mt-3 rounded-[18px] p-3">
          <div className="flex items-end justify-between gap-2">
            <div className="flex flex-col gap-1">
              {props?.item?.oldPrice ? (
                <span className="oldPrice text-[10px] font-[600] text-gray-400 line-through">
                  {oldPriceText}
                </span>
              ) : (
                <span className="text-[10px] font-[700] uppercase tracking-[0.06em] text-[#7c553d]">
                  Giá ưu đãi
                </span>
              )}
              <span className="price text-[15px] font-[800] leading-5 text-primary">
                {priceText}
              </span>
            </div>

            {props?.item?.discount && (
              <span className="rounded-full border border-[rgba(255,82,82,0.16)] bg-white px-2 py-1 text-[9px] font-[800] uppercase tracking-[0.06em] text-[#ff5252]">
                Ưu đãi hot
              </span>
            )}
          </div>

          <div className="mt-2 flex items-center justify-between gap-2 text-[10px] font-[700] text-[#6b7280]">
            <span>Giao nhanh</span>
            <span>Chinh hang</span>
          </div>
        </div>

        <div className="mt-auto pt-3">
          {isAdded === false ? (
            <Button
              className="bg-org product-card__cta product-card__cta--primary flex w-full gap-2"
              size="small"
              onClick={() => addToCart(props?.item, context?.userData?._id, quantity)}
            >
              <MdOutlineShoppingCart className="text-[16px]" /> Thêm
            </Button>
          ) : (
            <>
              {isLoading === true ? (
                <Button
                  className="bg-org product-card__cta product-card__cta--primary flex w-full gap-2"
                  size="small"
                >
                  <CircularProgress />
                  <MdOutlineShoppingCart className="text-[16px]" /> Thêm
                </Button>
              ) : (
                <div className="product-card__qty flex items-center justify-between overflow-hidden rounded-full border border-[rgba(255,82,82,0.14)] bg-[#fff8f5]">
                  <Button
                    className="!h-[38px] !min-w-[38px] !w-[38px] !rounded-none !bg-white"
                    onClick={minusQyt}
                  >
                    <FaMinus className="text-[rgba(0,0,0,0.7)]" />
                  </Button>
                  <span className="text-[13px] font-[800] text-[#1f2937]">{quantity}</span>
                  <Button
                    className="!h-[38px] !min-w-[38px] !w-[38px] !rounded-none !bg-[#ff5252]"
                    onClick={addQyt}
                  >
                    <FaPlus className="text-white" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsItem;
