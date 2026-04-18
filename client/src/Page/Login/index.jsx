import React, { useContext, useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { FaRegEye } from 'react-icons/fa6';
import { Button } from '@mui/material';
import { IoEyeOff } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { HiOutlineShieldCheck } from 'react-icons/hi2';
import { FiTruck, FiHeadphones } from 'react-icons/fi';
import { MyContext } from '../../App';
import { postData } from '../../utils/api';
import CircularProgress from '@mui/material/CircularProgress';
import { getMessageFromFirebaseError, signInWithGoogle } from '../../utils/googleAuth';

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '18px',
    backgroundColor: '#fff',
    '& fieldset': {
      borderColor: 'rgba(255, 82, 82, 0.14)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 82, 82, 0.35)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#ff5252',
      boxShadow: '0 0 0 4px rgba(255, 82, 82, 0.08)',
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#ff5252',
  },
};

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isShowPassWord, setIsShowPassword] = useState(false);
  const [formFields, setFormFields] = useState({
    email: '',
    password: '',
  });

  const context = useContext(MyContext);
  const histoty = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const forgotPassword = () => {
    if (formFields.email === '') {
      context.alertBox('error', 'Vui lòng nhập email');
      return false;
    }

    context.alertBox('success', `Mã OTP đã được gửi tới ${formFields.email}`);
    localStorage.setItem('userEmail', formFields.email);
    localStorage.setItem('actionType', 'forgot-password');

    postData('/api/user/forgot-password', {
      email: formFields.email,
    }).then((res) => {
      if (res?.error === false) {
        context.alertBox('success', res?.message);
        histoty('/verify');
      } else {
        context.alertBox('error', res?.message || 'Đã có lỗi xảy ra');
      }
    });
  };

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields(() => ({
      ...formFields,
      [name]: value,
    }));
  };

  const valideValue = Object.values(formFields).every((el) => el);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formFields.email === '') {
      context.alertBox('error', 'Vui lòng nhập email');
      setIsLoading(false);
      return false;
    }

    if (formFields.password === '') {
      context.alertBox('error', 'Vui lòng nhập mật khẩu');
      setIsLoading(false);
      return false;
    }

    postData('/api/user/login', formFields, { withCredentials: true }).then((res) => {
      if (res?.error !== true) {
        setIsLoading(false);
        context.alertBox('success', res?.message);
        setFormFields({
          email: '',
          password: '',
        });

        localStorage.setItem('accesstoken', res?.data.accesstoken);
        localStorage.setItem('refreshToken', res?.data.refreshToken);
        context.setIsLogin(true);
        histoty('/');
      } else {
        context.alertBox('error', res?.message || 'Đã có lỗi xảy ra');
        setIsLoading(false);
      }
    });
  };

  const authWithGoogle = () => {
    setIsLoading(true);

    signInWithGoogle()
      .then((fields) => {
        return postData('/api/user/authWithGoogle', fields).then((res) => ({ fields, res }));
      })
      .then(({ fields, res }) => {
        if (res?.error !== true) {
          setIsLoading(false);
          context.alertBox('success', res?.message);
          localStorage.setItem('userEmail', fields.email);
          localStorage.setItem('accesstoken', res?.data.accesstoken);
          localStorage.setItem('refreshToken', res?.data.refreshToken);
          context.setIsLogin(true);
          histoty('/');
        } else {
          context.alertBox('error', res?.message || 'Đã có lỗi xảy ra');
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error('Google login failed:', error);
        context.alertBox('error', getMessageFromFirebaseError(error));
        setIsLoading(false);
      });
  };

  return (
    <section className="pb-10 pt-[220px] md:pb-12 md:pt-[245px] xl:pt-[265px]">
      <div className="container">
        <div className="mx-auto grid max-w-[1040px] overflow-hidden rounded-[28px] border border-[rgba(255,82,82,0.12)] bg-white shadow-[0_20px_48px_rgba(15,23,42,0.12)] lg:grid-cols-[0.92fr_1.08fr]">
          <div className="relative overflow-hidden bg-[linear-gradient(135deg,#1f2937_0%,#111827_48%,#ff5252_100%)] px-5 py-7 text-white md:px-8 md:py-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.14),transparent_24%)]" />
            <div className="relative z-10">
              <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-[700] uppercase tracking-[0.14em] text-white/90">
                Chào mừng trở lại
              </span>
              <h1 className="mt-4 max-w-[380px] text-[28px] font-[800] leading-tight md:text-[36px]">
                Đăng nhập để tiếp tục mua sắm nhanh hơn.
              </h1>
              <p className="mt-3 max-w-[430px] text-[14px] leading-6 text-white/80">
                Theo dõi đơn hàng, lưu danh sách yêu thích và thanh toán nhanh chỉ trong vài bước.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                <div className="rounded-[20px] border border-white/14 bg-white/10 p-4 backdrop-blur">
                  <HiOutlineShieldCheck className="text-[24px]" />
                  <h3 className="mt-3 text-[14px] font-[700]">An toàn</h3>
                  <p className="mb-0 mt-2 text-[12px] leading-6 text-white/75">
                    Bảo mật tài khoản và phiên đăng nhập tốt hơn.
                  </p>
                </div>
                <div className="rounded-[20px] border border-white/14 bg-white/10 p-4 backdrop-blur">
                  <FiTruck className="text-[24px]" />
                  <h3 className="mt-3 text-[14px] font-[700]">Theo dõi đơn</h3>
                  <p className="mb-0 mt-2 text-[12px] leading-6 text-white/75">
                    Xem tiến trình giao hàng ngay trong tài khoản.
                  </p>
                </div>
                <div className="rounded-[20px] border border-white/14 bg-white/10 p-4 backdrop-blur">
                  <FiHeadphones className="text-[24px]" />
                  <h3 className="mt-3 text-[14px] font-[700]">Hỗ trợ nhanh</h3>
                  <p className="mb-0 mt-2 text-[12px] leading-6 text-white/75">
                    Dễ liên hệ hỗ trợ khi cần đổi trả hoặc quên mật khẩu.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[linear-gradient(180deg,#fff_0%,#fff8f5_100%)] px-5 py-7 sm:px-7 md:px-8 md:py-8">
            <div className="mx-auto max-w-[460px]">
              <div className="mb-7">
                <p className="mb-2 text-[12px] font-[700] uppercase tracking-[0.16em] text-[#ff5252]">
                  Đăng nhập tài khoản
                </p>
                <h2 className="text-[28px] font-[800] leading-tight text-[#1f2937] md:text-[30px]">
                  Đăng nhập vào tài khoản
                </h2>
                <p className="mb-0 mt-3 text-[13px] leading-6 text-[#6b7280]">
                  Nhập email và mật khẩu để truy cập lịch sử mua hàng, danh sách yêu thích và thông tin giao hàng.
                </p>
              </div>

              <form className="w-full" onSubmit={handleSubmit}>
                <div className="form-gourp mb-4 w-full">
                  <TextField
                    type="email"
                    id="email"
                    name="email"
                    value={formFields.email}
                    disabled={isLoading}
                    label="Email*"
                    variant="outlined"
                    className="w-full"
                    onChange={onChangeInput}
                    sx={inputSx}
                  />
                </div>

                <div className="form-gourp relative mb-4 w-full">
                  <TextField
                    type={isShowPassWord === false ? 'password' : 'text'}
                    id="password"
                    label="Mật khẩu*"
                    variant="outlined"
                    className="w-full"
                    name="password"
                    value={formFields.password}
                    disabled={isLoading}
                    onChange={onChangeInput}
                    sx={inputSx}
                  />
                  <Button
                    className="!absolute right-[10px] top-[10px] z-50 !h-[36px] !min-w-[36px] !w-[36px] !rounded-full !text-black/70"
                    onClick={() => setIsShowPassword(!isShowPassWord)}
                  >
                    {isShowPassWord === false ? (
                      <FaRegEye className="text-[18px] opacity-75" />
                    ) : (
                      <IoEyeOff className="text-[18px] opacity-75" />
                    )}
                  </Button>
                </div>

                <div className="mb-4 flex items-center justify-end">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      forgotPassword();
                    }}
                    className="cursor-pointer text-[14px] font-[700] text-[#ff5252] transition hover:text-[#1f2937]"
                  >
                    Quên mật khẩu?
                  </a>
                </div>

                <div className="mb-4 flex items-center w-full">
                  <Button type="submit" disabled={!valideValue} className="bg-org flex w-full gap-3 !text-[16px]">
                    {isLoading === true ? <CircularProgress color="inherit" /> : 'Đăng nhập'}
                  </Button>
                </div>

                <div className="mb-5 text-center">
                  <p className="mb-0 text-[13px] text-[#6b7280]">
                    Chưa có tài khoản?{' '}
                    <Link className="text-primary text-[14px] font-[700]" to={'/register'}>
                      Đăng ký
                    </Link>
                  </p>
                </div>

                <div className="relative mb-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[rgba(255,82,82,0.14)]" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-[#fff8f5] px-4 text-[13px] font-[600] text-[#6b7280]">
                      Hoặc tiếp tục với
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  disabled={isLoading}
                  className="!flex !w-full !gap-3 !rounded-[18px] !border !border-[rgba(255,82,82,0.14)] !bg-white !py-[12px] !text-[15px] !font-[700] !text-black shadow-[0_12px_28px_rgba(15,23,42,0.06)]"
                  onClick={authWithGoogle}
                >
                  <FcGoogle className="text-[22px]" />
                  Đăng nhập với Google
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
