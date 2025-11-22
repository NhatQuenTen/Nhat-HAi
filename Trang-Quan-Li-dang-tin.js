document.addEventListener("DOMContentLoaded", () => {
    const tbody = document.getElementById("data-body");
    const downloadBtn = document.getElementById('downloadBtn');
    const addPostBtn = document.getElementById('addPostBtn');

    let currentData = [];

    // Lấy dữ liệu từ PHP
    fetch('Trang-Quan-li-dang-tin.php')
        .then(res => res.json())
        .then(data => {
            currentData = data;
            renderTable(currentData);
        })
        .catch(err => {
            tbody.innerHTML = `<tr><td colspan="4">Lỗi tải dữ liệu</td></tr>`;
            console.error(err);
        });

    // Hàm render bảng
    function renderTable(data) {
        tbody.innerHTML = "";
        if(data.length === 0) {
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

    // Nút đăng tin mới: chuyển sang trang khác
    addPostBtn.addEventListener("click", () => {
        window.location.href = "Trang-quản-lí-đăng-tin-tuyen-dung.html";
    });

    // Nút tải CSV
    downloadBtn.addEventListener("click", () => {
        if(currentData.length === 0){
            alert("Chưa có dữ liệu để tải xuống!");
            return;
        }
        let csvContent = "\uFEFF";
        csvContent += `"Số thứ tự","Tên tin đăng","Thời gian đăng","Hồ sơ nộp"\n`;
        currentData.forEach(item => {
            csvContent += `"${item.id}","${item.title}","=\"${item.time}\"","${item.applied}"\n`;
        });
        const blob = new Blob([csvContent], { type:"text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "danh_sach_tin_dang.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
});
