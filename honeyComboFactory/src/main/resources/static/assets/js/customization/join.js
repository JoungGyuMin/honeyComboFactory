/**
 *  회원가입 js
 */
// 필요변수 상단 선언
const memberJoinServletUrl = "/member/join"; // 회원가입 서블릿 url
const checkJoinMemberIdUrl = "/member/join/checkId"; // 아이디 중복 체크 서블릿 url
const sendSmsCodeUrl = "/member/sendSmsCode";//sms 발신 서블릿 url
const checkSmsCodeUrl = "/member/checkSmsCode"; //sms 발신번호 확인 서블릿 url
let timer; // 핸드폰 인증번호 타이머 ID 저장용 변수

// 생년월일 날짜 제한 기능
const limitInputBirth = () => {
	const today = new Date();
	const year = today.getFullYear();
	const month = ("0" + (today.getMonth() + 1)).slice(-2);
	const day = ("0" + today.getDate()).slice(-2);
	const todayDate = `${year}-${month}-${day}`;

	$("#memberBirth").attr("max", todayDate);
}

// 아이디 사용 여부 검사 기능
const checkJoinMemberId = (event) => {
	// 아이디 입력 패턴
	const memberIdPattern = /^[a-z][a-z0-9]{2,15}$/;
	// 행동이 일어난 태그의 값(양쪽 여백 제거) 받아오기
	let joinMemberId = $(event.target).val().trim();
	const isPatternValid = memberIdPattern.test(joinMemberId);
	const memberId = $("#memberId");
	const memberIdFeedback = $("#memberIdFeedback");

	// 로그 찍기
	console.log("JS 입력받은 joinMemberId : [" + joinMemberId + "]");

	// 입력값이 없으면 요청하지 않음
	if (!joinMemberId) {
		memberId.removeClass("is-valid is-invalid");
		memberIdFeedback.hide();
		console.log("입력값이 비어 있어 요청하지 않음");
		return;
	}

	// 입력 패턴에 맞지 않다면
	if (!isPatternValid) {
		// UI/UX
		memberId.addClass("is-invalid").removeClass("is-valid");
		// 사용자에게 패턴 오류 알림
		memberIdFeedback.text("영어와 숫자만 세글자 이상 입력").show();
		return;
	}
	$.ajax({
		type: "POST", // 방식
		url: checkJoinMemberIdUrl, // 찾아갈 주소
		data: { memberId: joinMemberId }, // 보낼 값
		dataType: "text", // 받을 타입
		success: (response) => { // 비동기 정상 작동 시
			console.log("받은 아이디 중복 여부 데이터:", response);
			if (response === "true") { // 사용 가능
				memberId.addClass("is-valid").removeClass("is-invalid");
				memberIdFeedback.hide();
			} else if (response === "false") { // 아이디 중복 (사용 불가)
				memberId.addClass("is-invalid").removeClass("is-valid");
				memberIdFeedback.text("이미 사용 중인 아이디입니다.").show();
			}
		},
		error: (xhr, status, error) => { // 비동기 작동 실패 시
			console.error("AJAX 요청 에러 발생", xhr.status, status, error);
			// 스위트 알럿창 출력
			printSweetAlert("error", "서버에 문제가 발생했습니다.", "지속될 시 관리자에게 문의하세요.", "error.do");
		}
	});
}

// 핸드폰 번호 유효성 검사
const checkMemberPhoneNumber = () => {
	let memberPhoneNumber = $("#memberPhoneNumber").val().trim();
	const memberPhoneNumberPattern = /^(?!(\d)\1{10})\d{11}$/; // 휴대폰번호 패턴

	// 숫자만 포함되어 있는지 확인 (정규식 사용)
	if (!(memberPhoneNumberPattern.test(memberPhoneNumber))) {
		console.log("핸드폰번호 숫자 이외의 것 포함.");
		return false;
	}

	// 숫자 이외의 문자는 모두 제거
	let joinMemberPhoneNumber = $("#memberPhoneNumber").val().replace(/[^0-9]/g, "");

	// 핸드폰 번호 공백 제거 후 설정
	$("#memberPhoneNumber").val(joinMemberPhoneNumber);
	return true;
}

// 비밀번호 입력 칸과 비빌번호 확인 값이 일치하는지 검사 기능
const checkConfirmMemberPassword = () => {
	// 행동이 일어난 태그의 값 받아오기
	let joinConfirmMemberPassword = $("#confirmMemberPassword").val().trim();
	let memberPassword = $("#memberPassword").val().trim();
	const confirmMemberPassword = $("#confirmMemberPassword");
	const confirmMemberPasswordFeedback = $("#confirmMemberPasswordFeedback");

	console.log("비밀번호 확인-비밀번호 값 : [" + memberPassword + "]");
	console.log("비밀번호 확인-확인 값 : [" + joinConfirmMemberPassword + "]");

	if (!joinConfirmMemberPassword) { // 값이 비었거나 없다면
		confirmMemberPassword.removeClass("is-valid is-invalid");
		confirmMemberPasswordFeedback.hide();
		return;
	}

	if (joinConfirmMemberPassword !== memberPassword) { // 일치하지 않다면
		confirmMemberPassword.addClass("is-invalid").removeClass("is-valid");
		confirmMemberPasswordFeedback.show();
	}
	else { // 일치한다면
		confirmMemberPassword.addClass("is-valid").removeClass("is-invalid");
		confirmMemberPasswordFeedback.hide();
	}
}

// 휴대폰번호 인증 영역 출력 기능
const memberPhoneNumberConfirm = () => {
	let phoneNumberConfirmBtn = $("#memberPhoneNumberConfirmBtn").val();
	let phoneNumberConfirmWrapper = $("#phoneNumberConfirmWrapper");
	const phoneNumberConfirmWrapperCode = `
			    <label>인증 번호 &nbsp;
			        <input id="phoneNumberConfirmBtn" type="button" class="btn btn-danger" value="확인">
					&nbsp;&nbsp; <span id="phoneNumberConfirmTimeOut" style="color:red;">5:00</span>
			    </label>
			    <input type="text" name="phoneNumberConfirmNumber" class="form-control"
			        id="phoneNumberConfirmNumber" placeholder="인증 번호를 입력하세요" required>
					<div class="invalid-feedback" id="phoneNumberConfirmNumberFeedback">발송된 인증번호를 입력하세요</div>
			`;

	if (phoneNumberConfirmBtn === "인증") { // 인증 버튼이라면
		console.log("핸드폰 인증 버튼 클릭");

		console.log("인증번호보내기");

		if (!checkMemberPhoneNumber()) { // 거짓이라면
			console.log("핸드폰 번호 유효성 비통과");
			// 스위트 알럿창 출력
			printSweetAlert("warning", "올바른 형식이 아닙니다.", "동일하지 않은 숫자로 11자리를 입력하세요.");
			return;
		}

		// 인증번호 전송 요청 AJAX
		$.ajax({
			type: "POST",
			url: sendSmsCodeUrl,
			data: { phoneNumber: $("#memberPhoneNumber").val().trim() },
			dataType: "json",
			success: function(response) {
				console.log("인증번호 전송 응답:", response);
				if (response.status === "success") {
					printSweetAlert("success", "인증번호가 발송되었습니다.");
				} else {
					printSweetAlert("error", "인증번호 전송 실패", "서버에서 오류가 발생했습니다.");
				}
			},
			error: function(status, error) {
				console.error("인증번호 전송 중 오류 발생", status, error);
				printSweetAlert("error", "서버에 문제가 발생했습니다.", "지속될 시 관리자에게 문의하세요.");
			}
		});

		// 인증 버튼 값을 인증 취소로 변경
		$("#memberPhoneNumberConfirmBtn").val("인증 취소");
		$("#memberPhoneNumber").prop("readonly", true); // readonly 속성 설정

		// 새로운 인증 번호 입력 폼 추가
		phoneNumberConfirmWrapper.html(phoneNumberConfirmWrapperCode);
		// 타이머 시작
		startPhoneNumberConfirmTimer();
	}
	else if (phoneNumberConfirmBtn === "인증 취소") { // 인증 취소 버튼이라면
		console.log("핸드폰 인증 취소 버튼 클릭");
		// 인증 취소 버튼 값을 인증으로 변경
		$("#memberPhoneNumberConfirmBtn").val("인증");
		$("#memberPhoneNumber").prop("readonly", false); // readonly 속성 제거

		phoneNumberConfirmWrapper.empty();
		clearInterval(timer);
	}
	else { // 변경 버튼이라면
		console.log("핸드폰 변경 버튼 클릭");
		$("#memberPhoneNumber").prop("readonly", false); // readonly 속성 제거
		// 변경 버튼 값을 인증으로 변경
		$("#memberPhoneNumberConfirmBtn").val("인증");
	}
}

// 타이머 시작 기능
const startPhoneNumberConfirmTimer = () => {
	clearInterval(timer);

	let timeLeft = 300; // 5분 (300초)로 설정

	timer = setInterval(() => {
		// 남은 시간 초단위로 표시
		let minutes = Math.floor(timeLeft / 60); // 분 계산
		let seconds = timeLeft % 60; // 초 계산

		// "4:56" 형식으로 표시
		$("#phoneNumberConfirmTimeOut").text(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);

		// 시간이 다 되면 타이머 종료
		if (timeLeft <= 0) {
			console.log("핸드폰 인증 타이머 종료");
			clearInterval(timer);
			// 스위트 알럿창 출력
			printSweetAlert("warning", "인증 시간이 지났습니다.");
			$("#memberPhoneNumber").prop("readonly", false); // readonly 속성 제거
			$("#phoneNumberConfirmWrapper").empty();
			// 인증 취소 버튼 값을 인증으로 변경
			$("#memberPhoneNumberConfirmBtn").val("인증");
		}

		timeLeft--;
	}, 1000); // 1초마다 업데이트
}

const phoneNumberConfirmNumber = () => {
	console.log("핸드폰 인증번호 검사");
	let phoneNumberConfirmNumber = $("#phoneNumberConfirmNumber");

	// 사용자가 입력한 인증번호
	let inputCode = phoneNumberConfirmNumber.val().trim();

	// 빈 값 처리
	if (!inputCode) {
		console.log("인증번호가 비어 있음");
		$("#phoneNumberConfirmNumberFeedback").show().text("인증번호를 입력하세요");
		return;
	}

	// AJAX로 서버에 인증번호 확인 요청(check)
	$.ajax({
		type: "POST",
		url: checkSmsCodeUrl,
		data: { authCode: inputCode },
		dataType: "json",
		success: (response) => {
			console.log("서버 응답:", response);

			if (response.valid === true) {
				console.log("핸드폰 인증번호 검사 통과");
				$("#memberPhoneNumberConfirmBtn").val("변경");
				$("#phoneNumberConfirmWrapper").empty();
				$("#memberPhoneNumber").prop("readonly", true); // readonly 속성 설정
				clearInterval(timer); // 타이머 종료

				// 스위트 알럿창 출력
				printSweetAlert("success", "인증이 완료되었습니다.");
				return;
			}

			console.log("핸드폰 인증번호 검사 비통과");
			$("#phoneNumberConfirmNumberFeedback").show().text("인증번호가 일치하지 않습니다.");
		},
		error: (status, error) => {
			console.error("AJAX 오류 발생:", status, error);
			printSweetAlert("error", "서버 오류로 인증 실패", "지속될 시 관리자에게 문의하세요.");
		}
	});
};

// 이메일 옵션 감지하여 직접입력하는 이메일 도메인에 disabled 속성 주는 기능
const onChangeEmailAddress = (value) => {
	// id가 writeEmailSite인 정보 저장
	if (value != "setInputEmailAddress") { // 직접입력 옵션이 아니라면
		$("#inputEmailAddress").prop("disabled", true); // disabled 속성 설정
	}
	else {
		$("#inputEmailAddress").prop("disabled", false); // disabled 속성 제거
	}
}

// 카카오 주소 검색 API
const kakaoPostAPIcode = () => {
	console.log("주소 API 실행");
	// 카카오 주소 검색 팝업을 생성하고 실행 
	new daum.Postcode({
		// 사용자가 주소를 선택했을 때 실행되는 콜백 함수 
		oncomplete: (data) => {
			// data = 선택한 주소 정보
			console.log(data);

			let addr = ''; // 주소 변수(도로명, 지번)
			let extraAddr = ''; // 참고항목 변수(건물병, 법정동 등)

			//사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져오기
			// 사용자가 도로명 주소를 선택했을 경우
			if (data.userSelectedType === 'R') {
				addr = data.roadAddress;
			} else {
				// 사용자가 지번 주소를 선택했을 경우
				addr = data.jibunAddress;
			}

			// Geocoder 객체 생성
			let geocoder = new kakao.maps.services.Geocoder();

			geocoder.addressSearch(addr, function(result, status) {
				if (status === kakao.maps.services.Status.OK) {
					let lat = result[0].y; // 위도
					let lng = result[0].x; // 경도
					console.log("📍 위도:", lat, "경도:", lng);
				} else {
					console.error("주소 → 좌표 변환 실패");
				}
			});

			// 참고항목 조합(도로명 주소일 때만)
			// 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
			//Kakao가 도로명 주소를 선택하면 userSelectedType에 'R'을 넣기로 약속
			if (data.userSelectedType === 'R') {
				// 법정동명이 있을 경우 추가한다. (법정리는 제외)
				// 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
				if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
					extraAddr += data.bname;
				}
				// 건물명이 있고, 공동주택일 경우 추가한다.
				if (data.buildingName !== '' && data.apartment === 'Y') {
					extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
				}
				// 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
				if (extraAddr !== '') {
					extraAddr = ' (' + extraAddr + ')';
				}
			}
			// 사용자가 주소를 선택했을 때, 그 주소를 input에 넣는 코드
			// 우편번호와 주소 정보를 해당 필드에 넣는다. 
			$("#memberAddressMain").val(addr);
			// 상세주소 입력란 readonly 속성 제거
			$("#memberAddressDetail").prop("readonly", false);
			// 커서를 상세주소 입력란으로 자동 이동
			$("#memberAddressDetail").focus();
		}
	}).open(); //팝업 창 실행(사용자 주소 검색창)
}

// 스위트 알럿창 출력 기능
const printSweetAlert = (icon, title, text, pageLink) => {
	console.log("스위트알럿 출력할 아이콘 : [" + icon + "]");
	console.log("스위트알럿 출력할 제목 글 : [" + title + "]");
	console.log("스위트알럿 출력할 내용 글 : [" + text + "]");
	console.log("스위트알럿 후 이동할 링크 : [" + pageLink + "]");

	Swal.fire({
		icon: icon,
		title: title,
		text: text
	}).then(() => {
		if (pageLink) { // 페이지 이동이 필요하다면
			// 페이지 이동
			location.href = pageLink;
		}
	});
}

// 초기 기능 실행 기능
const runPostLoginSetup = () => {
	// 생년월일은 최대 당일 날짜로 설정 함수 호출
	limitInputBirth();
}

// 초기 이벤트 리스너 등록 기능
const initEventListeners = () => {
	// 핸드폰 번호 인증 검사 리스너 추가 (인증번호 검사 실행)
	$(document).on("click", "#phoneNumberConfirmBtn", phoneNumberConfirmNumber);

	// 핸드폰 번호 인증 엔터키 리스너 추가
	$(document).on("keydown", "#phoneNumberConfirmNumber", function(event) {
		if (event.key === "Enter" || event.keyCode === 13) {
			console.log("인증번호 엔터키 실행");
			// 핸드폰번호 인증번호 확인 함수 호출
			phoneNumberConfirmNumber();
		}
	});

	// 폼 요소에 대해 submit 이벤트 리스너 추가
	$("#validation-form").on("submit", function(event) {
		event.preventDefault(); // 기본 폼 제출을 막음

		// 표준 메서드 checkValidity()를 사용하여 폼의 입력값이 유효한지 확인
		if (!this.checkValidity()) {
			event.stopPropagation(); // 이벤트가 부모 요소로 전파되는 것을 방지
		} else {
			// 버튼 값이 "변경"일 때만 폼을 제출
			if ($("#memberPhoneNumberConfirmBtn").val() !== "변경") {
				event.preventDefault(); // 버튼 값이 "변경"이 아니면 폼 제출을 막음
				$("#memberPhoneNumberFeedback").show();
				// 스위트 알럿창 출력
				printSweetAlert("warning", "핸드폰 번호를 인증하세요.");
				return false; // 폼 제출을 방지
			}

			// 이메일 입력 필드 처리
			// 직접입력일 경우
			if ($("#selectEmailAddress").val() === "setInputEmailAddress") {
				// selectEmailAddress 비활성화
				$("#selectEmailAddress").prop("disabled", true);
				// inputEmailAddress의 name 속성을 설정
				$("#inputEmailAddress").prop("name", "memberEmailDomain");
			}

			// 입력받는 값들 공백 제거 후 값을 다시 설정
			$("#memberId").val($("#memberId").val().replace(/\s+/g, ""));
			$("#memberPassword").val($("#memberPassword").val().replace(/\s+/g, ""));
			$("#memberEmailId").val($("#memberEmailId").val().replace(/\s+/g, ""));
			$("#inputEmailAddress").val($("#inputEmailAddress").val().replace(/\s+/g, ""));
			$("#memberName").val($("#memberName").val().replace(/\s+/g, ""));
			$("#memberPhoneNumber").val($("#memberPhoneNumber").val().replace(/\s+/g, ""));

			// 비동기 가입 폼 제출
			$.ajax({
				type: "POST", // 방식
				url: memberJoinServletUrl, // 찾아갈 주소
				data: $(this).serialize(), // 폼 데이터를 직렬화하여 전송
				dataType: "text", // 받을 타입
				success: (response) => { // 요청 성공 시
					if (response === "true") { // 가입 성공 시
						console.log("회원가입 성공");
						// 스위트 알럿창 출력
						printSweetAlert("success", "고객님의 가입을 환영합니다.", "", "main.do");
					}
					else { // 가입 실패 시
						console.log("회원가입 실패");
						// 스위트 알럿창 출력
						printSweetAlert("error", "회원가입에 실패했습니다.", "지속될 시 관리자에게 문의하세요.", "error.do");
					}
				},
				error: (xhr, status, error) => { // 요청 실패 시
					console.error("AJAX 요청 에러 발생", xhr.status, status, error);
					// 스위트 알럿창 출력
					printSweetAlert("error", "서버에 문제가 발생했습니다.", "지속될 시 관리자에게 문의하세요.", "error.do");
				}
			});
		}

		// 폼에 'was-validated' 클래스를 추가하여 유효성 검사 상태를 시각적으로 표시
		$(this).addClass("was-validated");
	});
}

// 비동기 초기화 기능
async function initPage() {
	// 로그인 상태에 맞는 회원번호 반환 함수 호출
	loginedMemberNumber = await getLoginedMemberNumber();
	console.log("로그인한 회원번호 : [" + loginedMemberNumber + "]");

	if (loginedMemberNumber) { // 로그인 상태라면
		// 스위트 알럿창 출력
		printSweetAlert("error", "올바르지 않은 접근입니다.", "메인페이지로 이동합니다.", "main.do");
	}

	// 초기 이벤트 리스너 등록 함수 호출
	initEventListeners();
	// 초기 기능 실행 함수 호출
	runPostLoginSetup();
}

$(document).ready(() => {
	initPage(); // 비동기 초기화 함수 호출
});