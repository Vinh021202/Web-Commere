import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import CircularProgress from "@mui/material/CircularProgress";
import { FcGoogle } from "react-icons/fc";
import { BsFacebook, BsPersonPlus } from "react-icons/bs";
import { CgLogIn } from "react-icons/cg";
import { FaArrowRightLong, FaEyeSlash, FaRegEye } from "react-icons/fa6";
import { HiOutlineSparkles } from "react-icons/hi2";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { firebaseApp } from "../../firebase";
import { MyContext } from "../../App";
import { fetchDataFromApi, postData } from "../../utils/api";
import { getFirebaseAuthErrorMessage } from "../../utils/firebaseAuth";

const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

const copy = {
  VN: {
    login: "Dang nhap",
    signUp: "Dang ky",
    newAccount: "Tai khoan moi",
    heroTitle: "Bat dau voi tai khoan moi trong mot giao dien gon hon.",
    heroText:
      "Tao tai khoan de truy cap admin panel, xac thuc email va tiep tuc quan ly noi dung, san pham va don hang.",
    simple: "Don gian",
    fields: "3 truong",
    fieldsText:
      "Tao tai khoan nhanh voi ten, email va mat khau trong mot form ngan gon.",
    nextStep: "Buoc tiep",
    verify: "Xac thuc",
    verifyText:
      "Sau khi dang ky xong, he thong se chuyen ban sang buoc xac thuc.",
    createAccount: "Tao tai khoan",
    subtitle: "Dien thong tin co ban de bat dau.",
    ready: "San sang",
    register: "Dang ky",
    continueGoogle: "Tiep tuc voi Google",
    facebook: "Facebook",
    divider: "hoac dang ky bang email",
    fullName: "Ho ten",
    fullNamePlaceholder: "Ho ten cua ban",
    email: "Email",
    emailPlaceholder: "name@company.com",
    password: "Mat khau",
    passwordPlaceholder: "Tao mat khau",
    rememberMe: "Ghi nho toi",
    forgotPassword: "Quen mat khau?",
    createAccountButton: "Tao tai khoan",
    alreadyHaveAccount: "Da co tai khoan?",
    loginNow: "Dang nhap ngay",
    enterName: "Vui long nhap ho ten",
    enterEmail: "Vui long nhap email",
    enterPassword: "Vui long nhap mat khau",
    somethingWrong: "Da co loi xay ra",
    facebookUnavailable: "Dang ky Facebook chua san sang",
  },
  EU: {
    login: "Login",
    signUp: "Sign Up",
    newAccount: "New Account",
    heroTitle: "Start with a new account in a cleaner experience.",
    heroText:
      "Create an account to access the admin panel, verify your email and continue managing content, products and orders.",
    simple: "Simple",
    fields: "3 Fields",
    fieldsText:
      "Create an account quickly with name, email and password in one compact form.",
    nextStep: "Next Step",
    verify: "Verify",
    verifyText:
      "After registration, the system will move you to the verification step.",
    createAccount: "Create account",
    subtitle: "Fill in the basic information to get started.",
    ready: "Ready",
    register: "Register",
    continueGoogle: "Continue with Google",
    facebook: "Facebook",
    divider: "or sign up with email",
    fullName: "Full name",
    fullNamePlaceholder: "Your full name",
    email: "Email",
    emailPlaceholder: "name@company.com",
    password: "Password",
    passwordPlaceholder: "Create a password",
    rememberMe: "Remember me",
    forgotPassword: "Forgot password?",
    createAccountButton: "Create account",
    alreadyHaveAccount: "Already have an account?",
    loginNow: "Login now",
    enterName: "Please enter full name",
    enterEmail: "Please enter email",
    enterPassword: "Please enter password",
    somethingWrong: "Something went wrong",
    facebookUnavailable: "Facebook sign up is not available yet",
  },
};

const SignUp = () => {
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingFb, setLoadingFb] = useState(false);
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formFields, setFormFields] = useState({
    name: "",
    email: "",
    password: "",
  });

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

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClickGoogle = () => {
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
            context.alertBox("error", res?.message || c.somethingWrong);
          }
        });
      })
      .catch((error) => {
        setLoadingGoogle(false);
        console.error("Google sign-up failed", {
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

  const validValue = Object.values(formFields).every((el) => el.trim() !== "");

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);

    if (formFields.name === "") {
      context.alertBox("error", c.enterName);
      setIsLoading(false);
      return false;
    }

    if (formFields.email === "") {
      context.alertBox("error", c.enterEmail);
      setIsLoading(false);
      return false;
    }

    if (formFields.password === "") {
      context.alertBox("error", c.enterPassword);
      setIsLoading(false);
      return false;
    }

    postData("/api/user/register", formFields).then((res) => {
      if (res?.error !== true) {
        setIsLoading(false);
        context.alertBox("success", res?.message);
        localStorage.setItem("userEmail", formFields.email);
        setFormFields({
          name: "",
          email: "",
          password: "",
        });
        navigate("/verify-account");
      } else {
        context.alertBox("error", res?.message || c.somethingWrong);
        setIsLoading(false);
      }
    });
  };

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
          <img src="/7_logo.jpg" alt="logo" className="h-10 w-auto sm:h-12" />
        </Link>

        <div className="flex items-center gap-2 rounded-full border border-white/60 bg-white/65 p-1 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur">
          <NavLink to="/login">
            <Button className="!rounded-full !px-4 !py-2 !text-[13px] !font-[700] !text-[rgba(0,0,0,0.75)] sm:!px-5">
              <CgLogIn className="mr-2 text-[17px]" />
              {c.login}
            </Button>
          </NavLink>
          <NavLink to="/sign-up">
            {({ isActive }) => (
              <Button
                className={`!rounded-full !px-4 !py-2 !text-[13px] !font-[700] sm:!px-5 ${
                  isActive
                    ? "!bg-[#14213d] !text-white"
                    : "!text-[rgba(0,0,0,0.75)]"
                }`}
              >
                {c.signUp}
              </Button>
            )}
          </NavLink>
        </div>
      </header>

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-80px)] w-full max-w-5xl grid-cols-1 gap-5 px-4 pb-5 pt-1 sm:px-5 lg:grid-cols-[0.95fr_0.72fr] lg:px-6">
        <div className="hidden rounded-[26px] border border-white/50 bg-[#14213d] p-6 text-white shadow-[0_20px_56px_rgba(20,33,61,0.22)] lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-[10px] font-[700] uppercase tracking-[0.2em] text-white/90">
              <HiOutlineSparkles className="text-[16px]" />
              {c.newAccount}
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
                {c.simple}
              </p>
              <p className="mt-2 text-[18px] font-[800]">{c.fields}</p>
              <p className="mt-2 text-[12px] leading-5 text-white/68">
                {c.fieldsText}
              </p>
            </div>
            <div className="rounded-[20px] border border-white/12 bg-[#f59e0b] p-3.5 text-[#1f2937]">
              <p className="text-[13px] font-[700] uppercase tracking-[0.18em] text-[#1f2937]/70">
                {c.nextStep}
              </p>
              <p className="mt-2 text-[18px] font-[800]">{c.verify}</p>
              <p className="mt-2 text-[12px] leading-5 text-[#1f2937]/80">
                {c.verifyText}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="w-full max-w-[390px] rounded-[24px] border border-white/70 bg-white/80 p-4 shadow-[0_20px_48px_rgba(20,33,61,0.14)] backdrop-blur-xl sm:p-5 lg:p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-[16px] bg-[linear-gradient(135deg,_#14213d,_#3872fa)] text-white shadow-[0_16px_30px_rgba(56,114,250,0.28)]">
                  <BsPersonPlus className="text-[17px]" />
                </div>
                <h2 className="text-[22px] font-[800] leading-tight text-[#14213d]">
                  {c.createAccount}
                </h2>
                <p className="mt-1.5 text-[13px] leading-5 text-slate-500">
                  {c.subtitle}
                </p>
              </div>

              <div className="hidden rounded-[18px] bg-[#f6f8ff] px-3 py-2 text-right sm:block">
                <p className="text-[11px] font-[700] uppercase tracking-[0.12em] text-slate-400">
                  {c.ready}
                </p>
                <p className="mt-1 text-[12px] font-[700] text-[#3872fa]">
                  {c.register}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Button
                onClick={handleClickGoogle}
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
                {c.divider}
              </span>
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <form className="space-y-3.5" onSubmit={handleSubmit}>
              <div>
                <label className="mb-1.5 block text-[13px] font-[700] text-slate-700">
                  {c.fullName}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formFields.name}
                  disabled={isLoading}
                  onChange={onChangeInput}
                  placeholder={c.fullNamePlaceholder}
                  className="h-[48px] w-full rounded-[18px] border border-slate-200 bg-[#fcfcfd] px-4 text-[13px] text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-[#3872fa] focus:bg-white focus:shadow-[0_0_0_4px_rgba(56,114,250,0.12)]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-[700] text-slate-700">
                  {c.email}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formFields.email}
                  disabled={isLoading}
                  onChange={onChangeInput}
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
                    disabled={isLoading}
                    onChange={onChangeInput}
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
                  className="font-[700] text-[#3872fa] transition-all hover:text-[#14213d]"
                >
                  {c.forgotPassword}
                </Link>
              </div>

              <Button
                type="submit"
                disabled={!validValue || isLoading}
                className="!mt-1 !flex !h-[50px] !w-full !items-center !justify-center !gap-2 !rounded-[18px] !bg-[linear-gradient(135deg,_#14213d,_#3872fa)] !text-[13px] !font-[800] !capitalize !text-white shadow-[0_18px_35px_rgba(56,114,250,0.28)] hover:!opacity-95 disabled:!bg-slate-300 disabled:!shadow-none"
              >
                {isLoading ? (
                  <CircularProgress color="inherit" size={22} />
                ) : (
                  <>
                    {c.createAccountButton}
                    <FaArrowRightLong className="text-[16px]" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-5 rounded-[18px] bg-[#f8f9fd] p-3.5 text-[12px] leading-5 text-slate-500">
              {c.alreadyHaveAccount}
              <Link
                to="/login"
                className="ml-2 font-[700] text-[#3872fa] hover:text-[#14213d]"
              >
                {c.loginNow}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
