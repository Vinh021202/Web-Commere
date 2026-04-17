import React, { useContext, useEffect, useState } from 'react';
import { IoMdCloudUpload } from 'react-icons/io';
import { FaRegUser } from 'react-icons/fa';
import { FaRegHeart } from 'react-icons/fa';
import { IoIosLogOut } from 'react-icons/io';
import { NavLink, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { MyContext } from '../../App';
import CircularProgress from '@mui/material/CircularProgress';
import { fetchDataFromApi, uploadImage } from '../../utils/api';
import { LuMapPinCheck } from 'react-icons/lu';
import { LuMapPin } from 'react-icons/lu';

const AccountSidebar = () => {
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const context = useContext(MyContext);
  const history = useNavigate();
  const navigationItems = [
    { to: '/my-account', label: 'My Profile', icon: <FaRegUser className="text-[15px]" />, end: true },
    { to: '/address', label: 'Address', icon: <LuMapPin className="text-[17px]" /> },
    { to: '/my-list', label: 'My List', icon: <FaRegHeart className="text-[17px]" /> },
    { to: '/my-orders', label: 'My Orders', icon: <LuMapPinCheck className="text-[17px]" /> },
  ];

  useEffect(() => {
    if (context?.userData?.avatar !== '' && context?.userData?.avatar !== undefined) {
      setPreviews([context?.userData?.avatar]);
    }
  }, [context?.userData]);

  const onChangeFile = async (e) => {
    try {
      const files = e.target.files;

      if (!files || files.length === 0) return;

      // Validate file type
      const file = files[0];
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        context.alertBox('error', 'Please select a valid JPG, PNG or WEBP image file');
        return;
      }

      setUploading(true);
      setPreviews([]);

      // ✅ field name 'avatar' khớp với backend multer
      const formData = new FormData();
      formData.append('avatar', file);

      uploadImage('/api/user/user-avatar', formData)
        .then((res) => {
          setUploading(false);
          // ✅ backend trả { avatar, _id, success }
          if (res?.avatar) {
            setPreviews([res.avatar]);
            // ✅ update context để toàn app cập nhật avatar
            context.setUserData((prev) => ({
              ...prev,
              avatar: res.avatar,
            }));
            context.alertBox('success', 'Avatar updated successfully');
          } else {
            context.alertBox('error', 'Upload failed');
          }
        })
        .catch(() => {
          setUploading(false);
          context.alertBox('error', 'Upload failed');
        });
    } catch (error) {
      console.log(error);
      setUploading(false);
    }
  };

  const handleLogout = () => {
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

  return (
    <>
      <div className="account-sidebar soft-card overflow-hidden rounded-[32px]">
        <div className="account-sidebar__hero relative w-full overflow-hidden border-b border-[rgba(255,82,82,0.10)] p-6">
          <div className="account-sidebar__hero-glow pointer-events-none absolute right-[-40px] top-[-30px] h-[140px] w-[140px] rounded-full" />
          <div className="relative flex flex-col items-center justify-center">
            <span className="account-sidebar__eyebrow mb-4">Account hub</span>
          <div
            className="account-sidebar__avatar w-[118px] h-[118px] rounded-full overflow-hidden mb-4 relative group 
            flex items-center justify-center bg-gray-200 border border-[rgba(255,82,82,0.14)] shadow-[0_18px_35px_rgba(15,23,42,0.08)]"
          >
            {uploading ? (
              <CircularProgress color="inherit" />
            ) : (
              <>
                {previews?.length > 0 ? (
                  <img src={previews[0]} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <img
                    src="/user.jpg"
                    alt="default avatar"
                    className="w-full h-full object-cover"
                  />
                )}
              </>
            )}

            {/* Upload overlay */}
            <div
              className="overlay w-full h-full absolute top-0 left-0 z-50 bg-[rgba(0,0,0,0.7)] 
              flex items-center justify-center cursor-pointer opacity-0 transition-all group-hover:opacity-100"
            >
              <IoMdCloudUpload className="text-white text-[25px]" />
              <input
                type="file"
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={onChangeFile}
                name="avatar"
              />
            </div>
          </div>

            <h3 className="text-center text-[19px] font-[800] text-[#1f2937]">{context?.userData?.name}</h3>
            <h6 className="text-center text-[13px] font-[500] text-gray-500">{context?.userData?.email}</h6>
            <span className="account-sidebar__status mt-4">Profile active</span>
          </div>
        </div>

        <div className="bg-white p-4">
          <div className="mb-3 px-2">
            <span className="listing-stat__label">Navigation</span>
          </div>
          <ul className="list-none space-y-2 myAccountTabs">
            {navigationItems.map((item) => (
              <li className="w-full" key={item.to}>
                <NavLink to={item.to} end={item.end}>
                  <Button
                    className="account-sidebar__nav-btn w-full !justify-start !rounded-[20px] !px-4 !py-3 !text-left !capitalize flex items-center gap-3"
                  >
                    <span className="account-sidebar__nav-icon">{item.icon}</span>
                    <span>{item.label}</span>
                  </Button>
                </NavLink>
              </li>
            ))}

            <li className="w-full pt-2">
              <Button
                className="account-sidebar__logout w-full !justify-start !rounded-[20px] !px-4 !py-3 !text-left !capitalize flex items-center gap-3"
                onClick={handleLogout}
              >
                <span className="account-sidebar__nav-icon">
                  <IoIosLogOut className="text-[18px]" />
                </span>
                <span>Logout</span>
              </Button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default AccountSidebar;
