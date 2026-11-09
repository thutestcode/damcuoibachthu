# Thiệp cưới — damcuoibachthu

Website HTML/CSS/JavaScript thuần dựng theo bố cục thiệp mẫu https://chungdoi.com/i/thuuyen-tunglam. Không cần cài thư viện để chạy.

**Đây là bản dựng đầu tiên. Tên, ngày 20/12/2026 và địa chỉ là dữ liệu minh họa. Ảnh là ảnh mẫu để đối chiếu bố cục, cần thay bằng ảnh của bạn trước khi gửi thiệp chính thức.**

## Thay nội dung

Mở `config.js`, sửa:

| Mục | Trường |
| --- | --- |
| Cô dâu, chú rể | `bride`, `groom`: tên, họ tên đầy đủ, tên bố mẹ, địa chỉ, ảnh chân dung |
| Lời mời | `invitation` |
| Ngày giờ | `date` có đuôi `+07:00`, `welcomeTime`, `endTime` |
| Ngày âm lịch | `lunarDate` nhập thủ công |
| Nơi tổ chức | `venue.name`, `venue.address`, `venue.mapsUrl`, `venue.embedUrl` |
| Lịch trình | `timeline` |
| Album | `photos` — thêm bao nhiêu ảnh cũng được |
| Nhạc | `music` — đường dẫn MP3; để trống sẽ ẩn nút nhạc |
| Lời kết | `closing` |

Thay ảnh trong `assets/photos/` và giữ nguyên tên file, hoặc sửa đường dẫn trong `config.js`. Dùng đường dẫn tương đối `./assets/...` để hoạt động khi repo nằm trong một thư mục con trên GitHub Pages.

`venue.mapsUrl` là link chỉ đường Google Maps. `venue.embedUrl` là URL `src` từ Google Maps → Chia sẻ → Nhúng bản đồ, không dán cả thẻ iframe. Chưa có địa chỉ chính thức thì để trống hai mục này; website hiển thị chỗ chờ bản đồ và ẩn nút chỉ đường.

Đặt nhạc của bạn vào `assets/music.mp3` rồi sửa `music: './assets/music.mp3'`. Nhạc bắt đầu sau khi khách bấm Mở thiệp, tùy chính sách phát âm thanh của trình duyệt; luôn có nút bật/tắt khi đã cấu hình nhạc. Không kèm file nhạc mẫu.

Tên khách mời tùy chọn: thêm `?guest=Anh%20Ch%E1%BB%8B` sau link website hoặc sửa `guestName`. `?open=1` bỏ qua bìa thiệp, không tự phát nhạc.

## Chạy và kiểm tra

Có thể mở `index.html` trực tiếp để xem giao diện. Để kiểm tra kết nối sổ lưu bút, nên dùng một máy chủ HTTP, ví dụ tiện ích Live Server của trình soạn thảo.

```sh
npm run check
npm run build
```

Build tạo `dist/` để dùng với dịch vụ hosting tĩnh. Không có dependency, không cần `npm install`. Các file gốc cũng chạy trực tiếp khi xuất bản từ thư mục gốc repo.

## GitHub Pages

Trong repo chọn **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: main → /(root) → Save**. GitHub sẽ hiển thị URL website sau khi triển khai xong.

File `.nojekyll` đã có sẵn. Chưa tự bật GitHub Pages hoặc cấu hình tên miền trong lần dựng code này.

Hướng dẫn chính thức: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Sổ lưu bút

Mặc định là **chế độ xem thử**: lời chúc chỉ lưu trong localStorage của trình duyệt đang dùng. Không có lời chúc giả dựng sẵn. Nút đũa phép lấy gợi ý từ một danh sách câu chúc, không gọi AI.

Để mọi khách cùng xem được lời chúc:

1. Chuẩn bị một dự án Supabase và chạy `supabase-guestbook.sql` trong SQL Editor.
2. Điền URL dự án và **legacy anon public key** vào `guestbook.supabaseUrl` và `guestbook.supabaseAnonKey` trong `config.js`.
3. Giữ `invitationId: 'damcuoibachthu'` khớp với điều kiện trong SQL.
4. Thử gửi và đọc lời chúc từ hai trình duyệt khác nhau trước khi dùng chính thức.

Không đưa `service_role` key, secret key hoặc mật khẩu database vào code trình duyệt. Mẫu SQL cho khách đọc và thêm lời chúc của thiệp này, không cho sửa hoặc xóa. Lời chúc là nội dung công khai. Chưa tích hợp kiểm duyệt, CAPTCHA hoặc giới hạn tần suất phía máy chủ; nếu cần nhận lời chúc công khai lâu dài, nên bổ sung bước này.

Chưa kiểm thử trực tiếp với Supabase vì chưa có cấu hình dự án. Khi lỗi gửi, nội dung trong ô vẫn được giữ để thử lại.

Hướng dẫn Supabase: https://supabase.com/docs/guides/api/securing-your-api

## Các file chính

- `index.html`: cấu trúc thiệp, nhãn hỗ trợ bàn phím và trình đọc màn hình.
- `styles.css`: bìa, hoa lá, bố cục desktop/mobile, album, lịch và form.
- `main.js`: tạo nội dung từ cấu hình, đếm ngược theo múi giờ Việt Nam, calendar link, album/phím mũi tên/vuốt, nhạc, lời chúc.
- `config.js`: nội dung cần thay.
- `assets/`: ảnh và trang trí đã lưu cục bộ.
- `build.mjs`: sao chép bản tĩnh vào `dist/`.

## Tài nguyên tham chiếu

Ảnh mẫu và hai hình trang trí được lấy từ trang thiệp tham chiếu của Chung Đôi để đối chiếu theo yêu cầu. Bản dựng không sao chép mã ứng dụng, API, khóa bản đồ hoặc dữ liệu sổ lưu bút của trang gốc. Ảnh đã giảm kích thước để tải nhẹ hơn. Ghi nhận nguồn không có nghĩa là cấp lại giấy phép cho tài nguyên của bên thứ ba; thay ảnh mẫu bằng ảnh của bạn và sử dụng tài nguyên trang trí phù hợp quyền sử dụng trước khi phát hành chính thức.
