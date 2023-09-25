import { useEffect, useState } from "react";
import "./board.css";
import axios from "axios";
import Pagenation from "../common/Pagination";
import { Button1 } from "../util/Buttons";
import { useNavigate } from "react-router-dom";

const BoardList = (props) => {
  const isLogin = props.isLogin;
  const [boardList, setBoardList] = useState([]);
  const [reqPage, setReqPage] = useState(1); //1로 시작
  const [pageInfo, setPageInfo] = useState({});

  //useEffect: 최초에 1회 수행후, [ ]배열 값이 달라지면 값에 따라 한 번 더 수행
  useEffect(() => {
    //로그인 체크 후 조회시: post
    axios
      .get("/board/list/" + reqPage) //get메서드 사용
      .then((res) => {
        console.log(res.data); //서버로부터 반환된 pi, boardList가 들어있다.
        setBoardList(res.data.boardList); //res.data의 'boardList'key의 값을 setBoardList에 넣음
        setPageInfo(res.data.pi); //res.data의 'pi'key의 값을 setPageInfo에 넣음
      })
      .catch((res) => {
        console.log(res.response.status);
      });
  }, [reqPage]);

  const navigate = useNavigate();
  const write = () => {
    navigate("write");
  };

  return (
    <div>
      {isLogin ? (
        <div className="board-write-btn">
          <Button1 text="글쓰기" clickEvent={write} />
        </div>
      ) : (
        ""
      )}

      <div className="board-list-wrap">
        {boardList.map((board, index) => {
          return <BoardItem key={"board" + index} board={board} />;
        })}
      </div>
      <div className="board-page">
        <Pagenation
          reqPage={reqPage}
          setReqPage={setReqPage}
          pageInfo={pageInfo}
        />
      </div>
    </div>
  );
};

const BoardItem = (props) => {
  const board = props.board;
  const navigate = useNavigate();
  const boardView = () => {
    navigate("/board/view", { state: { boardNo: board.boardNo } });
  };
  return (
    <div className="board-item" onClick={boardView}>
      <div className="board-item-img">
        {board.boardImg === null ? (
          <img src="/image/default.png" />
        ) : (
          <img src={"/board/" + board.boardImg} />
        )}
      </div>
      <div className="board-item-info">
        <div className="board-item-title">{board.boardTitle}</div>
        <div className="board-item-writer">{board.memberId}</div>
        <div className="board-item-date">{board.boardDate}</div>
      </div>
    </div>
  );
};

export default BoardList;
