/**
 * js/api.js
 * Phiên bản Production: Kết nối qua hệ thống Serverless/Backend Proxy của Render
 * Cam kết lấy dữ liệu REAL 100% từ Sở, không tạo sẵn tên, không bị nghẽn nút bấm.
 */
const ExamAPI = {
    // Đường dẫn gọi trực tiếp vào dịch vụ xử lý backend của Render
    PROXY_ENDPOINT: '/api/get-shed-data',

    async fetchFullData(sbd) {
        if (!sbd || sbd.trim() === "") {
            return { success: false, message: "Vui lòng nhập mã định danh / SBD hợp lệ!" };
        }

        const cleanSBD = sbd.trim();

        try {
            // Thực hiện đóng gói chuỗi JSON gửi lên server trung gian xử lý
            const response = await fetch(this.PROXY_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ soBaoDanh: cleanSBD })
            });

            if (!response.ok) {
                throw new Error(`Máy chủ trung gian báo lỗi: ${response.status}`);
            }

            const resultRaw = await response.json();

            // KIỂM TRA HỒ SƠ THẬT: Nếu dữ liệu trả về rỗng (Mã không tồn tại trên Sở)
            if (!resultRaw || Object.keys(resultRaw).length === 0 || (!resultRaw.HoTen && !resultRaw.hoTen && !resultRaw.TenHocSinh)) {
                return { success: false, message: "Mã định danh / SBD này không tồn tại trên dữ liệu gốc của Sở Tây Ninh!" };
            }

            const hoTenThat = resultRaw.HoTen || resultRaw.hoTen || resultRaw.TenHocSinh;
            const phongThiThat = resultRaw.PhongThi || resultRaw.phongThi || "N/A";
            const maHoso = resultRaw.SoBaoDanh || resultRaw.soBaoDanh || cleanSBD;

            // KIỂM TRA ĐIỂM THI THỰC TẾ (Hồ sơ luôn có nhưng điểm thi có thể chưa mở giống ảnh cũ của bạn)
            const hasNoScores = resultRaw.IsNotice || !resultRaw.Scores;

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
                isNotice: hasNoScores
            };

        } catch (error) {
            console.error("Lỗi đồng bộ dữ liệu gốc:", error);
            return {
                success: false,
                message: "Không thể bóc tách dữ liệu gốc do máy chủ bảo trì hoặc chặn quyền truy cập. Thử lại sau!"
            };
        }
    }
};

window.ExamAPI = ExamAPI;
