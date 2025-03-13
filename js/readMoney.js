function readNumber(number) {
  if (number === 0) return "Không đồng";

  const units = ["", "mươi", "trăm"];
  const thousands = ["", "nghìn", "triệu", "tỷ", "nghìn tỷ", "triệu tỷ"];

  const numWords = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];

  let result = "";
  let numStr = number.toString();
  let numLen = numStr.length;

  let groupCount = Math.ceil(numLen / 3);
  let groups = [];

  for (let i = 0; i < groupCount; i++) {
    let start = numLen - (i + 1) * 3;
    let end = numLen - i * 3;
    let group = numStr.substring(Math.max(start, 0), end);
    groups.unshift(parseInt(group, 10));
  }

  for (let i = 0; i < groups.length; i++) {
    let num = groups[i];
    if (num === 0) continue;

    let hundred = Math.floor(num / 100);
    let ten = Math.floor((num % 100) / 10);
    let unit = num % 10;

    let part = "";
    if (hundred > 0) part += numWords[hundred] + " trăm ";

    if (ten > 1) {
      part += numWords[ten] + " mươi ";
      if (unit === 1) part += "mốt ";
      else if (unit > 0) part += numWords[unit] + " ";
    } else if (ten === 1) {
      part += "mười ";
      if (unit > 0) part += numWords[unit] + " ";
    } else if (unit > 0) {
      if (hundred > 0) part += "lẻ ";
      part += numWords[unit] + " ";
    }

    result += part + thousands[groups.length - 1 - i] + " ";
  }

  return result.trim() + " đồng";
}


export { readNumber };

// 🔹 Ví dụ sử dụng:
console.log(readNumber(123456)); // "Một trăm hai mươi ba nghìn bốn trăm năm mươi sáu đồng"
console.log(readNumber(1000200)); // "Một triệu hai trăm đồng"
console.log(readNumber(1000000000)); // "Một tỷ đồng"
