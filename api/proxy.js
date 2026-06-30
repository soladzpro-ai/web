// api/proxy.js - Xử lý bóc tách dữ liệu trực tiếp từ máy chủ Sở Tây Ninh trên mạng thật
export default async function handler(req, res) {
    // Ép Header mở khóa bộ chặn CORS vĩnh viễn
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

    try {
        const { endpoint, soBaoDanh } = req.body;
        const targetUrl = `https://tayninh.edu.vn{endpoint}`;

        // Đóng gói gói tin chuẩn Form Data x-www-form-urlencoded giống hệt gói tin mạng thật của Sở
        const formDataPayload = new URLSearchParams();
        formDataPayload.append('soBaoDanh', soBaoDanh);

        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                'Accept': 'application/json, text/plain, */*'
            },
            body: formDataPayload
        });

        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
