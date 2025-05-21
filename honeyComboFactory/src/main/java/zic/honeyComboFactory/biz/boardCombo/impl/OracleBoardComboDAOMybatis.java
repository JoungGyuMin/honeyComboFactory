package zic.honeyComboFactory.biz.boardCombo.impl;

import java.util.ArrayList;
import java.util.List;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import zic.honeyComboFactory.biz.boardComboVO.BoardComboVO;

@Repository("oracleBoardComboDAO")
public class OracleBoardComboDAOMybatis { // 꿀조합 게시판 기능 - Oracle DB

	@Autowired
	private SqlSessionTemplate mybatis;

	// getAll → R
	public List<BoardComboVO> getAll(BoardComboVO boardComboVO) {
		// .xml 파일 동적 쿼리문 사용
		if (boardComboVO.getCondition() != null) {
			System.out.println("BoardCombo >> SELECTALLDYNAMIC <<호출됨");
			return mybatis.selectList("BoardComboDAO.SELECTALLDYNAMIC", boardComboVO);
		}
		// 조건에 안맞다면 빈 배열 반환
		else {
			return new ArrayList<>();
		}
	}

	// getOne → R
	public BoardComboVO getOne(BoardComboVO boardComboVO) {
		System.out.println("게시글 상세 조회");
		return mybatis.selectOne("BoardComboDAO.SELECTONECOMBOBOARD", boardComboVO);
	}

	// insert → C
	public boolean insert(BoardComboVO boardComboVO) {
		System.out.println("게시글 등록");
		int result = mybatis.insert("BoardComboDAO.INSERTCOMBOBOARD", boardComboVO);
		if (result <= 0) {
			return false;
		}
		return true;
	}

	// update → U
	public boolean update(BoardComboVO boardComboVO) {
		int result = 0;
		// 게시글 수정
		if (boardComboVO.getCondition().equals("UPDATECOMBOBOARD")) {
			System.out.println("게시글 수정");
			result = mybatis.update("BoardComboDAO.UPDATECOMBOBOARD", boardComboVO);
			if (result <= 0) {
				return false;
			}
		} 
		// 조회수 업데이트
		else if (boardComboVO.getCondition().equals("UPDATEVIEWCOUNT")) {
			System.out.println("조회수 업데이트");
			result = mybatis.update("BoardComboDAO.UPDATEVIEWCOUNT", boardComboVO);
			if(result<=0) {
				return false;
			}
		}
		else {
			System.out.println("잘못된 condition값 입력" +boardComboVO.getCondition()+"]");
			return false;
		}
		return true;
	}

	// delete → D
	public boolean delete(BoardComboVO boardComboVO) {
		System.out.println("게시글 삭제");
		int result = mybatis.delete("BoardComboDAO.DELETECOMBOBOARD", boardComboVO);
		if (result <= 0) {
			return false;
		}
		return true;
	}
}
