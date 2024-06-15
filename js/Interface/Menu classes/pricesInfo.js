function createPricesMenu() {
  const pricesMenu = document.querySelector(".pricesInfo-menu");
  const moneyBlockButton = document.querySelector(".tool-menu__moneyBlock");
  const pricesMenuList = pricesMenu.querySelector(".pricesInfo-menu__list");

  allItems.forEach((item) => {
    if (item.isMovable != false && item.isAltRecipe != true) {
      const itemBlock = document.createElement("div");
      itemBlock.classList.add("pricesInfo-menu__item");
      itemBlock.innerHTML = `
      <img src="${item.imageSrc}"/>
      <span>${item.name}</span>
      <span>$${item.price}</span>`;
      pricesMenuList.appendChild(itemBlock);
    }
  });

  pricesMenu.querySelector(".close-button").onclick = () => pricesMenu.classList.add("hidden");

  moneyBlockButton.addEventListener("click", () => {
    modalMenu.classList.add("hidden");
    if (pricesMenu.classList.contains("hidden")) {
      allOpenedMenu.forEach((e) => e.classList.add("hidden"));
      allOpenedMenu.push(pricesMenu);
      pricesMenu.classList.remove("hidden");
    } else {
      pricesMenu.classList.add("hidden");
    }
  });
}
createPricesMenu();

let itemsExported = [];
let itemsProduced = [];

function checkItemExportAmount() {
  allItems.forEach((item) => {
    const itemObj = {
      name: item.name,
      totalAmount: 0,
      amountPer60sec: 0,
      prevAmount: 0,
    };
    if (item.isMovable != false && item.isAltRecipe != true) {
      itemsExported.push(itemObj);
      itemsProduced.push(itemObj);
    }
  });
}
function updateLast60secData() {
  itemsExported.forEach((item) => {
    item.amountPer60sec = item.totalAmount - item.prevAmount;
    item.prevAmount = item.totalAmount;
  });
  itemsProduced.forEach((item) => {
    item.amountPer60sec = item.totalAmount - item.prevAmount;
    item.prevAmount = item.totalAmount;
  });
}
checkItemExportAmount();
setInterval(updateLast60secData, 60000);
function createPricesMenu() {
  const pricesMenu = document.querySelector(".pricesInfo-menu");
  const moneyBlockButton = document.querySelector(".tool-menu__moneyBlock");
  const pricesMenuList = pricesMenu.querySelector(".pricesInfo-menu__list");

  allItems.forEach((item) => {
    if (item.isMovable != false && item.isAltRecipe != true) {
      const itemBlock = document.createElement("div");
      itemBlock.classList.add("pricesInfo-menu__item");
      itemBlock.innerHTML = `
      <img src="${item.imageSrc}"/>
      <span>${item.name}</span>
      <span>$${item.price}</span>`;
      pricesMenuList.appendChild(itemBlock);
    }
  });

  pricesMenu.querySelector(".close-button").onclick = () => pricesMenu.classList.add("hidden");

  moneyBlockButton.addEventListener("click", () => {
    modalMenu.classList.add("hidden");
    if (pricesMenu.classList.contains("hidden")) {
      allOpenedMenu.forEach((e) => e.classList.add("hidden"));
      allOpenedMenu.push(pricesMenu);
      pricesMenu.classList.remove("hidden");
    } else {
      pricesMenu.classList.add("hidden");
    }
  });
}
createPricesMenu();
