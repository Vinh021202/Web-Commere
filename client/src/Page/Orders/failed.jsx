import { Button } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

const OrderFailed = () => {
  return (
    <section className="w-full p-10 py-20 flex items-center justify-center flex-col gap-2">
      <img src="/delete.png" width="120" alt="Dat hang that bai" />
      <h3 className="mb-0 text-[25px] ">Đơn hàng that bai</h3>
      <p className="mt-0">Đã có lỗi xảy ra trong quá trình đặt hàng.</p>
      <Link to={'/'}>
        <Button className="bg-org btn-border">Quay ve trang chu</Button>
      </Link>
    </section>
  );
};

export default OrderFailed;
