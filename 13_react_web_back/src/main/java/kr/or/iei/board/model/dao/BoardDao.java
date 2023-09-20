package kr.or.iei.board.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.PageInfo;

@Mapper
public interface BoardDao {

	//전체 게시물 수
	int totalCount();

	//페이지 네비게이션 및 게시물 개수 조회
	List selectBoardList(PageInfo pi);

}
