/**
 * js/notification.js
 * Quản lý hộp thông báo nhanh trên giao diện trang tra cứu điểm
 */
const NotificationApp = {
    toast: null,
    toastTimeout: null,

    init() {
        if (!this.toast) {
            this.toast = document.getElementById("notification");
        }
    },

    show(message, type = "success") {
        this.init();
        if (!this.toast) return;

        // Thay đổi background mờ gương ARGB dịu mắt theo trạng thái trả về
        if (type === "success") {
            this.toast.style.background = "rgba(46, 125, 50, 0.9)"; // Xanh lá dịu
            this.toast.style.borderColor = "rgba(76, 175, 80, 0.3)";
        } else {
            this.toast.style.background = "rgba(198, 40, 40, 0.9)"; // Đỏ mờ dịu
            this.toast.style.borderColor = "rgba(239, 83, 80, 0.3)";
        }

        this.toast.textContent = message;
        this.toast.style.display = "block";

        // Tự động ẩn hộp thoại thông báo sau 3 giây để giao diện gọn gàng
        clearTimeout(this.toastTimeout);
        this.toastTimeout = setTimeout(() => {
            this.toast.style.display = "none";
        }, 3000);
    }
};

window.NotificationApp = NotificationApp;
