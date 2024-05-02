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
          getItemFromDemolition("Wood", "Planks", groundItemImg);
          currentTile.dataset.groundType == "forest" ? reGrowthTree(currentTile) : "";
          break;
        case "rock":
          getItemFromDemolition("Stone", "Gravel", groundItemImg);
          break;
      }
    } else {
      currentTile.dataset.groundType == "forest" ? reGrowthTree(currentTile) : "";
    }

    if (currentTile.dataset.featuresType == "limeStoneRock") {
      const limeTiles = document.querySelectorAll(`[data-features-type="limeStoneRock"]`);
      limeTiles.forEach((tile) => tile.removeAttribute("data-features-type"));
    }
    function getItemFromDemolition(materialType, productType, image) {
      currentTile.dataset.groundItem = materialType;
      updateResource(image);
      const dblclickHandler = () => {
        const index = storageResources.findIndex((obj) => obj.id === currentTile.dataset.buildingId);
        storageResources.splice(index, 1);
        currentTile.dataset.groundItem = productType;
        updateResource(image);
        currentTile.removeEventListener("dblclick", dblclickHandler);
      };
      currentTile.addEventListener("dblclick", dblclickHandler);
    }

    function updateResource(groundItemImg) {
      if (currentTile.dataset.groundItem) {
        const itemInfo = findItemObjInList(currentTile.dataset.groundItem);
        groundItemImg.src = itemInfo.imageSrc;
        currentTile.dataset.buildingId = buildingId++;
        const storageObj = {
          id: currentTile.dataset.buildingId,
          resName: currentTile.dataset.groundItem,
          resAmount: 5,
          storageType: "ground",
        };
        storageResources.push(storageObj);
        updateStorageResources();
      }
    }

    currentTile.removeAttribute("data-features-type");
    currentTile.classList.remove("demolition-hover");
  }
  function deleteBuilding() {
    if (currentTile.dataset.buildingCategory == "energy") {
      totalEnergy = parseFloat(totalEnergy) - currentTile.dataset.energyProduction;
      updateEnergy();
    }
    allTilesToDelete.forEach((tile) => {
      if (
        (tile.dataset.buildingType &&
          tile.dataset.buildingType != "mineshaft" &&
          tile.dataset.buildingType != "tradingTerminal") ||
        tile.dataset.groundItem
      ) {
        const imgElement = tile.querySelector("img");
        const divElement = tile.querySelector("div");
        clearInterval(tile.dataset.intervalId);

        if (tile.dataset.buildingType == "conveyor") {
          const itemImg = document.querySelector(`[data-image-item-id="${tile.dataset.itemId}"]`);
          itemImg && itemImg.remove();
        }

        for (const key in tile.dataset) {
          if (key != "groundType" && key != "subGroundType" && key != "oreType" && key != "resType")
            delete tile.dataset[key];
        }
        tile.dataset.type = "empty";
        tile.className = "grid-cell";

        menu && (clearInterval(menu.dataset.updateInterval), menu.remove());

        imgElement && tile.removeChild(imgElement);
        divElement && tile.removeChild(divElement);

        resetTool();
      }
    });
  }
}

function reGrowthTree(currentTile) {
  const [x, z] = findXZpos(currentTile);
  const randomTime = Math.floor(Math.random() * 30) * 5000;
  treeGrowing();

  function treeGrowing() {
    !currentTile.dataset.groundItem && !currentTile.dataset.buildingType
      ? setTimeout(() => new Tree(x, z).spawn("forest"), randomTime)
      : setTimeout(() => treeGrowing(), randomTime);
  }
}
//TRANSPERENT BUILDINGS
function transperentBuildingsShow() {
  const buildingElements = document.querySelectorAll(`[data-main-building-img="true"]`);

  // Применяем стили к каждому найденному элементу
  buildingElements.forEach((element) => {
    const data = element.parentElement.getAttribute("data-building-category");
    data != "transportation" && data != "conveyor" ? element.classList.add("transperentBuilding") : "";
  });
}
function transperentBuildingsRemove() {
  const buildingElements = document.querySelectorAll(".transperentBuilding");
  buildingElements.forEach((e) => e.classList.remove("transperentBuilding"));
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
    const img = el.querySelector("img");
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
