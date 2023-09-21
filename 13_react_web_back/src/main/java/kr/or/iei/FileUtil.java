package kr.or.iei;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class FileUtil {
	public String getFilepath(String savepath, String filename, MultipartFile uploadFile) {
		//중복 파일 처리
		//filename => 파일명 test.txt를 '.'기준으로 구분 
		// text			.txt
		
		//파일명
		String onlyFilename = filename.substring(0, filename.lastIndexOf(".")); //test /파일명 인덱스 0부터 "."직전까지 /lastIndexOf("."): 뒤에서부터 "."의 인덱스 위치를 찾아서 반환
		//확장자
		String extention = filename.substring(filename.lastIndexOf(".")); //.txt /"."부터 끝까지
		//실제 업로드할 파일명을 저장할 변수
		String filepath = null;
		//파일명이 중복되면 뒤에 붙일 숫자
		int count = 0;
		while(true) //중복되는 파일이 없을 때까지 검사
		{
			if(count == 0) {
				filepath = onlyFilename + extention; //filename
			}else {
				filepath = onlyFilename + "_" + count + extention; //중복 파일명에 '_count(숫자)'추가
			}
			//C:/Temp/upload/notice/+filepath
			File checkFile = new File(savepath + filepath); //File 클래스(java.io)
			if(!checkFile.exists()) //exist(): 파일이 있으면 True반환 /!exist(): 파일이 없으면 True반환
			{
				try {
					uploadFile.transferTo(checkFile);
				} catch (IllegalStateException | IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				break; //while반복 중단
			}
			count++;
		}
		return filepath;
	}

}