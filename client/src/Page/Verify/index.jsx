import React, { useContext, useMemo, useState } from 'react';
import { Button } from '@mui/material';
import { HiOutlineShieldCheck } from 'react-icons/hi2';
import { FiMail, FiKey } from 'react-icons/fi';
import OtpBox from '../../componets/OtpBox';
import { postData } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../../App';

const Verify = () => {
  const [otp, setOtp] = useState('');
  const history = useNavigate();
  const context = useContext(MyContext);

  const actionType = localStorage.getItem('actionType');
  const userEmail = localStorage.getItem('userEmail');
  const isForgotPasswordFlow = actionType === 'forgot-password';

  const pageCopy = useMemo(() => {
    if (isForgotPasswordFlow) {
      return {
        badge: 'Xác minh bảo mật',
        title: 'Xác minh mã đặt lại',
        subtitle: 'Nhập mã OTP đã được gửi tới email của bạn để tiếp tục khôi phục mật khẩu.',
        button: 'Xác minh mã',
        sideTitle: 'Chỉ còn một bước nữa trước khi đặt lại mật khẩu.',
        sideText: 'Mã xác minh giúp chúng tôi xác nhận yêu cầu đặt lại mật khẩu này là của bạn.',
      };
    }

    return {
      badge: 'Xác nhận email',
      title: 'Xác minh tài khoản',
      subtitle: 'Nhập mã OTP đã được gửi tới email của bạn để hoàn tất đăng ký và kích hoạt tài khoản.',
      button: 'Xác minh OTP',
      sideTitle: 'Tài khoản của bạn đã gần sẵn sàng.',
      sideText: 'Sử dụng mã xác minh trong hộp thư để hoàn tất thiết lập và mở khóa tài khoản.',
    };
  }, [isForgotPasswordFlow]);

  const handleOtpChange = (value) => {
    setOtp(value);
  };

  const verityOTP = (e) => {
    e.preventDefault();

    if (!isForgotPasswordFlow) {
      postData('/api/user/verifyEmail', {
        email: userEmail,
        otp: otp,
      }).then((res) => {
        if (res?.error === false) {
          context.alertBox('success', res?.message);
          localStorage.removeItem('userEmail');
          history('/login');
        } else {
          context.alertBox('error', res?.message);
        }
      });
    } else {
      postData('/api/user/verify-forgot-password-otp', {
        email: userEmail,
        otp: otp,
      }).then((res) => {
        if (res?.error === false) {
          context.alertBox('success', res?.message);
          history('/forgot-password');
        } else {
          context.alertBox('error', res?.message);
        }
      });
    }
  };

  return (
    <section className="min-h-screen pb-10 pt-[150px] md:pb-12 md:pt-[168px] xl:pt-[178px]">
      <div className="container">
        <div className="mx-auto flex w-full min-w-0 flex-col overflow-hidden rounded-[28px] border border-[rgba(255,82,82,0.12)] bg-white shadow-[0_20px_48px_rgba(15,23,42,0.12)] lg:grid lg:max-w-[980px] lg:grid-cols-[0.88fr_1.12fr]">
          <div className="relative min-w-0 overflow-hidden bg-[linear-gradient(135deg,#1f2937_0%,#111827_40%,#ff5252_100%)] px-5 py-7 text-white md:px-8 md:py-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_24%)]" />
            <div className="relative z-10">
              <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-[700] uppercase tracking-[0.14em] text-white/90">
                {pageCopy.badge}
              </span>
              <h1 className="mt-4 max-w-[390px] text-[28px] font-[800] leading-tight md:text-[36px]">
                {pageCopy.sideTitle}
              </h1>
              <p className="mt-3 max-w-[410px] text-[14px] leading-6 text-white/80">
                {pageCopy.sideText}
              </p>

              <div className="mt-6 grid gap-3">
                <div className="rounded-[20px] border border-white/14 bg-white/10 p-4 backdrop-blur">
                  <FiMail className="text-[24px]" />
                  <h3 className="mt-3 text-[14px] font-[700]">Kiểm tra hộp thư</h3>
                  <p className="mb-0 mt-2 text-[12px] leading-6 text-white/75">
                    Chúng tôi đã gửi mã gồm 6 chữ số tới email đang được sử dụng.
                  </p>
                </div>
                <div className="rounded-[20px] border border-white/14 bg-white/10 p-4 backdrop-blur">
                  <HiOutlineShieldCheck className="text-[24px]" />
                  <h3 className="mt-3 text-[14px] font-[700]">Xác minh nhanh</h3>
                  <p className="mb-0 mt-2 text-[12px] leading-6 text-white/75">
                    Nhập mã một lần để tiếp tục an toàn sang bước kế tiếp.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="min-w-0 bg-[linear-gradient(180deg,#fff_0%,#fff8f5_100%)] px-5 py-7 sm:px-7 md:px-8 md:py-8">
            <div className="mx-auto flex min-w-0 max-w-[460px] flex-col">
              <div className="mb-7">
                <p className="mb-2 text-[12px] font-[700] uppercase tracking-[0.16em] text-[#ff5252]">
                  Xác nhận OTP
                </p>
                <h2 className="text-[28px] font-[800] leading-tight text-[#1f2937] md:text-[30px]">
                  {pageCopy.title}
                </h2>
                <p className="mb-0 mt-3 text-[13px] leading-6 text-[#6b7280]">
                  {pageCopy.subtitle}
                </p>
              </div>

              <div className="mb-6 rounded-[22px] border border-[rgba(255,82,82,0.12)] bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)] md:p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-[#fff1f1] text-[#ff5252]">
                    <FiKey className="text-[22px]" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-[700] text-[#1f2937]">Email nhận mã</h3>
                    <p className="mb-0 mt-1 text-[13px] text-[#6b7280]">{userEmail || 'Không tìm thấy email'}</p>
                  </div>
                </div>

                <form onSubmit={verityOTP}>
                  <OtpBox length={6} onChange={handleOtpChange} />

                  <div className="mt-6 flex items-center justify-center">
                    <Button type="submit" disabled={otp.length !== 6} className="w-full bg-org !text-[16px]">
                      {pageCopy.button}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Verify;
