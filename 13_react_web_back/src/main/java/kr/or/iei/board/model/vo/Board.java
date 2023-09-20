package kr.or.iei.board.model.vo;

import java.util.List;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="board")
public class Board {
	private int boardNo;
	private String boardTitle;
	private String boardImg;
	private String boardDetail;
	private int boardWriter;
	private int boardStatus;
	private String boardDate;
	
	//변수 추가
	private String memberId; //작성자를 아이디로 보기 위함 /화면처리를 위한 게시글 작성자
	private List fileList; //파일등록에 필요한 리스트 /해당 게시글의 첨부파일 리스트
	private String delFileNo; //파일을 삭제할 때, 파일번호를 문자열로 받아오기 위함 /파일 삭제시 저장할 변수
}
