let items = [];
let displayedItems = [];
let selectedItem = null;
let matches = new Map();

fetch("data.json")
  .then(r => r.json())
  .then(d => {
    items = d.items;
    startGame();
  });

function startGame() {
  const itemsDiv = document.querySelector(".items");
  const meaningsDiv = document.querySelector(".meanings");
  itemsDiv.innerHTML = "";
  meaningsDiv.innerHTML = "";
  matches.clear();
  selectedItem = null;
  document.getElementById("result").textContent = "";

  // Doğru olanları temizle
  document.querySelectorAll(".item, .meaning").forEach(el => {
    el.classList.remove("correct", "wrong");
  });


  displayedItems = shuffleArray([...items]).slice(0,4);
  let meanings = displayedItems.map(i => i.meaning);
  meanings = shuffleArray(meanings);

  displayedItems.forEach(obj => {
    const div = document.createElement("div");
    div.className="item";
    div.textContent = obj.name;
    div.dataset.meaning = obj.meaning;
    div.addEventListener("click", () => selectItem(div));
    itemsDiv.appendChild(div);
  });

  meanings.forEach(m => {
    const div = document.createElement("div");
    div.className="meaning";
    div.textContent = m;
    div.addEventListener("click", () => selectMeaning(div));
    meaningsDiv.appendChild(div);
  });
}

function selectItem(div) {
  // Zaten doğru/yanlış olarak işaretlenmişse tıklamayı engelle
  if (div.classList.contains("correct") || div.classList.contains("wrong")) return;

  document.querySelectorAll(".item").forEach(i => i.classList.remove("selected"));
  div.classList.add("selected");
  selectedItem = div;
}

function selectMeaning(div) {
  if (!selectedItem) return;
  // Zaten doğru/yanlış olarak işaretlenmişse tıklamayı engelle
  if (div.classList.contains("correct") || div.classList.contains("wrong")) return;

  // Önceki eşleşmeyi sil (eşleşmiş sınıfını kaldır)
  // Mevcut div'in daha önce bir item ile eşleşip eşleşmediğini kontrol et
  matches.forEach((matchedDiv, key) => {
      if (matchedDiv === div) {
          // Bu anlam eşleşmişse, o item'ın eşleşme sınıfını kaldır
          document.querySelector(`.item[data-meaning="${key}"]`).classList.remove("matched");
          matches.delete(key);
      }
  });

  matches.set(selectedItem.dataset.meaning, div);
  selectedItem.classList.add("matched");
  div.classList.add("matched");
  selectedItem.classList.remove("selected");
  selectedItem = null;
}

// Seçimleri sıfırlama
document.getElementById("resetSelectionsBtn").addEventListener("click", () => {
  document.querySelectorAll(".item, .meaning").forEach(el => {
    el.classList.remove("selected", "matched", "correct", "wrong");
  });
  matches.clear();
  selectedItem = null;
  document.getElementById("result").textContent = "";
});

// Kontrol et
document.getElementById("checkBtn").addEventListener("click", () => {
  let correct = 0;
  document.querySelectorAll(".item, .meaning").forEach(el => el.classList.remove("correct", "wrong"));

  matches.forEach((meaningDiv, meaning) => {
    if (meaningDiv.textContent === meaning) {
      meaningDiv.classList.add("correct");
      // Eşleşen item'ı da doğru işaretle
      document.querySelector(`.item[data-meaning="${meaning}"]`).classList.add("correct");
      correct++;
    } else {
      meaningDiv.classList.add("wrong");
      // Eşleşen item'ı da yanlış işaretle
      // Bu yanlış eşleşmeyi sıfırla ki kullanıcı tekrar deneyebilsin
      const wrongItem = document.querySelector(`.item[data-meaning="${meaning}"]`);
      if (wrongItem) {
          wrongItem.classList.add("wrong");
          wrongItem.classList.remove("matched");
          meaningDiv.classList.remove("matched");
          matches.delete(meaning); // Yanlış eşleşmeyi Map'ten kaldır
      }
      
    }
  });

  // İpucu: Yanlış eşleşmelerden sonra sadece yanlış olanların işaretlerini kaldırdık
  // Yani kullanıcı sadece yanlış eşleşmeleri tekrar yapmak zorunda kalacak.
  document.querySelectorAll(".wrong").forEach(el => {
      // Yanlışları 1 saniye sonra kaldır ki kullanıcı nerenin yanlış olduğunu görsün
      setTimeout(() => {
          el.classList.remove("wrong");
          el.classList.remove("matched"); // Yanlış eşleşenlerin matched sınıfını da kaldır
      }, 1000);
  });


  document.getElementById("result").textContent = `Doğru: ${correct} / 4`;
});


// Yeniden başlat
document.getElementById("restartBtn").addEventListener("click", () => {
  startGame();
});

// Ana Menü butonu
document.getElementById("mainMenuBtn").addEventListener('click', () => {
  window.location.href = "../index.html"; // kendi ana menü sayfanın yolu
});

// Karıştırma fonksiyonu
function shuffleArray(array) {
  for (let i = array.length-1; i>0; i--) {
    const j = Math.floor(Math.random()*(i+1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// =======================================================================
// YENİ EKLEMELER: YARDIM BUTONU (MODAL) İŞLEVLERİ
// =======================================================================

const helpModal = document.getElementById("helpModal");
const helpBtn = document.getElementById("helpBtn");
const closeBtn = document.getElementsByClassName("close-button")[0];

// ? butonuna tıklanınca pencereyi aç
helpBtn.onclick = function() {
  helpModal.style.display = "block";
}

// x (kapat) butonuna tıklanınca pencereyi kapat
closeBtn.onclick = function() {
  helpModal.style.display = "none";
}

// Pencere dışında herhangi bir yere tıklanınca pencereyi kapat
window.onclick = function(event) {
  if (event.target == helpModal) {
    helpModal.style.display = "none";
  }
}
