import Button from '@mui/material/Button';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import TextField from '@mui/material/TextField';
import AccountSidebar from '../../componets/AccountSidebar';
import { MyContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import { editData, postData } from '../../utils/api';
import CircularProgress from '@mui/material/CircularProgress';
import { Collapse } from 'react-collapse';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

const MyAccount = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isChangePasswordFromShow, setIsChangePasswordFromShow] = useState(false);
  const [phone, setPhone] = useState('');

  const [formFields, setFormFields] = useState({
    name: '',
    email: '',
    mobile: '',
  });

  const [changePassword, setChangePassword] = useState({
    email: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const context = useContext(MyContext);
  const history = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accesstoken');
    if (token === null) history('/');
  }, [context?.islogin, history]);

  const onChangeProfileInput = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const onChangePasswordInput = (e) => {
    const { name, value } = e.target;
    setChangePassword((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (context?.userData?._id) {
      setUserId(context?.userData?._id);
      setFormFields({
        email: context?.userData?.email || '',
        mobile: context?.userData?.mobile || '',
        name: context?.userData?.name || '',
      });
      setPhone(`${context?.userData?.mobile || ''}`);
      setChangePassword((prev) => ({
        ...prev,
        email: context?.userData?.email || '',
      }));
    }
  }, [context?.userData]);

  const valideValue = Object.values(formFields).every((el) => el);

  const accountSummary = useMemo(() => {
    if (!context?.userData?.name) {
      return 'Quản lý thông tin tài khoản, bảo mật và thông tin liên hệ trong một bố cục gọn gàng hơn.';
    }

    return `${context.userData.name}, cập nhật nhanh thông tin cá nhân và bảo mật tài khoản ngay tại đây.`;
  }, [context?.userData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formFields.name) {
      context.alertBox('error', 'Vui lòng nhập họ tên');
      setIsLoading(false);
      return;
    }
    if (!formFields.email) {
      context.alertBox('error', 'Vui lòng nhập email');
      setIsLoading(false);
      return;
    }
    if (!formFields.mobile) {
      context.alertBox('error', 'Vui lòng nhập số điện thoại');
      setIsLoading(false);
      return;
    }

    editData(`/api/user/${userId}`, formFields, { withCredentials: true }).then((res) => {
      if (res?.error !== true) {
        setIsLoading(false);
        context.alertBox('success', res?.data?.message);
        context.setIsLogin(true);
      } else {
        context.alertBox('error', res?.data?.message || 'Đã có lỗi xảy ra');
        setIsLoading(false);
      }
    });
  };

  const handleSubmitChangePassword = (e) => {
    e.preventDefault();
    setIsLoading2(true);

    if (context?.userData?.signUpWithGoogle === false && !changePassword.oldPassword) {
      context.alertBox('error', 'Vui lòng nhập mật khẩu cũ');
      setIsLoading2(false);
      return;
    }
    if (!changePassword.newPassword) {
      context.alertBox('error', 'Vui lòng nhập mật khẩu mới');
      setIsLoading2(false);
      return;
    }
    if (!changePassword.confirmPassword) {
      context.alertBox('error', 'Vui lòng xác nhận mật khẩu mới');
      setIsLoading2(false);
      return;
    }
    if (changePassword.confirmPassword !== changePassword.newPassword) {
      context.alertBox('error', 'Mật khẩu mới và mật khẩu xác nhận không trùng khớp');
      setIsLoading2(false);
      return;
    }

    postData(`/api/user/reset-password`, changePassword)
      .then((res) => {
        setIsLoading2(false);
        if (res?.error !== true) {
          context.alertBox('success', res?.message);
          setChangePassword((prev) => ({
            ...prev,
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
          }));
        } else {
          context.alertBox('error', res?.message || 'Đã có lỗi xảy ra');
        }
      })
      .catch(() => {
        setIsLoading2(false);
        context.alertBox('error', 'Đã có lỗi xảy ra');
      });
  };

  return (
    <section className="pb-10 pt-[220px] md:pt-[240px] xl:pt-[260px]">
      <div className="container">
        <div className="section-shell overflow-hidden px-4 py-6 md:px-8 md:py-8">
          <div className="absolute inset-y-0 right-0 hidden w-[34%] bg-[radial-gradient(circle_at_top_right,rgba(255,82,82,0.12),transparent_58%)] lg:block" />

          <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-[760px]">
              <span className="eyebrow">Tài khoản của tôi</span>
              <h1 className="section-heading mt-4 max-w-[700px]">
                Không gian quản lý tài khoản được sắp xếp gọn, rõ và dễ cập nhật hơn.
              </h1>
              <p className="muted-copy mt-4 max-w-[620px] text-[15px] leading-7">
                {accountSummary}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="listing-chip">Thông tin cá nhân</span>
                <span className="listing-chip">Bảo mật tài khoản</span>
                <span className="listing-chip">Avatar và liên hệ</span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[460px]">
              <div className="soft-card p-4">
                <span className="listing-stat__label">Họ tên</span>
                <strong className="listing-stat__value !text-[1.1rem]">
                  {context?.userData?.name || '--'}
                </strong>
              </div>
              <div className="soft-card p-4">
                <span className="listing-stat__label">Email</span>
                <strong className="listing-stat__value !text-[1.1rem]">
                  {context?.userData?.email ? 'Đã Liên kết' : '--'}
                </strong>
              </div>
              <div className="soft-card p-4">
                <span className="listing-stat__label">Bảo mật</span>
                <strong className="listing-stat__value !text-[1.1rem]">
                  {isChangePasswordFromShow ? 'Đang sửa' : 'Ổn định'}
                </strong>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)]">
          <div className="xl:sticky xl:top-[160px] xl:self-start">
            <AccountSidebar />
          </div>

          <div className="flex flex-col gap-5">
            <div className="section-shell overflow-hidden px-4 py-4 md:px-6 md:py-6">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="listing-stat__label">Cài đặt hồ sơ</span>
                  <h2 className="mt-2 text-[24px] font-[800] text-[#1f2937]">Hồ sơ của tôi</h2>
                </div>
                <Button
                  className={`!rounded-full !px-5 !py-2 !text-[13px] !font-[800] !capitalize ${
                    isChangePasswordFromShow
                      ? '!bg-[#ff5252] !text-white'
                      : '!border !border-[rgba(255,82,82,0.16)] !bg-white !text-[#1f2937]'
                  }`}
                  onClick={() => setIsChangePasswordFromShow(!isChangePasswordFromShow)}
                >
                  {isChangePasswordFromShow ? 'Ẩn form mật khẩu' : 'Đổi mật khẩu'}
                </Button>
              </div>

              <form className="mt-2" onSubmit={handleSubmit}>
                <div className="grid gap-4 md:grid-cols-2">
                  <TextField
                    type="text"
                    label="Họ tên"
                    variant="outlined"
                    size="small"
                    className="w-full"
                    name="name"
                    value={formFields.name}
                    onChange={onChangeProfileInput}
                    disabled={isLoading}
                  />

                  <TextField
                    type="email"
                    label="Email"
                    variant="outlined"
                    size="small"
                    className="w-full"
                    name="email"
                    value={formFields.email}
                    disabled={true}
                  />
                </div>

                <div className="mt-4 max-w-[420px]">
                  <PhoneInput
                    defaultCountry="vn"
                    value={phone}
                    disabled={isLoading}
                    onChange={(phoneValue) => {
                      setPhone(phoneValue);
                      setFormFields((prev) => ({ ...prev, mobile: phoneValue }));
                    }}
                  />
                </div>

                <div className="mt-6 flex items-center">
                  <Button
                    type="submit"
                    disabled={!valideValue}
                    className="bg-org product-card__cta product-card__cta--primary !px-6"
                    sx={{ width: '190px', height: '46px', fontSize: '14px', whiteSpace: 'nowrap' }}
                  >
                    {isLoading ? <CircularProgress color="inherit" /> : 'Cập nhật hồ sơ'}
                  </Button>
                </div>
              </form>
            </div>

            <Collapse isOpened={isChangePasswordFromShow}>
              <div className="section-shell overflow-hidden px-4 py-4 md:px-6 md:py-6">
                <div className="mb-5">
                  <span className="listing-stat__label">Bảo mật</span>
                  <h2 className="mt-2 text-[24px] font-[800] text-[#1f2937]">Đổi mật khẩu</h2>
                  <p className="mb-0 mt-2 text-[14px] leading-7 text-[#6b7280]">
                    Cập nhật mật khẩu mới để tăng bảo mật cho tài khoản của bạn.
                  </p>
                </div>

                <form className="mt-2" onSubmit={handleSubmitChangePassword}>
                  <div className="grid gap-4 md:grid-cols-2">
                    {context?.userData?.signUpWithGoogle === false && (
                      <TextField
                        type="password"
                        label="Mật khẩu cũ"
                        variant="outlined"
                        size="small"
                        className="w-full"
                        name="oldPassword"
                        value={changePassword.oldPassword}
                        onChange={onChangePasswordInput}
                        disabled={isLoading2}
                      />
                    )}

                    <TextField
                      type="password"
                      label="Mật khẩu mới"
                      variant="outlined"
                      size="small"
                      className="w-full"
                      name="newPassword"
                      value={changePassword.newPassword}
                      onChange={onChangePasswordInput}
                      disabled={isLoading2}
                    />

                    <TextField
                      type="password"
                      label="Xác nhận mật khẩu"
                      variant="outlined"
                      size="small"
                      className="w-full"
                      name="confirmPassword"
                      value={changePassword.confirmPassword}
                      onChange={onChangePasswordInput}
                      disabled={isLoading2}
                    />
                  </div>

                  <div className="mt-6 flex items-center">
                    <Button
                      type="submit"
                      className="bg-org product-card__cta product-card__cta--primary !px-6"
                      sx={{
                        width: '200px',
                        height: '46px',
                        fontSize: '14px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {isLoading2 ? <CircularProgress color="inherit" /> : 'Cập nhật mật khẩu'}
                    </Button>
                  </div>
                </form>
              </div>
            </Collapse>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyAccount;
