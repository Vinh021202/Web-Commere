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
      return 'Quan ly thong tin tai khoan, bao mat va thong tin lien he trong mot bo cuc gon gang hon.';
    }

    return `${context.userData.name}, cap nhat nhanh thong tin ca nhan va bao mat tai khoan ngay tai day.`;
  }, [context?.userData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formFields.name) {
      context.alertBox('error', 'Please enter full name');
      setIsLoading(false);
      return;
    }
    if (!formFields.email) {
      context.alertBox('error', 'Please enter email id');
      setIsLoading(false);
      return;
    }
    if (!formFields.mobile) {
      context.alertBox('error', 'Please enter mobile number');
      setIsLoading(false);
      return;
    }

    editData(`/api/user/${userId}`, formFields, { withCredentials: true }).then((res) => {
      if (res?.error !== true) {
        setIsLoading(false);
        context.alertBox('success', res?.data?.message);
        context.setIsLogin(true);
      } else {
        context.alertBox('error', res?.data?.message || 'Something went wrong');
        setIsLoading(false);
      }
    });
  };

  const handleSubmitChangePassword = (e) => {
    e.preventDefault();
    setIsLoading2(true);

    if (context?.userData?.signUpWithGoogle === false && !changePassword.oldPassword) {
      context.alertBox('error', 'Please enter old password');
      setIsLoading2(false);
      return;
    }
    if (!changePassword.newPassword) {
      context.alertBox('error', 'Please enter new password');
      setIsLoading2(false);
      return;
    }
    if (!changePassword.confirmPassword) {
      context.alertBox('error', 'Please confirm new password');
      setIsLoading2(false);
      return;
    }
    if (changePassword.confirmPassword !== changePassword.newPassword) {
      context.alertBox('error', 'New password and confirm password do not match');
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
          context.alertBox('error', res?.message || 'Something went wrong');
        }
      })
      .catch(() => {
        setIsLoading2(false);
        context.alertBox('error', 'Something went wrong');
      });
  };

  return (
    <section className="pb-10 pt-[220px] md:pt-[240px] xl:pt-[260px]">
      <div className="container">
        <div className="section-shell overflow-hidden px-4 py-6 md:px-8 md:py-8">
          <div className="absolute inset-y-0 right-0 hidden w-[34%] bg-[radial-gradient(circle_at_top_right,rgba(255,82,82,0.12),transparent_58%)] lg:block" />

          <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-[760px]">
              <span className="eyebrow">My account</span>
              <h1 className="section-heading mt-4 max-w-[700px]">
                Khong gian quan ly tai khoan duoc sap xep gon, ro va de cap nhat hon.
              </h1>
              <p className="muted-copy mt-4 max-w-[620px] text-[15px] leading-7">{accountSummary}</p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="listing-chip">Thong tin ca nhan</span>
                <span className="listing-chip">Bao mat tai khoan</span>
                <span className="listing-chip">Avatar va lien he</span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[460px]">
              <div className="soft-card p-4">
                <span className="listing-stat__label">Ho ten</span>
                <strong className="listing-stat__value !text-[1.1rem]">
                  {context?.userData?.name || '--'}
                </strong>
              </div>
              <div className="soft-card p-4">
                <span className="listing-stat__label">Email</span>
                <strong className="listing-stat__value !text-[1.1rem]">
                  {context?.userData?.email ? 'Connected' : '--'}
                </strong>
              </div>
              <div className="soft-card p-4">
                <span className="listing-stat__label">Bao mat</span>
                <strong className="listing-stat__value !text-[1.1rem]">
                  {isChangePasswordFromShow ? 'Editing' : 'Stable'}
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
                  <span className="listing-stat__label">Profile settings</span>
                  <h2 className="mt-2 text-[24px] font-[800] text-[#1f2937]">My Profile</h2>
                </div>
                <Button
                  className={`!rounded-full !px-5 !py-2 !text-[13px] !font-[800] !capitalize ${
                    isChangePasswordFromShow
                      ? '!bg-[#ff5252] !text-white'
                      : '!border !border-[rgba(255,82,82,0.16)] !bg-white !text-[#1f2937]'
                  }`}
                  onClick={() => setIsChangePasswordFromShow(!isChangePasswordFromShow)}
                >
                  {isChangePasswordFromShow ? 'Hide Password Form' : 'Change Password'}
                </Button>
              </div>

              <form className="mt-2" onSubmit={handleSubmit}>
                <div className="grid gap-4 md:grid-cols-2">
                  <TextField
                    type="text"
                    label="Full Name"
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
                    {isLoading ? <CircularProgress color="inherit" /> : 'Update Profile'}
                  </Button>
                </div>
              </form>
            </div>

            <Collapse isOpened={isChangePasswordFromShow}>
              <div className="section-shell overflow-hidden px-4 py-4 md:px-6 md:py-6">
                <div className="mb-5">
                  <span className="listing-stat__label">Security</span>
                  <h2 className="mt-2 text-[24px] font-[800] text-[#1f2937]">Change Password</h2>
                  <p className="mb-0 mt-2 text-[14px] leading-7 text-[#6b7280]">
                    Cap nhat mat khau moi de tang bao mat cho tai khoan cua ban.
                  </p>
                </div>

                <form className="mt-2" onSubmit={handleSubmitChangePassword}>
                  <div className="grid gap-4 md:grid-cols-2">
                    {context?.userData?.signUpWithGoogle === false && (
                      <TextField
                        type="password"
                        label="Old Password"
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
                      label="New Password"
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
                      label="Confirm Password"
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
                      sx={{ width: '200px', height: '46px', fontSize: '14px', whiteSpace: 'nowrap' }}
                    >
                      {isLoading2 ? <CircularProgress color="inherit" /> : 'Change Password'}
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
