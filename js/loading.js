/**
 * js/loading.js
 * Quản lý trạng thái ẩn hiện và liên kết hoạt ảnh xoay tròn của khối loading
 */
const LoadingApp = {
    show() {
        const loadingBox = document.getElementById("loading");
        if (loadingBox) {
            loadingBox.style.display = "block";
            
            // Ra lệnh kích hoạt hình ảnh loading.png quay vòng vòng
            if (window.AnimationApp && window.AnimationApp.startRotation) {
                window.AnimationApp.startRotation();
            }
        }
    },

    hide() {
        const loadingBox = document.getElementById("loading");
        if (loadingBox) {
            loadingBox.style.display = "none";
            
            // Ra lệnh dừng hoạt ảnh quay để tiết kiệm PIN và RAM cho thiết bị
            if (window.AnimationApp && window.AnimationApp.stopRotation) {
                window.AnimationApp.stopRotation();
            }
        }
    }
};

window.LoadingApp = LoadingApp;
