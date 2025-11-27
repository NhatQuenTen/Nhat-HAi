/* ========================================
   TÌM ỨNG VIÊN - LOGIC XỬ LÝ
   Đồng bộ với trang quản lý đăng tin
   ======================================== */

// Sample candidate data với 10 ứng viên đa dạng ngành nghề
const candidatesData = [
    {
        id: 1,
        name: 'Nguyễn Văn Minh',
        position: 'Senior Frontend Developer',
        avatar: '',
        experience: '5 năm',
        location: 'Hồ Chí Minh',
        salary: '25-30 triệu',
        skills: ['React', 'TypeScript', 'Next.js', 'TailwindCSS', 'Redux', 'Jest'],
        education: 'Đại học Bách Khoa TP.HCM - Công nghệ thông tin',
        email: 'nguyenvanminh@email.com',
        phone: '0901234567',
        description: 'Có 5 năm kinh nghiệm phát triển web frontend, thành thạo React ecosystem và các công nghệ hiện đại.',
        savedDate: new Date().toISOString()
    },
    {
        id: 2,
        name: 'Trần Thị Hương',
        position: 'Marketing Manager',
        avatar: '',
        experience: '7 năm',
        location: 'Hà Nội',
        salary: '30-35 triệu',
        skills: ['Digital Marketing', 'SEO/SEM', 'Content Strategy', 'Google Analytics', 'Facebook Ads', 'Brand Management'],
        education: 'Đại học Ngoại Thương - Marketing',
        email: 'tranthihuong@email.com',
        phone: '0912345678',
        gender: 'Nữ',
        description: 'Chuyên gia marketing với 7 năm kinh nghiệm, từng làm việc cho các thương hiệu lớn và startup.',
        savedDate: new Date().toISOString()
    },
    {
        id: 3,
        name: 'Lê Hoàng Nam',
        position: 'Backend Developer (Node.js)',
        avatar: '',
        experience: '4 năm',
        location: 'Đà Nẵng',
        salary: '20-25 triệu',
        skills: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Docker', 'AWS', 'Microservices'],
        education: 'Đại học Duy Tân - Kỹ thuật phần mềm',
        email: 'lehoangnam@email.com',
        phone: '0923456789',
        description: 'Backend developer có kinh nghiệm xây dựng hệ thống microservices và API RESTful.',
        savedDate: new Date().toISOString()
    },
    {
        id: 4,
        name: 'Phạm Thị Mai',
        position: 'UI/UX Designer',
        avatar: '',
        experience: '3 năm',
        location: 'Hồ Chí Minh',
        salary: '15-20 triệu',
        skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'User Research', 'Wireframing'],
        education: 'Đại học Mỹ thuật TP.HCM - Thiết kế đồ họa',
        email: 'phamthimai@email.com',
        phone: '0934567890',
        gender: 'Nữ',
        description: 'Designer sáng tạo với khả năng nghiên cứu người dùng và thiết kế giao diện trực quan.',
        savedDate: new Date().toISOString()
    },
    {
        id: 5,
        name: 'Võ Minh Tuấn',
        position: 'Kế toán trưởng',
        avatar: '',
        experience: '8 năm',
        location: 'Bình Dương',
        salary: '25-30 triệu',
        skills: ['Kế toán tổng hợp', 'Thuế', 'Kiểm toán', 'MISA', 'Excel nâng cao', 'Báo cáo tài chính'],
        education: 'Đại học Kinh tế TP.HCM - Kế toán',
        email: 'vominhtuan@email.com',
        phone: '0945678901',
        description: 'Kế toán trưởng có chứng chỉ CPA, am hiểu sâu về luật thuế và quản lý tài chính doanh nghiệp.',
        savedDate: new Date().toISOString()
    },
    {
        id: 6,
        name: 'Đặng Thu Hà',
        position: 'HR Manager',
        avatar: '',
        experience: '6 năm',
        location: 'Hà Nội',
        salary: '22-28 triệu',
        skills: ['Tuyển dụng', 'C&B', 'Đào tạo', 'Luật lao động', 'HRIS', 'Employee Engagement'],
        education: 'Đại học Lao động Xã hội - Quản trị nhân lực',
        email: 'dangtuha@email.com',
        phone: '0956789012',
        gender: 'Nữ',
        description: 'HR Manager với kinh nghiệm xây dựng văn hóa doanh nghiệp và quản lý đội ngũ hơn 200 nhân viên.',
        savedDate: new Date().toISOString()
    },
    {
        id: 7,
        name: 'Hoàng Văn Đức',
        position: 'Data Analyst',
        avatar: '',
        experience: '3 năm',
        location: 'Cần Thơ',
        salary: '18-22 triệu',
        skills: ['Python', 'SQL', 'Power BI', 'Tableau', 'Excel', 'Statistics', 'Machine Learning'],
        education: 'Đại học Cần Thơ - Khoa học dữ liệu',
        email: 'hoangvanduc@email.com',
        phone: '0967890123',
        description: 'Phân tích dữ liệu chuyên nghiệp, có kinh nghiệm xây dựng dashboard và dự báo xu hướng.',
        savedDate: new Date().toISOString()
    },
    {
        id: 8,
        name: 'Ngô Thị Lan',
        position: 'Content Writer/Copywriter',
        avatar: '',
        experience: '4 năm',
        location: 'Hồ Chí Minh',
        salary: '12-16 triệu',
        skills: ['Content Writing', 'SEO Writing', 'Storytelling', 'Social Media', 'WordPress', 'Creative Writing'],
        education: 'Đại học Khoa học Xã hội và Nhân văn - Báo chí',
        email: 'ngothilan@email.com',
        phone: '0978901234',
        gender: 'Nữ',
        description: 'Content writer sáng tạo với portfolio đa dạng từ blog, social media đến brand storytelling.',
        savedDate: new Date().toISOString()
    },
    {
        id: 9,
        name: 'Bùi Thanh Tùng',
        position: 'DevOps Engineer',
        avatar: '',
        experience: '5 năm',
        location: 'Đà Nẵng',
        salary: '28-35 triệu',
        skills: ['Docker', 'Kubernetes', 'Jenkins', 'GitLab CI/CD', 'AWS', 'Terraform', 'Monitoring'],
        education: 'Đại học Bách Khoa Đà Nẵng - Công nghệ thông tin',
        email: 'buithanhtung@email.com',
        phone: '0989012345',
        description: 'DevOps engineer với kinh nghiệm xây dựng và duy trì hệ thống CI/CD cho các dự án lớn.',
        savedDate: new Date().toISOString()
    },
    {
        id: 10,
        name: 'Lý Minh Châu',
        position: 'Business Analyst',
        avatar: '',
        experience: '4 năm',
        location: 'Hà Nội',
        salary: '20-25 triệu',
        skills: ['Business Analysis', 'Requirements Gathering', 'JIRA', 'Agile/Scrum', 'UML', 'SQL', 'Process Mapping'],
        education: 'Đại học Quốc gia Hà Nội - Hệ thống thông tin',
        email: 'lyminhauchau@email.com',
        phone: '0990123456',
        description: 'BA có kinh nghiệm phân tích và tối ưu quy trình nghiệp vụ cho các dự án chuyển đổi số.',
        savedDate: new Date().toISOString()
    }
];

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
    console.log('TimUngVien.js loaded');
    console.log('Candidates data:', candidatesData.length, 'candidates');
    setupEventListeners();
    renderAllCandidates(); // Render 10 CV ngay khi load trang
    updateResultCount(candidatesData.length);
});

// Render all candidates on page load
function renderAllCandidates() {
    console.log('renderAllCandidates() called');
    const container = $('#candidatesList');
    
    if (container.length === 0) {
        console.error('Container #candidatesList not found!');
        return;
    }
    
    console.log('Container found, rendering', candidatesData.length, 'candidates');
    container.empty();
    
    candidatesData.forEach(candidate => {
        const skillBadges = candidate.skills.slice(0, 3).map(skill => 
            `<span class="badge bg-primary">${skill}</span>`
        ).join(' ');
        
        const card = `
            <div class="col-md-6 col-lg-4">
                <div class="card h-100 shadow-sm">
                    <div class="card-body">
                        <div class="d-flex align-items-start mb-3">
                            <div class="flex-shrink-0">
                                <i class="bi bi-person-circle fs-1 text-primary"></i>
                            </div>
                            <div class="flex-grow-1 ms-3">
                                <h5 class="card-title mb-1">${candidate.name}</h5>
                                <p class="text-muted small mb-0">${candidate.position}</p>
                            </div>
                        </div>
                        <div class="mb-2">
                            ${skillBadges}
                        </div>
                        <p class="text-muted small mb-3">
                            <i class="bi bi-briefcase me-1"></i>${candidate.experience} | 
                            <i class="bi bi-geo-alt me-1"></i>${candidate.location}
                        </p>
                        <div class="d-flex gap-2">
                            <button class="btn btn-sm btn-outline-primary flex-grow-1 view-candidate-btn" 
                                    data-id="${candidate.id}"
                                    data-name="${candidate.name}"
                                    data-position="${candidate.position}"
                                    data-email="${candidate.email}"
                                    data-phone="${candidate.phone}"
                                    data-address="${candidate.location}"
                                    data-birth="01/01/1990"
                                    data-gender="${candidate.gender || 'Nam'}"
                                    data-education="${candidate.education}"
                                    data-experience="${candidate.experience.replace(' năm', '')}"
                                    data-salary="${candidate.salary}"
                                    data-skills="${candidate.skills.join(', ')}"
                                    data-status="Đang tìm việc">
                                <i class="bi bi-eye me-1"></i>Xem
                            </button>
                            <button class="btn btn-sm btn-primary flex-grow-1 btn-save" data-id="${candidate.id}">
                                <i class="bi bi-bookmark me-1"></i>Lưu
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.append(card);
    });
    
    // Re-attach event listeners for view and save buttons
    attachEventListeners();
}

// Attach event listeners to dynamically created buttons
function attachEventListeners() {
    // View candidate buttons
    const viewButtons = document.querySelectorAll('.view-candidate-btn');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const candidateData = {
                id: this.dataset.id,
                name: this.dataset.name,
                position: this.dataset.position,
                email: this.dataset.email,
                phone: this.dataset.phone,
                address: this.dataset.address,
                birth: this.dataset.birth,
                gender: this.dataset.gender,
                education: this.dataset.education,
                experience: this.dataset.experience,
                salary: this.dataset.salary,
                skills: this.dataset.skills,
                status: this.dataset.status
            };
            
            // Call the existing modal function from HTML
            if (typeof openCandidateModal === 'function') {
                openCandidateModal(candidateData);
            }
        });
    });
    
    // Save candidate buttons
    const saveButtons = document.querySelectorAll('.btn-save');
    saveButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const candidateId = parseInt(this.dataset.id);
            saveCandidate(candidateId);
        });
    });
}

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
    if (!candidate) {
        showToast('Không tìm thấy ứng viên!', 'error');
        return;
    }
    
    // Load saved candidates from localStorage
    let savedCandidates = JSON.parse(localStorage.getItem('savedCandidates')) || [];
    
    // Check if already saved
    const alreadySaved = savedCandidates.some(c => c.id === candidate.id);
    
    if (alreadySaved) {
        showToast('Ứng viên này đã được lưu trước đó!', 'warning');
        return;
    }
    
    // Add to saved candidates with saved date
    const candidateToSave = {
        ...candidate,
        savedDate: new Date().toISOString()
    };
    
    savedCandidates.push(candidateToSave);
    
    // Save to localStorage
    localStorage.setItem('savedCandidates', JSON.stringify(savedCandidates));
    
    // Update button state - tìm button theo data-id
    const btn = $(`.btn-save[data-id="${id}"]`);
    btn.html('<i class="bi bi-bookmark-check-fill me-1"></i>Đã lưu');
    btn.removeClass('btn-primary').addClass('btn-success');
    btn.prop('disabled', true);
    
    // Show success toast
    showToast(`Đã lưu hồ sơ: ${candidate.name}`, 'success');
    
    console.log('Saved candidates:', savedCandidates); // Debug log
}

// Show toast notification
function showToast(message, type = 'info') {
    // Remove existing toast if any
    $('.custom-toast').remove();
    
    const iconMap = {
        'success': 'bi-check-circle-fill',
        'warning': 'bi-exclamation-triangle-fill',
        'error': 'bi-x-circle-fill',
        'info': 'bi-info-circle-fill'
    };
    
    const bgMap = {
        'success': 'bg-success',
        'warning': 'bg-warning',
        'error': 'bg-danger',
        'info': 'bg-info'
    };
    
    const toast = $(`
        <div class="custom-toast ${bgMap[type]} text-white position-fixed" 
             style="top: 20px; right: 20px; z-index: 9999; min-width: 300px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); animation: slideInRight 0.3s ease;">
            <div class="d-flex align-items-center p-3">
                <i class="bi ${iconMap[type]} fs-4 me-3"></i>
                <div class="flex-grow-1">${message}</div>
                <button type="button" class="btn-close btn-close-white ms-2" onclick="$(this).closest('.custom-toast').remove()"></button>
            </div>
        </div>
    `);
    
    $('body').append(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.fadeOut(300, function() { $(this).remove(); });
    }, 3000);
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
