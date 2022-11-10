export function truncate(str, n, useWordBoundary) {
  if (str.length <= n) {
    return str;
  }
  const subString = str.substr(0, n - 1); // the original check
  return (
    (useWordBoundary
      ? subString.substr(0, subString.lastIndexOf(" "))
      : subString) + "..."
  );
}

export function formatNumber(number, dec = 2, dsep, tsep) {
  if (number == 0) return 0;
  if (isNaN(+number) || number == null) return "";
  number = parseFloat(number);
  number = number.toFixed(~~dec);
  tsep = typeof tsep == "string" ? tsep : ",";

  var parts = number.split("."),
    fnums = parts[0],
    decimals = parts[1] ? (dsep || ".") + parts[1] : "";

  return fnums.replace(/(\d)(?=(?:\d{3})+$)/g, "$1" + tsep) + decimals;
}

export function formatDateToHuman(timestamp) {
  //convert to UTC
  let d = new Date(
    timestamp * 1000 + new Date().getTimezoneOffset() * 60 * 1000
  );
  return (
    [
      d.getDate().toString().padStart(2, "0"),
      `${(d.getMonth() + 1).toString().padStart(2, "0")}`,
      d.getFullYear(),
    ].join("/") +
    " " +
    [
      `${d.getHours()}`.padStart(2, "0"),
      `${d.getMinutes()}`.padStart(2, "0"),
      `${d.getSeconds()}`.padStart(2, "0"),
    ].join(":")
  );
}

export function shortenAddress(address) {
  if (!address) return "";
  return address.slice(0, 6) + "..." + address.slice(-6);
}
