import { Link } from "react-router-dom";
import "./default.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <ul>
          <li>
            <Link to="#">이용약관</Link>
          </li>
          <li>
            <Link to="#">개인정보취급</Link>
          </li>
          <li>
            <Link to="#">인재채용</Link>
          </li>
          <li>
            <Link to="#">제휴문의</Link>
          </li>
          <p>무단복제 및 사용을 금지합니다.</p>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
