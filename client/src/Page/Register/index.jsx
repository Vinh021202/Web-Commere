import React, { useContext, useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { FaRegEye } from 'react-icons/fa6';
import { Button } from '@mui/material';
import { IoEyeOff } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { HiOutlineSparkles } from 'react-icons/hi2';
import { FiHeart, FiGift } from 'react-icons/fi';
import { MyContext } from '../../App';
import { postData } from '../../utils/api';
import CircularProgress from '@mui/material/CircularProgress';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { firebaseApp } from '../../firebase';

const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

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

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isShowPassWord, setIsShowPassword] = useState(false);
  const [formFields, setFormFields] = useState({
    name: '',
    email: '',
    password: '',
  });

  const context = useContext(MyContext);
  const history = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

    if (formFields.name === '') {
      context.alertBox('error', 'Please enter full name');
      setIsLoading(false);
      return false;
    }

    if (formFields.email === '') {
      context.alertBox('error', 'Please enter email id');
      setIsLoading(false);
      return false;
    }

    if (formFields.password === '') {
      context.alertBox('error', 'Please enter password');
      setIsLoading(false);
      return false;
    }

    postData('/api/user/register', formFields).then((res) => {
      if (res?.error !== true) {
        setIsLoading(false);
        context.alertBox('success', res?.message);
        localStorage.setItem('userEmail', formFields.email);
        setFormFields({
          name: '',
          email: '',
          password: '',
        });
        history('/Verify');
      } else {
        context.alertBox('error', res?.message || 'Something went wrong');
        setIsLoading(false);
      }
    });
  };

  const authWithGoogle = () => {
    const auth = getAuth();
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const user = result.user;
        const fields = {
          name: user.providerData[0].displayName,
          email: user.providerData[0].email,
          password: null,
          avatar: user.providerData[0].photoURL,
          mobile: user.providerData[0].phoneNumber,
          role: 'USER',
        };

        postData('/api/user/authWithGoogle', fields).then((res) => {
          if (res?.error !== true) {
            setIsLoading(false);
            context.alertBox('success', res?.message);
            localStorage.setItem('userEmail', fields.email);
            localStorage.setItem('accesstoken', res?.data.accesstoken);
            localStorage.setItem('refreshToken', res?.data.refreshToken);
            context.setIsLogin(true);
            history('/');
          } else {
            context.alertBox('error', res?.message || 'Something went wrong');
            setIsLoading(false);
          }
        });
      })
      .catch(() => {
        context.alertBox('error', 'Google signup failed');
        setIsLoading(false);
      });
  };

  return (
    <section className="pb-10 pt-[220px] md:pb-12 md:pt-[245px] xl:pt-[265px]">
      <div className="container">
        <div className="mx-auto grid max-w-[1040px] overflow-hidden rounded-[28px] border border-[rgba(255,82,82,0.12)] bg-white shadow-[0_20px_48px_rgba(15,23,42,0.12)] lg:grid-cols-[0.92fr_1.08fr]">
          <div className="relative overflow-hidden bg-[linear-gradient(135deg,#ff5252_0%,#ff7b5b_48%,#1f2937_100%)] px-5 py-7 text-white md:px-8 md:py-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_24%)]" />
            <div className="relative z-10">
              <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-[700] uppercase tracking-[0.14em] text-white/90">
                Create account
              </span>
              <h1 className="mt-4 max-w-[390px] text-[28px] font-[800] leading-tight md:text-[36px]">
                Start your account and save the products you love.
              </h1>
              <p className="mt-3 max-w-[430px] text-[14px] leading-6 text-white/80">
                Join once to get a smoother checkout flow, saved favorites, and faster order tracking.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                <div className="rounded-[20px] border border-white/14 bg-white/10 p-4 backdrop-blur">
                  <HiOutlineSparkles className="text-[24px]" />
                  <h3 className="mt-3 text-[14px] font-[700]">Personalized</h3>
                  <p className="mb-0 mt-2 text-[12px] leading-6 text-white/75">
                    Get a cleaner shopping flow tailored to your account.
                  </p>
                </div>
                <div className="rounded-[20px] border border-white/14 bg-white/10 p-4 backdrop-blur">
                  <FiHeart className="text-[24px]" />
                  <h3 className="mt-3 text-[14px] font-[700]">Wishlist ready</h3>
                  <p className="mb-0 mt-2 text-[12px] leading-6 text-white/75">
                    Save favorite items and revisit them any time.
                  </p>
                </div>
                <div className="rounded-[20px] border border-white/14 bg-white/10 p-4 backdrop-blur">
                  <FiGift className="text-[24px]" />
                  <h3 className="mt-3 text-[14px] font-[700]">Member perks</h3>
                  <p className="mb-0 mt-2 text-[12px] leading-6 text-white/75">
                    Unlock offers, order updates, and better support access.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[linear-gradient(180deg,#fff_0%,#fff8f5_100%)] px-5 py-7 sm:px-7 md:px-8 md:py-8">
            <div className="mx-auto max-w-[460px]">
              <div className="mb-7">
                <p className="mb-2 text-[12px] font-[700] uppercase tracking-[0.16em] text-[#ff5252]">
                  New member
                </p>
                <h2 className="text-[28px] font-[800] leading-tight text-[#1f2937] md:text-[30px]">
                  Register your account
                </h2>
                <p className="mb-0 mt-3 text-[13px] leading-6 text-[#6b7280]">
                  Fill in your details below to create an account and continue to OTP verification.
                </p>
              </div>

              <form className="w-full" onSubmit={handleSubmit}>
                <div className="mb-4 w-full">
                  <TextField
                    type="text"
                    id="name"
                    name="name"
                    value={formFields.name}
                    disabled={isLoading}
                    label="Full Name*"
                    variant="outlined"
                    className="w-full"
                    onChange={onChangeInput}
                    sx={inputSx}
                  />
                </div>

                <div className="mb-4 w-full">
                  <TextField
                    type="email"
                    id="email"
                    name="email"
                    value={formFields.email}
                    disabled={isLoading}
                    label="Email Id*"
                    variant="outlined"
                    className="w-full"
                    onChange={onChangeInput}
                    sx={inputSx}
                  />
                </div>

                <div className="relative mb-4 w-full">
                  <TextField
                    type={isShowPassWord === false ? 'password' : 'text'}
                    id="password"
                    name="password"
                    value={formFields.password}
                    disabled={isLoading}
                    label="Password*"
                    variant="outlined"
                    className="w-full"
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

                <div className="mb-4 flex items-center w-full">
                  <Button type="submit" disabled={!valideValue} className="bg-org flex w-full gap-3 !text-[16px]">
                    {isLoading === true ? <CircularProgress color="inherit" /> : 'Create Account'}
                  </Button>
                </div>

                <div className="mb-5 text-center">
                  <p className="mb-0 text-[13px] text-[#6b7280]">
                    Already have an account?{' '}
                    <Link className="text-primary text-[14px] font-[700]" to={'/Login'}>
                      Login
                    </Link>
                  </p>
                </div>

                <div className="relative mb-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[rgba(255,82,82,0.14)]" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-[#fff8f5] px-4 text-[13px] font-[600] text-[#6b7280]">
                      Or continue with
                    </span>
                  </div>
                </div>

                <Button
                  className="!flex !w-full !gap-3 !rounded-[18px] !border !border-[rgba(255,82,82,0.14)] !bg-white !py-[12px] !text-[15px] !font-[700] !text-black shadow-[0_12px_28px_rgba(15,23,42,0.06)]"
                  onClick={authWithGoogle}
                >
                  <FcGoogle className="text-[22px]" />
                  Sign up with Google
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
