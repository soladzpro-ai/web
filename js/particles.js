/**
 * js/particles.js
 * Tạo hiệu ứng hạt bụi sáng bay lơ lửng nền tối ưu hóa bộ nhớ cho hệ thống TraDiem/
 */
document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.createElement("canvas");
    canvas.id = "particles-canvas";
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.zIndex = "-1"; // Đẩy nằm sau lớp thẻ kính mờ glassmorphism
    canvas.style.pointerEvents = "none";
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    const MAX_PARTICLES = 30; // Số lượng vừa vặn tạo độ thanh lịch và siêu nhẹ máy
    const particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, { passive: true });

    // Khởi tạo thuộc tính hạt duy nhất 1 lần duy trì suốt vòng đời trang (Chống rác RAM)
    for (let i = 0; i < MAX_PARTICLES; i++) {
        particles.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            size: Math.random() * 2 + 1,
            speedX: Math.random() * 0.2 - 0.1,
            speedY: -(Math.random() * 0.3 + 0.1), // Luôn bay hướng lên trên từ từ
            alpha: Math.random() * 0.4 + 0.1
        });
    }

    /**
     * Vòng lặp dựng hình chuyển động hạt liên tục
     */
    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(255, 255, 255, 0.25)"; // Màu hạt trắng mờ

        for (let i = 0; i < MAX_PARTICLES; i++) {
            const p = particles[i];

            p.x += p.speedX;
            p.y += p.speedY;

            // Nếu hạt bay vượt đỉnh màn hình, tái định vị lại ở đáy (Cơ chế tái sử dụng hạt)
            if (p.y < -5) {
                p.y = canvas.height + 5;
                p.x = Math.random() * canvas.width;
            }

            // Vẽ khối vuông siêu nhỏ tăng tốc render card màn hình nhanh gấp 5 lần hàm arc tròn
            ctx.fillRect(p.x, p.y, p.size, p.size);
        }

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
});
