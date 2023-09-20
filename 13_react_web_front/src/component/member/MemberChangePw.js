import axios from "axios";
import { Button1 } from "../util/Buttons";
import Input from "../util/InputFrm";
import "./memberChangePw.css";
import { useState } from "react";
import Swal from "sweetalert2";

/*
1. 현재 비밀번호 입력 -> 확인
2. 현재 비밀번호가 맞는지 확인
-> 맞지 않으면 비밀번호를 확인하세요
-> 맞으면 새 비밀번호 입력양식
-> 새 비밀번호 입력시 변경(암호화 필요)
*/
const MemberChangePw = (props) => {
  /*
    실패
  const [memberPw, setMemberPw] = useState("");

  const matchPw = () => {
    console.log({ memberPw });
    axios
      .post("/member/matchPw", { memberPw })
      .then((res) => {})
      .catch((res) => {});
    return null;
  };

  return (
    <div className="my-content-wrap">
      <div className="my-content-title">비밀번호 변경</div>
      <div>현재 비밀번호 입력</div>
      <div className="current-pw">
        <Input
          type="password"
          data={memberPw}
          setData={setMemberPw}
          content="memberPw"
        />
      </div>
      <div className="current-pw-btn">
        <Button1 text="확인" clickEvent={matchPw} />
      </div>
    </div>
  );
};
*/

  //선생님 답안
  //비밀번호 인증 - BCryt 사용
  //로그인과 유사
  const [isPwauth, setIsPwauth] = useState(false);
  const [currPw, setCurrPw] = useState("");
  const [memberPw, setMemberPw] = useState("");
  const [memberPwRe, setMemberPwRe] = useState("");
  const token = window.localStorage.getItem("token");

  //현재 비밀번호 확인
  const pwCheck = (props) => {
    axios
      .post(
        "/member/pwCheck",
        { memberPw: currPw },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        if (res.data === 1) {
          setIsPwauth(true);
        } else {
          Swal.fire({
            title: "비밀번호가 일치하지 않습니다.",
          });
        }
      });
  };

  /*
  //실패
  const changePw = (props) => {
    if (memberPw != memberPwRe) {
      Swal.fire({
        title: "비밀번호가 일치하지 않습니다.",
      });
    } else {
      axios
        .post(
          "/member/changePwMember",
          { memberPw: memberPw },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        )
        .then((res) => {
          console.log(res.data);
        });
    }
  };
  */
  //비밀번호 변경 - 선생님 답안
  const changePw = () => {
    if (memberPw !== "" && memberPw === memberPwRe) {
      axios
        .post(
          "/member/changePw",
          { memberPw: memberPw }, //key와 value가 같을 때는 key만 작성하여도 무방({memberPw})
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        )
        .then((res) => {
          if (res.data === 1) {
            //비밀번호 변경 성공시, 비밀번호 변경 페이지 처음으로 이동
            setIsPwauth(false);
            setCurrPw(""); //현재 비밀번호 초기화
            setMemberPw("");
            setMemberPwRe("");
          } else {
            Swal.fire("비밀번호 변경 중 문제가 발생했습니다.");
          }
        });
    } else {
      Swal.fire("입력한 새 비밀번호가 일치하지 않습니다.");
    }
  };

  return (
    <div className="my-content-wrap">
      <div className="my-content-title">비밀번호 변경</div>
      <div className="pw-auth">
        {isPwauth ? (
          <>
            <div className="new-pw-input-wrap">
              <div className="pw-input-wrap">
                <div>
                  <label htmlFor="memberPw">새 비밀번호</label>
                  <Input
                    type="password"
                    data={memberPw}
                    setData={setMemberPw}
                    content="memberPw"
                  />
                </div>
                <div>
                  <label htmlFor="memberPwRe">새 비밀번호 확인</label>
                  <Input
                    type="password"
                    data={memberPwRe}
                    setData={setMemberPwRe}
                    content="memberPwRe"
                  />
                </div>
              </div>
            </div>
            <div className="change-btn-box">
              <Button1 text="변경하기" clickEvent={changePw} />
            </div>
          </>
        ) : (
          //비밀번호 인증 전
          <div className="pw-input-wrap">
            <div>
              <label htmlFor="currPw">현재 비밀번호</label>
              <Input
                data={currPw}
                setData={setCurrPw}
                type="password"
                content="currPw"
              />
              <Button1 text="입력" clickEvent={pwCheck} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default MemberChangePw;
