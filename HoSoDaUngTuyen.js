// ==================== APPLICATION MANAGEMENT SYSTEM ====================

class ApplicationManager {
    constructor() {
        this.applications = [];
        this.filteredApplications = [];
        this.currentFilter = {
            job: '',
            status: 'all',
            search: '',
            sort: 'default'
        };
        this.currentPage = 1;
        this.itemsPerPage = 10;
        
        this.init();
    }

    init() {
        this.loadSampleData();
        this.attachEventListeners();
        this.renderTable();
        this.updateStatusCounts();
    }

    // Load sample data
    loadSampleData() {
        // Sample applications data
        this.applications = [
            {
                id: 1,
                name: 'Nguyễn Văn An',
                email: 'nguyenvanan@email.com',
                phone: '0912345678',
                jobTitle: 'Tuyển dụng Frontend Developer',
                jobId: 'job1',
                matchScore: 85,
                appliedDate: new Date('2024-11-01'),
                status: 'suitable',
                experience: '2-5 năm',
                skills: ['JavaScript', 'React', 'HTML/CSS']
            },
            {
                id: 2,
                name: 'Trần Thị Bình',
                email: 'tranthibinh@email.com',
                phone: '0923456789',
                jobTitle: 'Tuyển dụng Backend Developer',
                jobId: 'job2',
                matchScore: 92,
                appliedDate: new Date('2024-11-05'),
                status: 'interviewing',
                experience: '2-5 năm',
                skills: ['Node.js', 'Python', 'SQL']
            },
            {
                id: 3,
                name: 'Lê Minh Công',
                email: 'leminhcong@email.com',
                phone: '0934567890',
                jobTitle: 'Tuyển dụng Full-stack Developer',
                jobId: 'job3',
                matchScore: 78,
                appliedDate: new Date('2024-11-10'),
                status: 'pending',
                experience: '1-2 năm',
                skills: ['JavaScript', 'Node.js', 'MongoDB']
            },
            {
                id: 4,
                name: 'Phạm Thu Dung',
                email: 'phamthudung@email.com',
                phone: '0945678901',
                jobTitle: 'Tuyển dụng Frontend Developer',
                jobId: 'job1',
                matchScore: 95,
                appliedDate: new Date('2024-11-12'),
                status: 'offered',
                experience: 'Trên 5 năm',
                skills: ['React', 'Vue.js', 'TypeScript']
            },
            {
                id: 5,
                name: 'Hoàng Văn Em',
                email: 'hoangvanem@email.com',
                phone: '0956789012',
                jobTitle: 'Tuyển dụng Backend Developer',
                jobId: 'job2',
                matchScore: 65,
                appliedDate: new Date('2024-11-08'),
                status: 'rejected',
                experience: 'Dưới 1 năm',
                skills: ['Java', 'Spring Boot']
            }
        ];

        this.filteredApplications = [...this.applications];
    }

    // Attach event listeners
    attachEventListeners() {
        // Filter by job
        document.getElementById('filterByJob')?.addEventListener('change', (e) => {
            this.currentFilter.job = e.target.value;
            this.applyFilters();
        });

        // Search input
        document.getElementById('searchInput')?.addEventListener('input', (e) => {
            this.currentFilter.search = e.target.value;
            this.applyFilters();
        });

        // Status filters
        document.querySelectorAll('.btn-status-filter').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Remove active from all buttons
                document.querySelectorAll('.btn-status-filter').forEach(b => b.classList.remove('active'));
                
                // Add active to clicked button
                this.classList.add('active');
                
                // Get status from data attribute
                const status = this.getAttribute('data-status');
                appManager.currentFilter.status = status;
                appManager.applyFilters();
            });
        });

        // Sort
        document.getElementById('sortBy')?.addEventListener('change', (e) => {
            this.currentFilter.sort = e.target.value;
            this.applySort();
        });

        // Advanced filter modal
        document.getElementById('btnAdvancedFilter')?.addEventListener('click', () => {
            const modal = new bootstrap.Modal(document.getElementById('advancedFilterModal'));
            modal.show();
            
            // Initialize tooltips
            const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
            [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
        });

        // Clear advanced filter
        document.getElementById('clearAdvancedFilter')?.addEventListener('click', () => {
            // Uncheck all checkboxes in advanced filter
            document.querySelectorAll('#advancedFilterModal input[type="checkbox"]').forEach(checkbox => {
                checkbox.checked = false;
            });
        });

        document.getElementById('applyAdvancedFilter')?.addEventListener('click', () => {
            // Collect all selected filters
            const filters = {
                salary: [],
                experience: [],
                education: [],
                deadline: [],
                source: [],
                note: [],
                jobStatus: [],
                marriage: [],
                gender: [],
                cvStatus: []
            };

            // Get all checked checkboxes
            document.querySelectorAll('#advancedFilterModal input[type="checkbox"]:checked').forEach(checkbox => {
                const id = checkbox.id;
                const value = checkbox.value;

                if (id.startsWith('salary')) filters.salary.push(value);
                else if (id.startsWith('exp')) filters.experience.push(value);
                else if (id.startsWith('edu')) filters.education.push(value);
                else if (id.startsWith('deadline')) filters.deadline.push(value);
                else if (id.startsWith('source')) filters.source.push(value);
                else if (id.startsWith('note')) filters.note.push(value);
                else if (id.startsWith('jobStatus')) filters.jobStatus.push(value);
                else if (id.startsWith('marriage')) filters.marriage.push(value);
                else if (id.startsWith('gender')) filters.gender.push(value);
                else if (id.startsWith('cvStatus')) filters.cvStatus.push(value);
            });

            console.log('Advanced filters applied:', filters);
            
            // Apply filters logic here
            bootstrap.Modal.getInstance(document.getElementById('advancedFilterModal')).hide();
            this.applyFilters();
        });

        // Tag filter modal
        document.getElementById('btnTagFilter')?.addEventListener('click', () => {
            const modal = new bootstrap.Modal(document.getElementById('tagFilterModal'));
            modal.show();
        });

        document.getElementById('applyTagFilter')?.addEventListener('click', () => {
            // Apply tag filters logic here
            bootstrap.Modal.getInstance(document.getElementById('tagFilterModal')).hide();
            this.applyFilters();
        });

        // Export list
        document.getElementById('btnExportList')?.addEventListener('click', () => {
            this.exportList();
        });

        // Select all checkbox
        document.getElementById('selectAll')?.addEventListener('change', (e) => {
            document.querySelectorAll('.select-application').forEach(checkbox => {
                checkbox.checked = e.target.checked;
            });
        });
    }

    // Apply filters
    applyFilters() {
        this.filteredApplications = this.applications.filter(app => {
            // Filter by job
            if (this.currentFilter.job && app.jobId !== this.currentFilter.job) {
                return false;
            }

            // Filter by status
            if (this.currentFilter.status !== 'all' && app.status !== this.currentFilter.status) {
                return false;
            }

            // Filter by search
            if (this.currentFilter.search) {
                const searchLower = this.currentFilter.search.toLowerCase();
                const searchFields = [
                    app.name,
                    app.email,
                    app.phone,
                    app.jobTitle
                ].join(' ').toLowerCase();
                
                if (!searchFields.includes(searchLower)) {
                    return false;
                }
            }

            return true;
        });

        this.applySort();
    }

    // Apply sorting
    applySort() {
        const sortType = this.currentFilter.sort;

        switch (sortType) {
            case 'match-asc':
                this.filteredApplications.sort((a, b) => a.matchScore - b.matchScore);
                break;
            case 'match-desc':
                this.filteredApplications.sort((a, b) => b.matchScore - a.matchScore);
                break;
            case 'name-asc':
                this.filteredApplications.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                this.filteredApplications.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'date-asc':
                this.filteredApplications.sort((a, b) => a.appliedDate - b.appliedDate);
                break;
            case 'date-desc':
                this.filteredApplications.sort((a, b) => b.appliedDate - a.appliedDate);
                break;
            default:
                // Default sorting (by ID)
                this.filteredApplications.sort((a, b) => a.id - b.id);
        }

        this.currentPage = 1;
        this.renderTable();
    }

    // Update status counts
    updateStatusCounts() {
        const counts = {
            all: this.applications.length,
            pending: 0,
            suitable: 0,
            interviewing: 0,
            offered: 0,
            hired: 0,
            rejected: 0
        };

        this.applications.forEach(app => {
            counts[app.status]++;
        });

        // Update badge counts in buttons
        document.querySelectorAll('.btn-status-filter').forEach(btn => {
            const status = btn.getAttribute('data-status');
            const badge = btn.querySelector('.badge');
            if (badge && counts[status] !== undefined) {
                badge.textContent = counts[status];
            }
        });
    }

    // Render table
    renderTable() {
        const tbody = document.getElementById('applicationsTableBody');
        const displayCount = document.getElementById('displayCount');
        
        if (!tbody) return;

        // Update display count
        if (displayCount) {
            displayCount.textContent = this.filteredApplications.length;
        }

        // Check if empty
        if (this.filteredApplications.length === 0) {
            tbody.innerHTML = `
                <tr class="empty-state">
                    <td colspan="7" class="text-center py-5">
                        <div class="d-flex flex-column align-items-center justify-content-center" style="min-height: 300px;">
                            <div class="mb-4" style="font-size: 5rem; color: var(--text-gray); opacity: 0.3;">
                                <i class="bi bi-file-earmark-text"></i>
                                <i class="bi bi-search" style="font-size: 3rem; margin-left: -2rem; margin-top: 2rem;"></i>
                            </div>
                            <h5 class="text-muted fw-semibold mb-2">Không tìm thấy hồ sơ phù hợp</h5>
                            <p class="text-muted mb-0">Thử điều chỉnh bộ lọc để xem thêm kết quả</p>
                        </div>
                    </td>
                </tr>
            `;
            document.getElementById('paginationContainer').style.display = 'none';
            return;
        }

        // Pagination
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const paginatedApps = this.filteredApplications.slice(start, end);

        // Render rows
        tbody.innerHTML = paginatedApps.map(app => `
            <tr data-id="${app.id}">
                <td class="px-4">
                    <input type="checkbox" class="form-check-input select-application" data-id="${app.id}">
                </td>
                <td class="px-4">
                    <div class="d-flex align-items-center gap-3">
                        <div class="avatar-circle">
                            ${app.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div class="fw-semibold" style="color: var(--text-dark);">${app.name}</div>
                            <small class="text-muted">
                                <i class="bi bi-envelope me-1"></i>${app.email}
                            </small>
                            <br>
                            <small class="text-muted">
                                <i class="bi bi-telephone me-1"></i>${app.phone}
                            </small>
                        </div>
                    </div>
                </td>
                <td class="px-4 text-center">
                    <div class="match-score ${this.getMatchClass(app.matchScore)}">
                        ${app.matchScore}%
                    </div>
                </td>
                <td class="px-4">
                    <div class="fw-semibold" style="color: var(--text-dark);">${app.jobTitle}</div>
                    <small class="text-muted">
                        <i class="bi bi-briefcase me-1"></i>${app.experience}
                    </small>
                </td>
                <td class="px-4 text-center">
                    <div class="fw-semibold" style="color: var(--text-dark);">${this.formatDate(app.appliedDate)}</div>
                    <small class="text-muted">${this.getTimeAgo(app.appliedDate)}</small>
                </td>
                <td class="px-4 text-center">
                    <span class="status-badge ${this.getStatusClass(app.status)}">
                        ${this.getStatusText(app.status)}
                    </span>
                </td>
                <td class="px-4 text-center">
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-outline-primary" onclick="appManager.viewDetail(${app.id})" title="Xem chi tiết">
                            <i class="bi bi-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-success" onclick="appManager.changeStatus(${app.id})" title="Thay đổi trạng thái">
                            <i class="bi bi-check-circle"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="appManager.deleteApplication(${app.id})" title="Xóa">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Update pagination
        this.renderPagination();
    }

    // Render pagination
    renderPagination() {
        const totalPages = Math.ceil(this.filteredApplications.length / this.itemsPerPage);
        const paginationContainer = document.getElementById('paginationContainer');
        const pagination = document.getElementById('pagination');

        if (totalPages <= 1) {
            paginationContainer.style.display = 'none';
            return;
        }

        paginationContainer.style.display = 'block';

        let paginationHTML = '';

        // Previous button
        paginationHTML += `
            <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="appManager.goToPage(${this.currentPage - 1}); return false;">
                    <i class="bi bi-chevron-left"></i>
                </a>
            </li>
        `;

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
                paginationHTML += `
                    <li class="page-item ${i === this.currentPage ? 'active' : ''}">
                        <a class="page-link" href="#" onclick="appManager.goToPage(${i}); return false;">${i}</a>
                    </li>
                `;
            } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
                paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
            }
        }

        // Next button
        paginationHTML += `
            <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="appManager.goToPage(${this.currentPage + 1}); return false;">
                    <i class="bi bi-chevron-right"></i>
                </a>
            </li>
        `;

        pagination.innerHTML = paginationHTML;

        // Update showing text
        const start = (this.currentPage - 1) * this.itemsPerPage + 1;
        const end = Math.min(this.currentPage * this.itemsPerPage, this.filteredApplications.length);
        document.getElementById('showingFrom').textContent = start;
        document.getElementById('showingTo').textContent = end;
        document.getElementById('totalRecords').textContent = this.filteredApplications.length;
    }

    // Go to page
    goToPage(page) {
        const totalPages = Math.ceil(this.filteredApplications.length / this.itemsPerPage);
        if (page < 1 || page > totalPages) return;
        this.currentPage = page;
        this.renderTable();
    }

    // Get match class
    getMatchClass(score) {
        if (score >= 80) return 'match-high';
        if (score >= 60) return 'match-medium';
        return 'match-low';
    }

    // Get status class
    getStatusClass(status) {
        const classes = {
            pending: 'bg-warning text-dark',
            suitable: 'bg-success',
            interviewing: 'bg-info',
            offered: 'bg-primary',
            hired: 'bg-success',
            rejected: 'bg-danger'
        };
        return classes[status] || 'bg-secondary';
    }

    // Get status text
    getStatusText(status) {
        const texts = {
            pending: 'Chờ đánh giá',
            suitable: 'Phù hợp',
            interviewing: 'Đang phỏng vấn',
            offered: 'Đã gửi offer',
            hired: 'Đã tuyển',
            rejected: 'Không phù hợp'
        };
        return texts[status] || status;
    }

    // Format date
    formatDate(date) {
        return new Date(date).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    // Get time ago
    getTimeAgo(date) {
        const now = new Date();
        const diff = now - new Date(date);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        if (days === 0) return 'Hôm nay';
        if (days === 1) return 'Hôm qua';
        if (days < 7) return `${days} ngày trước`;
        if (days < 30) return `${Math.floor(days / 7)} tuần trước`;
        return `${Math.floor(days / 30)} tháng trước`;
    }

    // View detail
    viewDetail(id) {
        const app = this.applications.find(a => a.id === id);
        if (!app) return;
        
        alert(`Xem chi tiết hồ sơ: ${app.name}\nEmail: ${app.email}\nĐiện thoại: ${app.phone}`);
        // In real application, show modal or navigate to detail page
    }

    // Change status
    changeStatus(id) {
        const app = this.applications.find(a => a.id === id);
        if (!app) return;

        const statuses = [
            { value: 'pending', text: 'Chờ đánh giá' },
            { value: 'suitable', text: 'Phù hợp' },
            { value: 'interviewing', text: 'Đang phỏng vấn' },
            { value: 'offered', text: 'Đã gửi offer' },
            { value: 'hired', text: 'Đã tuyển' },
            { value: 'rejected', text: 'Không phù hợp' }
        ];

        const statusOptions = statuses.map(s => `${s.value}. ${s.text}`).join('\n');
        const newStatus = prompt(`Chọn trạng thái mới cho ${app.name}:\n\n${statusOptions}\n\nNhập giá trị (pending/suitable/interviewing/offered/hired/rejected):`, app.status);

        if (newStatus && statuses.find(s => s.value === newStatus)) {
            app.status = newStatus;
            this.updateStatusCounts();
            this.renderTable();
        }
    }

    // Delete application
    deleteApplication(id) {
        const app = this.applications.find(a => a.id === id);
        if (!app) return;

        if (confirm(`Bạn có chắc muốn xóa hồ sơ của ${app.name}?`)) {
            this.applications = this.applications.filter(a => a.id !== id);
            this.updateStatusCounts();
            this.applyFilters();
        }
    }

    // Export list
    exportList() {
        const csvContent = this.generateCSV();
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `danh_sach_ung_vien_${new Date().getTime()}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Generate CSV
    generateCSV() {
        const headers = ['STT', 'Họ tên', 'Email', 'Điện thoại', 'Tin đăng', 'Mức độ phù hợp', 'Ngày ứng tuyển', 'Trạng thái'];
        const rows = this.filteredApplications.map((app, index) => [
            index + 1,
            app.name,
            app.email,
            app.phone,
            app.jobTitle,
            `${app.matchScore}%`,
            this.formatDate(app.appliedDate),
            this.getStatusText(app.status)
        ]);

        const csvRows = [headers, ...rows].map(row => row.join(',')).join('\n');
        return '\uFEFF' + csvRows; // Add BOM for UTF-8
    }
}

// Initialize when DOM is ready
let appManager;
document.addEventListener('DOMContentLoaded', () => {
    appManager = new ApplicationManager();
});
