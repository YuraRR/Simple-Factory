class Building {
  constructor(targetTile, type) {
    Object.assign(this, findTarget);
    this.type = type;
    this.tile = targetTile;
    this.tileData = targetTile.dataset;
  }
  getId(id) {
    this.id = id.split(["."]);
    this.x = parseInt(this.id[0]);
    this.z = parseInt(this.id[1]);
  }
  createBuilding() {
    console.log(`Building a ${this.name}`);
    let building;
    switch (this.name) {
      case "conveyor":
      case "connector":
      case "splitter":
      case "road":
        building = document.getElementById(`${this.x}.${this.z}`);
        building.dataset.type = "transportation";
        break;
      default:
        building = document.getElementById(`${this.x}.${this.z}`);
        building.dataset.type = "building";
        break;
    }

    switch (this.name) {
      case "smelter":
      case "oreProcessing":
        building.dataset.buildingCategory = "inOut";
        break;
      case "mineshaft":
        building.dataset.buildingCategory = "Out";
        break;
    }

    building.dataset.buildingType = this.name;
    building.dataset.buildingId = buildingId++;
    handleMouseLeave();
  }
  createBuildingImage(isUpgrade) {
    const img = document.createElement("img");
    if (isUpgrade) {
      img.dataset.imageType = "upgrade";
    } else {
      img.dataset.imageType = this.tileData.buildingType;
    }

    switch (this.name) {
      case "mineshaft":
        img.src = "/img/buildings/mineshaft.png";
        break;
      case "smelter":
        img.src = "/img/buildings/smelter.png";
        break;
      case "oreProcessing":
        img.src = "/img/buildings/oreProcessing.png";
        break;
      case "assembler":
        img.src = "/img/buildings/assembler.png";
        break;
      case "storage":
        img.src = "/img/buildings/storage.png";
        break;
      case "waterPump":
        img.src = "/img/buildings/waterPump.png";
        break;
      case "fluidConnector":
        img.src = "/img/buildings/fluidConnectorModel.png";
        break;
      // case "conveyor":
      //   img.dataset.imageType = "conveyor";
      //   switch (buildingDirection) {
      //     case 0:
      //       img.src = "/img/conveyors/conveyorTop.png";
      //       break;
      //     case 1:
      //       img.src = "/img/conveyors/conveyorRight.png";
      //       break;
      //     case 2:
      //       img.src = "/img/conveyors/conveyorBottom.png";
      //       break;
      //     case 3:
      //       img.src = "/img/conveyors/conveyorLeft.png";
      //       break;
      //   }
      //   break;
      case "pipe":
        img.dataset.imageType = "pipe";
        switch (buildingDirection) {
          case 0:
            img.src = "/img/conveyors/pipeModelTop.png";
            break;
          case 1:
            img.src = "/img/conveyors/pipeModelRight.png";
            break;
          case 2:
            img.src = "/img/conveyors/pipeModelBottom.png";
            break;
          case 3:
            img.src = "/img/conveyors/pipeModelLeft.png";
            break;
        }
        break;
      case "fluidSplitter":
        img.dataset.imageType = "pipe";
        switch (buildingDirection) {
          case 0:
            img.src = "/img/buildings/fluidSplitterModel.png";
            break;
          case 1:
            img.src = "/img/buildings/fluidSplitterModel.png";
            break;
          case 2:
            img.src = "/img/buildings/fluidSplitterModel.png";
            break;
          case 3:
            img.src = "/img/buildings/fluidSplitterModel.png";
            break;
        }
        break;
      default:
        img.src = "/img/buildings/noModel.png";
        break;
    }
    this.tile.appendChild(img);
  }

  addPipeDirection() {
    const img = this.tile.querySelector(`[data-image-type="pipe"]`);

    this.tileData.undergroundType = "pipe";
    this.tileData.fluidAmount = 0;
    switch (this.direction) {
      case 0:
        this.tileData.pipeDirection = "up";
        this.moveItem(targetTile, this.findTopTile(), "pipe");
        img.classList.add(`${this.name}Up`);
        break;
      case 1:
        this.tileData.pipeDirection = "right";
        this.moveItem(targetTile, this.findRightTile(), "pipe");
        img.classList.add(`${this.name}Right`);
        break;
      case 2:
        this.tileData.pipeDirection = "down";
        this.moveItem(targetTile, this.findBottomTile(), "pipe");
        img.classList.add(`${this.name}Down`);
        break;
      case 3:
        this.tileData.pipeDirection = "left";
        this.moveItem(targetTile, this.findLeftTile(), "pipe");
        img.classList.add(`${this.name}Left`);
        break;
    }
  }
  moveItem(exporter, importer, wayOfMoving) {
    let currentItem;
    switch (wayOfMoving) {
      case "conveyor":
        const conveyorIntervalId = setInterval(() => {
          switch (exporter.dataset.buildingType) {
            case "conveyor":
            case "connector":
            case "storage":
            case "splitter":
              currentItem = exporter.dataset.itemType;
              break;
            case "mineshaft":
            case "smelter":
            case "oreProcessing":
              currentItem = exporter.dataset.itemTypeOutput;
              break;
          }
          //CONVEYOR TO CONVEYOR
          if (
            importer.dataset.buildingType == "conveyor" &&
            exporter.dataset.buildingType != "splitter" &&
            exporter.dataset.buildingCategory != "inOut" &&
            exporter.dataset.itemAmount > 0 &&
            importer.dataset.itemAmount == 0
          ) {
            this.move(importer, exporter, currentItem);
            if (exporter.dataset.itemAmount == 0) {
              exporter.dataset.itemType = "none";
            }

            //CONVEYOR TO CONNECTOR
          } else if (
            (importer.dataset.buildingType == "connector" ||
              importer.dataset.buildingType == "splitter") &&
            exporter.dataset.buildingType == "conveyor" &&
            exporter.dataset.itemAmount > 0
          ) {
            importer.dataset.itemAmount++;
            importer.dataset.itemType = currentItem;
            if (
              exporter.dataset.buildingCategory == "inOut" &&
              exporter.dataset.itemAmountOutput > 0
            ) {
              exporter.dataset.itemAmountOutput--;
            } else if (exporter.dataset.buildingCategory != "inOut") {
              exporter.dataset.itemAmount--;
            }
            if (exporter.dataset.itemAmount == 0) {
              exporter.dataset.itemType = "none";
            }
            //BUILDING TO CONNECTOR
          } else if (
            importer.dataset.buildingType == "connector" &&
            (exporter.dataset.buildingCategory == "Out" ||
              exporter.dataset.buildingCategory == "inOut")
          ) {
            let newExporter = findMainTile(exporter);
            if (newExporter.dataset.itemAmountOutput > 0) {
              importer.dataset.itemAmount++;
              importer.dataset.itemType = newExporter.dataset.itemTypeOutput;
              newExporter.dataset.itemAmountOutput--;
            }

            //CONNECTOR TO BUILDING
          } else if (
            exporter.dataset.buildingType == "connector" &&
            exporter.dataset.itemAmount > 0 &&
            (importer.dataset.buildingCategory == "inOut" ||
              importer.dataset.buildingType == "storage")
          ) {
            let newImporter = findMainTile(importer);
            this.move(newImporter, exporter, currentItem);
            //CONNECTOR TO STORAGE
          } else if (
            importer.dataset.buildingType == "connector" &&
            exporter.dataset.buildingType == "storage" &&
            exporter.dataset.itemAmount > 0
          ) {
            this.move(importer, exporter, currentItem);

            //CONNECTOR TO ASSEMBLER
          } else if (
            importer.dataset.buildingType == "assembler" &&
            exporter.dataset.buildingType == "connector" &&
            exporter.dataset.itemAmount > 0
          ) {
            let newImporter = findMainTile(importer);
            if (
              !newImporter.dataset.firstMatName ||
              newImporter.dataset.firstMatName == currentItem
            ) {
              newImporter.dataset.firstMatAmount++;
              newImporter.dataset.firstMatName = currentItem;
              exporter.dataset.itemAmount--;
            } else if (
              !newImporter.dataset.secondMatName ||
              newImporter.dataset.secondMatName == currentItem
            ) {
              newImporter.dataset.secondMatAmount++;
              newImporter.dataset.secondMatName = currentItem;
              exporter.dataset.itemAmount--;
            }
          }
        }, 1000);
        exporter.dataset.intervalId = conveyorIntervalId;
        break;
      //PIPE
      case "pipe":
        setInterval(() => {
          if (
            exporter.dataset.fluidAmount > 0 &&
            importer.dataset.fluidAmount < 10 &&
            importer.dataset.undergroundType == "pipe"
          ) {
            importer.dataset.fluidType = exporter.dataset.fluidType;
            importer.dataset.fluidAmount++;
            exporter.dataset.fluidAmount--;
          } else if (
            exporter.dataset.fluidAmount > 0 &&
            importer.dataset.fluidAmount < 10 &&
            importer.dataset.upgradeType == "Washer"
          ) {
            let newImporter = findMainTile(importer);
            newImporter.dataset.fluidType = exporter.dataset.fluidType;
            newImporter.dataset.fluidAmount++;
            exporter.dataset.fluidAmount--;
            console.log(newImporter);
            console.log(importer);
          }
        }, 500);
        break;
    }
  }
  move(importer, exporter, currentItem) {
    importer.dataset.itemAmount++;
    importer.dataset.itemType = currentItem;
    exporter.dataset.itemAmount--;
  }

  tilesOccupation(xSize, zSize) {
    let occupiedTiles = [];
    for (let i = 0; i < xSize; i++) {
      for (let j = 0; j < zSize; j++) {
        const currentTile = document.getElementById(`${this.x + i}.${this.z + j}`);
        currentTile.dataset.type = this.tileData.type;
        currentTile.dataset.buildingType = this.tileData.buildingType;
        currentTile.dataset.buildingId = this.tileData.buildingId;
        currentTile.dataset.buildingCategory = this.tileData.buildingCategory;
        occupiedTiles.push(currentTile);
      }
    }
    const clickArea = document.createElement("div");
    clickArea.style.height = `${xSize * 40}px`;
    clickArea.style.width = `${zSize * 40}px`;
    clickArea.classList.add("clickArea");
    this.tile.appendChild(clickArea);
    return clickArea;
  }

  itemProcessingOneMaterial(tile, menu, { materialAmount, productName, productAmount }) {
    const tileData = tile.dataset;
    let progressBarAnimation;
    let processItemStarted = false;
    let updatedProductTime;
    function processItem() {
      updatedProductTime = tileData.productionTime;
      if (!processItemStarted && tileData.itemAmount >= materialAmount) {
        processItemStarted = true;
        progressBarAnimation = moveProgressBar(menu, updatedProductTime, processItem);
        if (progressBarAnimation.width == 0) {
          tileData.itemAmount -= materialAmount;
          setTimeout(() => {
            tileData.itemAmountOutput = String(
              parseFloat(tileData.itemAmountOutput) + productAmount
            );
            tileData.itemTypeOutput = productName;
            processItemStarted = false;
          }, updatedProductTime);
        } else {
          progressBarAnimation.stop();
        }
      }
    }

    let productionInterval = setInterval(processItem, updatedProductTime / 100);
    this.tileData.intervalId = productionInterval;
  }
  itemProcessingTwoMaterial(
    tile,
    menu,
    { firstMatName, firstMatAmount, secondMatName, secondMatAmount, productName, productAmount }
  ) {
    const tileData = tile.dataset;
    let progressBarAnimation;
    let processItemStarted = false;
    let updatedProductTime;

    function processItem() {
      updatedProductTime = tileData.productionTime;
      if (
        !processItemStarted &&
        tileData.firstMatName == firstMatName &&
        tileData.secondMatName == secondMatName &&
        tileData.firstMatAmount >= firstMatAmount &&
        tileData.secondMatAmount >= secondMatAmount
      ) {
        assemblying();
      } else if (
        !processItemStarted &&
        tileData.firstMatName == secondMatName &&
        tileData.secondMatName == firstMatName &&
        tileData.firstMatAmount >= secondMatAmount &&
        tileData.secondMatAmount >= firstMatAmount
      ) {
        assemblying();
      }
    }
    let productionInterval = setInterval(processItem, updatedProductTime / 100);
    tileData.intervalId = productionInterval;

    function assemblying() {
      processItemStarted = true;
      progressBarAnimation = moveProgressBar(menu, updatedProductTime, processItem);
      if (progressBarAnimation.width == 0) {
        tileData.firstMatAmount -= firstMatAmount;
        tileData.secondMatAmount -= secondMatAmount;
        setTimeout(() => {
          tileData.itemAmountOutput = String(parseFloat(tileData.itemAmountOutput) + productAmount);
          tileData.itemTypeOutput = productName;
          processItemStarted = false;
        }, updatedProductTime);
      } else {
        progressBarAnimation.stop();
      }
    }
  }

  createMenu(className, menuData, idName, clickArea, buildingData) {
    let targetMenuId;
    let targetTile = this.findTargetTile();
    switch (menuData) {
      case "mineshaft":
        targetMenuId = mineshaftMenuId++;
        break;
      case "ore-processing":
        targetMenuId = oreProcessingMenuId++;
        break;
      case "smelter":
        targetMenuId = smelterMenuId++;
        break;
      case "assembler":
        targetMenuId = assemblerMenuId++;
        break;
      case "storage":
        targetMenuId = storageMenuId++;
        break;
      case "cargo-station":
        targetMenuId = cargoStationMenuId++;
        break;
    }
    new className(targetTile, idName).menuCreation(buildingData);
    let menu = document.querySelector(`[data-${menuData}-id="${targetMenuId}"]`);
    clickArea.addEventListener("click", () => {
      if (currentTool != "demolition" && !menuOpened && !undergroundOpened) {
        menu.style.display = "flex";
        targetTile.children[0].classList.add("hidden");
        resetGhost();
        document.addEventListener("click", cameraMoveCenter);
        targetTile.querySelector(".clickArea").style.pointerEvents = "none";
        menuOpened = true;
        switchUpgrades();
      }
    });
    return menu;
  }
}

function findMainTile(building) {
  let currentId = building.dataset.buildingId;
  let allBuildingTiles = document.querySelectorAll(`[data-building-id="${currentId}"]`);
  return Array.from(allBuildingTiles).find(
    (tile) => tile.dataset.itemAmount || tile.dataset.itemAmountOutput
  );
}
