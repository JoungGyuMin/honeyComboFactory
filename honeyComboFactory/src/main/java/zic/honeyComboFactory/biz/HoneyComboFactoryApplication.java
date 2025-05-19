package zic.honeyComboFactory.biz;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "zic.honeyComboFactory")
public class HoneyComboFactoryApplication {

	public static void main(String[] args) {
		SpringApplication.run(HoneyComboFactoryApplication.class, args);

		// 서버 포트에 맞춰 자동으로 브라우저 열기
		final String url = "http://localhost:8088/";
		try {
			// 현재 운영체제 이름을 소문자로 가져오기
			String os = System.getProperty("os.name").toLowerCase();
			// 명령어 실행에 사용할 Java의 런타임 환경 객체 가져오기
			Runtime runtime = Runtime.getRuntime();

			// 운영체제가 윈도우(Windows)일 경우
			if (os.contains("win")) {
				runtime.exec("rundll32 url.dll,FileProtocolHandler " + url);
			}
			// 운영체제가 맥(macOS)일 경우
			else if (os.contains("mac")) {
				runtime.exec("open " + url);
			} else { // 운영체제가 그 외일 경우
				System.out.println("지원하지 않는 OS입니다. 수동으로 브라우저 열어주세요.");
			}
		} catch (Exception e) {
			System.out.println("서버 실행 시 브라우저 자동 실행 실패");
			e.printStackTrace();
		}
	}

}
