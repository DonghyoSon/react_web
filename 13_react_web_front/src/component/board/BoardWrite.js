import { useState } from "react";
import BoardFrm from "./BoardFrm";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BoardWrite = () => {
  //제목, 썸네일 , 내용, 첨부파일 작성하여 삽입 -> 전송용 데이터를 담음 state
  //변수명과 맞춘 것 - 문자열
  //변수명과 안 맞춘 것 - 첨부파일(배열, 객체로 받음)
  const [boardTitle, setBoardTitle] = useState("");
  const [thumbnail, setThumbnail] = useState({});
  const [boardDetail, setBoardDetail] = useState("");
  const [boardFile, setBoardFile] = useState([]);

  //화면용(화면에 데이터를 띄움)
  //boardImg -> 썸네일 미리보기용 /fileList -> 첨부파일 목록 출력용
  const [boardImg, setBoardImg] = useState(null);
  const [fileList, setFileList] = useState([]);
  const navigate = useNavigate();

  //글쓰기 버튼 클릭 시 동작할 함수(서버에 insert요청 함수)
  const write = () => {
    console.log(boardTitle);
    console.log(thumbnail);
    console.log(boardDetail);
    console.log(boardFile);
    if (boardTitle !== "" && boardDetail !== "") {
      //기본적인 문자열 또는 숫자데이터를 전송하는 경우, JSON을 전송
      //파일이 포함되어 있는 경우 -> FormData
      const form = new FormData();
      form.append("boardTitle", boardTitle);
      form.append("boardDetail", boardDetail);
      form.append("thumbnail", thumbnail); //첨부파일을 전송하는 경우, File객체를 전송
      //첨부파일이 여러개인 경우(multiple인 경우 -> 같은 이름으로 첨부파일이 여려개인 경우) - 객체 배열
      for (let i = 0; i < boardFile.length; i++) {
        console.log(111);
        form.append("boardFile", boardFile[i]);
      }

      const token = window.localStorage.getItem("token");
      axios
        .post("/board/insert", form, {
          headers: {
            //processData, contentType: 문자열만 전송하는 것이 아닌, 파일 타입도 있다는 것을 인지시킴
            processData: false,
            contentType: "multipart/form-data",
            Authorization: "Bearer " + token,
          },
        })
        .then((res) => {
          console.log(res.data);
          navigate("/board");
        })
        .catch((res) => {
          console.log(res.response.status);
        });
    } else {
      Swal.fire("입력값을 확인하세요.");
    }
  };

  return (
    <div>
      <div className="board-frm-title">게시글 작성</div>
      <BoardFrm
        boardTitle={boardTitle}
        setBoardTitle={setBoardTitle}
        boardDetail={boardDetail}
        setBoardDetail={setBoardDetail}
        thumbnail={thumbnail}
        setThumbnail={setThumbnail}
        boardFile={boardFile}
        setBoardFile={setBoardFile}
        boardImg={boardImg}
        setBoardImg={setBoardImg}
        fileList={fileList}
        setFileList={setFileList}
        buttonEvent={write}
        type="write"
      />
    </div>
  );
};

export default BoardWrite;
