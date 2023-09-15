import { Route, Routes } from "react-router-dom";
import Footer from "./component/common/Footer";
import Header from "./component/common/Header";
import Join from "./component/common/member/Join";

function App() {
  return (
    <div className="wrap">
      <Header />
      <div className="content">
        <Routes>
          <Route path="/join" element={<Join />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
