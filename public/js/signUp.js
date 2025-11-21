// 회원가입 요청 함수
function signUp() {
    const userName = document
        .getElementById('userName')
        .value;
    const userId = document
        .getElementById('userId')
        .value;
    const userPassword = document
        .getElementById('userPassword')
        .value;
    const userEmail = document
        .getElementById('userEmail')
        .value;
    const userPhone = document
        .getElementById('userPhone')
        .value;
    const userAddress = document
        .getElementById('userAddress')
        .value;
    const userZipCode = document
        .getElementById('userZipCode')
        .value;

    fetch('/api/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userName,
            userId,
            userPassword,
            userEmail,
            userPhone,
            userAddress,
            userZipCode
        })
    })
        .then(res => {
            if (!res.ok) {
                // HTTP 상태 코드가 200번대가 아닐 경우 (예: 409 Conflict, 500 Internal Error)
                return res
                    .text()
                    .then(text => {
                        throw new Error(text)
                    });
            }
            return res.text();
        })
        .then(msg => {
            // 서버 응답 성공 시 (회원가입 성공)
            alert(msg); // 성공 메시지 알림

            // **요청하신 대로, 회원가입 성공 후 index.html로 페이지 이동**
            window.location.href = "index.html";
        })
        .catch(err => {
            // 네트워크 오류 또는 서버 응답 오류 발생 시
            console.error("회원가입 요청 중 오류 발생:", err);
            // 서버에서 전달받은 오류 메시지를 표시합니다.
            alert(`${err.message}`);
            if (err.message.includes("아이디")) {
                document.getElementById("userId").focus();
                document.getElementById("userId").select(); // 선택까지 해주면 사용자 편의성 향상
            } else if (err.message.includes("이메일")) {
                document.getElementById("userEmail").focus();
                document.getElementById("userEmail").select();
            } else if (err.message.includes("전화번호")) {
                document.getElementById("userPhone").focus();
                document.getElementById("userPhone").select();
            }
        });
}

// input 요소 참조
const userNameInput = document.getElementById("userName");
const userIdInput = document.getElementById("userId");
const userPasswordInput = document.getElementById("userPassword");
const confirmPasswordInput = document.getElementById("confirmPassword");
const userEmailInput = document.getElementById("userEmail");
const userPhoneInput = document.getElementById("userPhone");
const userAddressInput = document.getElementById("userAddress");
const userZipCodeInput = document.getElementById("userZipCode");
const registrationForm = document.getElementById("registrationForm");

// helperText 표시/숨김 처리
const updateHelperText = (input, message, isValid) => {
    const inputGroup = input.parentElement;
    const helperText = inputGroup.querySelector(".helperText");

    inputGroup
        .classList
        .toggle('valid', isValid);
    inputGroup
        .classList
        .toggle('invalid', !isValid);

    helperText.style.visibility = isValid
        ? "hidden"
        : "visible";
    if (!isValid) 
        helperText.innerText = message;
    };

// 메시지 상수
const MESSAGES = {
    EMPTY: "값을 입력해주세요.",
    EMAIL_INVALID: "유효한 이메일 주소를 입력하세요.",
    PASSWORD_WEAK: "비밀번호는 최소 8자 이상, 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.",
    PASSWORD_MISMATCH: "비밀번호가 일치하지 않습니다.",
    PHONE_INVALID: "유효한 전화번호를 입력하세요. (예: 010-1234-5678)"
};

// 입력값 체크
const checkEmptyInput = input => {
    if (input.value.trim() === '') {
        updateHelperText(input, MESSAGES.EMPTY, false);
        return false;
    } else {
        updateHelperText(input, "", true);
        return true;
    }
};

// 이메일 체크
const validateEmail = input => {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = pattern.test(input.value.trim());
    updateHelperText(
        input,
        isValid
            ? ""
            : MESSAGES.EMAIL_INVALID,
        isValid
    );
    return isValid;
};

// 비밀번호 강도
const checkPasswordStrength = input => {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    const isValid = pattern.test(input.value);
    updateHelperText(
        input,
        isValid
            ? ""
            : MESSAGES.PASSWORD_WEAK,
        isValid
    );
    return isValid;
};

// 비밀번호 확인
const validatePasswordMatch = (pwInput, confirmInput) => {
    const isValid = pwInput.value === confirmInput.value;
    updateHelperText(
        confirmInput,
        isValid
            ? ""
            : MESSAGES.PASSWORD_MISMATCH,
        isValid
    );
    return isValid;
};

// 전화번호 체크
const validatePhoneNumber = input => {
    const pattern = /^(010|01[1-9])-\d{3,4}-\d{4}$/;
    const isValid = pattern.test(input.value.trim());
    updateHelperText(
        input,
        isValid
            ? ""
            : MESSAGES.PHONE_INVALID,
        isValid
    );
    return isValid;
};

// 전체 폼 검증
const validateForm = () => {
    let isValid = true;

    // 필수 입력 필드 검사
    isValid = checkEmptyInput(userNameInput) && isValid;
    isValid = checkEmptyInput(userIdInput) && isValid;
    isValid = checkEmptyInput(userAddressInput) && isValid;
    isValid = checkEmptyInput(userZipCodeInput) && isValid;

    // 유효성 검사가 필요한 필드 검사
    isValid = validateEmail(userEmailInput) && isValid;
    isValid = checkPasswordStrength(userPasswordInput) && isValid;
    isValid = validatePasswordMatch(userPasswordInput, confirmPasswordInput) && isValid;
    isValid = validatePhoneNumber(userPhoneInput) && isValid;

    return isValid;
};

// 폼 제출 이벤트
registrationForm.addEventListener('submit', e => {
    e.preventDefault();
    if (validateForm()) {
        signUp();
        // **중요**: 페이지 이동은 서버 응답(signUp 함수 내부의 .then)에서 처리되므로, 여기서 바로 페이지 이동을 실행하지 않습니다.
    }
});

// 실시간 유효성 검사
[
    userNameInput,
    userIdInput,
    userEmailInput,
    userPasswordInput,
    confirmPasswordInput,
    userPhoneInput,
    userAddressInput,
    userZipCodeInput
].forEach(input => {
    input.addEventListener('input', () => {
        switch (input.id) {
            case 'userName':
            case 'userId':
            case 'userAddress':
            case 'userZipCode':
                checkEmptyInput(input);
                break;
            case 'userEmail':
                validateEmail(input);
                break;
            case 'userPassword':
                checkPasswordStrength(input);
                break;
            case 'confirmPassword':
                validatePasswordMatch(userPasswordInput, confirmPasswordInput);
                break;
            case 'userPhone':
                validatePhoneNumber(input);
                break;
        }
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