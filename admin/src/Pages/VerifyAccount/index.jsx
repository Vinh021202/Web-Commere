import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { CgLogIn } from "react-icons/cg";
import { HiOutlineShieldCheck, HiOutlineSparkles } from "react-icons/hi2";
import OtpBox from "../../Components/OtpBox";
import { MyContext } from "../../App";
import { postData } from "../../utils/api";

const copy = {
  VN: {
    login: "Dang nhap",
    signUp: "Dang ky",
    verification: "Xac thuc",
    heroTitle: "Nhap OTP de hoan tat buoc xac thuc cua ban.",
    heroText:
      "Ma xac thuc da duoc gui toi email cua ban. Sau buoc nay, ban se tiep tuc dang nhap hoac doi mat khau tuy theo flow hien tai.",
    currentFlow: "Luong hien tai",
    recovery: "Khoi phuc",
    register: "Dang ky",
    currentFlowText:
      "He thong se xu ly OTP theo dung hanh dong ban vua thuc hien.",
    destination: "Diem den",
    changePass: "Doi mat khau",
    verifyText: "Xac thuc thanh cong se tu dong chuyen ban sang buoc tiep theo.",
    verifyOtp: "Xac thuc OTP",
    subtitle: "Nhap 6 chu so da gui toi email cua ban.",
    sentTo: "Gui toi",
    noEmail: "Khong co email",
    otpSentTo: "OTP da gui toi",
    yourEmail: "email cua ban",
    verifyButton: "Xac thuc OTP",
    enterOtp: "Vui long nhap OTP",
    sessionExpired: "Phien da het han, vui long thu lai",
    somethingWrong: "Da co loi xay ra",
  },
  EU: {
    login: "Login",
    signUp: "Sign Up",
    verification: "Verification",
    heroTitle: "Enter OTP to complete your verification step.",
    heroText:
      "A verification code has been sent to your email. After this step, you will continue to login or reset your password depending on the current flow.",
    currentFlow: "Current Flow",
    recovery: "Recovery",
    register: "Register",
    currentFlowText:
      "The system will process the OTP according to the action you just performed.",
    destination: "Destination",
    changePass: "Change Pass",
    verifyText: "Successful verification will move you to the next step.",
    verifyOtp: "Verify OTP",
    subtitle: "Enter the 6 digits sent to your email.",
    sentTo: "Sent To",
    noEmail: "No email",
    otpSentTo: "OTP sent to",
    yourEmail: "your email",
    verifyButton: "Verify OTP",
    enterOtp: "Please enter OTP",
    sessionExpired: "Session expired, please try again",
    somethingWrong: "Something went wrong",
  },
};

const VerifyAccount = () => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const context = useContext(MyContext);
  const userEmail = localStorage.getItem("userEmail");
  const actionType = localStorage.getItem("actionType");
  const isForgotPasswordFlow = actionType === "forgot-password";
  const c = copy[context.language] || copy.VN;

  const handleOtpChange = (value) => {
    setOtp(value);
  };

  const verifyOTP = (e) => {
    e.preventDefault();

    if (otp === "") {
      context.alertBox("error", c.enterOtp);
      return;
    }

    if (!userEmail) {
      context.alertBox("error", c.sessionExpired);
      navigate("/login");
      return;
    }

    setIsLoading(true);

    const endpoint = isForgotPasswordFlow
      ? "/api/user/verify-forgot-password-otp"
      : "/api/user/verifyEmail";

    postData(endpoint, {
      email: userEmail,
      otp,
    }).then((res) => {
      if (res?.error === false) {
        context.alertBox("success", res?.message);

        if (isForgotPasswordFlow) {
          setIsLoading(false);
          navigate("/change-password");
        } else {
          localStorage.removeItem("userEmail");
          localStorage.removeItem("actionType");
          setIsLoading(false);
          navigate("/login");
        }
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
              {c.verification}
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
                {c.currentFlow}
              </p>
              <p className="mt-2 text-[18px] font-[800]">
                {isForgotPasswordFlow ? c.recovery : c.register}
              </p>
              <p className="mt-2 text-[12px] leading-5 text-white/68">
                {c.currentFlowText}
              </p>
            </div>
            <div className="rounded-[20px] border border-white/12 bg-[#f59e0b] p-3.5 text-[#1f2937]">
              <p className="text-[13px] font-[700] uppercase tracking-[0.18em] text-[#1f2937]/70">
                {c.destination}
              </p>
              <p className="mt-2 text-[18px] font-[800]">
                {isForgotPasswordFlow ? c.changePass : c.login}
              </p>
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
                  <HiOutlineShieldCheck className="text-[17px]" />
                </div>
                <h2 className="text-[22px] font-[800] leading-tight text-[#14213d]">
                  {c.verifyOtp}
                </h2>
                <p className="mt-1.5 text-[13px] leading-5 text-slate-500">
                  {c.subtitle}
                </p>
              </div>

              <div className="hidden rounded-[18px] bg-[#f6f8ff] px-3 py-2 text-right sm:block">
                <p className="text-[11px] font-[700] uppercase tracking-[0.12em] text-slate-400">
                  {c.sentTo}
                </p>
                <p className="mt-1 max-w-[120px] truncate text-[12px] font-[700] text-[#3872fa]">
                  {userEmail || c.noEmail}
                </p>
              </div>
            </div>

            <p className="mb-5 text-[12px] leading-5 text-slate-500">
              {c.otpSentTo}{" "}
              <span className="font-[700] text-[#14213d]">
                {userEmail || c.yourEmail}
              </span>
            </p>

            <form onSubmit={verifyOTP}>
              <div className="flex items-center justify-center">
                <OtpBox length={6} onChange={handleOtpChange} />
              </div>

              <Button
                type="submit"
                disabled={!otp || isLoading}
                className="!mt-6 !flex !h-[50px] !w-full !items-center !justify-center !gap-2 !rounded-[18px] !bg-[linear-gradient(135deg,_#14213d,_#3872fa)] !text-[13px] !font-[800] !capitalize !text-white shadow-[0_18px_35px_rgba(56,114,250,0.28)] hover:!opacity-95 disabled:!bg-slate-300 disabled:!shadow-none"
              >
                {isLoading ? (
                  <CircularProgress color="inherit" size={22} />
                ) : (
                  c.verifyButton
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VerifyAccount;
