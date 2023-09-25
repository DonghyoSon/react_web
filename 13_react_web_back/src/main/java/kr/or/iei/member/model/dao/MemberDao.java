package kr.or.iei.member.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.PageInfo;
import kr.or.iei.member.model.vo.Member;

@Mapper
public interface MemberDao {

	Member selectOneMember(String memberId);

	int insertMember(Member member);

	int changePhone(Member member);

	int delete(String memberId);

	int changePw(Member member);

	//관리자 페이지 - 회원관리
	int totalCount();

	//관리자 페이지 - 회원관리
	List memberList(PageInfo pi);

	//관리자 페이지 - 회원관리(등급변경)
	int changeType(Member member);

}
