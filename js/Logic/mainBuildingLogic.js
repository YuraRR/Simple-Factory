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
    if (this.name == "pipe") {
      switch (this.name) {
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
      }
    } else {
      img.src = `/img/buildings/${this.name}.png`;
    }
    this.tile.appendChild(img);
  }

  addPipeDirection(targetTile) {
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
    const importData = importer.dataset;
    const exportData = exporter.dataset;
    switch (wayOfMoving) {
      case "conveyor":
        const conveyorIntervalId = setInterval(() => {
          switch (exportData.buildingType) {
            case "conveyor":
            case "connector":
            case "storage":
            case "splitter":
              currentItem = exportData.itemType;
              break;
            case "mineshaft":
            case "smelter":
            case "oreProcessing":
              currentItem = exportData.itemTypeOutput;
              break;
          }
          //CONVEYOR TO CONVEYOR
          if (
            importData.buildingType == "conveyor" &&
            exportData.buildingType != "splitter" &&
            exportData.buildingCategory != "inOut" &&
            exportData.itemAmount > 0 &&
            importData.itemAmount == 0
          ) {
            this.move(importer, exporter, currentItem);
            if (exportData.itemAmount == 0) {
              exportData.itemType = "none";
            }

            //CONVEYOR TO CONNECTOR
          } else if (
            (importData.buildingType == "connector" || importData.buildingType == "splitter") &&
            exportData.buildingType == "conveyor" &&
            exportData.itemAmount > 0
          ) {
            importData.itemAmount++;
            importData.itemType = currentItem;
            if (exportData.buildingCategory == "inOut" && exportData.itemAmountOutput > 0) {
              exportData.itemAmountOutput--;
            } else if (exportData.buildingCategory != "inOut") {
              exportData.itemAmount--;
            }
            if (exportData.itemAmount == 0) {
              exportData.itemType = "none";
            }
            //BUILDING TO CONNECTOR
          } else if (
            importData.buildingType == "connector" &&
            (exportData.buildingCategory == "Out" || exportData.buildingCategory == "inOut")
          ) {
            let newExporter = findMainTile(exporter);
            if (newExporter.dataset.itemAmountOutput > 0) {
              importData.itemAmount++;
              importData.itemType = newExporter.dataset.itemTypeOutput;
              newExporter.dataset.itemAmountOutput--;
            }

            //CONNECTOR TO BUILDING
          } else if (
            exportData.buildingType == "connector" &&
            exportData.itemAmount > 0 &&
            (importData.buildingCategory == "inOut" || importData.buildingType == "storage")
          ) {
            let newImporter = findMainTile(importer);
            this.move(newImporter, exporter, currentItem);
            //CONNECTOR TO STORAGE
          } else if (
            importData.buildingType == "connector" &&
            exportData.buildingType == "storage" &&
            exportData.itemAmount > 0
          ) {
            this.move(importer, exporter, currentItem);

            //CONNECTOR TO ASSEMBLER
          } else if (
            importData.buildingType == "assembler" &&
            exportData.buildingType == "connector" &&
            exportData.itemAmount > 0
          ) {
            let newImporter = findMainTile(importer);
            if (
              !newImporter.dataset.firstMatName ||
              newImporter.dataset.firstMatName == currentItem
            ) {
              newImporter.dataset.firstMatAmount++;
              newImporter.dataset.firstMatName = currentItem;
              exportData.itemAmount--;
            } else if (
              !newImporter.dataset.secondMatName ||
              newImporter.dataset.secondMatName == currentItem
            ) {
              newImporter.dataset.secondMatAmount++;
              newImporter.dataset.secondMatName = currentItem;
              exportData.itemAmount--;
            }
          }
        }, 1000);
        exportData.intervalId = conveyorIntervalId;
        break;
      //PIPE
      case "pipe":
        setInterval(() => {
          if (
            exportData.fluidAmount > 0 &&
            importData.fluidAmount < 10 &&
            importData.undergroundType == "pipe"
          ) {
            importData.fluidType = exportData.fluidType;
            importData.fluidAmount++;
            exportData.fluidAmount--;
          } else if (
            exportData.fluidAmount > 0 &&
            importData.fluidAmount < 10 &&
            importData.upgradeType == "Washer"
          ) {
            let newImporter = findMainTile(importer);
            newImporter.dataset.fluidType = exportData.fluidType;
            newImporter.dataset.fluidAmount++;
            exportData.fluidAmount--;
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
        if (this.tileData.buildingCategory) {
          currentTile.dataset.buildingCategory = this.tileData.buildingCategory;
        }

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
    console.log(tile);
    const tileData = tile.dataset;
    let progressBarAnimation;
    let processItemStarted = false;
    let updatedProductTime;
    function processItem() {
      updatedProductTime = tileData.productionTime;
      if (!processItemStarted && tileData.itemAmount >= materialAmount) {
        createSmoke(tile);
        processItemStarted = true;
        progressBarAnimation = moveProgressBar(menu, updatedProductTime, processItem);
        if (progressBarAnimation.width == 0) {
          tileData.itemAmount -= materialAmount;
          setTimeout(() => {
            if (tileData.itemAmount <= materialAmount) deleteSmoke(tile);
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
    (tile) =>
      tile.dataset.itemAmount ||
      tile.dataset.itemAmountOutput ||
      tile.dataset.buildingType == "tradingTerminal"
  );
}
