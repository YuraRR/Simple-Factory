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
  windTurbine: (event) => {
    if (event.target.classList.contains("grid-cell")) {
      const tile = event.target;
      if (tile.dataset.type == "empty" && !toBlockConstruction()) {
        const newBuilding = new WindTurbine(tile);
        const startMethods = startBuildingMethods.bind(newBuilding, tile);
        startMethods();
      }
    }
  },
  powerPlant: (event) => {
    createObj(event.target, new PowerPlant(event.target), true);
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
    createObj(event.target, new Lumbermill(event.target), true);
  },
  //////PROCESSING//////

  //ORE PROCESSING PLANT
  oreProcessing: (event) => {
    createObj(event.target, new OreProcessingPlant(event.target), true);
  },
  //CRUSHING PLANT
  crushingPlant: (event) => {
    createObj(event.target, new CrushingPlant(event.target));
  },
  //SAWMILL
  sawmill: (event) => {
    createObj(event.target, new Sawmill(event.target));
  },
  //BRICK FACTORY
  brickFactory: (event) => {
    createObj(event.target, new BrickFactory(event.target), true);
  },
  //SMALL FOUNDRY
  smallFoundry: (event) => {
    createObj(event.target, new SmallFoundry(event.target), true);
  },
  //FOUNDRY
  foundry: (event) => {
    createObj(event.target, new Foundry(event.target), true);
  },
  // //STEEL FOUNDRY
  steelMill: (event) => {
    createObj(event.target, new SteelMill(event.target), true);
  },
  //SMALL ASSEMBLY
  smallAssembly: (event) => {
    createObj(event.target, new SmallAssembly(event.target));
  },
  //ASSEMBLY
  assembly: (event) => {
    createObj(event.target, new Assembly(event.target));
  },
  //CEMENT PLANT
  cementPlant: (event) => {
    createObj(event.target, new CementPlant(event.target));
  },
  //GLASS FACTORY
  glassFactory: (event) => {
    createObj(event.target, new GlassFactory(event.target), true);
  },
  //CONCRETE PLANT
  concretePlant: (event) => {
    createObj(event.target, new ConcretePlant(event.target), true);
  },

  //CHEMICAL PLANT
  chemicalPlant: (event) => {
    createObj(event.target, new ChemicalPlant(event.target), true);
  },

  //OIL REFINERY
  oilRefinery: (event) => {
    createObj(event.target, new OilRefinery(event.target));
  },
  //OIL REFINERY
  carFactory: (event) => {
    createObj(event.target, new CarFactory(event.target));
  },
  //////STORAGE//////

  //STORAGE
  smallStorage: (event) => {
    createObj(event.target, new SmallStorage(event.target));
  },
  mediumStorage: (event) => {
    createObj(event.target, new Storage(event.target));
  },

  //////TRANSPORTATION//////

  //CONVEYOR
  conveyor: (event) => {
    createObj(event.target, new Conveyor(event.target));
  },
  //CONNECTOR
  connector: (event) => {
    createObj(event.target, new Connector(event.target));
  },
  //SPLITTER
  splitter: (event) => {
    createObj(event.target, new Splitter(event.target));
  },
  undergroundConveyor: (event) => {
    createObj(event.target, new UndergroundConveyor(event.target));
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
    const factoryImg = document.querySelector(".connection-hover");
    if (!factoryImg)
      return notyf.open({ type: "warning", message: "The cargo station needs to be placed near building!" });
    createObj(event.target, new CargoStation(event.target));
  },
  //GARAGE
  garage: (event) => {
    createObj(event.target, new Garage(event.target));
  },
};
function createObj(tile, bldClass, isPipe) {
  if (tile.classList.contains("grid-cell")) {
    if (tile.dataset.type == "empty" && !toBlockConstruction()) {
      const newBuilding = bldClass;
      const startMethods = startBuildingMethods.bind(newBuilding, tile);
      startMethods();

      isPipe && createPipe(tile);
    }
  }
}
function startBuildingMethods(tile) {
  const buildingInfo = findBldObjInList(currentTool);
  if (!buildingInfo) return;
  let isEnough = true;
  const costsBlock = document.querySelector(".buildingCostBlock");
  const buildingCost = buildingInfo.cost;
  const { xSize, zSize } = buildingInfo;

  if (document.querySelectorAll(".canBePlaced").length < xSize * zSize && xSize != 1 && zSize != 1) {
    return notyf.error("Buildings can't be build outside the map!");
  }

  for (const [cost, amount] of Object.entries(buildingCost)) {
    const availableAmount = buildingResources[cost] || 0;
    availableAmount < amount ? (isEnough = false) : "";
  }

  if (isEnough || cheatMode) {
    for (let itemName in buildingCost) {
      const costAmount = buildingCost[itemName];
      buildingResources[itemName] -= costAmount;
      deleteItemsAfterConstr(itemName, costAmount);
    }

    this.getId(tile.id);
    this.createBuilding();

    const tiles = this.tilesOccupation(xSize, zSize);
    const zIndexTile = tiles[zSize - 1];

    currentTool !== "quarry" && this.createBuildingImage(zIndexTile);

    const clickArea =
      currentTool != "pipe" &&
      currentTool != "conveyor" &&
      currentTool != "connector" &&
      currentTool != "splitter" &&
      currentTool != "gravelRoad" &&
      currentTool != "concreteRoad"
        ? this.createClickArea(xSize, zSize)
        : "";

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
    this.stationCreate && this.stationCreate(clickArea);
    this.garageCreate && this.garageCreate(clickArea);

    playConstructionSound();

    costsBlock.classList.add("yellowBorderAnim");
    deltaTimeout(() => costsBlock.classList.remove("yellowBorderAnim"), 500);
    showBuildingCost();
    return clickArea;
  } else {
    costsBlock.classList.add("shake");
    deltaTimeout(() => costsBlock.classList.remove("shake"), 500);
    errorSound();
  }
}

function deleteItemsAfterConstr(itemType, buildingCost) {
  let totalCost = buildingCost;
  const foundItems = storageResources.filter((obj) => obj.resName === itemType);
  for (const item of foundItems) {
    const itemTile = document.querySelector(`[data-building-id="${item.id}"]`);
    const index = storageResources.findIndex((obj) => obj.id === item.id);
    if (item.storageType == "ground") {
      if (buildingCost < itemTile.dataset.groundItemAmount) {
        itemTile.dataset.groundItemAmount = +itemTile.dataset.groundItemAmount - buildingCost;
        totalCost -= buildingCost;
        storageResources[index].amount = itemTile.dataset.groundItemAmount;
        console.log(storageResources);
      } else {
        storageResources.splice(index, 1);
        const itemImg = itemTile.querySelector("img");
        itemImg && itemImg.remove();
        itemTile.removeAttribute("data-ground-item");
        itemTile.removeAttribute("data-building-id");
        totalCost -= itemTile.dataset.groundItemAmount;
      }

      if (totalCost <= 0) break;
    } else {
      if (itemTile && itemTile.dataset.itemAmountOutput1 >= buildingCost) {
        item.resAmount -= buildingCost;
        console.log(itemTile.dataset.itemAmountOutput1);
        itemTile.dataset.itemAmountOutput1 -= buildingCost;
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
  console.log("Da");
  const newPipe = new Pipe(tile);
  newPipe.getId(tile.id);
  const pipeImg = newPipe.createBuildingImage();
  newPipe.addPipeDirection();
  pipeImg.src = `img/pipes/pipe-cross.png`;
  pipeImg.dataset.pipeType = "connector";
  pipeImg.classList.add("hidden");
  tile.dataset.undergroundType = "pipe";
}
