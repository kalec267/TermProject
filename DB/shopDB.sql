create database shop default character set utf8mb4;
use shop;

CREATE TABLE users (
    userNum INT AUTO_INCREMENT COMMENT '사용자 고유 번호',
    userName VARCHAR(50) NOT NULL COMMENT '사용자 이름',
    userId VARCHAR(50) NOT NULL UNIQUE COMMENT '사용자 ID (로그인 시 사용, 중복 불가)',
    userPassword VARCHAR(255) NOT NULL COMMENT '사용자 비밀번호 (해시 저장)',
    userEmail VARCHAR(100) NOT NULL UNIQUE COMMENT '사용자 이메일 (중복 불가)',
    userPhone VARCHAR(20) NULL COMMENT '사용자 전화번호',
    userAddress VARCHAR(20) NULL COMMENT '사용자 주소',
    userZipCode VARCHAR(20) NULL COMMENT '사용자 우편번호',
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '계정 생성 시각',

    PRIMARY KEY (`userNum`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='사용자 정보 테이블';

CREATE TABLE admins (
    adminNum INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '관리자 고유 번호',
    adminName VARCHAR(50) NOT NULL COMMENT '관리자 이름',
    adminId VARCHAR(50) NOT NULL UNIQUE COMMENT '관리자 로그인 ID',
    adminPassword VARCHAR(255) NOT NULL COMMENT '관리자 비밀번호 (해시 저장)',
    adminEmail VARCHAR(100) NOT NULL UNIQUE COMMENT '관리자 이메일',
    adminPhone VARCHAR(20) NULL COMMENT '관리자 전화번호',
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '계정 생성 시각',
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '정보 수정 시각',

    PRIMARY KEY (`adminNum`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='관리자 계정 테이블';

CREATE TABLE wish (
    wish_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY unique_wish (user_id, product_id)
);

CREATE TABLE cart (
    cartId INT AUTO_INCREMENT PRIMARY KEY,
    userId VARCHAR(50) NOT NULL,
    productId INT NOT NULL,
    quantity INT DEFAULT 1,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uniq_cart (userId, productId)
);