package kr.or.iei.member.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import kr.or.iei.member.model.service.MemberService;
import kr.or.iei.member.model.vo.Member;

@RestController //MemberController에 작성되는 메서드는 모두 @ResponseBody가 적용됨(모든 메서드가 비동기 요청)
@RequestMapping(value="/member")
public class MemberController {
	@Autowired
	private MemberService memberService;
	/*
	 * Join.js - const Join() - axios 방법1.
	@GetMapping(value="checkId")
	public int checkId(String memberId) //프론트에서 전달된 값(문자열 형태로 받는다 /key는 문자열)
	{
		System.out.println("중복 체크할 아이디: "+memberId);
		Member m = memberService.selectOneMember(memberId);
		if(m==null) {
			return 0; //중복되는 아이디 없음
		}else{
			return 1;
		}
	}
	*/
	//Join.js - const Join() - axios 방법2.
	@GetMapping(value="/checkId/{memberId}")
	public int checkId(@PathVariable String memberId) //@PathVariable 경로에 있는 변수명을 가지고 온다.
	{
		Member m = memberService.selectOneMember(memberId);
		if(m==null) {
			return 0; //중복되는 아이디 없음
		}else{
			return 1;
		}
	}
	
	@PostMapping(value="/join")
	public int join(@RequestBody Member member) {
		System.out.println(member);
		//service 호출 시 메서드 이름이 Member로 끝나면서 매개변수가 Member타입이면 비밀번호 암호화 수행
		int result = memberService.insertMember(member);
		return result;
	}
	
	@PostMapping(value="/login")
	public String login(@RequestBody Member member) {
		String result = memberService.login(member);
		return result;
	}
	
	@PostMapping(value="/getMember")
	public Member mypage(@RequestAttribute String memberId) {
		return memberService.selectOneMember(memberId);
	}
	
	@PostMapping(value="/changePhone")
	public int changePhone(@RequestBody Member member) {
		return memberService.changePhone(member);
	}
	
	@PostMapping(value="/delete")
	public int delete(@RequestAttribute String memberId) {
		return memberService.delete(memberId);
	}
	
	@PostMapping(value="/pwCheck")
	public int pwCheck(@RequestBody Member member, @RequestAttribute String memberId) //JwtFilter를 통해 memberId를 얻음 
	{
		member.setMemberId(memberId);
		return memberService.pwCheck(member);
	}
	
	@PostMapping(value="/changePw")
	public int changePw(@RequestBody Member member, @RequestAttribute String memberId) {
		member.setMemberId(memberId);
		return memberService.changePwMember(member);
	}
}
