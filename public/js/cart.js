document.addEventListener("DOMContentLoaded", () => {

    const cartBtns = document.querySelectorAll(".cart-btn");

    async function checkLogin() {
        const res = await fetch("http://localhost:3000/check-login", {
            credentials: "include"
        });
        const data = await res.json();
        return data.loggedIn;
    }

    cartBtns.forEach(btn => {
        btn.addEventListener("click", async () => {

            const id = btn.dataset.productId;
            const login = await checkLogin();

            if (!login) {
                alert("로그인이 필요합니다.");
                return;
            }

            await fetch("http://localhost:3000/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ productId: id })
            });

            alert("장바구니에 담겼습니다.");
        });
    });

});



// header.html 파일을 불러와 삽입 header.html 불러오기
fetch('header.html')
    .then(res => res.text())
    .then(data => {
        document
            .getElementById('header')
            .innerHTML = data;

        // header.html이 DOM에 추가된 다음 header.js 로드
        const script = document.createElement('script');
        script.src = 'js/header.js';
        document
            .body
            .appendChild(script);
    })
    .catch(err => console.error('헤더 로드 오류:', err));


    // 메인 페이지 장바구니 버튼 클릭
document.querySelectorAll(".add-cart-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
        const productId = Number(btn.dataset.productId);

        // 로그인 체크
        const loginRes = await fetch("http://localhost:3000/check-login", { credentials: "include" });
        const loginData = await loginRes.json();

        if (!loginData.loggedIn) {
            alert("로그인이 필요합니다."); // 로그인 안 되어 있으면 알림
            return;
        }

        // 장바구니 추가 API 호출
        const res = await fetch("http://localhost:3000/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ productId })
        });

        if (res.ok) {
            alert("장바구니에 상품을 담았어요");
        } else {
            alert("장바구니 추가 실패");
        }
    });
});
