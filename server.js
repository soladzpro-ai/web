/**
 * js/api.js
 * Phiên bản Production: Đồng bộ dữ liệu thực tế 100% qua máy chủ trung gian
 * Nói không với tạo tên sẵn, nói không với điểm ảo!
 */
const ExamAPI = {
    // Trỏ trực tiếp vào API máy chủ Node.js độc lập của bạn trên Render
    PROXY_ENDPOINT: '/api/get-real-data',

    async fetchFullData(sbd) {
        if (!sbd || sbd.trim() === "") {
            return { success: false, message: "Vui lòng nhập số báo danh / số định danh hợp lệ!" };
        }

        const cleanSBD = sbd.trim();

        try {
            // Gửi yêu cầu qua máy chủ Render để xử lý bẻ gãy bộ chặn CORS của trình duyệt
            const response = await fetch(this.PROXY_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ soBaoDanh: cleanSBD })
            });

            if (!response.ok) throw new Error("Mạng gián đoạn");

            const resData = await response.json();

            // Nếu máy chủ backend báo lỗi kết nối từ xa từ Sở
            if (!resData.success) {
                return { success: false, message: "Hệ thống mạng từ xa của Sở bị gián đoạn. Thử lại sau!" };
            }

            const studentRaw = resData.data;

            // KIỂM TRA HỒ SƠ THẬT: Nếu hệ thống thật của Sở trả về trống (SBD nhập sai số hoặc không tồn tại)
            if (!studentRaw || Object.keys(studentRaw).length === 0 || (!studentRaw.HoTen && !studentRaw.hoTen && !studentRaw.TenHocSinh)) {
                return { success: false, message: "Mã tra cứu này không tồn tại trên cơ sở dữ liệu gốc của Sở Tây Ninh!" };
            }

            // BÓC TÁCH CHUẨN XÁC DỮ LIỆU REAL 100% ĐỔ LÊN MÀN HÌNH
            const hoTenThat = studentRaw.HoTen || studentRaw.hoTen || studentRaw.TenHocSinh;
            const phongThiThat = studentRaw.PhongThi || studentRaw.phongThi || "N/A";
            const maHoso = studentRaw.SoBaoDanh || studentRaw.soBaoDanh || cleanSBD;

            return {
                success: true,
                student: {
                    HoTen: hoTenThat.toUpperCase(),
                    SoBaoDanh: maHoso,
                    PhongThi: phongThiThat
                },
                scores: {
                    Math: { Score: "Chưa có" },
                    Literature: { Score: "Chưa có" },
                    English: { Score: "Chưa có" }
                },
                isNotice: true // Giữ nguyên thông báo hồ sơ thông minh khớp hiện trạng chưa công bố điểm của Sở
            };

        } catch (error) {
            console.error("Lỗi luồng xử lý mạng:", error);
            return {
                success: false,
                message: "Không thể kết nối máy chủ trung gian. Vui lòng thử lại!"
            };
        }
    }
};

window.ExamAPI = ExamAPI;
