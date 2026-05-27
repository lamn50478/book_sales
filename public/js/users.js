// console.log("chat for user")
// const listBtnAddFriend=document.querySelectorAll("[button-add-friend]");
// if(listBtnAddFriend.length>0){
//     listBtnAddFriend.forEach(btn => {
//         btn.addEventListener("click",()=>{
//             const userId=btn.getAttribute("button-add-friend");
           
//             btn.closest(".box-user").classList.add("add");
//             socket.emit("CLIENT_ADD_FRIEND",userId);
//         })
//     });
// }
// /js/users.js
console.log("chat for user");

const listBtnAddFriend = document.querySelectorAll("[button-add-friend]");
if(listBtnAddFriend.length > 0){
    listBtnAddFriend.forEach(btn => {
        btn.addEventListener("click", () => {
            const userId = btn.getAttribute("button-add-friend");

            // Thêm class "add" để đổi giao diện nút bấm
            btn.closest(".box-user").classList.add("add");

            // LẤY SOCKET NGAY TẠI THỜI ĐIỂM CLICK để đảm bảo socket đã khởi tạo xong
            const socket = window.socket; 

            if(socket) {
                // Chỉ gửi duy nhất userId của người kia, vì server đã biết bạn là ai qua tầng auth rồi!
                socket.emit("CLIENT_ADD_FRIEND", userId);
            } else {
                console.error("Socket chưa được khởi tạo thành công! Kiểm tra lại thông tin đăng nhập.");
            }
        });
    });
}


//Huy ket ban
const listBtnCancelFriend = document.querySelectorAll("[button-cancel-friend]");
if(listBtnCancelFriend.length > 0){
    listBtnCancelFriend.forEach(btn => {
        btn.addEventListener("click", () => {
            const userId = btn.getAttribute("button-cancel-friend");

            // Thêm class "add" để đổi giao diện nút bấm
            btn.closest(".box-user").classList.remove("add");

            // LẤY SOCKET NGAY TẠI THỜI ĐIỂM CLICK để đảm bảo socket đã khởi tạo xong
            const socket = window.socket; 

            if(socket) {
                // Chỉ gửi duy nhất userId của người kia, vì server đã biết bạn là ai qua tầng auth rồi!
                socket.emit("CLIENT_CANCEL_FRIEND", userId);
            } else {
                console.error("Socket chưa được khởi tạo thành công! Kiểm tra lại thông tin đăng nhập.");
            }
        });
    });
}

//Tu chối kết bạn 
const listBtnRefuseFriend = document.querySelectorAll("[button-refuse-friend]");
if(listBtnRefuseFriend.length > 0){
    listBtnRefuseFriend.forEach(btn => {
        btn.addEventListener("click", () => {
            const userId = btn.getAttribute("button-refuse-friend");

            // Thêm class "add" để đổi giao diện nút bấm
            btn.closest(".box-user").classList.add("refuse");

            // LẤY SOCKET NGAY TẠI THỜI ĐIỂM CLICK để đảm bảo socket đã khởi tạo xong
            const socket = window.socket; 

            if(socket) {
                // Chỉ gửi duy nhất userId của người kia, vì server đã biết bạn là ai qua tầng auth rồi!
                socket.emit("CLIENT_REFUSE_FRIEND", userId);
            } else {
                console.error("Socket chưa được khởi tạo thành công! Kiểm tra lại thông tin đăng nhập.");
            }
        });
    });
}