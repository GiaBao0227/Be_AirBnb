// src/common/multer/local.multer.ts

import * as multer from 'multer';
import * as fs from 'fs';
import * as path from 'path';

// Đường dẫn đến thư mục sẽ lưu ảnh, nằm ở gốc dự án
// Ví dụ: D:/CycberSoft/Backend/Buoi_5/Be_AirBnb/public/img
const uploadPath = process.cwd() + '/public/img';

// Đảm bảo thư mục này tồn tại, nếu chưa có sẽ tự tạo
fs.mkdirSync(uploadPath, { recursive: true });

// Cấu hình nơi lưu trữ và tên file
const storage = multer.diskStorage({
  // Nơi đến để lưu file
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  // Đặt lại tên file để tránh trùng lặp
  filename: function (req, file, cb) {
    // Lấy phần mở rộng của file gốc (ví dụ: .jpg, .png)
    const fileExtName = path.extname(file.originalname);
    // Tạo một tên file độc nhất bằng cách kết hợp thời gian và một số ngẫu nhiên
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    // Tên file cuối cùng sẽ là: img-1678886400000-123456789.jpg
    cb(null, `img-${uniqueSuffix}${fileExtName}`);
  },
});

// Tạo cấu hình upload với storage đã định nghĩa và giới hạn kích thước file (ví dụ: 5MB)
const uploadLocal = {
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
};

// Xuất cấu hình này ra để các file khác có thể import và sử dụng
export default uploadLocal;
