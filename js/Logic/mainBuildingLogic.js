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
    const building = document.getElementById(`${this.x}.${this.z}`);
    switch (this.name) {
      case "conveyor":
      case "connector":
      case "splitter":
      case "road":
        building.dataset.type = "transportation";
        break;
      default:
        building.dataset.type = "building";
        building.dataset.mainTile = "true";
        break;
    }

    switch (this.name) {
      case "smelter":
      case "oreProcessing":
      case "brickFactory":
        building.dataset.buildingCategory = "inOut1";
        break;
      case "assembler":
      case "cementPlant":
      case "glassFactory":
        building.dataset.buildingCategory = "inOut2";
        break;
      case "concretePlant":
        building.dataset.buildingCategory = "inOut3";
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

    if (this.tileData.type == "transportation") {
      const buidlingImg = allBuilding.find((bld) => bld.name == this.name);
      console.log(buidlingImg.imageSrc);
      img.src = buidlingImg.imageSrc[buildingDirection];
    } else if (this.name == "pipe") {
      img.dataset.imageType = "pipe";
      switch (buildingDirection) {
        case 0:
        case 2:
          img.src = "/img/pipes/vertical.png";
          break;
        case 1:
        case 3:
          img.src = "/img/pipes/horizontal.png";
          break;
      }
    } else if (this.name == "conveyor") {
      img.dataset.imageType = "conveyor";
      switch (buildingDirection) {
        case 0:
          img.src = "/img/conveyors/conveyorTop.gif";
          break;
        case 1:
          img.src = "/img/conveyors/conveyorRight.gif";
          break;
        case 2:
          img.src = "/img/conveyors/conveyorDown.gif";
          break;
        case 3:
          img.src = "/img/conveyors/conveyorLeft.gif";
          break;
      }
    } else img.src = `/img/buildings/${this.name}.webp`;

    this.tile.appendChild(img);
    img.style.zIndex = this.x + this.z;
  }

  addPipeDirection(targetTile) {
    const img = this.tile.querySelector(`[data-image-type="pipe"]`);
    this.tileData.undergroundType = "pipe";
    switch (this.direction) {
      case 0:
        this.tileData.pipeDirection = "up";
        img.classList.add(`${this.name}Up`);
        break;
      case 1:
        this.tileData.pipeDirection = "right";
        img.classList.add(`${this.name}Right`);
        break;
      case 2:
        this.tileData.pipeDirection = "down";
        img.classList.add(`${this.name}Down`);
        break;
      case 3:
        this.tileData.pipeDirection = "left";
        img.classList.add(`${this.name}Left`);
        break;
    }
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
      if (!isPaused) {
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

    const materialImageSrc = allItems.find((item) => item.name == materials.res1Name).imageSrc;
    menu.querySelector(".materialImage").src = materialImageSrc;
    menu.querySelector(".productImage").src = imageSrc;
    const materialAmountSpan = menu.querySelector(".materialAmount");
    const productAmountSpan = menu.querySelector(".productAmount");
    const itemNameSpan = menu.querySelector(".productName");
    //Process loop
    function processItem() {
      updatedProductTime = tileData.productionTime;
      const isWaterNeeded = materials.isWaterNeeded;

      if (
        !processItemStarted &&
        tileData.itemAmount >= materials.res1Amount &&
        (!isWaterNeeded || (isWaterNeeded && tileData.fluidType == "water"))
      ) {
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

      function isTileDataValid(tileData, matName1, matAmount1, matName2, matAmount2) {
        return (
          !processItemStarted &&
          tileData.firstMatName === matName1 &&
          tileData.secondMatName === matName2 &&
          parseInt(tileData.firstMatAmount, 10) >= matAmount1 &&
          parseInt(tileData.secondMatAmount, 10) >= matAmount2
        );
      }

      if (
        isTileDataValid(tileData, res1Name, res1Amount, res2Name, res2Amount) ||
        isTileDataValid(tileData, res2Name, res2Amount, res1Name, res1Amount)
      ) {
        assemblying();
      }
    }
    let productionInterval = setInterval(processItem, updatedProductTime / 100);
    tileData.intervalId = productionInterval;

    function assemblying() {
      createSmoke(tile);
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
  //TWO MATERIALS PROCESSING
  itemProcessingThreeMaterial(tile, menu, { name, imageSrc, materials }) {
    const { res1Name, res1Amount, res2Name, res2Amount, res3Name, res3Amount, waterAmount, time, prodAmount } =
      materials;
    const tileData = tile.dataset;
    let progressBarAnimation;
    let processItemStarted = false;
    let updatedProductTime = time;

    function processItem() {
      updatedProductTime = tileData.productionTime;

      createListToCompare();

      function createListToCompare() {
        const itemList = [res1Name, res1Amount, res2Name, res2Amount, res3Name, res3Amount];
        let recipeList = [];
        for (let i = 0; i < itemList.length; i += 2) {
          const itemInfo = {
            name: itemList[i],
            amount: itemList[i + 1],
          };
          recipeList.push(itemInfo);
        }
        const items = [
          {
            name: tileData.firstMatName,
            amount: +tileData.firstMatAmount,
          },
          {
            name: tileData.secondMatName,
            amount: +tileData.secondMatAmount,
          },
          {
            name: tileData.thirdMatName,
            amount: +tileData.thirdMatAmount,
          },
        ];
        const allItemsMatch = recipeList.every((item) =>
          items.some((i) => i.name === item.name && i.amount >= item.amount)
        );
        if (allItemsMatch && processItemStarted == false) assemblying();
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
        tileData.thirdMatAmount -= res3Amount;
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
    let targetTile = this.findTargetTile();
    const classMenu = new className(targetTile, idName);
    classMenu.menuCreation(buildingData);
    console.log(`[data-menu-type="${menuData}"][data-menu-id="${idName}"]`);
    const menu = document.querySelector(`[data-menu-type="${menuData}"][data-menu-id="${idName}"]`);

    clickArea.addEventListener("click", () => {
      if (currentTool != "demolition" && !undergroundOpened) {
        menu.classList.remove("hidden");
        resetGhost();
        // document.addEventListener("click", cameraMoveCenter);
        classMenu.menuOpened = true;
        switchUpgrades();
        if (!allOpenedMenu.includes(menu)) allOpenedMenu.push(menu);
      }
    });
    return menu;
  }
}

function findMainTile(building) {
  const currentId = building.dataset.buildingId;
  const allBuildingTiles = document.querySelectorAll(`[data-building-id="${currentId}"]`);
  return Array.from(allBuildingTiles).find(
    (tile) =>
      tile.dataset.itemAmount || tile.dataset.itemAmountOutput || tile.dataset.buildingType == "tradingTerminal"
  );
}
