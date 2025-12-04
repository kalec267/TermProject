document.addEventListener("DOMContentLoaded", async () => {

    const container = document.getElementById("cartContainer");

    const loginRes = await fetch("http://localhost:3000/check-login", {
        credentials: "include"
    });

    const loginData = await loginRes.json();

    if (!loginData.loggedIn) {
        alert("로그인이 필요합니다.");
        location.href = "login.html";
        return;
    }

    const cartRes = await fetch("http://localhost:3000/api/cart", {
        credentials: "include"
    });

    const items = await cartRes.json(); // [{productId, quantity}]

    if (items.length === 0) {
        container.innerHTML = "<h3>장바구니가 비어 있습니다.</h3>";
        return;
    }

    const productRes = await fetch("http://localhost:3000/api/products/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ids: items })
    });

    const products = await productRes.json();

    products.forEach(p => {
        const div = document.createElement("div");

        div.innerHTML = `
            <img src="${p.image}">
            <h4>${p.name}</h4>
            <p>${p.price.toLocaleString()}원</p>
            <p>수량: ${p.quantity}</p>
            <button class="cart-remove" data-id="${p.id}">삭제</button>
        `;

        container.appendChild(div);
    });

    document.querySelectorAll(".cart-remove").forEach(btn => {
        btn.addEventListener("click", async () => {
            const id = btn.dataset.id;

            await fetch(`http://localhost:3000/api/cart/${id}`, {
                method: "DELETE",
                credentials: "include"
            });

            location.reload();
        });
    });

});
