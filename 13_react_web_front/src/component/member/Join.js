import { useState } from "react";
import "./join.css";
import Input from "../util/InputFrm";
import axios from "axios";
import { Button1, Button2, Button3 } from "../util/Buttons"; //export한 형태 그대로 import된다.
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Join = () => {
  const [memberId, setMemberId] = useState("");
  const [memberPw, setMemberPw] = useState("");
  const [memberPwRe, setMemberPwRe] = useState("");
  const [memberName, setMemberName] = useState("");
  const [memberPhone, setMemberPhone] = useState("");
  const [checkIdMsg, setCheckIdMsg] = useState("");
  const [checkPwMsg, setCheckPwMsg] = useState("");
  const navigate = useNavigate();
  const idCheck = () => {
    const idReg = /^[a-zA-Z0-9]{4,8}$/;
    if (!idReg.test(memberId)) {
      //정규표현식을 만족하지 못했을 때
      setCheckIdMsg("아이디는 영문 대/소문자/숫자로 4~8글자 입니다.");
    } else {
      //정규표현식을 만족하였을 떼 -> DB에 중복체크(backend에 비동기요청 - axios)
      axios
        //방법1.
        //.get("/member/checkId", { params: { memberId: memberId } }) //get메서드 /{params:{key:value}} 형태로 서버에 전달
        //방법2.
        .get("/member/checkId/" + memberId) //경로에 변수를 전달
        .then((res) => {
          //res 또는 response를 많이 사용 - 사용자가 짓기 나름
          console.log(res); //서버로부터 전달되는 값을 콘솔로 확인하면 'data'속성에 들어있다.
          //응답 객체 data속성이 Controller에서 반환된 데이터
          if (res.data == 0) {
            setCheckIdMsg("");
          } else {
            setCheckIdMsg("이미 사용중인 아이디입니다.");
          }
        })
        .catch((res) => {
          console.log(res);
        });
      //setCheckIdMsg("정규표현식 만족");
    }
  };
  const pwCheck = () => {
    if (memberPw != memberPwRe) {
      setCheckPwMsg("비밀번호가 일치하지 않습니다.");
    } else {
      setCheckPwMsg("");
    }
  };
  const join = () => {
    if (checkIdMsg === "" && checkPwMsg === "") {
      /*
      const member = {
        memberId: memberId,
        memberPw: memberPw,
        memberName: memberName,
        memberPhone: memberPhone,
      };*/
      const member = { memberId, memberPw, memberName, memberPhone }; //key, value가 같다는 전제하에 key값는 작성
      axios
        //.post("/member/join", null, { params: member }) //post메서드 /매개변수가 3개 /2번째 매개변수는 null
        .post("/member/join", member) //back에서 선언되는 @RequestBoy로 보내진다.
        .then((res) => {
          console.log(res.data);
          if (res.data === 1) {
            navigate("/login");
          } else {
            Swal.fire("에러가 발생했습니다. 잠시 후 다시 시도해주세요.");
          }
        })
        .catch((res) => {
          console.log(res.data);
        });
    } else {
      Swal.fire("입력값을 확인하세요.");
    }
  };
  return (
    <div className="join-wrap">
      <div className="join-title">회원가입</div>
      <JoinInputWrap
        data={memberId}
        setData={setMemberId}
        type="type"
        content="memberId"
        label="아이디"
        checkMsg={checkIdMsg}
        blurEvent={idCheck}
      />
      <JoinInputWrap
        data={memberPw}
        setData={setMemberPw}
        type="password"
        content="memberPw"
        label="비밀번호"
      />
      <JoinInputWrap
        data={memberPwRe}
        setData={setMemberPwRe}
        type="password"
        content="memberPwRe"
        label="비밀번호 확인"
        checkMsg={checkPwMsg}
        blurEvent={pwCheck}
      />
      <JoinInputWrap
        data={memberName}
        setData={setMemberName}
        type="type"
        content="memberName"
        label="이름"
      />
      <JoinInputWrap
        data={memberPhone}
        setData={setMemberPhone}
        type="type"
        content="memberPhone"
        label="전화번호"
      />
      <div className="join-btn-box">
        <Button1 text="회원가입" clickEvent={join} />
      </div>
    </div>
  );
};

const JoinInputWrap = (props) => {
  const data = props.data;
  const setData = props.setData;
  const type = props.type;
  const content = props.content;
  const label = props.label;
  const blurEvent = props.blurEvent;
  const checkMsg = props.checkMsg;
  return (
    <div className="join-input-wrap">
      <div>
        <div className="label">
          <label htmlFor={content}>{label}</label>
        </div>
        <div className="input">
          <Input
            type={type}
            data={data}
            setData={setData}
            content={content}
            blurEvent={blurEvent}
          />
        </div>
      </div>
      <div className="check-msg">{checkMsg}</div>
    </div>
  );
};
export default Join;
