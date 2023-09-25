import { useState } from "react";
import "./admin.css";
import { MySideMenu } from "../member/MemberMain";
import { Route, Routes } from "react-router-dom";
import AdminMember from "./AdminMember";
import AdminBoard from "./AdminBoard";

const AdminMain = () => {
  const [menus, setMenus] = useState([
    { url: "member", text: "회원 관리", active: false },
    { url: "board", text: "게시글 관리", active: false },
  ]);
  return (
    <div className="mypage-wrap">
      <div className="my-title">관리자 페이지</div>
      <div className="my-content">
        <MySideMenu menus={menus} setMenus={setMenus} />
        <div className="current-content">
          <Routes>
            <Route path="member" element={<AdminMember />} />
            <Route path="board" element={<AdminBoard />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminMain;
