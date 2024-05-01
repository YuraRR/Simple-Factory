function createPricesMenu() {
  const pricesMenu = document.querySelector(".pricesInfo-menu");
  const moneyBlockButton = document.querySelector(".tool-menu__moneyBlock");
  const pricesMenuList = pricesMenu.querySelector(".pricesInfo-menu__list");

  allItems.forEach((item) => {
    if (item.isMovable != false && item.type != "altRecipe") {
      const itemBlock = document.createElement("div");
      itemBlock.classList.add("pricesInfo-menu__item");
      itemBlock.innerHTML = `
      <img src="${item.imageSrc}"/>
      <span>${item.name}</span>
      <span>${item.price}$</span>
       `;
      pricesMenuList.appendChild(itemBlock);
    }
  });

  pricesMenu.querySelector(".close-button").onclick = () => pricesMenu.classList.add("hidden");

  // setTimeout(() => {
  //   document.querySelector(`[data-building-type="tradingTerminal"] .clickArea`).onclick = () => {
  //     pricesMenu.classList.remove("hidden");
  //     allOpenedMenu.push(pricesMenu);
  //   };
  // }, 500);

  dragElement(pricesMenu.id);
  moneyBlockButton.addEventListener("click", () => {
    pricesMenu.classList.toggle("hidden");
    allOpenedMenu.push(pricesMenu);
  });
}
createPricesMenu();
