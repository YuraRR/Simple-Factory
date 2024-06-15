class CargoStationMenu extends BuildingMenu {
  constructor(tile, id) {
    super(tile, id);
    this.tile = tile;
    this.tileData = tile.dataset;
    this.id = id;
    this.name = "cargoStation";
    this.menuOpened = false;
  }
  menuCreation(item) {
    const container = document.querySelector("#menu-container");
    const menu = document.createElement("div");
    const menuData = menu.dataset;

    menuData.menuId = this.id;
    menuData.menuType = this.name;
    menuData.parentTileId = this.tile.id;
    menu.classList.add("cargoStationMenu", "hidden");
    menu.id = `CargoStation${this.id}`;
    this.title = this.name.replace(/([A-Z])/g, " $1");
    this.defaultItem = item;
    menu.innerHTML = `
        <h2>${this.title} ${this.id} (${this.tileData.connectedTo})</h2>
        <div class="cargoStationMenu__item">
          <img class="itemImg" src="./img/resourcesIcons/noItem.webp" />
          <span class="itemAmount">0</span>
          <h3 class="itemName">Empty</h3>
        </div>
      <button class="close-button close-button-black"></button>`;

    menu.dataset.cargoStationId = this.id;
    this.tileData.stationId = this.id;
    menu.dataset.parentTileId = this.tile.id;
    menu.querySelectorAll("img").forEach((image) => {
      image.draggable = false;
    });
    container.appendChild(menu);
    // this.menuButtons(menu, item);
    // this.menuUpdate(menu, item);
    this.closeButton(menu);
    // this.createRouteBlock(menu);
    // this.updateRoutesList();

    dragElement(menu.id);
  }
  menuUpdate(menu, defaultItem) {
    setInterval(() => this.forceMenuUpdate(menu, defaultItem), 500);
    this.selectImportMaterial(menu, defaultItem);
    this.selectExportMaterial(menu, defaultItem);
  }
  forceMenuUpdate(menu, defaultItem) {
    const itemAmount = menu.querySelector(".itemAmount");
    const itemImg = menu.querySelector(".itemImg");
    const itemName = menu.querySelector(".itemName");
    const unlimitedDelivery = menu.querySelector("#unlimitedDelivery");
    const lockedImg = menu.querySelector(".lockedImg");
    const totalMoney = menu.querySelector(".cargoStationMenu__totalMoney");

    let item;
    const stationObj = defaultItem.stationObj;

    // const selectedExportItem = this.tileData.cargoStationItem;
    // if (this.tileData.cargoStationType == "Export" && this.tileData.connectedTo != "tradingTerminal") {
    //   item = stationObj.updateData(defaultItem.mainFactoryTile, "export", selectedExportItem);
    // } else if (this.tileData.cargoStationType == "Export" && this.tileData.connectedTo == "tradingTerminal") {
    //   item = stationObj.updateData(defaultItem.mainFactoryTile, "export", selectedExportItem);
    // } else {
    //   item = stationObj.updateData(defaultItem.mainFactoryTile, "import", selectedExportItem);
    // }
    // const currentPrice = this.tile.dataset.cargoStationType == "Export" ? item.sellPrice : item.buyPrice;
    // totalMoney.classList.remove("green", "red");
    // this.tile.dataset.cargoStationType == "Export"
    //   ? totalMoney.classList.add("green")
    //   : totalMoney.classList.add("red");
    // totalMoney.textContent = `$${currentPrice * this.deliveriesNum}`;

    // itemName.textContent = item.name || "Empty";
    // itemAmount.textContent = item.amount || 0;

    // itemImg.src = item.imgSrc || "./img/resourcesIcons/noItem.webp";
    // if (this.tileData.connectedTo != "tradingTerminal") {
    //   this.tileData.cargoStationItem = item.name;
    // } else {
    //   itemName.textContent == "Empty" ? (itemName.textContent = "Not chosen") : "";
    // }

    // if (lockedImg && lockedFeatures.find((task) => task.name === "Unlimited Delivery").state) {
    //   unlimitedDelivery.disabled = false;
    //   lockedImg.remove();
    // }
    //Route visual
    // if (menu.style.display != "none" && !this.tile.classList.contains("pointRoute")) {
    //   const routeObj = allRoutesList.find((routeObj) => routeObj.id == this.tile.dataset.routeId);
    //   console.log(routeObj);
    //   if (routeObj && this.menuOpened) {
    //     // console.log("penis");
    //     // stationObj.drawRoute(routeObj);
    //   }
    // }
  }
  menuButtons(menu, defaultItem) {
    const newBuilding = defaultItem.stationObj;

    const trucksCurrentText = menu.querySelector(".trucks__current");
    const stationExportBtn = menu.querySelector(".stationExport");
    const stationImportBtn = menu.querySelector(".stationImport");
    const deliveriesAmount = menu.querySelector(".cargoStationMenu__quantity");
    const unlimitedDelivery = menu.querySelector("#unlimitedDelivery");
    const limitedDelivery = menu.querySelector("#limitedDelivery");

    this.deliveriesNum = 8;
    let trucksOnRoute = 0;

    unlimitedDelivery.onclick = () => {
      deliveriesAmount.textContent = "Ꝏ";
      this.deliveriesNum = 9999;
    };
    limitedDelivery.onclick = () => {
      deliveriesAmount.textContent = 8;
      this.deliveriesNum = 8;
    };
    menu.querySelector(".plusBtn").onclick = () => {
      this.deliveriesNum == 9999 ? (this.deliveriesNum = 8) : "";
      this.deliveriesNum < 128 && (deliveriesAmount.textContent = this.deliveriesNum += 8);
      limitedDelivery.checked = true;
    };
    menu.querySelector(".minusBtn").onclick = () => {
      this.deliveriesNum == 9999 ? (this.deliveriesNum = 8) : "";
      deliveriesAmount.textContent = this.deliveriesNum > 8 ? (this.deliveriesNum -= 8) : 8;
      limitedDelivery.checked = true;
    };

    menu.querySelector(".addTruck").onclick = () => {
      const radioButtons = menu.querySelectorAll('input[name="selectStation"]');
      const isStationSelected = [...radioButtons].some((button) => button.checked);
      //ERROR Second station not selected!
      if (!isStationSelected) return notyf.error("Second station not selected!");

      if (trucksAvailable > 0) {
        this.selectStation(menu);
        const truckObj = new Truck(this.tile);
        const startMethods = startBuildingMethods.bind(truckObj, this.tile);
        startMethods();
        const route = truckObj.calculateRoute([this.tile, []]);
        //ERROR Stations are not connected by roads!
        if (!route) return notyf.error("Stations are not connected by roads!");

        const isRouteValid = truckObj.createRouteDirections(route, this.deliveriesNum / 8);
        console.log(isRouteValid);
        const firstStation = route[0];
        const lastStation = route[route.length - 1];
        if (isRouteValid) {
          trucksOnRoute++;
          updateTrucksAmountInfo(trucksCurrentText);
          this.updateRoutesList();

          updateTrucksInGarage("", "", "minus");
          return notyf.success("Route created successfully!");
        } else {
          const unsuitableRes =
            firstStation.dataset.cargoStationType == "Export"
              ? firstStation.dataset.cargoStationItem
              : lastStation.dataset.cargoStationItem;

          notyf.error(`The target building does not accept resource ${unsuitableRes}`);

          const firstStationText = menu.querySelector(".cargoStationMenu__routeInfo-span");
          console.log("da");
          firstStation.dataset.cargoStationItem = "Empty";
          firstStation.dataset.routeTo = "";
          firstStation.dataset.routeFrom = "";
          firstStationText.textContent = `Route not selected`;

          lastStation.dataset.routeTo = "";
          lastStation.dataset.routeFrom = "";
          lastStation.dataset.cargoStationItem = "Empty";
          const secondStationMenu = document.querySelector(
            `[data-menu-id="${lastStation.dataset.stationId}"][data-menu-type="cargoStation"]`
          );
          const secondStationText = secondStationMenu.querySelector(".cargoStationMenu__routeInfo-span");
          secondStationText.textContent = `Route not selected`;
        }
      } else {
        return notyf.error("No trucks available!");
      }
    };
    menu.querySelector(".deleteTruck").onclick = () => {
      if (trucksOnRoute) {
        trucksAvailable++, trucksOnRoute--;

        const route = allRoutesList.find((route) => route.id == defaultItem.stationTile.dataset.routeId);
        const truckToRemove = route.find((truck) => truck.id == 1);
        console.log(allRoutesList);
        trucksCurrentText.textContent = `Trucks on current route —  ${trucksOnRoute}/${maxTrucksOnRoute}`;
      }
    };
    stationExportBtn.classList.add("buttonActive");
    if (defaultItem.mainFactoryTile.dataset.buildingCategory != "Out") {
      const exportSelect = menu.querySelector(".exportSelect");
      const importSelect = menu.querySelector(".importSelect");

      stationExportBtn.onclick = (event) => {
        event.stopPropagation();
        this.tileData.cargoStationType = "Export";
        stationExportBtn.classList.add("buttonActive");
        stationImportBtn.classList.remove("buttonActive");

        exportSelect.classList.remove("hidden");
        importSelect.classList.add("hidden");

        document.addEventListener("click", (e) => handleClickOutside(e, exportSelect));
      };

      stationImportBtn.onclick = (event) => {
        event.stopPropagation();
        this.tileData.cargoStationType = "Import";
        stationImportBtn.classList.add("buttonActive");
        stationExportBtn.classList.remove("buttonActive");

        exportSelect.classList.add("hidden");
        importSelect.classList.remove("hidden");

        document.addEventListener("click", (e) => handleClickOutside(e, importSelect));
      };
    }
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
        let imageSrc;
        if (stationObj.provideItemName && stationObj.provideItemName != "Empty") {
          const itemInfo = findItemObjInList(stationObj.provideItemName);
          itemInfo ? (imageSrc = itemInfo.imageSrc) : (imageSrc = "/img/resourcesIcons/noItem.webp");
        } else if (data.connectedTo == "tradingTerminal") {
          stationObj.provideItemName = this.tileData.cargoStationItem;
          const itemInfo = findItemObjInList(stationObj.provideItemName);
          imageSrc = itemInfo.imageSrc;
        }

        routeElem.innerHTML = `
          <label for="Cargo Station ${stationObj.id}">
            <span>
              ${formatString(data.connectedTo)} ${stationObj.id} —
              <img src="/img/buttonIcons/${stationObj.type}Small.png" title="${stationObj.type}"/>
              —
            </span>
            <span class="itemNameImg"> ${stationObj.provideItemName} <img src="${imageSrc}" /> </span>
          </label>
        <input type="radio" id="Cargo Station ${stationObj.id}" name="selectStation" />`;

        if (stationObj.provideItemName == targetStation.dataset.cargoStationItem) {
          routeElem.classList.add("highlightElem");
        }
        routeContainer.appendChild(routeElem);
      }
    });
  }
  updateRoutesList() {
    const allStationsMenu = document.querySelectorAll(".cargoStationMenu");
    deltaTimeout(() => {
      allStationsMenu.forEach((menu) => this.createRouteBlock(menu));
    }, 1000);
  }
  selectStation(menu) {
    currentStationChangeText(menu);

    function currentStationChangeText(menu) {
      const stationsRadioBtns = menu.querySelectorAll('input[name="selectStation"]');
      const routeInfoText = menu.querySelector(".cargoStationMenu__routeInfo-span");
      const tile = document.getElementById(menu.dataset.parentTileId);

      stationsRadioBtns.forEach((btn) => {
        if (btn.checked) {
          tile.dataset.routeTo = parseInt(btn.id.split(" ").pop(), 10);
          const nextStation = document.querySelector(`[data-station-id="${tile.dataset.routeTo}"]`);
          const nextStationName = formatString(nextStation.dataset.connectedTo);
          const currStationName = formatString(tile.dataset.connectedTo);
          routeInfoText.textContent = `${nextStationName} ${tile.dataset.stationId}
                — ${currStationName} ${nextStation.dataset.stationId}— ${tile.dataset.cargoStationItem}`;
          targetStationChangeText(btn.id, tile);
        }
      });
    }

    function targetStationChangeText(id, tile) {
      const targetStationId = parseInt(id.split(" ").pop(), 10);
      const targetStation = document.querySelector(`[data-station-id="${targetStationId}"]`);
      targetStation.dataset.routeFrom = tile.dataset.stationId;

      const menu = document.querySelector(`[data-cargo-station-id="${targetStationId}"]`);
      const routeInfoText = menu.querySelector(".cargoStationMenu__routeInfo-span");
      routeInfoText.textContent = `Cargo Station ${tile.dataset.stationId} 
              — Cargo Station ${tile.dataset.routeTo} — ${tile.dataset.cargoStationItem}`;
    }
  }
  selectImportMaterial(menu, { mainFactoryTile, stationTile }) {
    const buildingName = mainFactoryTile.dataset.buildingType;
    const importSelect = menu.querySelector(".importSelect");

    let items = allItems.filter((item) => {
      const processingInArray = Array.isArray(item.processingIn) ? item.processingIn : [item.processingIn];
      return processingInArray.includes(buildingName);
    });

    if (
      mainFactoryTile.dataset.buildingType == "tradingTerminal" ||
      mainFactoryTile.dataset.buildingCategory == "storage"
    ) {
      items = allItems;
    }
    if (mainFactoryTile.dataset.buildingCategory == "storage" && mainFactoryTile.dataset.itemTypeOutput1) {
      items = allItems.filter((item) => item.name == mainFactoryTile.dataset.itemTypeOutput1);
    }
    items = items.filter((item) => item.isAltRecipe != true);
    items.forEach((item) => {
      if (item.isMovable != false) {
        const itemBlock = document.createElement("div");
        itemBlock.classList.add("importItem");

        itemBlock.innerHTML = `
          <button class="importItem-button">
          <img src="${item.imageSrc}"/>
          </button>
          <span>${item.name}</span>
           `;
        importSelect.appendChild(itemBlock);
        itemBlock.querySelector(".importItem-button").onclick = () => {
          if (parseInt(menu.querySelector(".itemAmount").textContent) > 0) {
            return notyf.open({ type: "warning", message: "The cargo station have another resource!" });
          }
          stationTile.dataset.cargoStationItem = item.name;
          importSelect.classList.add("hidden");
          this.updateRoutesList();
          if (mainFactoryTile.dataset.buildingCategory == "storage") {
            mainFactoryTile.dataset.itemTypeOutput1 = item.name;
          }
        };
      }
    });
  }
  selectExportMaterial(menu, { mainFactoryTile, stationTile }) {
    const buildingName = mainFactoryTile.dataset.buildingType;
    const exportSelect = menu.querySelector(".exportSelect");
    let items = allItems.filter(
      (item) => item.producedIn == buildingName || item.producedIn.includes(buildingName)
    );
    if (mainFactoryTile.dataset.buildingType == "tradingTerminal") items = allItems;
    if (mainFactoryTile.dataset.buildingCategory == "storage")
      items = allItems.filter(
        (item) => item.name == mainFactoryTile.dataset.itemTypeOutput1 && item.isAltRecipe != true
      );
    items = items.filter((item) => item.isAltRecipe != true);
    items.forEach((item) => {
      if (item.isMovable != false) {
        const itemBlock = document.createElement("div");
        itemBlock.classList.add("exportItem");

        itemBlock.innerHTML = `
            <button class="exportItem-button">
              <img src="${item.imageSrc}"/>
            </button>
            <span>${item.name}</span>`;
        exportSelect.appendChild(itemBlock);

        itemBlock.querySelector(".exportItem-button").onclick = () => {
          stationTile.dataset.cargoStationItem = item.name;
          exportSelect.classList.add("hidden");
          this.updateRoutesList();
        };
      }
    });
  }
}
