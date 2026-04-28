import React, { useState, useMemo, useEffect } from 'react';
import { 
  ClipboardList, 
  Search, 
  AlertCircle, 
  GraduationCap, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  User, 
  BadgeCheck, 
  Briefcase, 
  ChevronRight,
  TrendingDown,
  AlertTriangle,
  Info,
  Upload,
  Sparkles,
  ArrowRight,
  ListTodo,
  BookOpen,
  PlayCircle,
  Code,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { 
  UserProfile, 
  CollectedData, 
  GapAnalysisItem, 
  RiskItem, 
  PlannerConfig,
  AnalysisStatus,
  AppPhase,
  ToDoItem,
  ResourceItem,
  TranscriptRecord
} from './types';

// --- Gemini API Setup ---
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// --- Mock Data ---
const INITIAL_RESOURCES: ResourceItem[] = [
  { id: '1', type: 'coding', title: 'SK하이닉스 기출 코테', description: '반도체 공정 최적화 관련 DFS/BFS 기출 문제' },
  { id: '2', type: 'resume', title: '합격 자소서 분석', description: '직무 역량 중심의 기술 정립 가이드' },
  { id: '3', type: 'interview', title: '직무 면접 기출', description: '메모리 계층 구조 및 반도체 8대 공정 기술 면접' },
  { id: '4', type: 'portfolio', title: '포트폴리오 템플릿', description: '프로젝트 기술 스택과 성과 수치화 레이아웃' },
];

// --- Utility Components ---

const Badge = ({ children, color }: { children: React.ReactNode, color: string }) => {
  const colorMap: Record<string, string> = {
    red: 'bg-badge-red text-badge-red-text',
    yellow: 'bg-badge-yellow text-badge-yellow-text',
    blue: 'bg-badge-blue text-badge-blue-text',
    green: 'bg-badge-green text-badge-green-text',
    gray: 'bg-gray-100 text-gray-600',
    purple: 'bg-purple-100 text-purple-700',
  };
  
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium inline-flex items-center gap-1 ${colorMap[color] || colorMap.gray}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>
      {children}
    </span>
  );
};

// --- Sub-components ---

const Sidebar = ({ status, activePhase, onPhaseChange }: { status: AnalysisStatus, activePhase: AppPhase, onPhaseChange: (p: AppPhase) => void }) => (
  <aside className="w-[18%] h-screen sticky top-0 overflow-y-auto bg-notion-sidebar p-6 flex flex-col gap-8 border-r border-notion-border">
    <section>
      <h3 className="text-xs font-semibold text-notion-text-gray uppercase tracking-wider mb-4 px-1 flex items-center gap-2">
        <ClipboardList size={14} /> 빠른 이동
      </h3>
      <nav className="flex flex-col gap-1">
        {[
          { id: 'setup', label: '설정 & 정보 입력' },
          { id: 'analysis', label: 'AI 분석 리포트' },
          { id: 'planner', label: '취업 로드맵' },
          { id: 'resources', label: '학습 센터' }
        ].map((phase) => (
          <div 
            key={phase.id}
            onClick={() => onPhaseChange(phase.id as AppPhase)}
            className={`px-2 py-1.5 rounded cursor-pointer text-sm transition-all duration-200 ${
              activePhase === phase.id ? 'bg-[#ebebeb] font-medium' : 'hover:bg-[#f1f1ef]'
            }`}
          >
            {phase.label}
          </div>
        ))}
      </nav>
    </section>
    
    <section>
      <h3 className="text-xs font-semibold text-notion-text-gray uppercase tracking-wider mb-4 px-1">분석 상태</h3>
      <div className="flex flex-col gap-3 px-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span> 수집 완료
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className={`w-2.5 h-2.5 rounded-full bg-yellow-500 ${status === 'Analyzing' ? 'animate-pulse' : ''}`}></span> 분석 중
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="w-2.5 h-2.5 rounded-full bg-gray-300"></span> 대기
        </div>
      </div>
    </section>

    <div className="mt-auto border-t border-notion-border pt-4">
      <div className="bg-blue-100 text-badge-blue-text px-3 py-2 rounded-lg text-xs leading-tight">
        <strong>마스터 플래너</strong><br/>
        취업까지 전주기적 관리
      </div>
    </div>
  </aside>
);

const ProfileCard = ({ profile }: { profile: UserProfile }) => {
  return (
    <section className="p-5 rounded-lg flex flex-col gap-3 shadow-sm border border-transparent bg-notion-blue">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">🎓 사용자 프로필</h2>
          <div className="mt-3 grid grid-cols-3 gap-x-12 gap-y-2 text-sm">
            <div className="flex flex-col">
              <span className="text-notion-text-gray text-[11px] font-semibold uppercase tracking-tight">학과 / 이름</span>
              <span>{profile.major || '-'} / {profile.name || '-'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-notion-text-gray text-[11px] font-semibold uppercase tracking-tight">분석 일시</span>
              <span>{profile.analysisDate}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-notion-text-gray text-[11px] font-semibold uppercase tracking-tight">목표 기업 / 직무</span>
              <span className="font-bold text-badge-blue-text">{profile.targetCompany} / {profile.targetJob}</span>
            </div>
          </div>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-blue-200 text-center">
          <div className="text-[10px] text-notion-text-gray uppercase font-bold tracking-wider">취업 목표일</div>
          <div className="text-2xl font-black text-blue-800">D-{profile.prepPeriod}</div>
        </div>
      </div>
      
      <div className="border-t border-blue-200 pt-3 flex gap-12 text-sm">
        <div>
          <span className="text-notion-text-gray text-[11px] mr-2 uppercase font-semibold">주요 전공</span>
          {profile.coreSubjects.length > 0 ? profile.coreSubjects.join(', ') : '전공 데이터 없음'}
        </div>
        <div>
          <span className="text-notion-text-gray text-[11px] mr-2 uppercase font-semibold">평균 학점</span>
          <span className="bg-blue-200 text-blue-800 px-2 py-0.5 rounded text-xs font-bold">
            {profile.gpa} / {profile.maxGpa} ({profile.gpa >= 3.5 ? '양호' : profile.gpa > 0 ? '보통' : '-'})
          </span>
        </div>
      </div>
    </section>
  );
};

// --- Main App ---

export default function App() {
  const [phase, setPhase] = useState<AppPhase>('setup');
  const [planner, setPlanner] = useState<PlannerConfig>({ years: 4, gapYears: 0 });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  
  const [profile, setProfile] = useState<UserProfile>({
    major: "",
    name: "",
    analysisDate: new Date().toISOString().split('T')[0],
    targetJob: "반도체 설계 엔지니어",
    targetCompany: "SK하이닉스",
    prepPeriod: 120,
    gpa: 0,
    maxGpa: 4.5,
    coreSubjects: []
  });

  const [todos, setTodos] = useState<ToDoItem[]>([
    { id: '1', task: '반도체 공정 8대 공정 기초 심화 학습', completed: false, category: 'academic' },
    { id: '2', task: 'OPIc IH 등급 이상 확보', completed: false, category: 'spec' },
    { id: '3', task: 'Git 기반 협업 프로젝트 1회 이상 수행', completed: false, category: 'career' },
  ]);

  const [collectedData, setCollectedData] = useState<CollectedData[]>([
    { category: "성적", content: "3.8 / 4.5", relevance: "High" },
    { category: "자격증", content: "SQLD, 정보처리기사", relevance: "High" },
    { category: "프로젝트", content: "반도체 공정 시뮬", relevance: "High" },
    { category: "포트폴리오", content: "GitHub 3개 레포", relevance: "Medium" }
  ]);

  const gapItems: GapAnalysisItem[] = [
    { capability: "전공 지식", requiredLevel: 5, currentLevel: 4, gap: -1, indicator: 'none' },
    { capability: "어학 (영어)", requiredLevel: 4, currentLevel: 2, gap: -2, indicator: 'red' },
    { capability: "코딩 역량", requiredLevel: 4, currentLevel: 3, gap: -1, indicator: 'yellow' },
    { capability: "포트폴리오", requiredLevel: 4, currentLevel: 3, gap: -1, indicator: 'yellow' }
  ];

  const risks: RiskItem[] = [
    { item: "OPIc 미취득", grade: "High", deadline: "2026-08", action: "즉시 등록 및 학습 개시" },
    { item: "인턴 지원 마감", grade: "Medium", deadline: "2026-06", action: "서류 준비 및 자소서 작성" },
    { item: "포트폴리오 미완", grade: "Medium", deadline: "-", action: "2개월 내 주요 레포 정리" },
    { item: "학점 관리", grade: "Low", deadline: "-", action: "현재 수준 유지" }
  ];

  // Simulation: File Parsing
  const handleFileUpload = () => {
    setIsParsing(true);
    setTimeout(() => {
      setProfile(prev => ({
        ...prev,
        major: "컴퓨터공학과",
        name: "홍길동",
        gpa: 3.8,
        coreSubjects: ["자료구조", "운영체제", "데이터베이스", "이산수학", "시스템프로그래밍"]
      }));
      setIsParsing(false);
    }, 2000);
  };

  // AI Task Generation
  const generateAITasks = async () => {
     setIsAnalyzing(true);
     try {
       const prompt = `${profile.targetCompany}의 ${profile.targetJob} 직무 취업을 위해, 현재 학점 ${profile.gpa}인 학생이 준비해야 할 구체적인 ToDo 리스트 5개를 한국어로 작성해줘. JSON 형식으로 [{task, category}] 형태로 줘.`;
       
       const response = await ai.models.generateContent({
         model: "gemini-3-flash-preview",
         contents: prompt,
         config: {
           responseMimeType: "application/json"
         }
       });

       const newTasks = JSON.parse(response.text || "[]");
       setTodos(prev => [
         ...prev,
         ...newTasks.map((t: any, i: number) => ({
           id: `ai-${Date.now()}-${i}`,
           task: t.task,
           completed: false,
           category: t.category || 'career'
         }))
       ]);
       setPhase('analysis');
     } catch (error) {
       console.error("AI Error:", error);
     } finally {
       setIsAnalyzing(false);
     }
  };

  const yearlyRoadmap = useMemo(() => {
    const steps = [];
    for (let i = 1; i <= planner.years; i++) {
        let milestones = [];
        if (i === 1) milestones = ['전공 기초(C/Java) 학습', '학급 로드맵 설정', '성적 관리(3.5 이상)'];
        else if (i === 2) milestones = ['데이터구조/운영체제 이수', '회로이론 기초', '대내외 직무 활동'];
        else if (i === 3) milestones = ['SK하이닉스 하이파이브 준비', '포트폴리오 구축', '전공 심화 프로젝트'];
        else milestones = ['공정 실무 교육', '면접 스터디', '취업 서류 제출'];
        
        steps.push({ year: `${i}학년`, milestones, type: 'academic' });
    }
    
    if (planner.gapYears > 0) {
        const gapSteps = [];
        for (let i = 1; i <= planner.gapYears; i++) {
            gapSteps.push({
                year: `휴학 ${i}년차`,
                milestones: ['어학 성적 확보', '직무 부트캠프', '산업체 실습'],
                type: 'gap'
            });
        }
        steps.splice(2, 0, ...gapSteps);
    }
    return steps;
  }, [planner]);

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar 
        status={isAnalyzing ? 'Analyzing' : 'Complete'} 
        activePhase={phase}
        onPhaseChange={setPhase}
      />
      
      <main className="flex-1 w-[82%] px-12 py-10 max-w-5xl">
        <header className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight">Career Cycle Master</h1>
            <div className="flex items-center gap-3">
               <Badge color="blue">Notion Style AI Agent</Badge>
            </div>
          </div>
          <ProfileCard profile={profile} />
        </header>

        <AnimatePresence mode="wait">
          {phase === 'setup' && (
            <motion.div 
              key="setup"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-2 gap-8">
                <div className="p-8 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-center gap-4 hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group"
                     onClick={handleFileUpload}>
                   <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-2 group-hover:scale-110 transition-transform">
                      {isParsing ? <Clock className="animate-spin" /> : <Upload />}
                   </div>
                   <h3 className="text-lg font-bold">성적증명서 업로드</h3>
                   <p className="text-sm text-gray-500">JSON 기반으로 개인정보 및 성적 데이터를<br/>자동으로 추출하고 정리합니다.</p>
                   {isParsing && <Badge color="blue">데이터 추출 중...</Badge>}
                </div>

                <div className="space-y-6">
                  <div className="bg-notion-gray p-6 rounded-2xl">
                    <h3 className="font-bold mb-4 flex items-center gap-2 underline decoration-blue-300">🎯 취업 목표 설정</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase">목표 기업</label>
                        <select className="w-full bg-white border border-gray-200 p-2 rounded-md outline-none mt-1 focus:ring-2 ring-blue-100">
                          <option>SK하이닉스</option>
                          <option>삼성전자</option>
                          <option>ASML</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase">목표 직무</label>
                        <input className="w-full bg-white border border-gray-200 p-2 rounded-md outline-none mt-1 focus:ring-2 ring-blue-100" 
                               placeholder="예: 반도체 설계 엔지니어" value={profile.targetJob} 
                               onChange={(e) => setProfile({...profile, targetJob: e.target.value})} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-notion-gray p-6 rounded-2xl">
                    <h3 className="font-bold mb-4 flex items-center gap-2 underline decoration-orange-300">📅 학제 및 휴학 설정</h3>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">학제</label>
                        <select value={planner.years} onChange={(e) => setPlanner({...planner, years: parseInt(e.target.value)})} className="w-full bg-white border border-gray-200 p-2 rounded-md outline-none mt-1">
                          <option value={4}>4년제</option>
                          <option value={3}>3년제</option>
                          <option value={2}>2년제</option>
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">휴학</label>
                        <select value={planner.gapYears} onChange={(e) => setPlanner({...planner, gapYears: parseInt(e.target.value)})} className="w-full bg-white border border-gray-200 p-2 rounded-md outline-none mt-1">
                          <option value={0}>없음</option>
                          <option value={1}>1년</option>
                          <option value={2}>2년</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    disabled={!profile.name || isAnalyzing}
                    onClick={generateAITasks}
                    className="w-full py-4 bg-black text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {isAnalyzing ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Sparkles size={20} />}
                    분석 시작 및 플랜 생성
                    <ArrowRight size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {phase === 'analysis' && (
            <motion.div 
              key="analysis"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
               <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                 <BadgeCheck className="text-blue-600" /> AI Agent 정밀 분석 리포트
               </h2>
               
               <div className="p-4 rounded-lg border border-notion-border bg-notion-gray">
                 <h3 className="text-sm font-bold flex items-center gap-2 mb-3">📦 1단계: 데이터 수집 에이전트</h3>
                 <table className="w-full text-xs text-left border-collapse">
                   <thead className="text-notion-text-gray uppercase text-[10px] border-b border-[#dcdcdc] font-bold tracking-wider">
                     <tr>
                       <th className="py-2">항목</th>
                       <th className="py-2">내용</th>
                       <th className="py-2 text-right">직무 연관성</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-[#e1e1e1]">
                     {collectedData.map((item, idx) => (
                       <tr key={idx} className="hover:bg-white/50 transition-colors">
                         <td className="py-2.5 font-medium">{item.category}</td>
                         <td className="py-2.5">{item.content}</td>
                         <td className="py-2.5 text-right font-bold">
                           <span className={item.relevance === 'High' ? 'text-red-600' : item.relevance === 'Medium' ? 'text-yellow-600' : 'text-green-600'}>
                             ● {item.relevance === 'High' ? '높음' : item.relevance === 'Medium' ? '중간' : '낮음'}
                           </span>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>

               <div className="p-4 rounded-lg border border-[#f2e2a2] bg-notion-yellow">
                 <h3 className="text-sm font-bold flex items-center gap-2 mb-3">🔍 2단계: 갭 분석 에이전트</h3>
                 <div className="grid grid-cols-2 gap-4 text-xs">
                   <div className="bg-white/40 p-3 rounded border border-black/5">
                     <div className="font-semibold mb-2">역량 대비 수준 ({profile.targetCompany} 기준)</div>
                     <div className="space-y-2">
                       {gapItems.map((item, idx) => (
                         <div key={idx} className={`flex justify-between ${item.indicator === 'red' ? 'text-red-600 font-bold' : item.indicator === 'yellow' ? 'text-yellow-700' : ''}`}>
                           <span>{item.capability}</span>
                           <span>{'★'.repeat(item.currentLevel)}{'☆'.repeat(5 - item.currentLevel)}</span>
                         </div>
                       ))}
                     </div>
                   </div>
                   <div className="p-1">
                     <div className="font-bold text-gray-800 mb-2 font-mono">📌 우선 보완 항목</div>
                     <ul className="list-disc list-inside space-y-1.5 text-gray-600">
                       <li>어학 성적 확보 (OPIc IH 이상)</li>
                       <li>반도체 공정 프로젝트 구체화 (GitHub 정리)</li>
                     </ul>
                   </div>
                 </div>
               </div>

               <div className="p-4 rounded-lg border border-[#f5d0cd] bg-notion-red">
                 <h3 className="text-sm font-bold flex items-center gap-2 mb-4">🚨 3단계: 위험 감지 에이전트</h3>
                 <div className="p-3 bg-white/40 rounded border border-[#f5d0cd] text-xs leading-relaxed">
                   현재 성적은 우수하나, **실무 프로젝트 경험**이 직무 요구 대비 부족합니다. 상반기 내 직무 관련 부트캠프 혹은 인턴십 지원이 필수적입니다.
                 </div>
               </div>

               <div className="flex justify-end pt-4">
                  <button onClick={() => setPhase('planner')} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors">
                    상세 로드맵 확인하기
                  </button>
               </div>
            </motion.div>
          )}

          {phase === 'planner' && (
            <motion.div 
               key="planner"
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="space-y-12"
            >
               <div>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Calendar className="text-blue-600" /> 전주기적 로드맵 (학점/성적 기반)
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {yearlyRoadmap.map((step, idx) => (
                      <div key={idx} className={`p-6 rounded-2xl border transition-all hover:shadow-lg ${step.type === 'gap' ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-200'}`}>
                        <div className="flex justify-between mb-4">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Step {idx + 1}</span>
                          {step.type === 'gap' && <Badge color="yellow">휴학 기간</Badge>}
                        </div>
                        <h4 className="text-xl font-bold mb-4">{step.year}</h4>
                        <ul className="space-y-2">
                          {step.milestones.map((m, i) => (
                            <li key={i} className="text-sm flex items-center gap-2 text-gray-600">
                               <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                               {m}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
               </div>

               <div className="bg-notion-gray p-8 rounded-3xl shadow-inner">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <ListTodo className="text-black" /> 실시간 액션 플랜 (ToDo)
                  </h3>
                  <div className="space-y-3">
                    {todos.map(todo => (
                      <div key={todo.id} className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between group">
                         <div className="flex items-center gap-3">
                            <input type="checkbox" checked={todo.completed} onChange={() => {
                              setTodos(todos.map(t => t.id === todo.id ? {...t, completed: !t.completed} : t));
                            }} className="w-5 h-5 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                            <span className={`text-sm ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>{todo.task}</span>
                         </div>
                         <Badge color={todo.category === 'academic' ? 'blue' : todo.category === 'spec' ? 'yellow' : 'green'}>
                           {todo.category}
                         </Badge>
                      </div>
                    ))}
                  </div>
               </div>
            </motion.div>
          )}

          {phase === 'resources' && (
            <motion.div 
               key="resources"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="grid grid-cols-2 gap-6"
            >
               {INITIAL_RESOURCES.map((res) => (
                 <div key={res.id} className="p-6 bg-white border border-gray-200 rounded-2xl hover:border-blue-400 transition-colors shadow-sm cursor-pointer group">
                    <div className="flex items-center gap-4 mb-4">
                       <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-notion-text-gray group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                          {res.type === 'coding' ? <Code size={24} /> : res.type === 'resume' ? <FileText size={24} /> : res.type === 'interview' ? <PlayCircle size={24} /> : <BookOpen size={24} />}
                       </div>
                       <div>
                          <h4 className="font-bold">{res.title}</h4>
                          <p className="text-xs text-gray-400 uppercase">{res.type}</p>
                       </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{res.description}</p>
                    <div className="flex justify-end">
                       <button className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline">
                          학습하기 <ChevronRight size={14} />
                       </button>
                    </div>
                 </div>
               ))}
               
               <div className="col-span-2 mt-8 p-10 bg-black text-white rounded-3xl text-center">
                  <h3 className="text-2xl font-bold mb-4">모의 면접 에이전트 실행</h3>
                  <p className="text-gray-400 mb-8 max-w-lg mx-auto italic">SK하이닉스 실제 기출 질문을 기반으로 AI 면접관과 연습해보세요.</p>
                  <button className="px-8 py-3 bg-white text-black rounded-full font-extrabold hover:bg-gray-200 transition-colors">
                    면접 시작하기
                  </button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <footer className="mt-20 pt-8 border-t border-gray-100 text-center">
            <p className="text-[10px] text-notion-text-gray font-mono uppercase tracking-widest opacity-50">
                Uni-Career Master Planner • {profile.targetCompany} Achievement Mode
            </p>
        </footer>
      </main>
    </div>
  );
}
