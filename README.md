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
