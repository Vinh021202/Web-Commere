// import Link from 'next/link'
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Search from '../Search/index';
import { IoIosGitCompare } from 'react-icons/io';
import { Button } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Badge, { badgeClasses } from '@mui/material/Badge';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { styled } from '@mui/material/styles';
import { FaRegHeart } from 'react-icons/fa';
import Navigation from './Navigation';
import { MyContext } from '../../App';
// import Nav from './nav';

const CartBadge = styled(Badge)`
  & .${badgeClasses.badge} {
    top: -12px;
    right: -6px;
  }
`;

const Header = () => {
  const context = useContext(MyContext);

  return (
    <>
      <header className="bg-white">
        <div className="top-strip py-2 border-t-[1px] border-gray-250  border-b-[1px] ">
          <div className="container">
            <div className="flex items-center justify-between">
              <div className="col1 w-[50%]">
                <p className="text-[13px] font-[500]">
                  Get up to 50% off new season styles, limited time only
                </p>
              </div>
              <div className="col2 flex items-center justify-end">
                <ul className="flex items-center gap-3">
                  <li className="list-none">
                    <Link to="/help-center" className="text-[13px] link font-[500] transform">
                      Help Center
                    </Link>
                  </li>
                  <li className="list-none">
                    <Link to="/order-tracking" className="text-[13px] link font-[500] transform">
                      Order Tracking
                    </Link>
                  </li>
                  {/* <li className='list-none'>
                                    <Link to="help-center" className='text-[13px] link font-[500] transform'>Help Center</Link>
                                </li>
                                 <li className='list-none'>
                                    <Link to="help-center" className='text-[13px] link font-[500] transform'>Help Center</Link>
                                </li> */}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="top-strip py-2 border-b-[1px] border-gray-250 ">
          <div className="container flex items-center justify-between">
            <div className="logo">
              <Link to={'/'}>
                <img src="/logo1.jpg" alt="logo" className="w-[220px] h-[85px]" />
              </Link>
            </div>
            <Search />

            <div className="col3 flex items-center justify-end gap-5">
              <div className="flex items-center gap-2">
                <Link to="/login" className=" link transition text-[15px] font-[500]">
                  Login
                </Link>
                <span className="text-[15px] font-[600] text-gray-600">|</span>
                <Link to="/Register" className="link transition text-[15px] font-[500]">
                  Register
                </Link>
              </div>

              <IconButton className="!min-w-[45px] !w-[45px] !h-[45px] !rounded-full !bg-gray-100 hover:!bg-gray-200">
                <IoIosGitCompare size={20} className="text-gray-700" />
                <CartBadge badgeContent={5} color="primary" overlap="circular" />
              </IconButton>

              <IconButton className="!min-w-[45px] !w-[45px] !h-[45px] !rounded-full !bg-gray-100 hover:!bg-gray-200">
                <FaRegHeart size={20} className="text-gray-700" />
                <CartBadge badgeContent={5} color="primary" overlap="circular" />
              </IconButton>

              <IconButton
                className="!min-w-[45px] !w-[45px] !h-[45px] !rounded-full !bg-gray-100 hover:!bg-gray-200"
                onClick={() => context.setOpenCartPanel(true)}
              >
                <AiOutlineShoppingCart size={20} className="text-gray-700" />
                <CartBadge badgeContent={5} color="primary" overlap="circular" />
              </IconButton>

              {/* <Button className='!min-w-[45px] !w-[45px] !h-[45px] !rounded-full !bg-gray-100 hover:!bg-gray-200 !text-gray-800'>
              <IoIosGitCompare size={20} className='text-gray-700' />
              <span className='text-[12px] flex items-center justify-center w-[20px] h-[20px]
               rounded-full bg-primary absolute -top-[5px] -right-[5px] text-white'>5</span>  
            </Button> */}
            </div>
          </div>
        </div>

        <Navigation />
      </header>
    </>
  );
};

export default Header;
