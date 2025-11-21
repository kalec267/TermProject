function generateVerificationCode() {
    // 6자리 랜덤 숫자 (100000 ~ 999999)
    return Math.floor(100000 + Math.random() * 900000).toString();
}