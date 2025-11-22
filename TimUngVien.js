/* ========================================
   TÌM ỨNG VIÊN - LOGIC XỬ LÝ
   Đồng bộ với trang quản lý đăng tin
   ======================================== */

// Sample candidate data - KHÔNG THÊM SẴN, chỉ để demo cấu trúc
const candidatesData = [];

// Tags data
let tagsData = [
    { id: 1, name: "Ưu tiên", color: "#ef4444" },
    { id: 2, name: "Phỏng vấn", color: "#f59e0b" },
    { id: 3, name: "Chưa phù hợp", color: "#6b7280" },
    { id: 4, name: "Đã liên hệ", color: "#10b981" }
];

// Saved candidates
let savedCandidates = [];
let currentCandidate = null;

// Initialize
$(document).ready(function() {
    setupEventListeners();
    updateResultCount();
});

// Setup event listeners
function setupEventListeners() {
    // Search button
    $('#btnSearch').click(performSearch);
    
    // Enter key in search
    $('#searchKeyword').on('keypress', function(e) {
        if (e.which === 13) performSearch();
    });
    
    // View candidate detail
    $(document).on('click', '.candidate-card', function(e) {
        if (!$(e.target).closest('.candidate-actions').length) {
            const id = $(this).data('id');
            showCandidateDetail(id);
        }
    });
    
    // Save candidate
    $(document).on('click', '.btn-save', function(e) {
        e.stopPropagation();
        const id = $(this).closest('.candidate-card').data('id');
        saveCandidate(id);
    });
    
    // Tag candidate
    $(document).on('click', '.btn-tag', function(e) {
        e.stopPropagation();
        const id = $(this).closest('.candidate-card').data('id');
        showTagModal(id);
    });
    
    // Mobile sidebar toggle
    $('#mobileSidebarToggle').click(function() {
        $('.sidebar-wrapper').toggleClass('show');
    });
    
    // Sidebar navigation
    $('.sidebar-link').click(function(e) {
        e.preventDefault();
        $('.sidebar-link').removeClass('active');
        $(this).addClass('active');
        $('.sidebar-wrapper').removeClass('show'); // Close on mobile
    });
    
    // Add new tag
    $('#btnAddTag').click(addNewTag);
    
    // Contact candidate from modal
    $('#btnContactCandidate').click(function() {
        if (currentCandidate) {
            alert(`Liên hệ với ${currentCandidate.name}\nĐiện thoại: ${currentCandidate.phone}\nEmail: ${currentCandidate.email}`);
        }
    });
    
    // Save from modal
    $('#btnSaveCandidate').click(function() {
        if (currentCandidate) {
            saveCandidate(currentCandidate.id);
        }
    });
}

// Perform search
function performSearch() {
    const keyword = $('#searchKeyword').val().toLowerCase().trim();
    const location = $('#searchLocation').val();
    const category = $('#searchCategory').val();
    const experience = $('#filterExperience').val();
    const education = $('#filterEducation').val();
    const salary = $('#filterSalary').val();
    const workType = $('#filterWorkType').val();
    
    let filtered = candidatesData.filter(candidate => {
        const matchKeyword = !keyword || 
            candidate.name.toLowerCase().includes(keyword) ||
            candidate.title.toLowerCase().includes(keyword) ||
            candidate.skills.some(skill => skill.toLowerCase().includes(keyword));
        
        const matchLocation = !location || candidate.location.includes(location);
        const matchWorkType = !workType || candidate.workType === workType;
        
        return matchKeyword && matchLocation && matchWorkType;
    });
    
    renderCandidates(filtered);
    updatePagination(filtered.length);
}

// Render candidate cards - CẬP NHẬT TEMPLATE ĐỒNG BỘ
function renderCandidates(candidates) {
    const container = $('#candidatesList');
    container.empty();
    
    if (candidates.length === 0) {
        container.html(`
            <div class="text-center py-5 text-muted">
                <i class="bi bi-inbox display-1 opacity-25"></i>
                <p class="mt-3 fw-semibold">Không tìm thấy ứng viên phù hợp</p>
                <p class="small">Thử thay đổi từ khóa hoặc bộ lọc tìm kiếm</p>
            </div>
        `);
        $('#paginationWrapper').addClass('d-none');
        return;
    }
    
    candidates.forEach(candidate => {
        const card = `
            <div class="candidate-card" data-id="${candidate.id}">
                <div class="candidate-header">
                    <img src="${candidate.avatar}" alt="${candidate.name}" class="candidate-avatar">
                    <div class="candidate-info">
                        <h5 class="candidate-name">${candidate.name}</h5>
                        <p class="candidate-title mb-0">${candidate.title}</p>
                        <div class="candidate-meta mt-2">
                            <span><i class="bi bi-briefcase-fill"></i>${candidate.experience}</span>
                            <span><i class="bi bi-geo-alt-fill"></i>${candidate.location}</span>
                            <span><i class="bi bi-currency-dollar"></i>${candidate.salary}</span>
                        </div>
                    </div>
                </div>
                <div class="candidate-skills">
                    ${candidate.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
                <div class="candidate-footer">
                    <i class="bi bi-clock me-1"></i>
                    <small>Cập nhật ${candidate.updated}</small>
                </div>
                <div class="candidate-actions">
                    <button class="btn btn-sm btn-outline-primary btn-view">
                        <i class="bi bi-eye me-1"></i>Xem hồ sơ
                    </button>
                    <button class="btn btn-sm btn-outline-warning btn-save">
                        <i class="bi bi-bookmark-heart me-1"></i>Lưu
                    </button>
                    <button class="btn btn-sm btn-outline-secondary btn-tag">
                        <i class="bi bi-tags me-1"></i>Gán thẻ
                    </button>
                </div>
            </div>
        `;
        container.append(card);
    });
    
    updateResultCount(candidates.length);
    $('#paginationWrapper').removeClass('d-none');
}

// Update result count
function updateResultCount(count = 0) {
    $('#resultCount').text(count);
}

// Update pagination
function updatePagination(totalResults) {
    const pagination = $('#pagination');
    const perPage = 10;
    const totalPages = Math.ceil(totalResults / perPage);
    
    if (totalPages <= 1) {
        pagination.empty();
        return;
    }
    
    let html = `
        <li class="page-item disabled">
            <a class="page-link" href="#"><i class="bi bi-chevron-left"></i></a>
        </li>
    `;
    
    for (let i = 1; i <= Math.min(totalPages, 5); i++) {
        html += `
            <li class="page-item ${i === 1 ? 'active' : ''}">
                <a class="page-link" href="#">${i}</a>
            </li>
        `;
    }
    
    html += `
        <li class="page-item">
            <a class="page-link" href="#"><i class="bi bi-chevron-right"></i></a>
        </li>
    `;
    
    pagination.html(html);
}

// Show candidate detail - CẬP NHẬT TEMPLATE
function showCandidateDetail(id) {
    const candidate = candidatesData.find(c => c.id == id);
    if (!candidate) return;
    
    currentCandidate = candidate;
    
    const detail = `
        <div class="candidate-detail">
            <div class="text-center mb-4 pb-4 border-bottom">
                <img src="${candidate.avatar}" alt="${candidate.name}" 
                     class="rounded-circle mb-3" 
                     style="width: 100px; height: 100px; border: 4px solid #2176FF; box-shadow: 0 4px 12px rgba(33,118,255,0.2);">
                <h4 class="mb-2 fw-bold">${candidate.name}</h4>
                <p class="text-muted fw-semibold mb-0">${candidate.title}</p>
            </div>
            
            <div class="row g-4 mb-4">
                <div class="col-md-6">
                    <h6><i class="bi bi-person-badge-fill text-primary me-2"></i>Thông tin cơ bản</h6>
                    <ul class="ms-3">
                        <li><strong>Kinh nghiệm:</strong> ${candidate.experience}</li>
                        <li><strong>Trình độ:</strong> ${candidate.education}</li>
                        <li><strong>Hình thức:</strong> ${candidate.workType}</li>
                    </ul>
                </div>
                <div class="col-md-6">
                    <h6><i class="bi bi-telephone-fill text-primary me-2"></i>Thông tin liên hệ</h6>
                    <ul class="ms-3">
                        <li><strong>Điện thoại:</strong> ${candidate.phone}</li>
                        <li><strong>Email:</strong> ${candidate.email}</li>
                        <li><strong>Địa chỉ:</strong> ${candidate.location}</li>
                    </ul>
                </div>
            </div>
            
            <div class="mb-4">
                <h6><i class="bi bi-star-fill text-primary me-2"></i>Kỹ năng</h6>
                <div class="d-flex flex-wrap gap-2 ms-3">
                    ${candidate.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            </div>
            
            <div class="mb-4">
                <h6><i class="bi bi-file-text-fill text-primary me-2"></i>Giới thiệu bản thân</h6>
                <p class="ms-3 text-muted">${candidate.description}</p>
            </div>
            
            <div class="mb-0">
                <h6><i class="bi bi-cash-stack text-primary me-2"></i>Mức lương mong muốn</h6>
                <p class="ms-3 fw-bold text-primary fs-5 mb-0">${candidate.salary}</p>
            </div>
        </div>
    `;
    
    $('#candidateDetail').html(detail);
    $('#candidateModal').modal('show');
}

// Save candidate
function saveCandidate(id) {
    const candidate = candidatesData.find(c => c.id == id);
    if (!candidate) return;
    
    if (savedCandidates.includes(id)) {
        alert('⚠️ Ứng viên đã được lưu trước đó!');
    } else {
        savedCandidates.push(id);
        updateSavedCount();
        
        // Show success message
        const toast = `
            <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 9999">
                <div class="toast show bg-success text-white" role="alert">
                    <div class="toast-body">
                        <i class="bi bi-check-circle me-2"></i>
                        Đã lưu hồ sơ của ${candidate.name}!
                    </div>
                </div>
            </div>
        `;
        $('body').append(toast);
        setTimeout(() => $('.toast').remove(), 3000);
    }
}

// Show tag modal
function showTagModal(id) {
    currentCandidate = candidatesData.find(c => c.id == id);
    if (!currentCandidate) return;
    
    renderTags();
    $('#tagModal').modal('show');
}

// Render tags
function renderTags() {
    const container = $('#tagsList');
    container.empty();
    
    if (tagsData.length === 0) {
        container.html('<p class="text-muted small">Chưa có thẻ nào. Tạo thẻ mới bên dưới.</p>');
        return;
    }
    
    tagsData.forEach(tag => {
        const tagElement = `
            <div class="tag-item" style="background-color: ${tag.color}; color: white;" data-id="${tag.id}">
                <i class="bi bi-tag-fill"></i>
                <span>${tag.name}</span>
            </div>
        `;
        container.append(tagElement);
    });
    
    // Tag selection
    $('.tag-item').click(function() {
        $(this).toggleClass('selected');
        const tagName = $(this).find('span').text();
        
        const toast = `
            <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 9999">
                <div class="toast show bg-primary text-white" role="alert">
                    <div class="toast-body">
                        <i class="bi bi-tag-fill me-2"></i>
                        Đã gán thẻ "${tagName}" cho ${currentCandidate.name}
                    </div>
                </div>
            </div>
        `;
        $('body').append(toast);
        setTimeout(() => $('.toast').remove(), 3000);
    });
}

// Add new tag
function addNewTag() {
    const name = $('#newTagName').val().trim();
    const color = $('#newTagColor').val();
    
    if (!name) {
        alert('⚠️ Vui lòng nhập tên thẻ!');
        return;
    }
    
    const newTag = {
        id: tagsData.length + 1,
        name: name,
        color: color
    };
    
    tagsData.push(newTag);
    renderTags();
    $('#newTagName').val('');
    $('#newTagColor').val('#2176FF');
    
    alert(`✅ Đã thêm thẻ "${name}"!`);
}

// Update saved count
function updateSavedCount() {
    $('.sidebar-link[data-section="da-luu"] .badge').text(savedCandidates.length);
}

// Close mobile sidebar when clicking outside
$(document).on('click', function(e) {
    if ($(window).width() < 992) {
        if (!$(e.target).closest('.sidebar-wrapper, .mobile-menu-toggle').length) {
            $('.sidebar-wrapper').removeClass('show');
        }
    }
});
