package kr.or.iei;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@EnableWebSecurity
@Configuration
public class JwtConfig {
	@Value("${jwt.secret}")
	private String secretKey;
	@Autowired
	private JwtUtil jwtUtil;

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{
		return http
				.httpBasic().disable() //HTTP 기본인증을 비활성화(사용자명/비밀번호로 인증을 사용하지 않음)
				.csrf().disable().cors() //csrf공격을 비활성화 /cors: 백엔드와 프론트가 동일할 때 설정 
				.and()
				.authorizeHttpRequests() //요청에 대한 권한 설정
				.antMatchers(HttpMethod.POST,"/member/login", "/member/join").permitAll() //permitAll(): POST요청 중, '/member/login', '/member/join'은 허용
				.antMatchers(HttpMethod.POST, "/member/**", "/board/insert").authenticated() //authenticated(): POST요청 중, '/member/'로 시작하면 반드시 인증 수행
				.and()
				.sessionManagement() //세션관련 설정
				.sessionCreationPolicy(SessionCreationPolicy.STATELESS) //STATELESS: 세션을 상태가 없는 상태로 운영한다. -> JWT로 인증하는 경우 사용하는 설정
				.and() 
				.addFilterBefore(new JwtFilter(secretKey, jwtUtil), 
						UsernamePasswordAuthenticationFilter.class) //필터를 통한 인증 승인 처리
				.build();
	}
}
