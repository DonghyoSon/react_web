package kr.or.iei;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {
	//토큰을 새로 생성하는 메서드
	public String createToken(String memberId, String secretKey, long expiredMs) {
		System.out.println(memberId);
		System.out.println(secretKey);
		System.out.println(expiredMs);
		
		Claims claims = Jwts.claims(); //생성하는 토큰을 통해서 얻을 수 있는 값을 저장하는 객체
		claims.put("memberId", memberId);
		SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes()); //우리가 저장한 문자열을 이용해서 암호화 코드를 생성
		return Jwts.builder()
				.setClaims(claims)
				.setIssuedAt(new Date(System.currentTimeMillis())) //인증 시작 시간
				.setExpiration(new Date(System.currentTimeMillis()+expiredMs)) //인증 만료 시간
				.signWith(key,SignatureAlgorithm.HS256)//암호화 시 사용할 키
				.compact();
	}
	
	//토큰이 만료되었는지 체크하는 메서드
	public boolean isExpired(String token, String secretKey) {
		SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());
		return Jwts.parserBuilder()
				.setSigningKey(key).build()
				.parseClaimsJws(token)
				.getBody() //인증 정보를 가지고 온 상태
				.getExpiration().before(new Date());
	}
	
	//토큰 정보를 이용하여 로그인 한 회원의 아이디를 추출
	public String getMemberId(String token, String secretKey) {
		SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());
		return Jwts.parserBuilder()
				.setSigningKey(key).build()
				.parseClaimsJws(token)
				.getBody() //인증 정보를 가지고 온 상태
				.get("memberId",String.class);
	}
}
