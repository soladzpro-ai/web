/**
 * js/animation.js
 * Quản lý hoạt ảnh tối ưu hiệu năng cao (GPU Accelerated) tác động trực tiếp vào loading.png
 */
const AnimationApp = {
    playbackControl: null,

    /**
     * Kích hoạt hiệu ứng quay vòng vòng tệp tin loading.png
     */
    startRotation() {
        // Tìm chính xác thẻ img của tệp loading.png nằm trong vùng #loading của bạn
        const loadingImg = document.querySelector("#loading img");
        if (!loadingImg) return;

        if (this.playbackControl) {
            this.playbackControl.play();
            return;
        }

        // Tối ưu hóa luồng render của card đồ họa (GPU)
        loadingImg.style.transformOrigin = "center center";
        loadingImg.style.willChange = "transform";

        // Tác động trực tiếp vào tầng Layer của trình duyệt giúp chuyển động xoay đạt 60fps mượt mà
        this.playbackControl = loadingImg.animate(
            [
                { transform: "rotate(0deg)" },
                { transform: "rotate(360deg)" }
            ], 
            {
                duration: 1000,       // Tốc độ: 1 giây quay hết một vòng tròn
                iterations: Infinity, // Quay vòng vòng vô hạn
                easing: "linear"      // Chuyển động quay đều tăm tắp, không bị giật khựng
            }
        );
    },

    /**
     * Dừng quay hình ảnh và đưa về góc mặc định ban đầu
     */
    stopRotation() {
        if (this.playbackControl) {
            this.playbackControl.pause(); 
        }
        
        const loadingImg = document.querySelector("#loading img");
        if (loadingImg) {
            loadingImg.style.transform = "rotate(0deg)";
        }
    }
};

window.AnimationApp = AnimationApp;
