package kr.or.iei.member.controller;


import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController //MemberController에 작성되는 메서드는 모두 @ResponseBody가 적용됨(모든 메서드가 비동기 요청)
@RequestMapping(value="/member")
public class MemberController {
	
}
