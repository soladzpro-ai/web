// api/proxy.js - Chạy trên nền tảng Serverless của Vercel
export default async function handler(req, res) {
    // Kích hoạt Header mở khóa bộ chặn CORS vĩnh viễn
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
        const targetUrl = `https://tayninh.edu.vn{endpoint}`;

        // Đồng bộ chuỗi mã hóa Form Data thô (x-www-form-urlencoded) bằng cấu trúc String
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
            return res.status(response.status).json({ error: `Sở từ chối kết nối: ${response.status}` });
        }

        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
