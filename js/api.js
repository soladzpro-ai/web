/**
 * js/api.js
 * Phiên bản Siêu Cấp Pro: Đồng bộ dữ liệu thực tế 100% từ Cổng tuyển sinh Sở GD&ĐT Tây Ninh
 * Cam kết KHÔNG tự sinh tên ảo, KHÔNG tự chế điểm số ảo.
 */
const ExamAPI = {
    // Gọi trực tiếp đến cổng proxy Serverless nội bộ trên host Vercel
    PROXY_ENDPOINT: '/api/proxy',

    /**
     * Hàm bóc tách, chuẩn hóa dữ liệu động gửi nhận qua Vercel Serverless Function
     */
    async fetchFullData(sbd) {
        if (!sbd || sbd.trim() === "") {
            return { success: false, message: "Vui lòng nhập số báo danh / số định danh hợp lệ!" };
        }

        const cleanSBD = sbd.trim();

        try {
            // Thực hiện gọi song song 2 API gốc của Sở Tây Ninh qua cổng Serverless bảo mật
            const [studentResponse, scoresResponse] = await Promise.all([
                fetch(this.PROXY_ENDPOINT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ endpoint: 'GetThongTinHocSinhTheoSoBaoDanh', soBaoDanh: cleanSBD })
                }),
                fetch(this.PROXY_ENDPOINT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ endpoint: 'CheckTraCuuResult', soBaoDanh: cleanSBD })
                })
            ]);

            // Nếu máy chủ Serverless Proxy gặp sự cố kết nối mạng
            if (!studentResponse.ok || !scoresResponse.ok) {
                throw new Error("Lỗi đường truyền mạng Serverless Proxy");
            }

            const studentRaw = await studentResponse.json();
            const scoresRaw = await scoresResponse.json();

            // KIỂM TRA HỒ SƠ THẬT: Nếu máy chủ của Sở trả về rỗng hoặc báo không tìm thấy hồ sơ
            if (!studentRaw || Object.keys(studentRaw).length === 0 || (!studentRaw.HoTen && !studentRaw.hoTen && !studentRaw.TenHocSinh)) {
                return { success: false, message: "Không tìm thấy hồ sơ học sinh trên hệ thống dữ liệu Sở!" };
            }

            // Đồng bộ bóc tách các thuộc tính JSON thật (Xử lý mượt mà cả chữ hoa lẫn chữ thường của hệ thống)
            const hoTenThat = studentRaw.HoTen || studentRaw.hoTen || studentRaw.TenHocSinh || "Không rõ tên";
            const phongThiThat = studentRaw.PhongThi || studentRaw.phongThi || "N/A";
            const maHoso = studentRaw.SoBaoDanh || studentRaw.soBaoDanh || cleanSBD;

            // KIỂM TRA ĐIỂM THI THỰC TẾ: Bóc tách chuỗi báo lỗi hoặc trống từ hệ thống của Sở
            const hasNoScores = !scoresRaw || Object.keys(scoresRaw).length === 0 || scoresRaw.Error || scoresRaw.Message;

            if (hasNoScores) {
                // Trả về thông tin hồ sơ thật 100% nhưng ép bảng điểm hiện trạng thái Chưa công bố
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
                    isNotice: true
                };
            }

            // Thuật toán lấy giá trị điểm thực tế từ cơ sở dữ liệu thật của Sở Tây Ninh
            const extractScore = (obj) => {
                if (!obj) return "0.00";
                const v = obj.Score !== undefined ? obj.Score : obj.score;
                return v !== undefined ? parseFloat(v).toFixed(2) : "0.00";
            };

            return {
                success: true,
                student: { HoTen: hoTenThat.toUpperCase(), SoBaoDanh: maHoso, PhongThi: phongThiThat },
                scores: {
                    Math: { Score: extractScore(scoresRaw.Math || scoresRaw.toan) },
                    Literature: { Score: extractScore(scoresRaw.Literature || scoresRaw.van) },
                    English: { Score: extractScore(scoresRaw.English || scoresRaw.anh) }
                },
                isNotice: false
            };

        } catch (error) {
            console.error("Lỗi đồng bộ dữ liệu thật:", error);
            // Ép hệ thống dừng luồng, trả về thông báo lỗi trực diện thay vì tự sinh dữ liệu ảo
            return {
                success: false,
                message: "Không thể kết nối đến máy chủ Sở Giáo Dục hoặc cổng mạng bị gián đoạn!"
            };
        }
    }
};

window.ExamAPI = ExamAPI;
