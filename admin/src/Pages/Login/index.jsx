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

const copy = {
  VN: {
    login: "Dang nhap",
    signUp: "Dang ky",
    adminWorkspace: "Khu vuc quan tri",
    heroTitle: "Quan ly cua hang gon hon voi mot man hinh dang nhap ro rang.",
    heroText:
      "Theo doi san pham, blog, banner va don hang trong mot admin panel sang sua hon, tap trung hon va de thao tac moi ngay.",
    fastAccess: "Truy cap nhanh",
    dashboard: "Bang dieu khien",
    fastAccessText:
      "Vao nhanh cac khu vuc quan tri quan trong tu mot luong dang nhap don gian.",
    secure: "Bao mat",
    protected: "Da bao ve",
    secureText:
      "Kiem tra phien dang nhap va tu dong don token khi server khong con hoat dong.",
    welcomeBack: "Chao mung quay lai",
    subtitle: "Dang nhap de tiep tuc quan ly he thong cua ban.",
    status: "Trang thai",
    secureAccess: "Truy cap an toan",
    continueGoogle: "Tiep tuc voi Google",
    facebook: "Facebook",
    emailDivider: "hoac dang nhap bang email",
    email: "Email",
    password: "Mat khau",
    emailPlaceholder: "name@company.com",
    passwordPlaceholder: "Nhap mat khau cua ban",
    rememberMe: "Ghi nho toi",
    forgotPassword: "Quen mat khau?",
    loginDashboard: "Dang nhap vao dashboard",
    noAccount: "Chua co tai khoan?",
    createNewAccount: "Tao tai khoan moi",
    enterEmail: "Vui long nhap email",
    enterPassword: "Vui long nhap mat khau",
    googleError: "Da co loi xay ra",
    facebookUnavailable: "Dang nhap Facebook chua san sang",
  },
  EU: {
    login: "Login",
    signUp: "Sign Up",
    adminWorkspace: "Admin Workspace",
    heroTitle: "Manage your store with a cleaner and clearer login experience.",
    heroText:
      "Track products, blogs, banners and orders in one admin panel that feels lighter, more focused and easier to use every day.",
    fastAccess: "Fast Access",
    dashboard: "Dashboard",
    fastAccessText:
      "Jump into the most important admin areas from one streamlined login flow.",
    secure: "Secure",
    protected: "Protected",
    secureText:
      "Checks active sessions and clears tokens automatically when the server is unavailable.",
    welcomeBack: "Welcome back",
    subtitle: "Log in to continue managing your system.",
    status: "Status",
    secureAccess: "Secure Access",
    continueGoogle: "Continue with Google",
    facebook: "Facebook",
    emailDivider: "or login with email",
    email: "Email",
    password: "Password",
    emailPlaceholder: "name@company.com",
    passwordPlaceholder: "Enter your password",
    rememberMe: "Remember me",
    forgotPassword: "Forgot password?",
    loginDashboard: "Login to Dashboard",
    noAccount: "Don't have an account?",
    createNewAccount: "Create a new account",
    enterEmail: "Please enter email",
    enterPassword: "Please enter password",
    googleError: "Something went wrong",
    facebookUnavailable: "Facebook login is not available yet",
  },
};

const Login = () => {
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingFb, setLoadingFb] = useState(false);
  const [formFields, setFormFields] = useState({ email: "", password: "" });

  const context = useContext(MyContext);
  const navigate = useNavigate();
  const c = copy[context.language] || copy.VN;

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
            context.alertBox("error", res?.message || c.googleError);
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
    context.alertBox("error", c.facebookUnavailable);
    setLoadingFb(false);
  };

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formFields.email) {
      context.alertBox("error", c.enterEmail);
      return;
    }
    if (!formFields.password) {
      context.alertBox("error", c.enterPassword);
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
        context.alertBox("error", res?.message || c.googleError);
      }
    });
  };

  const forgotPassword = (e) => {
    e.preventDefault();

    if (!formFields.email) {
      context.alertBox("error", c.enterEmail);
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
          context.alertBox("error", res?.message || c.googleError);
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
                {c.login}
              </Button>
            )}
          </NavLink>
          <NavLink to="/sign-up">
            <Button className="!rounded-full !px-4 !py-2 !text-[13px] !font-[700] !text-[rgba(0,0,0,0.75)] sm:!px-5">
              {c.signUp}
            </Button>
          </NavLink>
        </div>
      </header>

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-80px)] w-full max-w-5xl grid-cols-1 gap-5 px-4 pb-5 pt-1 sm:px-5 lg:grid-cols-[0.95fr_0.72fr] lg:px-6">
        <div className="hidden rounded-[26px] border border-white/50 bg-[#14213d] p-6 text-white shadow-[0_20px_56px_rgba(20,33,61,0.22)] lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-[10px] font-[700] uppercase tracking-[0.2em] text-white/90">
              <HiOutlineSparkles className="text-[16px]" />
              {c.adminWorkspace}
            </div>

            <h1 className="max-w-[360px] text-[30px] font-[800] leading-[1.08]">
              {c.heroTitle}
            </h1>

            <p className="mt-4 max-w-[360px] text-[14px] leading-6 text-white/72">
              {c.heroText}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[20px] border border-white/12 bg-white/8 p-3.5 backdrop-blur-sm">
              <p className="text-[13px] font-[700] uppercase tracking-[0.18em] text-white/55">
                {c.fastAccess}
              </p>
              <p className="mt-2 text-[18px] font-[800]">{c.dashboard}</p>
              <p className="mt-2 text-[12px] leading-5 text-white/68">
                {c.fastAccessText}
              </p>
            </div>
            <div className="rounded-[20px] border border-white/12 bg-[#f59e0b] p-3.5 text-[#1f2937]">
              <p className="text-[13px] font-[700] uppercase tracking-[0.18em] text-[#1f2937]/70">
                {c.secure}
              </p>
              <p className="mt-2 text-[18px] font-[800]">{c.protected}</p>
              <p className="mt-2 text-[12px] leading-5 text-[#1f2937]/80">
                {c.secureText}
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
                  {c.welcomeBack}
                </h2>
                <p className="mt-1.5 text-[13px] leading-5 text-slate-500">
                  {c.subtitle}
                </p>
              </div>

              <div className="hidden rounded-[18px] bg-[#f6f8ff] px-3 py-2 text-right sm:block">
                <p className="text-[11px] font-[700] uppercase tracking-[0.12em] text-slate-400">
                  {c.status}
                </p>
                <p className="mt-1 text-[12px] font-[700] text-[#3872fa]">
                  {c.secureAccess}
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
                    {c.continueGoogle}
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
                    {c.facebook}
                  </>
                )}
              </Button>
            </div>

            <div className="my-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-slate-200" />
              <span className="text-[12px] font-[700] uppercase tracking-[0.2em] text-slate-400">
                {c.emailDivider}
              </span>
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <form className="space-y-3.5" onSubmit={handleSubmit}>
              <div>
                <label className="mb-1.5 block text-[13px] font-[700] text-slate-700">
                  {c.email}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formFields.email}
                  onChange={onChangeInput}
                  disabled={isLoading}
                  placeholder={c.emailPlaceholder}
                  className="h-[48px] w-full rounded-[18px] border border-slate-200 bg-[#fcfcfd] px-4 text-[13px] text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-[#3872fa] focus:bg-white focus:shadow-[0_0_0_4px_rgba(56,114,250,0.12)]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-[700] text-slate-700">
                  {c.password}
                </label>
                <div className="relative">
                  <input
                    type={isPasswordShow ? "text" : "password"}
                    name="password"
                    value={formFields.password}
                    onChange={onChangeInput}
                    disabled={isLoading}
                    placeholder={c.passwordPlaceholder}
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
                  label={c.rememberMe}
                  className="!m-0 text-slate-600"
                />
                <Link
                  to="/forgot-password"
                  onClick={forgotPassword}
                  className="font-[700] text-[#3872fa] transition-all hover:text-[#14213d]"
                >
                  {c.forgotPassword}
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
                    {c.loginDashboard}
                    <FaArrowRightLong className="text-[16px]" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-5 rounded-[18px] bg-[#f8f9fd] p-3.5 text-[12px] leading-5 text-slate-500">
              {c.noAccount}
              <Link
                to="/sign-up"
                className="ml-2 font-[700] text-[#3872fa] hover:text-[#14213d]"
              >
                {c.createNewAccount}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
