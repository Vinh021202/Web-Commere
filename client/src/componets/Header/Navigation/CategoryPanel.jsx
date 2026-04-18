import React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import { IoCloseSharp } from 'react-icons/io5';
import { RiMenu2Fill } from 'react-icons/ri';
import CategoryCollapse from '../../CategoryCollapse';

const CategoryPanel = (props) => {
  const toggleDrawer = (newOpen) => () => {
    props.setIsopenCategoryPanel(newOpen);
  };

  const DrawerList = (
    <Box
      sx={{ width: { xs: 320, sm: 360 } }}
      role="presentation"
      className="categoryPanel h-full bg-[linear-gradient(180deg,#fff_0%,#fff8f5_100%)]"
    >
      <div className="border-b border-[rgba(255,82,82,0.1)] px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="categoryPanel__heroIcon flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#1f2937] text-white shadow-[0_12px_24px_rgba(15,23,42,0.16)]">
              <RiMenu2Fill size={18} />
            </span>
            <div>
              <h3 className="categoryPanel__title m-0 text-[22px] font-[800] text-[#1f2937]">Shop By Categories</h3>
            </div>
          </div>

          <Button
            className="categoryPanel__close !min-w-[40px] !w-[40px] !h-[40px] !rounded-full !bg-white !text-[#1f2937] shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
            onClick={toggleDrawer(false)}
          >
            <IoCloseSharp className="text-[20px]" />
          </Button>
        </div>
        <p className="categoryPanel__copy mb-0 mt-4 text-[13px] leading-6 text-[#6b7280]">
          Explore departments and drill down into subcategories from one clean menu.
        </p>
      </div>

      <div className="pt-4">
        {props?.data?.length !== 0 && <CategoryCollapse data={props?.data} />}
      </div>
    </Box>
  );

  return (
    <div>
      <Drawer open={props.isopenCategoryPanel} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
};

export default CategoryPanel;
