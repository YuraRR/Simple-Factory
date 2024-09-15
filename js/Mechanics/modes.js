//DEMOLITION
function demolitionFunc(event) {
  const tile = event.target.classList.contains("clickArea") ? event.target.parentNode : event.target;
  tile && deleteAllInTile(tile, false);
}
function deleteAllInTile(currentTile, isDeleteItem) {
  const currentId = currentTile.dataset.buildingId;
  const allTilesToDelete = document.querySelectorAll(`[data-building-id="${currentId}"]`);
  const menu = document.querySelector(`[data-parent-tile-id="${currentTile.id}"]`);

  currentTile.dataset.featuresType && deleteNatureFeature();
  currentTile.dataset.buildingType == "cargoStation" && deleteCargoStation(currentTile);
  deleteBuilding();

  function deleteNatureFeature() {
    currentTile.querySelector("img") && currentTile.querySelector("img").remove();
    if (!isDeleteItem && currentTile.dataset.featuresType != "bush") {
      const groundItemImg = document.createElement("img");
      currentTile.appendChild(groundItemImg);
      const [x, z] = findXZpos(currentTile);
      groundItemImg.style.zIndex = x + z + 1;
      switch (currentTile.dataset.featuresType) {
        case "tree":
          getItemFromDemolition("Wood", "Planks", groundItemImg, 10);
          currentTile.dataset.groundType == "forest" ? reGrowthTree(currentTile) : "";
          demolitionSound("tree");
          break;
        case "rock":
          getItemFromDemolition("Stone", "Gravel", groundItemImg, 10);
          demolitionSound("rock");
          break;
        case "bigStoneRock":
          getItemFromDemolition("Stone", "Gravel", groundItemImg, 20);
          demolitionSound("rock");
          break;
      }
    } else {
      currentTile.dataset.groundType == "forest" ? reGrowthTree(currentTile) : "";
    }

    if (currentTile.dataset.featuresType == "limeStoneRock") {
      const limeTiles = document.querySelectorAll(`[data-features-type="limeStoneRock"]`);
      limeTiles.forEach((tile) => tile.removeAttribute("data-features-type"));
    }

    currentTile.removeAttribute("data-main-tile");
    currentTile.removeAttribute("data-features-type");
    currentTile.classList.remove("demolition-hover");
  }
  function getItemFromDemolition(materialType, productType, image, amount) {
    currentTile.dataset.groundItem = materialType;
    currentTile.dataset.groundItemAmount = amount;
    updateResource(image, amount);
    const dblclickHandler = () => {
      handProcessSound(materialType);
      const index = storageResources.findIndex((obj) => obj.id === currentTile.dataset.buildingId);
      storageResources.splice(index, 1);
      currentTile.dataset.groundItem = productType;
      updateResource(image, amount);
      currentTile.removeEventListener("dblclick", dblclickHandler);
    };
    currentTile.addEventListener("dblclick", dblclickHandler);
  }

  function updateResource(groundItemImg, amount) {
    if (currentTile.dataset.groundItem) {
      const itemInfo = findItemObjInList(currentTile.dataset.groundItem);
      groundItemImg.src = itemInfo.imageSrc;
      currentTile.dataset.buildingId = buildingId++;
      const storageObj = {
        id: currentTile.dataset.buildingId,
        resName: currentTile.dataset.groundItem,
        resAmount: amount,
        storageType: "ground",
      };
      storageResources.push(storageObj);
      updateStorageResources();
    }
  }
  function deleteBuilding() {
    const connectedStation = document.querySelector(`[data-connected-to-id="${currentTile.dataset.buildingId}"]`);
    if (currentTile.dataset.buildingCategory == "transportation") {
      if (allRoutesList.find((route) => route.drawRoutePointsList.find((tile) => currentTile == tile))) {
        return notyf.error("Road is used in route!");
      }
      if (currentTile.dataset.trucksInGarage > 0) {
        return notyf.error("Garage is not empty!");
      }
    }
    if (currentTile.dataset.buildingCategory == "energy") {
      totalEnergy = parseFloat(totalEnergy) - currentTile.dataset.energyProduction;
      updateEnergy();
    }
    if (connectedStation) {
      return notyf.error("Station is connected to this building. Delete station first.");
    }
    currentTile.dataset.buildingType && getResFromBldDemolition(currentTile);
    allTilesToDelete.forEach((tile) => {
      if (
        (tile.dataset.buildingType &&
          tile.dataset.buildingType != "mineshaft" &&
          tile.dataset.buildingType != "tradingTerminal") ||
        tile.dataset.groundItem
      ) {
        clearInterval(tile.dataset.intervalId);

        if (tile.dataset.buildingType == "conveyor") {
          const nextTile = findTargetTileByDirection(tile);
          const itemImg = document.querySelector(`[data-image-item-id="${tile.dataset.itemId}"]`);
          itemImg && itemImg.remove();
        }
        if (tile.dataset.groundItem) {
          const index = storageResources.findIndex((obj) => obj.id == tile.dataset.buildingId);
          storageResources.splice(index, 1);
        }

        for (const key in tile.dataset) {
          if (
            key != "groundType" &&
            key != "subGroundType" &&
            key != "oreType" &&
            key != "resType" &&
            key != "undergroundType" &&
            key != "fluidType"
          )
            delete tile.dataset[key];
        }
        tile.dataset.type = "empty";
        tile.className = "grid-cell";

        menu && (clearInterval(menu.dataset.updateInterval), menu.remove());

        const childsToDelete = Array.from(tile.childNodes).filter((node) => node.nodeType === Node.ELEMENT_NODE);
        childsToDelete.forEach((elem) => {
          if (elem.dataset.imageType != "pipe" || elem.dataset.pipeType == "connector") {
            tile.removeChild(elem);
            tile.removeAttribute("data-underground-type");
            tile.removeAttribute("data-fluid-type");
          }
        });

        resetTool();
        updateStorageResources();
      }
    });
  }
  function getResFromBldDemolition(tile) {
    const buildingObj = findBldObjInList(tile.dataset.buildingType);
    const buildingCost = buildingObj.cost;
    notyf.dismissAll();
    deltaTimeout(() => resBack(), 520);
    function resBack() {
      for (let itemName in buildingCost) {
        const itemObj = findItemObjInList(itemName);
        const costAmount = buildingCost[itemName];
        buildingResources[itemName] += costAmount;
        const foundStorage = storageResources.find((obj) => obj.resName == itemName);
        if (foundStorage) {
          const storageElem = document.querySelector(`[data-building-id="${foundStorage.id}"]`);
          const storageData = storageElem.dataset;
          const totalAmount = +storageData.itemAmountOutput1 + costAmount;
          if (totalAmount < storageData.storageCapacity) {
            storageData.itemAmountOutput1 = +storageData.itemAmountOutput1 + costAmount;
          } else {
            const storageOverfill = totalAmount - storageData.storageCapacity || 1;
            const sumToGet = (itemObj.price * storageOverfill) / 1.5;
            showMoneyChange(sumToGet, "plus");
            storageData.itemAmountOutput1 = storageData.storageCapacity;
            notyf.open({
              type: "smallNotyf",
              message: `${storageOverfill} ${itemName} was sold for ${sumToGet.toFixed(0)} $`,
            });
          }
        } else {
          const sumToGet = (itemObj.price * costAmount) / 1.5;
          showMoneyChange(sumToGet, "plus");

          notyf.open({
            type: "smallNotyf",
            message: `${costAmount} ${itemName} was sold for ${sumToGet.toFixed(0)} $`,
          });
        }
      }
    }
  }
  function deleteCargoStation(tile) {
    tile.dataset.routeId = tile.dataset.routeFrom = tile.dataset.routeFrom = "";
    const index = stationsList.indexOf(tile);
    stationsList.splice(index, 1);
  }
}

function reGrowthTree(currentTile) {
  const [x, z] = findXZpos(currentTile);
  const randomTime = 30000 + Math.floor(Math.random() * 27) * 5000;
  treeGrowing();

  function treeGrowing() {
    !currentTile.dataset.groundItem && !currentTile.dataset.buildingType
      ? deltaTimeout(() => new Tree(x, z).spawn("forest"), randomTime)
      : deltaTimeout(() => treeGrowing(), randomTime);
  }
}
//TRANSPERENT BUILDINGS
function transperentBuildingsShow() {
  const buildingElements = document.querySelectorAll(`[data-main-building-img="true"]`);

  buildingElements.forEach((element) => {
    const data = element.parentElement.getAttribute("data-building-category");
    data != "transportation" && data != "conveyor" ? element.classList.toggle("transperentBuilding") : "";
  });
}

//UNDERGROUND
function showUnderground() {
  const allTrees = document.querySelectorAll(`[data-image-type="natureFeature"`);
  !undergroundOpened && currentTool != "pipe" && escapeButton();
  gridContainer.classList.toggle("containerOpacity");
  const allPipes = gridContainer.querySelectorAll(`[data-image-type="pipe"]`);
  const allConnectorPipes = document.querySelectorAll(`[data-pipe-type="connector"]`);
  const allBuildings = document.querySelectorAll(`[data-main-tile="true"]`);
  allBuildings.forEach((el) => {
    const img = el.querySelector(`[data-main-building-img="true"]`);
    const clickArea = el.querySelector(".clickArea");
    if (img && img.dataset.imageType != "pipe") {
      img.classList.toggle("undergroundView");
      clickArea && clickArea.classList.toggle("noEvents");
    }
  });
  allTrees.forEach((el) => {
    el.classList.toggle("hidden");
    el.parentElement && el.parentElement.classList.toggle("hiddenPseudo");
  });
  allConnectorPipes.forEach((el) => {
    el.classList.toggle("waterConnector");
  });
  if (undergroundOpened) {
    [...allPipes].map((pipe) => pipe.classList.add("hidden"));
    undergroundOpened = false;
  } else {
    [...allPipes].map((pipe) => pipe.classList.remove("hidden"));
    undergroundOpened = true;
  }

  const allDeepOreTiles = document.querySelectorAll(`[data-ground-type="deepOre"]`);
  allDeepOreTiles.forEach((tile) => {
    tile.classList.toggle("deepOreGround");
  });
}

const fillingFunction = (event) => {
  const tile = event.target;
  if (tile.dataset.groundType !== "water" || buildingResources["Gravel"] < 5)
    return notyf.error("Not enough Gravel!");

  deleteItemsAfterConstr("Gravel", 5);
  deleteAllInTile(tile);
  tile.dataset.type = "empty";
  tile.dataset.groundType = "gravel";
  tile.dataset.subGroundType = "";
  const reedImg = tile.querySelector(".reed");
  reedImg && reedImg.remove();
};

const backFilling = () => {
  fillingMode = !fillingMode;
  const action = fillingMode ? "addEventListener" : "removeEventListener";
  gridContainer[action]("click", fillingFunction);
};
