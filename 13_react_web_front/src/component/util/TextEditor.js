import axios from "axios";
import { useMemo, useRef } from "react";
import ReactQuill, { Quill } from "react-quill"; //quillEditor 이미지 사이즈 조절 -> {Quill} 추가
import "react-quill/dist/quill.snow.css";
import ImageResize from "quill-image-resize-module-react";
Quill.register("modules/ImageResize", ImageResize); //quillEditor 이미지 사이즈 조절

const TextEditor = (props) => {
  const quillRef = useRef(); //컴포넌트 내부에서 특정 DOM객체를 선택해야할 때 사용
  const data = props.data;
  const setData = props.setData;
  const url = props.url;
  //이미지를 업로드하고 에디터 내부에 추가하는 함수
  const imageHandler = () => {
    //<input>태그 생성
    const input = document.createElement("input");
    input.setAttribute("type", "file"); //type은 file
    input.setAttribute("accept", "image/*"); //accept는 image파일만 올릴 수 있게
    input.click();

    //키워드 async: 비동기 요청을 동기처리하는 키워드
    input.onchange = async () => {
      const file = input.files;
      console.log(file);
      if (file !== null) {
        const form = new FormData();
        form.append("image", file[0]); //image -> key
        const token = window.localStorage.getItem("token");
        axios
          .post(url, form, {
            headers: {
              contentType: "multipart/form-data",
              processData: false,
              Authorization: "Bearer " + token,
            },
          })
          .then((res) => {
            console.log(res.data);
            const editor = quillRef.current.getEditor();
            const range = editor.getSelection();
            editor.insertEmbed(range.index, "image", res.data);
            editor.setSelection(range.index + 1); //내부에서 이미지가 몇 개 추가되었는지 인식
          })
          .catch((res) => {
            console.log(res);
          });
      }
    };
  };

  //quill에디터 형식 옵션을 담는 배열
  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "align",
    "image",
    "color",
  ];

  //useMemo: 동일한 값을 반환하는 경우 함수를 반복적으로 호출하는 것이 나니라,
  //메모리에 저장해두고 바로 가져오는 hooks
  const modules = useMemo(() => {
    return {
      //더 많은 옵션을 원한다면 quill에디터 홈페이지 참조
      toolbar: {
        //툴바에 넣을 기능 순서대로 나열
        container: [
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ size: ["small", false, "large", "huge"] }, { color: [] }],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
            { align: [] },
          ],
          ["image", "video"],
        ],
        handlers: {
          //이미지 업로드 버튼 클릭시 우리가 만든 함수가 동작하도록 설정
          image: imageHandler,
        },
      },
      ImageResize: {
        parchment: Quill.import("parchment"),
        modules: ["Resize", "DisplaySize", "Toolbar"],
      },
    };
  }, []); //옵션란[ ] 필요
  return (
    <ReactQuill
      ref={quillRef}
      theme="snow"
      value={data}
      formats={formats}
      onChange={setData}
      modules={modules}
    />
  );
};

export default TextEditor;
