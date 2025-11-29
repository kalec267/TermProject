document.addEventListener("DOMContentLoaded", async () => {

    const wishButtons = document.querySelectorAll(".wish-btn");
    const container = document.getElementById("wishContainer");

    // ✅ 로그인 여부 확인
    async function checkLogin() {
        const res = await fetch("http://localhost:3000/check-login", {
            credentials: "include"
        });
        const data = await res.json();
        return data.loggedIn;
    }

    // ✅ DB에서 찜 목록 불러오기
    async function loadWishFromDB() {
        const res = await fetch("http://localhost:3000/api/wish", {
            credentials: "include"
        });
        if (res.status !== 200) return [];
        return await res.json(); // [1,2,3]
    }

    const isLoggedIn = await checkLogin();
    let wishList = [];

    if (isLoggedIn) {
        wishList = await loadWishFromDB();
    }

    // ===============================
    // ✅ 메인 페이지 찜 버튼 처리
    // ===============================
    wishButtons.forEach(btn => {
        const id = Number(btn.dataset.productId);

        if (wishList.includes(id)) {
            btn.classList.add("active");
            btn.innerHTML = '<i class="fa-solid fa-heart"></i>';
        }

        btn.addEventListener("click", async () => {
            const login = await checkLogin();

            // ✅ 비로그인 차단
            if (!login) {
                alert("로그인이 필요합니다.");
                location.href = "login.html";
                return;
            }

            // ✅ 이미 찜한 경우 → 삭제
            if (btn.classList.contains("active")) {
                await fetch(`http://localhost:3000/api/wish/${id}`, {
                    method: "DELETE",
                    credentials: "include"
                });

                btn.classList.remove("active");
                btn.innerHTML = '<i class="fa-regular fa-heart"></i>';
            }
            // ✅ 찜 추가
            else {
                await fetch("http://localhost:3000/api/wish", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({ productId: id })
                });

                btn.classList.add("active");
                btn.innerHTML = '<i class="fa-solid fa-heart"></i>';
            }
        });
    });

    // ===============================
    // ✅ 찜 목록 페이지 처리
    // ===============================
    if (!container) return; // 찜 목록 페이지가 아니면 종료

    const login = await checkLogin();

    if (!login) {
        alert("로그인이 필요합니다.");
        location.href = "login.html";
        return;
    }

    const wishRes = await fetch("http://localhost:3000/api/wish", {
        credentials: "include"
    });

    const wishIds = await wishRes.json(); // [1,2,5]

    if (wishIds.length === 0) {
        container.innerHTML = "<h3>찜한 상품이 없습니다.</h3>";
        return;
    }

    const productRes = await fetch("http://localhost:3000/api/products/wish", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ ids: wishIds })
    });

    const products = await productRes.json();

    products.forEach(p => {
        const div = document.createElement("div");
        div.className = "wish-item";

        div.innerHTML = `
            <img src="${p.image}" />
            <div class="wish-info">
                <h4>${p.name}</h4>
                <p>${p.price.toLocaleString()}원</p>
            </div>
            <button class="wish-remove" data-id="${p.id}">
                찜 해제
            </button>
        `;

        container.appendChild(div);
    });

    document.querySelectorAll(".wish-remove").forEach(btn => {
        btn.addEventListener("click", async () => {
            const id = btn.dataset.id;

            await fetch(`http://localhost:3000/api/wish/${id}`, {
                method: "DELETE",
                credentials: "include"
            });

            location.reload();
        });
    });

});
