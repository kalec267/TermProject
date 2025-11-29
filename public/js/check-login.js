// // 로그인 여부 확인 API
// app.get('/check-login', (req, res) => {
//     if (req.session.user) {
//         res.json({
//             loggedIn: true,
//             user: req.session.user // { id, name }
//         });
//     } else {
//         res.json({ loggedIn: false });
//     }
// });
