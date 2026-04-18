import { Button } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

const OrderSuccess = () => {
  return (
    <section className="w-full p-10 py-20 flex items-center justify-center flex-col gap-2">
      <img src="/check.png" width="120" alt="Dat hang thanh cong" />
      <h3 className="mb-0 text-[25px] ">Đơn hàng da duoc tao thanh cong</h3>
      <p className="mt-0">Cảm ơn bạn đã hoàn tất thanh toán.</p>
      <Link to={'/'}>
        <Button className="bg-org btn-border">Quay ve trang chu</Button>
      </Link>
    </section>
  );
};

export default OrderSuccess;
