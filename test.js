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

/* =========================
   기본 설정
========================= */
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(bodyParser.json());
app.use(express.static('public'));

/* =========================
   세션
========================= */
app.use(session({
    secret: 'Kim123321!@',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60
    }
}));

/* =========================
   MongoDB 연결
========================= */
mongoose.connect('mongodb://localhost:27017/img')
    .then(() => console.log('>>> MongoDB Connected'))
    .catch(err => console.error(err));

/* =========================
   이미지 경로
========================= */
app.use('/MongoImg', express.static('MongoImg'));

/* =========================
   Multer 설정
========================= */
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'MongoImg/'),
    filename: (req, file, cb) => {
        let title = req.body.title || path.parse(file.originalname).name;
        title = title.replace(/\s+/g, '_').replace(/[^\w\-ㄱ-ㅎ가-힣]/g, '');
        const ext = path.extname(file.originalname);
        cb(null, title + ext);
    }
});
const upload = multer({ storage });

/* =========================
   배너 이미지 스키마
========================= */
const BannerImgSchema = new mongoose.Schema({
    title: String,
    imageUrl: String
});
const BannerImg = mongoose.model('BannerImg', BannerImgSchema, 'bannerimg');

/* =========================
   찜 스키마
========================= */
const LikeSchema = new mongoose.Schema({
    userId: String,
    productId: String,
    createdAt: { type: Date, default: Date.now }
});
const Like = mongoose.model('Like', LikeSchema);

/* =========================
   로그인
========================= */
app.post('/api/login', async (req, res) => {
    const { userId, userPassword } = req.body;

    try {
        const [rows] = await db.promise().query(
            'SELECT * FROM users WHERE userId = ?',
            [userId]
        );

        if (rows.length === 0)
            return res.status(401).json({ message: '로그인 실패' });

        const user = rows[0];
        const match = await bcrypt.compare(userPassword, user.userPassword);

        if (!match)
            return res.status(401).json({ message: '로그인 실패' });

        req.session.user = {
            id: user.userId,
            name: user.userName,
            role: 'user'
        };

        res.json({ message: '로그인 성공', userName: user.userName });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '서버 오류' });
    }
});

app.get('/check-login', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy(() => res.json({ message: '로그아웃 성공' }));
});

/* =========================
   이미지 업로드
========================= */
app.post('/api/upload-image', upload.single('image'), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: '파일 없음' });

    const newImage = await BannerImg.create({
        title: req.body.title || '',
        imageUrl: `/MongoImg/${req.file.filename}`
    });

    res.json(newImage);
});

app.get('/api/BannerImg/latest', async (req, res) => {
    const latestImage = await BannerImg.findOne().sort({ _id: -1 });
    res.json(latestImage);
});

/* =========================
   ✅ 찜 API
========================= */
app.post('/api/like', async (req, res) => {
    if (!req.session.user)
        return res.status(401).json({ message: '로그인 필요' });

    const { productId } = req.body;
    const userId = req.session.user.id;

    const exist = await Like.findOne({ userId, productId });
    if (exist)
        return res.status(409).json({ message: '이미 찜됨' });

    const like = await Like.create({ userId, productId });
    res.json(like);
});

app.delete('/api/like/:productId', async (req, res) => {
    if (!req.session.user)
        return res.status(401).json({ message: '로그인 필요' });

    const { productId } = req.params;
    const userId = req.session.user.id;

    await Like.deleteOne({ userId, productId });
    res.json({ message: '찜 삭제 완료' });
});

app.get('/api/likes', async (req, res) => {
    if (!req.session.user)
        return res.status(401).json({ message: '로그인 필요' });

    const likes = await Like.find({ userId: req.session.user.id });
    res.json(likes);
});

/* =========================
   서버 실행
========================= */
const PORT = 3000;
app.listen(PORT, () =>
    console.log(`>>> Server running on http://localhost:${PORT}`)
);
