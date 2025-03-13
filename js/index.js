const jars = {
  essential: { name: "Thiết yếu", percentage: 55, amount: 0 },
  savings: { name: "Tiết kiệm", percentage: 10, amount: 0 },
  education: { name: "Giáo dục", percentage: 10, amount: 0 },
  investment: { name: "Đầu tư", percentage: 10, amount: 0 },
  enjoyment: { name: "Hưởng thụ", percentage: 10, amount: 0 },
  charity: { name: "Từ thiện", percentage: 5, amount: 0 }
};

// Biến quản lý tổng tiền
let realMoney = 0;
let banking = 0;
let sumMoney = 0;

function thu(money, type) {
  // Cập nhật tiền mặt hoặc tài khoản ngân hàng
  if (type === "real") realMoney += money;
  if (type === "banking") banking += money;

  sumMoney += money;

  // Tự động phân bổ tiền vào các hũ theo tỷ lệ
  for (let key in jars) {
    let jar = jars[key];
    let amountToAdd = (money * jar.percentage) / 100;
    jar.amount += amountToAdd;
  }

  console.log("Tiền đã được phân bổ vào các hũ!");
}

function chi(money, jarKey) {
  if (!jars[jarKey]) {
    console.log("⚠️ Hũ không tồn tại!");
    return;
  }

  if (jars[jarKey].amount < money) {
    console.log(`❌ Hũ ${jars[jarKey].name} không đủ tiền!`);
    return;
  }

  jars[jarKey].amount -= money;
  console.log(`✅ Đã rút ${money.toLocaleString()} VND từ hũ ${jars[jarKey].name}`);
}

// 🏦 Ví dụ: Chi 500.000 VND từ hũ "Thiết yếu"
chi(500000, "essential");

// Kiểm tra số dư
console.log(jars);
