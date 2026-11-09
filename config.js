/* Chỉ cần sửa file này và thay ảnh trong assets/photos.
   TẤT CẢ thông tin dưới đây là dữ liệu mẫu, chưa phải thiệp chính thức. */
window.WEDDING_CONFIG = {
  bride: { name: 'Cô Dâu', fullName: 'Tên đầy đủ cô dâu', father: 'Họ tên bố cô dâu', mother: 'Họ tên mẹ cô dâu', address: 'Địa chỉ nhà gái', photo: './assets/photos/bride.jpg' },
  groom: { name: 'Chú Rể', fullName: 'Tên đầy đủ chú rể', father: 'Họ tên bố chú rể', mother: 'Họ tên mẹ chú rể', address: 'Địa chỉ nhà trai', photo: './assets/photos/groom.jpg' },
  invitation: 'TRÂN TRỌNG BÁO TIN\nLỄ THÀNH HÔN CỦA CON CHÚNG TÔI',
  // Định dạng ISO có múi giờ Việt Nam; đổi ngày này sẽ tự cập nhật lịch và đếm ngược.
  date: '2026-12-20T11:00:00+07:00',
  lunarDate: 'Ngày âm lịch của lễ cưới',
  welcomeTime: '10:30',
  endTime: '13:00',
  venue: { name: 'Tên địa điểm tổ chức', address: 'Địa chỉ đầy đủ của nơi tổ chức tiệc cưới', mapsUrl: '', embedUrl: '' },
  timeline: [
    { time: '10:30', title: 'Đón khách' },
    { time: '11:00', title: 'Khai tiệc' },
    { time: '11:30', title: 'Rót rượu, cắt bánh' }
  ],
  photos: ['./assets/photos/01.jpg', './assets/photos/02.jpg', './assets/photos/03.jpg', './assets/photos/04.jpg', './assets/photos/05.jpg'],
  // Đặt file nhạc bạn chọn vào assets/music.mp3 rồi nhập './assets/music.mp3'.
  music: '',
  closing: 'Sự hiện diện của quý khách là niềm vinh hạnh của gia đình chúng tôi!',
  // Tên khách mời tùy chọn: ?guest=Anh%20Chị hoặc nhập tại đây.
  guestName: '',
  // Để trống: lời chúc chỉ lưu trên thiết bị. Xem README để bật lưu chung.
  guestbook: { supabaseUrl: '', supabaseAnonKey: '', invitationId: 'damcuoibachthu' }
};
