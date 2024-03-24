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
  //IRON FOUNDRY
  ironFoundry: (event) => {
    if (event.target.classList.contains("grid-cell")) {
      const tile = event.target;
      if (tile.dataset.type == "empty" && !toBlockConstruction()) {
        const newBuilding = new IronFoundry(tile);
        const startMethods = startBuildingMethods.bind(newBuilding, tile);
        startMethods();
        createPipe(tile);
      }
    }
  },
  //STEEL FOUNDRY
  steelFoundry: (event) => {
    if (event.target.classList.contains("grid-cell")) {
      const tile = event.target;
      if (tile.dataset.type == "empty" && !toBlockConstruction()) {
        const newBuilding = new SteelFoundry(tile);
        const startMethods = startBuildingMethods.bind(newBuilding, tile);
        startMethods();
        createPipe(tile);
      }
    }
  },
  //ASSEMBLER
  assembler: (event) => {
    if (event.target.classList.contains("grid-cell")) {
      const tile = event.target;
      if (tile.dataset.type == "empty" && !toBlockConstruction()) {
        tile.classList.add("assembler");
        const newBuilding = new Assembler(tile);
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
      if (tile.dataset.type == "empty") {
        const newBuilding = new Conveyor(tile);
        newBuilding.getId(tile.id);
        newBuilding.createBuilding();
        newBuilding.createBuildingImage();
        newBuilding.addDirection();
        newBuilding.curvedObjCreating();
      }
    }
  },
  //CONNECTOR
  connector: (event) => {
    if (event.target.classList.contains("grid-cell")) {
      const tile = event.target;
      if (tile.dataset.type == "empty") {
        const newBuilding = new Connector(tile);
        newBuilding.getId(tile.id);
        newBuilding.createBuilding();
        newBuilding.createBuildingImage();
        newBuilding.addDirection();
        newBuilding.exportItem();
      }
    }
  },
  //SPLITTER
  splitter: (event) => {
    if (event.target.classList.contains("grid-cell")) {
      const tile = event.target;
      if (tile.dataset.type == "empty") {
        let newBuilding = new Splitter(tile);
        newBuilding.getId(tile.id);
        newBuilding.createBuilding();
        newBuilding.createBuildingImage();
        newBuilding.addDirection();
        newBuilding.splitItems();
      }
    }
  },
  undergroundConveyor: (event) => {
    if (event.target.classList.contains("grid-cell")) {
      const tile = event.target;
      if (tile.dataset.type == "empty") {
        let newBuilding = new UndergroundConveyor(tile);
        newBuilding.getId(tile.id);
        newBuilding.createBuilding();
        newBuilding.createBuildingImage();
        newBuilding.addDirection();
        newBuilding.createUGDEntrance();
      }
    }
  },
  //PIPE
  pipe: (event) => {
    if (event.target.classList.contains("grid-cell")) {
      const tile = event.target;
      tile.style.position = "relative";
      if (!tile.dataset.undergroundType) {
        const newBuilding = new Pipe(tile);
        newBuilding.getId(tile.id);
        newBuilding.createBuildingImage();
        newBuilding.addPipeDirection();
        newBuilding.curvedObjCreating();
      }
    }
  },
  //ROAD
  road: (event) => {
    if (event.target.classList.contains("grid-cell")) {
      const tile = event.target;
      if (tile.dataset.type == "empty") {
        let newBuilding = new Road(tile);
        newBuilding.getId(tile.id);
        newBuilding.createBuilding();
      }
    }
  },
  //CARGO STATION
  cargoStation: (event) => {
    if (event.target.classList.contains("grid-cell")) {
      const tile = event.target;
      const tileData = tile.dataset;
      const factoryTile = findTargetTileByDirection(tile, true);
      if (tileData.type == "empty" && factoryTile) {
        //Object creation
        const newBuilding = new CargoStation(tile);
        const startMethods = startBuildingMethods.bind(newBuilding, tile);
        const clickArea = startMethods();
        //Datasets
        tileData.direction = { 0: "up", 1: "right", 2: "down", 3: "left" }[buildingDirection];
        tileData.cargoStationType = "Export";
        tileData.cargoStationItem = "Empty";
        const factoryTile = findTargetTileByDirection(tile, true);
        const stationData = newBuilding.updateData(factoryTile);
        tileData.connectedTo = factoryTile.dataset.buildingType;
        const name = "cargoStation";
        const menu = newBuilding.createMenu(
          CargoStationMenu,
          name,
          buildingsMenuId[`${name}MenuId`]++,
          clickArea,
          stationData
        );
        //Menu creation
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
};
const structureCreating = {
  Crusher: (event) => {
    console.log("da");
    if (event.target.classList.contains("grid-cell")) {
      const tile = event.target;
      if (tile.dataset.buildingType == "oreProcessing" || tile.classList.contains("activeTileOutline")) {
        tile.classList.add("structure");
        const newStructure = new Crusher(tile);
        newStructure.getId(tile.id);
        newStructure.createBuildingImage(true);
        newStructure.createStructure();
        newStructure.addEfficiency();
        tile.classList.remove("activeTileOutline");
      }
    }
  },
  ExtraExcavator: (event) => {},
};
function startBuildingMethods(tile) {
  const buildingInfo = allBuildings.find((bld) => bld.name === currentTool);
  let isEnough = true;
  if (buildingInfo) {
    const buildingCost = buildingInfo.cost;
    for (const cost in buildingCost) {
      if (Object.hasOwnProperty.call(buildingCost, cost)) {
        for (const available in buildingResources) {
          if (Object.hasOwnProperty.call(buildingResources, available)) {
            if (available === cost) {
              if (buildingResources[available] >= buildingCost[cost]) {
                buildingResources[available] -= buildingCost[cost];
              } else {
                isEnough = false;
                console.log(`${cost} is not enough!`);
              }
            }
          }
        }
      }
    }
    if (isEnough || cheatMode == true) {
      playConstructionSound();
      const { xSize, zSize } = buildingInfo;
      this.getId(tile.id);
      this.createBuilding();

      if (currentTool !== "quarry") this.createBuildingImage();

      this.tilesOccupation(xSize, zSize);
      const clickArea = this.createClickArea(xSize, zSize);

      this.processing && this.processing(clickArea);
      this.addItemToStorage && this.addItemToStorage(clickArea);
      this.extraction && this.extraction(clickArea);
      return clickArea;
    }
  }
}
//TO BLOCK CONSTRUCTION
function toBlockConstruction() {
  let tileS = document.querySelectorAll(".grid-cell");
  return [...tileS].some((tile) => tile.classList.contains("cantBePlaced"));
}
function createPipe(tile) {
  const newPipe = new Pipe(tile);
  newPipe.getId(tile.id);
  const pipeImg = newPipe.createBuildingImage();
  newPipe.addPipeDirection();
  newPipe.curvedObjCreating();
  pipeImg.src = `img/pipes/cross.png`;
  pipeImg.dataset.pipeType = "connector";
  pipeImg.classList.add("hidden");
}
