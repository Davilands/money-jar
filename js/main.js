import { saveData, getData, addTransaction } from "./firebase.js";
import { readNumber } from "./readMoney.js";

// 🔹 Danh sách hũ tài chính mặc định
const jars = {
  essential: { id: "essential", name: "Thiết yếu", percentage: 55, amount: 0 },
  savings: { id: "savings", name: "Tiết kiệm", percentage: 10, amount: 0 },
  education: { id: "education", name: "Giáo dục", percentage: 10, amount: 0 },
  investment: { id: "investment", name: "Đầu tư", percentage: 10, amount: 0 },
  enjoyment: { id: "enjoyment", name: "Hưởng thụ", percentage: 10, amount: 0 },
  charity: { id: "charity", name: "Từ thiện", percentage: 5, amount: 0 }
};

// Hiển thị GIF và chỉ gọi callback sau 3 giây
function showTransactionGif(type, callback) {
  const gifContainer = document.getElementById("transactionGifContainer");
  const gifImage = document.getElementById("transactionGif");

  if (type === "deposit") {
    gifImage.src = "../assets/img/in-jar.gif"; // Ảnh GIF khi nạp tiền
  } else {
    gifImage.src = "../assets/img/out-jar.gif"; // Ảnh GIF khi rút tiền
  }

  gifContainer.style.display = "flex"; // Hiển thị ảnh GIF

  setTimeout(() => {
    gifContainer.style.display = "none"; // Ẩn GIF sau 3 giây
    if (callback) callback(); // Gọi hộp thoại sau khi GIF biến mất
  }, 4000);
}


// 🔹 Hiển thị Dialog Message
function showDialog(message) {
  document.getElementById("dialogMessage").innerHTML = message;
  document.getElementById("messageDialog").showModal();
}

// 🔹 Hiển thị Dialog Xác Nhận với ô nhập lý do nếu cần
function showConfirmDialog(message, callback, requireReason = false) {
  const confirmDialog = document.getElementById("confirmDialog");
  document.getElementById("confirmMessage").innerHTML = message;

  let reasonInputHTML = requireReason
    ? `<label for="confirmReason">Lý do:</label>
       <input type="text" id="confirmReason" placeholder="Nhập lý do" required>`
    : "";

  document.getElementById("confirmExtra").innerHTML = reasonInputHTML;

  confirmDialog.showModal();

  document.getElementById("confirmYes").onclick = function () {
    let reason = requireReason ? document.getElementById("confirmReason").value.trim() : "";

    if (requireReason && !reason) {
      showDialog("⚠️ Vui lòng nhập lý do rút tiền!");
      return;
    }

    confirmDialog.close();
    callback(reason);
  };

  document.getElementById("confirmNo").onclick = function () {
    confirmDialog.close();
  };
}


// 🔹 Hiển thị Dialog Xác Nhận
// function showConfirmDialog(message, callback) {
//   const confirmDialog = document.getElementById("confirmDialog");
//   document.getElementById("confirmMessage").innerHTML = message;

//   confirmDialog.showModal();

//   // Nếu xác nhận, thực hiện callback (nạp/rút tiền)
//   document.getElementById("confirmYes").onclick = function () {
//     confirmDialog.close();
//     callback();
//   };

//   // Nếu hủy, đóng hộp thoại
//   document.getElementById("confirmNo").onclick = function () {
//     confirmDialog.close();
//   };
// }

// 🔹 Lấy dữ liệu từ Firebase khi tải trang
async function loadJars() {
  const jarsData = await getData("jar-money");
  if (jarsData) {
    for (let key in jars) {
      if (jarsData[key]) {
        jars[key].amount = jarsData[key].amount || 0;
      }
    }
  }
  updateUI();
}

// 🔹 Hiển thị lịch sử giao dịch từ Firebase
async function loadTransactions() {
  const transactions = await getData("transactions"); // Lấy dữ liệu từ Firebase

  // Kiểm tra xem phần tử bảng có tồn tại không
  const historyTable = document.getElementById("transactionHistory");
  if (!historyTable) {
    console.error("Không tìm thấy bảng lịch sử giao dịch! Kiểm tra ID trong HTML.");
    return;
  }

  let tbody = historyTable.getElementsByTagName("tbody")[0];

  // Nếu tbody không tồn tại, tạo nó
  if (!tbody) {
    tbody = document.createElement("tbody");
    historyTable.appendChild(tbody);
  }

  tbody.innerHTML = ""; // Xóa nội dung cũ trước khi tải mới

  if (transactions) {
    Object.values(transactions).forEach(trx => {
      let row = document.createElement("tr");
      row.className = trx.type === "Nạp tiền" ? "deposit" : "withdraw";
      row.innerHTML = `
        <td>${trx.type}</td>
        <td>${trx.jar}</td>
        <td>${trx.amount.toLocaleString()} VND</td>
        <td>${trx.time}</td>
        <td>${trx.reason ? trx.reason : "Không có lý do"}</td>
      `;
      tbody.appendChild(row);
    });
  }
}



// 🔹 Cập nhật giao diện UI
function updateUI() {
  const container = document.getElementById("jars-container");
  const totalMoneyElement = document.getElementById("total-money");
  container.innerHTML = "";

  let totalMoney = 0;

  for (let key in jars) {
    totalMoney += jars[key].amount;

    let jarElement = document.createElement("div");
    jarElement.className = "jar";
    jarElement.innerHTML = `
    <div class="card wallet">
      <div class="overlay"></div>
      <div class="circle">
        <img src="./assets/img/jar-icon/${jars[key].id}.png" alt="" srcset="">
      </div>
      <p>${jars[key].name}  ${jars[key].percentage}%</p> 

      <strong class="amount">${jars[key].amount.toLocaleString()} VND</strong>
    </div>
    `
    container.appendChild(jarElement);
  }

  totalMoneyElement.textContent = totalMoney.toLocaleString();
}

// 🔹 Xác nhận & Nạp tiền vào các hũ
function confirmNapTien() {
  let money = parseInt(document.getElementById("totalAmount").value);
  if (money > 0) {
    showConfirmDialog(`Bạn có chắc chắn muốn nạp ${money.toLocaleString()} VND vào các hũ không?<br>bằng chữ: <b style="color: red">${readNumber(money)}</b> `, async function () {
      for (let key in jars) {
        jars[key].amount += (money * jars[key].percentage) / 100;
        await saveData(`jar-money/${key}/amount`, jars[key].amount);
      }
      await addTransaction("Nạp tiền", "Tất cả", money);
      updateUI();
      loadTransactions();

      // Chạy GIF, rồi mới hiện dialog sau 3s
      showTransactionGif("deposit", () => {
        showDialog(`✅ Đã nạp ${money.toLocaleString()} VND vào các hũ`);
      });

    });
  } else {
    showDialog("⚠️ Vui lòng nhập số tiền hợp lệ!");
  }
}

// 🔹 Xác nhận & Rút tiền từ một hũ cụ thể
function confirmRutTien() {
  let money = parseInt(document.getElementById("withdrawAmount").value);
  let jarKey = document.getElementById("jarSelect").value;

  if (money > 0 && jars[jarKey].amount >= money) {
    showConfirmDialog(
      `Bạn có chắc chắn muốn rút ${money.toLocaleString()} VND từ hũ ${jars[jarKey].name} không?<br>Bằng chữ: <b style="color: red">${readNumber(money)}</b>`,
      async function (reason) {
        jars[jarKey].amount -= money;
        await saveData(`jar-money/${jarKey}/amount`, jars[jarKey].amount);
        await addTransaction("Rút tiền", jars[jarKey].name, money, reason);
        updateUI();
        loadTransactions(); // Load lại lịch sử giao dịch
        // Chạy GIF, rồi mới hiện dialog sau 3s
        showTransactionGif("withdraw", () => {
          showDialog(`✅ Đã rút ${money.toLocaleString()} VND từ hũ ${jars[jarKey].name} <br> Lý do: ${reason}`);
        });
      },
      true // Kích hoạt ô nhập lý do
    );

  } else {
    showDialog(`❌ Hũ ${jars[jarKey].name} không đủ tiền!`);
  }
}


// 🔹 Load dữ liệu khi trang tải
window.onload = async function () {
  await loadJars();
  await loadTransactions();

  document.getElementById("btnNapTien").addEventListener("click", confirmNapTien);
  document.getElementById("btnRutTien").addEventListener("click", confirmRutTien);
  document.getElementById("closeDialog").addEventListener("click", () => {
    document.getElementById("messageDialog").close();
  });
};

export { confirmNapTien, confirmRutTien };
