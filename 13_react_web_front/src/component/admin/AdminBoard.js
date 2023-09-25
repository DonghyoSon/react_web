import "./admin.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Pagenation from "../common/Pagination";
import Switch from "@mui/material/Switch";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const AdminBoard = () => {
  const [boardList, setBoardList] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [reqPage, setReqPage] = useState(1);
  useEffect(() => {
    axios
      .get("/board/adminList/" + reqPage)
      .then((res) => {
        console.log(res.data);
        setBoardList(res.data.list);
        setPageInfo(res.data.pi);
      })
      .catch((res) => {
        console.log(res);
      });
  }, [reqPage]);
  return (
    <div className="my-content-wrap">
      <div className="my-content-title">게시글 관리</div>
      <div className="admin-board-tbl">
        <table>
          <thead>
            <tr>
              <td width={"10%"}>글번호</td>
              <td width={"45%"} className="title-td">
                제목
              </td>
              <td width={"15%"}>작성자</td>
              <td width={"15%"}>작성일</td>
              <td width={"15%"}>공개여부</td>
            </tr>
          </thead>
          <tbody>
            {boardList.map((board, index) => {
              return <BoardItem key={"board" + index} board={board} />;
            })}
          </tbody>
        </table>
      </div>
      <div className="admin-paging-wrap">
        <Pagenation
          pageInfo={pageInfo}
          reqPage={reqPage}
          setReqPage={setReqPage}
        />
      </div>
    </div>
  );
};

const BoardItem = (props) => {
  const board = props.board;
  const navigate = useNavigate();
  const [status, setStatus] = useState(board.boardStatus === 1 ? true : false);
  const boardDetail = () => {
    navigate("/board/view", { state: { boardNo: board.boardNo } });
  };
  const changeStatus = (e) => {
    const boardNo = board.boardNo;
    const checkStatus = e.target.checked;
    const boardStatus = checkStatus ? 1 : 2;
    const obj = { boardNo, boardStatus }; // const obj = { boardNo: boardNo, boardStatus: boardStatus };
    const token = window.localStorage.getItem("token");
    axios
      .post("/board/changeStatus", obj, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        if (res.data === 1) {
          console.log(e.target.checked);
          setStatus(checkStatus);
        } else {
          Swal.fire("변경 중 문제가 발생하였습니다.");
        }
      })
      .catch((res) => {
        console.log(res);
      });
  };
  return (
    <tr>
      <td>{board.boardNo}</td>
      <td className="title-td" onClick={boardDetail}>
        <div>{board.boardTitle}</div>
      </td>
      <td>{board.memberId}</td>
      <td>{board.boardDate}</td>
      <td className="status-td">
        {/* {board.boardStatus} */}
        <Switch onChange={changeStatus} checked={status} />
        {/*<Switch>는 checkBox박스이다. */}
      </td>
    </tr>
  );
};

export default AdminBoard;
