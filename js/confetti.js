/**
 * js/confetti.js
 * Tạo hiệu ứng pháo giấy ăn mừng khi tra cứu điểm cao - Bản tối ưu GPU và RAM
 */
const ConfettiApp = {
    canvas: null,
    ctx: null,
    pieces: [],
    animationFrameId: null,
    isActive: false,
    MAX_PIECES: 60, // Số lượng hạt rơi tối ưu không gây loạn mắt và nóng máy

    colors: [
        "rgba(255, 45, 85, 0.85)",   // Hồng đỏ đồng bộ màu button dải 16m màu của bạn
        "rgba(255, 149, 0, 0.85)",  // Cam dịu
        "rgba(255, 204, 0, 0.85)",  // Vàng sáng
        "rgba(52, 199, 89, 0.85)",  // Xanh lá dịu
        "rgba(90, 200, 250, 0.85)", // Xanh biển nhạt
        "rgba(139, 92, 246, 0.85)"  // Tím nhẹ
    ],

    init() {
        if (this.canvas) return;

        this.canvas = document.createElement("canvas");
        this.canvas.id = "confetti-canvas";
        this.canvas.style.position = "fixed";
        this.canvas.style.top = "0";
        this.canvas.style.left = "0";
        this.canvas.style.width = "100vw";
        this.canvas.style.height = "100vh";
        this.canvas.style.zIndex = "999"; // Trên cùng giao diện
        this.canvas.style.pointerEvents = "none";
        document.body.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext("2d");

        window.addEventListener("resize", () => {
            if (this.canvas) {
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;
            }
        }, { passive: true });
    },

    /**
     * Hàm kích hoạt bắn pháo giấy rơi ăn mừng
     */
    trigger() {
        this.init();
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.isActive = true;

        // Kỹ thuật Object Pooling: Tạo khung dữ liệu hạt trống một lần duy nhất
        if (this.pieces.length === 0) {
            for (let i = 0; i < this.MAX_PIECES; i++) {
                this.pieces.push({
                    x: 0, y: 0, size: 0, color: "", speedX: 0, speedY: 0, rotation: 0, rotationSpeed: 0
                });
            }
        }

        // Tái gán lại các giá trị vị trí vật lý ban đầu của pháo giấy (Đẩy lên đỉnh trời khuất màn hình)
        for (let i = 0; i < this.MAX_PIECES; i++) {
            const p = this.pieces[i];
            p.x = Math.random() * this.canvas.width;
            p.y = Math.random() * -this.canvas.height - 20; 
            p.size = Math.random() * 6 + 6;
            p.color = this.colors[Math.floor(Math.random() * this.colors.length)];
            p.speedX = Math.random() * 4 - 2;
            p.speedY = Math.random() * 3 + 4; // Tốc độ rơi tự do
            p.rotation = Math.random() * 360;
            p.rotationSpeed = Math.random() * 4 - 2;
        }

        if (!this.animationFrameId) {
            this.animate();
        }
    },

    animate() {
        if (!this.isActive) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let hasVisiblePieces = false;

        for (let i = 0; i < this.MAX_PIECES; i++) {
            const p = this.pieces[i];

            if (p.y < this.canvas.height) {
                hasVisiblePieces = true;
                
                p.y += p.speedY;
                p.x += p.speedX;
                p.rotation += p.rotationSpeed;

                // Tiến hành vẽ mảnh pháo giấy xoay bằng ma trận siêu tốc của GPU
                this.ctx.save();
                this.ctx.translate(p.x, p.y);
                this.ctx.rotate((p.rotation * Math.PI) / 180);
                this.ctx.fillStyle = p.color;
                
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                this.ctx.restore();
            }
        }

        if (hasVisiblePieces) {
            this.animationFrameId = requestAnimationFrame(() => this.animate());
        } else {
            this.isActive = false;
            this.animationFrameId = null;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
};

window.ConfettiApp = ConfettiApp;
