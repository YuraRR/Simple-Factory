const buildingCreating = {
  //////SOURCE//////

  //MINESHAFT
  mineshaft: (event) => {
    if (event.target.classList.contains("grid-cell")) {
      const tile = event.target;
      if (tile.dataset.type == "ore" && tile.dataset.buildingType != "mineshaft") {
        const newBuilding = new Mineshaft(tile);
        const startMethods = startBuildingMethods.bind(newBuilding, tile);
        startMethods();
      }
    }
  },
  //QUARRY
  quarry: (event) => {
    if (event.target.classList.contains("grid-cell") && !toBlockConstruction()) {
      const tile = event.target;
      if (
        tile.dataset.groundType == "sand" ||
        tile.dataset.groundType == "clay" ||
        tile.dataset.groundType == "limestone" ||
        tile.dataset.groundType == "stone"
      ) {
        const newBuilding = new Quarry(tile);
        const startMethods = startBuildingMethods.bind(newBuilding, tile);
        startMethods();
      }
    }
  },
  //WATER PUMP
  waterPump: (event) => {
    if (event.target.classList.contains("grid-cell") && !toBlockConstruction()) {
      const tile = event.target;

      const newBuilding = new WaterPump(tile);
      newBuilding.getId(tile.id);
      newBuilding.createBuilding();
      newBuilding.createBuildingImage();

      createPipe(tile);
      tile.dataset.fluidType = "water";
      buildingsMenuId["waterPumpMenuId"]++;
    }
  },
  //RUBBER PLANTATION
  rubberTreePlantation: (event) => {
    if (event.target.classList.contains("grid-cell") && !toBlockConstruction()) {
      const tile = event.target;
      if (tile.dataset.groundType == "forest" || tile.dataset.groundType == "flowers") {
        const newBuilding = new RubberTreePlantation(tile);
        const startMethods = startBuildingMethods.bind(newBuilding, tile);
        startMethods();
      }
    }
  },
  //LUMBERMILL
  lumbermill: (event) => {
    if (event.target.classList.contains("grid-cell")) {
      const tile = event.target;
      if (tile.dataset.type == "empty" && !toBlockConstruction()) {
        const newBuilding = new Lumbermill(tile);
        const startMethods = startBuildingMethods.bind(newBuilding, tile);
        startMethods();
      }
    }
  },
  //////PROCESSING//////

  //ORE PROCESSING PLANT
  oreProcessing: (event) => {
    if (event.target.classList.contains("grid-cell")) {
      const tile = event.target;
      if (tile.dataset.type == "empty" && !toBlockConstruction()) {
        const newBuilding = new OreProcessingPlant(tile);
        const startMethods = startBuildingMethods.bind(newBuilding, tile);
        startMethods();
        createPipe(tile);
      }
    }
  },
  //CRUSHING PLANT
  crushingPlant: (event) => {
    if (event.target.classList.contains("grid-cell")) {
      const tile = event.target;
      if (tile.dataset.type == "empty" && !toBlockConstruction()) {
        const newBuilding = new CrushingPlant(tile);
        const startMethods = startBuildingMethods.bind(newBuilding, tile);
        startMethods();
      }
    }
  },
  //SAWMILL
  sawmill: (event) => {
    if (event.target.classList.contains("grid-cell")) {
      const tile = event.target;
      if (tile.dataset.type == "empty" && !toBlockConstruction()) {
        const newBuilding = new Sawmill(tile);
        const startMethods = startBuildingMethods.bind(newBuilding, tile);
        startMethods();
      }
    }
  },
  //BRICK FACTORY
  brickFactory: (event) => {
    if (event.target.classList.contains("grid-cell")) {
      const tile = event.target;
      if (tile.dataset.type == "empty" && !toBlockConstruction()) {
        const newBuilding = new BrickFactory(tile);
        const startMethods = startBuildingMethods.bind(newBuilding, tile);
        startMethods();
        createPipe(tile);
      }
    }
  },
  //SMALL FOUNDRY
  smallFoundry: (event) => {
    if (event.target.classList.contains("grid-cell")) {
      const tile = event.target;
      if (tile.dataset.type == "empty" && !toBlockConstruction()) {
        const newBuilding = new SmallFoundry(tile);
        const startMethods = startBuildingMethods.bind(newBuilding, tile);
        startMethods();
        createPipe(tile);
      }
    }
  },
  //FOUNDRY
  foundry: (event) => {
    if (event.target.classList.contains("grid-cell")) {
      const tile = event.target;
      if (tile.dataset.type == "empty" && !toBlockConstruction()) {
        const newBuilding = new Foundry(tile);
        const startMethods = startBuildingMethods.bind(newBuilding, tile);
        startMethods();
        createPipe(tile);
      }
    }
  },
  // //STEEL FOUNDRY
  steelMill: (event) => {
    if (event.target.classList.contains("grid-cell")) {
      const tile = event.target;
      if (tile.dataset.type == "empty" && !toBlockConstruction()) {
        const newBuilding = new SteelMill(tile);
        const startMethods = startBuildingMethods.bind(newBuilding, tile);
        startMethods();
        createPipe(tile);
      }
    }
  },
  //SMALL ASSEMBLY
  smallAssembly: (event) => {
    if (event.target.classList.contains("grid-cell")) {
      const tile = event.target;
      if (tile.dataset.type == "empty" && !toBlockConstruction()) {
        const newBuilding = new SmallAssembly(tile);
        const startMethods = startBuildingMethods.bind(newBuilding, tile);
        startMethods();
      }
    }
  },
  //ASSEMBLY
  assembly: (event) => {
    if (event.target.classList.contains("grid-cell")) {
      const tile = event.target;
      if (tile.dataset.type == "empty" && !toBlockConstruction()) {
        const newBuilding = new Assembly(tile);
        const startMethods = startBuildingMethods.bind(newBuilding, tile);
        startMethods();
      }
    }
  },
  //CEMENT PLANT
  cementPlant: (event) => {
    if (event.target.classList.contains("grid-cell")) {
      const tile = event.target;
      if (tile.dataset.type == "empty" && !toBlockConstruction()) {
        const newBuilding = new CementPlant(tile);
        const startMethods = startBuildingMethods.bind(newBuilding, tile);
        startMethods();
      }
    }
  },
  //GLASS FACTORY
  glassFactory: (event) => {
    if (event.target.classList.contains("grid-cell")) {
      const tile = event.target;
      if (tile.dataset.type == "empty" && !toBlockConstruction()) {
        const newBuilding = new GlassFactory(tile);
        const startMethods = startBuildingMethods.bind(newBuilding, tile);
        startMethods();
        createPipe(tile);
      }
    }
  },
  //CONCRETE PLANT
  concretePlant: (event) => {
    if (event.target.classList.contains("grid-cell")) {
      const tile = event.target;
      if (tile.dataset.type == "empty" && !toBlockConstruction()) {
        const newBuilding = new ConcretePlant(tile);
        const startMethods = startBuildingMethods.bind(newBuilding, tile);
        startMethods();
        createPipe(tile);
      }
    }
  },

  //CHEMICAL PLANT
  chemicalPlant: (event) => {
    if (event.target.classList.contains("grid-cell")) {
      const tile = event.target;
      if (tile.dataset.type == "empty" && !toBlockConstruction()) {
        const newBuilding = new ChemicalPlant(tile);
        const startMethods = startBuildingMethods.bind(newBuilding, tile);
        startMethods();
        createPipe(tile);
      }
    }
  },

  //OIL REFINERY
  oilRefinery: (event) => {
    if (event.target.classList.contains("grid-cell")) {
      const tile = event.target;
      if (tile.dataset.type == "empty" && !toBlockConstruction()) {
        const newBuilding = new OilRefinery(tile);
        const startMethods = startBuildingMethods.bind(newBuilding, tile);
        startMethods();
      }
    }
  },
  //OIL REFINERY
  carFactory: (event) => {
    if (event.target.classList.contains("grid-cell")) {
      const tile = event.target;
      if (tile.dataset.type == "empty" && !toBlockConstruction()) {
        const newBuilding = new CarFactory(tile);
        const startMethods = startBuildingMethods.bind(newBuilding, tile);
        startMethods();
      }
    }
  },
  //////STORAGE//////

  //STORAGE
  smallStorage: (event) => {
    if (event.target.classList.contains("grid-cell")) {
      const tile = event.target;
      if (tile.dataset.type == "empty" && !toBlockConstruction()) {
        const newBuilding = new SmallStorage(tile);
        const startMethods = startBuildingMethods.bind(newBuilding, tile);
        startMethods();
      }
    }
  },
  mediumStorage: (event) => {
    if (event.target.classList.contains("grid-cell")) {
      const tile = event.target;
      if (tile.dataset.type == "empty" && !toBlockConstruction()) {
        const newBuilding = new Storage(tile);
        const startMethods = startBuildingMethods.bind(newBuilding, tile);
        startMethods();
      }
    }
  },

  //////TRANSPORTATION//////

  //CONVEYOR
  conveyor: (event) => {
    if (event.target.classList.contains("grid-cell")) {
      const tile = event.target;
      if (tile.dataset.type == "empty" && !shiftKeyPressed) {
        const newBuilding = new Conveyor(tile);
        const startMethods = startBuildingMethods.bind(newBuilding, tile);
        startMethods();
      }
    }
  },
  //CONNECTOR
  connector: (event) => {
    if (event.target.classList.contains("grid-cell")) {
      const tile = event.target;
      if (tile.dataset.type == "empty") {
        const newBuilding = new Connector(tile);
        const startMethods = startBuildingMethods.bind(newBuilding, tile);
        startMethods();
      }
    }
  },
  //SPLITTER
  splitter: (event) => {
    if (event.target.classList.contains("grid-cell")) {
      const tile = event.target;
      if (tile.dataset.type == "empty") {
        const newBuilding = new Splitter(tile);
        const startMethods = startBuildingMethods.bind(newBuilding, tile);
        startMethods();
      }
    }
  },
  undergroundConveyor: (event) => {
    if (event.target.classList.contains("grid-cell")) {
      const tile = event.target;
      if (tile.dataset.type == "empty") {
        const newBuilding = new UndergroundConveyor(tile);
        const startMethods = startBuildingMethods.bind(newBuilding, tile);
        startMethods();
      }
    }
  },
  //PIPE
  pipe: (event) => {
    if (event.target.classList.contains("grid-cell")) {
      const tile = event.target;
      tile.style.position = "relative";
      if (!tile.dataset.undergroundType && !shiftKeyPressed) {
        const newBuilding = new Pipe(tile);
        const startMethods = startBuildingMethods.bind(newBuilding, tile);
        startMethods();
      }
    }
  },
  //ROAD
  gravelRoad: (event) => {
    if (event.target.classList.contains("grid-cell")) {
      const tile = event.target;
      if (tile.dataset.type == "empty" && !shiftKeyPressed) {
        const newBuilding = new Road(tile, "", "gravelRoad");
        tile.dataset.roadType = currentTool;
        const startMethods = startBuildingMethods.bind(newBuilding, tile);
        startMethods();
      }
    }
  },
  concreteRoad: (event) => {
    if (event.target.classList.contains("grid-cell")) {
      const tile = event.target;
      if (tile.dataset.type == "empty" && !shiftKeyPressed) {
        const newBuilding = new Road(tile, "", "concreteRoad");
        tile.dataset.roadType = currentTool;
        const startMethods = startBuildingMethods.bind(newBuilding, tile);
        startMethods();
      }
    }
  },
  //CARGO STATION
  cargoStation: (event) => {
    if (event.target.classList.contains("grid-cell")) {
      const tile = event.target;
      const tileData = tile.dataset;
      const factoryImg = document.querySelector(".connection-hover");
      if (!factoryImg)
        return notyf.open({ type: "warning", message: "The cargo station needs to be placed near building!" });

      factoryImg.classList.remove("connection-hover");
      const factoryTile = factoryImg.parentElement;
      //Object creation
      const newBuilding = new CargoStation(tile);
      const startMethods = startBuildingMethods.bind(newBuilding, tile);
      const clickArea = startMethods();
      //Datasets
      tileData.direction = { 0: "up", 1: "right", 2: "down", 3: "left" }[buildingDirection];
      tileData.cargoStationType = "Export";
      tileData.cargoStationItem = "Empty";
      const stationData = newBuilding.updateData(factoryTile);
      tileData.connectedTo = factoryTile.dataset.buildingType;
      tileData.connectedToId = factoryTile.dataset.buildingId;
      const name = "cargoStation";
      const menu = newBuilding.createMenu(
        CargoStationMenu,
        name,
        buildingsMenuId[`${name}MenuId`]++,
        clickArea,
        stationData
      );
      newBuilding.addStationToList(menu, tile);
    }
  },
  //GARAGE
  garage: (event) => {
    if (event.target.classList.contains("grid-cell")) {
      const tile = event.target;
      if (tile.dataset.type == "empty" && !toBlockConstruction()) {
        const newBuilding = new Garage(tile);
        const startMethods = startBuildingMethods.bind(newBuilding, tile);
        const clickArea = startMethods();
        const name = "garage";
        newBuilding.createMenu(GarageMenu, name, buildingsMenuId[`${name}MenuId`]++, clickArea);
      }
    }
  },
  powerPlant: (event) => {
    if (event.target.classList.contains("grid-cell")) {
      const tile = event.target;
      if (tile.dataset.type == "empty" && !toBlockConstruction()) {
        const newBuilding = new PowerPlant(tile);
        const startMethods = startBuildingMethods.bind(newBuilding, tile);
        startMethods();
        createPipe(tile);
      }
    }
  },
  windTurbine: (event) => {
    if (event.target.classList.contains("grid-cell")) {
      const tile = event.target;
      if (tile.dataset.type == "empty" && !toBlockConstruction()) {
        const newBuilding = new WindTurbine(tile);
        const startMethods = startBuildingMethods.bind(newBuilding, tile);
        startMethods();

        buildingsMenuId["windTurbineMenuId"]++;
      }
    }
  },
};
function startBuildingMethods(tile) {
  const buildingInfo = findBldObjInList(currentTool);
  if (!buildingInfo) return;
  let isEnough = true;
  const costsBlock = document.querySelector(".buildingCostBlock");
  const buildingCost = buildingInfo.cost;
  const avaiableResources = [];
  const { xSize, zSize } = buildingInfo;

  if (document.querySelectorAll(".canBePlaced").length < xSize * zSize && xSize != 1 && zSize != 1) {
    return notyf.error("Buildings can't be build outside the map!");
  }

  for (const [cost, amount] of Object.entries(buildingCost)) {
    const availableAmount = buildingResources[cost] || 0;
    availableAmount >= amount ? avaiableResources.push([cost, amount]) : (isEnough = false);
  }

  if (isEnough || cheatMode) {
    avaiableResources.forEach((e) => {
      buildingResources[e[0]] -= buildingCost[e[1]];
      deleteItemsAfterConstr(e[0], buildingCost[e[1]]);
    });

    this.getId(tile.id);
    this.createBuilding();

    const tiles = this.tilesOccupation(xSize, zSize);
    const zIndexTile = tiles[zSize - 1];

    currentTool !== "quarry" && this.createBuildingImage(zIndexTile);

    const clickArea = currentTool != "pipe" ? this.createClickArea(xSize, zSize) : "";

    this.processing && this.processing(clickArea);
    this.addItemToStorage && this.addItemToStorage(clickArea);
    this.extraction && this.extraction(clickArea);
    this.addPipeDirection && this.addPipeDirection();
    this.curvedObjCreating && this.curvedObjCreating();
    this.addDirection && this.addDirection();
    this.createUGDEntrance && this.createUGDEntrance();
    this.exportItem && this.exportItem();
    currentTool == "splitter" && this.splitItems();
    this.curvedObjCreating && this.curvedObjCreating();

    playConstructionSound();

    costsBlock.classList.add("yellowBorderAnim");
    setTimeout(() => costsBlock.classList.remove("yellowBorderAnim"), 500);
    showBuildingCost();
    return clickArea;
  } else {
    costsBlock.classList.add("shake");
    setTimeout(() => costsBlock.classList.remove("shake"), 500);
    errorSoundIsPlaying = false;
    errorSound();
  }
}

function deleteItemsAfterConstr(itemType, buildingCost) {
  let totalCost = buildingCost;
  const foundItems = storageResources.filter((obj) => obj.resName === itemType);
  for (const item of foundItems) {
    const itemTile = document.querySelector(`[data-building-id="${item.id}"]`);
    if (item.storageType == "ground") {
      const index = storageResources.findIndex((obj) => obj.id === item.id);
      storageResources.splice(index, 1);
      console.log(storageResources);
      itemTile.querySelector("img").remove();
      itemTile.removeAttribute("data-ground-item");
      itemTile.removeAttribute("data-building-id");
      totalCost -= 5;

      if (totalCost <= 0) break;
    } else {
      if (itemTile.dataset.itemAmountOutput1 >= buildingCost) {
        item.resAmount -= buildingCost;
        console.log(itemTile.dataset.itemAmountOutput1);
        itemTile.dataset.itemAmountOutput1 = parseInt(itemTile.dataset.itemAmountOutput1) - buildingCost;
        break;
      } else {
        totalCost -= itemTile.dataset.itemAmountOutput1;
        itemTile.dataset.itemAmountOutput1 = 0;
        if (totalCost <= 0) break;
      }
    }
  }
  updateStorageResources();
}
//TO BLOCK CONSTRUCTION
function toBlockConstruction() {
  const tiles = document.querySelectorAll(".grid-cell");
  return [...tiles].some((tile) => tile.classList.contains("cantBePlaced"));
}
function createPipe(tile) {
  const newPipe = new Pipe(tile);
  newPipe.getId(tile.id);
  const pipeImg = newPipe.createBuildingImage();
  newPipe.addPipeDirection();
  pipeImg.src = `img/pipes/pipe-cross.png`;
  pipeImg.dataset.pipeType = "connector";
  pipeImg.classList.add("hidden");
  tile.dataset.undergroundType = "pipe";
}
