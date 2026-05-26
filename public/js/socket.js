// const socket = io({
//     auth: {
//         userId: document.querySelector("[my-id]").getAttribute("my-id"),
//         fullName: document.querySelector("[my-fullname]").getAttribute("my-fullname")
//     }
// });
// Khởi tạo một biến socket rỗng ở phạm vi toàn cục (window)
window.socket = null;

// Kiểm tra xem trang hiện tại có thông tin User hay không (đã đăng nhập chưa)
const elementMyId = document.querySelector("[my-id]");

if (elementMyId) {
    const myUserId = elementMyId.getAttribute("my-id");
    
    // Kiểm tra xem có fullname không, nếu không có (ở trang kết bạn) thì để rỗng hoặc tạm lấy ""
    const elementMyFullName = document.querySelector("[my-fullname]");
    const myFullName = elementMyFullName ? elementMyFullName.getAttribute("my-fullname") : "";

    // Tiến hành kết nối socket và truyền dữ liệu auth
    window.socket = io({
        auth: {
            userId: myUserId,
            fullName: myFullName
        }
    });
}