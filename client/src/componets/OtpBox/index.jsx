import React, { useState } from 'react';

const OtpBox = ({ length, onChange }) => {
  const [otp, setOtp] = useState(new Array(length).fill(''));

  const handleChange = (element, index) => {
    const value = element.value;
    if (isNaN(value)) return; // Chỉ cho phép số

    const newOTP = [...otp];
    newOTP[index] = value;
    setOtp(newOTP);
    onChange(newOTP.join(''));

    // Tự động focus sang ô tiếp theo
    if (value && index < length - 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Nếu Backspace mà ô rỗng thì quay lại ô trước
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  return (
    <div className="otpBox flex flex-wrap justify-center gap-2 sm:gap-[5px]">
      {otp.map((data, index) => (
        <input
          key={index}
          id={`otp-input-${index}`}
          type="text"
          maxLength="1"
          value={otp[index]}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="h-[44px] w-[40px] rounded-[12px] text-center text-[17px] sm:h-[45px] sm:w-[45px]"
        />
      ))}
    </div>
  );
};

export default OtpBox;
