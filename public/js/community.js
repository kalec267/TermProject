document.addEventListener("DOMContentLoaded", () => {
    const postList = document.getElementById("postList");
    const searchInput = document.getElementById("searchInput");
    const writeBtn = document.getElementById("writeBtn");

    // 임시 게시글
    let posts = [
        {
            id: 1,
            title: "게시판 테스트",
            author: "김민한",
            created_at: "2025-11-06"
        }
    ];
    function renderPosts(filter = "") {
        postList.innerHTML = "";
        const filteredPosts = posts.filter(post => post.title.includes(filter));
        filteredPosts.forEach(post => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
        <td>${post.id}</td>
        <td>${post.title}</td>
        <td>${post.author}</td>
        <td>${post.created_at}</td>
      `;
            postList.appendChild(tr);
        });
    }

    renderPosts();

    // 검색
    searchInput.addEventListener("input", (e) => {
        renderPosts(e.target.value);
    });

    // 글쓰기 버튼
    writeBtn.addEventListener("click", () => {
        alert("글쓰기 폼을 열도록 구현 가능");
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

// footer.html 파일을 불러와 삽입 footer.html 불러오기
fetch('footer.html').then(res => res.text())
