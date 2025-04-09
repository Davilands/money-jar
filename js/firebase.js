import CryptoJS from "https://cdn.jsdelivr.net/npm/crypto-js@4.1.1/+esm";
import { ENCRYPTED_URL } from "./url-encrypted.js";

let FIREBASE_URL = null;

async function getFirebaseURL() {
  const mode = localStorage.getItem("firebase_mode");

  // Nếu người dùng chọn dùng local trước đó
  if (mode === "local") return null;

  // Nếu đã lưu URL và mode = firebase thì dùng luôn
  const cachedURL = localStorage.getItem("firebase_url");
  if (cachedURL && mode === "firebase") {
    return cachedURL;
  }

  // Nếu chưa chọn, hỏi người dùng
  const useLocal = confirm("🔄 Bạn muốn dùng chế độ LocalStorage (offline)?\nChọn 'Cancel' để dùng Firebase.");
  if (useLocal) {
    localStorage.setItem("firebase_mode", "local");
    return null;
  }

  // Ngược lại, tiếp tục yêu cầu mật khẩu giải mã URL
  while (true) {
    const key = prompt("🔐 Nhập mật khẩu để giải mã Firebase URL:");
    if (!key) return null;

    try {
      const decrypted = CryptoJS.AES.decrypt(ENCRYPTED_URL, key).toString(CryptoJS.enc.Utf8);
      if (decrypted.startsWith("https://")) {
        localStorage.setItem("firebase_url", decrypted);
        localStorage.setItem("firebase_mode", "firebase");
        return decrypted;
      }
    } catch (e) { }

    alert("❌ Sai mật khẩu, thử lại.");
  }
}


function saveToLocal(path, data) {
  const storageKey = `local_${path}`;
  localStorage.setItem(storageKey, JSON.stringify(data));
}


function loadFromLocal(path) {
  // Trường hợp lấy tất cả các hũ
  if (path === "jar-money") {
    const jars = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith("local_jar-money/")) {
        try {
          const jarKey = key.split("/")[1]; // e.g. "essential"
          const value = JSON.parse(localStorage.getItem(key));
          jars[jarKey] = { amount: value }; // để giống cấu trúc Firebase
        } catch (e) {
          console.warn("Lỗi parse local jar:", key);
        }
      }
    }
    return Object.keys(jars).length ? jars : null;
  }

  // Trường hợp load 1 path cụ thể
  const storageKey = `local_${path}`;
  const raw = localStorage.getItem(storageKey);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}


async function saveData(path, data) {
  const baseURL = await getFirebaseURL();
  if (!baseURL) {
    console.warn(`⚠️ Lưu vào localStorage thay vì Firebase: ${path}`);
    saveToLocal(path, data);
    return;
  }

  const response = await fetch(`${baseURL}/${path}.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    console.error(`❌ Lỗi khi lưu vào: ${path}`);
    saveToLocal(path, data); // fallback nếu Firebase lỗi
  }
}

async function getData(path) {
  const baseURL = await getFirebaseURL();
  if (!baseURL) {
    console.warn(`⚠️ Lấy dữ liệu từ localStorage thay vì Firebase: ${path}`);
    return loadFromLocal(path);
  }

  const response = await fetch(`${baseURL}/${path}.json`);
  if (!response.ok) {
    console.error(`❌ Lỗi khi tải dữ liệu từ: ${path}`);
    return loadFromLocal(path); // fallback nếu lỗi
  }

  try {
    return await response.json();
  } catch (e) {
    return loadFromLocal(path);
  }
}

async function addTransaction(type, jar, amount, reason = "", balanceAfter = null) {
  const transaction = {
    type,
    jar,
    amount,
    time: new Date().toLocaleString(),
    reason,
    balanceAfter
  };

  const path = `transactions/${Date.now()}`;
  await saveData(path, transaction);
}

export { saveData, getData, addTransaction };
