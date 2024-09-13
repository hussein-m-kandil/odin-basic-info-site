function showNewDatetimeEverySecond(element) {
  element.textContent = new Date();
  setTimeout(() => showNewDatetimeEverySecond(element), 1000);
}

const datetime = document.getElementById("datetime");

if (datetime) {
  showNewDatetimeEverySecond(datetime);
}
