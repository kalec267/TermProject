async function renderHeader() {
  const res = await fetch('/check-login');
  const data = await res.json();
  const menu = document.getElementById('headerMenu');
  menu.innerHTML = ''; // 초기화

  if (data.loggedIn) {
    // 로그인 상태
    const { name, role } = data.user;

    // 기본 메뉴(로그인 사용자 공통)
    let html = `
      <li class="header_content" onclick="location.href='wishlist.html'" style="cursor:pointer;">
          <i class="fa-solid fa-heart fa-lg"></i>
      </li>
      <li class="header_content" onclick="location.href='cart.html'" style="cursor:pointer;">
          <i class="fa-solid fa-cart-plus fa-lg"></i>
      </li>
      <li class="header_content" style="cursor:pointer;" onclick="logoutUser()">
          <i class="fa-solid fa-door-open fa-lg"></i>
      </li>
      <li class="header_content">${name}님</li>
    `;

    // 관리자 전용 메뉴 추가
    if (role === "admin") {
      html += `
        <li class="header_content" 
            style="cursor:pointer; color:red; font-weight:bold;" 
            onclick="location.href='imgUpload.html'">
          <i class="fa-solid fa-gear fa-lg"></i> 관리자
        </li>
      `;
    }

    menu.innerHTML = html;

  } else {
    // 비로그인 상태
    menu.innerHTML = `
      <li class="header_content" onclick="location.href='login.html'" style="cursor:pointer;">
        <i class="fa-solid fa-right-to-bracket fa-lg"></i>
      </li>
      <li class="header_content" onclick="location.href='signUp.html'" style="cursor:pointer;">
        <i class="fa-solid fa-user-plus fa-lg"></i>
      </li>
      <li class="header_content">
        <i class="fa-solid fa-cart-plus fa-lg"></i>
      </li>
    `;
  }
}

document.addEventListener("click", function (e) {
    const cartBtn = document.getElementById("cartBtn");
    if (!cartBtn) return;

    cartBtn.addEventListener("click", () => {
        location.href = "cart.html";
    });
});

async function logoutUser() {
  await fetch('/logout', { method: 'POST' });
  location.reload(); // 페이지 새로고침으로 헤더 갱신
}

renderHeader(); // 페이지 로드 시 실행
