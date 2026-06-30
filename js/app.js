/**
 * js/app.js
 * Quản lý khởi tạo cấu hình hệ thống và quản lý tài nguyên Assets (.png)
 */

document.addEventListener("DOMContentLoaded", () => {
    // Khởi tạo ứng dụng chính
    AppEngine.init();
});

const AppEngine = {
    // Định nghĩa danh sách đường dẫn Assets chuẩn 100% theo sơ đồ quy ước
    ASSETS: {
        logo: "assets/logo/logo.png",
        background: "assets/backgrounds/bg.png",
        icons: {
            search: "assets/icons/search.png",
            loading: "assets/icons/loading.png",
            success: "assets/icons/success.png",
            error: "assets/icons/error.png"
        }
    },

    /**
     * Hàm chạy khi ứng dụng bắt đầu khởi động
     */
    init() {
        console.log("Hệ thống TraDiem đã sẵn sàng. Tài nguyên Assets đã được đồng bộ hóa.");
        
        // 1. Tự động tối ưu hóa việc nạp trước hình ảnh nền lớn để tăng tốc giao diện
        this.preloadCriticalImages();

        // 2. Thiết lập trạng thái ban đầu
        this.setupInitialState();
    },

    /**
     * Nạp trước các hình ảnh nền quan trọng giúp tránh hiện tượng nháy trắng màn hình
     */
    preloadCriticalImages() {
        const criticalImages = [
            this.ASSETS.logo,
            this.ASSETS.background,
            this.ASSETS.icons.loading
        ];

        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    },

    /**
     * Đặt trạng thái ban đầu cho giao diện theo đúng sơ đồ thiết kế
     */
    setupInitialState() {
        const notification = document.getElementById("notification");
        if (notification) {
            notification.style.display = "none";
        }
    }
};

// Xuất đối tượng ra window để các file script khác có thể tham chiếu danh mục tài nguyên
window.AppEngine = AppEngine;
