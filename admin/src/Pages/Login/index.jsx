import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import CircularProgress from "@mui/material/CircularProgress";
import { FcGoogle } from "react-icons/fc";
import { BsFacebook, BsShieldLock } from "react-icons/bs";
import { CgLogIn } from "react-icons/cg";
import { FaArrowRightLong, FaEyeSlash, FaRegEye } from "react-icons/fa6";
import { HiOutlineSparkles } from "react-icons/hi2";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { firebaseApp } from "../../firebase";
import { fetchDataFromApi, postData } from "../../utils/api";
import { getFirebaseAuthErrorMessage } from "../../utils/firebaseAuth";
import { MyContext } from "../../App";

const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

const Login = () => {
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingFb, setLoadingFb] = useState(false);
  const [formFields, setFormFields] = useState({ email: "", password: "" });

  const context = useContext(MyContext);
  const navigate = useNavigate();

  const syncUserSession = async () => {
    const userRes = await fetchDataFromApi("/api/user/user-details");

    if (userRes?.error === false && userRes?.data) {
      context.setUserData(userRes.data);
      context.setIsLogin(true);
      navigate("/");
      return;
    }

    context.setIsLogin(true);
    navigate("/");
  };

  const authWithGoogle = () => {
    setLoadingGoogle(true);
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const user = result.user;
        const fields = {
          name: user.providerData[0].displayName,
          email: user.providerData[0].email,
          password: null,
          avatar: user.providerData[0].photoURL,
          mobile: user.providerData[0].phoneNumber,
          role: "USER",
        };

        postData("/api/user/authWithGoogle", fields).then((res) => {
          setLoadingGoogle(false);
          if (res?.error !== true) {
            context.alertBox("success", res?.message);
            localStorage.setItem("accesstoken", res?.data.accesstoken);
            localStorage.setItem("refreshToken", res?.data.refreshToken);
            syncUserSession();
          } else {
            context.alertBox("error", res?.message || "Something went wrong");
          }
        });
      })
      .catch((error) => {
        setLoadingGoogle(false);
        console.error("Google sign-in failed", {
          code: error?.code,
          message: error?.message,
          origin: window.location.origin,
          authDomain: import.meta.env.VITE_FIREBASE_APP_AUTH_DOMAIN,
        });
        context.alertBox("error", getFirebaseAuthErrorMessage(error));
      });
  };

  const handleClickFb = () => {
    setLoadingFb(true);
    context.alertBox("error", "Facebook login is not available yet");
    setLoadingFb(false);
  };

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formFields.email) {
      context.alertBox("error", "Please enter email id");
      return;
    }
    if (!formFields.password) {
      context.alertBox("error", "Please enter password");
      return;
    }

    setIsLoading(true);

    postData("/api/user/login", formFields, {
      withCredentials: true,
    }).then((res) => {
      setIsLoading(false);
      if (res?.error !== true) {
        context.alertBox("success", res?.message);
        setFormFields({ email: "", password: "" });
        localStorage.setItem("accesstoken", res?.data.accesstoken);
        localStorage.setItem("refreshToken", res?.data.refreshToken);
        syncUserSession();
      } else {
        context.alertBox("error", res?.message || "Something went wrong");
      }
    });
  };

  const forgotPassword = (e) => {
    e.preventDefault();

    if (!formFields.email) {
      context.alertBox("error", "Please enter email id");
      return;
    }

    localStorage.setItem("userEmail", formFields.email);
    localStorage.setItem("actionType", "forgot-password");

    postData("/api/user/forgot-password", { email: formFields.email }).then(
      (res) => {
        if (res?.error === false) {
          context.alertBox("success", res?.message);
          navigate("/verify-account");
        } else {
          context.alertBox("error", res?.message || "Something went wrong");
        }
      },
    );
  };

  const isFormValid = Object.values(formFields).every(
    (val) => val.trim() !== "",
  );

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#f7f5ef]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.9),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(56,114,250,0.18),_transparent_34%),linear-gradient(135deg,_#f7f5ef_0%,_#efe7d5_45%,_#dce7ff_100%)]" />
      <div className="absolute left-[-120px] top-[120px] h-[320px] w-[320px] rounded-full bg-[#1f4fd1]/10 blur-3xl" />
      <div className="absolute bottom-[-80px] right-[8%] h-[280px] w-[280px] rounded-full bg-[#f59e0b]/15 blur-3xl" />

      <header className="relative z-20 mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3 sm:px-5 lg:px-6">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-full bg-white/70 px-3 py-2 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur"
        >
          <img src="logo.png" alt="logo" className="h-10 w-auto sm:h-12" />
        </Link>

        <div className="flex items-center gap-2 rounded-full border border-white/60 bg-white/65 p-1 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur">
          <NavLink to="/login">
            {({ isActive }) => (
              <Button
                className={`!rounded-full !px-4 !py-2 !text-[13px] !font-[700] sm:!px-5 ${
                  isActive
                    ? "!bg-[#14213d] !text-white"
                    : "!text-[rgba(0,0,0,0.75)]"
                }`}
              >
                <CgLogIn className="mr-2 text-[17px]" />
                Login
              </Button>
            )}
          </NavLink>
          <NavLink to="/sign-up">
            <Button className="!rounded-full !px-4 !py-2 !text-[13px] !font-[700] !text-[rgba(0,0,0,0.75)] sm:!px-5">
              Sign Up
            </Button>
          </NavLink>
        </div>
      </header>

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-80px)] w-full max-w-5xl grid-cols-1 gap-5 px-4 pb-5 pt-1 sm:px-5 lg:grid-cols-[0.95fr_0.72fr] lg:px-6">
        <div className="hidden rounded-[26px] border border-white/50 bg-[#14213d] p-6 text-white shadow-[0_20px_56px_rgba(20,33,61,0.22)] lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-[10px] font-[700] uppercase tracking-[0.2em] text-white/90">
              <HiOutlineSparkles className="text-[16px]" />
              Admin Workspace
            </div>

            <h1 className="max-w-[360px] font-[800] leading-[1.08] text-[30px]">
              Quản lý cửa hàng gọn hơn với một màn hình đăng nhập rõ ràng.
            </h1>

            <p className="mt-4 max-w-[360px] text-[14px] leading-6 text-white/72">
              Theo dõi sản phẩm, blog, banner và đơn hàng trong một admin panel
              sáng sủa hơn, tập trung hơn và dễ thao tác mỗi ngày.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[20px] border border-white/12 bg-white/8 p-3.5 backdrop-blur-sm">
              <p className="text-[13px] font-[700] uppercase tracking-[0.18em] text-white/55">
                Fast Access
              </p>
              <p className="mt-2 text-[18px] font-[800]">Dashboard</p>
              <p className="mt-2 text-[12px] leading-5 text-white/68">
                Vào nhanh các khu vực quản trị quan trọng từ một luồng đăng nhập
                đơn giản.
              </p>
            </div>
            <div className="rounded-[20px] border border-white/12 bg-[#f59e0b] p-3.5 text-[#1f2937]">
              <p className="text-[13px] font-[700] uppercase tracking-[0.18em] text-[#1f2937]/70">
                Secure
              </p>
              <p className="mt-2 text-[18px] font-[800]">Protected</p>
              <p className="mt-2 text-[12px] leading-5 text-[#1f2937]/80">
                Kiểm tra phiên đăng nhập và tự dọn token khi server không còn
                hoạt động.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="w-full max-w-[390px] rounded-[24px] border border-white/70 bg-white/80 p-4 shadow-[0_20px_48px_rgba(20,33,61,0.14)] backdrop-blur-xl sm:p-5 lg:p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-[16px] bg-[linear-gradient(135deg,_#14213d,_#3872fa)] text-white shadow-[0_16px_30px_rgba(56,114,250,0.28)]">
                  <BsShieldLock className="text-[17px]" />
                </div>
                <h2 className="text-[22px] font-[800] leading-tight text-[#14213d]">
                  Welcome back
                </h2>
                <p className="mt-1.5 text-[13px] leading-5 text-slate-500">
                  Đăng nhập để tiếp tục quản lý hệ thống của bạn.
                </p>
              </div>

              <div className="hidden rounded-[18px] bg-[#f6f8ff] px-3 py-2 text-right sm:block">
                <p className="text-[11px] font-[700] uppercase tracking-[0.12em] text-slate-400">
                  Status
                </p>
                <p className="mt-1 text-[12px] font-[700] text-[#3872fa]">
                  Secure Access
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Button
                onClick={authWithGoogle}
                disabled={loadingGoogle}
                className="!flex !h-[46px] !items-center !justify-center !gap-2 !rounded-[18px] !border !border-slate-200 !bg-white !text-[12px] !font-[700] !capitalize !text-slate-700 hover:!bg-slate-50"
              >
                {loadingGoogle ? (
                  <CircularProgress color="inherit" size={20} />
                ) : (
                  <>
                    <FcGoogle className="text-[22px]" />
                    Continue with Google
                  </>
                )}
              </Button>

              <Button
                onClick={handleClickFb}
                disabled={loadingFb}
                className="!flex !h-[46px] !items-center !justify-center !gap-2 !rounded-[18px] !border !border-slate-200 !bg-[#f8fbff] !text-[12px] !font-[700] !capitalize !text-[#1d4ed8] hover:!bg-[#eff6ff]"
              >
                {loadingFb ? (
                  <CircularProgress color="inherit" size={20} />
                ) : (
                  <>
                    <BsFacebook className="text-[20px]" />
                    Facebook
                  </>
                )}
              </Button>
            </div>

            <div className="my-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-slate-200" />
              <span className="text-[12px] font-[700] uppercase tracking-[0.2em] text-slate-400">
                or login with email
              </span>
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <form className="space-y-3.5" onSubmit={handleSubmit}>
              <div>
                <label className="mb-1.5 block text-[13px] font-[700] text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formFields.email}
                  onChange={onChangeInput}
                  disabled={isLoading}
                  placeholder="name@company.com"
                  className="h-[48px] w-full rounded-[18px] border border-slate-200 bg-[#fcfcfd] px-4 text-[13px] text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-[#3872fa] focus:bg-white focus:shadow-[0_0_0_4px_rgba(56,114,250,0.12)]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-[700] text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={isPasswordShow ? "text" : "password"}
                    name="password"
                    value={formFields.password}
                    onChange={onChangeInput}
                    disabled={isLoading}
                    placeholder="Enter your password"
                    className="h-[48px] w-full rounded-[18px] border border-slate-200 bg-[#fcfcfd] px-4 pr-12 text-[13px] text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-[#3872fa] focus:bg-white focus:shadow-[0_0_0_4px_rgba(56,114,250,0.12)]"
                  />
                  <Button
                    type="button"
                    onClick={() => setIsPasswordShow((prev) => !prev)}
                    className="!absolute !right-1.5 !top-[4px] !h-[40px] !min-w-[40px] !rounded-xl !text-slate-500"
                  >
                    {isPasswordShow ? (
                      <FaEyeSlash className="text-[18px]" />
                    ) : (
                      <FaRegEye className="text-[18px]" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-2 text-[13px] sm:flex-row sm:items-center sm:justify-between">
                <FormControlLabel
                  control={<Checkbox defaultChecked />}
                  label="Remember me"
                  className="!m-0 text-slate-600"
                />
                <Link
                  to="/forgot-password"
                  onClick={forgotPassword}
                  className="font-[700] text-[#3872fa] transition-all hover:text-[#14213d]"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={!isFormValid || isLoading}
                className="!mt-1 !flex !h-[50px] !w-full !items-center !justify-center !gap-2 !rounded-[18px] !bg-[linear-gradient(135deg,_#14213d,_#3872fa)] !text-[13px] !font-[800] !capitalize !text-white shadow-[0_18px_35px_rgba(56,114,250,0.28)] hover:!opacity-95 disabled:!bg-slate-300 disabled:!shadow-none"
              >
                {isLoading ? (
                  <CircularProgress color="inherit" size={22} />
                ) : (
                  <>
                    Login to Dashboard
                    <FaArrowRightLong className="text-[16px]" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-5 rounded-[18px] bg-[#f8f9fd] p-3.5 text-[12px] leading-5 text-slate-500">
              Chưa có tài khoản?
              <Link
                to="/sign-up"
                className="ml-2 font-[700] text-[#3872fa] hover:text-[#14213d]"
              >
                Tạo tài khoản mới
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
