class GarageMenu extends BuildingMenu {
  constructor(tile, id) {
    super(tile, id);
    this.tile = tile;
    this.tileData = tile.dataset;
    this.id = id;
    this.name = "garage";
    this.menuOpened = false;
  }

  menuCreation() {
    const container = document.querySelector("#menu-container");
    const menu = document.createElement("div");
    const menuData = menu.dataset;

    menuData.menuId = this.id;
    menuData.menuType = this.name;
    menuData.parentTileId = this.tile.id;
    this.tile.dataset.trucksInGarage = 0;
    menu.classList.add("garageMenu", "hidden");
    menu.id = `Garage${this.id}`;
    menuData.menuType = this.name;
    const menuContent = `
    <h3>Garage</h3>
    <div class="garageMenu__truckList"></div>
    <div class="garageMenu__buttons">
      <ul>
        <li>Price: 1000$ </li>
        <li>Speed: 85 tiles/m</li>
        <li>Capacity: 8</li>
      </ul>
      <button class="buyTruck"></button>
      <button class="close-button"></button>
    </div>`;
    menu.innerHTML = menuContent;

    menu.querySelectorAll("img").forEach((image) => {
      image.draggable = false;
    });
    container.appendChild(menu);
    dragElement(menu.id);
    this.closeButton(menu);
    this.menu = menu;
    this.menuButtons(menu);
    console.log(menu);
    return menu;
  }

  menuButtons(menu) {
    const trucksAvailableText = menu.querySelector(".trucks__available");
    menu.querySelector(".buyTruck").onclick = () => {
      if (+this.tile.dataset.trucksInGarage > 4) return notyf.error("Garage is full!");
      if (money < 300) return notyf.error("No money!");
      money -= 300;
      updateMoney();
      trucksAvailable++, trucksTotal++;
      this.tile.dataset.trucksInGarage++;
      updateTrucksAmountInfo(trucksAvailableText);
      updateTrucksInGarage(menu, this.tile);
    };
  }
}
class TruckMenu {
  constructor(truckId, itemName, exportStation, importStation) {
    this.id = truckId;
    this.name = "Truck";
    this.itemName = itemName;
    this.itemAmount = 8;
    this.exportStation = exportStation;
    this.importStation = importStation;
    this.exportStationId = exportStation.dataset.stationId;
    this.importStationId = importStation.dataset.stationId;
  }
  closeTruckMenu(menu) {
    const closeBtn = menu.querySelector(".close-button");
    closeBtn.addEventListener("click", () => {
      menu.classList.add("hidden");
      resetGhost();
    });

    document.addEventListener("keydown", (event) => {
      event.code == "Escape" ? resetGhost() : null;
    });
  }
  menuCreation() {
    setTimeout(() => {
      this.route = allRoutesList.find((routeObj) => routeObj.id == this.exportStation.dataset.routeId);
      const routeSpan = menu.querySelector(".truckMenu__routeName");
      routeSpan.style.backgroundColor = this.route.color;
    }, 200);

    const container = document.querySelector("#menu-container");
    const menu = document.createElement("div");
    menu.classList.add("truckMenu", "hidden");
    menu.id = `Truck${this.id}`;
    const menuContent = `
    <h3 class="truckMenu__truckName">Truck ${this.id}</h3>
    <div class="truckMenu__resBlock">
      <img class="truckMenu__resImg" src="/img/resourcesIcons/${this.itemName}.png" />
      <span class="truckMenu__resName">${this.itemName}</span>
      <span class="truckMenu__resAmount">${this.itemAmount}/8</span>
    </div>
    <span class="truckMenu__routeName">
    Cargo Station ${this.exportStationId} — Cargo Station ${this.importStationId}</span>
    <span class="truckMenu__truckState">Loading</span>
    <button class="truckMenu__sell-button">Sell truck <img src="./img/buttonIcons/sellIcon.png"></button>
    <button class="close-button"></button>`;
    menu.innerHTML = menuContent;
    menu.querySelectorAll("img").forEach((image) => {
      image.draggable = false;
    });
    container.appendChild(menu);
    dragElement(menu.id);
    this.closeTruckMenu(menu);

    this.menu = menu;
    return menu;
  }
  updateMenu(itemName) {
    this.itemName = itemName;
    const itemImg = this.menu.querySelector(".truckMenu__resImg");
    const itemNameText = this.menu.querySelector(".truckMenu__resName");
    itemImg.src = `/img/resourcesIcons/${this.itemName}.png`;
    itemNameText.textContent = this.itemName;
  }
  removeTruck(truckBlock) {
    const sellButton = this.menu.querySelector(".truckMenu__sell-button");
    sellButton.addEventListener("click", () => {
      truckBlock.dataset.toRemove = "true";
      this.menu.remove();
    });
  }
}
function updateTrucksAmountInfo(trucksText) {
  const totalTrucksAmount = document.querySelector(".totalTrucksAmount");
  totalTrucksAmount.textContent = `${trucksAvailable}/${trucksTotal}`;
  trucksText && (trucksText.textContent = `Trucks available —  ${trucksAvailable}/${trucksTotal}`);
}

function updateTrucksInGarage(menu, tile, type) {
  if (!menu) {
    const allGarageMenu = document.querySelectorAll(".garageMenu");

    for (let i = 0; i < allGarageMenu.length; i++) {
      menu = allGarageMenu[i];
      tile = document.getElementById(menu.dataset.parentTileId);
      tile.dataset.trucksInGarage =
        type === "minus"
          ? Math.max(0, tile.dataset.trucksInGarage - 1)
          : Math.min(5, parseInt(tile.dataset.trucksInGarage || 0) + 1);
      // Проверяем условие и прерываем цикл, если оно выполнено
      if (tile.dataset.trucksInGarage === "0" || tile.dataset.trucksInGarage === "5") {
        break;
      }
    }
  }

  const trucksList = menu.querySelector(".garageMenu__truckList");
  trucksList.innerHTML = "";
  for (let i = 0; i < tile.dataset.trucksInGarage; i++) {
    const htmlContent = `
    <div class="garageMenu__truck">
      <img class="truck-image__img" src="/img/transport/truckDown.png" >
    </div>`;
    trucksList.insertAdjacentHTML("beforeend", htmlContent);
  }
}
