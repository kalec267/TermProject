const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const db = require('./db');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const app = express();

// 기본 설정.
app.use(cors({origin: 'http://localhost:3000', credentials: true}));
app.use(bodyParser.json());
app.use(express.static('public'));

// 세션
app.use(session({
    secret: 'Kim123321!@',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60
    }
}));

// ⭐ MongoDB 연결 (img DB)
mongoose
    .connect('mongodb://localhost:27017/img')
    .then(() => console.log(">>> MongoDB Connected"))
    .catch(err => console.log(err));

// ⭐ 이미지 public 경로
app.use('/MongoImg', express.static('MongoImg'));

// multer 저장 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'MongoImg/');
    },
    filename: (req, file, cb) => {
        let title = req.body.title;
        if (!title) 
            title = path.parse(file.originalname).name;

        title = title
            .replace(/\s+/g, '_')
            .replace(/[^\w\-ㄱ-ㅎ가-힣]/g, '');
        const ext = path.extname(file.originalname);
        cb(null, title + ext);
    }
});
const upload = multer({storage});

// ⭐ MongoDB 스키마 + BannerImg 모델(컬렉션명 강제 지정)
const BannerImgSchema = new mongoose.Schema({
    title: String,
    imageUrl: String
});

// << 여기 중요!!! 컬렉션명 직접 지정: 'bannerimg' >>
const BannerImg = mongoose.model('BannerImg', BannerImgSchema, 'bannerimg');


// ------------------------- 로그인 API -----------------------------
app.post('/api/login', async (req, res) => {
    const {userId, userPassword} = req.body;

    try {
        const [adminRows] = await db.promise().query('SELECT * FROM admins WHERE adminId = ?', [userId]);

        if (adminRows.length > 0) {
            const admin = adminRows[0];
            const match = await bcrypt.compare(userPassword, admin.adminPassword);

            if (match) {
                req.session.user = {
                    id: admin.adminId,
                    name: admin.adminName,
                    role: 'admin'
                };
                return res.status(200).json({message: `관리자 로그인 성공!`, userName: admin.adminName, role: 'admin'});
            }
        }

        const [userRows] = await db.promise().query('SELECT * FROM users WHERE userId = ?', [userId]);

        if (userRows.length === 0)
            return res.status(401).json({message: '로그인 실패'});
        
        const user = userRows[0];
        const match = await bcrypt.compare(userPassword, user.userPassword);

        if (match) {
            req.session.user = {
                id: user.userId,
                name: user.userName,
                role: 'user'
            };
            return res.status(200).json({message: `로그인 성공`, userName: user.userName, role: 'user'});
        }

        res.status(401).json({message: '로그인 실패'});

    } catch (err) {
        console.error('DB 오류:', err);
        res.status(500).json({message: '서버 오류 발생'});
    }
});

app.get('/check-login', (req, res) => {
    if (req.session.user) {
        res.json({loggedIn: true, user: req.session.user});
    } else {
        res.json({loggedIn: false});
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err)
            return res.status(500).json({message: '로그아웃 실패'});
        res.json({message: '로그아웃 성공'});
    });
});


// ------------------------- 이미지 업로드 API -----------------------
app.post('/api/upload-image', upload.single('image'), async (req, res) => {
    try {
        if (!req.file)
            return res.status(400).json({success: false, message: "파일이 없음"});
        
        const newImage = await BannerImg.create({
            title: req.body.title || "",
            imageUrl: `/MongoImg/${req.file.filename}`
        });

        res.json({success: true, message: "이미지 업로드 성공", data: newImage});

    } catch (err) {
        console.error("이미지 업로드 오류:", err);
        res.status(500).json({success: false, message: "이미지 업로드 실패"});
    }
});


// ------------------------- 이미지 불러오기 API -----------------------
app.get('/api/BannerImg', async (req, res) => {
    try {
        const images = await BannerImg.find();
        res.json(images);
    } catch (err) {
        console.error("이미지 조회 오류:", err);
        res.status(500).json({message: "이미지 조회 실패"});
    }
});

// 최신 이미지 가져오기
app.get('/api/BannerImg/latest', async (req, res) => {
    try {
        const latestImage = await BannerImg.findOne().sort({_id: -1});
        if (!latestImage)
            return res.status(404).json({message: '이미지 없음'});
        res.json(latestImage);
    } catch (err) {
        console.error("최신 이미지 조회 오류:", err);
        res.status(500).json({message: "이미지 조회 실패"});
    }
});


// ------------------------- 서버 실행 -------------------------------
const PORT = 3000;
app.listen(PORT, () => console.log(`>>> Server running on http://localhost:${PORT}`));
