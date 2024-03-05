const buildingCreating = {
  //////SOURCE//////

  //MINESHAFT
  mineshaft: (event) => {
    transperentBuildingsRemove();
    if (undergroundOpened) showUnderground();
    if (event.target.classList.contains("grid-cell")) {
      const cell = event.target;
      if (cell.dataset.type == "ore" && cell.dataset.buildingType != "mineshaft") {
        let newBuilding;
        switch (cell.dataset.oreType) {
          case "iron":
            newBuilding = new IronMineshaft(cell);
            break;
          case "copper":
            newBuilding = new CopperMineshaft(cell);
        }
        const startMethods = startBuildingMethods.bind(newBuilding, cell);
        startMethods();
      }
    }
  },
  //QUARRY
  quarry: (event) => {
    transperentBuildingsRemove();
    if (undergroundOpened) showUnderground();
    if (event.target.classList.contains("grid-cell") && !toBlockConstruction()) {
      const cell = event.target;
      if (
        cell.dataset.groundType == "sand" ||
        cell.dataset.groundType == "clay" ||
        cell.dataset.groundType == "limestone" ||
        cell.dataset.groundType == "stone"
      ) {
        const newBuilding = new Quarry(cell);
        const startMethods = startBuildingMethods.bind(newBuilding, cell);
        startMethods();
      }
    }
  },
  //WATER PUMP
  waterPump: (event) => {
    transperentBuildingsRemove();
    if (undergroundOpened) showUnderground();
    if (event.target.classList.contains("grid-cell")) {
      const cell = event.target;

      const newBuilding = new WaterPump(cell);
      newBuilding.getId(cell.id);
      newBuilding.createBuilding();
      newBuilding.createBuildingImage();
      newBuilding.startPumping();
    }
  },
  //////PROCESSING//////

  //ORE PROCESSING PLANT
  oreProcessing: (event) => {
    transperentBuildingsRemove();
    if (undergroundOpened) showUnderground();
    if (event.target.classList.contains("grid-cell")) {
      const cell = event.target;
      if (cell.dataset.type == "empty" && !toBlockConstruction()) {
        const newBuilding = new OreProcessingPlant(cell);
        const startMethods = startBuildingMethods.bind(newBuilding, cell);
        startMethods();
      }
    }
  },
  //SMELTER
  smelter: (event) => {
    transperentBuildingsRemove();
    if (undergroundOpened) showUnderground();
    if (event.target.classList.contains("grid-cell")) {
      const cell = event.target;
      if (cell.dataset.type == "empty" && !toBlockConstruction()) {
        const newBuilding = new Smelter(cell);
        const startMethods = startBuildingMethods.bind(newBuilding, cell);
        startMethods();
      }
    }
  },
  //ASSEMBLER
  assembler: (event) => {
    transperentBuildingsRemove();
    if (undergroundOpened) showUnderground();
    if (event.target.classList.contains("grid-cell")) {
      const cell = event.target;
      if (cell.dataset.type == "empty" && !toBlockConstruction()) {
        cell.classList.add("assembler");
        const newBuilding = new Assembler(cell);
        const startMethods = startBuildingMethods.bind(newBuilding, cell);
        startMethods();
      }
    }
  },
  //CEMENT PLANT
  cementPlant: (event) => {
    transperentBuildingsRemove();
    if (undergroundOpened) showUnderground();
    if (event.target.classList.contains("grid-cell")) {
      const cell = event.target;
      if (cell.dataset.type == "empty" && !toBlockConstruction()) {
        const newBuilding = new CementPlant(cell);
        const startMethods = startBuildingMethods.bind(newBuilding, cell);
        startMethods();
      }
    }
  },
  //CONCRETE PLANT
  concretePlant: (event) => {
    transperentBuildingsRemove();
    if (undergroundOpened) showUnderground();
    if (event.target.classList.contains("grid-cell")) {
      const cell = event.target;
      if (cell.dataset.type == "empty" && !toBlockConstruction()) {
        const newBuilding = new ConcretePlant(cell);
        const startMethods = startBuildingMethods.bind(newBuilding, cell);
        startMethods();
      }
    }
  },
  //BRICK FACTORY
  brickFactory: (event) => {
    transperentBuildingsRemove();
    if (undergroundOpened) showUnderground();
    if (event.target.classList.contains("grid-cell")) {
      const cell = event.target;
      if (cell.dataset.type == "empty" && !toBlockConstruction()) {
        const newBuilding = new BrickFactory(cell);
        const startMethods = startBuildingMethods.bind(newBuilding, cell);
        startMethods();
      }
    }
  },
  //GLASS FACTORY
  glassFactory: (event) => {
    transperentBuildingsRemove();
    if (undergroundOpened) showUnderground();
    if (event.target.classList.contains("grid-cell")) {
      const cell = event.target;
      if (cell.dataset.type == "empty" && !toBlockConstruction()) {
        const newBuilding = new GlassFactory(cell);
        const startMethods = startBuildingMethods.bind(newBuilding, cell);
        startMethods();
      }
    }
  },
  //////STORAGE//////

  //STORAGE
  smallStorage: (event) => {
    transperentBuildingsRemove();
    if (undergroundOpened) showUnderground();
    if (event.target.classList.contains("grid-cell")) {
      const cell = event.target;
      if (cell.dataset.type == "empty" && !toBlockConstruction()) {
        const newBuilding = new SmallStorage(cell);
        const startMethods = startBuildingMethods.bind(newBuilding, cell);
        startMethods();
      }
    }
  },
  storage: (event) => {
    transperentBuildingsRemove();
    if (undergroundOpened) showUnderground();
    if (event.target.classList.contains("grid-cell")) {
      const cell = event.target;
      if (cell.dataset.type == "empty" && !toBlockConstruction()) {
        const newBuilding = new Storage(cell);
        const startMethods = startBuildingMethods.bind(newBuilding, cell);
        startMethods();
      }
    }
  },

  //////TRANSPORTATION//////

  //CONVEYOR
  conveyor: (event) => {
    transperentBuildingsShow();
    if (undergroundOpened) showUnderground();
    if (event.target.classList.contains("grid-cell")) {
      const cell = event.target;
      if (cell.dataset.type == "empty") {
        const newBuilding = new Conveyor(cell);
        newBuilding.getId(cell.id);
        newBuilding.createBuildingImage();
        newBuilding.createBuilding();
        newBuilding.addDirection();

        // newConveyor.checkNeighbors();
      }
    }
  },
  //CONNECTOR
  connector: (event) => {
    transperentBuildingsShow();
    if (undergroundOpened) showUnderground();
    if (event.target.classList.contains("grid-cell")) {
      const cell = event.target;
      if (cell.dataset.type == "empty") {
        let newBuilding = new Connector(cell);
        newBuilding.getId(cell.id);
        newBuilding.createBuilding();
        newBuilding.createBuildingImage();
        newBuilding.addDirection();
        newBuilding.exportItem();
      }
    }
  },
  //SPLITTER
  splitter: (event) => {
    transperentBuildingsShow();
    if (undergroundOpened) showUnderground();
    if (event.target.classList.contains("grid-cell")) {
      const cell = event.target;
      if (cell.dataset.type == "empty") {
        let newBuilding = new Splitter(cell);
        newBuilding.getId(cell.id);
        newBuilding.createBuilding();
        newBuilding.addDirection();
        newBuilding.splitItems("item");
      }
    }
  },
  //PIPE
  pipe: (event) => {
    if (!undergroundOpened) showUnderground();
    if (event.target.classList.contains("grid-cell")) {
      const cell = event.target;
      cell.style.position = "relative";
      if (!cell.dataset.undergroundType) {
        const newBuilding = new Pipe(cell);
        newBuilding.getId(cell.id);
        newBuilding.createBuildingImage();
        newBuilding.addPipeDirection();
        newBuilding.curvedPipeCreating();
        // newConveyor.checkNeighbors();
      }
    }
  },
  //ROAD
  road: (event) => {
    if (event.target.classList.contains("grid-cell")) {
      const cell = event.target;
      if (cell.dataset.type == "empty") {
        let newBuilding = new Road(cell);
        newBuilding.getId(cell.id);
        newBuilding.createBuilding();
      }
    }
  },
  //CARGO STATION
  cargoStation: (event) => {
    if (event.target.classList.contains("grid-cell")) {
      const cell = event.target;
      const cellData = cell.dataset;
      const factoryTile = findTargetTileByDirection(cell, true);
      if (cellData.type == "empty" && factoryTile) {
        //Object creation
        const newBuilding = new CargoStation(cell);
        const startMethods = startBuildingMethods.bind(newBuilding, cell);
        const clickArea = startMethods();
        //Datasets
        cellData.direction = { 0: "up", 1: "right", 2: "down", 3: "left" }[buildingDirection];
        cellData.cargoStationType = "Export";
        cellData.cargoStationItem = "Empty";
        console.log(clickArea);
        const factoryTile = findTargetTileByDirection(cell, true);
        console.log(factoryTile);
        const stationData = newBuilding.updateData(factoryTile);
        cellData.connectedTo = factoryTile.dataset.buildingType;
        const menu = newBuilding.createMenu(
          CargoStationMenu,
          "cargoStation",
          cargoStationMenuId++,
          clickArea,
          stationData
        );
        //Menu creation
      }
    }
  },

  powerPlant: (event) => {},
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
  const buildingInfo = allBuilding.find((bld) => bld.name === currentTool);
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
  let CELLS = document.querySelectorAll(".grid-cell");
  return [...CELLS].some((cell) => cell.classList.contains("cantBePlaced"));
}
