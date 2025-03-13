import { saveData, getData, addTransaction } from "./firebase.js";
import { readNumber } from "./readMoney.js";

// 🔹 Danh sách hũ tài chính mặc định
const jars = {
  essential: { name: "Thiết yếu", percentage: 55, amount: 0 },
  savings: { name: "Tiết kiệm", percentage: 10, amount: 0 },
  education: { name: "Giáo dục", percentage: 10, amount: 0 },
  investment: { name: "Đầu tư", percentage: 10, amount: 0 },
  enjoyment: { name: "Hưởng thụ", percentage: 10, amount: 0 },
  charity: { name: "Từ thiện", percentage: 5, amount: 0 }
};

// 🔹 Hiển thị Dialog Message
function showDialog(message) {
  document.getElementById("dialogMessage").innerText = message;
  document.getElementById("messageDialog").showModal();
}

// 🔹 Hiển thị Dialog Xác Nhận
function showConfirmDialog(message, callback) {
  const confirmDialog = document.getElementById("confirmDialog");
  document.getElementById("confirmMessage").innerHTML = message;

  confirmDialog.showModal();

  // Nếu xác nhận, thực hiện callback (nạp/rút tiền)
  document.getElementById("confirmYes").onclick = function () {
    confirmDialog.close();
    callback();
  };

  // Nếu hủy, đóng hộp thoại
  document.getElementById("confirmNo").onclick = function () {
    confirmDialog.close();
  };
}

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
  const transactions = await getData("transactions");
  const historyTable = document.getElementById("transactionHistory");
  historyTable.innerHTML = "";

  if (transactions) {
    Object.values(transactions).forEach(trx => {
      let row = document.createElement("tr");
      row.className = trx.type === "Nạp tiền" ? "deposit" : "withdraw";
      row.innerHTML = `
                <td>${trx.type}</td>
                <td>${trx.jar}</td>
                <td>${trx.amount.toLocaleString()} VND</td>
                <td>${trx.time}</td>
            `;
      historyTable.appendChild(row);
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
            <h2>${jars[key].name} (${jars[key].percentage}%)</h2>
            <p class="amount">${jars[key].amount.toLocaleString()} VND</p>
        `;
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
      showDialog(`✅ Đã nạp ${money.toLocaleString()} VND vào các hũ`);
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
    showConfirmDialog(`Bạn có chắc chắn muốn rút ${money.toLocaleString()} VND từ hũ ${jars[jarKey].name} không?<br>Bằng chữ: <b style="color: red">${readNumber(money)}</b>`, async function () {
      jars[jarKey].amount -= money;
      await saveData(`jar-money/${jarKey}/amount`, jars[jarKey].amount);
      await addTransaction("Rút tiền", jars[jarKey].name, money);
      updateUI();
      loadTransactions();
      showDialog(`✅ Đã rút ${money.toLocaleString()} VND từ hũ ${jars[jarKey].name}`);
    });
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
