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

    // atasözlerini ekleme
    data.forEach((item, i) => {
        let div = document.createElement("div");
        div.className = "item";
        div.draggable = true;
        div.id = "p" + i;
        div.innerText = item.soz;

        div.addEventListener("dragstart", dragStart);
        proverbContainer.appendChild(div);
    });

    // anlam dropzone oluşturma
    data
        .map((item, i) => ({ index: i, text: item.anlam }))
        .sort(() => Math.random() - 0.5)
        .forEach(item => {
            let zone = document.createElement("div");
            zone.className = "dropzone";
            zone.dataset.index = item.index;
            zone.innerText = item.text;

            zone.addEventListener("dragover", e => e.preventDefault());
            zone.addEventListener("drop", dropItem);

            meaningContainer.appendChild(zone);
        });
}

function dragStart(e) {
    e.dataTransfer.setData("id", e.target.id);
}

function dropItem(e) {
    let draggedId = e.dataTransfer.getData("id");
    let draggedIndex = draggedId.replace("p", "");

    if (draggedIndex == e.target.dataset.index) {
        e.target.classList.add("correct");
        e.target.innerText += " ✔️";
    } else {
        e.target.classList.add("wrong");
    }
}
