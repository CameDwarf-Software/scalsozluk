const itemsContainer = document.querySelector('.items');
const buttons = document.querySelectorAll('.option-btn');
const resultDiv = document.getElementById('result');
const restartBtn = document.getElementById('restartBtn');
const mainMenuBtn = document.getElementById('mainMenuBtn');

let correctCount = 0;
const totalCount = 4;

// Oyun başlatma
function startGame() {
  itemsContainer.innerHTML = '';
  correctCount = 0;
  updateResult();

  fetch('data.json')
    .then(res => res.json())
    .then(data => {
      const allItems = [...data.atasozleri, ...data.deyimler];
      const leftItems = getRandom(allItems, totalCount);

      leftItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'item';
        div.textContent = item.name;
        div.dataset.type = data.atasozleri.includes(item) ? 'atasozu' : 'deyim';
        div.draggable = true;
        itemsContainer.appendChild(div);

        div.addEventListener('dragstart', e => {
          if(div.classList.contains('matched') || div.classList.contains('wrong')) return e.preventDefault();
          e.dataTransfer.setData('text/plain', div.dataset.type);
          div.classList.add('selected');
        });

        div.addEventListener('dragend', e => div.classList.remove('selected'));
      });
    });
}

// Random seç
function getRandom(arr, n){
  return arr.sort(() => 0.5 - Math.random()).slice(0, n);
}

// Drop eventleri
buttons.forEach(btn => {
  btn.addEventListener('dragover', e => e.preventDefault());

  btn.addEventListener('drop', e => {
    e.preventDefault();
    const draggedDiv = document.querySelector('.item.selected');
    if(!draggedDiv) return;

    const draggedType = draggedDiv.dataset.type;
    const dropType = btn.dataset.type;

    if(draggedType === dropType){
      draggedDiv.classList.add('matched');
      draggedDiv.draggable = false;
      correctCount++;
      updateResult();
    } else {
      draggedDiv.classList.add('wrong');
      draggedDiv.draggable = false; // bir daha değişmesin
      updateResult();
    }

    draggedDiv.classList.remove('selected');
  });
});

// 4/4 sayacı güncelle
function updateResult() {
  resultDiv.textContent = `${correctCount}/${totalCount}`;
}

// Restart
restartBtn.addEventListener('click', startGame);

// Ana Menü (örnek yönlendirme)
mainMenuBtn.addEventListener('click', () => {
  window.location.href = '../index.html'; // burayı kendi ana menü sayfanla değiştir
});

// Oyunu başlat
startGame();
