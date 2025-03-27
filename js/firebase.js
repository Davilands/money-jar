import CryptoJS from "https://cdn.jsdelivr.net/npm/crypto-js@4.1.1/+esm";
import { ENCRYPTED_URL } from "./url-encrypted.js"; // chứa chuỗi mã hóa AES

// Lấy URL từ localStorage (nếu đã giải mã), hoặc hỏi mật khẩu
let FIREBASE_URL = "";

async function getFirebaseURL() {
  const cachedURL = localStorage.getItem("firebase_url");
  if (cachedURL) return cachedURL;

  while (true) {
    const key = prompt("🔐 Nhập mật khẩu để giải mã Firebase URL:");
    if (!key) return null;

    try {
      const decrypted = CryptoJS.AES.decrypt(ENCRYPTED_URL, key).toString(CryptoJS.enc.Utf8);
      if (decrypted.startsWith("https://")) {
        localStorage.setItem("firebase_url", decrypted);
        return decrypted;
      }
    } catch (e) {
      // tiếp tục vòng lặp
    }

    alert("❌ Sai mật khẩu, thử lại.");
  }
}

// Hàm gọi fetch (gọi sau khi có URL)
async function saveData(path, data) {
  const baseURL = await getFirebaseURL();
  if (!baseURL) return;

  const response = await fetch(`${baseURL}/${path}.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    console.error(`❌ Lỗi khi lưu vào: ${path}`);
  }
}

async function getData(path) {
  const baseURL = await getFirebaseURL();
  if (!baseURL) return null;

  const response = await fetch(`${baseURL}/${path}.json`);
  if (!response.ok) {
    console.error(`❌ Lỗi khi tải dữ liệu từ: ${path}`);
    return null;
  }

  return await response.json();
}

async function addTransaction(type, jar, amount, reason = "") {
  const transaction = {
    type,
    jar,
    amount,
    time: new Date().toLocaleString(),
    reason
  };

  await saveData(`transactions/${Date.now()}`, transaction);
}

export { saveData, getData, addTransaction };
