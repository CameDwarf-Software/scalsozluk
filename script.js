let data;

fetch("data.json")
    .then(res => res.json())
    .then(json => {
        data = json.atasozleri;
        initGame();
    });

function initGame() {
    const proverbContainer = document.getElementById("proverbs");
    const meaningContainer = document.getElementById("meanings");

    // atasözlerini sol tarafa ekle
    data.forEach((item, i) => {
        let div = document.createElement("div");
        div.className = "item";
        div.draggable = true;
        div.dataset.index = i;
        div.innerText = item.soz;

        div.addEventListener("dragstart", dragStart);

        proverbContainer.appendChild(div);
    });

    // anlamları karıştırıp sağa ekle
    let shuffled = data
        .map((e, i) => ({ text: e.anlam, index: i }))
        .sort(() => Math.random() - 0.5);

    shuffled.forEach(item => {
        let zone = document.createElement("div");
        zone.className = "dropzone";
        zone.dataset.index = item.index;
        zone.innerText = item.text;

        zone.addEventListener("dragover", dragOver);
        zone.addEventListener("drop", dropItem);

        meaningContainer.appendChild(zone);
    });
}

function dragStart(e) {
    e.dataTransfer.setData("text/plain", e.target.dataset.index);
}

function dragOver(e) {
    e.preventDefault();
}

function dropItem(e) {
    e.preventDefault();

    const draggedIndex = e.dataTransfer.getData("text/plain");
    const targetIndex = e.target.dataset.index;

    if (!draggedIndex) return;

    if (draggedIndex === targetIndex) {
        e.target.classList.add("correct");
        e.target.innerHTML += " ✔️";
    } else {
        e.target.classList.add("wrong");
    }
}
