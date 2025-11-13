// Sidebar: đánh dấu active theo trang
const sidebarItems = document.querySelectorAll('.sidebar-left ul li');

sidebarItems.forEach(li => {
  const span = li.querySelector('span');
  if(span && span.textContent === 'Đăng tin'){
    li.classList.add('active');
  }
});

// Chọn item active mặc định (trang "Quản lý tin đăng")
const menuItems = document.querySelectorAll('.main-left li');

menuItems.forEach(li => {
  li.addEventListener('click', () => {
    menuItems.forEach(item => item.classList.remove('active'));
    li.classList.add('active');
  });
});

// ------------------ DỮ LIỆU GỐC ------------------
const originalData = [
  { id: 1, title: "Nhân viên bán hàng", time: "10/11/2025", applied: 5 },
  { id: 2, title: "Kỹ sư phần mềm", time: "09/11/2025", applied: 8 },
  { id: 3, title: "Chăm sóc khách hàng", time: "07/11/2025", applied: 3 },
  { id: 4, title: "Nhân viên marketing", time: "12/11/2025", applied: 12 },
  { id: 5, title: "Thiết kế WEB", time: "1/10/2025", applied: 3 },
  { id: 6, title: "Kỹ sư phần cứng", time: "04/07/2025", applied: 2},
  { id: 7, title: "Kĩ sư xấy dựng", time: "13/02/2025", applied: 5 },
  { id: 8, title: "Nhân viên văn phòng", time: "20/5/2025", applied: 7 }
];

let currentData = [...originalData]; // dữ liệu đang hiển thị

// ------------------ ELEMENTS ------------------
const tbody = document.getElementById("data-body");
const customSelect = document.querySelector(".custom-select");
const selected = customSelect.querySelector(".selected");
const optionEls = customSelect.querySelectorAll(".options div");

const downloadBtn = document.querySelector('.top ul li:first-child'); // nút tải xuống

// ------------------ HÀM HỖ TRỢ ------------------
function parseVNDate(str) {
  const [d, m, y] = str.split("/").map(Number);
  return new Date(y, m - 1, d);
}

// Render bảng dữ liệu
function renderTable(data) {
  tbody.innerHTML = "";
  if (!data.length) {
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

// Sắp xếp dữ liệu theo chế độ
function applySort(mode) {
  let data = [...originalData];
  if (mode === "new") data.sort((a,b) => parseVNDate(b.time) - parseVNDate(a.time));
  if (mode === "old") data.sort((a,b) => parseVNDate(a.time) - parseVNDate(b.time));
  currentData = data;
  renderTable(data);
}

// ------------------ DROPDOWN ------------------
selected.addEventListener("click", () => {
  customSelect.classList.toggle("active");
});

optionEls.forEach(opt => {
  opt.addEventListener("click", () => {
    const text = opt.textContent.trim();
    selected.textContent = text;

    let mode = "all";
    if (text === "Mới nhất") mode = "new";
    if (text === "Cũ nhất") mode = "old";

    applySort(mode);
    customSelect.classList.remove("active");
  });
});

// Click ngoài đóng dropdown
document.addEventListener("click", e => {
  if (!customSelect.contains(e.target)) {
    customSelect.classList.remove("active");
  }
});

// ------------------ TẢI XUỐNG CSV ------------------
downloadBtn.addEventListener("click", () => {
  let csvContent = "\uFEFF"; // UTF-8 BOM để tiếng Việt hiển thị
  csvContent += `"Số thứ tự","Tên tin đăng","Thời gian đăng","Hồ sơ nộp"\n`;

  currentData.forEach(item => {
    // Bọc ngày trong ="..." để Excel hiểu là text, không chia ô
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


// ------------------ KHỞI TẠO ------------------
applySort("all"); // mặc định hiển thị tất cả
