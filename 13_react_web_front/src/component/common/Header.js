import "./default.css";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header>
      <div className="header">
        <div className="main-logo">
          <Link to="/">MAIN</Link>
        </div>
        <Navi />
        <HeaderLink />
      </div>
    </header>
  );
};

const Navi = () => {
  return (
    <div className="nav">
      <ul>
        <li>
          <Link to="#">메뉴1</Link>
        </li>
        <li>
          <Link to="#">메뉴2</Link>
        </li>
        <li>
          <Link to="#">메뉴3</Link>
        </li>
        <li>
          <Link to="#">메뉴4</Link>
        </li>
      </ul>
    </div>
  );
};

const HeaderLink = () => {
  return (
    <div className="header-link">
      <Link to="/login" title="로그인">
        {/*title 속성: 마우스를 해당 요소에 올리면 title 속성값이 표시됨 */}
        <span className="material-icons">login</span>
      </Link>
      <Link to="/join" title="회원가입">
        <span className="material-icons">assignment_ind</span>
      </Link>
    </div>
  );
};

export default Header;
