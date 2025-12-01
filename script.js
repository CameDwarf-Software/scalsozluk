let items = [];
let draggedItem = null;
let offsetX = 0;
let offsetY = 0;

fetch("data.json")
  .then(r => r.json())
  .then(d => {
    items = d.items;
    loadItems();
  });

function loadItems() {
  const area = document.querySelector(".area");
  items.forEach(obj => {
    const div = document.createElement("div");
    div.className = "item";
    div.textContent = obj.name;
    div.style.left = obj.x + "px";
    div.style.top = obj.y + "px";
    enableDrag(div);
    area.appendChild(div);
  });
}

function enableDrag(el) {
  // Mouse
  el.addEventListener("mousedown", startDrag);
  document.addEventListener("mousemove", onDrag);
  document.addEventListener("mouseup", stopDrag);

  // Touch (telefon)
  el.addEventListener("touchstart", startDragTouch, { passive: false });
  document.addEventListener("touchmove", onDragTouch, { passive: false });
  document.addEventListener("touchend", stopDragTouch);
}

function startDrag(e) {
  draggedItem = e.target;
  offsetX = e.clientX - draggedItem.offsetLeft;
  offsetY = e.clientY - draggedItem.offsetTop;
}

function onDrag(e) {
  if (!draggedItem) return;
  draggedItem.style.left = (e.clientX - offsetX) + "px";
  draggedItem.style.top = (e.clientY - offsetY) + "px";
}

function stopDrag() {
  if (!draggedItem) return;
  checkDrop(draggedItem);
  draggedItem = null;
}

// Touch başlat
function startDragTouch(e) {
  e.preventDefault();
  draggedItem = e.target;
  const t = e.touches[0];
  offsetX = t.clientX - draggedItem.offsetLeft;
  offsetY = t.clientY - draggedItem.offsetTop;
}

// Touch sürükleme
function onDragTouch(e) {
  if (!draggedItem) return;
  e.preventDefault();
  const t = e.touches[0];
  draggedItem.style.left = (t.clientX - offsetX) + "px";
  draggedItem.style.top = (t.clientY - offsetY) + "px";
}

// Touch bırak
function stopDragTouch() {
  if (!draggedItem) return;
  checkDrop(draggedItem);
  draggedItem = null;
}

// Drop kontrolü
function checkDrop(item) {
  const dropzones = document.querySelectorAll(".dropzone");
  dropzones.forEach(zone => {
    const rect = zone.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    if (
      itemRect.left < rect.right &&
      itemRect.right > rect.left &&
      itemRect.top < rect.bottom &&
      itemRect.bottom > rect.top
    ) {
      // doğru eşleşme
      if (zone.dataset.meaning === items.find(i => i.name === item.textContent).meaning) {
        zone.textContent = item.textContent;
        item.style.display = "none";
      } else {
        alert("Yanlış eşleşme!");
        // isteğe bağlı: item'ı eski konumuna geri at
        item.style.left = items.find(i => i.name === item.textContent).x + "px";
        item.style.top = items.find(i => i.name === item.textContent).y + "px";
      }
    }
  });
}
