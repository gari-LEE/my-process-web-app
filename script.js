import React, { useState, useEffect, createContext, useContext, useMemo, useCallback } from 'react';
import { Search, Filter, Star, Printer, ChevronRight, ChevronDown, Calendar, Clock, User, HardDrive, FileText, Info, Home, ListFilter, Bookmark, Users, LayoutDashboard, CalendarDays, CalendarClock, CalendarCheck, Edit, X, PlusCircle, Link, BellRing, Trash2 } from 'lucide-react'; // 아이콘 라이브러리

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBdDXOEreJzytGMr8anZ9mg7I_kYrnx7gk",
  authDomain: "my-process-app.firebaseapp.com",
  projectId: "my-process-app",
  storageBucket: "my-process-app.firebasestorage.app",
  messagingSenderId: "1044912986098",
  appId: "1:1044912986098:web:8f3d4d14cd7a2564fefd6b"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}
const db = firebase.firestore();

// ManualContext 생성
const ManualContext = createContext();

// Mock Data - This will be replaced by Firestore data
// const mockTasks = [...]; // Removed

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
  const [tasks, setTasks] = useState([]); // Initial state is an empty array
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCycle, setFilterCycle] = useState('');
  const [filterAssignee, setFilterAssignee] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Dashboard specific states
  const [teamOverview, setTeamOverview] = useState(null); // Initialize as null
  const [announcements, setAnnouncements] = useState([]); // Initial state is an empty array
  const [quickLinks, setQuickLinks] = useState([]); // Initial state is an empty array

  // Fetch Tasks from Firestore
  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = db.collection('tasks').orderBy('name') // Example: order by name
      .onSnapshot(snapshot => {
        const fetchedTasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTasks(fetchedTasks);
        setIsLoading(false);
      }, error => {
        console.error("Error fetching tasks: ", error);
        setIsLoading(false);
      });
    return () => unsubscribe();
  }, []);

  // Fetch Announcements from Firestore
  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = db.collection('announcements').orderBy('date', 'desc') // Order by date descending
      .onSnapshot(snapshot => {
        const fetchedAnnouncements = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAnnouncements(fetchedAnnouncements);
        // Set loading to false only after all initial data is fetched if necessary
        // For simplicity, setting it here after announcements are fetched
        // Consider a more robust loading state management for multiple async operations
        setIsLoading(false); 
      }, error => {
        console.error("Error fetching announcements: ", error);
        setIsLoading(false);
      });
    return () => unsubscribe();
  }, []);

  // Fetch Quick Links from Firestore
  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = db.collection('quickLinks').orderBy('name') // Example: order by name
      .onSnapshot(snapshot => {
        const fetchedQuickLinks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setQuickLinks(fetchedQuickLinks);
        setIsLoading(false);
      }, error => {
        console.error("Error fetching quick links: ", error);
        setIsLoading(false);
      });
    return () => unsubscribe();
  }, []);

  // Fetch/Initialize Team Overview from Firestore
  useEffect(() => {
    setIsLoading(true);
    const docRef = db.collection('dashboardContent').doc('teamOverview');
    const unsubscribe = docRef.onSnapshot(async (doc) => {
      if (doc.exists) {
        setTeamOverview({ id: doc.id, ...doc.data() });
      } else {
        // Document doesn't exist, create a default one
        const defaultOverview = {
          title: '상담지원팀 개요',
          content: '상담지원팀은 고객 소통 최전선에서 고객 만족을 위한 다양한 업무를 수행합니다. 본 매뉴얼은 팀원들이 업무를 효율적으로 수행하고, 필요한 정보를 신속하게 찾을 수 있도록 돕습니다.'
        };
        try {
          await docRef.set(defaultOverview);
          setTeamOverview({ id: 'teamOverview', ...defaultOverview }); // Set with a placeholder ID or fetch again
          console.log("Default team overview created.");
        } catch (error) {
          console.error("Error creating default team overview: ", error);
        }
      }
      setIsLoading(false);
    }, error => {
      console.error("Error fetching team overview: ", error);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 즐겨찾기 토글 함수 (Firestore)
  const toggleFavorite = useCallback(async (taskId) => {
    const taskRef = db.collection('tasks').doc(taskId);
    try {
      const taskDoc = await taskRef.get();
      if (taskDoc.exists) {
        await taskRef.update({ isFavorite: !taskDoc.data().isFavorite });
      }
    } catch (error) {
      console.error("Error toggling favorite: ", error);
    }
  }, []);

  // 업무 수정 함수 (Firestore)
  const updateTask = useCallback(async (updatedTask) => {
    const { id, ...taskData } = updatedTask;
    try {
      await db.collection('tasks').doc(id).update(taskData);
    } catch (error) {
      console.error("Error updating task: ", error);
    }
  }, []);

  // 새 업무 추가 함수 (Firestore)
  const addTask = useCallback(async (newTaskData) => {
    try {
      // Firestore will auto-generate an ID if you don't specify one
      await db.collection('tasks').add({ ...newTaskData, isFavorite: false });
    } catch (error) {
      console.error("Error adding task: ", error);
    }
  }, []);

  // Dashboard specific update functions (Firestore)
  const updateTeamOverview = useCallback(async (newOverview) => {
    // Assuming newOverview has an id if it was fetched, otherwise it's an update to the single doc
    const docRef = db.collection('dashboardContent').doc('teamOverview');
    try {
        // Remove id from the object to be saved if it exists to avoid saving it in the document fields
        const { id, ...overviewData } = newOverview;
        await docRef.set(overviewData, { merge: true }); // Use set with merge to create or update
    } catch (error) {
        console.error("Error updating team overview: ", error);
    }
  }, []);

  const addAnnouncement = useCallback(async (newAnn) => {
    try {
      await db.collection('announcements').add(newAnn);
    } catch (error) {
      console.error("Error adding announcement: ", error);
    }
  }, []);

  const updateAnnouncement = useCallback(async (updatedAnn) => {
    const { id, ...annData } = updatedAnn;
    try {
      await db.collection('announcements').doc(id).update(annData);
    } catch (error) {
      console.error("Error updating announcement: ", error);
    }
  }, []);

  const deleteAnnouncement = useCallback(async (id) => {
    try {
      await db.collection('announcements').doc(id).delete();
    } catch (error) {
      console.error("Error deleting announcement: ", error);
    }
  }, []);

  const addQuickLink = useCallback(async (newLink) => {
    try {
      await db.collection('quickLinks').add(newLink);
    } catch (error) {
      console.error("Error adding quick link: ", error);
    }
  }, []);

  const updateQuickLink = useCallback(async (updatedLink) => {
    const { id, ...linkData } = updatedLink;
    try {
      await db.collection('quickLinks').doc(id).update(linkData);
    } catch (error) {
      console.error("Error updating quick link: ", error);
    }
  }, []);

  const deleteQuickLink = useCallback(async (id) => {
    try {
      await db.collection('quickLinks').doc(id).delete();
    } catch (error) {
      console.error("Error deleting quick link: ", error);
    }
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = searchTerm === '' ||
        (task.name && task.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (task.assignee && task.assignee.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (task.category && task.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (task.processSteps && task.processSteps.some(step => step.toLowerCase().includes(searchTerm.toLowerCase())));

      const taskBaseCycle = task.cycle ? task.cycle.split(' ')[0] : '';
      const matchesCycle = filterCycle === '' || taskBaseCycle === filterCycle;

      const matchesAssignee = filterAssignee === '' || task.assignee === filterAssignee;
      const matchesCategory = filterCategory === '' || task.category === filterCategory;
      const matchesFavorite = !showFavorites || task.isFavorite;

      return matchesSearch && matchesCycle && matchesAssignee && matchesCategory && matchesFavorite;
    });
  }, [tasks, searchTerm, filterCycle, filterAssignee, filterCategory, showFavorites]);

  const contextValue = useMemo(() => ({
    tasks, // This will be updated by Firestore snapshots
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
    addTask,
    teamMembers,
    taskCategories: actualTaskCategories,
    taskCycles: baseTaskCycles,
    isLoading, 
    teamOverview, updateTeamOverview,
    announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement,
    quickLinks, addQuickLink, updateQuickLink, deleteQuickLink,
  }), [
    tasks, filteredTasks, searchTerm, filterCycle, filterAssignee, filterCategory, showFavorites,
    toggleFavorite, updateTask, addTask, isLoading,
    teamOverview, updateTeamOverview,
    announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement,
    quickLinks, addQuickLink, updateQuickLink, deleteQuickLink, teamMembers // Added teamMembers here as it's used in context but wasn't in deps
  ]);

  return (
    <ManualContext.Provider value={contextValue}>
      {children}
    </ManualContext.Provider>
  );
};

// Header Component
const Header = ({ onSearchChange, onNavigate, currentPage, onOpenCreateTask }) => {
  const [input, setInput] = useState('');
  const { searchTerm, setSearchTerm } = useContext(ManualContext);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(input);
    }, 300);

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
const Sidebar = ({ onNavigate, currentPage }) => { 
  const { teamMembers, taskCategories, taskCycles, setFilterAssignee, setFilterCategory, setFilterCycle, setShowFavorites, showFavorites, filterAssignee, filterCategory, filterCycle } = useContext(ManualContext);

  const handleClearFilters = () => {
    setFilterAssignee('');
    setFilterCategory('');
    setFilterCycle('');
    setShowFavorites(false);
  };

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
            {actualTaskCategories.map(category => (
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
  const { toggleFavorite } = useContext(ManualContext);

  const getCycleIcon = (cycle) => {
    const baseCycle = cycle ? cycle.split(' ')[0] : '';
    switch (baseCycle) {
      case '일일': return <CalendarClock className="w-4 h-4 text-orange-400" />;
      case '주간': return <CalendarDays className="w-4 h-4 text-orange-400" />;
      case '월간': return <Calendar className="w-4 h-4 text-orange-400" />;
      case '년간': return <CalendarCheck className="w-4 h-4 text-orange-400" />;
      case '발생시': return <Clock className="w-4 h-4 text-orange-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />; // Default icon if cycle is undefined
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
      <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate">{task.name || '제목 없음'}</h3>
      <div className="flex items-center text-gray-600 text-sm mb-1 truncate">
        <User className="w-4 h-4 mr-2 text-indigo-500" />
        <span>{task.assignee || '담당자 미지정'}</span>
      </div>
      <div className="flex items-center text-gray-600 text-sm mb-1 truncate">
        <LayoutDashboard className="w-4 h-4 mr-2 text-indigo-500" />
        <span>{task.category || '카테고리 미지정'}</span>
      </div>
      <div className="flex items-center text-gray-600 text-sm">
        {getCycleIcon(task.cycle)}
        <span className="ml-2">{task.cycle || '주기 미지정'}</span>
      </div>
    </div>
  );
};

// Task List Component
const TaskList = ({ onSelectTask }) => {
  const { filteredTasks, searchTerm, filterAssignee, filterCategory, filterCycle, showFavorites, isLoading } = useContext(ManualContext);

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
            : '등록된 업무가 없습니다. 새 업무를 추가해보세요.'
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
  const [editedOverview, setEditedOverview] = useState(initialContent || { title: '', content: '' });

  useEffect(() => {
    if (initialContent) {
        setEditedOverview(initialContent);
    }
  }, [initialContent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedOverview(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedOverview);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
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
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-400 focus:border-pink-400"
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
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-400 focus:border-pink-400"
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
  const { addAnnouncement, updateAnnouncement, deleteAnnouncement } = useContext(ManualContext);
  const [announcement, setAnnouncement] = useState(initialAnnouncement || { title: '', content: '', date: new Date().toISOString().slice(0, 10) });

  useEffect(() => {
    if (initialAnnouncement) {
        setAnnouncement(initialAnnouncement);
    } else {
        setAnnouncement({ title: '', content: '', date: new Date().toISOString().slice(0, 10) });
    }
  }, [initialAnnouncement]);

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
    if (announcement.id && window.confirm('정말로 이 공지를 삭제하시겠습니까?')) {
      deleteAnnouncement(announcement.id);
      onClose();
    }
  };

  const modalTitle = announcement.id ? '공지 수정' : '새 공지 작성';

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
  const { addQuickLink, updateQuickLink, deleteQuickLink } = useContext(ManualContext);
  const [link, setLink] = useState(initialLink || { name: '', url: '', description: '' });

  useEffect(() => {
    if (initialLink) {
        setLink(initialLink);
    } else {
        setLink({ name: '', url: '', description: '' });
    }
  }, [initialLink]);

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
    if (link.id && window.confirm('정말로 이 링크를 삭제하시겠습니까?')) {
      deleteQuickLink(link.id);
      onClose();
    }
  };

  const modalTitle = link.id ? '빠른 링크 수정' : '새 빠른 링크 추가';

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

// AnnouncementsPage Component
const AnnouncementsPage = ({ onBack }) => {
  const { announcements, deleteAnnouncement, isLoading } = useContext(ManualContext);
  const [showAnnouncementFormModal, setShowAnnouncementFormModal] = useState(false);
  const [announcementToEdit, setAnnouncementToEdit] = useState(null);

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

  const handleDeleteAnnouncement = async (id) => {
      if (window.confirm('정말로 이 공지를 삭제하시겠습니까?')) {
          await deleteAnnouncement(id);
      }
  }

  if (isLoading && announcements.length === 0) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen rounded-lg animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-1/4 mb-6"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-md mb-4">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen rounded-lg animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">전체 공지사항</h2>
        <div className="flex space-x-3">
          <button
            onClick={handleOpenCreateAnnouncement}
            className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
            title="새 공지 작성"
          >
            <PlusCircle className="w-4 h-4 mr-1" /> 새 공지
          </button>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200 text-sm font-medium"
            title="대시보드로 돌아가기"
          >
            대시보드
          </button>
        </div>
      </div>

      {isLoading && announcements.length === 0 ? (
          <p className="text-gray-500 text-center text-lg mt-8">공지사항을 불러오는 중...</p>
      ) : announcements.length > 0 ? (
        <ul className="space-y-4">
          {announcements.map(ann => (
            <li key={ann.id} className="flex justify-between items-start bg-white p-4 rounded-lg shadow-md border border-gray-200 transition-all duration-300 hover:shadow-lg animate-fade-in-up">
              <div>
                <h3 className="font-semibold text-gray-800 text-lg truncate">{ann.title || '제목 없음'}</h3>
                <p className="text-gray-700 text-sm">{ann.content || '내용 없음'}</p>
                <span className="text-gray-500 text-xs mt-1 block">{ann.date ? new Date(ann.date.seconds ? ann.date.seconds * 1000 : ann.date).toLocaleDateString() : '날짜 없음'}</span>
              </div>
              <div className="flex space-x-2 ml-4 flex-shrink-0">
                <button
                  onClick={() => handleOpenEditAnnouncement(ann)}
                  className="p-2 rounded-full text-gray-400 hover:text-indigo-500 transition-colors duration-200"
                  title="공지 수정"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDeleteAnnouncement(ann.id)}
                  className="p-2 rounded-full text-gray-400 hover:text-red-500 transition-colors duration-200"
                  title="공지 삭제"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center text-lg mt-8">등록된 공지사항이 없습니다. 새 공지를 추가해보세요.</p>
      )}

      {showAnnouncementFormModal && (
        <AnnouncementFormModal
          initialAnnouncement={announcementToEdit}
          onClose={handleCloseAnnouncementForm}
        />
      )}
    </div>
  );
};

// DashboardPage, TaskDetailPage, PrintPage, FilterChips components
// These components will primarily consume data from the context.
// No direct Firestore calls are made within them, but they might trigger context functions (e.g., editing a task from TaskDetailPage)

const DashboardPage = ({ onSelectTask, onNavigate }) => {
    const { 
        teamOverview, updateTeamOverview, 
        announcements, 
        quickLinks, 
        isLoading, 
        tasks 
    } = useContext(ManualContext);

    const [showEditOverviewModal, setShowEditOverviewModal] = useState(false);
    const [showAnnouncementFormModal, setShowAnnouncementFormModal] = useState(false);
    const [announcementToEdit, setAnnouncementToEdit] = useState(null);

    const recentTasks = useMemo(() => {
        // Example: show 5 most recently modified or created tasks if timestamp available
        // For now, just takes the first 5 tasks if no specific timestamp logic
        return tasks.slice(0, 5);
    }, [tasks]);

    const upcomingSchedules = useMemo(() => {
        // Filter tasks that have a cycle and are not '발생시' or '일일' for a simple upcoming view
        // This is a placeholder. Real schedule logic would be more complex.
        return tasks.filter(t => t.cycle && !['발생시', '일일'].includes(t.cycle.split(' ')[0])).slice(0, 3);
    }, [tasks]);

    if (isLoading && !teamOverview && announcements.length === 0 && quickLinks.length === 0) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-1 animate-pulse">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md h-48"><div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div><div className="h-4 bg-gray-200 rounded w-full mb-2"></div><div className="h-4 bg-gray-200 rounded w-2/3"></div></div>
                <div className="bg-white p-6 rounded-lg shadow-md h-48"><div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div><div className="h-4 bg-gray-200 rounded w-full mb-1"></div><div className="h-4 bg-gray-200 rounded w-full mb-1"></div></div>
                <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md h-64"><div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div><div className="h-4 bg-gray-200 rounded w-full mb-2"></div><div className="h-4 bg-gray-200 rounded w-full mb-2"></div><div className="h-4 bg-gray-200 rounded w-3/4"></div></div>
            </div>
        );
    }

    const handleOpenEditAnnouncement = (ann) => {
        setAnnouncementToEdit(ann);
        setShowAnnouncementFormModal(true);
    };
    const handleOpenCreateAnnouncement = () => {
        setAnnouncementToEdit(null);
        setShowAnnouncementFormModal(true);
    };
    const handleCloseAnnouncementForm = () => {
        setShowAnnouncementFormModal(false);
        setAnnouncementToEdit(null);
    };

    const { deleteAnnouncement } = useContext(ManualContext); // For direct delete from dashboard
    const { deleteQuickLink } = useContext(ManualContext); // For direct delete from dashboard

    const handleDeleteAnnouncement = async (id) => {
        if (window.confirm('정말로 이 공지를 삭제하시겠습니까?')) {
            await deleteAnnouncement(id);
        }
    };

    return (
        <div className="p-1 space-y-6 animate-fade-in">
            {/* Team Overview Section */}
            <section className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                        <Info className="w-6 h-6 mr-2 text-indigo-600" /> {teamOverview?.title || '팀 개요'}
                    </h2>
                    <button 
                        onClick={() => setShowEditOverviewModal(true)} 
                        className="p-2 rounded-full text-gray-400 hover:text-indigo-500 hover:bg-indigo-100 transition-colors duration-200"
                        title="팀 개요 수정"
                    >
                        <Edit className="w-5 h-5" />
                    </button>
                </div>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{teamOverview?.content || '팀 개요 내용이 없습니다. 수정 버튼을 눌러 추가해주세요.'}</p>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Announcements Section */}
                <section className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                            <BellRing className="w-5 h-5 mr-2 text-pink-500" /> 최근 공지
                        </h2>
                        <div className="flex items-center space-x-2">
                            <button 
                                onClick={handleOpenCreateAnnouncement}
                                className="px-3 py-1 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors duration-200 text-xs font-medium shadow-sm flex items-center"
                                title="새 공지 작성"
                            >
                                <PlusCircle className="w-4 h-4 mr-1" /> 새 공지
                            </button>
                            <button 
                                onClick={() => onNavigate('announcements')}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200 text-sm font-medium"
                                title="모든 공지 보기"
                            >
                                전체 보기 <ChevronRight className="w-3 h-3 ml-1" />
                            </button>
                        </div>
                    </div>
                    {isLoading && announcements.length === 0 ? (
                        <p className="text-gray-500 text-sm">공지사항을 불러오는 중...</p>
                    ) : announcements.length > 0 ? (
                        <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
                            {announcements.slice(0, 3).map(ann => (
                                <li key={ann.id} className="p-3 bg-gray-50 rounded-md border border-gray-200 hover:border-gray-300 transition-colors duration-200">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-gray-700 text-sm truncate">{ann.title || '제목 없음'}</h3>
                                            <p className="text-gray-700 text-sm">{ann.content || '내용 없음'}</p>
                                            <span className="text-gray-500 text-xs mt-1 block">{ann.date ? new Date(ann.date.seconds ? ann.date.seconds * 1000 : ann.date).toLocaleDateString() : '날짜 없음'}</span>
                                        </div>
                                        <div className="flex space-x-2 ml-4 flex-shrink-0">
                                            <button onClick={() => handleOpenEditAnnouncement(ann)} className="p-2 rounded-full text-gray-400 hover:text-indigo-500" title="수정"><Edit className="w-4 h-5" /></button>
                                            <button onClick={() => handleDeleteAnnouncement(ann.id)} className="p-2 rounded-full text-gray-400 hover:text-red-500" title="삭제"><Trash2 className="w-4 h-5" /></button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-sm">등록된 공지사항이 없습니다.</p>
                    )}
                </section>

                {/* Quick Links Section */}
                <section className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                            <Link className="w-5 h-5 mr-2 text-green-500" /> 빠른 링크
                        </h2>
                        <button 
                            onClick={handleOpenCreateAnnouncement}
                            className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200 text-xs font-medium shadow-sm flex items-center"
                            title="새 빠른 링크 추가"
                        >
                           <PlusCircle className="w-4 h-4 mr-1" /> 새 빠른 링크 추가
                        </button>
                    </div>
                     {isLoading && quickLinks.length === 0 ? (
                        <p className="text-gray-500 text-sm">링크를 불러오는 중...</p>
                    ) : quickLinks.length > 0 ? (
                        <ul className="space-y-2.5 max-h-60 overflow-y-auto pr-2">
                            {quickLinks.map(link => (
                                <li key={link.id} className="p-2.5 bg-gray-50 rounded-md border border-gray-200 hover:border-gray-300 transition-colors duration-200">
                                    <div className="flex justify-between items-center">
                                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-indigo-600 hover:underline truncate" title={link.description || link.name}>
                                            {link.name || '이름 없음'}
                                        </a>
                                        <div className="flex space-x-1 flex-shrink-0 ml-2">
                                            <button onClick={() => handleOpenEditAnnouncement(link)} className="p-1 rounded-full text-gray-400 hover:text-indigo-500" title="수정"><Edit className="w-4 h-4" /></button>
                                            <button onClick={() => handleDeleteQuickLink(link.id)} className="p-1 rounded-full text-gray-400 hover:text-red-500" title="삭제"><Trash2 className="w-4 h-4"/></button>
                                        </div>
                                    </div>
                                    {link.description && <p className="text-xs text-gray-500 mt-0.5 truncate">{link.description}</p>}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-sm">등록된 빠른 링크가 없습니다.</p>
                    )}
                </section>
            </div>

            {/* Modals for Dashboard items */}
            {showEditOverviewModal && teamOverview && (
                <EditTeamOverviewModal 
                    initialContent={teamOverview} 
                    onClose={() => setShowEditOverviewModal(false)} 
                    onSave={updateTeamOverview} // updateTeamOverview from context
                />
            )}
            {showAnnouncementFormModal && (
                <AnnouncementFormModal 
                    initialAnnouncement={announcementToEdit} 
                    onClose={handleCloseAnnouncementForm} 
                    // add/update/delete are handled by context functions within the modal
                />
            )}
        </div>
    );
};

const TaskDetailPage = ({ task, onBack, onPrint, onOpenEditTask }) => {
    const { isLoading } = useContext(ManualContext); // Access isLoading if needed for specific loading states within detail page

    if (isLoading && !task) { // Show loading if task details are not yet available
        return <div className="p-6 bg-white rounded-lg shadow-md animate-pulse"><div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div><div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div><div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div><div className="mt-6 h-20 bg-gray-200 rounded w-full"></div></div>;
    }

    if (!task) {
        return <div className="p-6 text-center text-gray-500">업무 정보를 불러올 수 없습니다. 목록으로 돌아가 다시 시도해주세요.</div>;
    }

    const { name, category, assignee, processSteps, cycle, deliverables, fileLink, fileLocation, notes, isFavorite } = task;

    return (
        <div className="p-6 bg-white rounded-lg shadow-xl border border-gray-200 animate-fade-in print-page">
            <div className="flex justify-between items-center mb-6 no-print">
                <button 
                    onClick={onBack} 
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200 text-sm font-medium"
                    title="돌아가기"
                >
                    &larr; 돌아가기
                </button>
                <div className="flex space-x-3">
                    <button 
                        onClick={() => onOpenEditTask(task)} 
                        className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors duration-200 text-sm font-medium"
                        title="업무 수정"
                    >
                        <Edit className="w-4 h-4 mr-1" /> 수정
                    </button>
                    <button 
                        onClick={() => onPrint(task)} 
                        className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors duration-200 text-sm font-medium"
                        title="업무 인쇄"
                    >
                        <Printer className="w-4 h-4 mr-1" /> 인쇄
                    </button>
                </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-800 mb-2 print:text-2xl print:mb-4">{name || '제목 없음'}</h2>
            {isFavorite && <span className="inline-block bg-yellow-100 text-yellow-700 text-xs font-semibold px-2 py-0.5 rounded-full mb-4 no-print"><Star className="w-3 h-3 inline-block mr-1 fill-current"/> 즐겨찾기</span>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-6 print:grid-cols-2 print:gap-x-6 print:gap-y-3 print:mb-4">
                <div className="flex items-center text-gray-700">
                    <User className="w-5 h-5 mr-2.5 text-indigo-500 print:w-4 print:h-4 print:mr-2" />
                    <div>
                        <span className="text-xs text-gray-500 print:text-xs">담당자</span>
                        <p className="font-medium print:text-sm">{assignee || '미지정'}</p>
                    </div>
                </div>
                <div className="flex items-center text-gray-700">
                    <LayoutDashboard className="w-5 h-5 mr-2.5 text-indigo-500 print:w-4 print:h-4 print:mr-2" />
                    <div>
                        <span className="text-xs text-gray-500 print:text-xs">카테고리</span>
                        <p className="font-medium print:text-sm">{category || '미지정'}</p>
                    </div>
                </div>
                <div className="flex items-center text-gray-700">
                    <CalendarClock className="w-5 h-5 mr-2.5 text-indigo-500 print:w-4 print:h-4 print:mr-2" />
                    <div>
                        <span className="text-xs text-gray-500 print:text-xs">수행주기</span>
                        <p className="font-medium print:text-sm">{cycle || '미지정'}</p>
                    </div>
                </div>
            </div>

            <div className="mb-6 print:mb-4">
                <h3 className="text-xl font-semibold text-gray-700 mb-2 print:text-lg print:mb-1.5">업무 절차</h3>
                {processSteps && processSteps.length > 0 ? (
                    <ul className="list-decimal list-inside space-y-1.5 pl-1 text-gray-700 print:space-y-1 print:text-sm">
                        {processSteps.map((step, index) => <li key={index}>{step}</li>)}
                    </ul>
                ) : (
                    <p className="text-gray-500 text-sm">등록된 업무 절차가 없습니다.</p>
                )}
            </div>

            {notes && (
                <div className="mb-6 print:mb-4">
                    <h3 className="text-xl font-semibold text-gray-700 mb-2 print:text-lg print:mb-1.5">참고 사항</h3>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-md whitespace-pre-wrap print:text-sm print:bg-transparent print:p-0">{notes}</p>
                </div>
            )}
            <div className="print:mt-8 print:text-xs print:text-gray-500 print:text-center">
                 인쇄일: {new Date().toLocaleDateString()}
            </div>
        </div>
    );
};

const PrintPage = ({ task, onBack }) => {
    useEffect(() => {
        // Trigger print dialog once component mounts
        // Delay slightly to ensure content is rendered
        const timer = setTimeout(() => {
            window.print();
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    // TaskDetailPage is reused for print layout, with print-specific styles handling the look
    return (
        <div className="print-page-container">
             <button 
                onClick={onBack} 
                className="fixed top-4 left-4 px-3 py-1.5 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200 text-xs font-medium no-print z-50 shadow-lg"
                title="돌아가기"
            >
                &larr; 돌아가기
            </button>
            <TaskDetailPage task={task} onBack={() => {}} onPrint={() => {}} onOpenEditTask={() => {}} /> 
        </div>
    );
};

const FilterChips = () => {
    const { 
        searchTerm, setSearchTerm,
        filterCycle, setFilterCycle,
        filterAssignee, setFilterAssignee,
        filterCategory, setFilterCategory,
        showFavorites, setShowFavorites
    } = useContext(ManualContext);

    const activeFilters = [];
    if (searchTerm) activeFilters.push({ type: '검색어', value: searchTerm, clear: () => setSearchTerm('') });
    if (filterCycle) activeFilters.push({ type: '수행주기', value: filterCycle, clear: () => setFilterCycle('') });
    if (filterAssignee) activeFilters.push({ type: '담당자', value: filterAssignee, clear: () => setFilterAssignee('') });
    if (filterCategory) activeFilters.push({ type: '카테고리', value: filterCategory, clear: () => setFilterCategory('') });
    if (showFavorites) activeFilters.push({ type: '필터', value: '즐겨찾기만', clear: () => setShowFavorites(false) });

    if (activeFilters.length === 0) return null;

    return (
        <div className="p-4 bg-gray-100 rounded-t-lg mb-0 -mx-4 -mt-4 sm:mx-0 sm:mt-0 sm:mb-4 sm:rounded-lg no-print">
            <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm font-medium text-gray-700">활성 필터:</span>
                {activeFilters.map(filter => (
                    <div key={`${filter.type}-${filter.value}`} className="flex items-center bg-indigo-100 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                        <span>{filter.type}: {filter.value}</span>
                        <button onClick={filter.clear} className="ml-1.5 text-gray-400 hover:text-indigo-500">
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                ))}
                <button
                    onClick={() => {
                        setSearchTerm('');
                        setFilterCycle('');
                        setFilterAssignee('');
                        setFilterCategory('');
                        setShowFavorites(false);
                    }}
                    className="text-xs text-gray-500 hover:text-indigo-600 hover:underline ml-2"
                >
                    전체 필터 해제
                </button>
            </div>
        </div>
    );
}

// Task Form Modal (Create/Edit Task)
// This modal will use the context functions (addTask, updateTask) which now interact with Firestore.
const TaskFormModal = ({ task: initialTask, onClose }) => {
    const { addTask, updateTask, teamMembers, taskCategories, taskCycles } = useContext(ManualContext);
    const [task, setTask] = useState(initialTask || {
        name: '',
        category: taskCategories[0] || '',
        assignee: teamMembers[0]?.name || '',
        processSteps: [''],
        cycle: taskCycles[0] || '',
        deliverables: [''],
        fileLink: '',
        fileLocation: '',
        notes: '',
        isFavorite: false, // isFavorite is handled by toggleFavorite, not typically set in form
    });

    useEffect(() => {
        if (initialTask) {
            setTask({
                ...initialTask,
                processSteps: initialTask.processSteps?.length ? initialTask.processSteps : [''], // Ensure at least one step input
                deliverables: initialTask.deliverables?.length ? initialTask.deliverables : [''], // Ensure at least one deliverable input
            });
        } else {
            // Reset to default for new task
            setTask({
                name: '',
                category: taskCategories[0] || '',
                assignee: teamMembers[0]?.name || '',
                processSteps: [''],
                cycle: taskCycles[0] || '',
                deliverables: [''],
                fileLink: '',
                fileLocation: '',
                notes: '',
                isFavorite: false,
            });
        }
    }, [initialTask, teamMembers, taskCategories, taskCycles]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTask(prev => ({ ...prev, [name]: value }));
    };

    const handleListChange = (e, index, field) => {
        const newList = [...task[field]];
        newList[index] = e.target.value;
        setTask(prev => ({ ...prev, [field]: newList }));
    };

    const addListItem = (field) => {
        setTask(prev => ({ ...prev, [field]: [...prev[field], ''] }));
    };

    const removeListItem = (index, field) => {
        if (task[field].length > 1) { // Prevent removing the last item
            const newList = task[field].filter((_, i) => i !== index);
            setTask(prev => ({ ...prev, [field]: newList }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const taskToSave = {
            ...task,
            processSteps: task.processSteps.filter(step => step.trim() !== ''),
            deliverables: task.deliverables.filter(d => d.trim() !== ''),
        };
        if (task.id) {
            await updateTask(taskToSave);
        } else {
            await addTask(taskToSave);
        }
        onClose();
    };

    const modalTitle = task.id ? '업무 수정' : '새 업무 추가';

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-40 p-4 animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] transform scale-95 opacity-0 animate-scale-in">
                 <div className="flex justify-between items-center p-5 border-b border-gray-200 sticky top-0 bg-white z-10">
                    <h3 className="text-xl font-semibold text-gray-800">{modalTitle}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors duration-200" title="닫기">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto" style={{maxHeight: 'calc(90vh - 140px)'}}> {/* Adjust max height for scroll */}
                    <div>
                        <label htmlFor="taskName" className="block text-sm font-medium text-gray-700 mb-1">업무명 <span className="text-red-500">*</span></label>
                        <input type="text" id="taskName" name="name" value={task.name} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-400 focus:border-pink-400" required />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="taskAssignee" className="block text-sm font-medium text-gray-700 mb-1">담당자 <span className="text-red-500">*</span></label>
                            <select id="taskAssignee" name="assignee" value={task.assignee} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-400 focus:border-pink-400" required>
                                {teamMembers.map(member => <option key={member.name} value={member.name}>{member.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="taskCategory" className="block text-sm font-medium text-gray-700 mb-1">카테고리 <span className="text-red-500">*</span></label>
                            <select id="taskCategory" name="category" value={task.category} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-400 focus:border-pink-400" required>
                                {taskCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="taskCycle" className="block text-sm font-medium text-gray-700 mb-1">수행 주기</label>
                        <select id="taskCycle" name="cycle" value={task.cycle} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-400 focus:border-pink-400" required>
                           {taskCycles.map(cyc => <option key={cyc} value={cyc}>{cyc}</option>)} 
                        </select>
                    </div>

                    <div>
                        <label htmlFor="taskNotes" className="block text-sm font-medium text-gray-700 mb-1">참고 사항</label>
                        <textarea
                            id="taskNotes"
                            name="notes"
                            value={task.notes}
                            onChange={handleChange}
                            rows="3"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-400 focus:border-pink-400"
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

// Main App Component
const App = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskFormModal, setShowTaskFormModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const handleNavigate = (page, item = null) => {
    setCurrentPage(page);
    if (page === 'detail') {
      setSelectedTask(item);
    } else {
      setSelectedTask(null);
    }
  };

  const handleSelectTask = (task) => {
    handleNavigate('detail', task);
  };

  const handlePrintTask = (task) => {
    handleNavigate('print', task);
  };

  const handleBackToList = () => {
    setCurrentPage('all-tasks');
    setSelectedTask(null);
  };

  const handleBackFromPrint = () => {
    if (selectedTask) {
      setCurrentPage('detail');
    } else {
      setCurrentPage('all-tasks');
    }
  };

  const handleOpenCreateTask = () => {
    setTaskToEdit(null);
    setShowTaskFormModal(true);
  };

  const handleOpenEditTask = (task) => {
    setTaskToEdit(task);
    setShowTaskFormModal(true);
  };

  const handleCloseTaskFormModal = () => {
    setShowTaskFormModal(false);
    setTaskToEdit(null);
  };

  return (
    <ManualProvider>
      <>
        <style>
          {`
          /* Base font and animations are already defined in index.html via Tailwind config script */
          body {
            font-family: 'Inter', sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          /* Print specific styles */
          @media print {
            .no-print {
              display: none !important;
            }
            body {
              background-color: #fff !important;
              font-size: 10pt; /* Adjust base font size for print */
            }
            .print-page {
              box-shadow: none !important;
              margin: 0 !important;
              padding: 20mm !important; /* Standard A4 margins approx */
              border: none !important;
            }
            .print-page-container {
                margin: 0;
                padding: 0;
            }
            /* Reduce icon sizes for print */
            .print\:w-4 { width: 1rem; }
            .print\:h-4 { height: 1rem; }
            .print\:mr-2 { margin-right: 0.5rem; }
            .print\:text-xs { font-size: 0.7rem; line-height: 0.9rem; }
            .print\:text-sm { font-size: 0.8rem; line-height: 1.1rem; }
            .print\:text-lg { font-size: 1.2rem; line-height: 1.5rem; }
            .print\:text-2xl { font-size: 1.6rem; line-height: 1.9rem; }
            .print\:mb-1 { margin-bottom: 0.25rem; }
            .print\:mb-1\.5 { margin-bottom: 0.375rem; }
            .print\:mb-4 { margin-bottom: 1rem; }
            .print\:space-y-1 > * + * { margin-top: 0.25rem; }
            .print\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            .print\:gap-x-6 { column-gap: 1.5rem; }
            .print\:gap-y-3 { row-gap: 0.75rem; }
            .print\:bg-transparent { background-color: transparent !important; }
            .print\:p-0 { padding: 0 !important; }
            .print\:text-black { color: #000 !important; }
            .print\:no-underline { text-decoration: none !important; }
            .print\:mt-8 { margin-top: 2rem; }
            a[href^="http"]:after {
                content: " (" attr(href) ")";
                font-size: 0.8em;
                color: #555;
            }
            a[href^="http"].print\:no-underline:after {
                content: ""; /* Disable link printing for specific cases if needed */
            }

          }
          `}
        </style>
        <div className="min-h-screen bg-gray-100 font-inter antialiased flex flex-col">
          <Header
            onNavigate={handleNavigate}
            currentPage={currentPage}
            onOpenCreateTask={handleOpenCreateTask}
          />
          <div className="flex flex-1 flex-col sm:flex-row p-4 gap-4">
            <Sidebar onNavigate={handleNavigate} currentPage={currentPage} />
            <main className="flex-1 overflow-auto">
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
                  onOpenEditTask={handleOpenEditTask}
                />
              )}
              {currentPage === 'announcements' && (
                <AnnouncementsPage onBack={() => handleNavigate('dashboard')} />
              )}
            </main>
          </div>

          {showTaskFormModal && (
            <TaskFormModal
              task={taskToEdit}
              onClose={handleCloseTaskFormModal}
            />
          )}
        </div>
      </>
    </ManualProvider>
  );
};
