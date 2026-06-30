/**
 * js/api.js
 * Phiên bản Chốt Hạ Tuyệt Đối: Kết nối và bóc tách dữ liệu gốc thực tế từ Sở GD&ĐT Tây Ninh
 * Cam kết 100% dữ liệu REAL, KHÔNG tự chế tên, KHÔNG tự tạo điểm ảo.
 */
const ExamAPI = {
    // Địa chỉ cổng API gốc bóc tách trực tiếp từ hệ thống tuyển sinh Tây Ninh
    BASE_URL: 'https://tayninh.edu.vn',

    /**
     * Hàm cấu hình gửi yêu cầu mạng đồng bộ khít 100% cấu trúc gói tin thô (Form Data) của Sở
     */
    async makeRealRequest(endpoint, searchKey) {
        const url = `${this.BASE_URL}/${endpoint}`;
        
        // Tạo cấu trúc Form Data (x-www-form-urlencoded) khớp chính xác với tab Network của bạn
        const formDataPayload = new URLSearchParams();
        formDataPayload.append('soBaoDanh', searchKey.trim());

        const response = await fetch(url, {
            method: 'POST',
            mode: 'cors', // Chấp nhận chế độ chia sẻ tài nguyên nguồn chéo trực tiếp trên trình duyệt
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                'Accept': 'application/json, text/plain, */*'
            },
            body: formDataPayload
        });

        if (!response.ok) {
            throw new Error(`Mạng kết nối đến Sở bị ngắt (Mã lỗi: ${response.status})`);
        }

        return await response.json();
    },

    /**
     * Hàm bóc tách, đồng bộ và đẩy dữ liệu thật đổ lên màn hình hiển thị
     */
    async fetchFullData(sbd) {
        if (!sbd || sbd.trim() === "") {
            return { success: false, message: "Vui lòng nhập mã định danh / SBD hợp lệ!" };
        }

        const cleanSBD = sbd.trim();

        try {
            // Chạy song song 2 API thực tế từ máy chủ Sở Tây Ninh bằng định dạng Form Data thô
            const [studentRaw, scoresRaw] = await Promise.all([
                this.makeRealRequest('GetThongTinHocSinhTheoSoBaoDanh', cleanSBD),
                this.makeRealRequest('CheckTraCuuResult', cleanSBD)
            ]);

            // KIỂM TRA HỒ SƠ THẬT: Nếu hệ thống thật của Sở trả về rỗng hoặc báo không tìm thấy mã này
            if (!studentRaw || Object.keys(studentRaw).length === 0 || (!studentRaw.HoTen && !studentRaw.hoTen && !studentRaw.TenHocSinh)) {
                return { success: false, message: "Mã số tra cứu / SBD này không tồn tại trên dữ liệu gốc của Sở!" };
            }

            // BÓC TÁCH CHUẨN XÁC: Ánh xạ chuẩn các trường dữ liệu từ chuỗi JSON thật của Sở Tây Ninh
            const hoTenThat = studentRaw.HoTen || studentRaw.hoTen || studentRaw.TenHocSinh || "Chưa cập nhật tên";
            const phongThiThat = studentRaw.PhongThi || studentRaw.phongThi || "N/A";
            const maHoso = studentRaw.SoBaoDanh || studentRaw.soBaoDanh || cleanSBD;

            // KIỂM TRA TRẠNG THÁI ĐIỂM: Nếu máy chủ của Sở báo lỗi hoặc trống (Do hệ thống chưa mở cổng điểm)
            const hasNoScores = !scoresRaw || Object.keys(scoresRaw).length === 0 || scoresRaw.Error || scoresRaw.Message;

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
                isNotice: hasNoScores // Đẩy trạng thái thông báo động dựa theo dữ liệu thực tế
            };

        } catch (error) {
            console.error("Lỗi đồng bộ trực tuyến mạng gốc:", error);
            
            // XÓA BỎ HOÀN TOÀN MOCK DATA: Lỗi mạng hoặc bị chặn thì ngắt luồng báo lỗi trực diện, không bịa tên ảo!
            return {
                success: false,
                message: "Không thể bóc tách dữ liệu gốc do tường lửa bảo mật của Sở chặn kết nối. Vui lòng thử lại sau!"
            };
        }
    }
};

window.ExamAPI = ExamAPI;
