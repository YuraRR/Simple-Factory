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
    allBuildingsList.push(this.tile);
    handleMouseLeave();

    if (this.name != "pipe") {
      building.dataset.buildingId = buildingId++;
      building.dataset.buildingType = this.name;
      const buildingInfo = findBldObjInList(this.tileData.buildingType);
      if (buildingInfo.energyConsumption) {
        const energyConsumption = buildingInfo.energyConsumption;
        energyConsumption ? (this.tileData.energyConsumption = buildingInfo.energyConsumption) : "";
        addIndicators(this.tile);
      }
    }

    function addIndicators(tile) {
      const htmlContent = `          
      <div class="bldIndicatorsBlock">
        <img src="./img/resourcesIcons/water.png" class = "waterImage ${!isWaterNeeded ? "hidden" : ""}"/>
        <img src="./img/resourcesIcons/energy.png" class = "energyImage ${
          totalEnergy >= buildingObj.energyConsumption ? "hidden" : ""
        }"/>
      </div>`;
      tile.insertAdjacentHTML("beforeend", htmlContent);
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
      img.src = `./img/buildings/${this.name}.webp`;
    }

    const [x, z] = findXZpos(lastTile);
    this.tile.appendChild(img);
    const buildingZindex = this.tileData.buildingCategory != "transportation" ? 1 : 0;
    img.style.zIndex = x + z + buildingZindex;
    return img;
  }
  updateGlobalAmount() {
    const storageObj = storageResources.find((storage) => storage.id == this.tile.dataset.buildingId);
    observeDatasetChange(this.tile, "item-amount-output1", update.bind(this));
    observeDatasetChange(this.tile, "item-type-output1", update.bind(this));
    function update() {
      storageObj.resName = this.tile.dataset.itemTypeOutput1;
      storageObj.resAmount = +this.tile.dataset.itemAmountOutput1;
      updateStorageResources();
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
    const maxCapacity = 50;
    const itemAmountSpan = menu.querySelector(".productAmount");
    const itemNameSpan = menu.querySelector(".productName");

    tileData.itemTypeOutput1 = name;
    let progressBarAnimation;
    let processItemStarted = false;
    const isEnergyNeeded = tileData.energyConsumption;
    //Set images
    menu.querySelector(".productImage").src = imageSrc;

    //Process loop
    function spawnItem() {
      if (isPaused) return;
      if (
        !processItemStarted &&
        tileData.itemAmountOutput1 < maxCapacity &&
        (!isEnergyNeeded || (isEnergyNeeded && totalEnergy >= +tileData.energyConsumption))
      ) {
        processItemStarted = true;
        progressBarAnimation = moveProgressBar(menu, materials.time, spawnItem);
        if (progressBarAnimation.width == 0) {
          deltaTimeout(() => {
            const itemValue = String(
              parseFloat(tileData.itemAmountOutput1) + materials.prodAmount * tileData.itemsMultiplier
            );
            tileData.itemAmountOutput1 = itemValue;
            itemAmountSpan.textContent = itemValue;
            itemNameSpan.textContent = tileData.itemTypeOutput1;
            processItemStarted = false;
            displayInfo();
          }, materials.time);
        } else {
          progressBarAnimation.stop();
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
          deltaTimeout(() => {
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
            const itemProdObj = itemsProduced.find((item) => item.name == name);
            itemProdObj.totalAmount += materials.prodAmount;
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
    let { name } = recipeObj;
    const tileData = tile.dataset;
    tileData.processItemStarted = "false";
    const materials = recipeObj.materials;
    recipeObj.isAltRecipe == true ? (name = recipeObj.itemName) : "";
    if (tileData.processItemStarted == "false") {
      tileData.intervalId = setInterval(createListToCompare, materials.time / 10);
    }

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
        { name: tileData.materialName1, amount: +tileData.materialAmount1, num: 1, type: "materialAmount1" },
        { name: tileData.materialName2, amount: +tileData.materialAmount2, num: 2, type: "materialAmount2" },
        { name: tileData.materialName3, amount: +tileData.materialAmount3, num: 3, type: "materialAmount3" },
      ];
      const allItemsMatch = itemList.every((item) =>
        items.some((i) => i.name === item.name && i.amount >= item.amount)
      );

      const isWaterNeeded = tileData.waterRequired;
      const isEnergyNeeded = tileData.energyConsumption;
      const isEnoughSpace = +tile.dataset.itemAmountOutput1 + materials.prodAmount <= 50;
      if (
        allItemsMatch &&
        tileData.processItemStarted == "false" &&
        isEnoughSpace &&
        (!isWaterNeeded || (isWaterNeeded && tileData.fluidType == "water")) &&
        (!isEnergyNeeded || (isEnergyNeeded && totalEnergy >= +tileData.energyConsumption))
      ) {
        assemblying(items);
      }
    }

    function assemblying(items) {
      tileData.processItemStarted = "true";

      playAmbientSound(tile, "factory");
      createSmoke(tile);
      createSmoke(tile, true);
      energyUsing(tile, "on");

      let progressBarAnimation = moveProgressBar(menu, materials.time, createListToCompare);
      if (progressBarAnimation.width == 0) {
        for (const item in items) {
          const itemData = items[item];
          tileData[itemData.type] -= materials[`res${itemData.num}Amount`];
        }

        setTimeout(() => {
          if (findItemObjInList(name).type == "semiFinished" && tileData.semiFinishedType == name) {
            const semiFinishedAmount = +tileData.semiFinishedAmount + materials.prodAmount;
            tileData.semiFinishedAmount = semiFinishedAmount;
            tileData.semiFinishedType = name;
            const allMaterialAmounts = menu.parentElement.querySelectorAll(".factoryStructures .materialAmount");
            allMaterialAmounts.forEach((span) => (span.textContent = semiFinishedAmount));
          } else if (tileData.itemTypeOutput1 == name) {
            tileData.itemAmountOutput1 = +tileData.itemAmountOutput1 + materials.prodAmount;
            tileData.itemTypeOutput1 = name;
            const itemProdObj = itemsProduced.find((item) => item.name == name);
            itemProdObj.totalAmount += materials.prodAmount;
          }

          tileData.processItemStarted = "false";
          deleteSmoke(tile);
          energyUsing(tile, "off");
          displayInfo();
        }, materials.time);
      } else {
        progressBarAnimation.stop();
      }
    }
  }

  //MENU CREATION
  createMenu(matAmount, menuData, id, clickArea, buildingData) {
    const targetTile = this.findTargetTile();
    let classMenu;
    switch (matAmount) {
      case "source":
        classMenu = new SourceBuildingsMenu(targetTile, id, matAmount);
        break;
      case "storage":
        classMenu = new StorageBuildingsMenu(targetTile, id, matAmount);
        break;
      case "source":
        classMenu = new SourceBuildingsMenu(targetTile, id, matAmount);
        break;
      case "station":
        classMenu = new CargoStationMenu(targetTile, id, matAmount);
        break;
      case "garage":
        classMenu = new GarageMenu(targetTile, id, matAmount);
        break;
      default:
        classMenu = new BuildingMenu(targetTile, id, matAmount);
    }

    classMenu.menuCreation(buildingData);

    const menu = document.querySelector(`[data-menu-type="${menuData}"][data-menu-id="${id}"]`);
    clickArea.parentElement.dataset.idByType = id;
    clickArea.addEventListener("click", () => {
      if (currentTool != "demolition" && !undergroundOpened) {
        playMenuOpenSound(menuData);
        menu.classList.remove("hidden");
        resetGhost();
        // document.addEventListener("click", cameraMoveCenter);
        classMenu.menuOpened = true;

        // if (menuData == "cargoStation") {
        //   classMenu.forceMenuUpdate(menu, buildingData);
        // }
        if (!allOpenedMenu.includes(menu)) allOpenedMenu.push(menu);
      }
    });
    return menu;
  }
}
