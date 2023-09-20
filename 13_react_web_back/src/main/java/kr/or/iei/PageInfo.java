package kr.or.iei;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
//PageInfo클래스는 mybatis에서 사용하지 않으므로 @Alias 미설정
public class PageInfo {
	private int start;
	private int end;
	private int pageNo; //페이징 시작번호
	private int pageNaviSize;
	private int totalPage;
}
