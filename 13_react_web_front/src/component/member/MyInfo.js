import axios from "axios";
import { Button1, Button2, Button3 } from "../util/Buttons";
import Input from "../util/InputFrm";
import "./myInfo.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const MyInfo = (props) => {
  const navigate = useNavigate();
  const member = props.member;
  const setMember = props.setMember;
  const setIsLogin = props.setIsLogin;

  const setMemberPhone = (data) => {
    member.memberPhone = data;
    setMember({ ...member });
  };

  //나의 답안 - 회원탈퇴
  //   const logout = () => {
  //     window.localStorage.removeItem("token"); //세션을 지우는 것과 비슷
  //     setIsLogin(false);
  //   };

  const updateMemberPhone = () => {
    const token = window.localStorage.getItem("token");
    axios
      .post("/member/changePhone", member, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "전화번호가 수정되었습니다.",
        });
      })
      .catch((res) => {
        if (res.response.status === 403) {
          setIsLogin(false); //로그아웃
          window.localStorage.removeItem("token"); //로그아웃
          //   navigate("/login");
        }
      });
  };

  const deleteMember = () => {
    Swal.fire({
      icon: "warning",
      title: "회원 탈퇴",
      text: "회원을 탈퇴하시겠습니까?",
      showCancelButton: true,
      confirmButtonText: "탈퇴하기",
      cancelButtonText: "취소",
    }).then((res) => {
      if (res.isConfirmed) {
        console.log("'탈퇴하기' 버튼을 누른 경우");
        const token = window.localStorage.getItem("token");
        //로그인이 되어있는지 확인하기 위해(인증확인) axios.post 사용
        axios
          .post("/member/delete", null, {
            //백의 JwtFilter.java 에서 numm값을 받아도 로그인이 정상이면 memberId를 가져올 수 있게 세팅이 되어있다.
            headers: {
              Authorization: "Bearer " + token,
            },
          })
          .then((res) => {
            console.log(res); //백에서 진행된 쿼리의 결과가 'res'로 들어온다.
            Swal.fire({
              icon: "success",
              title: "회원탈퇴가 완료되었습니다.",
            });
            // logout(); //나의 답안
            setIsLogin(false); //선생님 답안
            window.localStorage.removeItem("token"); //토근을 지워야 로그인이 완료됨.
            //navigate("/"); 메인으로 이동하는 기능은 MemberMain.js에서 구현 - 선생님 답안
          })
          .catch((res) => {
            console.log(res);
            if (res.response.status === 403) {
              console.log("로그인이 풀린 상황");
              setIsLogin(false); //로그아웃
              window.localStorage.removeItem("token"); //로그아웃
            }
          });
      } else {
        console.log("'취소' 버튼을 누른 경우");
      }
    });
  };

  return (
    <div className="my-content-wrap">
      <div className="my-content-title">내정보</div>
      <table className="my-info-tbl">
        <tbody>
          <tr>
            <td>회원번호</td>
            <td>{member.memberNo}</td>
          </tr>
          <tr>
            <td>아이디</td>
            <td>{member.memberId}</td>
          </tr>
          <tr>
            <td>이름</td>
            <td>{member.memberName}</td>
          </tr>
          <tr>
            <td>전화번호</td>
            <td id="member-phone">
              <div>
                <Input
                  type="text"
                  data={member.memberPhone}
                  setData={setMemberPhone}
                  content="memberPhone"
                />
                <Button1 text="변경하기" clickEvent={updateMemberPhone} />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="delete-btn-box">
        <Button1 text="회원탈퇴" clickEvent={deleteMember} />
      </div>
    </div>
  );
};

export default MyInfo;
