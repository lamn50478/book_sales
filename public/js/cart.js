//input cartjs quantity
const inputsQuantity=document.querySelectorAll("input[name='quantity']");
if(inputsQuantity.length >0){
    inputsQuantity.forEach((input)=>{
        input.addEventListener("change",(e)=>{
            const productId=input.getAttribute("product-id");//e.target=input
            const quantity=input.value;
           if(quantity.length >=1 ){
               window.location.href=`/cart/update/${productId}/${quantity}`;
           }
            // console.log(e);
        })
    })
}



//endinput cartjs quantity


/* ============================================================
   cart.js — Giỏ hàng thiếu nhi
   Xử lý: nút − / +, nhập tay, xác thực số lượng, redirect
   ============================================================ */

/**
 * Điều hướng cập nhật giỏ hàng
 * @param {string} productId
 * @param {number|string} quantity
 */
function updateCart(productId, quantity) {
  const qty = parseInt(quantity, 10);

  if (!productId) {
    console.error("[Cart] Thiếu product-id");
    return;
  }
  if (isNaN(qty) || qty < 1) {
    console.warn("[Cart] Số lượng không hợp lệ:", quantity);
    return;
  }

  window.location.href = `/cart/update/${encodeURIComponent(productId)}/${encodeURIComponent(qty)}`;
}

/* ── Gắn handler cho từng bộ điều khiển số lượng ────── */
document.querySelectorAll(".cart-qty-ctrl").forEach((ctrl) => {
  const input  = ctrl.querySelector("input[name='quantity']");
  const btnDec = ctrl.querySelector(".cart-qty-dec");
  const btnInc = ctrl.querySelector(".cart-qty-inc");

  if (!input) return;

  // Ưu tiên data-product-id, fallback về attribute cũ product-id
  const getProductId = () =>
    input.getAttribute("data-product-id") || input.getAttribute("product-id");

  /* ── Nút − ─────────────────────────────────────── */
  if (btnDec) {
    btnDec.addEventListener("click", () => {
      const current = parseInt(input.value, 10) || 1;
      const next = Math.max(1, current - 1);

      if (next === current) return; // đã ở min, không làm gì
      input.value = next;
      updateCart(getProductId(), next);
    });
  }

  /* ── Nút + ─────────────────────────────────────── */
  if (btnInc) {
    btnInc.addEventListener("click", () => {
      const current = parseInt(input.value, 10) || 1;
      const next = current + 1;

      input.value = next;
      updateCart(getProductId(), next);
    });
  }

  /* ── Nhập tay (change) ─────────────────────────── */
  input.addEventListener("change", () => {
    let qty = parseInt(input.value, 10);

    // Tự động sửa về 1 nếu nhập sai
    if (isNaN(qty) || qty < 1) {
      qty = 1;
      input.value = 1;
    }

    updateCart(getProductId(), qty);
  });

  /* ── Ngăn chữ cái, chỉ cho số và phím điều hướng ── */
  input.addEventListener("keydown", (e) => {
    const allowed = [
      "Backspace", "Delete", "ArrowLeft", "ArrowRight",
      "Tab", "Enter", "Home", "End"
    ];
    if (allowed.includes(e.key)) return;
    if (e.key >= "0" && e.key <= "9") return;
    e.preventDefault();
  });
});
