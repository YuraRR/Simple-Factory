class BuildingMenu {
  constructor(tile, id) {
    this.tile = tile;
    this.id = id;
  }
  closeButton(menu) {
    let closeBtn = menu.querySelector(".close-button");
    closeBtn.addEventListener("click", () => {
      menu.style.display = "none";
      resetGhost();
      this.tile.children[0].classList.remove("hidden");
      this.tile.children[1].style.pointerEvents = "all";
      menuOpened = false;
      switchUpgrades();
    });

    document.addEventListener("keydown", (event) => {
      if (event.code == "Escape") {
        if (menu.style.display == "flex") {
          this.tile.children[0].classList.remove("hidden");
          this.tile.querySelector(".clickArea").style.pointerEvents = "all";
          switchUpgrades();
        }
        menu.style.display = "none";
        resetGhost();
        menuOpened = false;
      }
    });
  }
  upgradeMenu(menu, upgradesList) {
    let upgradesBlock = menu.querySelector(".upgradesBlock");

    upgradesList.forEach((upgrade) => {
      let upgradeItem = document.createElement("div");
      upgradeItem.classList.add("upgrade-menu__block");
      upgradeItem.innerHTML = `
          <button class="upgrade-menu__btn" id="${upgrade.name}">
            <img src="${upgrade.img}" draggable="false" />
          </button>
          <span>${upgrade.name}</span>
        `;
      upgradesBlock.appendChild(upgradeItem);
      upgradeItem.querySelector("button").onclick = () => {
        switch (upgrade.name) {
          case "Crusher Machine":
            createEventListener(crusherCreating);
            break;
          case "Washing Machine":
            createEventListener(washerCreating);
            break;
          case "Blast Furnace":
            createEventListener(smelterCreating);
            break;
          case "Foundry (plates)":
            createEventListener(foundryCreating);
            foundryType = "Plates";
            break;
          case "Foundry (ingots)":
            createEventListener(foundryCreating);
            foundryType = "Ingots";
            break;
          case "Foundry (rods)":
            createEventListener(foundryCreating);
            foundryType = "Rods";
            break;
          case "Slag Recycler":
            createEventListener(storageCreating);
            break;
        }
      };
    });
  }
}
class OreProccesingMenu extends BuildingMenu {
  constructor(tile, id) {
    super(tile, id);
    this.tile = tile;
    this.id = id;
    this.name = "OreProcessing";
  }
  menuCreation() {
    const container = document.querySelector("#menu-container");
    let menu = document.createElement("div");
    menu.classList.add("oreProcessingMenu");
    let menuContent = `
     
    <div class="recipesBlock">
    <h2>${this.name} ${this.id} </h2>
      </div>
      <div class="proccessingBlock">
        <div class="itemsBlock">
          <div class="materialBlock">
            <img src="img/buttonIcons/noItem.svg" class = "materialImage"/>
            <span class = "materialAmount">${this.tile.dataset.itemAmount}</span>
          </div>
          <div class="arrowBlock">
            <img src="img/buttonIcons/arrow.png" />
          </div>
          <div class="productBlock">
            <img src="img/buttonIcons/noItem.svg" class = "productImage"/>
            <span class = "productAmount">0</span>
          </div>
        </div>
  
        <div class="progressBarBlock">
          <div class="progressBar"></div>
          <span></span>
        </div>
        <div class="fuelBlock">
          <div class="fuel">
            <img src="img/buttonIcons/coalOre.png" alt="" />
            <span></span>
          </div>
          <div class="fuelProgressBar"></div>
        </div>
      </div>
      <button class="close-button"></button>
      <div class="upgradesBlock"></div>
      `;
    menu.innerHTML = menuContent;
    menu.dataset.oreProcessingId = this.id;
    menu.dataset.parentTileId = this.tile.id;
    container.appendChild(menu);
    this.menuUpdate();
    this.closeButton(menu);
    this.upgradeMenu(menu, oreProcessingUpgrades);
  }
  menuUpdate() {
    let menu = document.querySelector(`[data-ore-processing-id="${this.id}"]`);
    let materialAmount = menu.children[1].querySelector(".materialAmount");
    let materialImage = menu.children[1].querySelector(".materialImage");

    let productAmount = menu.children[1].querySelector(".productAmount");
    let productImage = menu.children[1].querySelector(".productImage");
    setInterval(() => {
      switch (this.tile.dataset.itemType) {
        case "ironOre":
          materialImage.src = "/img/buttonIcons/ironOre-icon.svg";
          productImage.src = "/img/buttonIcons/ironIngot.svg";
          break;
        case "copperOre":
          materialImage.src = "/img/buttonIcons/copperOre-icon.svg";
          productImage.src = "/img/buttonIcons/copperIngot.svg";
          break;
      }
      materialAmount.textContent = this.tile.dataset.itemAmount;
      productAmount.textContent = this.tile.dataset.itemAmountOutput;
    }, 100);
    this.allProcessibleOreItems(menu);
  }
  allProcessibleOreItems(menu) {
    const recipesBlock = menu.querySelector(".recipesBlock");
    allProcessingOreRecipes.forEach((recipe) => {
      let recipeBlock = document.createElement("div");
      recipeBlock.classList.add("oreProcessingRecipe");

      let materialItem = `
        <div class="materialBlock">
        <span class="recipeName">${recipe.materialName}</span>
          <img src=${recipe.materialImage} />
          <span>${recipe.materialAmount}</span>
        </div>
        <div class="arrowBlock">
          <img src="img/buttonIcons/arrow.png" />
        </div>
        <div class="productBlock">
        <span class="recipeName">${recipe.productName}</span>
        <img src=${recipe.productImage} />
        <span>${recipe.productAmount}</span>
      </div>`;
      recipeBlock.innerHTML = materialItem;
      recipesBlock.appendChild(recipeBlock);
    });
  }
}
class SmelterMenu extends BuildingMenu {
  constructor(tile, id) {
    super(tile, id);
    this.tile = tile;
    this.id = id;
    this.name = "Smelter";
  }
  menuCreation() {
    const container = document.querySelector("#menu-container");
    let menu = document.createElement("div");
    menu.classList.add("smelterMenu");
    let menuContent = `
     
    <div class="recipesBlock">
    <h2>${this.name} ${this.id} </h2>
      </div>
      <div class="proccessingBlock">
        <div class="itemsBlock">
          <div class="materialBlock">
            <img src="img/buttonIcons/noItem.svg" class = "materialImage"/>
            <span class = "materialAmount">${this.tile.dataset.itemAmount}</span>
          </div>
          <div class="arrowBlock">
            <img src="img/buttonIcons/arrow.png" />
          </div>
          <div class="productBlock">
            <img src="img/buttonIcons/noItem.svg" class = "productImage"/>
            <span class = "productAmount">0</span>
          </div>
        </div>
  
        <div class="progressBarBlock">
          <div class="progressBar"></div>
          <span></span>
        </div>
        <div class="fuelBlock">
          <div class="fuel">
            <img src="img/buttonIcons/coalOre.png" alt="" />
            <span></span>
          </div>
          <div class="fuelProgressBar"></div>
        </div>
      </div>
      <button class="close-button"></button>
      <div class="upgradesBlock"></div>`;
    menu.innerHTML = menuContent;
    console.log(this.id);
    menu.dataset.smelterId = this.id;
    menu.dataset.parentTileId = this.tile.id;
    container.appendChild(menu);

    this.menuUpdate();
    this.closeButton(menu);
    this.upgradeMenu(menu, smelterUpgrades);
  }
  menuUpdate() {
    let menu = document.querySelector(`[data-smelter-id="${this.id}"]`);
    let materialAmount = menu.children[1].querySelector(".materialAmount");
    let materialImage = menu.children[1].querySelector(".materialImage");

    let productAmount = menu.children[1].querySelector(".productAmount");
    let productImage = menu.children[1].querySelector(".productImage");
    setInterval(() => {
      switch (this.tile.dataset.itemType) {
        case "ironOre":
          materialImage.src = "/img/buttonIcons/ironOre-icon.svg";
          productImage.src = "/img/buttonIcons/ironIngot.svg";
          break;
        case "copperOre":
          materialImage.src = "/img/buttonIcons/copperOre-icon.svg";
          productImage.src = "/img/buttonIcons/copperIngot.svg";
          break;
      }
      materialAmount.textContent = this.tile.dataset.itemAmount;
      productAmount.textContent = this.tile.dataset.itemAmountOutput;
    }, 100);
    this.allSmeltableItems(menu);
  }
  allSmeltableItems(menu) {
    const recipesBlock = menu.querySelector(".recipesBlock");
    allSmeltingRecipes.forEach((recipe) => {
      let recipeBlock = document.createElement("div");
      recipeBlock.classList.add("smeltingRecipe");

      let materialItem = `
        <div class="materialBlock">
        <span class="recipeName">${recipe.materialName}</span>
          <img src=${recipe.materialImage} />
          <span>${recipe.materialAmount}</span>
        </div>
        <div class="arrowBlock">
          <img src="img/buttonIcons/arrow.png" />
        </div>
        <div class="productBlock">
        <span class="recipeName">${recipe.productName}</span>
        <img src=${recipe.productImage} />
        <span>${recipe.productAmount}</span>
      </div>`;
      recipeBlock.innerHTML = materialItem;
      recipesBlock.appendChild(recipeBlock);
    });
  }
}
class AssemblerMenu extends BuildingMenu {
  constructor(tile, id) {
    super(tile, id);
    this.tile = tile;
    this.id = id;
    this.name = "Assembly Line";
  }
  menuCreation() {
    const container = document.querySelector("#menu-container");
    let menu = document.createElement("div");
    menu.classList.add("assemblerMenu");
    if (!menu.dataset.assemblerId) {
      menu.dataset.assemblerId = this.id;
      menu.dataset.parentTileId = this.tile.id;
    } else {
      this.id = menu.dataset.assemblerId;
    }

    let menuContent = `
     
    <div class="recipesBlock">
    <h2>${this.name} ${this.id} </h2>
      </div>
      <div class="proccessingBlock">
        <div class="itemsBlock">
          <div class="materialBlock">
            <img src="img/buttonIcons/noItem.svg" class = "materialImage"/>
            <span class = "materialAmount">${this.tile.dataset.itemAmount}</span>
          </div>
          <div class="arrowBlock">
            <img src="img/buttonIcons/arrow.png" />
          </div>
          <div class="productBlock">
            <img src="img/buttonIcons/noItem.svg" class = "productImage"/>
            <span class = "productAmount">0</span>
          </div>
        </div>
  
        <div class="progressBarBlock">
          <div class="progressBar"></div>
          <span></span>
        </div>
        <div class="fuelBlock">
          <div class="fuel">
            <img src="img/buttonIcons/coalOre.png" alt="" />
            <span></span>
          </div>
          <div class="fuelProgressBar"></div>
        </div>
      </div>
      <button class="close-button"></button>
      <div class="upgradesBlock"></div>
      `;
    menu.innerHTML = menuContent;
    container.appendChild(menu);
    this.menuUpdate();
    this.closeButton(menu);
    // this.upgradeMenu(menu, oreProcessingUpgrades);
  }
  menuUpdate() {
    let menu = document.querySelector(`[data-assembler-id="${this.id}"]`);
    let materialAmount = menu.children[1].querySelector(".materialAmount");
    let materialImage = menu.children[1].querySelector(".materialImage");

    let productAmount = menu.children[1].querySelector(".productAmount");
    let productImage = menu.children[1].querySelector(".productImage");
    setInterval(() => {
      switch (this.tile.dataset.itemType) {
        case "ironOre":
          materialImage.src = "/img/buttonIcons/ironOre-icon.svg";
          productImage.src = "/img/buttonIcons/ironIngot.svg";
          break;
        case "copperOre":
          materialImage.src = "/img/buttonIcons/copperOre-icon.svg";
          productImage.src = "/img/buttonIcons/copperIngot.svg";
          break;
      }
      materialAmount.textContent = this.tile.dataset.itemAmount;
      productAmount.textContent = this.tile.dataset.itemAmountOutput;
    }, 100);
    this.allAssemblyItems(menu);
  }
  allAssemblyItems(menu) {
    const recipesBlock = menu.querySelector(".recipesBlock");
    allAssemblyRecipes.forEach((recipe) => {
      let recipeBlock = document.createElement("div");
      recipeBlock.classList.add("assemblyRecipe");

      let materialItem = `
        <div class="materialBlock">
        <span class="recipeName">${recipe.materialName}</span>
          <img src=${recipe.materialImage} />
          <span>${recipe.materialAmount}</span>
        </div>
        <div class="arrowBlock">
          <img src="img/buttonIcons/arrow.png" />
        </div>
        <div class="productBlock">
        <span class="recipeName">${recipe.productName}</span>
        <img src=${recipe.productImage} />
        <span>${recipe.productAmount}</span>
      </div>`;
      recipeBlock.innerHTML = materialItem;
      recipesBlock.appendChild(recipeBlock);
    });
  }
}
class StorageMenu extends BuildingMenu {
  constructor(tile, id) {
    super(tile, id);
    this.tile = tile;
    this.id = id;
    this.name = "Storage";
  }
  menuCreation() {
    const container = document.querySelector("#menu-container");
    let menu = document.createElement("div");
    menu.classList.add("storageMenu");
    let menuContent = `
      <div class="storedItemsBlock">
        <h2>${this.name} ${this.id}</h2>
      </div>
      <div class="itemBlock">
        <div class="itemImage">
          <img src="img/buttonIcons/noItem.svg" />
        </div>
        <span class="itemAmount">0</span>
      </div>
      <div class="statisticsBlock">
        <span class="increase">+10</span>
        <span class="decrease">-10</span>
      </div>
      <button class="close-button"></button>`;
    menu.innerHTML = menuContent;
    menu.dataset.storageId = this.id;
    menu.dataset.parentTileId = this.tile.id;
    container.appendChild(menu);
    this.allStorableItems(menu);
    this.menuUpdate();
    this.closeButton(menu);
  }
  menuUpdate() {
    let menu = document.querySelector(`[data-storage-id="${this.id}"]`);
    let itemAmount = menu.children[1].querySelector(".itemAmount");
    let itemImage = menu.children[1].querySelector(".itemImage").children[0];

    setInterval(() => {
      switch (this.tile.dataset.itemType) {
        case "ironOre":
          itemImage.src = "/img/buttonIcons/ironOre-icon.svg";
          break;
        case "copperOre":
          itemImage.src = "/img/buttonIcons/copperOre-icon.svg";
          break;
        case "ironIngot":
          itemImage.src = "/img/buttonIcons/ironIngot.svg";
          break;
        case "copperIngot":
          itemImage.src = "/img/buttonIcons/copperIngot.svg";
          break;
      }
      itemAmount.textContent = this.tile.dataset.itemAmount;
    }, 1000);
  }
  allStorableItems(menu) {
    const storedItemsBlock = menu.querySelector(".storedItemsBlock");
    allItems.forEach((item) => {
      let storedItemBlock = document.createElement("div");
      storedItemBlock.classList.add("storedItem");

      let storedItem = `
          <div class="itemImage">
            <img src=${item.src} />
          </div>
          <div class="itemTitle">
            <p>${item.name}</p>
          </div>`;
      storedItemBlock.innerHTML = storedItem;
      storedItemsBlock.appendChild(storedItemBlock);
    });
  }
}
class MineshaftMenu extends BuildingMenu {
  constructor(tile, id) {
    super(tile, id);
    this.tile = tile;
    this.id = id;
    this.name = "Mineshaft";
  }
  menuCreation() {
    const container = document.querySelector("#menu-container");
    let menu = document.createElement("div");
    menu.classList.add("mineshaftMenu");
    let menuContent = `
      <div class="storedItemsBlock">
        <h2>${this.name} ${this.id}</h2>
      </div>
      <div class="itemBlock">
        <div class="itemImage">
          <img src="img/buttonIcons/noItem.svg" />
        </div>
        <span class="itemAmount">0</span>
      </div>
      <div class="statisticsBlock">
        <span class="increase">+10</span>
      </div>
      <button class="close-button"></button>`;
    menu.innerHTML = menuContent;
    menu.dataset.mineshaftId = this.id;
    menu.dataset.parentTileId = this.tile.id;
    container.appendChild(menu);
    this.menuUpdate();
    this.closeButton(menu);
  }
  menuUpdate() {
    let menu = document.querySelector(`[data-mineshaft-id="${this.id}"]`);
    let itemAmount = menu.children[1].querySelector(".itemAmount");
    let itemImage = menu.children[1].querySelector(".itemImage").children[0];

    setInterval(() => {
      switch (this.tile.dataset.itemType) {
        case "ironOre":
          itemImage.src = "/img/buttonIcons/ironOre-icon.svg";
          break;
        case "copperOre":
          itemImage.src = "/img/buttonIcons/copperOre-icon.svg";
          break;
      }
      itemAmount.textContent = `${this.tile.dataset.itemType} - ${this.tile.dataset.itemAmountOutput}`;
    }, 1000);
  }
}
class CargoStationMenu extends BuildingMenu {
  constructor(tile, id) {
    super(tile, id);
    this.tile = tile;
    this.id = id;
    this.name = "Cargo Station";
  }
  menuCreation(item) {
    const container = document.querySelector("#menu-container");
    let menu = document.createElement("div");
    menu.classList.add("cargoStationMenu");
    let pointA;
    let pointB;
    let menuContent = `
    <div class="ItemInfoBlock">
      <div class="ItemInfoBlock__prices">
        <h3>Prices</h3>
        <p class="sellPrice">Sell ${item.sellPrise}$ for 1 — ${item.sellPrise * item.amount}$ for ${
      item.amount
    }</p>
        <p class="buyPrice">Buy ${item.buyPrise}$ for 1 — ${item.buyPrise * item.amount} for ${
      item.amount
    }</p>
      </div>
      <div class="ItemInfoBlock__efficiency">
        <h3>Factory efficiency</h3>
        <p class="itemEff">${item.amountPerMin} ${item.name} — 60 
        <img src="img/buttonIcons/clock.png" alt="" /></p>
      </div>
      <div class="ItemInfoBlock__itemCapacity">
        <h3>Storage</h3>
        <p>Fuel capacity — 20</p>
        <p>Item capacity — 50</p>
      </div>
      <div class="ItemInfoBlock__item">
        <h3 class="itemName">${item.name}</h3>
        <img class="itemImg" src="${item.imgSrc}" />
        <span class="itemAmount">${item.amount}</span>
      </div>
    </div>
    <div class="routeInfo">
      <button class="close-button"></button>
      <span>CURRENT ROUTE: ${pointA} — ${pointB} — ${item.name}</span>
    </div>
    <div class="destinationBlock">
      <h3>Create route</h3>
      <div class="destinationBlock__routes">
        <span>No other stations </span>
      </div>
      <div class="destinationBlock__trucks">
        <div>
          <span class="trucks__available">Trucks available —  ${trucksAvailable}/${trucksTotal}</span>
          <button class="buyTruck">Buy truck</button>
        </div>
        <div>
          <span class="trucks__current">Trucks on current route —  0/4</span>
          <button class="addTruck">Add truck</button>
        </div>
      </div>
      <h3>Choose mode</h3>
      <div class="destinationBlock__state">
        <div class ="destinationBlock__button">
          <button class="stationExport">
            <img src="/img/buttonIcons/exportLogo.png" />
          </button>
          <span>Export</span>
        </div>
        <div class ="destinationBlock__button">
          <button class="stationImport">
            <img src="/img/buttonIcons/importLogo.png" />
          </button>
          <span>Import</span>
          <div class="importSelect hidden"> </div>
        </div>
      </div>
    </div>`;
    menu.innerHTML = menuContent;
    menu.dataset.cargoStationId = this.id;
    this.tile.dataset.stationId = this.id;
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
    this.selectStation(menu);
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
      if (this.tile.dataset.cargoStationType == "Export") {
        item = stationObj.updateData(defaultItem.mainFactoryTile, "export");
      } else {
        item = stationObj.updateData(defaultItem.mainFactoryTile, "import");
      }

      //prettier-ignore
      {
      itemPriceBuy.textContent = `Buy 1 for ${item.buyPrice}$  —  ${item.amount} for ${item.buyPrice * item.amount}$ `
      itemPriceSell.textContent = `Sell 1 for ${item.sellPrice}$  —  ${item.amount} for ${item.sellPrice * item.amount}$ `
      itemEfficency.innerHTML = `${item.amountPerMin} ${item.name} — 60 <img src="img/buttonIcons/clock.png" alt="" />`
      
    }
      itemName.textContent = item.name;
      itemAmount.textContent = item.amount;
      itemImg.src = item.imgSrc;
      this.updateTrucksAmountInfo(trucksAvailableText);
      this.tile.dataset.cargoStationItem = item.name;
    }, 1000);
    this.selectImportMaterial(menu, defaultItem);
  }
  menuButtons(menu, defaultItem) {
    //Route visual
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
        let route = newBuilding.startMoving([this.tile, []]);
        route.map((tile) => (tile.style.color = "red"));
        newBuilding.createRouteDirections(route);
        trucksAvailable--, trucksOnRoute++;
        this.updateTrucksAmountInfo(trucksAvailableText);
        trucksCurrentText.textContent = `Trucks on current route —  ${trucksOnRoute}/${maxTrucksOnRoute}`;
      }
    };
    if (defaultItem.mainFactoryTile.dataset.buildingType == "mineshaft") {
      stationExportBtn.classList.add("buttonActive");
    } else {
      stationExportBtn.onclick = () => {
        this.tile.dataset.cargoStationType = "Export";
        stationExportBtn.classList.add("buttonActive");
        stationImportBtn.classList.remove("buttonActive");
        this.updateRoutesList();
      };
      stationImportBtn.onclick = () => {
        this.tile.dataset.cargoStationType = "Import";
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
    const routeContainer = menu.querySelector(".destinationBlock__routes");
    const targetStation = document.querySelector(
      `[data-station-id="${menu.dataset.cargoStationId}"]`
    );
    routeContainer.innerHTML = "";
    allStations.forEach((cargoStation) => {
      console.log(cargoStation);
      const data = cargoStation.dataset;
      const stationObj = {
        id: data.stationId,
        type: data.cargoStationType,
        provideItemName: data.cargoStationItem || "Empty",
      };
      console.log(stationObj);
      if (stationObj.type != targetStation.dataset.cargoStationType) {
        const routeElem = document.createElement("div");
        routeElem.classList.add("destinationBlock__route");
        const htmlContent = `
            <span>
            Cargo Station ${stationObj.id} — <img src="/img/buttonIcons/${stationObj.type}Small.png" title="${stationObj.type}" /> —
            </span>
            <span class="itemNameImg">
            ${stationObj.provideItemName} <img src="/img/buttonIcons/${stationObj.provideItemName}.png"/>
            </span>
            <input type="radio" id="Cargo Station ${stationObj.id}" name="selectStation" />`;
        routeElem.innerHTML = htmlContent;
        routeContainer.appendChild(routeElem);
      }
    });

    this.selectStation(menu);
  }
  updateRoutesList() {
    const allStationsMenu = document.querySelectorAll(".cargoStationMenu");
    console.log(allStationsMenu);
    allStationsMenu.forEach((menu) => {
      this.createRouteBlock(menu);
      console.log(menu);
    });
  }
  selectStation(menu) {
    const stationsRadioBtns = menu.querySelectorAll('input[name="selectStation"]');
    const routeInfo = menu.querySelector(".routeInfo");
    const tile = document.getElementById(menu.dataset.parentTileId);
    stationsRadioBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        tile.dataset.routeTo = parseInt(btn.id.split(" ").pop(), 10);
        routeInfo.children[1].textContent = `CURRENT ROUTE: Cargo Station ${tile.dataset.stationId} 
        — Cargo Station ${tile.dataset.routeTo} — ${tile.dataset.cargoStationItem}`;
        const targetStationId = parseInt(btn.id.split(" ").pop(), 10);
        let targetStation = document.querySelector(`[data-station-id="${targetStationId}"]`);
        console.log(targetStation);
        targetStation.dataset.routeFrom = `${tile.dataset.stationId}`;
      });
    });
  }
  selectImportMaterial(menu, { mainFactoryTile, stationTile }) {
    const buildingName = mainFactoryTile.dataset.buildingType;
    const items = allItems.filter((item) => item.processingIn === buildingName);
    const importSelect = menu.querySelector(".importSelect");
    items.forEach((item) => {
      const itemBlock = document.createElement("div");
      itemBlock.classList.add("importItem");
      itemBlock.innerHTML = `
      <button class="importItem-button">
      <img src="${item.src}"/>
      </button>
      <span>${item.name}:</span>
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
}
