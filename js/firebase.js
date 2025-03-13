const FIREBASE_URL = "https://vulgarveto-default-rtdb.asia-southeast1.firebasedatabase.app";

// 🔹 Lưu dữ liệu vào Firebase theo `path`
async function saveData(path, data) {
  try {
    const response = await fetch(`${FIREBASE_URL}/${path}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      console.log(`✅ Dữ liệu đã lưu vào: ${path}`);
    } else {
      console.error(`❌ Lỗi khi lưu dữ liệu vào: ${path}`);
    }
  } catch (error) {
    console.error("❌ Lỗi kết nối Firebase:", error);
  }
}

// 🔹 Lấy dữ liệu từ Firebase theo `path`
async function getData(path) {
  try {
    const response = await fetch(`${FIREBASE_URL}/${path}.json`);
    if (!response.ok) {
      console.error(`❌ Lỗi khi tải dữ liệu từ: ${path}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Lỗi kết nối Firebase:", error);
    return null;
  }
}

// 🔹 Thêm giao dịch vào lịch sử
async function addTransaction(type, jarName, amount) {
  const transaction = {
    type,
    jar: jarName,
    amount,
    time: new Date().toLocaleString()
  };

  try {
    const response = await fetch(`${FIREBASE_URL}/transactions.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transaction),
    });

    if (response.ok) {
      console.log(`✅ Giao dịch ${type} ${amount.toLocaleString()} VND đã được lưu.`);
    } else {
      console.error("❌ Lỗi khi lưu giao dịch!");
    }
  } catch (error) {
    console.error("❌ Lỗi kết nối Firebase:", error);
  }
}

export { saveData, getData, addTransaction };
