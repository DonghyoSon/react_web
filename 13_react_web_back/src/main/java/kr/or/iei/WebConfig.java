package kr.or.iei;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

	@Override //alt + shift + s -> v
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		//글쓰기(에디터)
		registry.addResourceHandler("/board/**").addResourceLocations("file:///C:/Temp/react_web/board/"); 
		registry.addResourceHandler("/board/editor/**").addResourceLocations("file:///C:/Temp/react_web/board/editor/"); 
	}

	@Bean
	public BCryptPasswordEncoder bCryptPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}
}
