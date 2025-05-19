package zic.honeyComboFactory.biz.common.aop;

import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;

@Aspect // 포인트컷과 공통로직을 결합하는 어노테이션
public class PointcutCommon { // 포인트컷 객체
	// 모든 핵심 비즈니스 로직
	@Pointcut("execution(* zic.honeyComboFactory.biz..*Impl.*(..))")
	public void logAdvice() {}
}
