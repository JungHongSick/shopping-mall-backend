# Shopping Mall Backend

JavaScript(Node.js, Express)와 Oracle Database를 활용한 온라인 쇼핑몰 백엔드 개인 프로젝트입니다.

## 프로젝트 목표

- REST API 기반 쇼핑몰 백엔드 개발
- Oracle Database를 활용한 데이터 모델링
- 회원, 상품, 장바구니, 주문 및 재고 관리 기능 구현
- 대량 데이터 처리와 SQL 성능 최적화
- 매일 개발 과정과 학습 내용을 기록하여 개발 역량 향상

## 기술 스택

- Language: JavaScript
- Runtime: Node.js
- Framework: Express
- Database: Oracle Database (XEPDB1)
- DB Driver: node-oracledb
- Version Control: Git / GitHub

## 개발 기록

### Day 1 — 개발 환경 구축 및 Oracle DB 설정

**완료한 작업**
- Node.js 및 Express 서버 실행 확인
- node-oracledb 26.0.0 로딩 확인
- Oracle CDB / PDB 구조 학습
- XEPDB1에 쇼핑몰 전용 SHOP_USER 계정 생성
- 필요한 데이터베이스 권한 부여
- SQL Developer에서 SHOP_USER 접속 성공

**발생한 오류 및 학습 내용**
- ORA-00942: 시스템 뷰 조회 권한 관련 문제 확인
- ORA-01017: Oracle 계정 인증 오류
- ORA-01045: CREATE SESSION 권한 누락 문제 해결

**다음 과제**
- Node.js와 Oracle Database 연결 테스트
- 상품 테이블 설계 및 생성

## 진행 상태

프로젝트 진행 중 — Day 1 완료 (기초 환경 구축)