class Building {
  constructor(targetTile, type) {
    Object.assign(this, findTarget);
    Object.assign(this, ocupieTiles);
    this.type = type;
    this.tile = targetTile;
  }
  getId(id) {
    this.id = id.split(["."]);
    this.x = parseInt(this.id[0]);
    this.z = parseInt(this.id[1]);
  }
  createBuilding() {
    this.tileData = this.tile.dataset;
    console.log(`Строится ${this.name}`);
    const building = document.getElementById(`${this.x}.${this.z}`);

    const buildingCategories = {
      inOut1: ["oreProcessing", "brickFactory", "steelFoundry"],
      inOut2: ["assembler", "cementPlant", "glassFactory"],
      inOut3: ["concretePlant", "ironFoundry"],
      Out: ["mineshaft", "quarry"],
      In: ["powerPlant"],
      conveyor: ["conveyor", "connector", "splitter", "undergroundConveyor"],
      storage: ["mediumStorage", "smallStorage"],
    };

    building.dataset.type = this.tileData.type === "transportation" ? "transportation" : "building";
    building.dataset.mainTile = "true";

    for (const category in buildingCategories) {
      if (buildingCategories[category].includes(this.name)) {
        building.dataset.buildingCategory = category;
        break;
      }
    }

    building.dataset.buildingType = this.name;
    building.dataset.buildingId = buildingId++;
    handleMouseLeave();

    const buildingInfo = findBldObjInList(this.tileData.buildingType);
    const energyConsumption = buildingInfo.energyConsumption;
    energyConsumption ? (this.tileData.energyConsumption = false) : "";
  }
  createBuildingImage(isUpgrade) {
    this.tileData = this.tile.dataset;
    const img = document.createElement("img");
    if (isUpgrade) {
      img.dataset.imageType = "upgrade";
    } else {
      img.dataset.imageType = this.tileData.buildingType;
      img.dataset.mainBuildingImg = true;
    }
    const buidlingImg = allBuildings.find((bld) => bld.name == this.name);
    if (this.tileData.buildingCategory == "conveyor") {
      console.log(buidlingImg);
      img.src = buidlingImg.imageSrc[buildingDirection];
      img.dataset.imageType = this.name;
    } else if (this.name == "pipe") {
      img.dataset.imageType = this.name;
    } else img.src = `/img/buildings/${this.name}.webp`;

    this.tile.appendChild(img);
    img.style.zIndex = this.x + this.z;
    this.tileData.buildingCategory == "conveyor" ? img.style.zIndex-- : "";
    return img;
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

    //Process loop
    function processItem() {
      updatedProductTime = tileData.productionTime;
      const isWaterNeeded = materials.isWaterNeeded;
      if (isWaterNeeded) tileData.waterRequired = "true";

      if (
        !processItemStarted &&
        tileData.itemAmount >= materials.res1Amount &&
        (!isWaterNeeded || (isWaterNeeded && tileData.fluidType == "water"))
      ) {
        createSmoke(tile);
        energyUsing(tile, "on");
        processItemStarted = true;
        progressBarAnimation = moveProgressBar(menu, updatedProductTime, processItem);
        if (progressBarAnimation.width == 0) {
          tileData.itemAmount -= materials.res1Amount;
          setTimeout(() => {
            energyUsing(tile, "off");
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
      const isWaterNeeded = materials.isWaterNeeded;
      if (isWaterNeeded) tileData.waterRequired = "true";

      if (
        isTileDataValid(tileData, res1Name, res1Amount, res2Name, res2Amount) ||
        (isTileDataValid(tileData, res2Name, res2Amount, res1Name, res1Amount) &&
          (!isWaterNeeded || (isWaterNeeded && tileData.fluidType == "water")))
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
    const { res1Name, res1Amount, res2Name, res2Amount, res3Name, res3Amount, time, prodAmount } = materials;
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

        const isWaterNeeded = materials.isWaterNeeded;
        if (isWaterNeeded) tileData.waterRequired = "true";
        if (
          allItemsMatch &&
          processItemStarted == false &&
          (!isWaterNeeded || (isWaterNeeded && tileData.fluidType == "water"))
        ) {
          assemblying();
        }
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
    const targetTile = this.findTargetTile();
    const classMenu = new className(targetTile, idName);
    classMenu.menuCreation(buildingData);
    const menu = document.querySelector(`[data-menu-type="${menuData}"][data-menu-id="${idName}"]`);

    clickArea.addEventListener("click", () => {
      if (currentTool != "demolition" && !undergroundOpened) {
        playMenuOpenSound(menuData);
        menu.classList.remove("hidden");
        resetGhost();
        // document.addEventListener("click", cameraMoveCenter);
        classMenu.menuOpened = true;
        if (!allOpenedMenu.includes(menu)) allOpenedMenu.push(menu);
      }
    });
    return menu;
  }
}

function energyUsing(tile, action) {
  const energyAmountSpan = document.querySelector(".energyAmount");
  const buildingInfo = findBldObjInList(tile.dataset.buildingType);
  const energyConsumption = buildingInfo.energyConsumption;
  switch (action) {
    case "on":
      //Power Plant
      if (tile.dataset.energyInNetwork == "false") {
        totalEnergy += tile.dataset.buildingState == "Working" ? 4 : 0;
        energyAmountSpan.textContent = `${totalEnergy} kW`;
        tile.dataset.energyInNetwork = "true";
      }
      //Buildings
      if (tile.dataset.energyConsumption == "false") {
        totalEnergy -= energyConsumption;
        energyAmountSpan.textContent = `${totalEnergy} kW`;
        tile.dataset.energyConsumption = "true";
      }
      break;

    case "off":
      //Power Plant
      if (tile.dataset.energyInNetwork == "true") {
        totalEnergy -= 4;
        energyAmountSpan.textContent = `${totalEnergy} kW`;
        tile.dataset.energyInNetwork = "false";
      }
      //Buildings
      if (tile.dataset.energyConsumption == "true") {
        console.log("stop");
        totalEnergy += energyConsumption;
        energyAmountSpan.textContent = `${totalEnergy} kW`;
        tile.dataset.energyConsumption = "false";
      }
      break;
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
