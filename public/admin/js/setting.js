document.addEventListener('DOMContentLoaded', function () {
  const fileInput = document.querySelector('input[upload-image-input]');
  const previewImg = document.querySelector('img[upload-image-preview]');
  const previewSizeEl = document.querySelector('.preview-size');
  const previewDimEl = document.querySelector('.preview-dim');

  if (!fileInput || !previewImg) return;

  fileInput.addEventListener('change', function (e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    // Giới hạn kích thước file (ví dụ 2MB)
    const maxMB = 2;
    if (file.size > maxMB * 1024 * 1024) {
      alert(`Kích thước file quá lớn. Vui lòng chọn file <= ${maxMB}MB.`);
      fileInput.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = function (ev) {
      previewImg.src = ev.target.result;
      // cập nhật kích thước hiển thị và kích thước file
      const kb = Math.round(file.size / 1024);
      if (previewSizeEl) previewSizeEl.textContent = `${kb} KB`;
      // lấy kích thước thực của ảnh để hiển thị
      const img = new Image();
      img.onload = function () {
        if (previewDimEl) previewDimEl.textContent = `${this.width}×${this.height}`;
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });
});
