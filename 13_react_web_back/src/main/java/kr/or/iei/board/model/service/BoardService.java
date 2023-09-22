package kr.or.iei.board.model.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.iei.PageInfo;
import kr.or.iei.Pagenation;
import kr.or.iei.board.model.dao.BoardDao;
import kr.or.iei.board.model.vo.Board;
import kr.or.iei.board.model.vo.BoardFile;
import kr.or.iei.member.model.dao.MemberDao;
import kr.or.iei.member.model.vo.Member;

@Service
public class BoardService {
	@Autowired
	private BoardDao boardDao;
	@Autowired
	private Pagenation pagenation;
	@Autowired
	private MemberDao memberDao;

	//게시물 조회
	public Map boardList(int reqPage) {
		//게시물 조회, 페이징에 필요한 데이터를 취합
		int numPerPage = 12; //한 페이지당 게시물 수
		int pageNaviSize = 5; //페이지 네비게이션에 표시되는 개수(길이)
		int totalCount = boardDao.totalCount(); //전체 게시물 수
		
		//페이징 조회 및 페이지네비 제작에 필요한 데이터를 객체로 받아옴
		PageInfo pi = pagenation.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
		
		List boardList = boardDao.selectBoardList(pi); //pi로 start, end값을 mybatis로 넘김
		
		//pi와 boardList를 반환해야하나, 1개만 	반환할 수 있다.
		//방법1. VO 제작
		//방법2. Map(HashMap) 사용
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("boardList", boardList);
		map.put("pi", pi);
		
		return map;
	}

	//게시글 작성
	@Transactional
	public int insertBoard(Board b, ArrayList<BoardFile> fileList) {
		System.out.println(b);
		System.out.println(fileList);
		
		//Board테이블에 insert하기 위해서는 회원번호를 알아야한다.
		//작성자 정보를 현재 아이디만 알고있다. -> Board테이블에는 회원번호가 외래키로 설정되어있다.
		//아이디를 이용하여 회원번호를 구해온다(회원정보를 조회하여 회원 정보 중 회원번호를 사용한다)
		Member member = memberDao.selectOneMember(b.getMemberId());
		System.out.println("memberNo: "+member.getMemberNo());
		b.setBoardWriter(member.getMemberNo());
		System.out.println("BoardWriter: "+b.getBoardWriter());
		System.out.println("BoardNo: "+b.getBoardNo());
		int result = boardDao.insertBoard(b);
		for(BoardFile boardFile : fileList) {
			boardFile.setBoardNo(b.getBoardNo()); //board-mapper의 <selectKey>에서 구해진 boardNo를 삽입
			
			result += boardDao.insertBoardFile(boardFile);
			System.out.println("result "+result);
		}
		if(result == 1 + fileList.size()) {
			return result;
		}else {
			return 0;
		}
	}

	//게시글 상세보기
	public Board selectOneBoard(int boardNo) {
		Board b = boardDao.selectOneBoard(boardNo);
//		List fileList = boardDao.selectOneBoardFile(boardNo);
//		b.setFileList(fileList);
		return b;
	}

	//게시글 파일 다운로드
	public BoardFile getBoardFile(int boardFileNo) {
		// TODO Auto-generated method stub
		return boardDao.getBoardFile(boardFileNo);
	}

	//게시글 삭제
	@Transactional
	public List<BoardFile> delete(int boardNo) {
		//1. 게시글 조회
		List<BoardFile> list = boardDao.selectBoardFileList(boardNo);
		//2. 게시글 삭제
		int result = boardDao.deleteBoard(boardNo);
		if(result > 0) {
			return list;
		}
		return null;
	}

	//게시물 수정
	@Transactional
	public List<BoardFile> modify(Board b, ArrayList<BoardFile> fileList) {
		List<BoardFile> delFileList = new ArrayList<BoardFile>();
		String [] delFileNo = {};
		int result = 0;
		if(!b.getDelFileNo().equals("")) {
			delFileNo = b.getDelFileNo().split("/");
			//1. 삭제한 파일이 있으면 조회
			delFileList = boardDao.selectBoardFile(delFileNo);			
			//2. 삭제할 파일 삭제
			result += boardDao.deleteBoardFile(delFileNo);
		}
		//3. 추가할 파일 있으면 추가
		for(BoardFile bf : fileList) {
			result += boardDao.insertBoardFile(bf);
		}
		//4. board테이블 변경
		result += boardDao.updateBoard(b);
		
		//board테이블 update + 새로추가한 파일개수 +  파일 삭제한 것
		if(result == 1+fileList.size()+delFileNo.length) {
			return delFileList;
		}else {			
			return null;
		}
	}
}
