<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/82ea8634-17da-451b-96ff-d7323d6c5977

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


# <SK하이닉스 취업 준비 플래너 Agent>

> 이 README는 채점자가 가장 먼저 읽는 표지입니다. 각 섹션을 빠짐없이 채워 주세요. 이 안에 적은 내용은 `requirements.md`, `steering.md` 등 자산과 일관되어야 합니다.

---

## 1. 어떤 병목을 다루는가

- **병목 Task**: 대학 성적 기반 개인 역량과 채용 조건을 비교 분석하여, 맞춤형 취업 준비 플래너 제시함.
- **빈도**: 대학 입학부터 취업 전까지 주기적
- **왜 병목인가**: 채용 공고별 요구 조건이 분산되어 있어 일일이 비교, 정리하는 데 시간이 많이 소요됨.
                개인 성적 및 스펙과 직무 요구 역량을 연결해 분석하는 과정이 반복적이고 비효율적임.
                잘못된 반향으로 준비할 경우 시간, 비용 손실이 크게 발생함.

## 2. 왜 AI Agent로 만들었는가

- **룰베이스/매크로/기존 도구로 안 되는 이유**: 기업의 취업 공고의 기준이 바뀌고 대학 입학부터 취업전까지의 입학 빈도에 의해 데이터가 유지 됨에 있어 기존 도구로는 불가능 하다.
- **AI 판단이 필요한 지점**: 입사 정보에 기반한 플래너, todo-list 달성하기 위한 전체 계획, 자기소개서, 프트폴리어, 모의면접, 코딩테스트

## 3. Agent 구조

- **입력 → 처리 → 출력** (3줄 이내 다이어그램 또는 설명)
  - 성정증명서 업로드/분석 시작 및 플랜 생성 → AI 분석 리포트 + 취업 로드맨 + 학습 센터
- **사용 도구**: ai studio, kiro
- **핵심 제약 (Steering 요약)**: 정확한 갭 분석과 SK하이닉스 기준을 기반으로 위험을 우선 식별하고, 반드시 JSON 형식으로 현실적인 실행 계획만 출력해야 한다.
  - 비용 상한: 최소 비용 원칙에 따라 Gemini 2.0 Flash만 사용하고, 최대 3회 재시도 후 실패 시 목 데이터로 폴백한다.
  - 도구 화이트리스트: 허용된 도구는 **Gemini 2.0 Flash, Firebase, Cloud Functions만 사용하며, 그 외 도구는 모두 금지한다.
  - 사람 개입이 필요한 조건: 입력 정보가 부족하거나 모호하여 갭 분석이 불가능한 경우, 또는 성적·직무 정보 해석 신뢰도가 낮을 때 반드시 사람의 재입력/검증을 요청한다.

## 4. 실행 방법

```bash
# 1줄 재현 명령
```

- **필요한 환경변수**: `.env.example` 참조
- **선행 조건**: (있으면 명시)

## 5. 테스트 입력 형식

- **위치**: /home/ec2-user/environment/AI_Agent_Edu_Team11/.kiro/specs/university-to-career-planner/tasks.md
- **형식**: (예: `.txt`, `.json`, `.md`)
- **구조**: (JSON이면 키 목록 / 텍스트면 작성 규칙)

## 6. 실행 결과 (5회)

본인 환경에서 `test-input/` 입력으로 5회 실행한 결과를 자유 형식으로 첨부.
핵심 출력 필드가 무엇인지만 명시할 것 (표·JSON·로그 어느 형태든 가능).

---

## 자산 위치 안내 (채점자용)

| 항목 | 위치 |
|---|---|
| 사용자 시나리오·수용 기준 | `.kiro/specs/university-to-career-planner/requirements.md` |
| 구현 설계 | `.kiro/specs/university-to-career-planner/design.md` |
| 실행 단계 분해 | `.kiro/specs/university-to-career-planner/tasks.md` |
| 전역 규칙·도메인 컨텍스트 | `.kiro/specs/university-to-career-planner/steering.md` |
| 자가 검증 항목 | `CHECKLIST.md` |
| 테스트 입력 | `test-input/*.json` |

Design.md 정리

1. 시스템 개요 및 핵심 가치

목적: 대학 1~4학년을 대상으로 한 AI 기반 개인 맞춤형 취업 플래너.
주요 기능: 성적증명서 분석, 목표 기업(잡코리아 등) 요구사항 매핑, 역량 갭(Gap) 분석, ToDo 및 로드맵 자동 생성.
기술 스택: React + TypeScript (Vite) + Gemini 2.0 Flash + Tailwind CSS.
AI 필요성: 비정형 데이터(대학별 다른 성적표 형식) 파싱, 맥락적 역량 분류, 학년/상황별 개인화된 행동 추천.


2. 시스템 아키텍처 및 에이전트 설계
AI 에이전트 레이어

DataCollectionAgent: 잡코리아 등에서 기업/직무 정보 수집 및 요구 역량 추출.
GapAnalysisAgent: 사용자 성적/경험과 직무 요구사항 비교 (Red/Yellow/None 인디케이터 산출).
RiskDetectionAgent: 취업 준비 시 취약점 및 우선순위 위험 감지.
PlannerAgent: 연도별 로드맵, 실천 ToDo, 달성 리스트(Achievement) 생성.
MockInterviewAgent: 대화 맥락 기반 심화 질문 및 피드백 제공.
데이터 흐름

Input: 성적증명서(PDF/이미지/JSON) → Parser → TranscriptJSON 생성.
Process: AI 에이전트 체이닝 (수집 → 분석 → 위험 감지 → 플랜 생성).
Output: 사용자 UI에 로드맵, 체크리스트, 리소스 제공 및 JSON Store 저장.


3. 데이터 모델 주요 구조
모델명주요 필드비고TranscriptJSON성적, 평점(GPA), 이수 과목, 학번/성명OCR 및 의미 기반 매핑 필요JobInfoJSON기업/직무 정보, 요구 수준(1-5), 채용 주기다중 소스(잡코리아, SKCareers 등) 수집GapAnalysisItem역량 카테고리, 요구 vs 현재 수준, 갭 수치gap <= -2 일 때 Red 경고AchievementItem목표 제목, 카테고리, 목표 학년, 연관 ToDo플래너의 핵심 이정표
4. 핵심 알고리즘 예시: generatePlan
AI가 플랜을 생성하는 논리적 단계는 다음과 같습니다.

추출: 갭 분석 결과에서 위험군(Red, Yellow) 항목 필터링.
ToDo 생성: Gemini API를 사용하여 갭을 메우기 위한 구체적 과업 생성.
마일스톤 배치: 학년 및 휴학 설정에 따라 시간순으로 마일스톤 정렬.
우선순위 결정: 갭이 클수록(Red) 높은 우선순위 부여.


5. 시스템 정체성 및 안정성 (Correctness)
시스템이 항상 올바르게 동작함을 보장하기 위한 주요 속성입니다.

GPA 검증: 모든 평점 계산은 0에서 maxGpa 사이에서 이루어져야 함.
로드맵 길이: 전체 로드맵 배열의 길이는 항상 학년 수 + 휴학 연수와 일치해야 함.
데이터 보존: 모든 데이터는 JSON 직렬화를 통해 원본 손실 없이 저장/복구 가능해야 함 (Round-trip).
보안: 민감한 성적 데이터는 서버에 전송하지 않고 브라우저 localStorage에서만 처리.


6. 오류 및 예외 처리

파싱 오류: OCR 실패 시 사용자가 직접 입력할 수 있는 수동 폼(Fallback) 제공.
API 오류: Gemini 호출 실패 시 최대 3회 지수 백오프(Exponential Backoff) 재시도.
형식 오류: AI의 응답이 잘못된 JSON일 경우 텍스트에서 JSON 블록을 재추출하는 정제 로직 포함.


Requirements.md

1. 문제 정의 및 도입 효과
취업 준비 과정에서 발생하는 정보의 비정형성과 개인화된 계획 수립의 어려움을 해결하는 것이 핵심입니다.

기존 방식의 병목: 수동 정보 수집, 주관적인 역량 진단, 파편화된 로드맵 작성 등으로 인해 연간 약 102시간의 시간 비용 발생.
AI 도입 효과: 직무 분석 및 플랜 생성을 자동화하여 준비 시간을 약 73%(연간 75시간) 절감하는 것을 목표로 함.


2. 주요 에이전트 및 역할 (Glossary 기반)
에이전트명주요 역할TranscriptParser성적표(PDF/이미지/JSON)에서 학번, GPA, 주요 과목 추출DataCollectionAgentSK하이닉스 등 목표 기업의 다중 소스(채용공고, 연봉, 자소서 패턴 등) 분석GapAnalysisAgent요구 역량 수준과 현재 역량 수준을 비교하여 갭(Gap) 산출RiskDetectionAgent갭 분석 결과를 바탕으로 심각도(Red/Yellow) 및 우선순위 도출PlannerAgent1~4학년 전 기간의 로드맵, ToDo, 학기별 달성 목표 생성MockInterviewAgent실시간 모의면접 진행 및 1~10점 척도의 피드백 제공
3. 핵심 요구사항 (Requirements)
R1. 성적 데이터 처리

GPA 유효 범위 검증 및 성적 등급(A+~F) 유효성 체크.
평점 3.0 이상 과목 중 상위 5개를 핵심 과목(coreSubjects)으로 자동 선정.
파일 크기 10MB 이하, 지정된 MIME 타입(JSON, PDF, Image)만 허용.
R2. 다중 소스 기반 직무 분석

SK하이닉스 기준: 공식 채용 사이트, 잡코리아(기업분석, 연봉, 합격자소서), SK Careers Journal 등 13개 이상의 소스를 교차 분석.
요구 수준에 따라 관련성을 'High', 'Medium', 'Low'로 자동 분류.
R3~R4. 갭 분석 및 플래너 생성

지표(Indicator): 갭 -2 이하(Red), -1(Yellow), 0 이상(None)으로 시각화.
로드맵 구성: 학년 수 + 휴학 연수에 맞춰 유연하게 생성 (휴학은 보통 2학년 이후 배치).
우선순위: Red 지표를 가진 역량을 최우선 순위 마일스톤으로 설정.
R9~R10. 안정성 및 보안

AI 복구: API 호출 실패 시 최대 3회 지수 백오프 재시도 및 실패 시 템플릿 데이터(Mock)로 폴백.
데이터 보호: 성적표 등 민감 데이터는 서버로 전송하지 않고 브라우저 로컬 저장소(localStorage)에만 유지.
키 관리: API Key는 환경 변수(.env.local)를 통해 관리하며 클라이언트 코드 노출 방지.


4. 시스템 무결성 속성 (Correctness Properties)
시스템이 수학적으로 혹은 논리적으로 항상 준수해야 하는 규칙입니다.

라운드트립 보장: 저장 후 불러온 데이터는 원본과 100% 일치해야 함.
GPA 불변식: gpaToLevel 함수는 어떤 입력값에 대해서도 항상 1~5 사이의 정수를 반환해야 함.
갭 계산 정확성: 현재 수준 - 요구 수준 공식이 모든 경우에 엄격히 적용되어야 함.
로드맵 길이: 결과물인 로드맵 배열의 길이는 항상 plannerConfig.years + plannerConfig.gapYears와 같아야 함.


steering.md
요청하신 University-to-Career Planner의 운영 가이드라인인 Steering Document 핵심 내용을 정리해 드립니다. 이 문서는 AI 에이전트인 Uni-Career Master(UCM)가 사용자에게 응답할 때 준수해야 할 페르소나, 우선순위 로직 및 보안 원칙을 정의하고 있습니다.

1. 에이전트 페르소나: Uni-Career Master (UCM)
• 역할: SK하이닉스 등 반도체 직무를 목표로 하는 대학생 전담 커리어 코치.
• 핵심 가치:
정확성: 불확실한 정보는 "모름"으로 명시.
학생 중심: 현재 역량에서 출발하는 현실적 목표 제시.
위험 민감: 취업 실패 위험 요소에 대해 강력한 경고 및 우선순위 조정.

2. 핵심 운영 규칙
규칙 1: 갭(Gap) 기반 응답 우선순위
에이전트는 분석된 갭 인디케이터에 따라 행동 강도를 조절합니다.

Red (gap ≤ -2): 최우선 순위. 즉시 경고를 출력하고 관련 ToDo를 최상단에 배치.
Yellow (gap = -1): 주의 메시지와 함께 중기 계획에 포함.
None (gap ≥ 0): 현재 상태 유지 및 심화 학습 권고.
규칙 2: SK하이닉스 전용 예외 필터
직무 특수성을 반영하여 아래 조건을 강제 적용합니다.

비전공자 패널티: 전기전자/컴퓨터/재료공학 외 전공자는 전공 갭에 -1 추가 부여.
어학 하한선: TOEIC 700점 미만은 역량 수준을 무조건 Level 1로 고정.
코딩 테스트: 코딩 역량이 Red인 경우, 다른 어떤 활동보다 코딩 준비를 최우선 권고.


3. 기술 및 보안 가이드라인
모델 및 비용 최적화

기본 모델: gemini-2.0-flash 사용 (비용 효율성 및 예산 최소화 원칙).
재시도 정책: 최대 3회 지수 백오프 적용, 최종 실패 시 목(Mock) 데이터로 폴백.
응답 형식: 항상 JSON 형식을 강제하며, 파싱 실패 시 텍스트 내 코드 블록 추출 시도.
개인정보 보호 (익명화 처리)
성적 데이터 등 민감 정보를 AI 모델(Gemini)에 전달할 때는 아래와 같이 변환합니다.

학번/성명 → [STUDENT_ID], [STUDENT_NAME]으로 치환.
실제 평점(GPA) → 1~5 단계의 Level로 변환하여 전달.
로그 및 에러 메시지에서 API 키와 원본 응답 노출을 엄격히 금지.


4. AI 추론이 필요한 상황 (판단 기준)
단순 규칙(if-else)으로 처리가 불가능하여 AI의 맥락 이해가 필요한 시점입니다.

비정형 파싱: 대학마다 다른 성적표 양식을 읽고 의미를 매핑할 때.
관련성 분류: 특정 활동(예: 반도체 공정 교육)이 어느 역량 카테고리에 속하는지 판단할 때.
주관적 피드백: 자소서 평가 및 모의면접의 심화 후속 질문 생성 시.
최적화 추천: 개인 역량, 채용 일정, 선호도를 종합하여 휴학 활동을 추천할 때.


5. 실패 시나리오별 대응 지침
시나리오에이전트 행동성적표 파싱 실패ParseError 반환 및 "수동 입력 폼"으로 즉시 안내.API 완전 실패SK하이닉스 기준 기본 템플릿 데이터 제공 후 "AI 점검 중" 알림.모의면접 단답형 답변"최소 2문장 이상 입력" 가이드 제공 후 재입력 유도.모호한 직무명 입력유사 직무 목록(SK하이닉스 공식 카테고리 기반) 추천.

tasks.md
1. 구현 로드맵 개요
전체 개발 공정은 [타입/유틸리티 → 데이터 파서 → AI 에이전트 레이어 → 상태 관리 → UI 컴포넌트 → 통합] 순서로 진행되며, 각 단계마다 속성 기반 테스트(Property-based Testing)를 통해 시스템의 무결성을 검증하도록 설계되었습니다.

2. 주요 단계별 태스크 요약
단계 1: 기초 인프라 구축 (타입 및 유틸리티)

src/types.ts: 플래너, 성적표, AI 응답 구조 등 전체 인터페이스 정의.
gradeUtils.ts: 성적 등급(A+~F)을 GPA 점수로 변환하고, 이를 다시 역량 수준(1~5)으로 매핑하는 로직 구현.
단계 2: TranscriptParser (데이터 추출)

JSON 및 PDF 성적증명서 파싱: pdfjs-dist를 사용하여 텍스트를 추출하고 학번, 성명, 성적 행을 매핑.
보안: 파일 크기 제한(10MB) 및 로컬 저장소 활용으로 데이터 외부 유출 방지.
핵심 과목 추출: 평점 3.0 이상의 상위 5개 과목 자동 선정 로직 포함.
단계 3: AI 에이전트 레이어 (Gemini 2.0 Flash)
각 에이전트는 독립적인 역할을 수행하며 지수 백오프(Exponential Backoff) 재시도 로직을 포함합니다.

DataCollection: 기업/직무 정보 수집 및 관련성 분류.
GapAnalysis: 현재 역량과 목표의 격차 계산 및 인디케이터(Red/Yellow/None) 설정.
RiskDetection: 심각도 기반 위험 항목 도출 및 정렬.
Planner: ToDo 리스트, 학기별 달성 목표, 학제 맞춤형 로드맵 생성.
MockInterview: 면접 진행 및 1~10점 척도 피드백 제공.
단계 4: 상태 관리 및 UI 컴포넌트
• Storage: localStorage 연동을 통해 앱 재접속 시에도 이전 데이터(성적, 플래너) 복구.
• 컴포넌트 분리:
SetupPhase: 파일 업로드 및 목표 설정.
AnalysisPhase: 역량 레이더 및 위험 목록 시각화.
PlannerPhase: 타임라인 로드맵 및 ToDo 체크리스트.
ResourcesPhase & MockInterviewModal: 취업 자원 제공 및 모의면접 UI.

3. 핵심 품질 관리 포인트 (Test & Validation)
이 문서는 특히 불변식(Invariants) 검증을 강조합니다.

로드맵 길이 불변식: 생성된 로드맵 길이는 반드시 학년 + 휴학 연수와 일치해야 함.
GPA 범위: 모든 점수는 정해진 범위[0, Max] 내에 존재해야 함.
라운드트립: 저장 후 불러온 데이터가 원본과 동일함을 fast-check 등을 통해 검증.


4. 보안 및 운영 원칙 반영

API 보안: API Key는 .env.local에만 저장하여 클라이언트 노출 차단.
익명화: AI 모델 호출 시 개인정보(이름, 학번)는 치환하여 전달.
폴백(Fallback): AI 서비스 불가 시 SK하이닉스 기준 기본 템플릿(Mock Data) 제공.
