# Thiệp cưới Anh Thư & Thanh Bách

Thiệp mời lễ thành hôn **Nguyễn Anh Thư & Đồng Thanh Bách**, lúc **7:00, Thứ Ba ngày 24/11/2026**, tức **16 tháng 10 năm Bính Ngọ**.

Tông burgundy, nền kem, hoa màu nước burgundy – hồng phấn – trắng ngà. Giữ bìa mở thiệp và bố cục chân dung nghiêng. Hai khung ảnh đang để trống theo yêu cầu, không tải ảnh mẫu.

## Nội dung hiện tại

- Thông tin hai bên gia đình, lời mời và họ tên cô dâu – chú rể.
- Ngày giờ lễ cưới và ngày âm lịch.
- Timeline: 7:00 lễ ăn hỏi tại nhà gái; 10:00 lễ đón dâu tại nhà trai; 12:00 bữa cơm thân mật.
- Địa chỉ dưới mô tả mỗi mốc; link Google Maps ở hai mốc tại Ocean Park 3.
- Lời kết “Sự hiện diện…” và “Trân trọng cảm ơn!”.

Đã bỏ album, đón khách/khai tiệc, đếm ngược, lịch tháng, nút thêm lịch, khu vực địa điểm/bản đồ riêng và sổ lưu bút. Website không dùng database hoặc localStorage.

## Sửa nội dung hoặc thêm ảnh sau

Mở `config.js`:

| Mục | Trường |
| --- | --- |
| Tên và thông tin gia đình | `bride`, `groom` |
| Thêm ảnh cô dâu | `bride.photo: './assets/photos/bride.jpg'` |
| Thêm ảnh chú rể | `groom.photo: './assets/photos/groom.jpg'` |
| Lời mời | `invitation` |
| Ngày giờ | `date`, có múi giờ `+07:00` |
| Ngày âm lịch | `lunarDate`, nhập thủ công |
| Lịch trình | `timeline`, mỗi mục có `time`, `title`, `address` |
| Google Maps | `mapsQuery` hoặc `mapsUrl` ở từng mục lịch trình |
| Nhạc tùy chọn | `music`, để trống sẽ ẩn nút nhạc |
| Lời kết | `closing` |

Để ảnh trống, giữ `photo: ''`. Để thêm ảnh, tải ảnh vào `assets/photos/` rồi điền đường dẫn. Khung sẽ tự hiển thị ảnh khi cấu hình có giá trị. Dùng đường dẫn tương đối `./assets/...` để chạy trên GitHub Pages của repo.

Hai link Maps hiện mở **tìm kiếm theo đúng địa chỉ đã cung cấp**, chưa phải ghim tọa độ được xác minh của căn AD-14. Nếu có link ghim Google Maps chính xác, điền vào `mapsUrl`; trường này được ưu tiên trước `mapsQuery`.

Có thể đặt tên khách mời qua `?guest=Anh%20Ch%E1%BB%8B` hoặc `guestName`. `?open=1` mở thẳng nội dung thiệp.

Đặt MP3 vào `assets/music.mp3` rồi sửa `music: './assets/music.mp3'` để bật nhạc sau khi bấm mở thiệp. Hiện chưa có file nhạc.

## Chạy và xuất bản

HTML, CSS và JavaScript thuần, không có dependency. Mở `index.html` để xem hoặc dùng Live Server.

```sh
npm run check
npm run build
```

Build sao chép website vào `dist/`. GitHub Pages cũng có thể chạy trực tiếp các file ở thư mục gốc repo.

Để bật GitHub Pages: **Settings → Pages → Source: Deploy from a branch → Branch: main → /(root) → Save**. Giữ nguyên thiết lập nếu đã bật trước đó.

Hướng dẫn chính thức: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Thiết kế và tài nguyên

`assets/decorations/burgundy-flowers.png` là hoa trang trí mới tạo cho thiệp này, nền trong suốt, phong cách màu nước: cosmos màu rượu vang, hoa đậu thơm hồng phấn, hồng trắng ngà và lá màu taupe nhạt. Được dùng lại ở góc bìa, dải nền và các họa tiết chìm. Không dùng hoa xanh hoặc ảnh chân dung mẫu từ phiên bản trước.

Bố cục ban đầu tham khảo thiệp https://chungdoi.com/i/thuuyen-tunglam; mã ứng dụng được viết riêng. Không dùng API, dữ liệu khách mời hoặc khóa bản đồ từ trang tham chiếu.

