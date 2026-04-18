import React, { useContext, useState } from 'react';
import TextField from '@mui/material/TextField';
import { FaRegEye } from 'react-icons/fa6';
import { Button } from '@mui/material';
import { IoEyeOff } from 'react-icons/io5';
import { HiOutlineLockClosed } from 'react-icons/hi2';
import { FiShield, FiCheckCircle } from 'react-icons/fi';
import { MyContext } from '../../App';
import { postData } from '../../utils/api';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';

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

const ForgotPassword = () => {
  const [isShowPassWord, setIsShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowPassWord2, setIsShowPassword2] = useState(false);
  const [formFields, setFormFields] = useState({
    email: localStorage.getItem('userEmail'),
    newPassword: '',
    confirmPassword: '',
  });

  const context = useContext(MyContext);
  const histoty = useNavigate();

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

    if (formFields.newPassword === '') {
      context.alertBox('error', 'Vui lòng nhập mật khẩu mới');
      setIsLoading(false);
      return false;
    }

    if (formFields.confirmPassword === '') {
      context.alertBox('error', 'Vui lòng nhập lại mật khẩu');
      setIsLoading(false);
      return false;
    }

    if (formFields.confirmPassword !== formFields.newPassword) {
      context.alertBox('error', 'Mật khẩu xác nhận không trùng khớp');
      setIsLoading(false);
      return false;
    }

    postData(`/api/user/forgot-password-reset`, formFields).then((res) => {
      if (res?.error === false) {
        localStorage.removeItem('userEmail');
        localStorage.removeItem('actionType');
        context.alertBox('success', res?.message);
        setIsLoading(false);
        histoty('/login');
      } else {
        context.alertBox('error', res?.message);
        setIsLoading(false);
      }
    });
  };

  return (
    <section className="min-h-screen pb-10 pt-[150px] md:pb-12 md:pt-[168px] xl:pt-[178px]">
      <div className="container">
        <div className="mx-auto flex w-full min-w-0 flex-col overflow-hidden rounded-[28px] border border-[rgba(255,82,82,0.12)] bg-white shadow-[0_20px_48px_rgba(15,23,42,0.12)] lg:grid lg:max-w-[980px] lg:grid-cols-[0.88fr_1.12fr]">
          <div className="relative min-w-0 overflow-hidden bg-[linear-gradient(135deg,#111827_0%,#1f2937_48%,#ff5252_100%)] px-5 py-7 text-white md:px-8 md:py-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_24%)]" />
            <div className="relative z-10">
              <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-[700] uppercase tracking-[0.14em] text-white/90">
                Đặt lại mật khẩu
              </span>
              <h1 className="mt-4 max-w-[390px] text-[28px] font-[800] leading-tight md:text-[36px]">
                Tạo mật khẩu mới an toàn hơn cho tài khoản.
              </h1>
              <p className="mt-3 max-w-[410px] text-[14px] leading-6 text-white/80">
                Đặt mật khẩu mới để bạn dễ nhớ hơn nhưng vẫn giữ tài khoản an toàn.
              </p>

              <div className="mt-6 grid gap-3">
                <div className="rounded-[20px] border border-white/14 bg-white/10 p-4 backdrop-blur">
                  <FiShield className="text-[24px]" />
                  <h3 className="mt-3 text-[14px] font-[700]">Bảo mật tốt hơn</h3>
                  <p className="mb-0 mt-2 text-[12px] leading-6 text-white/75">
                    Sử dụng mật khẩu riêng và khó đoán hơn để bảo vệ tài khoản.
                  </p>
                </div>
                <div className="rounded-[20px] border border-white/14 bg-white/10 p-4 backdrop-blur">
                  <FiCheckCircle className="text-[24px]" />
                  <h3 className="mt-3 text-[14px] font-[700]">Xác nhận lại</h3>
                  <p className="mb-0 mt-2 text-[12px] leading-6 text-white/75">
                    Nhập lại mật khẩu mới để tránh nhầm lẫn khi đặt lại.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="min-w-0 bg-[linear-gradient(180deg,#fff_0%,#fff8f5_100%)] px-5 py-7 sm:px-7 md:px-8 md:py-8">
            <div className="mx-auto flex min-w-0 max-w-[460px] flex-col">
              <div className="mb-7">
                <p className="mb-2 text-[12px] font-[700] uppercase tracking-[0.16em] text-[#ff5252]">
                  Khôi phục mật khẩu
                </p>
                <h2 className="text-[28px] font-[800] leading-tight text-[#1f2937] md:text-[30px]">
                  Đặt mật khẩu mới
                </h2>
                <p className="mb-0 mt-3 text-[13px] leading-6 text-[#6b7280]">
                  Mật khẩu sẽ được cập nhật cho <span className="font-[700] text-[#1f2937]">{formFields.email}</span>.
                </p>
              </div>

              <div className="mb-6 rounded-[22px] border border-[rgba(255,82,82,0.12)] bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)] md:p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-[#fff1f1] text-[#ff5252]">
                    <HiOutlineLockClosed className="text-[22px]" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-[700] text-[#1f2937]">Thông tin mới</h3>
                    <p className="mb-0 mt-1 text-[13px] text-[#6b7280]">
                      Chọn mật khẩu bạn chưa từng sử dụng trước đây.
                    </p>
                  </div>
                </div>

                <form className="w-full" onSubmit={handleSubmit}>
                  <div className="relative mb-4 w-full">
                    <TextField
                      type={isShowPassWord === false ? 'password' : 'text'}
                      id="password"
                      label="Mật khẩu mới*"
                      variant="outlined"
                      className="w-full"
                      name="newPassword"
                      value={formFields.newPassword}
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

                  <div className="relative mb-4 w-full">
                    <TextField
                      type={isShowPassWord2 === false ? 'password' : 'text'}
                      id="confirm_password"
                      label="Xác nhận mật khẩu*"
                      variant="outlined"
                      className="w-full"
                      name="confirmPassword"
                      value={formFields.confirmPassword}
                      disabled={isLoading}
                      onChange={onChangeInput}
                      sx={inputSx}
                    />
                    <Button
                      className="!absolute right-[10px] top-[10px] z-50 !h-[36px] !min-w-[36px] !w-[36px] !rounded-full !text-black/70"
                      onClick={() => setIsShowPassword2(!isShowPassWord2)}
                    >
                      {isShowPassWord2 === false ? (
                        <FaRegEye className="text-[18px] opacity-75" />
                      ) : (
                        <IoEyeOff className="text-[18px] opacity-75" />
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center w-full">
                    <Button type="submit" disabled={!valideValue} className="bg-org flex w-full gap-3 !text-[16px]">
                      {isLoading === true ? <CircularProgress color="inherit" /> : 'Đổi mật khẩu'}
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

export default ForgotPassword;
