// ==================== Saved Candidates Manager ====================

class SavedCandidatesManager {
    constructor() {
        this.savedCandidates = [];
        this.filteredCandidates = [];
        this.currentFilter = {
            search: '',
            position: '',
            experience: '',
            sort: 'newest'
        };
        this.currentPage = 1;
        this.itemsPerPage = 10;
        
        this.init();
    }

    init() {
        this.loadSavedCandidates();
        this.loadSampleData();
        this.attachEventListeners();
        this.applyFilters();
        this.updateStats();
    }

    loadSavedCandidates() {
        const saved = localStorage.getItem('savedCandidates');
        if (saved) {
            this.savedCandidates = JSON.parse(saved);
        }
    }

    saveCandidates() {
        localStorage.setItem('savedCandidates', JSON.stringify(this.savedCandidates));
    }

    loadSampleData() {
        // Nếu chưa có data mẫu, tạo một số ứng viên mẫu
        if (this.savedCandidates.length === 0) {
            this.savedCandidates = [
                {
                    id: 1,
                    name: 'Nguyễn Văn A',
                    position: 'Senior Frontend Developer',
                    avatar: '',
                    experience: '5 năm',
                    location: 'TP.HCM',
                    salary: '25-30 triệu',
                    skills: ['React', 'TypeScript', 'Next.js', 'TailwindCSS'],
                    education: 'Đại học Bách Khoa',
                    email: 'nguyenvana@email.com',
                    phone: '0901234567',
                    savedDate: '2025-11-20T10:30:00',
                    viewed: true,
                    notes: 'Ứng viên tiềm năng cho vị trí Frontend Lead'
                },
                {
                    id: 2,
                    name: 'Trần Thị B',
                    position: 'Backend Developer',
                    avatar: '',
                    experience: '3 năm',
                    location: 'Hà Nội',
                    salary: '20-25 triệu',
                    skills: ['Node.js', 'MongoDB', 'PostgreSQL', 'Docker'],
                    education: 'Đại học Công Nghệ',
                    email: 'tranthib@email.com',
                    phone: '0912345678',
                    savedDate: '2025-11-19T14:20:00',
                    viewed: false,
                    notes: ''
                },
                {
                    id: 3,
                    name: 'Lê Văn C',
                    position: 'Fullstack Developer',
                    avatar: '',
                    experience: '4 năm',
                    location: 'Đà Nẵng',
                    salary: '22-28 triệu',
                    skills: ['Vue.js', 'Laravel', 'MySQL', 'AWS'],
                    education: 'Đại học Duy Tân',
                    email: 'levanc@email.com',
                    phone: '0923456789',
                    savedDate: '2025-11-18T09:15:00',
                    viewed: true,
                    notes: 'Có kinh nghiệm làm việc với các dự án lớn'
                },
                {
                    id: 4,
                    name: 'Phạm Thị D',
                    position: 'UI/UX Designer',
                    avatar: '',
                    experience: '2 năm',
                    location: 'TP.HCM',
                    salary: '15-20 triệu',
                    skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping'],
                    education: 'Đại học Mỹ Thuật',
                    email: 'phamthid@email.com',
                    phone: '0934567890',
                    savedDate: '2025-11-17T16:45:00',
                    viewed: false,
                    notes: ''
                },
                {
                    id: 5,
                    name: 'Hoàng Văn E',
                    position: 'Mobile Developer',
                    avatar: '',
                    experience: '3 năm',
                    location: 'Hà Nội',
                    salary: '18-24 triệu',
                    skills: ['React Native', 'Flutter', 'iOS', 'Android'],
                    education: 'Đại học FPT',
                    email: 'hoangvane@email.com',
                    phone: '0945678901',
                    savedDate: '2025-11-21T08:00:00',
                    viewed: true,
                    notes: 'Chuyên về ứng dụng mobile cross-platform'
                }
            ];
            this.saveCandidates();
        }
    }

    attachEventListeners() {
        // Search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentFilter.search = e.target.value;
                this.currentPage = 1;
                this.applyFilters();
            });
        }

        // Position filter
        const positionFilter = document.getElementById('positionFilter');
        if (positionFilter) {
            positionFilter.addEventListener('change', (e) => {
                this.currentFilter.position = e.target.value;
                this.currentPage = 1;
                this.applyFilters();
            });
        }

        // Experience filter
        const experienceFilter = document.getElementById('experienceFilter');
        if (experienceFilter) {
            experienceFilter.addEventListener('change', (e) => {
                this.currentFilter.experience = e.target.value;
                this.currentPage = 1;
                this.applyFilters();
            });
        }

        // Sort filter
        const sortFilter = document.getElementById('sortFilter');
        if (sortFilter) {
            sortFilter.addEventListener('change', (e) => {
                this.currentFilter.sort = e.target.value;
                this.applyFilters();
            });
        }
    }

    applyFilters() {
        let filtered = [...this.savedCandidates];

        // Search filter
        if (this.currentFilter.search) {
            const searchLower = this.currentFilter.search.toLowerCase();
            filtered = filtered.filter(candidate => 
                candidate.name.toLowerCase().includes(searchLower) ||
                candidate.position.toLowerCase().includes(searchLower) ||
                candidate.skills.some(skill => skill.toLowerCase().includes(searchLower))
            );
        }

        // Position filter
        if (this.currentFilter.position) {
            filtered = filtered.filter(candidate => 
                candidate.position.toLowerCase().includes(this.currentFilter.position.toLowerCase())
            );
        }

        // Experience filter
        if (this.currentFilter.experience) {
            filtered = filtered.filter(candidate => {
                const exp = parseInt(candidate.experience);
                switch(this.currentFilter.experience) {
                    case '0-1': return exp < 1;
                    case '1-3': return exp >= 1 && exp <= 3;
                    case '3-5': return exp >= 3 && exp <= 5;
                    case '5+': return exp > 5;
                    default: return true;
                }
            });
        }

        // Sort
        switch(this.currentFilter.sort) {
            case 'newest':
                filtered.sort((a, b) => new Date(b.savedDate) - new Date(a.savedDate));
                break;
            case 'oldest':
                filtered.sort((a, b) => new Date(a.savedDate) - new Date(b.savedDate));
                break;
            case 'name':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                filtered.sort((a, b) => b.name.localeCompare(a.name));
                break;
        }

        this.filteredCandidates = filtered;
        this.renderCandidates();
        this.renderPagination();
    }

    renderCandidates() {
        const container = document.getElementById('candidatesList');
        if (!container) return;

        if (this.filteredCandidates.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">
                        <i class="bi bi-bookmark-x"></i>
                    </div>
                    <h3 class="empty-title">Chưa có hồ sơ đã lưu</h3>
                    <p class="empty-text">Bạn chưa lưu hồ sơ ứng viên nào. Hãy tìm kiếm và lưu những ứng viên phù hợp!</p>
                    <a href="TimUngVien.html" class="btn-primary">
                        <i class="bi bi-search"></i>
                        Tìm ứng viên
                    </a>
                </div>
            `;
            return;
        }

        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const paginatedCandidates = this.filteredCandidates.slice(start, end);

        container.innerHTML = paginatedCandidates.map(candidate => {
            const initials = candidate.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            const savedDate = new Date(candidate.savedDate);
            const daysAgo = Math.floor((new Date() - savedDate) / (1000 * 60 * 60 * 24));
            const timeText = daysAgo === 0 ? 'Hôm nay' : daysAgo === 1 ? 'Hôm qua' : `${daysAgo} ngày trước`;

            return `
                <div class="candidate-card" data-id="${candidate.id}">
                    <div class="candidate-header">
                        <div class="candidate-avatar">
                            ${candidate.avatar ? `<img src="${candidate.avatar}" alt="${candidate.name}">` : initials}
                        </div>
                        <div class="candidate-info">
                            <h3 class="candidate-name">${candidate.name}</h3>
                            <p class="candidate-position">${candidate.position}</p>
                            <div class="candidate-tags">
                                ${candidate.skills.slice(0, 4).map(skill => `<span class="tag primary">${skill}</span>`).join('')}
                                ${candidate.skills.length > 4 ? `<span class="tag">+${candidate.skills.length - 4} khác</span>` : ''}
                            </div>
                        </div>
                    </div>

                    <div class="candidate-meta">
                        <div class="meta-item">
                            <i class="bi bi-briefcase-fill"></i>
                            <span>${candidate.experience} kinh nghiệm</span>
                        </div>
                        <div class="meta-item">
                            <i class="bi bi-geo-alt-fill"></i>
                            <span>${candidate.location}</span>
                        </div>
                        <div class="meta-item">
                            <i class="bi bi-currency-dollar"></i>
                            <span>${candidate.salary}</span>
                        </div>
                        <div class="meta-item">
                            <i class="bi bi-mortarboard-fill"></i>
                            <span>${candidate.education}</span>
                        </div>
                    </div>

                    ${candidate.notes ? `
                        <div class="candidate-meta">
                            <div class="meta-item">
                                <i class="bi bi-sticky-fill"></i>
                                <span><em>${candidate.notes}</em></span>
                            </div>
                        </div>
                    ` : ''}

                    <div class="candidate-actions">
                        <span class="saved-badge">
                            <i class="bi bi-bookmark-fill"></i>
                            Đã lưu ${timeText}
                        </span>
                        <button class="btn-action btn-primary" onclick="savedManager.viewCandidate(${candidate.id})">
                            <i class="bi bi-eye-fill"></i>
                            Xem hồ sơ
                        </button>
                        <button class="btn-action btn-outline" onclick="savedManager.contactCandidate(${candidate.id})">
                            <i class="bi bi-envelope-fill"></i>
                            Liên hệ
                        </button>
                        <button class="btn-action btn-outline" onclick="savedManager.editNotes(${candidate.id})">
                            <i class="bi bi-pencil-fill"></i>
                            Ghi chú
                        </button>
                        <button class="btn-action btn-danger" onclick="savedManager.removeCandidate(${candidate.id})">
                            <i class="bi bi-bookmark-x-fill"></i>
                            Bỏ lưu
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderPagination() {
        const container = document.getElementById('pagination');
        if (!container || this.filteredCandidates.length === 0) {
            if (container) container.innerHTML = '';
            return;
        }

        const totalPages = Math.ceil(this.filteredCandidates.length / this.itemsPerPage);
        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }

        let paginationHTML = `
            <button class="page-btn" ${this.currentPage === 1 ? 'disabled' : ''} onclick="savedManager.goToPage(${this.currentPage - 1})">
                <i class="bi bi-chevron-left"></i>
            </button>
        `;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
                paginationHTML += `
                    <button class="page-btn ${i === this.currentPage ? 'active' : ''}" onclick="savedManager.goToPage(${i})">
                        ${i}
                    </button>
                `;
            } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
                paginationHTML += `<span>...</span>`;
            }
        }

        paginationHTML += `
            <button class="page-btn" ${this.currentPage === totalPages ? 'disabled' : ''} onclick="savedManager.goToPage(${this.currentPage + 1})">
                <i class="bi bi-chevron-right"></i>
            </button>
        `;

        container.innerHTML = paginationHTML;
    }

    goToPage(page) {
        this.currentPage = page;
        this.renderCandidates();
        this.renderPagination();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    updateStats() {
        const totalSaved = document.getElementById('totalSaved');
        const viewedCount = document.getElementById('viewedCount');
        const recentCount = document.getElementById('recentCount');

        if (totalSaved) totalSaved.textContent = this.savedCandidates.length;
        
        if (viewedCount) {
            const viewed = this.savedCandidates.filter(c => c.viewed).length;
            viewedCount.textContent = viewed;
        }

        if (recentCount) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const recent = this.savedCandidates.filter(c => new Date(c.savedDate) >= today).length;
            recentCount.textContent = recent;
        }
    }

    viewCandidate(id) {
        const candidate = this.savedCandidates.find(c => c.id === id);
        if (!candidate) return;

        // Mark as viewed
        candidate.viewed = true;
        this.saveCandidates();
        this.updateStats();

        // Show modal or redirect to candidate detail page
        alert(`Xem hồ sơ: ${candidate.name}\n\nEmail: ${candidate.email}\nPhone: ${candidate.phone}\n\nTính năng xem chi tiết đang phát triển...`);
    }

    contactCandidate(id) {
        const candidate = this.savedCandidates.find(c => c.id === id);
        if (!candidate) return;

        const message = `Xin chào ${candidate.name},\n\nChúng tôi rất quan tâm đến hồ sơ của bạn cho vị trí ${candidate.position}.\n\nVui lòng liên hệ lại để trao đổi thêm.\n\nTrân trọng!`;
        
        if (confirm(`Gửi email đến ${candidate.email}?`)) {
            window.location.href = `mailto:${candidate.email}?subject=Liên hệ về vị trí ${candidate.position}&body=${encodeURIComponent(message)}`;
        }
    }

    editNotes(id) {
        const candidate = this.savedCandidates.find(c => c.id === id);
        if (!candidate) return;

        const notes = prompt(`Ghi chú cho ${candidate.name}:`, candidate.notes || '');
        
        if (notes !== null) {
            candidate.notes = notes.trim();
            this.saveCandidates();
            this.applyFilters();
        }
    }

    removeCandidate(id) {
        const candidate = this.savedCandidates.find(c => c.id === id);
        if (!candidate) return;

        if (confirm(`Bạn có chắc muốn bỏ lưu hồ sơ của ${candidate.name}?`)) {
            this.savedCandidates = this.savedCandidates.filter(c => c.id !== id);
            this.saveCandidates();
            this.applyFilters();
            this.updateStats();
            
            this.showNotification(`Đã bỏ lưu hồ sơ của ${candidate.name}`, 'success');
        }
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} position-fixed top-0 start-50 translate-middle-x mt-3`;
        notification.style.zIndex = '9999';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize
let savedManager;
document.addEventListener('DOMContentLoaded', () => {
    savedManager = new SavedCandidatesManager();
});
