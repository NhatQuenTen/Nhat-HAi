document.addEventListener("DOMContentLoaded", () => {
    const tbody = document.getElementById("data-body");
    const downloadBtn = document.getElementById('downloadBtn');
    const addPostBtn = document.getElementById('addPostBtn');

    // ===========================
    // DỮ LIỆU MẪU THÊM TRỰC TIẾP
    // ===========================
    let currentData = [
        {
            id: 1,
            title: "Tuyển nhân viên bán hàng",
            time: "2025-01-23 10:00:00",
            applied: 12
        },
        {
            id: 2,
            title: "Tuyển kế toán tổng hợp",
            time: "2025-01-24 09:30:00",
            applied: 7
        },
        {
            id: 3,
            title: "Nhân viên IT Helpdesk",
            time: "2025-01-25 15:10:00",
            applied: 4
        },
        {
            id: 4,
            title: "Chuyên viên Marketing",
            time: "2025-01-26 08:20:00",
            applied: 9
        },
        {
            id: 5,
            title: "Nhân viên kế toán ",
            time: "2024-02-18 20:10:00",
            applied: 3
        },
           {
            id: 6,
            title: "Nhân viên IT Backend ",
            time: "2025-03-11 9:10:00",
            applied: 3
        },
        {
            id: 7,
            title: "Nhân viên IT Frontend ",
            time: "2025-01-28 3:40:00",
            applied: 3
        }
    ];

    // Render ngay lập tức khi load trang
    renderTable(currentData);

    // Hàm render bảng
    function renderTable(data) {
        tbody.innerHTML = "";
        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4">Chưa có dữ liệu</td></tr>`;
            return;
        }
        data.forEach(item => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${item.id}</td>
                <td>${item.title}</td>
                <td>${item.time}</td>
                <td>${item.applied}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Nút đăng tin mới
    addPostBtn.addEventListener("click", () => {
        window.location.href = "Trang-quản-lí-đăng-tin-tuyen-dung.html";
    });

    // Nút tải CSV
    downloadBtn.addEventListener("click", () => {
        if (currentData.length === 0) {
            alert("Chưa có dữ liệu để tải xuống!");
            return;
        }

        let csvContent = "\uFEFF";
        csvContent += `"Số thứ tự","Tên tin đăng","Thời gian đăng","Hồ sơ nộp"\n`;

        currentData.forEach(item => {
            csvContent += `"${item.id}","${item.title}","=\"${item.time}\"","${item.applied}"\n`;
        });

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");

        a.href = url;
        a.download = "danh_sach_tin_dang.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // ========== DROPDOWN LỌC ==========
    const selectBox = document.querySelector(".custom-select");
    const selectedText = selectBox.querySelector(".selected-text");
    const optionItems = selectBox.querySelectorAll(".options div");

    // Click mở/đóng dropdown
    selectBox.querySelector(".selected").addEventListener("click", () => {
        selectBox.classList.toggle("open");
    });

    // Xử lý chọn trong dropdown
    optionItems.forEach(opt => {
        opt.addEventListener("click", () => {
            const value = opt.innerText.trim();
            selectedText.innerText = value;

            let filtered = [...currentData];

            if (value === "Mới nhất") {
                filtered.sort((a, b) => new Date(b.time) - new Date(a.time));
            }
            else if (value === "Cũ nhất") {
                filtered.sort((a, b) => new Date(a.time) - new Date(b.time));
            }
            else {
                filtered = [...currentData]; // Tất cả
            }

            renderTable(filtered);

            // Đóng dropdown
            selectBox.classList.remove("open");
        });
    });

});
