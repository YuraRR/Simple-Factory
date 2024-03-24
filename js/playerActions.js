const CELLS = document.querySelectorAll(".grid-cell");
//ALL TREES
const allTrees = document.querySelectorAll(`[data-image-type="natureFeature"`);

let currentHoveredCell = null;

// GHOSTS
function handleMouseEnter(event) {
  if (event.target.dataset.type) {
    const cell = event.target;
    const id = cell.id.split(["."]);
    const x = parseInt(id[0]);
    const z = parseInt(id[1]);
    const img = document.createElement("img");
    const xSize = allBuildings.find((bld) => bld.name === currentTool).xSize;
    const zSize = allBuildings.find((bld) => bld.name === currentTool).zSize;

    if (currentTool != "demolition" && currentTool != "" && currentTool != "road") {
      const buildingInfo = allBuildings.find((bld) => bld.name === currentTool);
      const buidlingImages = buildingInfo.imageSrc;
      img.src = `/img/buildings/${currentTool}.webp`;
      img.dataset.ghostImg = true;
      cell.classList.add("ghostImg");
      img.dataset.imageType = currentTool;
      cell.appendChild(img);
      if (buidlingImages && Object.keys(buidlingImages).length === 4) {
        img.src = buildingInfo.imageSrc[buildingDirection];
      }

      for (let i = 0; i < xSize; i++) {
        for (let j = 0; j < zSize; j++) {
          const currentTile = document.getElementById(`${x + i}.${z + j}`);
          if (currentTile) {
            currentTile.dataset.hover = true;
            switch (currentTool) {
              case "mineshaft":
                applyPlacementClass(currentTile, "ore");
                break;
              case "waterPump":
                applyPlacementClass(currentTile, "water");
                break;
              case "quarry":
                applyPlacementClass(currentTile, ["sand", "clay", "limestone", "stone"]);
                break;
              default:
                applyPlacementClass(currentTile, "empty");
                break;
            }

            function applyPlacementClass(tile, targetType) {
              if (
                !tile.dataset.featuresType &&
                (tile.dataset.groundType == targetType ||
                  targetType.includes(tile.dataset.groundType) ||
                  (targetType == "empty" && tile.dataset.type == "empty"))
              ) {
                tile.classList.add("canBePlaced");
              } else {
                currentTool == "pipe"
                  ? tile.classList.add("canBePlaced")
                  : (tile.classList.add("cantBePlaced"), img.classList.add("buildingCantPlace"));
              }
              factoryConnectionCheck(tile);
            }
          }
        }
      }
    } else {
      currentHoveredCell = cell;
      updateCellStyle();
    }
  }
}
function factoryConnectionCheck(tile) {
  if (currentTool == "cargoStation" && tile.classList.contains("canBePlaced")) {
    const mainFactoryTile = findTargetTileByDirection(tile, true);
    if (mainFactoryTile) {
      const buidlingImg = mainFactoryTile.querySelector(`[data-main-building-img="true"]`);
      buidlingImg.classList.add("connection-hover");
    } else {
      const connectedBuilding = document.querySelector(".connection-hover");
      connectedBuilding && connectedBuilding.classList.remove("connection-hover");
    }
  }
}
function handleMouseLeave() {
  removeGhostBorders();
  currentHoveredCell = null;
  updateCellStyle();
}

function ghostRotating() {
  CELLS.forEach((cell) => {
    cell.removeEventListener("mouseenter", handleMouseEnter);
    cell.removeEventListener("mouseleave", handleMouseLeave);
  });

  CELLS.forEach((cell) => {
    cell.addEventListener("mouseenter", handleMouseEnter);
    cell.addEventListener("mouseleave", handleMouseLeave);
    currentTool == "demolition"
      ? cell.classList.add("demolition-hover")
      : cell.classList.remove("demolition-hover");
  });
}

function updateCellStyle() {
  const ghostImage = document.querySelector(`[data-ghost-img="true"]`);
  const buildingInfo = allBuildings.find((bld) => bld.name === currentTool);
  const buidlingImages = buildingInfo.imageSrc;
  if (ghostImage && buidlingImages && Object.keys(buidlingImages).length === 4) {
    ghostImage.src = buildingInfo.imageSrc[buildingDirection];
  }
}

function resetGhost() {
  currentTool = "";
  resetTool();
  removeGhostBorders();
  const connectedBuilding = document.querySelector(".connection-hover");
  connectedBuilding && connectedBuilding.classList.remove("connection-hover");
  CELLS.forEach((cell) => {
    cell.removeEventListener("mouseenter", handleMouseEnter);
    cell.removeEventListener("mouseleave", handleMouseLeave);
  });
  gridContainer.removeEventListener("click", demolitionFunc);
  allTrees.forEach((tree) => {
    tree.style.pointerEvents = "none";
  });
}
function removeGhostBorders() {
  const ghostTilesToRemove = gridContainer.querySelectorAll(`[data-hover = true]`);
  const ghostImgToRemove = gridContainer.querySelectorAll(`[data-ghost-img = true]`);
  ghostImgToRemove.forEach((img) => {
    img.parentNode.classList.remove("ghostImg");
    img.remove();
  });
  ghostTilesToRemove.forEach((tile) => {
    tile.classList.remove("canBePlaced", "cantBePlaced");
    delete tile.dataset.hover;
  });
}
function clearPossibleTiles(isToDelData) {
  const possibleTiles = document.querySelectorAll(`[data-possible-connect-with]`);
  possibleTiles.forEach((tile) => {
    tile.classList.remove("possibleTile");
    if (isToDelData) {
      tile.removeAttribute("data-possible-connect-with");
      tile.removeAttribute("data-direction-for-exit");
    }
  });
}
//DEMOLITION
function demolitionFunc(event) {
  const tile = event.target.classList.contains("clickArea") ? event.target.parentNode : event.target;
  deleteAllInTile(tile);
}
function deleteAllInTile(currentTile) {
  const currentId = currentTile.dataset.buildingId;
  const allTilesToDelete = document.querySelectorAll(`[data-building-id="${currentId}"]`);
  const menu = document.querySelector(`[data-parent-tile-id="${currentTile.id}"]`);

  if (currentTile.dataset.featuresType) {
    currentTile.removeChild(currentTile.querySelector("img"));
    currentTile.removeAttribute("data-features-type");
  }

  allTilesToDelete.forEach((tile) => {
    if (
      tile.dataset.buildingType &&
      tile.dataset.buildingType != "mineshaft" &&
      tile.dataset.buildingType != "tradingTerminal"
    ) {
      const imgElement = tile.querySelector("img");
      const divElement = tile.querySelector("div");
      clearInterval(tile.dataset.intervalId);

      if (tile.dataset.buildingType == "conveyor") {
        const itemImg = document.querySelector(`[data-image-item-id="${tile.dataset.itemId}"]`);
        itemImg && itemImg.remove();
      }

      for (const key in tile.dataset) {
        if (key != "groundType" && key != "oreType") delete tile.dataset[key];
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
  // Применяем стили к каждому найденному элементу
  buildingElements.forEach((element) => {
    element.classList.remove("transperentBuilding");
  });
}
//UNDERGROUND
function showUnderground() {
  gridContainer.classList.toggle("containerOpacity");
  const allPipes = gridContainer.querySelectorAll(`[data-image-type="pipe"]`);
  const allConnectorPipes = document.querySelectorAll(`[data-pipe-type="connector"]`);
  const allBuildings = document.querySelectorAll(`[data-main-tile="true"]`);
  allBuildings.forEach((el) => {
    const img = el.querySelector("img");
    const clickArea = el.querySelector(".clickArea");
    console.log(el);
    if (img.dataset.imageType != "pipe") {
      img && img.classList.toggle("undergroundView");
      clickArea && clickArea.classList.toggle("noEvents");
    }
  });
  allTrees.forEach((el) => {
    el.classList.toggle("hidden");
    el.parentElement.classList.toggle("hiddenPseudo");
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
//MULTIPLY BUILDING
let multiplyTilesList = [];
function multiplyBuilding(tilesList, event) {
  if (!event) multiplyTilesList = [];
  else ghostSecondPoint = event.target;
  if (currentTool == "road" && tilesList.length > 0) {
    let [firstX, firstZ] = findXZpos(tilesList[0]);
    let [secondX, secondZ] = ghostSecondPoint ? findXZpos(ghostSecondPoint) : findXZpos(tilesList[1]);
    if (firstX > secondX) [firstX, secondX] = [secondX, firstX];
    if (firstZ > secondZ) [firstZ, secondZ] = [secondZ, firstZ];

    let tempGhostTiles = [];

    if (firstZ == secondZ) {
      for (let i = firstX; i <= secondX; i++) {
        const id = `${i}.${firstZ}`;
        const tile = document.getElementById(id);
        tilesList.length == 2 ? placeObj(tile) : placeObjGhost(tile);
      }
    } else if (firstX == secondX) {
      for (let i = firstZ; i <= secondZ; i++) {
        const id = `${firstX}.${i}`;
        const tile = document.getElementById(id);

        tilesList.length == 2 ? placeObj(tile) : placeObjGhost(tile);
      }
    }
    function placeObj(tile) {
      if (tile.dataset.type == "empty") {
        if (tile.classList.contains("road-hover")) {
          const newBuilding = new Road(tile);
          newBuilding.getId(tile.id);
          newBuilding.createBuilding();
          document.removeEventListener("mouseover", placeMultiplyGhost);
        }
      }
    }

    function placeObjGhost(tile) {
      const allGhostTiles = document.querySelectorAll(".road-hover");
      if (tile.dataset.type == "empty") {
        tile.classList.add("road-hover");
        tempGhostTiles.push(tile);
        allGhostTiles.forEach((tile) => {
          if (!Array.from(tempGhostTiles).includes(tile)) {
            tile.classList.remove("road-hover");
          }
        });
      }
    }
  }
}
//FINDING TILES
function findTileByMouse(event) {
  if (event.target.classList.contains("grid-cell")) {
    multiplyTilesList.push(event.target);
    setTimeout(() => {
      const allGhostTiles = document.querySelectorAll(".road-hover");
      [...allGhostTiles].map((tile) => tile.classList.remove("road-hover"));
    }, 0);
  }

  if (multiplyTilesList.length == 2) {
    multiplyBuilding(multiplyTilesList);
  } else if (multiplyTilesList.length == 1) {
    document.addEventListener("mouseover", placeMultiplyGhost);
  }
}
function placeMultiplyGhost(event) {
  multiplyBuilding(multiplyTilesList, event);
}

function findTargetTileByDirection(tile, isFindMainTile) {
  const x = findXZpos(tile)[0];
  const z = findXZpos(tile)[1] + 1;
  let factoryTile;
  const direction = tile.dataset.direction || buildingDirection;
  switch (direction) {
    case 0:
    case "up":
      factoryTile = findTarget.findLeftTile(x - 1, z);
      break;
    case 1:
    case "right":
      factoryTile = findTarget.findLeftTile(x, z + 1);
      break;
    case 2:
    case "down":
      factoryTile = findTarget.findLeftTile(x + 1, z);
      break;
    case 3:
    case "left":
      factoryTile = findTarget.findLeftTile(x, z - 1);
      break;
  }

  if (isFindMainTile) return findMainTile(factoryTile);
  else return factoryTile;
}
function findItemObjInList(name) {
  return allItems.find((item) => item.name == name);
}
function findBldObjInList(name) {
  return allBuildings.find((item) => item.name == name);
}

//PAUSE

// function handleVisibilityChange() {
//   if (document.hidden) {
//     // Страница свернута, вывести alert
//     alert("Pause");
//   }
// }

// // Добавляем обработчик события
// document.addEventListener("visibilitychange", handleVisibilityChange);
