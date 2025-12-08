// 로그인 함수
function login() {
    const userId = document
        .getElementById('userId')
        .value;
    const userPassword = document
        .getElementById('userPassword')
        .value;

    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({userId, userPassword})
    })
        .then(async res => {
            const data = await res
                .json()
                .catch(() => null);

            if (res.ok && data) {
                alert(data.message);
                // 로그인 성공 시 이름 저장
                localStorage.setItem('userName', data.userName);
                window.location.href = '../index.html';
            } else {
                alert(
                    data
                        ?.message || '로그인 실패, 아이디 또는 비밀번호를 확인해주세요.'
                );
            }
        })
        .catch(err => {
            console.error('로그인 요청 오류:', err);
            alert('서버 요청 중 오류가 발생했습니다.');
        });
}

// 폼 제출 시 login() 실행
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            login();
        });
    }
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

fetch('footer.html')
    .then(res => res.text())
    .then(data => {
        document
            .getElementById('footer')
            .innerHTML = data;
        const script = document.createElement('script');
        script.src = 'js/footer.js';
        document
            .body
            .appendChild(script);
    });
