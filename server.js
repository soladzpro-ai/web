// server.js - File khởi chạy máy chủ Proxy Node.js trên Render
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

// Cho phép trình duyệt truy cập công khai toàn bộ thư mục giao diện tĩnh
app.use(express.static(__dirname));

/**
 * Cổng API Máy chủ đứng ra bốc dữ liệu thật Form Data trực tiếp lên cổng của Sở
 */
app.post('/api/get-shed-data', async (req, res) => {
    try {
        const { soBaoDanh } = req.body;
        const targetUrl = 'https://tayninh.edu.vn';

        // Đóng gói chuỗi Form Data x-www-form-urlencoded chuẩn cấu trúc tab Network của bạn
        const rawBody = `soBaoDanh=${encodeURIComponent(soBaoDanh.trim())}`;

        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Accept': 'application/json, text/plain, */*',
                'Origin': 'https://tayninh.edu.vn',
                'Referer': 'https://tayninh.edu.vn/'
            },
            body: rawBody
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: "Sở từ chối kết nối" });
        }

        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Định tuyến mặc định nạp file giao diện index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Máy chủ trung gian Render đang khởi động tại cổng ${PORT}`);
});
