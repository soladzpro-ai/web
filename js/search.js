/**
 * js/search.js
 * Logic điều hướng và hiển thị kết quả tra cứu điểm thi hoàn chỉnh
 */
document.addEventListener("DOMContentLoaded", () => {
    const sbdInput = document.getElementById("sbd");
    const searchBtn = document.getElementById("searchBtn");
    
    const candidateSection = document.getElementById("candidate");
    const scoreCardSection = document.getElementById("scoreCard");
    
    // Ẩn các khu vực kết quả khi vừa tải trang
    if (candidateSection) candidateSection.style.display = "none";
    if (scoreCardSection) scoreCardSection.style.display = "none";

    searchBtn.addEventListener("click", performSearch);
    sbdInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") performSearch();
    });

    async function performSearch() {
        const sbdValue = sbdInput.value.trim();

        if (!sbdValue) {
            if (window.NotificationApp) window.NotificationApp.show("Vui lòng nhập số báo danh!", "error");
            return;
        }

        // Bật màn hình chờ loading và tạm ẩn các kết quả cũ
        if (window.LoadingApp) window.LoadingApp.show();
        
        if (candidateSection) candidateSection.style.display = "none";
        if (scoreCardSection) scoreCardSection.style.display = "none";

        if (candidateSection) candidateSection.classList.remove("fade-in", "slide-up");
        if (scoreCardSection) scoreCardSection.classList.remove("fade-in", "slide-up");

        try {
            // Gọi hàm xử lý lấy dữ liệu từ file js/api.js
            const result = await window.ExamAPI.fetchFullData(sbdValue);

            // Tạo độ trễ ngắn 600ms giúp hoạt ảnh loading quay mượt mà tự nhiên
            await new Promise(resolve => setTimeout(resolve, 600));

            if (result.success) {
                // SỬA LỖI CHÍNH: Nạp chuẩn xác các trường dữ liệu viết hoa từ bộ API Fallback
                document.getElementById("studentName").textContent = result.student.HoTen || "NGUYỄN VĂN A";
                document.getElementById("studentID").textContent = result.student.SoBaoDanh || sbdValue;
                document.getElementById("examRoom").textContent = result.student.PhongThi || "P001";

                // Nạp dữ liệu môn Toán vào bảng
                document.getElementById("mathTime").textContent = result.scores.Math.Time;
                document.getElementById("mathLocation").textContent = result.scores.Math.Location;
                document.getElementById("mathStart").textContent = result.scores.Math.Start;
                document.getElementById("mathScore").textContent = result.scores.Math.Score;

                // Nạp dữ liệu môn Ngữ văn vào bảng
                document.getElementById("literatureTime").textContent = result.scores.Literature.Time;
                document.getElementById("literatureLocation").textContent = result.scores.Literature.Location;
                document.getElementById("literatureStart").textContent = result.scores.Literature.Start;
                document.getElementById("literatureScore").textContent = result.scores.Literature.Score;

                // Nạp dữ liệu môn Tiếng Anh vào bảng
                document.getElementById("englishTime").textContent = result.scores.English.Time;
                document.getElementById("englishLocation").textContent = result.scores.English.Location;
                document.getElementById("englishStart").textContent = result.scores.English.Start;
                document.getElementById("englishScore").textContent = result.scores.English.Score;

                // Bật hiển thị hai khối thông tin lên màn hình kèm hiệu ứng chuyển cảnh
                if (candidateSection) {
                    candidateSection.style.display = "block";
                    candidateSection.classList.add("fade-in");
                }
                if (scoreCardSection) {
                    scoreCardSection.style.display = "block";
                    scoreCardSection.classList.add("slide-up");
                }

                if (window.NotificationApp) window.NotificationApp.show("Tra cứu kết quả thành công!", "success");

                // Kích hoạt bắn pháo giấy nếu tổng điểm cao hoặc có môn học từ 9.0 trở lên
                if (parseFloat(result.scores.Math.Score) >= 9.0 || 
                    parseFloat(result.scores.Literature.Score) >= 9.0 || 
                    parseFloat(result.scores.English.Score) >= 9.0) {
                    if (window.ConfettiApp) window.ConfettiApp.trigger();
                }
            } else {
                if (window.NotificationApp) window.NotificationApp.show(result.message, "error");
            }
        } catch (error) {
            console.error("Lỗi giao diện tra cứu:", error);
            if (window.NotificationApp) window.NotificationApp.show("Đã xảy ra sự cố dữ liệu!", "error");
        } finally {
            if (window.LoadingApp) window.LoadingApp.hide();
        }
    }
});
