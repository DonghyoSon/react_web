import { useState } from "react";
import "./login.css";
import Input from "../../util/InputFrm";
import { Link, useNavigate } from "react-router-dom";
import { Button1, Button2, Button3 } from "../../util/Buttons";
import axios from "axios";
import Swal from "sweetalert2";

/*
기존 로그인
1. 아이디/패스워드 입력
2. db정보 조회
3. 아이디와 패스워드가 일치하면 session 회원정보저장
(SSR -> 서버에서 사용자 화면을 만들어주기 때문에 화면 제작시 세션정보 사용 가능)
----------------------------------------------------------------------------------------
새로운 방식의 로그인
1. 아이디/패스워드 입력
2. DB정보 조회
3. 아이디와 패스워드가 일치하면 암호화 토큰 생성
4. 토큰을 React에 전달
5. React서버에서 특정 영역에 해당 토큰을 저장
*/
const Login = (props) => {
  const setIsLogin = props.setIsLogin;
  const [memberId, setMemberId] = useState("");
  const [memberPw, setMemberPw] = useState("");
  const navigate = useNavigate();
  const join = () => {
    navigate("/join");
  };
  const login = () => {
    const member = { memberId, memberPw };
    axios
      .post("/member/login", member)
      .then((res) => {
        console.log(res.data);
        if (res.data === "실패") {
          Swal.fire("아이디 또는 비밀번호를 확인하세요.");
        } else {
          window.localStorage.setItem("token", res.data); //localStorage: 문자열만 넣을 수 있다.
          setIsLogin(true);
          navigate("/");
        }
      })
      .catch((res) => {
        console.log(res.data);
      });
  };
  return (
    <div className="login-wrap">
      <div className="login-title">LOGIN</div>
      <div className="input-wrap">
        <label htmlFor="memberId">아이디</label>
        <Input
          type="text"
          data={memberId}
          setData={setMemberId}
          content="memberId"
        />
      </div>
      <div className="input-wrap">
        <label htmlFor="memberPw">비밀번호</label>
        <Input
          type="password"
          data={memberPw}
          setData={setMemberPw}
          content="memberPw"
        />
      </div>
      <div className="search-box">
        <Link to="#">아이디 찾기</Link>
        <span className="material-icons">horizontal_rule</span>
        <Link to="#">비밀번호 찾기</Link>
      </div>
      <div className="login-btn-box">
        <Button1 text="로그인" clickEvent={login} />
      </div>
      <div className="login-btn-box">
        <Button2 text="회원가입" clickEvent={join} />
      </div>
    </div>
  );
};

export default Login;
