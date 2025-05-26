// --- Global State ---
const state = {
    editableCategories: [], // Will be loaded from localStorage or initial mock
    allProcesses: [],     // Will be loaded from localStorage or initial mock
    processes: [],
    selectedCategory: "상담지원팀 공통",
    loading: true,
    error: null,
    showModal: false,
    editingProcess: null,
    newProcessData: { mainTask: '', processDetail: '', output: '', reportCycle: '', performer: '', sharedDept: '', sharedUser: '', manualStatus: '', notes: '' },
    showConfirmModal: false,
    processToDelete: null,
    message: null,
    isXLSXLoaded: false,
    showCategoryModal: false,
    editingCategoryIndex: null,
    newCategoryName: '',
    selectedProcessDetail: null,
    userId: "local_user",
    userName: "익명 사용자",
    isAuthReady: true,
    isAuthenticated: true,
    showLoginScreen: false
};

// Initial mock data (used if localStorage is empty)
const initialMockCategories = [
    "상담지원팀 공통", "권미 프로(QA, 해피존(주), 고객감동위원회)", "이정훈 프로(콜시스템, 고객응대 매뉴얼)",
    "김유미 프로(진료일정, 문자발송)", "방지영 프로(해피존(부), 팀운영지원)", "편집기준"
];
const initialMockProcesses = [
    { id: crypto.randomUUID(), category: "상담지원팀 공통", mainTask: "고객 문의 응대", processDetail: "고객 전화/채팅 문의 접수 및 답변, FAQ 활용. 고객의 질문에 신속하고 정확하게 응답하여 만족도를 높이는 것이 목표입니다. 모든 상담 내용은 기록되어 추후 분석에 활용됩니다.", output: "상담 기록, 고객 만족도 조사 결과", reportCycle: "일일", performer: "상담사", sharedDept: "고객 지원실", sharedUser: "팀장급 이상", manualStatus: "유", notes: "친절하고 명확한 안내 필수. 특히 복잡한 문의는 전문가에게 연결하여 처리해야 합니다.", lastEditedBy: "익명 사용자", lastEditedAt: new Date(Date.now() - 10000) },
    { id: crypto.randomUUID(), category: "상담지원팀 공통", mainTask: "예약 관리", processDetail: "진료/상담 예약 접수, 변경, 취소 처리. 고객의 요청에 따라 유연하게 일정을 조정하고, 변경 사항 발생 시 즉시 고객에게 알립니다. 예약 현황은 실시간으로 업데이트됩니다.", output: "예약 현황표, 예약 변경 기록", reportCycle: "실시간", performer: "상담사", sharedDept: "진료팀", sharedUser: "해당 의료진", manualStatus: "유", notes: "오버부킹 방지, 정확한 시간 안내. 고객의 편의를 최우선으로 고려해야 합니다.", lastEditedBy: "익명 사용자", lastEditedAt: new Date(Date.now() - 60000) },
    { id: crypto.randomUUID(), category: "권미 프로(QA, 해피존(주), 고객감동위원회)", mainTask: "QA 시행", processDetail: "상담 녹취 청취, 평가표 작성, 1차 결과 공유. 고객 만족도 향상을 위한 품질 관리 절차를 수행하며, 상담사의 역량 강화를 위한 피드백을 제공합니다. 정기적인 검토가 필수적입니다.", output: "상담사별 평가표, 통합 보고서", reportCycle: "월 1회 (60일 소요)", performer: "권미 프로", sharedDept: "고객 지원실", sharedUser: "팀장급 이상", manualStatus: "유", notes: "정확하고 객관적인 평가 중요. 피드백은 건설적인 방향으로 제공해야 합니다.", lastEditedBy: "익명 사용자", lastEditedAt: new Date(Date.now() - 120000) },
    { id: crypto.randomUUID(), category: "이정훈 프로(콜시스템, 고객응대 매뉴얼)", mainTask: "콜시스템 운영", processDetail: "콜시스템 모니터링, 오류 대응, 통계 분석. 시스템의 안정적인 운영을 위해 주기적으로 점검하고, 문제 발생 시 신속하게 해결합니다. 통계 데이터를 기반으로 시스템 개선 방안을 모색합니다.", output: "시스템 운영 보고서, 통계 데이터", reportCycle: "주간", performer: "이정훈 프로", sharedDept: "IT팀", sharedUser: "전 직원", manualStatus: "유", notes: "안정적인 시스템 유지. 긴급 상황 발생 시 비상 매뉴얼에 따라 대응.", lastEditedBy: "익명 사용자", lastEditedAt: new Date(Date.now() - 90000) },
    { id: crypto.randomUUID(), category: "김유미 프로(진료일정, 문자발송)", mainTask: "진료일정 관리", processDetail: "진료실 배정, 의료진 스케줄 조정, 환자 안내 문자 발송. 환자의 편의를 고려하여 진료 일정을 효율적으로 관리하고, 중요한 변경 사항은 문자로 즉시 안내합니다. 정확한 정보 전달이 필수입니다.", output: "진료 스케줄표, 문자 발송 기록", reportCycle: "일일", performer: "김유미 프로", sharedDept: "진료팀", sharedUser: "의료진, 환자", manualStatus: "유", notes: "오류 없는 정확한 정보 전달. 환자 개인 정보 보호에 유의.", lastEditedBy: "익명 사용자", lastEditedAt: new Date(Date.now() - 180000) },
    { id: crypto.randomUUID(), category: "방지영 프로(해피존(부), 팀운영지원)", mainTask: "해피존(부), 팀운영지원", processDetail: "시설 점검, 프로그램 준비, 이용자 피드백 수렴. 해피존의 쾌적한 환경을 유지하고, 이용자 만족도를 높이기 위한 다양한 프로그램을 기획하고 실행합니다. 이용자의 의견을 적극 반영합니다.", output: "시설 점검표, 프로그램 계획서", reportCycle: "월 2회", performer: "방지영 프로", sharedDept: "해피존", sharedUser: "이용자", manualStatus: "유", notes: "쾌적한 환경 조성 및 만족도 관리. 정기적인 설문조사 실시.", lastEditedBy: "익명 사용자", lastEditedAt: new Date(Date.now() - 240000) },
    { id: crypto.randomUUID(), category: "편집기준", mainTask: "문서 표준화", processDetail: "문서 작성 가이드라인 준수 여부 검토, 용어 통일. 모든 내부 및 외부 문서의 일관성을 확보하기 위한 표준화 작업을 수행합니다. 정기적인 검토를 통해 최신화합니다.", output: "편집 기준 문서, 검토 보고서", reportCycle: "분기", performer: "관리팀", sharedDept: "전 부서", sharedUser: "전 직원", manualStatus: "유", notes: "일관성 있는 문서 품질 유지. 신규 직원 교육 시 활용.", lastEditedBy: "익명 사용자", lastEditedAt: new Date(Date.now() - 300000) },
];


// --- DOM Elements ---
const mainAppContent = document.getElementById('main-app-content');
const currentUserInfo = document.getElementById('current-user-info');
const messageDisplay = document.getElementById('message-display');
const errorDisplay = document.getElementById('error-display');
const categoryButtonsContainer = document.getElementById('category-buttons');
const manageCategoriesBtn = document.getElementById('manage-categories-btn');
const addProcessBtn = document.getElementById('add-process-btn');
const exportExcelBtn = document.getElementById('export-excel-btn');
const masterListPanel = document.getElementById('master-list-panel');
const processListContent = document.getElementById('process-list-content');
const detailViewPanel = document.getElementById('detail-view-panel');
const detailViewContent = document.getElementById('detail-view-content');
const detailBackBtn = document.getElementById('detail-back-btn');

// Process Modal elements
const processModal = document.getElementById('process-modal');
const processModalTitle = document.getElementById('process-modal-title');
const closeProcessModalBtn = document.getElementById('close-process-modal-btn');
const saveProcessBtn = document.getElementById('save-process-btn');
const cancelProcessBtn = document.getElementById('cancel-process-btn');
const generateDescriptionBtn = document.getElementById('generate-description-btn');
const processInputs = {
    mainTask: document.getElementById('mainTask'), processDetail: document.getElementById('processDetail'), output: document.getElementById('output'),
    reportCycle: document.getElementById('reportCycle'), performer: document.getElementById('performer'), sharedDept: document.getElementById('sharedDept'),
    sharedUser: document.getElementById('sharedUser'), manualStatus: document.getElementById('manualStatus'), notes: document.getElementById('notes')
};

// Confirm Modal elements
const confirmModal = document.getElementById('confirm-modal');
const closeConfirmModalBtn = document.getElementById('close-confirm-modal-btn');
const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');

// Category Modal elements
const categoryModal = document.getElementById('category-modal');
const closeCategoryModalBtn = document.getElementById('close-category-modal-btn');
const newCategoryNameInput = document.getElementById('new-category-name-input');
const addCategoryBtn = document.getElementById('add-category-btn');
const categoryList = document.getElementById('category-list');
const categoryModalCloseBtn = document.getElementById('category-modal-close-btn');

// --- Helper Functions ---
function formatTimestamp(date) {
    if (!date) return 'N/A';
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleString('ko-KR', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
}

function showUserMessage(msg) {
    state.message = msg;
    messageDisplay.textContent = msg;
    messageDisplay.classList.remove('hidden');
    messageDisplay.classList.add('animate-fade-in-down');
    setTimeout(() => {
        messageDisplay.classList.add('hidden');
        messageDisplay.classList.remove('animate-fade-in-down');
        state.message = null;
    }, 3000);
}

function showError(msg) {
    state.error = msg;
    errorDisplay.textContent = msg;
    errorDisplay.classList.remove('hidden');
    errorDisplay.classList.add('animate-fade-in-down');
    setTimeout(() => {
        errorDisplay.classList.add('hidden');
        errorDisplay.classList.remove('animate-fade-in-down');
        state.error = null;
    }, 5000);
}

function renderLoading() {
    processListContent.innerHTML = `
        <div class="flex flex-col items-center p-8">
            <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-8 w-8 mb-2"></div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">데이터 로딩 중...</p>
        </div>
    `;
    detailViewContent.innerHTML = `
        <div class="flex flex-col items-center p-8">
            <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-8 w-8 mb-2"></div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">데이터 로딩 중...</p>
        </div>
    `;
}

function scrollToBottom() {
    const processesEndRef = document.getElementById('processes-end-ref');
    if (processesEndRef) {
        processesEndRef.scrollIntoView({ behavior: "smooth" });
    }
}

// Function to load state from localStorage
function loadStateFromLocalStorage() {
    try {
        const storedProcesses = localStorage.getItem('businessProcesses');
        const storedCategories = localStorage.getItem('businessCategories');

        if (storedProcesses) {
            state.allProcesses = JSON.parse(storedProcesses).map(p => ({
                ...p,
                lastEditedAt: new Date(p.lastEditedAt) // Convert string back to Date object
            }));
        } else {
            state.allProcesses = initialMockProcesses;
        }

        if (storedCategories) {
            state.editableCategories = JSON.parse(storedCategories);
        } else {
            state.editableCategories = initialMockCategories;
        }
        // Ensure selectedCategory is valid after loading categories
        if (!state.editableCategories.includes(state.selectedCategory) && state.editableCategories.length > 0) {
            state.selectedCategory = state.editableCategories[0];
        } else if (state.editableCategories.length === 0) {
            state.selectedCategory = ""; // No categories
        }

    } catch (e) {
        console.error("Error loading state from localStorage:", e);
        // Fallback to initial data if loading fails
        state.allProcesses = initialMockProcesses;
        state.editableCategories = initialMockCategories;
    }
}

// Function to save state to localStorage
function saveStateToLocalStorage() {
    try {
        const serializableProcesses = state.allProcesses.map(p => ({
            ...p,
            lastEditedAt: p.lastEditedAt.toISOString() // Convert Date object to ISO string
        }));
        localStorage.setItem('businessProcesses', JSON.stringify(serializableProcesses));
        localStorage.setItem('businessCategories', JSON.stringify(state.editableCategories));
    } catch (e) {
        console.error("Error saving state to localStorage:", e);
    }
}

function updateUI() {
    // Main app content is always visible
    mainAppContent.classList.remove('hidden');

    currentUserInfo.textContent = `현재 사용자: ${state.userName}`;

    categoryButtonsContainer.innerHTML = state.editableCategories.map(category => `
        <button
            data-category="${category}"
            class="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ease-in-out
            ${state.selectedCategory === category
                ? 'bg-blue-600 text-white shadow-md transform scale-105'
                : 'bg-gray-200 text-gray-700 hover:bg-blue-200 hover:text-blue-800 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-blue-900'
            }"
        >
            ${category}
        </button>
    `).join('');

    categoryButtonsContainer.querySelectorAll('button').forEach(button => {
        button.onclick = (e) => {
            state.selectedCategory = e.target.dataset.category;
            updateUI();
        };
    });

    // Filter and sort processes for display
    const filteredAndSortedProcesses = state.allProcesses
        .filter(p => p.category === state.selectedCategory)
        .sort((a, b) => b.lastEditedAt.getTime() - a.lastEditedAt.getTime());
    state.processes = filteredAndSortedProcesses; // Update state.processes for rendering

    if (state.loading) {
        renderLoading();
    } else if (state.processes.length === 0) {
        processListContent.innerHTML = `
            <div class="text-center p-4 text-gray-600 dark:text-gray-400">
                <p>프로세스가 없습니다.</p>
            </div>
        `;
    } else {
        processListContent.innerHTML = `
            <ul class="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-2">
                ${state.processes.map(process => `
                    <li
                        data-process-id="${process.id}"
                        class="p-4 rounded-lg cursor-pointer transition-all duration-200 ease-in-out
                        ${state.selectedProcessDetail?.id === process.id
                            ? 'bg-blue-100 dark:bg-blue-900 border-l-4 border-blue-500 shadow-md'
                            : 'bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600'
                        }"
                    >
                        <h3 class="text-base font-semibold text-gray-800 dark:text-gray-200 leading-tight mb-1 truncate">${process.mainTask}</h3>
                        <p class="text-xs text-gray-600 dark:text-gray-400 mb-1 truncate">수행자: ${process.performer}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400 truncate">수정일: ${formatTimestamp(process.lastEditedAt)}</p>
                    </li>
                `).join('')}
            </ul>
        `;
        processListContent.querySelectorAll('li').forEach(li => {
            li.onclick = (e) => {
                const processId = e.currentTarget.dataset.processId;
                const process = state.allProcesses.find(p => p.id === processId);
                state.selectedProcessDetail = process;
                updateUI();
                if (window.innerWidth < 768) {
                    masterListPanel.classList.add('hidden');
                    detailViewPanel.classList.remove('hidden');
                    detailBackBtn.classList.remove('hidden');
                }
            };
        });
    }

    if (state.selectedProcessDetail) {
        detailViewPanel.classList.remove('flex', 'items-center', 'justify-center');
        detailViewContent.innerHTML = `
            <div>
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-3xl font-extrabold text-blue-800 dark:text-blue-300 leading-tight">
                        ${state.selectedProcessDetail.mainTask}
                    </h2>
                    <div class="flex gap-2">
                        <button data-action="edit" class="p-2 bg-yellow-500 text-white rounded-full shadow-md hover:bg-yellow-600 transition-all duration-300 ease-in-out transform hover:scale-110 group" title="수정">
                            <i data-lucide="edit" class="w-5 h-5 transition-transform duration-200 group-hover:rotate-12"></i>
                        </button>
                        <button data-action="delete" class="p-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-all duration-300 ease-in-out transform hover:scale-110 group" title="삭제">
                            <i data-lucide="trash-2" class="w-5 h-5 transition-transform duration-200 group-hover:scale-110"></i>
                        </button>
                        <button id="detail-back-btn-inner" class="md:hidden p-2 bg-gray-300 text-gray-800 rounded-full shadow-md hover:bg-gray-400 transition-all duration-300 ease-in-out" title="목록으로 돌아가기">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>
                </div>

                <div class="space-y-6">
                    <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                        <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">업무 프로세스</h3>
                        <div class="text-gray-800 dark:text-gray-200 text-base">
                            <p>${state.selectedProcessDetail.processDetail || '내용 없음'}</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                            <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">수행 결과물</h3>
                            <div class="text-gray-800 dark:text-gray-200 text-base">
                                <p>${state.selectedProcessDetail.output || '내용 없음'}</p>
                            </div>
                        </div>

                        <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                            <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">주기 수행 보고 시기</h3>
                            <div class="text-gray-800 dark:text-gray-200 text-base">
                                <p>${state.selectedProcessDetail.reportCycle || '내용 없음'}</p>
                            </div>
                        </div>

                        <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                            <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">수행자</h3>
                            <div class="text-gray-800 dark:text-gray-200 text-base">
                                <p>${state.selectedProcessDetail.performer || '내용 없음'}</p>
                            </div>
                        </div>

                        <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                            <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">공유 소속</h3>
                            <div class="text-gray-800 dark:text-gray-200 text-base">
                                <p>${state.selectedProcessDetail.sharedDept || '내용 없음'}</p>
                            </div>
                        </div>

                        <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                            <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">공유자</h3>
                            <div class="text-gray-800 dark:text-gray-200 text-base">
                                <p>${state.selectedProcessDetail.sharedUser || '내용 없음'}</p>
                            </div>
                        </div>

                        <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                            <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">매뉴얼 유무</h3>
                            <div class="text-gray-800 dark:text-gray-200 text-base">
                                <p>${state.selectedProcessDetail.manualStatus || '내용 없음'}</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                        <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">비고</h3>
                        <div class="text-gray-800 dark:text-gray-200 text-base">
                            <p>${state.selectedProcessDetail.notes || '내용 없음'}</p>
                        </div>
                    </div>

                    <div class="text-sm text-gray-500 dark:text-gray-400 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p>최종 수정자: ${state.selectedProcessDetail.lastEditedBy}</p>
                        <p>최종 수정일: ${formatTimestamp(state.selectedProcessDetail.lastEditedAt)}</p>
                    </div>
                </div>
            </div>
        `;
        detailViewContent.querySelector('button[data-action="edit"]').onclick = () => handleOpenModal(state.selectedProcessDetail);
        detailViewContent.querySelector('button[data-action="delete"]').onclick = () => handleDeleteClick(state.selectedProcessDetail);
        const innerDetailBackBtn = detailViewContent.querySelector('#detail-back-btn-inner');
        if (innerDetailBackBtn) {
             innerDetailBackBtn.onclick = () => {
                state.selectedProcessDetail = null;
                updateUI();
                masterListPanel.classList.remove('hidden');
                detailViewPanel.classList.add('hidden');
                detailBackBtn.classList.add('hidden');
            };
        }

        if (window.innerWidth < 768) {
            detailViewPanel.classList.remove('hidden');
            masterListPanel.classList.add('hidden');
            detailBackBtn.classList.remove('hidden');
        } else {
             detailViewPanel.classList.remove('hidden');
        }
    } else {
         detailViewPanel.classList.add('flex', 'items-center', 'justify-center');
         detailViewContent.innerHTML = `
            <div class="text-center text-gray-600 dark:text-gray-400 p-8">
                <i data-lucide="eye" class="w-16 h-16 mx-auto mb-4 opacity-50"></i>
                <p class="text-xl font-semibold">왼쪽 목록에서 업무 프로세스를 선택해주세요.</p>
                <p class="text-sm mt-2">상세 정보를 보거나 수정할 수 있습니다.</p>
            </div>
         `;
         if (window.innerWidth < 768) {
            masterListPanel.classList.remove('hidden');
            detailViewPanel.classList.add('hidden');
            detailBackBtn.classList.add('hidden');
         } else {
             detailViewPanel.classList.remove('hidden');
         }
    }
    if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
        lucide.createIcons();
    }
}

// --- Event Handlers ---
// Attach event listeners programmatically
document.addEventListener('DOMContentLoaded', () => {
    // Global action buttons
    manageCategoriesBtn.onclick = () => handleOpenCategoryModal();
    addProcessBtn.onclick = () => handleOpenModal();
    exportExcelBtn.onclick = () => handleExportExcel();

    // Process Modal Event Listeners
    closeProcessModalBtn.onclick = () => handleCloseModal();
    cancelProcessBtn.onclick = () => handleCloseModal();
    saveProcessBtn.onclick = () => handleSaveProcess();
    generateDescriptionBtn.onclick = () => generateEnhancedDescription(); // LLM button

    // Confirm Modal Event Listeners
    closeConfirmModalBtn.onclick = () => handleCloseConfirmModal();
    cancelDeleteBtn.onclick = () => handleCloseConfirmModal();
    confirmDeleteBtn.onclick = () => handleConfirmDelete();

    // Category Modal Event Listeners
    closeCategoryModalBtn.onclick = () => handleCloseCategoryModal();
    categoryModalCloseBtn.onclick = () => handleCloseCategoryModal();
    addCategoryBtn.onclick = () => handleAddCategory();

    // Mobile back button for detail view
    detailBackBtn.onclick = () => {
        state.selectedProcessDetail = null;
        updateUI();
        masterListPanel.classList.remove('hidden');
        detailViewPanel.classList.add('hidden');
        detailBackBtn.classList.add('hidden');
    };

    // Set up input change listeners for process modal
    Object.keys(processInputs).forEach(field => {
        processInputs[field].oninput = (e) => {
            state.newProcessData[field] = e.target.value;
        };
    });

    // Set up responsive display for master/detail panels
    function handleResize() {
        if (window.innerWidth >= 768) { // md breakpoint
            masterListPanel.classList.remove('hidden');
            detailViewPanel.classList.remove('hidden');
            detailBackBtn.classList.add('hidden');
        } else { // Mobile
            if (state.selectedProcessDetail) {
                masterListPanel.classList.add('hidden');
                detailViewPanel.classList.remove('hidden');
                detailBackBtn.classList.remove('hidden');
            } else {
                masterListPanel.classList.remove('hidden');
                detailViewPanel.classList.add('hidden');
                detailBackBtn.classList.add('hidden');
            }
        }
    }

    window.addEventListener('resize', handleResize);
    handleResize(); // Call on initial load

    // Initial data load and UI update
    loadStateFromLocalStorage(); // Load data from localStorage first
    state.loading = false; // Set loading to false after attempting to load
    updateUI(); // Initial UI render with loaded data
});

// --- Local Data Management Functions ---
async function handleSaveProcess() {
    if (!state.newProcessData.mainTask.trim() || !state.newProcessData.processDetail.trim()) {
        showUserMessage("주요 업무와 업무 프로세스 내용은 필수 입력 사항입니다.");
        return;
    }

    state.loading = true;
    updateUI();
    setTimeout(() => { // Simulate async operation
        const processToSave = {
            ...state.newProcessData,
            id: state.editingProcess ? state.editingProcess.id : crypto.randomUUID(), // Keep ID if editing, generate new if adding
            category: state.selectedCategory,
            lastEditedBy: state.userName, // Static for local app
            lastEditedAt: new Date()
        };

        if (state.editingProcess) {
            state.allProcesses = state.allProcesses.map(p =>
                p.id === processToSave.id ? processToSave : p
            );
            showUserMessage("업무 프로세스가 성공적으로 업데이트되었습니다.");
        } else {
            state.allProcesses = [processToSave, ...state.allProcesses];
            showUserMessage("새 업무 프로세스가 성공적으로 추가되었습니다.");
        }
        // Update selected detail if it was the one being edited
        if (state.selectedProcessDetail && state.selectedProcessDetail.id === processToSave.id) {
            state.selectedProcessDetail = processToSave;
        }
        saveStateToLocalStorage(); // Save to localStorage
        handleCloseModal();
        state.loading = false;
        updateUI();
    }, 300);
}

async function handleConfirmDelete() {
    if (!state.processToDelete) return;

    state.loading = true;
    updateUI();
    setTimeout(() => { // Simulate async operation
        state.allProcesses = state.allProcesses.filter(p => p.id !== state.processToDelete.id);
        showUserMessage("업무 프로세스가 성공적으로 삭제되었습니다.");
        if (state.selectedProcessDetail && state.selectedProcessDetail.id === state.processToDelete.id) {
            state.selectedProcessDetail = null;
        }
        saveStateToLocalStorage(); // Save to localStorage
        state.loading = false;
        state.showConfirmModal = false;
        state.processToDelete = null;
        confirmModal.classList.add('hidden');
        updateUI();
    }, 300);
}

async function handleSaveCategoryEdit(index) {
    const oldName = state.editableCategories[index];
    const newName = state.newCategoryName.trim();

    if (!newName) {
        showUserMessage("카테고리 이름을 입력해주세요.");
        return;
    }
    if (newName === oldName) {
        showUserMessage("카테고리 이름이 변경되지 않았습니다.");
        state.editingCategoryIndex = null;
        state.newCategoryName = '';
        updateUI();
        return;
    }
    if (state.editableCategories.includes(newName) && newName !== oldName) {
        showUserMessage("이미 존재하는 카테고리 이름입니다.");
        return;
    }

    state.loading = true;
    updateUI();
    setTimeout(() => { // Simulate async operation
        state.editableCategories = state.editableCategories.map((cat, i) => i === index ? newName : cat);
        state.allProcesses = state.allProcesses.map(p =>
            p.category === oldName ? { ...p, category: newName, lastEditedAt: new Date(), lastEditedBy: state.userName } : p
        );
        if (state.selectedCategory === oldName) {
            state.selectedCategory = newName;
        }
        showUserMessage(`카테고리 이름이 '${oldName}'에서 '${newName}'(으)로 변경되었습니다.`);
        saveStateToLocalStorage(); // Save to localStorage
        state.editingCategoryIndex = null;
        state.newCategoryName = '';
        state.loading = false;
        updateUI();
    }, 300);
}

async function handleDeleteCategory(index) {
    const categoryToDelete = state.editableCategories[index];

    if (state.editableCategories.length <= 1) {
        showUserMessage("최소 하나의 카테고리는 존재해야 합니다.");
        return;
    }

    const defaultCategory = state.editableCategories.find((_, i) => i !== index);
    if (!defaultCategory) {
        showError("카테고리 삭제 중 오류가 발생했습니다. 기본 카테고리를 찾을 수 없습니다.");
        return;
    }

    state.loading = true;
    updateUI();
    setTimeout(() => { // Simulate async operation
        state.allProcesses = state.allProcesses.map(p =>
            p.category === categoryToDelete ? { ...p, category: defaultCategory, lastEditedAt: new Date(), lastEditedBy: state.userName } : p
        );
        state.editableCategories = state.editableCategories.filter((_, i) => i !== index);
        showUserMessage(`'${categoryToDelete}' 카테고리가 삭제되었습니다. 관련 프로세스는 '${defaultCategory}'(으)로 이동되었습니다.`);
        if (state.selectedCategory === categoryToDelete) {
            state.selectedCategory = defaultCategory;
        }
        saveStateToLocalStorage(); // Save to localStorage
        state.loading = false;
        updateUI();
    }, 300);
}

// --- Gemini API Integration ---
async function generateEnhancedDescription() {
    const mainTask = processInputs.mainTask.value;
    const currentProcessDetail = processInputs.processDetail.value;

    if (!mainTask.trim()) {
        showUserMessage("주요 업무를 먼저 입력해주세요.");
        return;
    }

    showUserMessage("✨ 설명 개선 중...");
    generateDescriptionBtn.disabled = true;
    generateDescriptionBtn.innerHTML = '<div class="loader ease-linear rounded-full border-2 border-t-2 border-white h-4 w-4 mr-2"></div> 생성 중...';

    try {
        const prompt = `You are an expert in business process documentation. Given a main task and its current process detail, provide a more detailed and clear explanation of the process. Focus on actionable steps and clarity. Keep it concise, around 100-200 words.
        Main Task: ${mainTask}
        Current Process Detail: ${currentProcessDetail}`;

        const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
        const apiKey = ""; // Canvas runtime provides this
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            const generatedText = result.candidates[0].content.parts[0].text;
            processInputs.processDetail.value = generatedText;
            state.newProcessData.processDetail = generatedText;
            showUserMessage("✨ 설명이 성공적으로 개선되었습니다!");
        } else {
            showError("설명 생성에 실패했습니다. 응답 형식이 예상과 다릅니다.");
            console.error("Gemini API response structure unexpected:", result);
        }
    } catch (apiError) {
        console.error("Gemini API Error:", apiError);
        showError("설명 생성 중 오류가 발생했습니다. 네트워크 연결을 확인하거나 다시 시도해주세요.");
    } finally {
        generateDescriptionBtn.disabled = false;
        generateDescriptionBtn.innerHTML = '<i data-lucide="sparkles" class="w-4 h-4 mr-2"></i> ✨ 설명 개선';
        if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
            lucide.createIcons();
        }
    }
}
