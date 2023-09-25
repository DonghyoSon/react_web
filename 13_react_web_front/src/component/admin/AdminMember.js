import axios from "axios";
import { useEffect, useState } from "react";
import Pagenation from "../common/Pagination";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Swal from "sweetalert2";

const AdminMember = () => {
  const [memberList, setMemberList] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [reqPage, setReqPage] = useState(1);

  useEffect(() => {
    axios
      .get("/member/list/" + reqPage)
      .then((res) => {
        console.log(res.data);
        setMemberList(res.data.list);
        setPageInfo(res.data.pi);
      })
      .catch((res) => {
        console.log(res);
      });
  }, [reqPage]);
  return (
    <div className="my-content-wrap">
      <div className="my-content-title">회원관리</div>
      <div className="admin-member-tbl-box">
        <table>
          <thead>
            <tr>
              <td width={"15%"}>회원번호</td>
              <td width={"20%"}>아이디</td>
              <td width={"20%"}>이름</td>
              <td width={"25%"}>전화번호</td>
              <td width={"20%"}>회원등급</td>
            </tr>
          </thead>
          <tbody>
            {memberList.map((member, index) => {
              return <MemberItem key={"member" + index} member={member} />;
            })}
          </tbody>
        </table>
      </div>
      <div className="admin-paging-wrap">
        <Pagenation
          reqPage={reqPage}
          setReqPage={setReqPage}
          pageInfo={pageInfo}
        />
      </div>
    </div>
  );
};

const MemberItem = (props) => {
  const member = props.member;

  //외부코드(select)
  const [memberType, setMemberType] = useState(member.memberType);
  const [age, setAge] = useState("");
  const handleChange = (event) => {
    //변경사항 DB반영
    const obj = { memberNo: member.memberNo, memberType: event.target.value };
    const token = window.localStorage.getItem("token");
    axios
      .post("/member/changeType", obj, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        console.log(res.data);
        if (res.data === 1) {
          setMemberType(event.target.value);
        } else {
          Swal.fire("변경 중 문제가 발생했습니다.");
        }
      })
      .catch((res) => {
        console.log(res);
      });
  };

  return (
    <tr>
      <td>{member.memberNo}</td>
      <td>{member.memberId}</td>
      <td>{member.memberName}</td>
      <td>{member.memberPhone}</td>
      <td>
        {/*{memeber.memberType} */}
        {/* {member.memberType === 1 ? "관리자" : "일반 회원"} */}
        {/*외부코드(select) */}
        <FormControl sx={{ m: 1, minWidth: 100 }}>
          <Select value={memberType} onChange={handleChange}>
            <MenuItem value={1}>관리자</MenuItem>
            <MenuItem value={2}>일반회원</MenuItem>
          </Select>
        </FormControl>
      </td>
    </tr>
  );
};
export default AdminMember;
