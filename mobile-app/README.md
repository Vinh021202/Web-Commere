# Web-Commerce Mobile App

Folder này là giao diện mobile-first tách riêng từ `client`, chạy trực tiếp bằng HTML/CSS/JS.

## Cấu trúc

```text
mobile-app/
  assets/              # ảnh copy từ client/public
  src/
    components/        # Header, Hero, ProductCard, BottomNav, Sheets...
    data/              # icons và dữ liệu fallback
    state/             # store, cart, favorite, hydrate API
    utils/             # API, format tiền, storage, asset path
    App.js             # điều phối render và event
    main.js            # entry point
  index.html
  styles.css
  manifest.webmanifest
  service-worker.js
```

## Chạy nhanh

Chạy static server từ root repo:

```bash
node mobile-app/dev-server.js
```

Sau đó mở:

```text
http://localhost:4174/mobile-app/
```

Muốn mở trên điện thoại cùng mạng Wi-Fi, thay `localhost` bằng IP máy tính:

```text
http://<IP-may-tinh>:4174/mobile-app/
```

## Kết nối backend

Mặc định app gọi API tại:

```text
http://localhost:8000
```

Có thể đổi API bằng query string:

```text
http://localhost:4174/mobile-app/?api=http://<IP-may-tinh>:8000
```

Nếu backend chưa chạy hoặc API lỗi, app tự dùng dữ liệu mẫu trong folder `assets`.
