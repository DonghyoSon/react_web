package kr.or.iei;

import org.springframework.stereotype.Component;

@Component
//numPerPage, pageNaviSize, totalCount를 전달받음
public class Pagination {
	public PageInfo getPageInfo(int reqPage, int numPerPage, int pageNaviSize, int totalCount) {
		int end = reqPage * numPerPage; //페이지 네비의 끝
		int start = end - numPerPage +1; //페이지 네비의 시작 /한국식 나이계산과 비슷
		int totalPage = (int)Math.ceil(totalCount/(double)numPerPage);
		int pageNo = ((reqPage -1)/pageNaviSize) * pageNaviSize +1;
		PageInfo pi = new PageInfo(start, end, pageNo, pageNaviSize, totalPage);
		return pi;
		//값만 구하고 화면제작은 따로 수행할 예정
	}
}
