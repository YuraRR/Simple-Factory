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
    this.tile.dataset.totalTrucksInGarage = 0;
    menu.classList.add("garageMenu", "hidden");
    menu.id = `Garage${this.id}`;
    menuData.menuType = this.name;
    const menuContent = `
    <h3>Garage</h3>
    <div class="garageMenu__truckList"></div>
    <div class="garageMenu__buttons">
      <ul>
        <li>Price: $1000 </li>
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
    return menu;
  }

  menuButtons(menu) {
    const trucksAvailableText = menu.querySelector(".trucks__available");
    menu.querySelector(".buyTruck").onclick = () => {
      if (+this.tile.dataset.totalTrucksInGarage > 4) return notyf.error("Garage is full!");
      if (money < 1000) return notyf.error("No money!");
      showMoneyChange(1000, "minus");
      trucksAvailable++, trucksTotal++;
      this.tile.dataset.trucksInGarage++;
      this.tile.dataset.totalTrucksInGarage++;
      updateTrucksAmountInfo(trucksAvailableText);
      updateTrucksInGarage(menu, this.tile, "plus");
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
    deltaTimeout(() => {
      this.route = allRoutesList.find((routeObj) => routeObj.id == this.exportStation.dataset.routeId);
      const routeSpan = menu.querySelector(".truckMenu__routeName");
      routeSpan.style.backgroundColor = this.route.color;
    }, 500);

    const itemInfo = findItemObjInList(this.itemName);
    const itemImg = itemInfo.imageSrc;
    const container = document.querySelector("#menu-container");
    const menu = document.createElement("div");
    menu.classList.add("truckMenu", "hidden");
    menu.id = `Truck${this.id}`;
    const menuContent = `
    <h3 class="truckMenu__truckName">Truck ${this.id}</h3>
    <div class="truckMenu__resBlock">
      <img class="truckMenu__resImg" src="${itemImg}" />
      <span class="truckMenu__resName">${this.itemName}</span>
    </div>
    <span class="truckMenu__routeName">
    Cargo Station ${this.exportStationId} — Cargo Station ${this.importStationId}</span>
    <span class="truckMenu__truckState">Loading</span>
    <button class="truckMenu__sell-button">Sell truck <img src="../img/buttonIcons/sellIcon.png"></button>
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
    const itemInfo = findItemObjInList(this.itemName);
    const itemImg = this.menu.querySelector(".truckMenu__resImg");
    const itemNameText = this.menu.querySelector(".truckMenu__resName");
    itemImg.src = itemInfo.imageSrc;
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

function updateTrucksInGarage(menu, tile, type) {
  if (!menu) {
    const allGarageMenu = document.querySelectorAll(".garageMenu");

    for (let i = 0; i < allGarageMenu.length; i++) {
      menu = allGarageMenu[i];
      tile = document.getElementById(menu.dataset.parentTileId);
      console.log(tile);
      let trucksInGarage = parseInt(tile.dataset.trucksInGarage) || 0;

      if (type === "minus" && trucksInGarage > 0) {
        trucksInGarage--;
        tile.dataset.trucksInGarage = trucksInGarage;
        trucksAvailable--;
        break;
      } else if (type === "plus" && trucksInGarage < 5) {
        trucksInGarage++;
        tile.dataset.trucksInGarage = trucksInGarage;
        truckIdCounter--;
        trucksAvailable++;
        break;
      }
    }
  }

  const trucksList = menu.querySelector(".garageMenu__truckList");
  trucksList.innerHTML = "";
  for (let i = 0; i < tile.dataset.trucksInGarage; i++) {
    const htmlContent = `
    <div class="garageMenu__truck" data-truck-id-garage="${i}">
      <img class="truck-image__img" src="./img/transport/truckDown.png" >
      <button class="garageMenu__setToRoute"></button>
      <div class="garageMenu__routeSelect hidden"></div>
    </div>`;
    trucksList.insertAdjacentHTML("beforeend", htmlContent);

    const truckBlock = trucksList.querySelector(`[data-truck-id-garage="${i}"]`);

    truckBlock.querySelector(`.garageMenu__setToRoute`).onclick = () => {
      truckBlock.querySelector(".garageMenu__routeSelect").classList.remove("hidden");
      const routeSelect = truckBlock.querySelector(".garageMenu__routeSelect");
      routeSelect.innerHTML = "";
      allRoutesList.forEach((route) => {
        const routeSpan = document.createElement("span");
        routeSpan.textContent = `Line ${route.id}`;
        routeSpan.classList.add("garageMenu__route");
        routeSpan.style.backgroundColor = route.color;
        routeSpan.onclick = () => startRoute(route);
        routeSelect.appendChild(routeSpan);
      });
    };
  }
}
