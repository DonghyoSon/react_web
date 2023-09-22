import { useState } from "react";
import { Button1 } from "../util/Buttons";
import Input from "../util/InputFrm";
import TextEditor from "../util/TextEditor";

const BoardFrm = (props) => {
  const boardTitle = props.boardTitle;
  const setBoardTitle = props.setBoardTitle;
  const boardDetail = props.boardDetail;
  const setBoardDetail = props.setBoardDetail;
  const thumbnail = props.thumbnail;
  const setThumbnail = props.setThumbnail;
  const boardFile = props.boardFile;
  const setBoardFile = props.setBoardFile;
  const boardImg = props.boardImg;
  const setBoardImg = props.setBoardImg;
  const fileList = props.fileList;
  const setFileList = props.setFileList;
  const buttonEvent = props.buttonEvent;
  const type = props.type;
  const delFileNo = props.delFileNo;
  const setDelFileNo = props.setDelFileNo;
  const [newFileList, setNewFileList] = useState([]); //새 첨부파일 출력용 state

  const thumbnailChange = (e) => {
    const files = e.currentTarget.files; //files -> 배열의 형태를 하고 있지만 일반 객체
    if (files.length !== 0 && files[0] !== 0) {
      setThumbnail(files[0]); //썸네일 파일 전송을 위한 state에 값 파일 객체 저장
      //화면의 썸네일 미리보기
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onloadend = () => {
        setBoardImg(reader.result);
      };
    } else {
      setThumbnail({}); //빈 객체
      setBoardImg(null); //빈 문자열 "" -> null로 수정됨
    }
  };

  const changeFile = (e) => {
    const files = e.currentTarget.files;
    setBoardFile(files);

    //파일명 추출
    const arr = new Array();
    for (let i = 0; i < files.length; i++) {
      arr.push(files[i].name);
    }
    setNewFileList(arr);
  };

  return (
    <div className="board-frm-wrap">
      <div className="board-frm-top">
        <div className="board-thumbnail">
          {boardImg === null ? (
            <img src="/image/default.png" />
          ) : (
            <img src={boardImg} />
          )}
        </div>
        <div className="board-info">
          <table className="board-info-tbl">
            <tbody>
              <tr>
                <td>
                  <label htmlFor="boardTitle">제목</label>
                </td>
                <td>
                  <Input
                    type="text"
                    data={boardTitle}
                    setData={setBoardTitle}
                    content="boardTitle"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="thumbnail">대표이미지</label>
                </td>
                <td>
                  {/*Input 컴포넌트는 키보드 값을 입력 받으므로, 첨부파일을 다뤄야하는 상황에서는 사용하지 않음 */}
                  <input
                    type="file"
                    id="thumbnail"
                    accept="image/*"
                    onChange={thumbnailChange}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="boardfile">첨부파일</label>
                </td>
                <td>
                  <input type="file" onChange={changeFile} multiple />
                </td>
              </tr>
              <tr className="file-list">
                <td>첨부파일 목록</td>
                <td>
                  {/*첨부된 파일명을 map()함수로 반복하여 출력 */}
                  <div className="file-zone">
                    {type === "modify"
                      ? fileList.map((item, index) => {
                          return (
                            <FileItem
                              key={"f" + index}
                              item={item}
                              delFileNo={delFileNo}
                              setDelFileNo={setDelFileNo}
                              fileList={fileList}
                              setFileList={setFileList}
                            />
                          );
                        })
                      : ""}
                    {newFileList.map((item, index) => {
                      return (
                        <p key={"newFile" + index}>
                          <span className="filename">{item}</span>
                        </p>
                      );
                    })}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="board-content-box">
        {/* <textarea
          onChange={(e) => {
            const changeValue = e.currentTarget.value;
            setBoardDetail(changeValue);
          }}
        >
          {boardDetail}
        </textarea> */}
        <TextEditor
          data={boardDetail}
          setData={setBoardDetail}
          url="/board/contentImg"
        />
      </div>
      <div className="board-btn-box">
        {type === "modify" ? (
          <Button1 text="작성하기" clickEvent={buttonEvent} />
        ) : (
          <Button1 text="수정하기" clickEvent={buttonEvent} />
        )}
      </div>
    </div>
  );
};

const FileItem = (props) => {
  const item = props.item;
  const delFileNo = props.delFileNo;
  const setDelFileNo = props.setDelFileNo;
  const fileList = props.fileList;
  const setFileList = props.setFileList;
  const deleteFile = () => {
    console.log("파일 삭제");
    delFileNo.push(item.boardFileNo);
    setDelFileNo([...delFileNo]); //추가된 것을 깊은 복사하여 넣음
    const newArr = fileList.filter((file) => {
      //filter: 배열 중 조건식에 맞는 요소만 추출하여 새로운 배열을 생성
      return item.boardFileNo !== file.boardFileNo;
    });
    setFileList(newArr);
  };
  return (
    <p>
      <span className="filename">{item.filename}</span>
      <span className="material-icons del-file-icon" onClick={deleteFile}>
        delete
      </span>
    </p>
  );
};

export default BoardFrm;
