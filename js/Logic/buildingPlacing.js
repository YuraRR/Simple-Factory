//MINESHAFT
function mineshaftCreating(event) {
  if (event.target.classList.contains("grid-cell")) {
    const cell = event.target;
    if (cell.dataset.type == "ore" && cell.dataset.buildingType != "mineshaft") {
      let newBuilding;
      cell.classList.add("mineshaft");
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
      let clickArea = newBuilding.tilesOccupation(1, 1);
      newBuilding.extraction(clickArea);
    }
  }
}
//QUARRY
function quarryCreating(event) {
  if (event.target.classList.contains("grid-cell") && !toBlockConstruction()) {
    const cell = event.target;
    if (cell.dataset.type == "sand") {
      let newBuilding;
      cell.classList.add("quarry");
      newBuilding = new Quarry(cell);
      newBuilding.getId(cell.id);
      newBuilding.createBuilding();
      let clickArea = newBuilding.tilesOccupation(2, 2);
      newBuilding.extraction(clickArea);
      newBuilding.createBuildingImage();
    }
  }
}
//CONVEYOR
function conveyorCreating(event) {
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
}

//CONNECTOR
function connectorCreating(event) {
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
}
//SPLITTER
function splitterCreating(event) {
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
}
//PIPE
function pipeCreating(event) {
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
}
//FLUID SPLITTER
function fluidSplitterCreating(event) {
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
}
//WATER PUMP
function waterPumpCreating(event) {
  if (event.target.classList.contains("grid-cell")) {
    const cell = event.target;
    if (cell.dataset.type == "Sand") {
      cell.classList.add("waterPump");
      let newBuilding = new WaterPump(cell);
      newBuilding.getId(cell.id);
      newBuilding.createBuilding();
      newBuilding.createBuildingImage();
      newBuilding.startPumping();
    }
  }
}
//ORE PROCESSING PLANT
function oreProcessingCreating(event) {
  if (event.target.classList.contains("grid-cell")) {
    const cell = event.target;
    if (cell.dataset.type == "empty" && !toBlockConstruction()) {
      let newBuilding = new OreProcessingPlant(cell);
      cell.classList.add("oreProcessing");
      newBuilding.getId(cell.id);
      newBuilding.createBuilding();
      newBuilding.createBuildingImage();
      let clickArea = newBuilding.tilesOccupation(2, 2);
      newBuilding.processing(clickArea);
    }
  }
}
//SMELTER
function smelterCreating(event) {
  if (event.target.classList.contains("grid-cell")) {
    const cell = event.target;
    if (cell.dataset.type == "empty" && !toBlockConstruction()) {
      cell.classList.add("smelter");
      let newBuilding = new Smelter(cell);
      newBuilding.getId(cell.id);
      newBuilding.createBuilding();
      newBuilding.createBuildingImage();
      let clickArea = newBuilding.tilesOccupation(3, 3);
      newBuilding.processing(clickArea);
      console.log("da1");
    }
  }
}
//ASSEMBLER
function assemblerCreating(event) {
  if (event.target.classList.contains("grid-cell")) {
    const cell = event.target;
    if (cell.dataset.type == "empty" && !toBlockConstruction()) {
      cell.classList.add("assembler");
      let newBuilding = new Assembler(cell);
      newBuilding.getId(cell.id);
      newBuilding.createBuilding();
      newBuilding.createBuildingImage();
      let clickArea = newBuilding.tilesOccupation(6, 4);
      newBuilding.processing(clickArea);
    }
  }
}
//STORAGE
function storageCreating(event) {
  if (event.target.classList.contains("grid-cell")) {
    const cell = event.target;
    if (cell.dataset.type == "empty" && !toBlockConstruction()) {
      cell.classList.add("storage");
      let newBuilding = new Storage(cell);
      newBuilding.getId(cell.id);
      newBuilding.createBuilding();
      newBuilding.createBuildingImage();
      let occupiedTiles = newBuilding.tilesOccupation(2, 2);
      let menu = newBuilding.createMenu(StorageMenu, "storage", storageMenuId, occupiedTiles);
      newBuilding.addItemToStorage(menu);
    }
  }
}
//ROAD
function roadCreating(event) {
  if (event.target.classList.contains("grid-cell")) {
    const cell = event.target;
    if (cell.dataset.type == "empty") {
      let newBuilding = new Road(cell);
      newBuilding.getId(cell.id);
      newBuilding.createBuilding();
    }
  }
}

//CARGO STATION
function cargoStationCreating(event) {
  if (event.target.classList.contains("grid-cell")) {
    const cell = event.target;
    const cellData = cell.dataset;
    const factoryTile = findTargetTileByDirection(cell);
    if (cellData.type == "empty" && factoryTile) {
      //Object creation
      let newBuilding = new CargoStation(cell);
      newBuilding.getId(cell.id);
      newBuilding.createBuilding();

      //Datasets
      cellData.direction = { 0: "up", 1: "right", 2: "down", 3: "left" }[buildingDirection];
      cellData.cargoStationType = "Export";
      cellData.cargoStationItem = "Empty";

      let stationData = newBuilding.updateData(factoryTile);
      cellData.connectedTo = factoryTile.dataset.buildingType;
      //Menu creation
      let clickArea = newBuilding.tilesOccupation(1, 1);
      let menu = newBuilding.createMenu(
        CargoStationMenu,
        "cargo-station",
        cargoStationMenuId,
        clickArea,
        stationData
      );
    }
  }
}
//TRADING TERMINAL
function tradingTerminalCreating(event) {
  if (event.target.classList.contains("grid-cell")) {
    const cell = event.target;
    if (cell.dataset.type == "empty") {
      let newBuilding = new TradingTerminal(cell);
      if (isTileBorder(newBuilding)) {
        newBuilding.getId(cell.id);
        newBuilding.createBuilding();
        newBuilding.createBuildingImage();
        let clickArea = newBuilding.tilesOccupation(3, 3);
      }
    }
  }
}
//TO BLOCK CONSTRUCTION
function toBlockConstruction() {
  let CELLS = document.querySelectorAll(".grid-cell");
  return [...CELLS].some((cell) => cell.classList.contains("cantBePlaced"));
}
