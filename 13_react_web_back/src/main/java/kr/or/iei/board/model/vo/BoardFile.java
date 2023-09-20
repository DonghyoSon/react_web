package kr.or.iei.board.model.vo;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Alias(value="boardFile")
public class BoardFile {
	private int boardFileNo;
	private int boardNo;
	private String filename;
	private String filepath;
}
