import React, { useContext, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { MyContext } from '../../App';

const ITEM_HEIGHT = 48;

const AddressBox = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const context = useContext(MyContext);
  const addressTypeLabel = props?.address?.addressType?.trim() || 'Địa chỉ';

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const removeAddress = (id) => {
    setAnchorEl(null);
    props?.removeAddress(id);
  };

  const editAddress = (id) => {
    setAnchorEl(null);
    context.setOpenAddressPanel(true);
    context.setAddressMode('edit');
    context.setAddressId(id);
  };

  return (
    <div className="addressBox group relative w-full rounded-[24px] border border-[rgba(255,82,82,0.12)] bg-[linear-gradient(135deg,#fff8f5_0%,#ffffff_100%)] p-5 shadow-[0_12px_26px_rgba(15,23,42,0.06)]">
      <div className="mb-3 flex items-start justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex rounded-full bg-[#fff1eb] px-3 py-1 text-[11px] font-[800] uppercase tracking-[0.08em] text-[#a65434]">
            {addressTypeLabel}
          </span>
          <span className="inline-flex rounded-full bg-white px-3 py-1 text-[11px] font-[700] text-[#7c553d]">
            Địa chỉ đã lưu
          </span>
        </div>

        <div>
          <IconButton
            aria-label="Thêm tuy chon"
            id="long-button"
            aria-controls={open ? 'long-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleClick}
            className="!bg-white !border !border-[rgba(255,82,82,0.12)]"
          >
            <HiOutlineDotsVertical />
          </IconButton>

          <Menu
            id="long-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            slotProps={{
              paper: {
                style: {
                  maxHeight: ITEM_HEIGHT * 4.5,
                  width: '20ch',
                },
              },
              list: {
                'aria-labelledby': 'long-button',
              },
            }}
          >
            <MenuItem onClick={() => editAddress(props.address._id)}>Chỉnh sửa</MenuItem>
            <MenuItem onClick={() => removeAddress(props.address._id)}>Xoa</MenuItem>
          </Menu>
        </div>
      </div>

      <h4 className="flex flex-wrap items-center gap-4 text-[15px] font-[800] text-[#1f2937]">
        <span>{context?.userData?.name}</span>
        <span className="text-[13px] font-[700] text-[#6b7280]">{props?.address?.mobile}</span>
      </h4>

      <p className="mb-0 mt-3 text-[14px] leading-7 text-[#4b5563]">
        {`${props?.address?.address_line1}, ${props?.address?.city}, ${props?.address?.state}, ${props?.address?.country}, ${props?.address?.pincode}`}
      </p>
    </div>
  );
};

export default AddressBox;
