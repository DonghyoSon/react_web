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
}
