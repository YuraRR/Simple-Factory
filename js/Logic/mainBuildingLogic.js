class Building {
  constructor(targetTile, type) {
    Object.assign(this, findTarget);
    Object.assign(this, ocupieTiles);
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
        building.dataset.mainTile = "true";

        break;
    }

    switch (this.name) {
      case "smelter":
      case "oreProcessing":
        building.dataset.buildingCategory = "inOut1";
        break;
      case "assembler":
      case "cementPlant":
        building.dataset.buildingCategory = "inOut2";
        break;
      case "mineshaft":
      case "quarry":
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
      img.dataset.mainBuildingImg = true;
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
    } else img.src = `/img/buildings/${this.name}.webp`;
    console.log(this.name);
    this.tile.appendChild(img);
    img.style.zIndex = this.x + this.z;
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
            case "cementPlant":
              currentItem = exportData.itemTypeOutput;
              break;
          }
          //CONVEYOR TO CONVEYOR
          if (
            importData.buildingType == "conveyor" &&
            exportData.buildingType != "splitter" &&
            (exportData.buildingCategory != "inOut1" || exportData.buildingCategory != "inOut2") &&
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
            if (
              (exportData.buildingCategory == "inOut1" || exportData.buildingCategory == "inOut2") &&
              exportData.itemAmountOutput > 0
            ) {
              exportData.itemAmountOutput--;
            } else if (exportData.buildingCategory == "inOut1" || exportData.buildingCategory == "inOut2") {
              exportData.itemAmount--;
            }
            if (exportData.itemAmount == 0) {
              exportData.itemType = "none";
            }
            //BUILDING TO CONNECTOR
          } else if (
            importData.buildingType == "connector" &&
            (exportData.buildingCategory == "Out" ||
              exportData.buildingCategory == "inOut1" ||
              exportData.buildingCategory == "inOut2")
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
            (importData.buildingCategory == "inOut1" || importData.buildingType == "storage")
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
            importData.buildingCategory == "inOut2" &&
            importData.buildingType == "cementPlant" &&
            exportData.buildingType == "connector" &&
            exportData.itemAmount > 0
          ) {
            let newImporter = findMainTile(importer);
            if (!newImporter.dataset.firstMatName || newImporter.dataset.firstMatName == currentItem) {
              newImporter.dataset.firstMatAmount++;
              newImporter.dataset.firstMatName = currentItem;
              exportData.itemAmount--;
            } else if (!newImporter.dataset.secondMatName || newImporter.dataset.secondMatName == currentItem) {
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
          if (exportData.fluidAmount > 0 && importData.fluidAmount < 10 && importData.undergroundType == "pipe") {
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

  createClickArea(xSize, zSize) {
    const clickArea = document.createElement("div");
    clickArea.style.height = `${xSize * 40}px`;
    clickArea.style.width = `${zSize * 40}px`;
    clickArea.classList.add("clickArea");
    this.tile.appendChild(clickArea);
    return clickArea;
  }

  //SPAWNING RESOURCES
  itemSpawningInSources(tile, menu, { name, imageSrc, materials }) {
    const tileData = tile.dataset;
    const maxCapacity = 30;
    const itemAmountSpan = menu.querySelector(".productAmount");
    const itemNameSpan = menu.querySelector(".productName");
    console.log(materials);
    tileData.productionTime = materials.time;
    tileData.itemTypeOutput = name;
    let progressBarAnimation;
    let processItemStarted = false;
    let updatedProductTime;

    //Set images
    menu.querySelector(".productImage").src = imageSrc;

    //Process loop
    function spawnItem() {
      updatedProductTime = tileData.productionTime;
      if (!processItemStarted && tileData.itemAmountOutput < maxCapacity) {
        processItemStarted = true;
        progressBarAnimation = moveProgressBar(menu, updatedProductTime, spawnItem);
        if (progressBarAnimation.width == 0) {
          setTimeout(() => {
            const itemValue = String(parseFloat(tileData.itemAmountOutput) + materials.prodAmount);
            tileData.itemAmountOutput = itemValue;
            itemAmountSpan.textContent = itemValue;
            itemNameSpan.textContent = tileData.itemTypeOutput;
            processItemStarted = false;
          }, updatedProductTime);
        } else {
          progressBarAnimation.stop();
        }
      }
    }

    let productionInterval = setInterval(spawnItem, updatedProductTime / 100);
    this.tileData.intervalId = productionInterval;
  }

  //ONE MATERIAL PROCESSING
  itemProcessingOneMaterial(tile, menu, { name, imageSrc, materials }) {
    const tileData = tile.dataset;
    let progressBarAnimation;
    let processItemStarted = false;
    let updatedProductTime;
    //Set images

    console.log(materials);
    const materialImageSrc = allItems.find((item) => item.name == materials.res1Name).imageSrc;
    menu.querySelector(".materialImage").src = materialImageSrc;
    menu.querySelector(".productImage").src = imageSrc;
    const materialAmountSpan = menu.querySelector(".materialAmount");
    const productAmountSpan = menu.querySelector(".productAmount");
    const itemNameSpan = menu.querySelector(".productName");
    //Process loop
    function processItem() {
      updatedProductTime = tileData.productionTime;
      if (!processItemStarted && tileData.itemAmount >= materials.res1Amount) {
        createSmoke(tile);
        processItemStarted = true;
        progressBarAnimation = moveProgressBar(menu, updatedProductTime, processItem);
        if (progressBarAnimation.width == 0) {
          tileData.itemAmount -= materials.res1Amount;
          setTimeout(() => {
            if (tileData.itemAmount <= materials.res1Amount) deleteSmoke(tile);

            tileData.itemAmountOutput = String(parseFloat(tileData.itemAmountOutput) + materials.prodAmount);
            tileData.itemTypeOutput = name;
            materialAmountSpan.textContent = tileData.itemAmount;
            productAmountSpan.textContent = tileData.itemAmountOutput;

            // itemNameSpan.textContent = tileData.itemTypeOutput;

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
  //TWO MATERIALS PROCESSING
  itemProcessingTwoMaterial(tile, menu, { name, imageSrc, materials }) {
    const { res1Name, res1Amount, res2Name, res2Amount, time, prodAmount } = materials;
    const tileData = tile.dataset;
    let progressBarAnimation;
    let processItemStarted = false;
    let updatedProductTime = time;
    console.log(materials);
    function processItem() {
      updatedProductTime = tileData.productionTime;

      if (
        !processItemStarted &&
        tileData.firstMatName == res1Name &&
        tileData.secondMatName == res2Name &&
        tileData.firstMatAmount >= res1Amount &&
        tileData.secondMatAmount >= res2Amount
      ) {
        assemblying();
      } else if (
        !processItemStarted &&
        tileData.firstMatName == res2Name &&
        tileData.secondMatName == res1Name &&
        tileData.firstMatAmount >= res2Amount &&
        tileData.secondMatAmount >= res1Amount
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
        tileData.firstMatAmount -= res1Amount;
        tileData.secondMatAmount -= res2Amount;
        setTimeout(() => {
          tileData.itemAmountOutput = String(parseFloat(tileData.itemAmountOutput) + prodAmount);
          tileData.itemTypeOutput = name;
          processItemStarted = false;
        }, updatedProductTime);
      } else {
        progressBarAnimation.stop();
      }
    }
  }

  //MENU CREATION
  createMenu(className, menuData, idName, clickArea, buildingData) {
    let targetMenuId;
    let targetTile = this.findTargetTile();
    switch (menuData) {
      case "mineshaft":
        targetMenuId = mineshaftMenuId++;
        break;
      case "oreProcessing":
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
      case "cargoStation":
        targetMenuId = cargoStationMenuId++;
        break;
      case "cementPlant":
        targetMenuId = cementPlantMenuId++;
        break;
      case "quarry":
        targetMenuId = quarryMenuId++;
        break;
    }

    const classMenu = new className(targetTile, idName);
    classMenu.menuCreation(buildingData);
    console.log(`[data-menu-type="${menuData}"][data-menu-id="${targetMenuId}]`);
    let menu = document.querySelector(`[data-menu-type="${menuData}"][data-menu-id="${targetMenuId}"]`);
    console.log(menu);
    clickArea.addEventListener("click", () => {
      if (currentTool != "demolition" && !undergroundOpened) {
        menu.classList.remove("hidden");
        const buildingImage = targetTile.querySelector(`[data-main-building-img="true"]`);
        buildingImage.classList.add("hidden");
        resetGhost();
        // document.addEventListener("click", cameraMoveCenter);
        targetTile.querySelector(".clickArea").style.pointerEvents = "none";
        classMenu.menuOpened = true;
        switchUpgrades();
        if (!allOpenedMenu.includes(menu)) allOpenedMenu.push(menu);
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
      tile.dataset.itemAmount || tile.dataset.itemAmountOutput || tile.dataset.buildingType == "tradingTerminal"
  );
}
