import "./pagination.css";

const Pagenation = (props) => {
  const pageInfo = props.pageInfo;
  const reqPage = props.reqPage;
  const setReqPage = props.setReqPage;
  const changePage = (e) => {
    const changePage = e.currentTarget.innerText;
    console.log(changePage);
    setReqPage(changePage); //changePage를 Number로 변환하여 삽입하면 '다음'버튼 로직 작성히 Number변환이 불필요하다.
  };

  //페이징 JSX가 저장될 배열
  const arr = new Array();

  //제일 앞 페이지로 보내는 버튼
  arr.push(
    <span
      onClick={() => {
        setReqPage(1);
      }}
      key="first-page"
      className="material-icons page-item"
    >
      first_page
    </span>
  );
  //이전 페이지로 보내는 버튼
  arr.push(
    <span
      onClick={() => {
        if (reqPage != 1) {
          //현재 페이지가 1이 아닐 때만 수행
          setReqPage(reqPage - 1);
        }
      }}
      key="prev-page"
      className="material-icons page-item"
    >
      navigate_before
    </span>
  );

  //페이징 숫자 버튼
  let pageNo = pageInfo.pageNo;
  for (let i = 0; i < pageInfo.pageNaviSize; i++) {
    if (pageNo === Number(reqPage)) {
      //현재 페이지 디자인을 다르게
      arr.push(
        <span
          onClick={changePage}
          key={"page" + i}
          className="page-item active-page"
        >
          {pageNo}
        </span>
      );
    } else {
      arr.push(
        <span onClick={changePage} key={"page" + i} className="page-item">
          {pageNo}
        </span>
      );
    }
    pageNo++;
    if (pageNo > pageInfo.totalPage) {
      break;
    }
  }

  //다음 페이지로 보내는 버튼
  arr.push(
    <span
      onClick={() => {
        if (reqPage != pageInfo.totalPage) {
          //맨 마지막 페이지가 아닐 때
          setReqPage(Number(reqPage) + 1); //'문자열 - 숫자'는 문자열을 숫자로 자동으로 변환하여 수행하나, '문자열 + 숫자'는 자동 변환을 하지 않으므로, 숫자로 변환(Number)를 해야한다.
        }
      }}
      key="next-page"
      className="material-icons page-item"
    >
      navigate_next
    </span>
  );
  //제일 마지막 페이지로 보내는 버튼
  arr.push(
    <span
      onClick={() => {
        setReqPage(pageInfo.totalPage);
      }}
      key="last-page"
      className="material-icons page-item"
    >
      last_page
    </span>
  );

  return <div className="paging-wrap">{arr}</div>; //페이징 JSX가 저장된 배열 출력
};

export default Pagenation;
