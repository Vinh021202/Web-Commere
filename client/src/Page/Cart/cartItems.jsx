import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { IoCloseSharp } from 'react-icons/io5';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { GoTriangleDown } from 'react-icons/go';
import { Rating } from '@mui/material';
import { deleteData, editData, fetchDataFromApi } from '../../utils/api';
import { MyContext } from '../../App';

const CartItems = (props) => {
  const [sizeAnchorEl, setSizeAnchorEl] = useState(null);
  const [selectedSize, setSelectedSize] = useState(props?.item?.size || '');
  const openSize = Boolean(sizeAnchorEl);

  const [ramAnchorEl, setRamAnchorEl] = useState(null);
  const [selectedRam, setSelectedRam] = useState(props?.item?.ram || '');
  const openRam = Boolean(ramAnchorEl);

  const [weightAnchorEl, setWeightAnchorEl] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState(props?.item?.weight || '');
  const openWeight = Boolean(weightAnchorEl);

  const [qtyAnchorEl, setQtyAnchorEl] = useState(null);
  const [selectedQty, setSelectedQty] = useState(props?.item?.quantity || 1);
  const openQty = Boolean(qtyAnchorEl);

  const context = useContext(MyContext);
  const item = props?.item;
  const itemSubtotal = Number(item?.price || 0) * Number(selectedQty || 0);

  const hasValue = (val) => val && val !== '' && val !== ' ';

  const handleClickSize = (event) => setSizeAnchorEl(event.currentTarget);
  const handleCloseSize = (value) => {
    setSizeAnchorEl(null);
    if (value !== null) setSelectedSize(value);
  };

  const handleClickRam = (event) => setRamAnchorEl(event.currentTarget);
  const handleCloseRam = (value) => {
    setRamAnchorEl(null);
    if (value !== null) setSelectedRam(value);
  };

  const handleClickWeight = (event) => setWeightAnchorEl(event.currentTarget);
  const handleCloseWeight = (value) => {
    setWeightAnchorEl(null);
    if (value !== null) setSelectedWeight(value);
  };

  const handleClickQty = (event) => setQtyAnchorEl(event.currentTarget);
  const handleCloseQty = (value) => {
    setQtyAnchorEl(null);
    if (value !== null) {
      setSelectedQty(value);
      const cartObj = {
        _id: item?._id,
        qty: value,
        subTotal: item?.price * value,
      };
      editData(`/api/cart/update-qty`, cartObj).then((res) => {
        if (res?.data?.error === false) {
          context.alertBox('success', res?.data?.message);
          context?.getCartItems();
        }
      });
    }
  };

  const updateCart = async (type, selectedVal, qty, field) => {
    const cartObj = {
      _id: item?._id,
      qty,
      subTotal: item?.price * qty,
      size: type === 'size' ? selectedVal : item?.size || '',
      weight: type === 'weight' ? selectedVal : item?.weight || '',
      ram: type === 'ram' ? selectedVal : item?.ram || '',
    };

    if (field === 'size') {
      const res = await fetchDataFromApi(`/api/product/${item?.productId}`);
      const product = res?.product;
      const matchedSize = product?.size?.filter((size) => size?.includes(selectedVal));

      if (matchedSize?.length !== 0) {
        const updateRes = await editData(`/api/cart/update-qty`, cartObj);
        if (updateRes?.data?.error === false) {
          context.alertBox('success', updateRes?.data?.message);
          context?.getCartItems();
        }
      } else {
        context.alertBox('error', `Product not avilable with the size of ${selectedVal}`);
      }
    }

    if (field === 'ram') {
      const res = await fetchDataFromApi(`/api/product/${item?.productId}`);
      const product = res?.product;
      const matchedSize = product?.productRam?.filter((ram) => ram?.includes(selectedVal));

      if (matchedSize?.length !== 0) {
        const updateRes = await editData(`/api/cart/update-qty`, cartObj);
        if (updateRes?.data?.error === false) {
          context.alertBox('success', updateRes?.data?.message);
          context?.getCartItems();
        }
      } else {
        context.alertBox('error', `Product not avilable with the ram of ${selectedVal}`);
      }
    }

    if (field === 'weight') {
      const res = await fetchDataFromApi(`/api/product/${item?.productId}`);
      const product = res?.product;
      const matchedSize = product?.productWeight?.filter((weight) => weight?.includes(selectedVal));

      if (matchedSize?.length !== 0) {
        const updateRes = await editData(`/api/cart/update-qty`, cartObj);
        if (updateRes?.data?.error === false) {
          context.alertBox('success', updateRes?.data?.message);
          context?.getCartItems();
        }
      } else {
        context.alertBox('error', `Product not avilable with the weight of ${selectedVal}`);
      }
    }
  };

  const removeItem = (id) => {
    deleteData(`/api/cart/delete-cart-item/${id}`).then(() => {
      context.alertBox('success', 'Product removed from cart');
      context?.getCartItems();
    });
  };

  const chipClass =
    'inline-flex cursor-pointer items-center justify-center gap-1 rounded-full border border-[rgba(255,82,82,0.14)] bg-white px-3 py-[9px] text-[11px] font-[800] text-[#7c553d] shadow-[0_8px_16px_rgba(15,23,42,0.04)]';

  return (
    <div className="soft-card mb-4 overflow-hidden p-4 md:p-5 last:mb-0">
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="w-full lg:w-[18%]">
          <div className="overflow-hidden rounded-[22px] bg-[#fff4ef]">
            <Link to={`/product/${item?.productId}`} className="group block">
              <img
                src={item?.image}
                alt={item?.productTitle || 'Product'}
                className="h-[180px] w-full object-cover transition-all duration-300 group-hover:scale-105 lg:h-[150px]"
              />
            </Link>
          </div>
        </div>

        <div className="w-full lg:w-[82%]">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="max-w-[620px]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#fff1eb] px-3 py-1 text-[10px] font-[800] uppercase tracking-[0.12em] text-[#a65434]">
                  {item?.brand || 'Brand'}
                </span>
                {item?.discount ? (
                  <span className="rounded-full bg-[#eefbf3] px-3 py-1 text-[10px] font-[800] uppercase tracking-[0.12em] text-[#1f8f52]">
                    {item?.discount}% off
                  </span>
                ) : null}
              </div>

              <h3 className="mt-3 text-[20px] font-[800] leading-[1.3] text-[#201714]">
                <Link to={`/product/${item?.productId}`} className="link">
                  {item?.productTitle}
                </Link>
              </h3>

              <div className="mt-2 flex flex-wrap items-center gap-3">
                <Rating name="size-small" value={item?.rating} size="small" readOnly />
                <span className="text-[12px] font-[700] text-[rgba(31,41,55,0.55)]">
                  Ready to ship
                </span>
              </div>
            </div>

            <button
              type="button"
              className="flex h-[42px] w-[42px] items-center justify-center self-start rounded-full border border-[rgba(255,82,82,0.16)] bg-white text-[#7c553d] transition-all hover:border-[#ff5252] hover:bg-[#fff1eb] hover:text-[#ff5252]"
              onClick={() => removeItem(item?._id)}
              aria-label="Remove item"
            >
              <IoCloseSharp className="text-[20px]" />
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {hasValue(item?.size) && props?.productSizeData?.length > 0 && (
              <div className="relative">
                <span className={chipClass} onClick={handleClickSize}>
                  Size: {selectedSize} <GoTriangleDown />
                </span>
                <Menu
                  id="size-menu"
                  anchorEl={sizeAnchorEl}
                  open={openSize}
                  onClose={() => handleCloseSize(null)}
                >
                  {props.productSizeData.map((sizeItem, index) => (
                    <MenuItem
                      key={index}
                      className={`${sizeItem?.name === selectedSize ? 'selected' : ''}`}
                      onClick={() => {
                        handleCloseSize(sizeItem?.name);
                        updateCart('size', sizeItem?.name, selectedQty, 'size');
                      }}
                    >
                      {sizeItem?.name}
                    </MenuItem>
                  ))}
                </Menu>
              </div>
            )}

            {hasValue(item?.ram) && props?.productRamsData?.length > 0 && (
              <div className="relative">
                <span className={chipClass} onClick={handleClickRam}>
                  RAM: {selectedRam} <GoTriangleDown />
                </span>
                <Menu
                  id="ram-menu"
                  anchorEl={ramAnchorEl}
                  open={openRam}
                  onClose={() => handleCloseRam(null)}
                >
                  {props.productRamsData.map((ramItem, index) => (
                    <MenuItem
                      key={index}
                      className={`${ramItem?.name === selectedRam ? 'selected' : ''}`}
                      onClick={() => {
                        handleCloseRam(ramItem?.name);
                        updateCart('ram', ramItem?.name, selectedQty, 'ram');
                      }}
                    >
                      {ramItem?.name}
                    </MenuItem>
                  ))}
                </Menu>
              </div>
            )}

            {hasValue(item?.weight) && props?.productWeightData?.length > 0 && (
              <div className="relative">
                <span className={chipClass} onClick={handleClickWeight}>
                  Weight: {selectedWeight} <GoTriangleDown />
                </span>
                <Menu
                  id="weight-menu"
                  anchorEl={weightAnchorEl}
                  open={openWeight}
                  onClose={() => handleCloseWeight(null)}
                >
                  {props.productWeightData.map((weightItem, index) => (
                    <MenuItem
                      key={index}
                      className={`${weightItem?.name === selectedWeight ? 'selected' : ''}`}
                      onClick={() => {
                        handleCloseWeight(weightItem?.name);
                        updateCart('weight', weightItem?.name, selectedQty, 'weight');
                      }}
                    >
                      {weightItem?.name}
                    </MenuItem>
                  ))}
                </Menu>
              </div>
            )}

            <div className="relative">
              <span className={chipClass} onClick={handleClickQty}>
                Qty: {selectedQty} <GoTriangleDown />
              </span>
              <Menu
                id="qty-menu"
                anchorEl={qtyAnchorEl}
                open={openQty}
                onClose={() => handleCloseQty(null)}
                slotProps={{
                  list: {
                    'aria-labelledby': 'basic-button',
                  },
                }}
              >
                {Array.from({ length: 10 }).map((_, index) => (
                  <MenuItem key={index} onClick={() => handleCloseQty(index + 1)}>
                    {index + 1}
                  </MenuItem>
                ))}
              </Menu>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[22px] border border-[rgba(255,82,82,0.12)] bg-[#fff8f5] px-4 py-3">
              <span className="block text-[11px] font-[800] uppercase tracking-[0.08em] text-[rgba(31,41,55,0.55)]">
                Original price
              </span>
              <span className="mt-2 block text-[14px] font-[700] text-gray-400 line-through">
                {Number(item?.oldPrice || 0).toLocaleString('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                  minimumFractionDigits: 0,
                })}
              </span>
            </div>

            <div className="rounded-[22px] border border-[rgba(255,82,82,0.12)] bg-white px-4 py-3">
              <span className="block text-[11px] font-[800] uppercase tracking-[0.08em] text-[rgba(31,41,55,0.55)]">
                Unit price
              </span>
              <span className="text-primary mt-2 block text-[18px] font-[800]">
                {Number(item?.price || 0).toLocaleString('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                  minimumFractionDigits: 0,
                })}
              </span>
            </div>

            <div className="rounded-[22px] border border-[rgba(255,82,82,0.16)] bg-[linear-gradient(135deg,#fff1eb_0%,#ffffff_100%)] px-4 py-3">
              <span className="block text-[11px] font-[800] uppercase tracking-[0.08em] text-[rgba(31,41,55,0.55)]">
                Subtotal
              </span>
              <span className="text-primary mt-2 block text-[18px] font-[800]">
                {itemSubtotal.toLocaleString('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                  minimumFractionDigits: 0,
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
