class CargoStationMenu extends BuildingMenu {
  constructor(tile, id) {
    super(tile, id);
    this.tile = tile;
    this.tileData = tile.dataset;
    this.id = id;
    this.name = "Cargo Station";
    this.menuOpened = false;
  }
  menuCreation(item) {
    const container = document.querySelector("#menu-container");
    let menu = document.createElement("div");
    menu.classList.add("cargoStationMenu", "hidden");
    menu.id = `CargoStation${this.id}`;
    let menuContent = `
      <h2>${this.name} ${this.id} (${this.tileData.connectedTo})</h2>
      <h3>Choose mode</h3>
      <div class="cargoStationMenu__mode">
        <div class ="cargoStationMenu__button">
          <button class="stationExport">
            <img src="/img/buttonIcons/exportLogo.png" />
          </button>
          <span>Export</span>
          <div class="exportSelect hidden"> </div>
        </div>
        <div class ="cargoStationMenu__button">
          <button class="stationImport">
            <img src="/img/buttonIcons/importLogo.png" />
          </button>
          <span>Import</span>
          <div class="importSelect hidden"> </div>
        </div>
      </div>
        <h3>Create route</h3>
        <div class="cargoStationMenu__routes">
        <span class="cargoStationMenu__noStations">Wrong Station mode or no accessible stations</span>
        </div>
        <div class="cargoStationMenu__trucks">
          <div>
            <span class="trucks__available">Trucks available —  ${trucksAvailable}/${trucksTotal}</span>
            <button class="buyTruck">Buy truck</button>
          </div>
          <div class="trucks__amount">
            <span class="trucks__current">Trucks on current route —  0/4</span>
            <div class="trucks__buttons">
              <button class="addTruck">Add truck</button>
              <button class="deleteTruck">Delete truck</button>
            </div>
          </div>
        </div>
        <div class="cargoStationMenu__routeInfo">
          <button class="close-button"></button>
          <span class="cargoStationMenu__routeInfo-span">Route not selected</span>
       </div>
       <div class="cargoStationMenu__item">
          <img class="itemImg" src="./img/resourcesIcons/noItem.svg" />
          <span class="itemAmount">0</span>
          <h3 class="itemName">Empty</h3>
     </div>`;

    menu.innerHTML = menuContent;
    menu.dataset.cargoStationId = this.id;
    this.tileData.stationId = this.id;
    menu.dataset.parentTileId = this.tile.id;
    menu.querySelectorAll("img").forEach((image) => {
      image.draggable = false;
    });
    container.appendChild(menu);
    this.menuButtons(menu, item);
    this.menuUpdate(menu, item);
    this.closeButton(menu);
    this.createRouteBlock(menu);
    this.updateRoutesList();

    dragElement(menu.id);
  }
  menuUpdate(menu, defaultItem) {
    const itemPriceSell = menu.querySelector(".sellPrice");
    const itemPriceBuy = menu.querySelector(".buyPrice");
    const itemAmount = menu.querySelector(".itemAmount");
    const itemImg = menu.querySelector(".itemImg");
    const itemEfficency = menu.querySelector(".itemEff");
    const itemName = menu.querySelector(".itemName");
    const trucksAvailableText = menu.querySelector(".trucks__available");

    let item;
    let stationObj = defaultItem.stationObj;

    setInterval(() => {
      let selectedExportItem = this.tileData.cargoStationItem;
      if (this.tileData.cargoStationType == "Export" && this.tileData.connectedTo != "tradingTerminal") {
        item = stationObj.updateData(defaultItem.mainFactoryTile, "export");
      } else if (
        this.tileData.cargoStationType == "Export" &&
        this.tileData.connectedTo == "tradingTerminal"
      ) {
        item = stationObj.updateData(defaultItem.mainFactoryTile, "export", selectedExportItem);
      } else {
        item = stationObj.updateData(defaultItem.mainFactoryTile, "import");
      }

      //prettier-ignore
      {
        // itemPriceBuy.textContent = `Buy 1 for ${item.buyPrice}$  —  ${item.amount} for ${item.buyPrice * item.amount}$ `
        // itemPriceSell.textContent = `Sell 1 for ${item.sellPrice}$  —  ${item.amount} for ${item.sellPrice * item.amount}$ `
        // itemEfficency.innerHTML = `${item.amountPerMin} ${item.name} — 60 <img src="img/buttonIcons/clock.png" alt="" />`
        
      }

      itemName.textContent = item.name || "Empty";
      itemAmount.textContent = item.amount;
      itemImg.src = item.imgSrc || "./img/resourcesIcons/noItem.svg";
      if (this.tileData.connectedTo != "tradingTerminal") {
        this.tileData.cargoStationItem = item.name;
      }

      this.updateTrucksAmountInfo(trucksAvailableText);
      //Route visual
      if (menu.style.display != "none" && !this.tile.classList.contains("pointRoute")) {
        const routeObj = allRoutesList.find((routeObj) => routeObj.id == this.tile.dataset.routeId);
        if (routeObj && this.menuOpened) stationObj.drawRoute(routeObj);
      }
    }, 1000);
    this.selectImportMaterial(menu, defaultItem);
    this.selectExportMaterial(menu, defaultItem);
  }
  menuButtons(menu, defaultItem) {
    const newBuilding = defaultItem.stationObj;
    const trucksAvailableText = menu.querySelector(".trucks__available");
    const trucksCurrentText = menu.querySelector(".trucks__current");
    const stationExportBtn = menu.querySelector(".stationExport");
    const stationImportBtn = menu.querySelector(".stationImport");
    let trucksOnRoute = 0;
    let maxTrucksOnRoute = 4;
    menu.querySelector(".buyTruck").onclick = () => {
      trucksAvailable++, trucksTotal++;
      this.updateTrucksAmountInfo(trucksAvailableText);
    };

    menu.querySelector(".addTruck").onclick = () => {
      if (trucksOnRoute != maxTrucksOnRoute && trucksAvailable > 0) {
        this.selectStation(menu);
        let route = newBuilding.calculateRoute([this.tile, []]);
        newBuilding.createRouteDirections(route);
        trucksAvailable--, trucksOnRoute++;
        this.updateTrucksAmountInfo(trucksAvailableText);
        trucksCurrentText.textContent = `Trucks on current route —  ${trucksOnRoute}/${maxTrucksOnRoute}`;
      }
    };
    menu.querySelector(".deleteTruck").onclick = () => {
      if (trucksOnRoute) {
        trucksAvailable++, trucksOnRoute--;
        this.updateTrucksAmountInfo(trucksAvailableText);
        const route = allRoutesList.find((route) => route.id == defaultItem.stationTile.dataset.routeId);
        const truckToRemove = route.find((truck) => truck.id == 1);
        console.log(allRoutesList);
        trucksCurrentText.textContent = `Trucks on current route —  ${trucksOnRoute}/${maxTrucksOnRoute}`;
      }
    };
    if (defaultItem.mainFactoryTile.dataset.buildingType == "mineshaft") {
      stationExportBtn.classList.add("buttonActive");
    } else {
      stationExportBtn.onclick = () => {
        this.tileData.cargoStationType = "Export";
        stationExportBtn.classList.add("buttonActive");
        stationImportBtn.classList.remove("buttonActive");
        menu.querySelector(".exportSelect").classList.remove("hidden");
      };
      stationImportBtn.onclick = () => {
        this.tileData.cargoStationType = "Import";
        stationImportBtn.classList.add("buttonActive");
        stationExportBtn.classList.remove("buttonActive");
        menu.querySelector(".importSelect").classList.remove("hidden");
      };
    }
  }
  updateTrucksAmountInfo(trucksText) {
    trucksText.textContent = `Trucks available —  ${trucksAvailable}/${trucksTotal}`;
  }
  createRouteBlock(menu) {
    const allStations = document.querySelectorAll(`[data-building-type="cargoStation"]`);
    const routeContainer = menu.querySelector(".cargoStationMenu__routes");
    const targetStation = document.querySelector(`[data-station-id="${menu.dataset.cargoStationId}"]`);
    const noStationsText = menu.querySelector(".cargoStationMenu__noStations");
    if (!noStationsText) routeContainer.innerHTML = "";
    allStations.forEach((cargoStation) => {
      const data = cargoStation.dataset;
      const stationObj = {
        id: data.stationId,
        type: data.cargoStationType,
        provideItemName: data.cargoStationItem || "Empty",
      };

      if (stationObj.type != targetStation.dataset.cargoStationType) {
        if (noStationsText) routeContainer.innerHTML = "";
        const routeElem = document.createElement("div");
        routeElem.classList.add("cargoStationMenu__route");
        const htmlContent = `
              <span>
              Cargo Station ${stationObj.id} — <img src="/img/buttonIcons/${stationObj.type}Small.png" title="${stationObj.type}" /> —
              </span>
              <span class="itemNameImg">
              ${stationObj.provideItemName} <img src="/img/buttonIcons/${stationObj.provideItemName}.png"/>
              </span>
              <input type="radio" id="Cargo Station ${stationObj.id}" name="selectStation" />`;
        routeElem.innerHTML = htmlContent;
        if (stationObj.provideItemName == targetStation.dataset.cargoStationItem) {
          routeElem.classList.add("highlightElem");
        }
        routeContainer.appendChild(routeElem);
      }
    });
  }
  updateRoutesList() {
    const allStationsMenu = document.querySelectorAll(".cargoStationMenu");
    allStationsMenu.forEach((menu) => {
      this.createRouteBlock(menu);
    });
  }
  selectStation(menu) {
    currentStationChangeText(menu);
    function currentStationChangeText(menu) {
      console.log(menu);
      const stationsRadioBtns = menu.querySelectorAll('input[name="selectStation"]');
      const routeInfoText = menu.querySelector(".cargoStationMenu__routeInfo-span");
      const tile = document.getElementById(menu.dataset.parentTileId);
      stationsRadioBtns.forEach((btn) => {
        if (btn.checked) {
          tile.dataset.routeTo = parseInt(btn.id.split(" ").pop(), 10);
          routeInfoText.textContent = `Cargo Station ${tile.dataset.stationId} 
              — Cargo Station ${tile.dataset.routeTo} — ${tile.dataset.cargoStationItem}`;
          targetStationChangeText(btn.id, tile);
        }
      });
    }

    function targetStationChangeText(id, tile) {
      const targetStationId = parseInt(id.split(" ").pop(), 10);
      const targetStation = document.querySelector(`[data-station-id="${targetStationId}"]`);
      targetStation.dataset.routeFrom = `${tile.dataset.stationId}`;
      const menu = document.querySelector(`[data-cargo-station-id="${targetStationId}"]`);
      const routeInfoText = menu.querySelector(".cargoStationMenu__routeInfo-span");
      routeInfoText.textContent = `Cargo Station ${tile.dataset.stationId} 
            — Cargo Station ${tile.dataset.routeTo} — ${tile.dataset.cargoStationItem}`;
    }
  }
  selectImportMaterial(menu, { mainFactoryTile, stationTile }) {
    const buildingName = mainFactoryTile.dataset.buildingType;
    const importSelect = menu.querySelector(".importSelect");
    let items = allItems.filter((item) => item.processingIn === buildingName);
    if (mainFactoryTile.dataset.buildingType == "tradingTerminal") {
      items = allItems;
    }
    items.forEach((item) => {
      const itemBlock = document.createElement("div");
      itemBlock.classList.add("importItem");
      itemBlock.innerHTML = `
        <button class="importItem-button">
        <img src="${item.src}"/>
        </button>
        <span>${item.name}</span>
         `;
      importSelect.appendChild(itemBlock);
      itemBlock.querySelector(".importItem-button").onclick = () => {
        mainFactoryTile.dataset.itemType = item.name;
        stationTile.dataset.cargoStationItem = item.name;
        importSelect.classList.add("hidden");
        this.updateRoutesList();
      };
    });
  }
  selectExportMaterial(menu, { stationTile }) {
    const exportSelect = menu.querySelector(".exportSelect");
    allItems.forEach((item) => {
      const itemBlock = document.createElement("div");
      itemBlock.classList.add("exportItem");
      itemBlock.innerHTML = `
        <button class="exportItem-button">
        <img src="${item.src}"/>
        </button>
        <span>${item.name}</span>`;
      exportSelect.appendChild(itemBlock);
      itemBlock.querySelector(".exportItem-button").onclick = () => {
        stationTile.dataset.cargoStationItem = item.name;
        exportSelect.classList.add("hidden");
        this.updateRoutesList();
      };
    });
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
    let closeBtn = menu.querySelector(".close-button");
    closeBtn.addEventListener("click", () => {
      menu.classList.add("hidden");
      resetGhost();
      switchUpgrades();
    });

    document.addEventListener("keydown", (event) => {
      if (event.code == "Escape") {
        switchUpgrades();
        resetGhost();
      }
    });
  }
  menuCreation() {
    setTimeout(() => {
      this.route = allRoutesList.find((routeObj) => routeObj.id == this.exportStation.dataset.routeId);
      const routeSpan = menu.querySelector(".truckMenu__routeName");
      routeSpan.style.backgroundColor = this.route.color;
    }, 200);

    const container = document.querySelector("#menu-container");
    let menu = document.createElement("div");
    menu.classList.add("truckMenu", "hidden");
    menu.id = `Truck${this.id}`;
    let menuContent = `
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
