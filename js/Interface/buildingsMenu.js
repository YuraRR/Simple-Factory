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
      hideRoutes();
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
            <img src="img/resourcesIcons/noItem.svg" class = "materialImage"/>
            <span class = "materialAmount">${this.tile.dataset.itemAmount}</span>
          </div>
          <div class="arrowBlock">
            <img src="img/buttonIcons/arrow.png" />
          </div>
          <div class="productBlock">
            <img src="img/resourcesIcons/noItem.svg" class = "productImage"/>
            <span class = "productAmount">0</span>
          </div>
        </div>
  
        <div class="progressBarBlock">
          <div class="progressBar"></div>
          <span></span>
        </div>
        <div class="fuelBlock">
          <div class="fuel">
            <img src="img/resourcesIcons/coalOre.png" alt="" />
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
          materialImage.src = "/img/resourcesIcons/ironOre-icon.svg";
          productImage.src = "/img/resourcesIcons/ironIngot.svg";
          break;
        case "copperOre":
          materialImage.src = "/img/resourcesIcons/copperOre-icon.svg";
          productImage.src = "/img/resourcesIcons/copperIngot.svg";
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
            <img src="img/resourcesIcons/noItem.svg" class = "materialImage"/>
            <span class = "materialAmount">${this.tile.dataset.itemAmount}</span>
          </div>
          <div class="arrowBlock">
            <img src="img/buttonIcons/arrow.png" />
          </div>
          <div class="productBlock">
            <img src="img/resourcesIcons/noItem.svg" class = "productImage"/>
            <span class = "productAmount">0</span>
          </div>
        </div>
  
        <div class="progressBarBlock">
          <div class="progressBar"></div>
          <span></span>
        </div>
        <div class="fuelBlock">
          <div class="fuel">
            <img src="img/resourcesIcons/coalOre.png" alt="" />
            <span></span>
          </div>
          <div class="fuelProgressBar"></div>
        </div>
      </div>
      <button class="close-button"></button>
      <div class="upgradesBlock"></div>`;
    menu.innerHTML = menuContent;
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
          materialImage.src = "/img/resourcesIcons/ironOre-icon.svg";
          productImage.src = "/img/resourcesIcons/ironIngot.svg";
          break;
        case "copperOre":
          materialImage.src = "/img/resourcesIcons/copperOre-icon.svg";
          productImage.src = "/img/resourcesIcons/copperIngot.svg";
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
            <img src="img/resourcesIcons/noItem.svg" class = "materialImage"/>
            <span class = "materialAmount">${this.tile.dataset.itemAmount}</span>
          </div>
          <div class="arrowBlock">
            <img src="img/buttonIcons/arrow.png" />
          </div>
          <div class="productBlock">
            <img src="img/resourcesIcons/noItem.svg" class = "productImage"/>
            <span class = "productAmount">0</span>
          </div>
        </div>
  
        <div class="progressBarBlock">
          <div class="progressBar"></div>
          <span></span>
        </div>
        <div class="fuelBlock">
          <div class="fuel">
            <img src="img/resourcesIcons/coalOre.png" alt="" />
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
          materialImage.src = "/img/resourcesIcons/ironOre-icon.svg";
          productImage.src = "/img/resourcesIcons/ironIngot.svg";
          break;
        case "copperOre":
          materialImage.src = "/img/resourcesIcons/copperOre-icon.svg";
          productImage.src = "/img/resourcesIcons/copperIngot.svg";
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
          <img src="img/resourcesIcons/noItem.svg" />
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
          itemImage.src = "/img/resourcesIcons/ironOre-icon.svg";
          break;
        case "copperOre":
          itemImage.src = "/img/resourcesIcons/copperOre-icon.svg";
          break;
        case "ironIngot":
          itemImage.src = "/img/resourcesIcons/ironIngot.svg";
          break;
        case "copperIngot":
          itemImage.src = "/img/resourcesIcons/copperIngot.svg";
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
          <img src="img/resourcesIcons/noItem.svg" />
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
          itemImage.src = "/img/resourcesIcons/ironOre-icon.svg";
          break;
        case "copperOre":
          itemImage.src = "/img/resourcesIcons/copperOre-icon.svg";
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
    this.tileData = tile.dataset;
    this.id = id;
    this.name = "Cargo Station";
  }
  menuCreation(item) {
    const container = document.querySelector("#menu-container");
    let menu = document.createElement("div");
    menu.classList.add("cargoStationMenu");
    menu.id = `CargoStation${this.id}`;
    let pointA;
    let pointB;
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
        <div>
          <span class="trucks__current">Trucks on current route —  0/4</span>
          <button class="addTruck">Add truck</button>
        </div>
      </div>
      <div class="cargoStationMenu__routeInfo">
        <button class="close-button"></button>
        <span class="cargoStationMenu__routeInfo-span">Route not selected</span>
     </div>
     <div class="cargoStationMenu__item">
        <img class="itemImg" src="${item.imgSrc}" />
        <span class="itemAmount">${item.amount}</span>
        <h3 class="itemName">${item.name}</h3>
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
      if (this.tileData.cargoStationType == "Export") {
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
      console.log(item);
      itemName.textContent = item.name;
      itemAmount.textContent = item.amount;
      itemImg.src = item.imgSrc;
      if (this.tileData.connectedTo != "tradingTerminal") {
        this.tileData.cargoStationItem = item.name;
      }

      this.updateTrucksAmountInfo(trucksAvailableText);

      if (menu.style.display != "none" && !this.tile.classList.contains("pointRoute")) {
        const stationBId = this.tileData.routeTo ?? this.tileData.routeFrom;
        const stationB = document.querySelector(`[data-station-id="${stationBId}"]`);
        const currentRoute = allRoutesList.find(
          (routeObj) =>
            (routeObj.stationA == this.tile && routeObj.stationB == stationB) ||
            (routeObj.stationA == stationB && routeObj.stationB == this.tile)
        );
        currentRoute &&
          stationObj.drawRoute(currentRoute.routePointsList, currentRoute.directionsList);
      }
    }, 1000);
    this.selectImportMaterial(menu, defaultItem);
    this.selectExportMaterial(menu, defaultItem);
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
        this.selectStation(menu);
        let route = newBuilding.startMoving([this.tile, []]);
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
    const targetStation = document.querySelector(
      `[data-station-id="${menu.dataset.cargoStationId}"]`
    );
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
  selectExportMaterial(menu, { stationTile }) {
    const exportSelect = menu.querySelector(".exportSelect");
    allItems.forEach((item) => {
      const itemBlock = document.createElement("div");
      itemBlock.classList.add("exportItem");
      itemBlock.innerHTML = `
      <button class="exportItem-button">
      <img src="${item.src}"/>
      </button>
      <span>${item.name}:</span>
       `;
      exportSelect.appendChild(itemBlock);
      itemBlock.querySelector(".exportItem-button").onclick = () => {
        stationTile.dataset.cargoStationItem = item.name;
        exportSelect.classList.add("hidden");
        this.updateRoutesList();
      };
    });
  }
}
