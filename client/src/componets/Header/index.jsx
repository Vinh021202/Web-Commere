import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Search from '../Search/index';
import { IoIosGitCompare } from 'react-icons/io';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Badge, { badgeClasses } from '@mui/material/Badge';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { styled } from '@mui/material/styles';
import { FaRegHeart, FaRegUser } from 'react-icons/fa';
import Navigation from './Navigation';
import { MyContext } from '../../App';
import { IoBagCheckOutline } from 'react-icons/io5';
import { IoIosLogOut } from 'react-icons/io';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { fetchDataFromApi } from '../../utils/api';
import { FiChevronDown } from 'react-icons/fi';

const CartBadge = styled(Badge)`
  & .${badgeClasses.badge} {
    top: -10px;
    right: -5px;
  }
`;

const Header = () => {
  const context = useContext(MyContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const history = useNavigate();
  const { language, setLanguage, t } = context;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    setAnchorEl(null);

    fetchDataFromApi(`/api/user/logout?token=${localStorage.getItem('accesstoken')}`, {
      withCredentials: true,
    }).then((res) => {
      if (res?.error === false) {
        context.setIsLogin(false);
        localStorage.removeItem('accesstoken', res?.accesstoken);
        localStorage.removeItem('refreshToken', res?.refreshToken);
        context?.setUserData(null);
        context?.setCartData([]);
        context?.setMyListData([]);
        history('/');
      }
    });
  };

  const userInitial = context?.userData?.name?.charAt(0)?.toUpperCase() || 'U';

  return (
    <header className="sticky top-0 z-50 w-full bg-[linear-gradient(180deg,#fff_0%,#fff9f7_100%)] backdrop-blur-xl">
      <div className="top-strip border-b border-[rgba(255,82,82,0.1)] bg-[linear-gradient(90deg,#fff4ef_0%,#fff_100%)] py-1 text-[#1f2937]">
        <div className="container">
          <div className="flex flex-col gap-1.5 md:flex-row md:items-center md:justify-between">
            <div className="col1">
              <p className="m-0 text-[10px] font-[700] uppercase tracking-[0.08em] text-[#ff5252] sm:text-[11px]">
                {t('promoLifestyle')}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3">
              <ul className="flex items-center gap-3">
                <li className="list-none">
                  <Link to="/help-center" className="text-[12px] font-[500] link md:text-[13px]">
                    {t('helpCenter')}
                  </Link>
                </li>
                <li className="list-none">
                  <Link to="/order-tracking" className="text-[12px] font-[500] link md:text-[13px]">
                    {t('orderTracking')}
                  </Link>
                </li>
              </ul>

              <div className="flex items-center gap-1 rounded-full border border-[rgba(255,82,82,0.14)] bg-white px-1 py-1 shadow-[0_8px_18px_rgba(15,23,42,0.06)]">
                <button
                  type="button"
                  onClick={() => setLanguage('vi')}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-[800] transition ${
                    language === 'vi' ? 'bg-[#ff5252] text-white' : 'text-[#1f2937]'
                  }`}
                >
                  VN
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-[800] transition ${
                    language === 'en' ? 'bg-[#ff5252] text-white' : 'text-[#1f2937]'
                  }`}
                >
                  EN
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-[rgba(255,82,82,0.12)] bg-[linear-gradient(180deg,#fff_0%,#fff9f7_100%)] py-2 md:py-2.5">
        <div className="container flex flex-col gap-2 xl:grid xl:grid-cols-[auto_minmax(240px,1fr)_auto] xl:items-center xl:gap-2.5">
          <div className="logo flex items-center gap-2 md:gap-2.5">
            <Link to="/">
              <img
                src="/logo.png"
                alt="logo"
                className="h-[38px] w-[112px] rounded-[12px] object-cover shadow-[0_8px_18px_rgba(15,23,42,0.1)] sm:h-[46px] sm:w-[126px] md:h-[56px] md:w-[152px]"
              />
            </Link>
            <div className="hidden 2xl:block">
              <p className="mb-1 text-[10px] font-[700] uppercase tracking-[0.2em] text-[#ff5252]">
                {t('shoppingExperience')}
              </p>
              <h2 className="text-[16px] font-[800] leading-tight text-[#1f2937]">
                {t('shoppingExperienceSub')}
              </h2>
            </div>
          </div>

          <Search />

          <div className="col3 flex flex-wrap items-center justify-start gap-2 xl:flex-nowrap xl:justify-end">
            {context.islogin === false ? (
              <div className="flex items-center gap-2 rounded-full border border-[rgba(255,82,82,0.14)] bg-white px-3 py-1.5 shadow-[0_8px_18px_rgba(15,23,42,0.06)] sm:px-3.5 sm:py-2">
                <Link
                  to="/login"
                  className="text-[12px] font-[700] text-[#1f2937] transition hover:text-[#ff5252] sm:text-[13px]"
                >
                  {t('login')}
                </Link>
                <span className="text-[12px] font-[600] text-gray-400">/</span>
                <Link
                  to="/Register"
                  className="text-[12px] font-[700] text-[#1f2937] transition hover:text-[#ff5252] sm:text-[13px]"
                >
                  {t('register')}
                </Link>
              </div>
            ) : (
              <>
                <Button
                  className="myAccountWrap !rounded-full !border !border-[rgba(255,82,82,0.14)] !bg-white !px-1.5 !py-1.5 !text-[#000] shadow-[0_8px_18px_rgba(15,23,42,0.06)]"
                  onClick={handleClick}
                >
                  <div className="myAccountWrap__avatar">
                    {context?.userData?.name ? (
                      <span className="myAccountWrap__avatarText">{userInitial}</span>
                    ) : (
                      <FaRegUser className="text-[13px] text-[#ff5252]" />
                    )}
                  </div>

                  <div className="info hidden sm:flex sm:flex-col sm:pr-1">
                    <h4 className="mb-1 mt-1 text-left text-[11px] font-[700] capitalize leading-3 text-[#1f2937] md:text-[12px]">
                      {context?.userData?.name}
                    </h4>
                    <span className="text-left text-[10px] font-[500] text-[rgba(31,41,55,0.62)]">
                      {context?.userData?.email}
                    </span>
                  </div>

                  <span className="myAccountWrap__chevron hidden sm:inline-flex">
                    <FiChevronDown className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
                  </span>
                </Button>

                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={open}
                  onClose={handleClose}
                  onClick={handleClose}
                  slotProps={{
                    paper: {
                      elevation: 0,
                      sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        '&::before': {
                          content: '""',
                          display: 'block',
                          position: 'absolute',
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: 'background.paper',
                          transform: 'translateY(-50%) rotate(45deg)',
                          zIndex: 0,
                        },
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <div className="account-menu__hero">
                    <div className="account-menu__heroAvatar">{userInitial}</div>
                    <div className="account-menu__heroInfo">
                      <h4>{context?.userData?.name}</h4>
                      <p>{context?.userData?.email}</p>
                    </div>
                  </div>

                  <Link to="/my-account" className="block w-full">
                    <MenuItem onClick={handleClose} className="account-menu__item">
                      <span className="account-menu__itemIcon">
                        <FaRegUser className="text-[16px]" />
                      </span>
                      <span className="account-menu__itemText">
                        <strong>{t('myAccount')}</strong>
                      </span>
                    </MenuItem>
                  </Link>
                  <Link to="/my-orders" className="block w-full">
                    <MenuItem onClick={handleClose} className="account-menu__item">
                      <span className="account-menu__itemIcon">
                        <IoBagCheckOutline className="text-[16px]" />
                      </span>
                      <span className="account-menu__itemText">
                        <strong>{t('myOrders')}</strong>
                      </span>
                    </MenuItem>
                  </Link>
                  <Link to="/my-list" className="block w-full">
                    <MenuItem onClick={handleClose} className="account-menu__item">
                      <span className="account-menu__itemIcon">
                        <FaRegHeart className="text-[16px]" />
                      </span>
                      <span className="account-menu__itemText">
                        <strong>{t('wishlist')}</strong>
                      </span>
                    </MenuItem>
                  </Link>
                  <MenuItem onClick={logout} className="account-menu__item account-menu__item--logout">
                    <span className="account-menu__itemIcon">
                      <IoIosLogOut className="text-[16px]" />
                    </span>
                    <span className="account-menu__itemText">
                      <strong>{t('logout')}</strong>
                      <small>{t('logoutHint')}</small>
                    </span>
                  </MenuItem>
                </Menu>
              </>
            )}

            <IconButton className="!h-[34px] !min-w-[34px] !w-[34px] sm:!h-[38px] sm:!min-w-[38px] sm:!w-[38px] !rounded-full !border !border-[rgba(255,82,82,0.14)] !bg-white hover:!bg-[#fff4ef]">
              <IoIosGitCompare size={15} className="text-gray-700" />
              <CartBadge badgeContent={5} color="primary" overlap="circular" />
            </IconButton>

            <Link to="/my-list">
              <IconButton className="!h-[34px] !min-w-[34px] !w-[34px] sm:!h-[38px] sm:!min-w-[38px] sm:!w-[38px] !rounded-full !border !border-[rgba(255,82,82,0.14)] !bg-white hover:!bg-[#fff4ef]">
                <FaRegHeart size={15} className="text-gray-700" />
                <CartBadge
                  badgeContent={context?.myListData?.length !== 0 ? context?.myListData?.length : 0}
                  color="primary"
                  overlap="circular"
                />
              </IconButton>
            </Link>

            <IconButton
              className="!h-[34px] !min-w-[34px] !w-[34px] sm:!h-[38px] sm:!min-w-[38px] sm:!w-[38px] !rounded-full !border !border-[rgba(255,82,82,0.14)] !bg-white hover:!bg-[#fff4ef]"
              onClick={() => context.setOpenCartPanel(true)}
            >
              <AiOutlineShoppingCart size={15} className="text-gray-700" />
              <CartBadge
                badgeContent={context?.cartData?.length !== 0 ? context?.cartData?.length : 0}
                color="primary"
                overlap="circular"
              />
            </IconButton>
          </div>
        </div>
      </div>

      <Navigation />
    </header>
  );
};

export default Header;
