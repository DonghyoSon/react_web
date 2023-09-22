import { Route, Routes } from "react-router-dom";
import "./board.css";
import BoardList from "./BoardList";
import BoardWrite from "./BoardWrite";
import BoardView from "./BoardView";
import BoardModify from "./BoardModify";

//<Route path="*">: path에 '*'이 들어가면 <Routes>의 가장 하단에 작성한다.
const BoardMain = (props) => {
  const isLogin = props.isLogin;
  const setIsLogin = props.setIsLogin;

  return (
    <div className="board-all-wrap">
      <div className="board-title">BOARD</div>
      <Routes>
        <Route path="write" element={<BoardWrite />} />
        <Route path="view" element={<BoardView isLogin={isLogin} />} />
        <Route path="modify" element={<BoardModify />} />
        <Route path="*" element={<BoardList isLogin={isLogin} />} />
      </Routes>
    </div>
  );
};

export default BoardMain;
