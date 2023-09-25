import { Route, Routes } from "react-router-dom";
import Footer from "./component/common/Footer";
import Header from "./component/common/Header";
import Join from "./component//member/Join";
import Login from "./component/member/Login";
import { useEffect, useState } from "react";
import { MemberMain } from "./component/member/MemberMain"; //다중 export로 중괄호{ }사용
import BoardMain from "./component/board/BoardMain";
import AdminMain from "./component/admin/AdminMain";
import Main from "./component/common/Main";

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [num, setNum] = useState(0);
  //*중요
  //useEffect hooks: 초기 state값을 최초에 수정해서 사용하는 경우,
  //                 re-render가 무한 반복이 일어나는 경우 이를 해결하기 위한 hooks
  //                 'window.onload = function(){}'을 대체해 주는 hooks
  //                 useEffect(function(), []): 최초에 function이 한 번 실행됨
  //                 useEffect내부 함수의 값을 변경하려면, 두 번째 매개변수(배열[])에 변경 조건을 입력
  //                 특정 조건에서 값을 변경시키기 위해 사용.
  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (token === null) {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [num]);

  return (
    <div className="wrap">
      <Header isLogin={isLogin} setIsLogin={setIsLogin} />
      <div className="content">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/join" element={<Join />} />
          <Route path="/login" element={<Login setIsLogin={setIsLogin} />} />
          <Route
            path="/member/*"
            element={<MemberMain setIsLogin={setIsLogin} isLogin={isLogin} />}
          />
          <Route path="/admin/*" element={<AdminMain isLogin={isLogin} />} />
          <Route
            path="/board/*"
            element={<BoardMain isLogin={isLogin} setIsLogin={setIsLogin} />}
          />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
