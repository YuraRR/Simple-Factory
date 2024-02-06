let CELLS = document.querySelectorAll(".grid-cell");
//ALL TREES
const allTrees = document.querySelectorAll(".tree");

//TOOLBAR
function activeTool() {
  TOOLBUTTONS.forEach((btn) => {
    btn.addEventListener("click", () => {
      currentTool = btn.id;
      removeButtonActive(TOOLBUTTONS, btn);
      switch (btn.id) {
        case "mineshaft":
          createEventListener(mineshaftCreating);
          transperentBuildingsRemove();
          if (undergroundOpened) showUnderground();
          xSize = 1;
          zSize = 1;
          break;
        case "oreProcessing":
          createEventListener(oreProcessingCreating);
          transperentBuildingsRemove();
          if (undergroundOpened) showUnderground();
          xSize = 2;
          zSize = 2;
          break;
        case "smelter":
          createEventListener(smelterCreating);
          transperentBuildingsRemove();
          if (undergroundOpened) showUnderground();
          xSize = 3;
          zSize = 3;
          break;
        case "assembler":
          createEventListener(assemblerCreating);
          transperentBuildingsRemove();
          if (undergroundOpened) showUnderground();
          xSize = 6;
          zSize = 4;
          break;
        case "storage":
          createEventListener(storageCreating);
          transperentBuildingsRemove();
          if (undergroundOpened) showUnderground();
          xSize = 2;
          zSize = 2;
          break;
        case "waterPump":
          createEventListener(waterPumpCreating);
          transperentBuildingsRemove();
          if (undergroundOpened) showUnderground();
          xSize = 1;
          zSize = 1;
          break;
        case "conveyor":
          createEventListener(conveyorCreating);
          transperentBuildingsShow();
          if (undergroundOpened) showUnderground();
          xSize = 1;
          zSize = 1;
          break;
        case "connector":
          createEventListener(connectorCreating);
          transperentBuildingsShow();
          if (undergroundOpened) showUnderground();
          xSize = 1;
          zSize = 1;
          break;
        case "splitter":
          createEventListener(splitterCreating);
          transperentBuildingsShow();
          if (undergroundOpened) showUnderground();
          xSize = 1;
          zSize = 1;
          break;
        case "pipe":
          if (!undergroundOpened) showUnderground();
          createEventListener(pipeCreating);
          xSize = 1;
          zSize = 1;
          break;
        case "fluidSplitter":
          if (!undergroundOpened) showUnderground();
          createEventListener(fluidSplitterCreating);
          xSize = 1;
          zSize = 1;
          break;
        case "road":
          createEventListener(roadCreating);
          xSize = 1;
          zSize = 1;
          break;
        case "cargoStation":
          createEventListener(cargoStationCreating);
          xSize = 1;
          zSize = 1;
          break;
        case "pointB":
          createEventListener(pointBCreating);
          xSize = 1;
          zSize = 1;
          break;
      }
    });
  });
}

function createEventListener(buildingType) {
  resetTool();
  gridContainer.removeEventListener("click", demolitionFunc);
  gridContainer.addEventListener("click", buildingType);
  ghostRotating();
}

function removeButtonActive(buttons, btn) {
  buttons.forEach((btn) => btn.classList.remove("buttonActive"));
  btn.classList.add("buttonActive");
}
function resetTool() {
  gridContainer.removeEventListener("click", conveyorCreating);
  gridContainer.removeEventListener("click", connectorCreating);
  gridContainer.removeEventListener("click", splitterCreating);
  gridContainer.removeEventListener("click", mineshaftCreating);
  gridContainer.removeEventListener("click", smelterCreating);
  gridContainer.removeEventListener("click", oreProcessingCreating);
  gridContainer.removeEventListener("click", assemblerCreating);
  gridContainer.removeEventListener("click", storageCreating);
  gridContainer.removeEventListener("click", crusherCreating);
  gridContainer.removeEventListener("click", washerCreating);
  gridContainer.removeEventListener("click", foundryCreating);
  gridContainer.removeEventListener("click", pipeCreating);
  gridContainer.removeEventListener("click", roadCreating);
  gridContainer.removeEventListener("click", cargoStationCreating);
  gridContainer.removeEventListener("click", pointBCreating);
  gridContainer.removeEventListener("click", fluidSplitterCreating);
}
activeTool();

let currentHoveredCell = null;

// GHOSTS
function handleMouseEnter(event) {
  if (event.target.dataset.type) {
    const cell = event.target;
    const id = cell.id.split(["."]);
    const x = parseInt(id[0]);
    const z = parseInt(id[1]);
    const img = document.createElement("img");

    if (
      currentTool != "demolition" &&
      currentTool != "" &&
      currentTool != "conveyor" &&
      currentTool != "connector" &&
      currentTool != "splitter" &&
      currentTool != "pipe" &&
      currentTool != "fluidSplitter" &&
      currentTool != "road" &&
      currentTool != "pointB" &&
      !cell.dataset.buildingType
    ) {
      img.src = `/img/buildings/${currentTool}.png`;
      img.dataset.ghostImg = true;
      cell.classList.add("ghostImg");
      img.classList.add(`${currentTool}-hover`);
      cell.appendChild(img);
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
                applyPlacementClass(currentTile, "sand");
                break;
              default:
                applyPlacementClass(currentTile, "empty");
                break;
            }

            function applyPlacementClass(tile, targetType) {
              if (tile.dataset.type === targetType && !tile.dataset.featuresType) {
                tile.classList.add("canBePlaced");
              } else {
                tile.classList.add("cantBePlaced");
              }
              if (currentTool == "cargoStation" && tile.classList.contains("canBePlaced")) {
                const mainFactoryTile = findTargetTileByDirection(tile);
                if (mainFactoryTile) {
                  mainFactoryTile.children[0].classList.add("connection-hover");
                } else {
                  let connectedBuilding = document.querySelector(".connection-hover");
                  if (connectedBuilding) connectedBuilding.classList.remove("connection-hover");
                }
              }
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

function handleMouseLeave() {
  removeGhostBorders();
  currentHoveredCell = null;
  updateCellStyle();
}

function ghostRotating() {
  // Удалите существующих слушателей событий
  CELLS.forEach((cell) => {
    cell.removeEventListener("mouseenter", handleMouseEnter);
    cell.removeEventListener("mouseleave", handleMouseLeave);
  });

  // Добавьте новые слушатели событий
  CELLS.forEach((cell) => {
    cell.addEventListener("mouseenter", handleMouseEnter);
    cell.addEventListener("mouseleave", handleMouseLeave);
  });

  // Обновите стиль немедленно при вызове ghostRotating()
  updateCellStyle();
}

function updateCellStyle() {
  if (currentTool) {
    DIRECTIONS = directionsList[currentTool];
  }
  if (xSize == 1 && zSize == 1 && DIRECTIONS) {
    CELLS.forEach((cell) => {
      DIRECTIONS.forEach((dir) => {
        const isDemolition = currentTool === "demolition";
        const isCellMatched = cell === currentHoveredCell && dir === DIRECTIONS[buildingDirection];

        if (
          !isDemolition &&
          cell.dataset.type === "empty" &&
          cell.dataset.featuresType !== "tree"
        ) {
          cell.classList.toggle(dir, isCellMatched);
        } else if (isDemolition) {
          cell.classList.toggle(dir, isCellMatched);
        } else {
          cell.classList.remove(dir);
        }
      });
    });
  }
}

function resetGhost() {
  currentTool = "";
  resetTool();
  removeGhostBorders();
  if (currentHoveredCell) {
    allDirections.forEach((style) => {
      currentHoveredCell.classList.remove(style);
    });
  }
  let connectedBuilding = document.querySelector(".connection-hover");
  if (connectedBuilding) connectedBuilding.classList.remove("connection-hover");
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
//DEMOLITION
function demolitionFunc(event) {
  if (event.target.classList.contains("clickArea")) {
    deleteAllInTile(event.target.parentNode);
  } else {
    deleteAllInTile(event.target);
  }
}
function deleteAllInTile(currentTile) {
  const currentId = currentTile.dataset.buildingId;
  const allTilesToDelete = document.querySelectorAll(`[data-building-id="${currentId}"]`);
  let menu = document.querySelector(`[data-parent-tile-id="${currentTile.id}"]`);
  allTrees.forEach((tree) => {
    tree.style.pointerEvents = "all";
  });
  allTilesToDelete.forEach((tile) => {
    if (tile.dataset.buildingType && tile.dataset.buildingType != "mineshaft") {
      const imgElement = tile.querySelector("img");
      const divElement = tile.querySelector("div");
      clearInterval(tile.dataset.intervalId);
      for (const key in tile.dataset) {
        delete tile.dataset[key];
      }
      tile.dataset.type = "empty";
      tile.className = "grid-cell";
      if (menu) {
        menu.remove();
      }
      if (imgElement) {
        tile.removeChild(imgElement);
      }
      if (divElement) {
        tile.removeChild(divElement);
      }
      resetTool();
    }
  });
}
//TRANSPERENT BUILDINGS
function transperentBuildingsShow() {
  const buildingElements = document.querySelectorAll("[data-building-type]");
  // Применяем стили к каждому найденному элементу
  buildingElements.forEach((element) => {
    switch (element.getAttribute("data-building-type")) {
      case "smelter":
      case "oreProcessing":
      case "storage":
      case "assembler":
        element.classList.add("transperentBuilding");
        break;
    }
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
  const allElemenstExeptEmpty = document.querySelectorAll(
    '[data-type]:not([data-type="empty"]):not([data-type="ore"])'
  );
  allElemenstExeptEmpty.forEach((el) => {
    const img = el.querySelector("img");
    const clickArea = el.querySelector(".clickArea");
    if (img && clickArea && img.dataset.imageType != "pipe" && img.dataset.imageType != "upgrade") {
      img.classList.toggle("undergroundView");
      clickArea.classList.toggle("noEvents");
    }
  });
  allTrees.forEach((el) => {
    el.classList.toggle("hidden");
  });
  if (undergroundOpened) {
    [...allPipes].map((pipe) => pipe.classList.add("hidden"));
    undergroundOpened = false;
  } else {
    [...allPipes].map((pipe) => pipe.classList.remove("hidden"));
    undergroundOpened = true;
  }
}
//MULTIPLY BUILDING
let multiplyTilesList = [];
function multiplyBuilding(tilesList, event) {
  if (!event) multiplyTilesList = [];
  else ghostSecondPoint = event.target;
  if (currentTool == "road" && tilesList.length > 0) {
    let [firstX, firstZ] = findXZpos(tilesList[0]);
    let [secondX, secondZ] = ghostSecondPoint
      ? findXZpos(ghostSecondPoint)
      : findXZpos(tilesList[1]);
    if (firstX > secondX) [firstX, secondX] = [secondX, firstX];
    if (firstZ > secondZ) [firstZ, secondZ] = [secondZ, firstZ];

    let tempGhostTiles = [];
    if (firstZ == secondZ) {
      for (let i = firstX; i <= secondX; i++) {
        let id = `${i}.${firstZ}`;
        let tile = document.getElementById(id);
        if (tilesList.length == 2) {
          placeRoads(tile);
        } else {
          placeRoadsGhost(tile);
        }
      }
    } else if (firstX == secondX) {
      for (let i = firstZ; i <= secondZ; i++) {
        let id = `${firstX}.${i}`;
        let tile = document.getElementById(id);
        if (tilesList.length == 2) {
          placeRoads(tile);
        } else {
          placeRoadsGhost(tile);
        }
      }
    }
    function placeRoads(tile) {
      if (tile.dataset.type == "empty") {
        let allGhostTiles = document.querySelectorAll(".road-hover");
        [...allGhostTiles].map((tile) => tile.classList.remove("road-hover"));
        let newBuilding = new Road(tile);
        newBuilding.getId(tile.id);
        newBuilding.createBuilding();
        document.removeEventListener("mouseover", placeMultiplyGhost);
      }
    }

    function placeRoadsGhost(tile) {
      let allGhostTiles = document.querySelectorAll(".road-hover");
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

function findTargetTileByDirection(tile) {
  let x = findXZpos(tile)[0];
  let z = findXZpos(tile)[1] + 1;
  let factoryTile;
  let direction = buildingDirection;
  if (tile.dataset.direction) {
    direction = tile.dataset.direction;
  }
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
  return findMainTile(factoryTile);
}

//SWITCH UPGRADES VISIBILITY
function switchUpgrades() {
  let upgradesImageList = document.querySelectorAll("[data-image-type='upgrade']");
  [...upgradesImageList].map((img) => img.classList.toggle("hidden"));
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