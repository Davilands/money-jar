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

async function addTransaction(type, jar, amount, reason = "") {
  const transaction = {
    type,
    jar,
    amount,
    time: new Date().toLocaleString(),
    reason // Lưu lý do vào Firebase
  };

  await saveData(`transactions/${Date.now()}`, transaction);
}


export { saveData, getData, addTransaction };
