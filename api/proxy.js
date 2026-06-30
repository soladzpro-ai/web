// api/proxy.js - Chạy trên máy chủ Serverless của Vercel
import https from 'https';

export default async function handler(req, res) {
    // Cấu hình Header bẻ gãy chính sách chặn CORS của trình duyệt vĩnh viễn
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { endpoint, soBaoDanh } = req.body;
        const postData = `soBaoDanh=${encodeURIComponent(soBaoDanh.trim())}`;

        // Cấu hình Header gói tin đóng gói chuẩn mã hóa Form Data truyền thống của hệ thống Sở
        const options = {
            hostname: 'tuyensinh.tayninh.edu.vn',
            port: 443,
            path: `/api/${endpoint}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Accept': 'application/json, text/plain, */*',
                'Content-Length': Buffer.byteLength(postData),
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Origin': 'https://tuyensinh.tayninh.edu.vn',
                'Referer': 'https://tuyensinh.tayninh.edu.vn/'
            }
        };

        // Kích hoạt luồng gửi nhận thô trực tiếp lên Sở Tây Ninh không lo lỗi SSL/Cookie
        const proxyReq = https.request(options, (proxyRes) => {
            let body = '';
            proxyRes.on('data', (chunk) => { body += chunk; });
            proxyRes.on('end', () => {
                try {
                    const parsedData = JSON.parse(body);
                    res.status(200).json(parsedData);
                } catch (e) {
                    res.status(200).json({}); // Trả về đối tượng trống nếu chưa có điểm thi
                }
            });
        });

        proxyReq.on('error', (err) => {
            res.status(500).json({ error: err.message });
        });

        proxyReq.write(postData);
        proxyReq.end();

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
