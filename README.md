# Web-Commere

## Giới thiệu

`Web-Commere` là một dự án web thương mại điện tử full-stack gồm:

- `client`: giao diện người dùng mua sắm
- `admin`: trang quản trị sản phẩm, đơn hàng, danh mục và nội dung
- `server`: REST API xử lý nghiệp vụ, xác thực, thanh toán và dữ liệu

## Project này dùng để làm gì?

Project này dùng để xây dựng một hệ thống bán hàng online hoàn chỉnh, nơi:

- Khách hàng có thể đăng ký, đăng nhập, xem sản phẩm, thêm vào giỏ hàng, thanh toán và theo dõi đơn hàng
- Quản trị viên có thể quản lý sản phẩm, danh mục, banner, blog, người dùng và đơn hàng

## Giải quyết vấn đề gì?

Dự án giải quyết nhu cầu xây dựng một nền tảng e-commerce có đầy đủ các chức năng cơ bản:

- Quản lý sản phẩm và danh mục tập trung
- Tạo trải nghiệm mua sắm online cho người dùng
- Quản lý đơn hàng và thanh toán
- Tách riêng khu vực khách hàng và khu vực quản trị để dễ mở rộng và bảo trì

## Link demo

- Client: `Cập nhật link demo tại đây`
- Admin: `Cập nhật link demo tại đây`
- API: `Cập nhật link demo tại đây`

## Tính năng

- Đăng ký, đăng nhập, xác thực email
- Quên mật khẩu và đổi mật khẩu
- Đăng nhập Google
- Hiển thị danh mục, sản phẩm, banner, blog
- Tìm kiếm, lọc và sắp xếp sản phẩm
- Xem chi tiết sản phẩm và đánh giá
- Giỏ hàng và danh sách yêu thích
- Quản lý địa chỉ giao hàng
- Thanh toán bằng Stripe, PayPal và COD
- Theo dõi và quản lý đơn hàng
- Dashboard admin quản lý sản phẩm, đơn hàng, người dùng, banner, blog

## Công nghệ sử dụng

### Frontend

- React 19
- Vite
- Tailwind CSS
- Material UI
- React Router
- Axios

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT Authentication
- Multer
- Cloudinary

### Thanh toán và dịch vụ ngoài

- Stripe
- PayPal
- Firebase
- Nodemailer / Resend

## Cài đặt

### 1. Clone project

```bash
git clone <repo-url>
cd Web-Commere
```

### 2. Cài dependencies

```bash
cd client
npm install

cd ../admin
npm install

cd ../server
npm install
```

### 3. Cấu hình môi trường

Tạo file `.env` cho từng app:

- `client/.env`
- `admin/.env`
- `server/.env`

Ví dụ các biến môi trường thường cần:

```env
# client/admin
VITE_API_URL=http://localhost:8000
VITE_APP_STRIPE_ID=your_stripe_publishable_key
VITE_APP_PAYPAL_CLIENT_ID=your_paypal_client_id

# server
PORT=8000
MONGODB_URI=your_mongodb_connection_string
SECRET_KEY_ACCESS_TOKEN=your_access_secret
SECRET_KEY_REFRESH_TOKEN=your_refresh_secret
STRIPE_SECRET=your_stripe_secret
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
PAYPAL_CLIENT_ID_TEST=your_paypal_client_id
PAYPAL_SECRET_TEST=your_paypal_secret
```

Ngoài ra dự án còn có thể cần thêm cấu hình cho email, Cloudinary và Firebase tùy môi trường chạy.

## Cách chạy

Mở 3 terminal riêng và chạy lần lượt:

### Chạy server

```bash
cd server
npm run dev
```

### Chạy client

```bash
cd client
npm run dev
```

### Chạy admin

```bash
cd admin
npm run dev
```

Sau khi chạy:

- Client thường ở: `http://localhost:5173`
- Admin thường ở: `http://localhost:5174` hoặc cổng Vite kế tiếp
- Server API thường ở: `http://localhost:8000`

## Cấu trúc thư mục

```text
Web-Commere/
├─ client/    # Giao diện người dùng
├─ admin/     # Trang quản trị
└─ server/    # API và xử lý dữ liệu
```

## Đóng góp

Nếu muốn đóng góp cho project:

1. Fork repository
2. Tạo branch mới cho tính năng hoặc bugfix
3. Commit thay đổi
4. Push branch lên repository của bạn
5. Tạo Pull Request

## License

Hiện tại project chưa khai báo license cụ thể.

Nếu muốn public hoặc dùng cho cộng đồng, bạn có thể bổ sung một license như `MIT`.
