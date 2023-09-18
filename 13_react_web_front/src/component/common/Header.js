import "./default.css";
import { Link } from "react-router-dom";

const Header = (props) => {
  const isLogin = props.isLogin;
  const setIsLogin = props.setIsLogin;
  return (
    <header>
      <div className="header">
        <div className="main-logo">
          <Link to="/">MAIN</Link>
        </div>
        <Navi />
        <HeaderLink isLogin={isLogin} setIsLogin={setIsLogin} />
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

const HeaderLink = (props) => {
  const isLogin = props.isLogin;
  const setIsLogin = props.setIsLogin;
  const logout = () => {
    window.localStorage.removeItem("token"); //세션을 지우는 것과 비슷
    setIsLogin(false);
  };
  return (
    <div className="header-link">
      {isLogin ? (
        <>
          <Link to="/member/mypage" title="마이페이지">
            {/*title 속성: 마우스를 해당 요소에 올리면 title 속성값이 표시됨 */}
            <span className="material-icons">face</span>
          </Link>
          <Link to="#" title="로그아웃" onClick={logout}>
            <span className="material-icons">logout</span>
          </Link>
        </>
      ) : (
        <>
          <Link to="/login" title="로그인">
            {/*title 속성: 마우스를 해당 요소에 올리면 title 속성값이 표시됨 */}
            <span className="material-icons">login</span>
          </Link>
          <Link to="/join" title="회원가입">
            <span className="material-icons">assignment_ind</span>
          </Link>
        </>
      )}
    </div>
  );
};

export default Header;
