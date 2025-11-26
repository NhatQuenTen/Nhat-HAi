/**
 * Quản Lý Tin Đăng Tuyển Dụng - User Specific Version
 * Features: User-based data, Edit, Delete, Real Statistics
 */

document.addEventListener("DOMContentLoaded", () => {
    // Kiểm tra đăng nhập
    const currentUser = getCurrentUser();
    if (!currentUser) {
        alert('Vui lòng đăng nhập!');
        window.location.href = 'DangNhap.html';
        return;
    }

    // DOM Elements
    const tbody = document.getElementById("data-body");
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const sortFilter = document.getElementById('sortFilter');
    const downloadBtn = document.getElementById('downloadBtn');
    
    // Statistics Elements
    const totalPostsEl = document.getElementById('totalPosts');
    const activePostsEl = document.getElementById('activePosts');
    const totalApplicationsEl = document.getElementById('totalApplications');
    const newApplicationsEl = document.getElementById('newApplications');

    // Lấy dữ liệu tin đăng từ localStorage
    let allJobPosts = JSON.parse(localStorage.getItem('jobPosts')) || [];
    
    // Khởi tạo dữ liệu mẫu CHỈ KHI chưa có bất kỳ tin đăng nào (lần đầu tiên sử dụng hệ thống)
    if (allJobPosts.length === 0) {
        initializeSampleData();
        allJobPosts = JSON.parse(localStorage.getItem('jobPosts')) || [];
    }
    
    // Lọc chỉ lấy tin đăng của user hiện tại
    let jobPosts = allJobPosts.filter(job => job.userId === currentUser.id);
    let filteredData = [...jobPosts];

    // Initialize
    updateStatistics();
    renderTable(filteredData);

    // Event Listeners
    searchInput.addEventListener('input', handleFilter);
    statusFilter.addEventListener('change', handleFilter);
    sortFilter.addEventListener('change', handleSort);
    downloadBtn.addEventListener('click', downloadCSV);

    // Functions
    function initializeSampleData() {
        const sampleJobs = [
            {
                id: Date.now() + 1,
                userId: currentUser.id,
                title: "Frontend Developer (ReactJS)",
                company: currentUser.companyName || "Công ty của bạn",
                postDate: new Date().toISOString().split('T')[0],
                deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                applications: 0,
                newApplications: 0,
                status: "active",
                salary: "20-30 triệu VNĐ",
                location: "Hà Nội",
                description: "Tuyển Frontend Developer có kinh nghiệm ReactJS"
            },
            {
                id: Date.now() + 2,
                userId: currentUser.id,
                title: "Backend Developer (Node.js)",
                company: currentUser.companyName || "Công ty của bạn",
                postDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                applications: 0,
                newApplications: 0,
                status: "active",
                salary: "25-35 triệu VNĐ",
                location: "TP.HCM",
                description: "Tuyển Backend Developer Node.js"
            },
            {
                id: Date.now() + 3,
                userId: currentUser.id,
                title: "UI/UX Designer",
                company: currentUser.companyName || "Công ty của bạn",
                postDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                applications: 0,
                newApplications: 0,
                status: "active",
                salary: "15-25 triệu VNĐ",
                location: "Đà Nẵng",
                description: "Tuyển UI/UX Designer có kinh nghiệm"
            },
            {
                id: Date.now() + 4,
                userId: currentUser.id,
                title: "Full Stack Developer",
                company: currentUser.companyName || "Công ty của bạn",
                postDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                applications: 0,
                newApplications: 0,
                status: "pending",
                salary: "30-40 triệu VNĐ",
                location: "Hà Nội",
                description: "Tuyển Full Stack Developer"
            },
            {
                id: Date.now() + 5,
                userId: currentUser.id,
                title: "Mobile Developer (Flutter)",
                company: currentUser.companyName || "Công ty của bạn",
                postDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                applications: 0,
                newApplications: 0,
                status: "active",
                salary: "22-32 triệu VNĐ",
                location: "TP.HCM",
                description: "Tuyển Mobile Developer Flutter"
            }
        ];
        
        localStorage.setItem('jobPosts', JSON.stringify(sampleJobs));
    }

    function updateStatistics() {
        totalPostsEl.textContent = jobPosts.length;
        activePostsEl.textContent = jobPosts.filter(job => job.status === 'active').length;
        totalApplicationsEl.textContent = jobPosts.reduce((sum, job) => sum + job.applications, 0);
        newApplicationsEl.textContent = jobPosts.reduce((sum, job) => sum + job.newApplications, 0);
    }

    function handleFilter() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const statusValue = statusFilter.value;

        filteredData = jobPosts.filter(job => {
            const matchSearch = job.title.toLowerCase().includes(searchTerm) || 
                               job.company.toLowerCase().includes(searchTerm);
            const matchStatus = statusValue === 'all' || job.status === statusValue;
            
            return matchSearch && matchStatus;
        });

        handleSort();
    }

    function handleSort() {
        const sortValue = sortFilter.value;

        switch(sortValue) {
            case 'newest':
                filteredData.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));
                break;
            case 'oldest':
                filteredData.sort((a, b) => new Date(a.postDate) - new Date(b.postDate));
                break;
            case 'most-applied':
                filteredData.sort((a, b) => b.applications - a.applications);
                break;
        }

        renderTable(filteredData);
    }

    function renderTable(data) {
        tbody.innerHTML = "";
        
        if (data.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7">
                        <div class="empty-state">
                            <i class="bi bi-inbox"></i>
                            <h5>Không tìm thấy tin đăng</h5>
                            <p>Bạn chưa có tin đăng nào hoặc không có kết quả phù hợp</p>
                            <button class="btn-modern btn-primary-modern mt-3" onclick="window.location.href='Trang-Dang-Tin-Tuyen-Dung.html'">
                                <i class="bi bi-plus-lg"></i> Đăng tin mới
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        data.forEach((job, index) => {
            const tr = document.createElement("tr");
            
            const statusBadge = getStatusBadge(job.status);
            const newBadge = job.newApplications > 0 ? 
                `<span class="badge bg-danger rounded-pill ms-1">${job.newApplications} mới</span>` : '';
            
            tr.innerHTML = `
                <td class="text-center fw-bold text-muted">${index + 1}</td>
                <td>
                    <div class="job-title">${job.title}</div>
                    <div class="job-company">
                        <i class="bi bi-building me-1"></i>${job.company} 
                        <span class="mx-2">•</span>
                        <i class="bi bi-geo-alt me-1"></i>${job.location}
                    </div>
                </td>
                <td>
                    <div class="text-dark">${formatDate(job.postDate)}</div>
                </td>
                <td>
                    <div class="text-dark">${formatDate(job.deadline)}</div>
                    <small class="text-muted">${getDaysRemaining(job.deadline)}</small>
                </td>
                <td class="text-center">
                    <div class="fw-bold text-primary">${job.applications}</div>
                    ${newBadge}
                </td>
                <td>
                    ${statusBadge}
                </td>
                <td class="text-center">
                    <button class="action-btn" title="Xem chi tiết" onclick="viewDetails(${job.id})">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="action-btn" title="Chỉnh sửa" onclick="editJob(${job.id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="action-btn" title="Xóa" onclick="deleteJob(${job.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            
            tbody.appendChild(tr);
        });
    }

    function getStatusBadge(status) {
        const badges = {
            'active': '<span class="badge-modern badge-active"><i class="bi bi-check-circle me-1"></i>Đang hoạt động</span>',
            'pending': '<span class="badge-modern badge-pending"><i class="bi bi-clock me-1"></i>Chờ duyệt</span>',
            'closed': '<span class="badge-modern badge-closed"><i class="bi bi-x-circle me-1"></i>Đã đóng</span>'
        };
        return badges[status] || '';
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    function getDaysRemaining(deadline) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const end = new Date(deadline);
        end.setHours(0, 0, 0, 0);
        const diffTime = end - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return '<span class="text-danger">Đã hết hạn</span>';
        if (diffDays === 0) return '<span class="text-warning">Hết hạn hôm nay</span>';
        if (diffDays === 1) return '<span class="text-warning">Còn 1 ngày</span>';
        if (diffDays <= 7) return `<span class="text-warning">Còn ${diffDays} ngày</span>`;
        return `<span class="text-success">Còn ${diffDays} ngày</span>`;
    }

    function downloadCSV() {
        if (filteredData.length === 0) {
            showToast("Không có dữ liệu để xuất!", 'error');
            return;
        }

        let csvContent = "\uFEFF"; // BOM for UTF-8
        csvContent += "STT,Tên tin đăng,Công ty,Ngày đăng,Hạn nộp,Số ứng viên,Ứng viên mới,Trạng thái,Mức lương,Địa điểm\n";

        filteredData.forEach((job, index) => {
            csvContent += `${index + 1},"${job.title}","${job.company}","${job.postDate}","${job.deadline}",${job.applications},${job.newApplications},"${getStatusText(job.status)}","${job.salary}","${job.location}"\n`;
        });

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        
        const date = new Date();
        const fileName = `Tin_dang_${currentUser.companyName || 'CongTy'}_${date.getFullYear()}${String(date.getMonth()+1).padStart(2,'0')}${String(date.getDate()).padStart(2,'0')}.csv`;
        
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        showToast('Xuất file thành công!', 'success');
    }

    function getStatusText(status) {
        const texts = {
            'active': 'Đang hoạt động',
            'pending': 'Chờ duyệt',
            'closed': 'Đã đóng'
        };
        return texts[status] || '';
    }

    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type}`;
        const icon = type === 'success' ? 'check-circle' : 
                     type === 'error' ? 'exclamation-triangle' : 'info-circle';
        toast.innerHTML = `
            <i class="bi bi-${icon}-fill"></i>
            <span>${message}</span>
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            .toast-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.15);
                display: flex;
                align-items: center;
                gap: 0.75rem;
                z-index: 9999;
                animation: slideIn 0.3s ease;
                font-weight: 500;
            }
            .toast-success { 
                border-left: 4px solid #22C55E; 
                color: #16A34A;
            }
            .toast-success i { color: #22C55E; font-size: 1.5rem; }
            .toast-error { 
                border-left: 4px solid #EF4444; 
                color: #DC2626;
            }
            .toast-error i { color: #EF4444; font-size: 1.5rem; }
            .toast-info { 
                border-left: 4px solid #2176FF; 
                color: #0D47A1;
            }
            .toast-info i { color: #2176FF; font-size: 1.5rem; }
            @keyframes slideIn {
                from { transform: translateX(400px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        
        if (!document.querySelector('style[data-toast]')) {
            style.setAttribute('data-toast', '');
            document.head.appendChild(style);
        }
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Global functions for action buttons
    window.viewDetails = function(id) {
        const job = allJobPosts.find(j => j.id === id);
        if (job) {
            const details = `
                <strong>${job.title}</strong><br>
                <strong>Công ty:</strong> ${job.company}<br>
                <strong>Địa điểm:</strong> ${job.location}<br>
                <strong>Mức lương:</strong> ${job.salary}<br>
                <strong>Số ứng viên:</strong> ${job.applications}<br>
                <strong>Trạng thái:</strong> ${getStatusText(job.status)}<br>
                <strong>Ngày đăng:</strong> ${formatDate(job.postDate)}<br>
                <strong>Hạn nộp:</strong> ${formatDate(job.deadline)}
            `;
            
            // Tạo modal để hiển thị chi tiết
            const modal = document.createElement('div');
            modal.innerHTML = `
                <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 10000; display: flex; align-items: center; justify-content: center;" onclick="this.parentElement.remove()">
                    <div style="background: white; border-radius: 16px; padding: 2rem; max-width: 500px; width: 90%;" onclick="event.stopPropagation()">
                        <h4 class="mb-3">Chi tiết tin đăng</h4>
                        <div class="mb-4">${details}</div>
                        <button class="btn-modern btn-primary-modern" onclick="this.closest('div').parentElement.remove()">
                            Đóng
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }
    };

    window.editJob = function(id) {
        const job = allJobPosts.find(j => j.id === id);
        if (!job) {
            showToast('Không tìm thấy tin đăng!', 'error');
            return;
        }

        // Tạo modal chỉnh sửa
        const modal = document.createElement('div');
        modal.innerHTML = `
            <div class="edit-modal-overlay" onclick="this.parentElement.remove()">
                <div class="edit-modal-content" onclick="event.stopPropagation()">
                    <div class="edit-modal-header">
                        <h4><i class="bi bi-pencil-square me-2"></i>Chỉnh sửa tin đăng</h4>
                        <button class="btn-close-modal" onclick="this.closest('.edit-modal-overlay').parentElement.remove()">
                            <i class="bi bi-x-lg"></i>
                        </button>
                    </div>
                    
                    <form id="editJobForm" class="edit-modal-body">
                        <div class="row g-3">
                            <div class="col-12">
                                <label class="form-label fw-semibold">Tiêu đề tin đăng <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="edit_title" value="${job.title}" required>
                            </div>
                            
                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Địa điểm <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="edit_location" value="${job.location}" required>
                            </div>
                            
                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Mức lương</label>
                                <input type="text" class="form-control" id="edit_salary" value="${job.salary}">
                            </div>
                            
                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Hạn nộp hồ sơ <span class="text-danger">*</span></label>
                                <input type="date" class="form-control" id="edit_deadline" value="${job.deadline}" required>
                            </div>
                            
                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Trạng thái</label>
                                <select class="form-select" id="edit_status">
                                    <option value="pending" ${job.status === 'pending' ? 'selected' : ''}>Chờ duyệt</option>
                                    <option value="active" ${job.status === 'active' ? 'selected' : ''}>Đang hoạt động</option>
                                    <option value="closed" ${job.status === 'closed' ? 'selected' : ''}>Đã đóng</option>
                                </select>
                            </div>
                            
                            <div class="col-12">
                                <label class="form-label fw-semibold">Mô tả công việc</label>
                                <textarea class="form-control" id="edit_description" rows="3">${job.description || ''}</textarea>
                            </div>
                            
                            <div class="col-12">
                                <label class="form-label fw-semibold">Yêu cầu</label>
                                <textarea class="form-control" id="edit_requirements" rows="3">${job.requirements || ''}</textarea>
                            </div>
                        </div>
                    </form>
                    
                    <div class="edit-modal-footer">
                        <button type="button" class="btn btn-outline-secondary" onclick="this.closest('.edit-modal-overlay').parentElement.remove()">
                            <i class="bi bi-x-circle me-2"></i>Hủy
                        </button>
                        <button type="button" class="btn btn-primary" onclick="saveEditJob(${id})">
                            <i class="bi bi-check-circle me-2"></i>Lưu thay đổi
                        </button>
                    </div>
                </div>
            </div>
            
            <style>
                .edit-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.6);
                    backdrop-filter: blur(4px);
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: fadeIn 0.3s ease;
                }
                
                .edit-modal-content {
                    background: white;
                    border-radius: 20px;
                    max-width: 800px;
                    width: 95%;
                    max-height: 90vh;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    animation: slideUp 0.3s ease;
                }
                
                .edit-modal-header {
                    padding: 1.5rem 2rem;
                    border-bottom: 2px solid #E2E8F0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .edit-modal-header h4 {
                    margin: 0;
                    color: #1E293B;
                    font-weight: 700;
                }
                
                .btn-close-modal {
                    width: 36px;
                    height: 36px;
                    border-radius: 8px;
                    border: none;
                    background: transparent;
                    color: #64748B;
                    cursor: pointer;
                    transition: all 0.3s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .btn-close-modal:hover {
                    background: rgba(239, 68, 68, 0.1);
                    color: #EF4444;
                }
                
                .edit-modal-body {
                    padding: 2rem;
                    overflow-y: auto;
                    flex: 1;
                }
                
                .edit-modal-footer {
                    padding: 1.5rem 2rem;
                    border-top: 2px solid #E2E8F0;
                    display: flex;
                    gap: 1rem;
                    justify-content: flex-end;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideUp {
                    from { 
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            </style>
        `;
        
        document.body.appendChild(modal);
        
        // Set min date for deadline
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        document.getElementById('edit_deadline').setAttribute('min', tomorrow.toISOString().split('T')[0]);
    };

    window.saveEditJob = function(id) {
        // Validate form
        const title = document.getElementById('edit_title').value.trim();
        const location = document.getElementById('edit_location').value.trim();
        const deadline = document.getElementById('edit_deadline').value;
        
        if (!title || !location || !deadline) {
            showToast('Vui lòng điền đầy đủ thông tin bắt buộc!', 'error');
            return;
        }
        
        // Tìm và cập nhật job
        const jobIndex = allJobPosts.findIndex(j => j.id === id);
        if (jobIndex === -1) {
            showToast('Không tìm thấy tin đăng!', 'error');
            return;
        }
        
        // Update job data
        allJobPosts[jobIndex] = {
            ...allJobPosts[jobIndex],
            title: title,
            location: location,
            salary: document.getElementById('edit_salary').value.trim() || 'Thỏa thuận',
            deadline: deadline,
            status: document.getElementById('edit_status').value,
            description: document.getElementById('edit_description').value.trim(),
            requirements: document.getElementById('edit_requirements').value.trim()
        };
        
        // Lưu vào localStorage
        localStorage.setItem('jobPosts', JSON.stringify(allJobPosts));
        
        // Cập nhật lại jobPosts và filteredData
        jobPosts = allJobPosts.filter(job => job.userId === currentUser.id);
        
        // Apply current filters again
        handleFilter();
        updateStatistics();
        
        // Đóng modal
        document.querySelector('.edit-modal-overlay').parentElement.remove();
        
        // Show success message
        showToast('Đã cập nhật tin đăng thành công!', 'success');
    };

    window.deleteJob = function(id) {
        const job = allJobPosts.find(j => j.id === id);
        if (job && confirm(`Bạn có chắc muốn xóa tin đăng "${job.title}"?\n\nLưu ý: Hành động này không thể hoàn tác!`)) {
            // Xóa khỏi allJobPosts
            allJobPosts = allJobPosts.filter(j => j.id !== id);
            // Xóa khỏi jobPosts (tin của user hiện tại)
            jobPosts = jobPosts.filter(j => j.id !== id);
            // Xóa khỏi filteredData
            filteredData = filteredData.filter(j => j.id !== id);
            
            // Lưu lại vào localStorage
            localStorage.setItem('jobPosts', JSON.stringify(allJobPosts));
            
            // Cập nhật UI
            updateStatistics();
            renderTable(filteredData);
            showToast('Đã xóa tin đăng thành công!', 'success');
        }
    };
});
