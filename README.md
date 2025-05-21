# honeyComboFactory 프로젝트 🍯
편의점 식품을 조합하여 세트로 판매하는 꿀조합팩토리 -최종 프로젝트-

## 기술 스택 ⚙️
<!-- 기술 스택 배지 -->
<p align="center">
  <!-- 첫 번째 줄: 프로그래밍 언어 -->
  <img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java" />&nbsp;
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />&nbsp;
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />&nbsp;
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
</p>

<p align="center">
  <!-- 두 번째 줄: 프레임워크 및 라이브러리 -->
  <img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" alt="Spring Boot" />&nbsp;
  <img src="https://img.shields.io/badge/MyBatis-000000?style=for-the-badge&logo=mybatis&logoColor=white" alt="MyBatis" />&nbsp;
  <img src="https://img.shields.io/badge/JDBC-007396?style=for-the-badge&logo=java&logoColor=white" alt="JDBC" />&nbsp;
</p>

<p align="center">
  <!-- 세 번째 줄: 데이터베이스 -->
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />&nbsp;
  <img src="https://img.shields.io/badge/Oracle-F80000?style=for-the-badge&logo=oracle&logoColor=white" alt="Oracle" />
</p>

## 프로젝트 클론 📥
git clone https://github.com/JoungGyuMin/honeycombofactory.git

## 프로젝트 디렉토리 구조 🗂️
```
honeyComboFactory/
├── pom.xml                          # Maven 빌드 설정
├── README.md
├── .gitignore

├── src/
│   └── main/
│       └── java/
│           └── zic.honeyComboFactory/
│               ├── api.auth/                   # 로그인 상태 확인 및 세션 정보 반환
│
│               ├── biz/                        # 비즈니스 로직 계층 (VO/DAO/Service)
│               │   ├── boardCombo/             # 꿀조합 게시판
│               │   ├── boardComboLiked/        # 게시판 좋아요
│               │   ├── member/                 # 회원 DAO/Service
│               │   ├── productCombo/           # 콤보 상품
│               │   ├── productComboComponent/  # 콤보 구성 요소
│               │   ├── productSingle/          # 단일 상품
│               │   ├── purchase/               # 결제 및 구매 처리
│               │   └── review/                 # 리뷰 기능
│
│               ├── common/
│               │   ├── config/                 # 스프링 설정 클래스
│               │   ├── http/                   # HTTP GET/POST 유틸
│               │   ├── service/                # 공통 서비스 로직
│               │   ├── transaction/            # 트랜잭션 AOP 처리
│               │   └── util/                   # 암호화, QR, JDBC 유틸
│
│               ├── external.sms/               # 문자 인증 서비스 연동
│
│               ├── view/                       # 사용자 요청 처리 (Controller 계층)
│               │   ├── boardCombo/             # 게시판 컨트롤러
│               │   ├── boardComboLiked/        # 좋아요 컨트롤러
│               │   ├── member/                 # 회원 및 소셜 로그인
│               │   ├── page/                   # 메인/마이페이지/관리자 이동 처리
│               │   ├── product/                # 상품 컨트롤러
│               │   ├── purchase/               # 구매 요청 및 장바구니 처리
│               │   └── review/                 # 리뷰 컨트롤러
│
│               ├── HoneyComboFactoryApplication.java   # 메인 실행 클래스
│               └── ServletInitializer.java             # WAR 배포용 서블릿 초기화

├── resources/
│   ├── mappings/                     # MyBatis SQL 매핑 XML
│   ├── static/assets/                # 정적 리소스 (js, css, img)
│   ├── templates/                    
│   ├── application.properties
│   ├── application.yml
│   └── sql-map-config.xml

├── webapp/
│   ├── admin/                        # 관리자 JSP 화면
│   └── client/                       # 사용자 JSP 화면

└── src/test/java/                   # 테스트 코드
```


## 주요 패키지 설명 📚

### DB (biz) 💼
- **boardCombo**: 게시판 관련 클래스 📝
- **boardComboLiked**: 게시글 좋아요 관련 클래스 ❤️
- **member**: 회원 관련 클래스 👥
- **productCombo**: 꿀조합 상품 관련 클래스 🍯🛍️
- **productComboComponent**: 꿀조합 상품 구성품 관련 클래스 🧩
- **productSingle**: 개별 상품 관련 클래스 📦
- **purchase**: 구매 관련 클래스 🛒
- **purchaseDetail**: 구매 상세정보 관련 클래스 📄
- **review**: 리뷰 관련 클래스 💬

### 인증 (auth) 💼
- **SessionController**: 세션에 저장된 로그인한 회원정보 반환 관련 클래스 🔐

### 크롤링 (crawling) 🕷️
- **CrawlingListener**: 서버 실행 시 크롤링 관련 클래스 ⚙️
- **CuCrawlingMybatisService**: Cu상품 Mybatis용 크롤링 기능 관련 클래스 🛠️
- **CuCrawlingService**: Cu상품 JDBC용 크롤링 기능 관련 클래스 🛠️
- **GsCrawlingMybatisService**: Gs25상품 Mybatis용 크롤링 기능 관련 클래스 🛠️
- **GsCrawlingService**: Gs25상품 JDBC용 크롤링 기능 관련 클래스 🛠️

### 공통로그 (aop) 📋
- **LogAdvice**: 결합(Aspect) 관련 클래스 🔄
- **PointcutCommon**: 포인트컷 관련 클래스 🎯
  
### 외부 연동 (external) 🌐
- **SmsAPIService**: 문자 메일 발송 관련 클래스 ✉️📲

### 설정 (config) ⚙️
- **CKEditor5ImgUploadConfig**: CKEditor5 이미지 업로드 관련 설정 🖼️
- **DataSourceConfig**: DB 연결 관련 설정 🗄️
- **TransactionConfig**: 트랜잭션 관련 설정 🔄
- **ViewResolverConfig**: VR(View Resolver) 관련 설정 🖥️

### 트랜잭션 (transaction) 🔁
- **ReadOnlyTransactionAspect**: Read류 트랜잭션 결합(Aspect) 처리 관련 클래스 📖

### 서비스 (service) 🧠
- **ProductService**: 상품 재고 조회 및 재고 감소 관련 서비스 클래스 🛒
- **PurchaseDetailTransactionService**: 구매 상세정보 DB 저장 관련 서비스 클래스 💳
- **PurchaseProcessService**: 구매 승인 트랜잭션 처리 서비스 클래스 ⚙️
- **PurchaseTransactionMybatisService**: 구매 정보 DB 저장 Mybatis용 관련 서비스 클래스 ⚙️
- **PurchaseTransactionService**: 구매 정보 DB 저장 JDBC용 관련 서비스 클래스 ⚙️
- **ShoppingCartService**: 장바구니 상품 삭제 관련 서비스 🛍️

### 뷰 (view) 👁️
- **boardCombo**: 게시판 기능 관련 클래스 📝
- **boardComboLiked**: 게시글 좋아요 기능 관련 클래스 ❤️
- **member**: 회원 기능 관련 클래스 👥
- **page**: 페이지 이동 기능 관련 클래스 📄
- **product**: 상품 기능 관련 클래스 🛍️
- **purchase**: 구매 기능 관련 클래스 🛒
- **review**: 리뷰 기능 관련 클래스 💬

### 유틸리티 (util) 🔧
- **HttpClientUtil**: HTTP 요청 유틸리티 🌐
- **MySQLJDBCUtil**: MySQL 연결 유틸리티 🐬
- **OracleJDBCUtil**: 오라클 연결 유틸리티 🐘
- **PasswordEncoderUtil**: 비밀번호 해싱 암호화 관련 유틸리티 🔒
- **PasswordGeneratorUtil**: 비밀번호 랜덤 생성 유틸리티 🎲
- **QrUtil**: QR코드 생성 유틸리티 📱

## 프로젝트 주요 기능 ✨

- 브랜드 혼합 세트 상품 제공 🧃
- 상품 정보 통합 검색 및 필터링 🔍
- 조합 상품 기반 결제 기능 💳
- 커뮤니티 게시판 기능 📝
- 리뷰 및 별점 시스템 🌟
- 편의점 위치 안내 📍

