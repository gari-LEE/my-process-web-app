  // Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBdDXOEreJzytGMr8anZ9mg7I_kYrnx7gk",
    authDomain: "my-process-app.firebaseapp.com",
    databaseURL: "https://my-process-app-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "my-process-app",
    storageBucket: "my-process-app.firebasestorage.app",
    messagingSenderId: "1044912986098",
    appId: "1:1044912986098:web:8f3d4d14cd7a2564fefd6b",
    databaseURL :"https://my-process-app-default-rtdb.asia-southeast1.firebasedatabase.app/"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

// Ensure React and ReactDOM are available globally from CDN
const React = window.React;
const ReactDOM = window.ReactDOM;

// Import Lucide icons (This setup assumes a build process or global availability.
// For direct browser use without a bundler, you'd typically use inline SVGs or a pre-compiled icon library.)
// For this example, we'll simulate the imports as if they were bundled.
import { Search, Filter, Star, Printer, ChevronRight, ChevronDown, Calendar, Clock, User, HardDrive, FileText, Info, Home, ListFilter, Bookmark, Users, LayoutDashboard, CalendarDays, CalendarClock, CalendarCheck, Edit, X, PlusCircle, Link, BellRing, Trash2 } from 'https://unpkg.com/lucide-react@0.363.0/dist/lucide-react.js';


// ManualContext 생성
const ManualContext = React.createContext();

// Mock Data (실제 데이터는 백엔드 또는 Firestore에서 가져올 수 있습니다.)
const mockTasks = [
  {
    id: 'task-1',
    name: 'QA 데이터 분석 및 보고',
    category: '상담품질',
    assignee: '권미 프로',
    processSteps: [
      '주간 QA 데이터 취합',
      '데이터 분석 및 개선점 도출',
      '분석 결과 보고서 작성',
      '관련 팀에 공유 및 피드백 반영'
    ],
    cycle: '주간 1회',
    deliverables: ['주간 QA 분석 보고서', '개선 액션 플랜'],
    fileLink: '#',
    fileLocation: '공유 드라이브/QA/2024',
    notes: '매주 월요일 오전까지 완료',
    isFavorite: false,
  },
  {
    id: 'task-2',
    name: '해피존(주) 고객 VOC 처리',
    category: '고객관리',
    assignee: '권미 프로',
    processSteps: [
      '해피존 접수된 고객 VOC 확인',
      '관련 부서에 내용 전달 및 회신 요청',
      '고객에게 처리 결과 안내',
      'VOC 데이터 기록 및 관리'
    ],
    cycle: '일일',
    deliverables: ['VOC 처리 완료 보고', '고객 회신 내역'],
    fileLink: '#',
    fileLocation: 'CRM 시스템',
    notes: '긴급 VOC는 즉시 처리',
    isFavorite: false,
  },
  {
    id: 'task-3',
    name: '콜시스템 일일 점검',
    category: '콜시스템',
    assignee: '이정훈 프로',
    processSteps: [
      '콜시스템 로그인 및 상태 확인',
      '통화 품질 및 네트워크 안정성 점검',
      '오류 발생 시 IT팀에 보고 및 조치 요청',
      '점검 결과 기록'
    ],
    cycle: '일일',
    deliverables: ['일일 콜시스템 점검 보고서'],
    fileLink: '#',
    fileLocation: '내부 시스템/콜시스템 로그',
    notes: '매일 오전 9시 이전 완료',
    isFavorite: false,
  },
  {
    id: 'task-4',
    name: '고객응대 매뉴얼 업데이트',
    category: '콜시스템',
    assignee: '이정훈 프로',
    processSteps: [
      '최신 고객 피드백 및 정책 변경 사항 검토',
      '매뉴얼 내용 수정 및 보완',
      '관련 팀원들에게 변경 사항 공지',
      '업데이트된 매뉴얼 배포'
    ],
    cycle: '월간 1회',
    deliverables: ['업데이트된 고객응대 매뉴얼'],
    fileLink: '#',
    fileLocation: '공유 드라이브/매뉴얼/고객응대',
    notes: '매월 마지막 주 금요일 업데이트',
    isFavorite: false,
  },
  {
    id: 'task-5',
    name: '진료일정 확인 및 조정',
    category: '진료지원',
    assignee: '김유미 프로',
    processSteps: [
      '주간 진료일정표 확인',
      '의료진 휴가 및 변경 사항 반영',
      '예약 고객에게 변경 사항 안내',
      '최종 일정표 확정 및 공유'
    ],
    cycle: '주간 2회',
    deliverables: ['주간 진료일정표'],
    fileLink: '#',
    fileLocation: '내부 시스템/진료일정',
    notes: '매주 목요일 오후까지 완료',
    isFavorite: false,
  },
  {
    id: 'task-6',
    name: '고객 문자발송 (안내/홍보)',
    category: '진료지원',
    assignee: '김유미 프로',
    processSteps: [
      '발송 대상 고객 리스트 확인',
      '문자 내용 작성 및 승인 요청',
      '문자 발송 시스템을 통해 발송',
      '발송 결과 모니터링'
    ],
    cycle: '발생시',
    deliverables: ['발송 완료 보고'],
    fileLink: '#',
    fileLocation: '문자 발송 시스템',
    notes: '긴급 공지는 즉시 발송',
    isFavorite: false,
  },
  {
    id: 'task-7',
    name: '해피존(부) 고객 만족도 조사',
    category: '고객관리',
    assignee: '정현주 프로',
    processSteps: [
      '고객 만족도 조사 설문지 준비',
      '설문 대상 고객 선정 및 발송',
      '설문 결과 취합 및 분석',
      '분석 보고서 작성 및 공유'
    ],
    cycle: '월간 1회',
    deliverables: ['월간 고객 만족도 조사 보고서'],
    fileLink: '#',
    fileLocation: '공유 드라이브/고객만족도/2024',
    notes: '매월 첫째 주에 진행',
    isFavorite: false,
  },
  {
    id: 'task-8',
    name: '팀 운영 지원 및 비품 관리',
    category: '팀운영',
    assignee: '정현주 프로',
    processSteps: [
      '팀 비품 재고 확인 및 부족분 신청',
      '회의실 예약 및 회의 준비 지원',
      '팀원 요청 사항 처리',
      '사무 환경 정리 및 유지'
    ],
    cycle: '일일',
    deliverables: ['비품 재고 현황', '회의록'],
    fileLink: '#',
    fileLocation: '팀 공유 폴더',
    notes: '필요시 수시로 처리',
    isFavorite: false,
  },
  {
    id: 'task-9',
    name: '고객감동위원회 회의 준비',
    category: '고객관리',
    assignee: '권미 프로',
    processSteps: [
      '회의 안건 및 자료 준비',
      '회의록 작성',
      '회의 결과 공유 및 후속 조치 팔로우업'
    ],
    cycle: '월간 1회',
    deliverables: ['회의록', '액션 아이템 리스트'],
    fileLink: '#',
    fileLocation: '공유 드라이브/고객감동위원회',
    notes: '매월 셋째 주 진행',
    isFavorite: false,
  },
  {
    id: 'task-10',
    name: '주간 업무 보고서 작성',
    category: '팀운영',
    assignee: '정현주 프로',
    processSteps: [
      '팀원별 주간 업무 내용 취합',
      '주요 성과 및 이슈 정리',
      '주간 보고서 양식에 맞춰 작성',
      '팀장님께 보고'
    ],
    cycle: '주간 1회',
    deliverables: ['주간 업무 보고서'],
    fileLink: '#',
    fileLocation: '팀 공유 폴더',
    notes: '매주 금요일 오후까지 완료',
    isFavorite: false,
  },
];

const teamMembers = [
  { name: '권미 프로', roles: 'QA, 해피존(주), 고객감동위원회' },
  { name: '이정훈 프로', roles: '콜시스템, 고객응대 매뉴얼' },
  { name: '김유미 프로', roles: '진료일정, 문자발송' },
  { name: '정현주 프로', roles: '해피존(부), 팀운영지원' },
];

// 실제 업무 카테고리 목록
const actualTaskCategories = [
  '상담품질', '콜시스템', '고객관리', '진료지원', '팀운영'
];

// 기본 수행 주기 타입
const baseTaskCycles = [
  '일일', '주간', '월간', '년간', '발생시'
];

// Context Provider
const ManualProvider = ({ children }) => {
  const [tasks, setTasks] = React.useState(mockTasks);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterCycle, setFilterCycle] = React.useState(''); // Stores base cycle type (e.g., '주간')
  const [filterAssignee, setFilterAssignee] = React.useState('');
  const [filterCategory, setFilterCategory] = React.useState('');
  const [showFavorites, setShowFavorites] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true); // New loading state for skeleton UI

  // Dashboard specific states
  const [teamOverview, setTeamOverview] = React.useState({
    title: '상담지원팀 개요',
    content: '상담지원팀은 고객 소통 최전선에서 고객 만족을 위한 다양한 업무를 수행합니다. 본 매뉴얼은 팀원들이 업무를 효율적으로 수행하고, 필요한 정보를 신속하게 찾을 수 있도록 돕습니다.'
  });
  const [announcements, setAnnouncements] = React.useState([
    { id: 'ann-1', title: '월간 업무 보고서 마감 안내', content: '이번 달 월간 업무 보고서 제출 마감일은 25일입니다. 기한 내 제출 바랍니다.', date: '2025-05-20' },
    { id: 'ann-2', title: '신규 콜시스템 교육 일정', content: '다음 주 수요일 오후 2시, 신규 콜시스템 교육이 진행됩니다. 참석 바랍니다.', date: '2025-05-18' },
    { id: 'ann-3', title: '팀 워크숍 개최', content: '다음 달 팀 워크숍이 예정되어 있습니다. 자세한 내용은 추후 공지 예정입니다.', date: '2025-05-15' },
    { id: 'ann-4', title: '사내 봉사활동 참여 안내', content: '이번 주말 사내 봉사활동에 많은 참여 부탁드립니다. 상세 내용은 게시판 확인.', date: '2025-05-10' },
  ]);
  const [quickLinks, setQuickLinks] = React.useState([
    { id: 'link-1', name: '회사 인트라넷', url: 'https://www.google.com', description: '내부 시스템 접속' },
    { id: 'link-2', name: '고객 VOC 시스템', url: 'https://www.google.com', description: '고객 불만 접수 및 처리' },
    { id: 'link-3', name: '주간 회의록', url: 'https://www.google.com', description: '팀 주간 회의록 확인' },
  ]);


  React.useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800); // Simulate 0.8 second loading time for a snappier feel
    return () => clearTimeout(timer);
  }, []);

  // 즐겨찾기 토글 함수
  const toggleFavorite = React.useCallback((taskId) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, isFavorite: !task.isFavorite } : task
      )
    );
  }, []);

  // 업무 수정 함수
  const updateTask = React.useCallback((updatedTask) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  }, []);

  // 새 업무 추가 함수
  const addTask = React.useCallback((newTaskData) => {
    const newId = `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`; // Unique ID generation
    setTasks(prevTasks => [...prevTasks, { ...newTaskData, id: newId, isFavorite: false }]);
  }, []);

  // Dashboard specific update functions
  const updateTeamOverview = React.useCallback((newOverview) => { // 변경: newContent에서 newOverview로 명칭 변경 (객체 전체를 받음)
    setTeamOverview(newOverview);
  }, []);

  const addAnnouncement = React.useCallback((newAnn) => {
    setAnnouncements(prev => [...prev, { ...newAnn, id: `ann-${Date.now()}` }]);
  }, []);
  const updateAnnouncement = React.useCallback((updatedAnn) => {
    setAnnouncements(prev => prev.map(ann => ann.id === updatedAnn.id ? updatedAnn : ann));
  }, []);
  const deleteAnnouncement = React.useCallback((id) => {
    setAnnouncements(prev => prev.filter(ann => ann.id !== id));
  }, []);

  const addQuickLink = React.useCallback((newLink) => {
    setQuickLinks(prev => [...prev, { ...newLink, id: `link-${Date.now()}` }]);
  }, []);
  const updateQuickLink = React.useCallback((updatedLink) => {
    setQuickLinks(prev => prev.map(link => link.id === updatedLink.id ? updatedLink : link));
  }, []);
  const deleteQuickLink = React.useCallback((id) => {
    setQuickLinks(prev => prev.filter(link => link.id !== id));
  }, []);


  const filteredTasks = React.useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = searchTerm === '' ||
        task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.assignee.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.processSteps.some(step => step.toLowerCase().includes(searchTerm.toLowerCase()));

      // Filter by base cycle type
      const taskBaseCycle = task.cycle.split(' ')[0]; // '주간 1회' -> '주간'
      const matchesCycle = filterCycle === '' || taskBaseCycle === filterCycle;

      const matchesAssignee = filterAssignee === '' || task.assignee === filterAssignee;
      const matchesCategory = filterCategory === '' || task.category === filterCategory;
      const matchesFavorite = !showFavorites || task.isFavorite;

      return matchesSearch && matchesCycle && matchesAssignee && matchesCategory && matchesFavorite;
    });
  }, [tasks, searchTerm, filterCycle, filterAssignee, filterCategory, showFavorites]);

  const contextValue = React.useMemo(() => ({
    tasks,
    filteredTasks,
    searchTerm,
    setSearchTerm,
    filterCycle,
    setFilterCycle,
    filterAssignee,
    setFilterAssignee,
    filterCategory,
    setFilterCategory,
    showFavorites,
    setShowFavorites,
    toggleFavorite,
    updateTask,
    addTask, // Add addTask to context
    teamMembers,
    taskCategories: actualTaskCategories, // 실제 업무 카테고리 목록 사용
    taskCycles: baseTaskCycles, // Use baseTaskCycles for filter options
    isLoading, // Add isLoading to context
    // Dashboard specific context values
    teamOverview, updateTeamOverview,
    announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement,
    quickLinks, addQuickLink, updateQuickLink, deleteQuickLink,
  }), [
    tasks, filteredTasks, searchTerm, filterCycle, filterAssignee, filterCategory, showFavorites,
    toggleFavorite, updateTask, addTask, isLoading,
    teamOverview, updateTeamOverview,
    announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement,
    quickLinks, addQuickLink, updateQuickLink, deleteQuickLink,
  ]);

  return (
    <ManualContext.Provider value={contextValue}>
      {children}
    </ManualContext.Provider>
  );
};

// Header Component
const Header = ({ onSearchChange, onNavigate, currentPage, onOpenCreateTask }) => {
  const [input, setInput] = React.useState('');
  const { searchTerm, setSearchTerm } = React.useContext(ManualContext);

  // Debounce search input
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(input);
    }, 300); // 300ms debounce time

    return () => {
      clearTimeout(handler);
    };
  }, [input, setSearchTerm]);

  return (
    <header className="bg-white shadow-md p-4 flex flex-col sm:flex-row items-center justify-between sticky top-0 z-10 rounded-b-lg animate-fade-in-down">
      <div className="flex items-center mb-4 sm:mb-0">
        <h1 className="text-2xl font-bold text-indigo-700 mr-4">업무 매뉴얼</h1>
        <nav className="hidden sm:flex space-x-4">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300
              ${currentPage === 'dashboard' ? 'bg-indigo-100 text-indigo-700 shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-indigo-600'}`}
            title="대시보드 페이지로 이동"
          >
            <Home className="inline-block mr-1 w-4 h-4" /> 대시보드
          </button>
          <button
            onClick={() => onNavigate('all-tasks')}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300
              ${currentPage === 'all-tasks' ? 'bg-indigo-100 text-indigo-700 shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-indigo-600'}`}
            title="전체 업무 목록 보기"
          >
            <ListFilter className="inline-block mr-1 w-4 h-4" /> 전체 업무
          </button>
          <button
            onClick={onOpenCreateTask}
            className="px-3 py-2 rounded-md text-sm font-medium bg-pink-500 text-white hover:bg-pink-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
            title="새로운 업무 추가"
          >
            <PlusCircle className="inline-block mr-1 w-4 h-4" /> 새 업무 추가
          </button>
        </nav>
      </div>
      <div className="relative w-full sm:w-1/3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="업무명, 담당자, 키워드 검색..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all duration-200"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          aria-label="검색"
          title="업무명, 담당자, 키워드로 검색"
        />
      </div>
    </header>
  );
};

// Sidebar Component
const Sidebar = ({ onNavigate, currentPage }) => { // currentPage prop 추가
  const { teamMembers, taskCategories, taskCycles, setFilterAssignee, setFilterCategory, setFilterCycle, setShowFavorites, showFavorites, filterAssignee, filterCategory, filterCycle } = React.useContext(ManualContext);

  const handleClearFilters = () => {
    setFilterAssignee('');
    setFilterCategory('');
    setFilterCycle('');
    setShowFavorites(false);
  };

  // 대시보드에서는 사이드바를 렌더링하지 않음
  if (currentPage === 'dashboard') {
    return null;
  }

  return (
    <aside className="bg-gray-50 p-4 w-full sm:w-64 flex-shrink-0 rounded-lg shadow-md animate-fade-in-left">
      <nav className="space-y-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">필터</h3>
          <button
            onClick={handleClearFilters}
            className="w-full px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-all duration-300 flex items-center justify-center text-sm font-medium shadow-md hover:shadow-lg"
            title="모든 필터 초기화"
          >
            <Filter className="w-4 h-4 mr-2" /> 필터 초기화
          </button>
        </div>

        {/* 즐겨찾기 토글 */}
        <div className="border-b border-gray-200 pb-4">
          <label className="flex items-center justify-between cursor-pointer py-2">
            <span className="text-gray-700 font-medium flex items-center"><Bookmark className="w-4 h-4 mr-2" /> 즐겨찾기</span>
            <input
              type="checkbox"
              className="sr-only peer"
              checked={showFavorites}
              onChange={() => setShowFavorites(prev => !prev)}
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        {/* 담당자별 필터 */}
        <div className="border-b border-gray-200 pb-4">
          <h4 className="text-gray-700 font-medium mb-2 flex items-center"><Users className="w-4 h-4 mr-2" /> 담당자별</h4>
          <div className="space-y-1">
            <label className={`flex items-center text-sm cursor-pointer p-1 rounded-md transition-colors duration-200 ${filterAssignee === '' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}>
              <input
                type="radio"
                name="assigneeFilter"
                value=""
                checked={filterAssignee === ''}
                onChange={() => setFilterAssignee('')}
                className="form-radio h-4 w-4 text-indigo-600 transition-colors duration-200 focus:ring-indigo-500"
              />
              <span className="ml-2">전체</span>
            </label>
            {teamMembers.map(member => (
              <label key={member.name} className={`flex items-center text-sm cursor-pointer p-1 rounded-md transition-colors duration-200 ${filterAssignee === member.name ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}>
                <input
                  type="radio"
                  name="assigneeFilter"
                  value={member.name}
                  checked={filterAssignee === member.name}
                  onChange={() => setFilterAssignee(member.name)}
                  className="form-radio h-4 w-4 text-indigo-600 transition-colors duration-200 focus:ring-indigo-500"
                />
                <span className="ml-2">{member.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 업무 카테고리 필터 */}
        <div className="border-b border-gray-200 pb-4">
          <h4 className="text-gray-700 font-medium mb-2 flex items-center"><LayoutDashboard className="w-4 h-4 mr-2" /> 업무 카테고리</h4>
          <div className="space-y-1">
            <label className={`flex items-center text-sm cursor-pointer p-1 rounded-md transition-colors duration-200 ${filterCategory === '' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}>
              <input
                type="radio"
                name="categoryFilter"
                value=""
                checked={filterCategory === ''}
                onChange={() => setFilterCategory('')}
                className="form-radio h-4 w-4 text-indigo-600 transition-colors duration-200 focus:ring-indigo-500"
              />
              <span className="ml-2">전체</span>
            </label>
            {actualTaskCategories.map(category => ( // 실제 업무 카테고리 목록 사용
              <label key={category} className={`flex items-center text-sm cursor-pointer p-1 rounded-md transition-colors duration-200 ${filterCategory === category ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}>
                <input
                  type="radio"
                  name="categoryFilter"
                  value={category}
                  checked={filterCategory === category}
                  onChange={() => setFilterCategory(category)}
                  className="form-radio h-4 w-4 text-indigo-600 transition-colors duration-200 focus:ring-indigo-500"
                />
                <span className="ml-2">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 수행 주기 필터 */}
        <div>
          <h4 className="text-gray-700 font-medium mb-2 flex items-center"><CalendarDays className="w-4 h-4 mr-2" /> 수행 주기</h4>
          <div className="space-y-1">
            <label className={`flex items-center text-sm cursor-pointer p-1 rounded-md transition-colors duration-200 ${filterCycle === '' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}>
              <input
                type="radio"
                name="cycleFilter"
                value=""
                checked={filterCycle === ''}
                onChange={() => setFilterCycle('')}
                className="form-radio h-4 w-4 text-indigo-600 transition-colors duration-200 focus:ring-indigo-500"
              />
              <span className="ml-2">전체</span>
            </label>
            {baseTaskCycles.map(cycle => (
              <label key={cycle} className={`flex items-center text-sm cursor-pointer p-1 rounded-md transition-colors duration-200 ${filterCycle === cycle ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}>
                <input
                  type="radio"
                  name="cycleFilter"
                  value={cycle}
                  checked={filterCycle === cycle}
                  onChange={() => setFilterCycle(cycle)}
                  className="form-radio h-4 w-4 text-indigo-600 transition-colors duration-200 focus:ring-indigo-500"
                />
                <span className="ml-2">{cycle}</span>
              </label>
            ))}
          </div>
        </div>
      </nav>
    </aside>
  );
};

// Skeleton Card Component
const SkeletonCard = () => (
  <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200 animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
  </div>
);

// Task Card Component
const TaskCard = ({ task, onSelectTask }) => {
  const { toggleFavorite } = React.useContext(ManualContext);

  const getCycleIcon = (cycle) => {
    const baseCycle = cycle.split(' ')[0]; // Extract base cycle for icon
    switch (baseCycle) {
      case '일일': return <CalendarClock className="w-4 h-4 text-orange-400" />;
      case '주간': return <CalendarDays className="w-4 h-4 text-orange-400" />;
      case '월간': return <Calendar className="w-4 h-4 text-orange-400" />;
      case '년간': return <CalendarCheck className="w-4 h-4 text-orange-400" />;
      case '발생시': return <Clock className="w-4 h-4 text-orange-400" />;
      default: return null;
    }
  };

  return (
    <div
      className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200 relative transform hover:-translate-y-1 hover:scale-[1.01] animate-fade-in"
      onClick={() => onSelectTask(task)}
      role="button"
      tabIndex="0"
      aria-label={`${task.name} 상세 보기`}
      title={`${task.name} 상세 보기`}
    >
      <button
        onClick={(e) => { e.stopPropagation(); toggleFavorite(task.id); }}
        className="absolute top-3 right-3 text-gray-400 hover:text-yellow-400 transition-colors duration-200 transform hover:scale-110"
        aria-label="즐겨찾기 토글"
        title={task.isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
      >
        <Star className={`w-6 h-6 ${task.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
      </button>
      <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate">{task.name}</h3>
      <div className="flex items-center text-gray-600 text-sm mb-1 truncate">
        <User className="w-4 h-4 mr-2 text-indigo-500" />
        <span>{task.assignee}</span>
      </div>
      <div className="flex items-center text-gray-600 text-sm mb-1 truncate">
        <LayoutDashboard className="w-4 h-4 mr-2 text-indigo-500" />
        <span>{task.category}</span>
      </div>
      <div className="flex items-center text-gray-600 text-sm">
        {getCycleIcon(task.cycle)}
        <span className="ml-2">{task.cycle}</span>
      </div>
    </div>
  );
};

// Task List Component
const TaskList = ({ onSelectTask }) => {
  const { filteredTasks, searchTerm, filterAssignee, filterCategory, filterCycle, showFavorites, isLoading } = React.useContext(ManualContext);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
        {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500 animate-fade-in">
        <p className="text-lg">
          {searchTerm || filterAssignee || filterCategory || filterCycle || showFavorites
            ? '검색 또는 필터링 조건에 맞는 업무가 없습니다.'
            : '등록된 업무가 없습니다.'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {filteredTasks.map(task => (
        <TaskCard key={task.id} task={task} onSelectTask={onSelectTask} />
      ))}
    </div>
  );
};

// Edit Team Overview Modal
const EditTeamOverviewModal = ({ initialContent, onClose, onSave }) => {
  const [editedOverview, setEditedOverview] = React.useState(initialContent); // title과 content를 모두 포함하도록 수정

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedOverview(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedOverview); // editedOverview 객체 전체를 전달
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto transform scale-95 opacity-0 animate-scale-in">
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">팀 개요 수정</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors duration-200" title="닫기">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="teamOverviewTitle" className="block text-sm font-medium text-gray-700 mb-1">제목</label>
            <input
              type="text"
              id="teamOverviewTitle"
              name="title"
              value={editedOverview.title}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-400 focus:border-pink-400 transition-all duration-200"
              required
            />
          </div>
          <div>
            <label htmlFor="teamOverviewContent" className="block text-sm font-medium text-gray-700 mb-1">내용</label>
            <textarea
              id="teamOverviewContent"
              name="content"
              value={editedOverview.content}
              onChange={handleChange}
              rows="5"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-400 focus:border-pink-400 transition-all duration-200"
              required
            ></textarea>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Announcement Form Modal
const AnnouncementFormModal = ({ initialAnnouncement, onClose }) => {
  const { addAnnouncement, updateAnnouncement, deleteAnnouncement } = React.useContext(ManualContext);
  const [announcement, setAnnouncement] = React.useState(initialAnnouncement || { title: '', content: '', date: new Date().toISOString().slice(0, 10) });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnnouncement(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (announcement.id) {
      updateAnnouncement(announcement);
    } else {
      addAnnouncement(announcement);
    }
    onClose();
  };

  const handleDelete = () => {
    if (announcement.id && window.confirm('정말로 이 공지를 삭제하시겠습니까?')) { // In a real app, use a custom modal for confirmation
      deleteAnnouncement(announcement.id);
      onClose();
    }
  };

  const modalTitle = initialAnnouncement ? '공지 수정' : '새 공지 작성';

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto transform scale-95 opacity-0 animate-scale-in">
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">{modalTitle}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors duration-200" title="닫기">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="announcementTitle" className="block text-sm font-medium text-gray-700 mb-1">제목</label>
            <input
              type="text"
              id="announcementTitle"
              name="title"
              value={announcement.title}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-400 focus:border-pink-400"
              required
            />
          </div>
          <div>
            <label htmlFor="announcementContent" className="block text-sm font-medium text-gray-700 mb-1">내용</label>
            <textarea
              id="announcementContent"
              name="content"
              value={announcement.content}
              onChange={handleChange}
              rows="3"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-400 focus:border-pink-400"
              required
            ></textarea>
          </div>
          <div>
            <label htmlFor="announcementDate" className="block text-sm font-medium text-gray-700 mb-1">날짜</label>
            <input
              type="date"
              id="announcementDate"
              name="date"
              value={announcement.date}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-400 focus:border-pink-400"
              required
            />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            {initialAnnouncement && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-5 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 shadow-md hover:shadow-lg flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-1" /> 삭제
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Quick Link Form Modal
const QuickLinkFormModal = ({ initialLink, onClose }) => {
  const { addQuickLink, updateQuickLink, deleteQuickLink } = React.useContext(ManualContext);
  const [link, setLink] = React.useState(initialLink || { name: '', url: '', description: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLink(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (link.id) {
      updateQuickLink(link);
    } else {
      addQuickLink(link);
    }
    onClose();
  };

  const handleDelete = () => {
    if (link.id && window.confirm('정말로 이 링크를 삭제하시겠습니까?')) { // In a real app, use a custom modal for confirmation
      deleteQuickLink(link.id);
      onClose();
    }
  };

  const modalTitle = initialLink ? '빠른 링크 수정' : '새 빠른 링크 추가';

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto transform scale-95 opacity-0 animate-scale-in">
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">{modalTitle}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors duration-200" title="닫기">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="linkName" className="block text-sm font-medium text-gray-700 mb-1">링크 이름</label>
            <input
              type="text"
              id="linkName"
              name="name"
              value={link.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-400 focus:border-pink-400"
              required
            />
          </div>
          <div>
            <label htmlFor="linkUrl" className="block text-sm font-medium text-gray-700 mb-1">URL</label>
            <input
              type="url"
              id="linkUrl"
              name="url"
              value={link.url}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-400 focus:border-pink-400"
              required
            />
          </div>
          <div>
            <label htmlFor="linkDescription" className="block text-sm font-medium text-gray-700 mb-1">설명 (선택 사항)</label>
            <input
              type="text"
              id="linkDescription"
              name="description"
              value={link.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-400 focus:border-pink-400"
            />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            {initialLink && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-5 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 shadow-md hover:shadow-lg flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-1" /> 삭제
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// Dashboard Page Component
const DashboardPage = ({ onSelectTask, onFilterChange, onNavigate }) => {
  const { teamMembers, teamOverview, updateTeamOverview, announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement, quickLinks, addQuickLink, updateQuickLink, deleteQuickLink, isLoading } = React.useContext(ManualContext);

  const [showEditTeamOverviewModal, setShowEditTeamOverviewModal] = React.useState(false);
  const [showAnnouncementFormModal, setShowAnnouncementFormModal] = React.useState(false);
  const [announcementToEdit, setAnnouncementToEdit] = React.useState(null);
  const [showQuickLinkFormModal, setShowQuickLinkFormModal] = React.useState(false);
  const [quickLinkToEdit, setQuickLinkToEdit] = React.useState(null);

  const handleOpenEditTeamOverview = () => setShowEditTeamOverviewModal(true);
  const handleCloseEditTeamOverview = () => setShowEditTeamOverviewModal(false);
  const handleSaveTeamOverview = (updatedContent) => {
    updateTeamOverview(updatedContent);
    handleCloseEditTeamOverview();
  };

  const handleOpenCreateAnnouncement = () => {
    setAnnouncementToEdit(null);
    setShowAnnouncementFormModal(true);
  };
  const handleOpenEditAnnouncement = (ann) => {
    setAnnouncementToEdit(ann);
    setShowAnnouncementFormModal(true);
  };
  const handleCloseAnnouncementForm = () => {
    setShowAnnouncementFormModal(false);
    setAnnouncementToEdit(null);
  };

  const handleOpenCreateQuickLink = () => {
    setQuickLinkToEdit(null);
    setShowQuickLinkFormModal(true);
  };
  const handleOpenEditQuickLink = (link) => {
    setQuickLinkToEdit(link);
    setShowQuickLinkFormModal(true);
  };
  const handleCloseQuickLinkForm = () => {
    setShowQuickLinkFormModal(false);
    setQuickLinkToEdit(null);
  };


  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen rounded-lg animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-1/4 mb-6"></div> {/* Title skeleton */}
        <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
        <div>
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen rounded-lg animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">메인 대시보드</h2>

      {/* 상담지원팀 개요 */}
      <section className="mb-8 p-6 bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-semibold text-gray-800 flex items-center"><Users className="w-6 h-6 mr-2 text-indigo-600" /> {teamOverview.title}</h3>
          <button
            onClick={handleOpenEditTeamOverview}
            className="p-2 rounded-full text-gray-400 hover:text-indigo-500 transition-colors duration-200 transform hover:scale-110"
            title="팀 개요 수정"
          >
            <Edit className="w-5 h-5" />
          </button>
        </div>
        <p className="text-gray-700 leading-relaxed">
          {teamOverview.content}
        </p>
      </section>

      {/* 담당자별 업무 카드 */}
      <section className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center"><User className="w-6 h-6 mr-2 text-indigo-600" /> 담당자별 업무 카드</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map(member => (
            <div
              key={member.name}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:scale-[1.01]"
              onClick={() => {
                // setFilterAssignee(member.name); // 필터링은 Sidebar에서 담당
                onNavigate('all-tasks'); // 전체 업무 페이지로 이동
              }}
              role="button"
              tabIndex="0"
              aria-label={`${member.name}의 업무 보기`}
              title={`${member.name}의 업무 보기`}
            >
              <h4 className="text-xl font-semibold text-indigo-700 mb-2">{member.name}</h4>
              <p className="text-gray-700 text-sm">{member.roles}</p>
              <button
                className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center transition-colors duration-200"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click from triggering
                  // setFilterAssignee(member.name); // 필터링은 Sidebar에서 담당
                  onNavigate('all-tasks'); // 전체 업무 페이지로 이동
                }}
                title={`${member.name}의 상세 업무 보기`}
              >
                업무 상세 보기 <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 공지사항 섹션 */}
      <section className="mb-8 p-6 bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-semibold text-gray-800 flex items-center"><BellRing className="w-6 h-6 mr-2 text-indigo-600" /> 공지사항</h3>
          <button
            onClick={handleOpenCreateAnnouncement}
            className="px-3 py-1 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-all duration-300 text-sm flex items-center shadow-md hover:shadow-lg"
            title="새 공지 작성"
          >
            <PlusCircle className="w-4 h-4 mr-1" /> 새 공지
          </button>
        </div>
        {announcements.length > 0 ? (
          <ul className="space-y-3">
            {announcements.slice(0, 3).map(ann => ( // 최신 3개만 표시
              <li key={ann.id} className="flex justify-between items-start bg-gray-50 p-3 rounded-md border border-gray-100 shadow-sm animate-fade-in-up">
                <div>
                  <h4 className="font-semibold text-gray-800 truncate">{ann.title}</h4>
                  <p className="text-gray-600 text-sm truncate">{ann.content}</p>
                  <span className="text-gray-500 text-xs">{ann.date}</span>
                </div>
                <div className="flex space-x-2 ml-4 flex-shrink-0">
                  <button
                    onClick={() => handleOpenEditAnnouncement(ann)}
                    className="p-2 rounded-full text-gray-400 hover:text-indigo-500 transition-colors duration-200"
                    title="공지 수정"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteAnnouncement(ann.id)}
                    className="p-2 rounded-full text-gray-400 hover:text-red-500 transition-colors duration-200"
                    title="공지 삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">등록된 공지사항이 없습니다.</p>
        )}
        {announcements.length > 3 && ( // 3개 초과 시 '더보기' 버튼 표시
          <div className="text-center mt-4">
            <button
              onClick={() => onNavigate('announcements')}
              className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-all duration-300 text-sm shadow-md hover:shadow-lg"
              title="전체 공지사항 보기"
            >
              더보기 <ChevronRight className="inline-block w-4 h-4 ml-1" />
            </button>
          </div>
        )}
      </section>

      {/* 빠른 링크 섹션 */}
      <section className="p-6 bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-semibold text-gray-800 flex items-center"><Link className="w-6 h-6 mr-2 text-indigo-600" /> 빠른 링크</h3>
          <button
            onClick={handleOpenCreateQuickLink}
            className="px-3 py-1 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-all duration-300 text-sm flex items-center shadow-md hover:shadow-lg"
            title="새 빠른 링크 추가"
          >
            <PlusCircle className="w-4 h-4 mr-1" /> 새 링크
          </button>
        </div>
        {quickLinks.length > 0 ? (
          <ul className="space-y-3">
            {quickLinks.map(link => (
              <li key={link.id} className="flex justify-between items-start bg-gray-50 p-3 rounded-md border border-gray-100 shadow-sm animate-fade-in-up">
                <div>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-indigo-700 hover:underline truncate block" title={link.name}>
                    {link.name}
                  </a>
                  <p className="text-gray-600 text-sm truncate">{link.description || '설명 없음'}</p>
                </div>
                <div className="flex space-x-2 ml-4 flex-shrink-0">
                  <button
                    onClick={() => handleOpenEditQuickLink(link)}
                    className="text-gray-400 hover:text-indigo-500 transition-colors duration-200"
                    title="링크 수정"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteQuickLink(link.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                    title="링크 삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">등록된 빠른 링크가 없습니다.</p>
        )}
      </section>

      {showEditTeamOverviewModal && (
        <EditTeamOverviewModal
          initialContent={teamOverview}
          onClose={handleCloseEditTeamOverview}
          onSave={handleSaveTeamOverview}
        />
      )}
      {showAnnouncementFormModal && (
        <AnnouncementFormModal
          initialAnnouncement={announcementToEdit}
          onClose={handleCloseAnnouncementForm}
        />
      )}
      {showQuickLinkFormModal && (
        <QuickLinkFormModal
          initialLink={quickLinkToEdit}
          onClose={handleCloseQuickLinkForm}
        />
      )}
    </div>
  );
};

// Task Widget Component for Dashboard (Removed from DashboardPage, kept for reference if needed elsewhere)
const TaskWidget = ({ title, tasks, icon, onViewAll }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xl font-semibold text-gray-800 flex items-center">
          {icon}
          <span className="ml-2">{title}</span>
        </h4>
        <button
          onClick={onViewAll}
          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center transition-colors duration-200"
          title={`${title} 전체 보기`}
        >
          전체 보기 <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
      {tasks.length > 0 ? (
        <ul className="space-y-2">
          {tasks.slice(0, 5).map(task => ( // Show top 5 tasks
            <li key={task.id} className="text-gray-700 text-sm flex items-center animate-fade-in-up">
              <ChevronRight className="w-4 h-4 mr-2 text-gray-400" /> {task.name} ({task.assignee})
            </li>
          ))}
          {tasks.length > 5 && (
            <li className="text-gray-500 text-sm italic">...더 많은 업무가 있습니다.</li>
          )}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm">해당하는 업무가 없습니다.</p>
      )}
    </div>
  );
};

// FilterChips Component - New component to display active filters
const FilterChips = () => {
  const {
    searchTerm, setSearchTerm,
    filterCycle, setFilterCycle,
    filterAssignee, setFilterAssignee,
    filterCategory, setFilterCategory,
    showFavorites, setShowFavorites
  } = React.useContext(ManualContext);

  const activeFilters = React.useMemo(() => {
    const filters = [];
    if (searchTerm) filters.push({ type: '검색', value: searchTerm, clear: () => setSearchTerm('') });
    if (filterAssignee) filters.push({ type: '담당자', value: filterAssignee, clear: () => setFilterAssignee('') });
    if (filterCategory) filters.push({ type: '카테고리', value: filterCategory, clear: () => setFilterCategory('') });
    if (filterCycle) filters.push({ type: '주기', value: filterCycle, clear: () => setFilterCycle('') });
    if (showFavorites) filters.push({ type: '즐겨찾기', value: '활성화', clear: () => setShowFavorites(false) });
    return filters;
  }, [searchTerm, filterAssignee, filterCategory, filterCycle, showFavorites, setSearchTerm, setFilterAssignee, setFilterCategory, setFilterCycle, setShowFavorites]);

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 p-4 bg-gray-100 rounded-lg shadow-inner mb-4 animate-fade-in">
      <span className="text-gray-700 font-semibold text-sm mr-2">활성 필터:</span>
      {activeFilters.map((filter, index) => (
        <div
          key={index}
          className="flex items-center bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm transition-all duration-200 hover:bg-indigo-200 cursor-pointer"
          onClick={filter.clear} // Click to clear filter
          title={`${filter.type}: ${filter.value} (클릭하여 해제)`}
        >
          {filter.type}: {filter.value}
          <button
            onClick={filter.clear}
            className="ml-2 text-indigo-500 hover:text-indigo-700 transition-colors duration-200"
            title={`${filter.type} 필터 해제`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};


// TaskFormModal Component
const TaskFormModal = ({ task: initialTask, onClose }) => {
  const { teamMembers, taskCategories, taskCycles: baseTaskCycles } = React.useContext(ManualContext);
  const { addTask, updateTask } = React.useContext(ManualContext);
  const [task, setTask] = React.useState(initialTask || {
    name: '',
    category: '',
    assignee: '',
    processSteps: [''],
    cycle: '일일',
    deliverables: [''],
    fileLink: '',
    fileLocation: '',
    notes: '',
    isFavorite: false,
  });
  const [selectedBaseCycle, setSelectedBaseCycle] = React.useState(task.cycle.split(' ')[0]);
  const [cycleFrequency, setCycleFrequency] = React.useState(() => {
    const parts = task.cycle.split(' ');
    return parts.length > 1 && parts[1].endsWith('회') ? parts[1].replace('회', '') : '';
  });

  React.useEffect(() => {
    setTask(initialTask || {
      name: '',
      category: '',
      assignee: '',
      processSteps: [''],
      cycle: '일일',
      deliverables: [''],
      fileLink: '',
      fileLocation: '',
      notes: '',
      isFavorite: false,
    });
    const parts = (initialTask?.cycle || '일일').split(' ');
    setSelectedBaseCycle(parts[0]);
    setCycleFrequency(parts.length > 1 && parts[1].endsWith('회') ? parts[1].replace('회', '') : '');
  }, [initialTask]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask(prev => ({ ...prev, [name]: value }));
  };

  const handleProcessStepsChange = (e, index) => {
    const newSteps = [...task.processSteps];
    newSteps[index] = e.target.value;
    setTask(prev => ({ ...prev, processSteps: newSteps }));
  };

  const addProcessStep = () => {
    setTask(prev => ({ ...prev, processSteps: [...prev.processSteps, ''] }));
  };

  const removeProcessStep = (index) => {
    const newSteps = task.processSteps.filter((_, i) => i !== index);
    setTask(prev => ({ ...prev, processSteps: newSteps }));
  };

  const handleDeliverablesChange = (e) => {
    setTask(prev => ({ ...prev, deliverables: e.target.value.split(',').map(item => item.trim()) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let finalCycle = selectedBaseCycle;
    if (selectedBaseCycle !== '발생시' && cycleFrequency) {
      finalCycle = `${selectedBaseCycle} ${cycleFrequency}회`;
    } else if (selectedBaseCycle === '일일' && cycleFrequency) {
      finalCycle = `${selectedBaseCycle} ${cycleFrequency}회`;
    }

    if (task.id) {
      updateTask({ ...task, cycle: finalCycle });
    } else {
      addTask({ ...task, cycle: finalCycle });
    }
    onClose();
  };

  const modalTitle = initialTask ? `업무 수정: ${initialTask.name}` : '새 업무 추가';

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform scale-95 opacity-0 animate-scale-in">
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">{modalTitle}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors duration-200" title="닫기">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">업무명</label>
            <input
              type="text"
              id="name"
              name="name"
              value={task.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-400 focus:border-pink-400 transition-all duration-200"
              required
            />
          </div>
          <div>
            <label htmlFor="assignee" className="block text-sm font-medium text-gray-700 mb-1">담당자</label>
            <select
              id="assignee"
              name="assignee"
              value={task.assignee}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-400 focus:border-pink-400 transition-all duration-200"
              required
            >
              <option value="">담당자 선택</option>
              {teamMembers.map(member => (
                <option key={member.name} value={member.name}>{member.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">업무 카테고리</label>
            <select
              id="category"
              name="category"
              value={task.category}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-400 focus:border-pink-400 transition-all duration-200"
              required
            >
              <option value="">카테고리 선택</option>
              {actualTaskCategories.map(category => ( // 실제 업무 카테고리 목록 사용
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          {/* 수행 주기 입력 필드 개선 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">수행 주기</label>
            <div className="flex space-x-2">
              <select
                value={selectedBaseCycle}
                onChange={(e) => {
                  setSelectedBaseCycle(e.target.value);
                  if (e.target.value === '발생시') {
                    setCycleFrequency('');
                  }
                }}
                className="w-1/2 p-2 border border-gray-300 rounded-md focus:ring-pink-400 focus:border-pink-400 transition-all duration-200"
                required
              >
                {baseTaskCycles.map(cycle => (
                  <option key={cycle} value={cycle}>{cycle}</option>
                ))}
              </select>
              {(selectedBaseCycle !== '발생시') && (
                <div className="flex items-center w-1/2">
                  <input
                    type="number"
                    min="1"
                    value={cycleFrequency}
                    onChange={(e) => setCycleFrequency(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-400 focus:border-pink-400 transition-all duration-200"
                    placeholder="횟수"
                    required={selectedBaseCycle !== '일일'}
                  />
                  <span className="ml-2 text-gray-700">회</span>
                </div>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="deliverables" className="block text-sm font-medium text-gray-700 mb-1">수행 결과물 (쉼표로 구분)</label>
            <input
              type="text"
              id="deliverables"
              name="deliverables"
              value={task.deliverables.join(', ')}
              onChange={handleDeliverablesChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-400 focus:border-pink-400 transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">프로세스 단계</label>
            {task.processSteps.map((step, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={step}
                  onChange={(e) => handleProcessStepsChange(e, index)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-400 focus:border-pink-400 transition-all duration-200"
                  required={index === 0}
                />
                {task.processSteps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProcessStep(index)}
                    className="p-2 text-red-500 hover:text-red-700 transition-colors duration-200"
                    title="단계 삭제"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addProcessStep}
              className="mt-2 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 text-sm transition-colors duration-200"
            >
              단계 추가
            </button>
          </div>
          <div>
            <label htmlFor="fileLink" className="block text-sm font-medium text-gray-700 mb-1">실행 매뉴얼 파일 링크</label>
            <input
              type="text"
              id="fileLink"
              name="fileLink"
              value={task.fileLink}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-400 focus:border-pink-400 transition-all duration-200"
            />
          </div>
          <div>
            <label htmlFor="fileLocation" className="block text-sm font-medium text-gray-700 mb-1">파일 위치 정보</label>
            <input
              type="text"
              id="fileLocation"
              name="fileLocation"
              value={task.fileLocation}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-400 focus:border-pink-400 transition-all duration-200"
            />
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">비고 사항</label>
            <textarea
              id="notes"
              name="notes"
              value={task.notes}
              onChange={handleChange}
              rows="3"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-400 focus:border-pink-400 transition-all duration-200"
            ></textarea>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Task Detail Page Component
const TaskDetailPage = ({ task, onBack, onPrint, onOpenEditTask }) => {
  const { toggleFavorite } = React.useContext(ManualContext);

  if (!task) {
    return (
      <div className="p-8 text-center text-gray-500 animate-fade-in">
        <p className="text-lg">업무 정보를 불러올 수 없습니다.</p>
        <button
          onClick={onBack}
          className="mt-4 px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200"
          title="목록으로 돌아가기"
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  const getCycleDisplay = (cycle) => {
    const baseCycle = cycle.split(' ')[0];
    switch (baseCycle) {
      case '일일': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800"><CalendarClock className="w-3 h-3 mr-1" /> {cycle}</span>;
      case '주간': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800"><CalendarDays className="w-3 h-3 mr-1" /> {cycle}</span>;
      case '월간': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800"><Calendar className="w-3 h-3 mr-1" /> {cycle}</span>;
      case '년간': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800"><CalendarCheck className="w-3 h-3 mr-1" /> {cycle}</span>;
      case '발생시': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800"><Clock className="w-3 h-3 mr-1" /> {cycle}</span>;
      default: return null;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen rounded-lg animate-fade-in">
      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 transition-all duration-300 hover:shadow-lg">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-3xl font-bold text-indigo-700">{task.name}</h2>
          <div className="flex space-x-3">
            <button
              onClick={() => toggleFavorite(task.id)}
              className="p-2 rounded-full text-gray-400 hover:text-yellow-500 transition-colors duration-200 transform hover:scale-110"
              aria-label="즐겨찾기 토글"
              title={task.isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
            >
              <Star className={`w-7 h-7 ${task.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
            </button>
            <button
              onClick={() => onOpenEditTask(task)} // Call onOpenEditTask
              className="p-2 rounded-full text-gray-400 hover:text-indigo-500 transition-colors duration-200 transform hover:scale-110"
              aria-label="업무 수정"
              title="수정"
            >
              <Edit className="w-7 h-7" />
            </button>
            <button
              onClick={() => onPrint(task)}
              className="p-2 rounded-full text-gray-400 hover:text-indigo-500 transition-colors duration-200 transform hover:scale-110"
              aria-label="인쇄 모드"
              title="인쇄"
            >
              <Printer className="w-7 h-7" />
            </button>
            <button
              onClick={onBack}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200 text-sm font-medium"
              title="목록으로 돌아가기"
            >
              목록
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-8 text-gray-700">
          <div className="flex items-center">
            <User className="w-5 h-5 mr-3 text-indigo-500" />
            <span className="font-semibold">담당자:</span> <span className="ml-2">{task.assignee}</span>
          </div>
          <div className="flex items-center">
            <LayoutDashboard className="w-5 h-5 mr-3 text-indigo-500" />
            <span className="font-semibold">업무 카테고리:</span> <span className="ml-2">{task.category}</span>
          </div>
          <div className="flex items-center">
            <CalendarDays className="w-5 h-5 mr-3 text-indigo-500" />
            <span className="font-semibold">수행 주기:</span> <span className="ml-2">{getCycleDisplay(task.cycle)}</span>
          </div>
          <div className="flex items-center">
            <FileText className="w-5 h-5 mr-3 text-indigo-500" />
            <span className="font-semibold">수행 결과물:</span> <span className="ml-2">{task.deliverables.join(', ')}</span>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center"><ListFilter className="w-5 h-5 mr-2 text-indigo-600" /> 프로세스 단계</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            {task.processSteps.map((step, index) => (
              <li key={index} className="bg-gray-50 p-3 rounded-md border border-gray-100 shadow-sm animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
                <span className="font-medium text-indigo-700 mr-2">{index + 1}.</span> {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-8 text-gray-700">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center"><HardDrive className="w-5 h-5 mr-2 text-indigo-600" /> 파일 정보</h3>
            <p className="mb-2">
              <span className="font-semibold">실행 매뉴얼 파일 링크:</span>{' '}
              <a href={task.fileLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline transition-colors duration-200" title="실행 매뉴얼 다운로드">
                다운로드 <ChevronRight className="inline-block w-4 h-4 ml-1" />
              </a>
            </p>
            <p>
              <span className="font-semibold">파일 위치 정보:</span> <span className="ml-2">{task.fileLocation}</span>
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center"><Info className="w-5 h-5 mr-2 text-indigo-600" /> 비고 사항</h3>
            <p className="bg-indigo-50 p-3 rounded-md border border-indigo-100 text-indigo-800 italic">
              {task.notes || '특이 사항 없음'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Print Page Component
const PrintPage = ({ task, onBack }) => {
  useEffect(() => {
    window.print();
  }, []);

  if (!task) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p className="text-lg">인쇄할 업무 정보를 불러올 수 없습니다.</p>
        <button
          onClick={onBack}
          className="mt-4 px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200"
          title="목록으로 돌아가기"
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  const getCycleDisplay = (cycle) => {
    // For print, just display the full cycle string
    return <span className="inline-flex items-center text-xs font-medium">{cycle}</span>;
  };

  return (
    <div className="p-8 bg-white print-page">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center">{task.name}</h1>

      <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-8 text-gray-800 text-sm">
        <div className="flex items-center">
          <span className="font-semibold">담당자:</span> <span className="ml-2">{task.assignee}</span>
        </div>
        <div className="flex items-center">
          <span className="font-semibold">업무 카테고리:</span> <span className="ml-2">{task.category}</span>
        </div>
        <div className="flex items-center">
          <span className="font-semibold">수행 주기:</span> <span className="ml-2">{getCycleDisplay(task.cycle)}</span>
        </div>
        <div className="flex items-center">
          <span className="font-semibold">수행 결과물:</span> <span className="ml-2">{task.deliverables.join(', ')}</span>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">프로세스 단계</h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm">
          {task.processSteps.map((step, index) => (
            <li key={index} className="p-2 border-b border-gray-100">
              <span className="font-medium text-indigo-700 mr-2">{index + 1}.</span> {step}
            </li>
          ))}
        </ol>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-8 text-gray-700">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">파일 정보</h3>
          <p className="mb-2">
            <span className="font-semibold">실행 매뉴얼 파일 링크:</span>{' '}
            <a href={task.fileLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
              다운로드
            </a>
          </p>
          <p>
            <span className="font-semibold">파일 위치 정보:</span> <span className="ml-2">{task.fileLocation}</span>
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">비고 사항</h3>
          <p className="italic">
            {task.notes || '특이 사항 없음'}
          </p>
        </div>
      </div>

      <div className="text-center mt-10">
        <button
          onClick={onBack}
          className="px-6 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors duration-200 no-print"
          title="인쇄 모드 종료"
        >
          인쇄 모드 종료
        </button>
      </div>
    </div>
  );
};


// Main App Component
const App = () => {
  const [currentPage, setCurrentPage] = useState('dashboard'); // 'dashboard', 'all-tasks', 'detail', 'announcements', 'print'
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskFormModal, setShowTaskFormModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null); // null for create, task object for edit

  const handleNavigate = (page, item = null) => { // item 인자를 task 외에 다른 데이터도 받을 수 있도록 일반화
    setCurrentPage(page);
    if (page === 'detail') {
      setSelectedTask(item);
    } else {
      setSelectedTask(null); // 다른 페이지로 이동 시 선택된 업무 초기화
    }
  };

  const handleSelectTask = (task) => {
    handleNavigate('detail', task);
  };

  const handlePrintTask = (task) => {
    handleNavigate('print', task);
  };

  const handleBackToList = () => {
    setCurrentPage('all-tasks'); // 상세 페이지에서 돌아올 때 전체 업무 목록으로
    setSelectedTask(null);
  };

  const handleBackFromPrint = () => {
    // 인쇄 모드에서 돌아올 때, 이전에 상세 페이지였다면 상세 페이지로, 아니면 목록으로
    if (selectedTask) {
      setCurrentPage('detail');
    } else {
      setCurrentPage('all-tasks');
    }
  };

  const handleOpenCreateTask = () => {
    setTaskToEdit(null); // Indicate creation mode
    setShowTaskFormModal(true);
  };

  const handleOpenEditTask = (task) => {
    setTaskToEdit(task); // Pass the task to be edited
    setShowTaskFormModal(true);
  };

  const handleCloseTaskFormModal = () => {
    setShowTaskFormModal(false);
    setTaskToEdit(null);
  };

  return (
    <ManualProvider>
      <div className="min-h-screen bg-gray-100 font-inter antialiased flex flex-col">
        <Header
          onSearchChange={() => {}}
          onNavigate={handleNavigate}
          currentPage={currentPage}
          onOpenCreateTask={handleOpenCreateTask} // Pass new prop
        />
        <div className="flex flex-1 flex-col sm:flex-row p-4 gap-4">
          <Sidebar onNavigate={handleNavigate} currentPage={currentPage} />
          <main className="flex-1 overflow-auto">
            {/* 활성 필터 칩 표시 - 'all-tasks' 페이지에서만 표시 */}
            {currentPage === 'all-tasks' && <FilterChips />}

            {currentPage === 'dashboard' && (
              <DashboardPage onSelectTask={handleSelectTask} onNavigate={handleNavigate} />
            )}
            {currentPage === 'all-tasks' && (
              <TaskList onSelectTask={handleSelectTask} />
            )}
            {currentPage === 'detail' && selectedTask && (
              <TaskDetailPage
                task={selectedTask}
                onBack={handleBackToList}
                onPrint={handlePrintTask}
                onOpenEditTask={handleOpenEditTask} // Pass new prop
              />
            )}
            {currentPage === 'announcements' && (
              <AnnouncementsPage onBack={() => handleNavigate('dashboard')} />
            )}
            {currentPage === 'print' && selectedTask && (
              <PrintPage task={selectedTask} onBack={handleBackFromPrint} />
            )}
          </main>
        </div>

        {showTaskFormModal && (
          <TaskFormModal
            task={taskToEdit} // Pass null for create, task object for edit
            onClose={handleCloseTaskFormModal}
            // onSave prop removed as saving is handled internally by TaskFormModal
          />
        )}
      </div>
    </ManualProvider>
  );
};

// Render the App component into the 'root' div
const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<App />);
}
