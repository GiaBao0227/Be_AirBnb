CREATE TABLE ViTri (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ten_vi_tri VARCHAR(255) NOT NULL,
  tinh_thanh VARCHAR(100),
  quoc_gia VARCHAR(100),
  hinh_anh VARCHAR(500),

  -- Audit fields
  deletedBy INT NOT NULL DEFAULT 0,
  isDeleted TINYINT(1) NOT NULL DEFAULT 0,
  deletedAt TIMESTAMP NULL DEFAULT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;


-- 2. Bảng Người Dùng
CREATE TABLE NguoiDung (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  pass_word VARCHAR(255) NOT NULL, -- Nhớ hash mật khẩu trước khi lưu!
  phone VARCHAR(20),
  birth_day DATE,
  gender ENUM('male','female','other'),
  role VARCHAR(50) DEFAULT 'guest', -- Có thể là 'user', 'admin', etc.

  -- Audit fields
  deletedBy INT NOT NULL        DEFAULT 0,
  isDeleted TINYINT(1) NOT NULL  DEFAULT 0,
  deletedAt TIMESTAMP           NULL DEFAULT NULL,
  createdAt TIMESTAMP NOT NULL   DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL   DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Bảng Phòng
CREATE TABLE Phong (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ten_phong VARCHAR(255) NOT NULL,
  khach INT NOT NULL DEFAULT 1,
  phong_ngu INT NOT NULL DEFAULT 1,
  giuong INT NOT NULL DEFAULT 1,
  phong_tam INT NOT NULL DEFAULT 1,
  mo_ta TEXT,
  gia_tien DECIMAL(12,2) NOT NULL, -- Phù hợp cho giá tiền
  may_giat BOOLEAN DEFAULT FALSE,
  ban_la BOOLEAN DEFAULT FALSE,
  tivi BOOLEAN DEFAULT FALSE,
  dieu_hoa BOOLEAN DEFAULT FALSE,
  wifi BOOLEAN DEFAULT FALSE,
  bep BOOLEAN DEFAULT FALSE,
  do_xe BOOLEAN DEFAULT FALSE,
  ho_boi BOOLEAN DEFAULT FALSE,
  ban_ui BOOLEAN DEFAULT FALSE,
  hinh_anh VARCHAR(500),

  vi_tri_id INT NOT NULL,
  CONSTRAINT fk_Phong_ViTri
    FOREIGN KEY (vi_tri_id) REFERENCES ViTri(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT, -- Ngăn xóa Vị Trí nếu còn Phòng tham chiếu (an toàn)

  -- Audit fields
  deletedBy INT NOT NULL        DEFAULT 0,
  isDeleted TINYINT(1) NOT NULL  DEFAULT 0,
  deletedAt TIMESTAMP           NULL DEFAULT NULL,
  createdAt TIMESTAMP NOT NULL   DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL   DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 4. Bảng Đặt Phòng
CREATE TABLE DatPhong (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ma_phong INT NOT NULL,
  ngay_den DATETIME NOT NULL,
  ngay_di DATETIME NOT NULL,
  so_luong_khach INT NOT NULL DEFAULT 1,
  ma_nguoi_dat INT NOT NULL,

  CONSTRAINT fk_DatPhong_Phong
    FOREIGN KEY (ma_phong) REFERENCES Phong(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE, -- Nếu Phòng bị xóa (hard delete), Đặt Phòng liên quan cũng bị xóa
  CONSTRAINT fk_DatPhong_NguoiDung
    FOREIGN KEY (ma_nguoi_dat) REFERENCES NguoiDung(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE, -- Nếu Người Dùng bị xóa (hard delete), Đặt Phòng của họ cũng bị xóa

  -- Audit fields
  deletedBy INT NOT NULL        DEFAULT 0,
  isDeleted TINYINT(1) NOT NULL  DEFAULT 0,
  deletedAt TIMESTAMP           NULL DEFAULT NULL,
  createdAt TIMESTAMP NOT NULL   DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL   DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 5. Bảng Bình Luận
CREATE TABLE BinhLuan (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ma_phong INT NOT NULL,                  -- Thay đổi: Bình luận liên kết với Phòng
  ma_nguoi_binh_luan INT,             -- Cho phép NULL nếu người dùng bị xóa và chọn SET NULL
  ngay_binh_luan DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  noi_dung TEXT NOT NULL,
  sao_binh_luan TINYINT NOT NULL CHECK (sao_binh_luan BETWEEN 1 AND 5), -- Ràng buộc tốt!

  CONSTRAINT fk_BinhLuan_Phong            -- Khóa ngoại mới cho Phòng
    FOREIGN KEY (ma_phong) REFERENCES Phong(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE, -- Nếu Phòng bị xóa (hard delete), Bình Luận liên quan cũng bị xóa
  CONSTRAINT fk_BinhLuan_NguoiDung
    FOREIGN KEY (ma_nguoi_binh_luan) REFERENCES NguoiDung(id)
    ON UPDATE CASCADE
    ON DELETE SET NULL, -- Nếu Người Dùng bị xóa (hard delete), mã người bình luận thành NULL, giữ lại bình luận

  -- Audit fields
  deletedBy INT NOT NULL        DEFAULT 0,
  isDeleted TINYINT(1) NOT NULL  DEFAULT 0,
  deletedAt TIMESTAMP           NULL DEFAULT NULL,
  createdAt TIMESTAMP NOT NULL   DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL   DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;