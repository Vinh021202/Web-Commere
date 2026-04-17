import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { CgLogIn } from "react-icons/cg";
import { FaEyeSlash, FaRegEye } from "react-icons/fa";
import { HiOutlineLockClosed, HiOutlineSparkles } from "react-icons/hi2";
import { MyContext } from "../../App";
import { postData } from "../../utils/api";

const ChangePassword = () => {
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const [isPasswordShow2, setIsPasswordShow2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formFields, setFormFields] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const context = useContext(MyContext);
  const navigate = useNavigate();
  const email = localStorage.getItem("userEmail");

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const validValue = Object.values(formFields).every((el) => el.trim() !== "");

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email) {
      context.alertBox("error", "Session expired, please try again");
      setIsLoading(false);
      navigate("/login");
      return false;
    }

    if (formFields.newPassword === "") {
      context.alertBox("error", "Please enter new password");
      setIsLoading(false);
      return false;
    }

    if (formFields.confirmPassword === "") {
      context.alertBox("error", "Please enter confirm password");
      setIsLoading(false);
      return false;
    }

    if (formFields.confirmPassword !== formFields.newPassword) {
      context.alertBox("error", "Password and confirm password not match");
      setIsLoading(false);
      return false;
    }

    postData(`/api/user/forgot-password-reset`, {
      email,
      newPassword: formFields.newPassword,
      confirmPassword: formFields.confirmPassword,
    }).then((res) => {
      if (res?.error === false) {
        localStorage.removeItem("userEmail");
        localStorage.removeItem("actionType");
        context.alertBox("success", res?.message);
        setIsLoading(false);
        navigate("/login");
      } else {
        context.alertBox("error", res?.message || "Something went wrong");
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
              Login
            </Button>
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
              Password Update
            </div>

            <h1 className="max-w-[360px] font-[800] leading-[1.08] text-[30px]">
              Đặt lại mật khẩu mới để hoàn tất quá trình khôi phục.
            </h1>

            <p className="mt-4 max-w-[360px] text-[14px] leading-6 text-white/72">
              Sau khi nhập và xác nhận mật khẩu mới, hệ thống sẽ lưu thay đổi và
              đưa bạn quay lại màn hình đăng nhập.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[20px] border border-white/12 bg-white/8 p-3.5 backdrop-blur-sm">
              <p className="text-[13px] font-[700] uppercase tracking-[0.18em] text-white/55">
                Step 1
              </p>
              <p className="mt-2 text-[18px] font-[800]">New Password</p>
              <p className="mt-2 text-[12px] leading-5 text-white/68">
                Chọn một mật khẩu mới dễ nhớ với bạn và an toàn hơn.
              </p>
            </div>
            <div className="rounded-[20px] border border-white/12 bg-[#f59e0b] p-3.5 text-[#1f2937]">
              <p className="text-[13px] font-[700] uppercase tracking-[0.18em] text-[#1f2937]/70">
                Step 2
              </p>
              <p className="mt-2 text-[18px] font-[800]">Confirm</p>
              <p className="mt-2 text-[12px] leading-5 text-[#1f2937]/80">
                Xác nhận lại mật khẩu để tránh sai lệch trước khi hoàn tất.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="w-full max-w-[390px] rounded-[24px] border border-white/70 bg-white/80 p-4 shadow-[0_20px_48px_rgba(20,33,61,0.14)] backdrop-blur-xl sm:p-5 lg:p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-[16px] bg-[linear-gradient(135deg,_#14213d,_#3872fa)] text-white shadow-[0_16px_30px_rgba(56,114,250,0.28)]">
                  <HiOutlineLockClosed className="text-[17px]" />
                </div>
                <h2 className="text-[22px] font-[800] leading-tight text-[#14213d]">
                  Change password
                </h2>
                <p className="mt-1.5 text-[13px] leading-5 text-slate-500">
                  Nhập mật khẩu mới cho tài khoản của bạn.
                </p>
              </div>

              <div className="hidden rounded-[18px] bg-[#f6f8ff] px-3 py-2 text-right sm:block">
                <p className="text-[11px] font-[700] uppercase tracking-[0.12em] text-slate-400">
                  Account
                </p>
                <p className="mt-1 max-w-[120px] truncate text-[12px] font-[700] text-[#3872fa]">
                  {email || "No email"}
                </p>
              </div>
            </div>

            <form className="space-y-3.5" onSubmit={handleSubmit}>
              <div>
                <label className="mb-1.5 block text-[13px] font-[700] text-slate-700">
                  New password
                </label>
                <div className="relative">
                  <input
                    type={isPasswordShow ? "text" : "password"}
                    name="newPassword"
                    value={formFields.newPassword}
                    disabled={isLoading}
                    onChange={onChangeInput}
                    placeholder="Enter new password"
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

              <div>
                <label className="mb-1.5 block text-[13px] font-[700] text-slate-700">
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    type={isPasswordShow2 ? "text" : "password"}
                    name="confirmPassword"
                    value={formFields.confirmPassword}
                    disabled={isLoading}
                    onChange={onChangeInput}
                    placeholder="Confirm new password"
                    className="h-[48px] w-full rounded-[18px] border border-slate-200 bg-[#fcfcfd] px-4 pr-12 text-[13px] text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-[#3872fa] focus:bg-white focus:shadow-[0_0_0_4px_rgba(56,114,250,0.12)]"
                  />
                  <Button
                    type="button"
                    onClick={() => setIsPasswordShow2((prev) => !prev)}
                    className="!absolute !right-1.5 !top-[4px] !h-[40px] !min-w-[40px] !rounded-xl !text-slate-500"
                  >
                    {isPasswordShow2 ? (
                      <FaEyeSlash className="text-[18px]" />
                    ) : (
                      <FaRegEye className="text-[18px]" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={!validValue || isLoading}
                className="!mt-1 !flex !h-[50px] !w-full !items-center !justify-center !gap-2 !rounded-[18px] !bg-[linear-gradient(135deg,_#14213d,_#3872fa)] !text-[13px] !font-[800] !capitalize !text-white shadow-[0_18px_35px_rgba(56,114,250,0.28)] hover:!opacity-95 disabled:!bg-slate-300 disabled:!shadow-none"
              >
                {isLoading ? (
                  <CircularProgress color="inherit" size={22} />
                ) : (
                  "Change Password"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChangePassword;
