package kr.or.iei.board.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import kr.or.iei.FileUtil;
import kr.or.iei.board.model.service.BoardService;
import kr.or.iei.board.model.vo.Board;
import kr.or.iei.board.model.vo.BoardFile;

@RestController //모든 메서드가 비동기 요청
@RequestMapping(value="/board")
public class BoardController {
	@Autowired
	private BoardService boardService;
	@Autowired
	private FileUtil fileUtil;
	@Value("${file.root}")
	private String root;
	
	//게시물 조회
	@GetMapping(value="/list/{reqPage}")
	public Map list(@PathVariable int reqPage) {
		Map map = boardService.boardList(reqPage);
		return map;
	}
	
	//게시글 작성
	//Board b: boardTitle, boardDetail
	//MultipartFile thumbnail: thumbnail
	//MultipartFile[] boardFile: 첨부파일
	@PostMapping(value="/insert")
	public int insertBoard(@ModelAttribute Board b, @ModelAttribute MultipartFile thumbnail, @ModelAttribute MultipartFile[] boardFile, @RequestAttribute String memberId) {
		System.out.println(b);
		System.out.println(memberId);
		
		b.setMemberId(memberId);
		String savepath = root+"board/"; //root: C/Temp/react_web
		if(thumbnail != null) {		
			System.out.println(thumbnail.getOriginalFilename());
			String filename = thumbnail.getOriginalFilename();
			String filepath = fileUtil.getFilepath(savepath, filename, thumbnail);
			b.setBoardImg(filepath);
		}
		ArrayList<BoardFile> fileList = new ArrayList<BoardFile>();
		if(boardFile != null) {
			/*
			for(int i=0;i<boardFile.length;i++) {
				System.out.println(boardFile[i].getOriginalFilename());
			}
			*/
			for(MultipartFile file : boardFile) {
				String filename = file.getOriginalFilename();
				String filepath = fileUtil.getFilepath(savepath, filename, file);
				BoardFile bf = new BoardFile();
				bf.setFilename(filename);
				bf.setFilepath(filepath);
				fileList.add(bf);
			}
		}
		int result = boardService.insertBoard(b, fileList);
		return result;
	}
	
	@GetMapping(value="/view/{boardNo}")
	public Board view(@PathVariable int boardNo) {
		return boardService.selectOneBoard(boardNo);
	}
	
	//게시글 파일 다운로드
	//ResponseEntity<Resource>: 파일 다운로드용 반환타입
	@GetMapping(value="/filedown/{boardFileNo}")
	public ResponseEntity<Resource> filedown(@PathVariable int boardFileNo) throws FileNotFoundException, UnsupportedEncodingException{
		BoardFile boardFile = boardService.getBoardFile(boardFileNo);
		System.out.println(boardFile);
		String  savepath = root+"board/";
		File file = new File(savepath + boardFile.getFilepath());
		Resource resource = new InputStreamResource(new FileInputStream(file));
		String encodeFile = URLEncoder.encode(boardFile.getFilename(), "UTF-8");
		
		HttpHeaders header = new HttpHeaders();
		header.add("Content-Disposition", "attachment; filename=\""+encodeFile+"\"");
		header.add("Cache-Control", "no-cache, no-store, must-revalidate");
		header.add("Pragma", "no-cache");
		header.add("Expires", "0");
		
		return ResponseEntity.status(HttpStatus.OK).headers(header).contentLength(file.length()).contentType(MediaType.APPLICATION_OCTET_STREAM).body(resource);
	}
	
	//텍스트 에디터 파일 업로드
	@PostMapping(value="/contentImg")
	public String contentImg(@ModelAttribute MultipartFile image) {
		String savepath = root+"board/editor/";
		String filename = image.getOriginalFilename();
		String filepath = fileUtil.getFilepath(savepath, filename, image);
		return "/board/editor/"+filepath; //실제 파일이 해당경로에 업로드 됨	
	}
	
	//게시글 삭제
	@GetMapping(value="/delete/{boardNo}")
	public int deleteBoard(@PathVariable int boardNo) {
		//해당 게시글의 첨부파일 삭제를 위해 파일 목록 결과물을 받음
		List<BoardFile> fileList = boardService.delete(boardNo);//첨부파일을 지우기 위해 List<BoardFile>로 받음
		if(fileList != null) {
			String savepath = root+"board/";
			for(BoardFile boardFile : fileList) {
				File file = new File(savepath + boardFile.getFilepath());
				file.delete();
			}
			return 1;
		}else {
			return 0;
		}
	}
	
	//게시글 수정
	@PostMapping(value="/modify")
	public int modify(@ModelAttribute Board b, @ModelAttribute MultipartFile thumbnail, @ModelAttribute MultipartFile[] boardFile) {
		System.out.println(b.getBoardTitle());
		System.out.println(b.getBoardDetail());
		System.out.println(b.getBoardImg());
		System.out.println(b.getDelFileNo());
		System.out.println(thumbnail);
		
		//Board table 업데이트
		//썸네일이 들어오면 -> 썸네일 교체, 섬네일이 없으면 기존 썸네일로 덮어쓰기
		//Board_file 테이블 업데이트 -> 삭제한 것이 있으면 삭제, 추가한 것이 있으면 insert
		//삭제한 파일 있으며 파일 물리적 삭제
		if(b.getBoardImg().equals("null")) {
			b.setBoardImg(null);
		}
		String savepath = root + "board/"; //새로운 썸네일 저장 경로
		if(thumbnail != null) {
			System.out.println(thumbnail.getOriginalFilename());
			
			String filepath = fileUtil.getFilepath(savepath, thumbnail.getOriginalFilename(), thumbnail);
			b.setBoardImg(filepath);
		}
		System.out.println(boardFile);
		ArrayList<BoardFile> fileList = new ArrayList<BoardFile>();
		if(boardFile != null) {
			for(MultipartFile file : boardFile) {
				System.out.println(file.getOriginalFilename());
				
				String filename = file.getOriginalFilename();
				String filepath = fileUtil.getFilepath(savepath, filename, file);
				BoardFile bf = new BoardFile();
				bf.setBoardNo(b.getBoardNo());
				bf.setFilename(filename);
				bf.setFilepath(filepath);
				fileList.add(bf);
			}
		}
		//DB에서 삭제한 파일이 있으면, 실재 파일도 삭제하기 위해서 
		List<BoardFile> delFileList = boardService.modify(b, fileList);
		if(delFileList != null) {
			for(BoardFile bf : delFileList) {
				File delFile = new File(savepath+bf.getFilepath());
				delFile.delete();
			}
			return 1;
		}else {
			return 0;
		}
	}
	
	//관리자 페이지 - 게시글 관리
	@GetMapping(value="/adminList/{reqPage}")
	public Map adminList(@PathVariable int reqPage) {
		return boardService.adminList(reqPage);
	}
	
	//관리자 페이지 - 게시글 관리(공개여부)
	@PostMapping(value="/changeStatus")
	public int changeStatus(@RequestBody Board b) {
		return boardService.changeStatus(b);
	}
}
