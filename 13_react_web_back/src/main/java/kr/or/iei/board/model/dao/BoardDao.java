package kr.or.iei.board.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.PageInfo;
import kr.or.iei.board.model.vo.Board;
import kr.or.iei.board.model.vo.BoardFile;

@Mapper
public interface BoardDao {

	//전체 게시물 수
	int totalCount();

	//페이지 네비게이션 및 게시물 개수 조회
	List selectBoardList(PageInfo pi);

	//게시글 작성
	int insertBoard(Board b);

	//게시글 작성 파일 업로드
	int insertBoardFile(BoardFile boardFile);

	//게시글 상세보기
	Board selectOneBoard(int boardNo);

	//게시글 상세보기 - 파일
	List selectOneBoardFile(int boardNo);

	//게시글 파일 다운로드
	BoardFile getBoardFile(int boardFileNo);

}
