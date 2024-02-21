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
        newBuilding.getId(cell.id);
        newBuilding.createBuilding();
        newBuilding.createBuildingImage();
        let clickArea = newBuilding.createClickArea(1, 1);
        newBuilding.extraction(clickArea);
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
      if (cell.dataset.type == "Sand") {
        let newBuilding = new WaterPump(cell);
        newBuilding.getId(cell.id);
        newBuilding.createBuilding();
        newBuilding.createBuildingImage();
        newBuilding.startPumping();
      }
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
  cementPlant: (event) => {
    transperentBuildingsRemove();
    if (undergroundOpened) showUnderground();
    if (event.target.classList.contains("grid-cell")) {
      const cell = event.target;
      if (cell.dataset.type == "empty" && !toBlockConstruction()) {
        cell.classList.add("cementPlant");
        const newBuilding = new CementPlant(cell);
        const startMethods = startBuildingMethods.bind(newBuilding, cell);
        startMethods();
      }
    }
  },
  //////STORAGE//////

  //STORAGE
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
        let newBuilding = new Conveyor(cell);
        newBuilding.getId(cell.id);
        // newBuilding.createBuildingImage();
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
        let newBuilding = new Pipe(cell);
        newBuilding.getId(cell.id);
        newBuilding.createBuildingImage();
        newBuilding.addPipeDirection();
        newBuilding.curvedPipeCreating();
        // newConveyor.checkNeighbors();
      }
    }
  },
  //FLUID SPLITTER
  fluidSplitter: (event) => {
    if (!undergroundOpened) showUnderground();
    if (event.target.classList.contains("grid-cell")) {
      const cell = event.target;
      if (!cell.dataset.undergroundType) {
        let newBuilding = new FluidSplitter(cell);
        newBuilding.getId(cell.id);
        newBuilding.createBuildingImage();
        newBuilding.addPipeDirection(cell);
        newBuilding.splitItems("fluid");
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
      const factoryTile = findTargetTileByDirection(cell);
      if (cellData.type == "empty" && factoryTile) {
        //Object creation
        const newBuilding = new CargoStation(cell);
        const startMethods = startBuildingMethods.bind(newBuilding, cell);
        const clickArea = startMethods();
        //Datasets
        cellData.direction = { 0: "up", 1: "right", 2: "down", 3: "left" }[buildingDirection];
        cellData.cargoStationType = "Export";
        cellData.cargoStationItem = "Empty";

        const stationData = newBuilding.updateData(factoryTile);
        cellData.connectedTo = factoryTile.dataset.buildingType;
        //Menu creation
        const menu = newBuilding.createMenu(
          CargoStationMenu,
          "cargoStation",
          cargoStationMenuId,
          clickArea,
          stationData
        );
      }
    }
  },
  //TRADING TERMINAL
  tradingTerminal: (event) => {
    if (event.target.classList.contains("grid-cell")) {
      const cell = event.target;
      if (cell.dataset.type == "empty") {
        let newBuilding = new TradingTerminal(cell);
        if (isTileBorder(newBuilding)) {
          newBuilding.getId(cell.id);
          newBuilding.createBuilding();
          newBuilding.createBuildingImage();
          newBuilding.tilesOccupation(3, 3);
          let clickArea = newBuilding.createClickArea(3, 3);
        }
      }
    }
  },

  powerPlant: (event) => {},
};
const equipmentCreating = {
  Crusher: (event) => {
    console.log("da");
    if (event.target.classList.contains("grid-cell")) {
      const tile = event.target;
      if (tile.dataset.buildingType == "oreProcessing" || tile.classList.contains("activeTileOutline")) {
        tile.classList.add("equipment");
        let newEquipment = new Crusher(tile);
        newEquipment.getId(tile.id);
        newEquipment.createBuildingImage(true);
        newEquipment.createEquipment();
        newEquipment.addEfficiency();
        tile.classList.remove("activeTileOutline");
      }
    }
  },
  ExtraExcavator: (event) => {},
};
function startBuildingMethods(tile) {
  const buildingInfo = allBuilding.find((bld) => bld.name === currentTool);
  if (buildingInfo) {
    const { xSize, zSize } = buildingInfo;
    this.getId(tile.id);
    this.createBuilding();
    if (currentTool != "quarry") this.createBuildingImage();
    this.tilesOccupation(xSize, zSize);
    const clickArea = this.createClickArea(xSize, zSize);
    if (this.processing) this.processing(clickArea);
    if (this.addItemToStorage) this.addItemToStorage(clickArea);
    if (this.extraction) this.extraction(clickArea);
    return clickArea;
  } else {
    console.error(`Building information not found for ${currentTool}`);
  }
}
//TO BLOCK CONSTRUCTION
function toBlockConstruction() {
  let CELLS = document.querySelectorAll(".grid-cell");
  return [...CELLS].some((cell) => cell.classList.contains("cantBePlaced"));
}
