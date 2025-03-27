export const formatDate = (datejson) => {
    const date = new Date(datejson);
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
    const y = String(date.getFullYear()).slice(-2); // Last two digits of the year

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const period = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format

    return `${d}-${m}-${y} ${hours}:${minutes} ${period}`;
  };