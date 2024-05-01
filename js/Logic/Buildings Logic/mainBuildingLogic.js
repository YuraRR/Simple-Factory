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

    if (this.name != "pipe") {
      building.dataset.type = this.tileData.type === "transportation" ? "transportation" : "building";
      building.dataset.mainTile = "true";
    }
    const buildingObj = findBldObjInList(this.name);
    const isWaterNeeded = buildingObj.isWaterNeeded;
    isWaterNeeded && (this.tile.dataset.waterRequired = "true");
    const isEnergyNeeded = buildingObj.energyConsumption;
    isEnergyNeeded && (this.tile.dataset.energyRequired = "true");

    for (const category in buildingCategories) {
      if (buildingCategories[category].includes(this.name)) {
        building.dataset.buildingCategory = category;
        break;
      }
    }

    handleMouseLeave();

    if (this.name != "pipe") {
      building.dataset.buildingId = buildingId++;
      building.dataset.buildingType = this.name;
      const buildingInfo = findBldObjInList(this.tileData.buildingType);

      if (buildingInfo.energyConsumption) {
        const energyConsumption = buildingInfo.energyConsumption;
        energyConsumption ? (this.tileData.energyConsumption = buildingInfo.energyConsumption) : "";
      }
    }
  }
  createBuildingImage(lastTile = this.tile) {
    this.tileData = this.tile.dataset;
    const img = document.createElement("img");
    img.dataset.imageType = this.tileData.buildingType;
    img.dataset.mainBuildingImg = true;

    const buidlingImg = allBuildings.find((bld) => bld.name == this.name);
    if (this.tileData.buildingCategory == "conveyor" || this.tileData.buildingType == "cargoStation") {
      img.src = buidlingImg.imageSrc[buildingDirection];
      img.dataset.imageType = this.name;
    } else if (this.name == "pipe") {
      img.dataset.imageType = this.name;
    } else {
      img.src = `/img/buildings/${this.name}.webp`;
    }

    const [x, z] = findXZpos(lastTile);
    this.tile.appendChild(img);
    img.style.zIndex = x + z;
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
    const maxCapacity = 50;
    const itemAmountSpan = menu.querySelector(".productAmount");
    const itemNameSpan = menu.querySelector(".productName");

    tileData.itemTypeOutput1 = name;
    let progressBarAnimation;
    let processItemStarted = false;

    //Set images
    menu.querySelector(".productImage").src = imageSrc;

    //Process loop
    function spawnItem() {
      if (!isPaused) {
        if (!processItemStarted && tileData.itemAmountOutput1 < maxCapacity) {
          processItemStarted = true;
          progressBarAnimation = moveProgressBar(menu, materials.time, spawnItem);
          if (progressBarAnimation.width == 0) {
            setTimeout(() => {
              const itemValue = String(parseFloat(tileData.itemAmountOutput1) + materials.prodAmount);
              tileData.itemAmountOutput1 = itemValue;
              itemAmountSpan.textContent = itemValue;
              itemNameSpan.textContent = tileData.itemTypeOutput1;
              processItemStarted = false;
            }, materials.time);
          } else {
            progressBarAnimation.stop();
          }
        }
      }
    }

    let productionInterval = setInterval(spawnItem, materials.time / 100);
    this.tileData.intervalId = productionInterval;
  }

  //ONE MATERIAL PROCESSING
  itemProcessingOneMaterial(tile, menu, { name, imageSrc, materials }) {
    const tileData = tile.dataset;
    let progressBarAnimation;
    let processItemStarted = false;
    //Set images

    const materialImageSrc = findItemObjInList(materials.res1Name).imageSrc;
    menu.querySelector(".materialImage").src = materialImageSrc;
    menu.querySelector(".productImage").src = imageSrc;
    const materialAmountSpan = menu.querySelector(".materialAmount");
    const productAmountSpan = menu.querySelector(".productAmount");

    function processExtraItem() {
      if (!processItemStarted && +tileData.semiFinishedAmount >= materials.res1Amount) {
        processItemStarted = true;
        progressBarAnimation = moveProgressBar(menu, materials.time, processExtraItem);
        if (progressBarAnimation.width == 0) {
          tileData.semiFinishedAmount -= materials.res1Amount;
          materialAmountSpan.textContent = tileData.semiFinishedAmount;
          const productSpan = menu.parentElement.previousElementSibling.querySelector(".productAmount");
          productSpan.textContent = tileData.semiFinishedAmount;
          setTimeout(() => {
            let outputAmount, outputType;
            for (let i = 1; i <= 3; i++) {
              if (!tileData[`itemTypeOutput${i}`] || tileData[`itemTypeOutput${i}`] == name) {
                outputAmount = `itemAmountOutput${i}`;
                outputType = `itemTypeOutput${i}`;
                break;
              }
            }
            tileData[outputAmount] = String(parseFloat(tileData[outputAmount]) + materials.prodAmount);
            tileData[outputType] = name;
            productAmountSpan.textContent = tileData[outputAmount];

            processItemStarted = false;
          }, materials.time);
        } else {
          progressBarAnimation.stop();
        }
      }
    }

    setInterval(processExtraItem, materials.time / 100);
  }

  itemProcessingMaterial(tile, menu, recipeObj) {
    let { name, producedIn } = recipeObj;
    const tileData = tile.dataset;
    let processItemStarted = false;
    const materials = tileData.buildingType == producedIn ? recipeObj.materials : recipeObj.materials2;
    recipeObj.type == "altRecipe" ? (name = recipeObj.itemName) : "";
    // Создаем интервал и вызываем createListToCompare
    !processItemStarted && setInterval(createListToCompare, materials.time / 10);

    function createListToCompare() {
      const materialsList = ["res1Name", "res2Name", "res3Name"];
      const itemList = materialsList.reduce((acc, propName) => {
        const materialName = materials[propName];
        if (materialName) {
          acc.push({
            name: materialName,
            amount: materials[propName.replace("Name", "Amount")],
          });
        }
        return acc;
      }, []);

      const items = [
        { name: tileData.firstMatName, amount: +tileData.firstMatAmount },
        { name: tileData.secondMatName, amount: +tileData.secondMatAmount },
        { name: tileData.thirdMatName, amount: +tileData.thirdMatAmount },
      ];
      const allItemsMatch = itemList.every((item) =>
        items.some((i) => i.name === item.name && i.amount >= item.amount)
      );

      const isWaterNeeded = tileData.waterRequired;
      const isEnergyNeeded = tileData.energyConsumption;

      if (
        allItemsMatch &&
        !processItemStarted &&
        (!isWaterNeeded || (isWaterNeeded && tileData.fluidType == "water")) &&
        (!isEnergyNeeded || (isEnergyNeeded && totalEnergy >= +tileData.energyConsumption))
      ) {
        assemblying();
      }
    }

    function assemblying() {
      console.log(processItemStarted, 2);
      createSmoke(tile);
      // createSmoke(tile, true);
      processItemStarted = true;
      let progressBarAnimation = moveProgressBar(menu, materials.time, createListToCompare);
      if (progressBarAnimation.width == 0) {
        setTimeout(() => {
          if (findItemObjInList(name).type == "semiFinished") {
            const semiFinishedAmount = String(parseFloat(tileData.semiFinishedAmount) + materials.prodAmount);
            tileData.semiFinishedAmount = semiFinishedAmount;
            tileData.semiFinishedType = name;
            const allMaterialAmounts = menu.parentElement.querySelectorAll(".factoryStructures .materialAmount");
            allMaterialAmounts.forEach((span) => (span.textContent = semiFinishedAmount));
          } else {
            tileData.itemAmountOutput1 = +tileData.itemAmountOutput1 + materials.prodAmount;
            tileData.itemTypeOutput1 = name;
          }

          processItemStarted = false;
        }, materials.time);
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

        if (menuData == "cargoStation") {
          classMenu.forceMenuUpdate(menu, buildingData);
        }
        if (!allOpenedMenu.includes(menu)) allOpenedMenu.push(menu);
      }
    });
    return menu;
  }
}
