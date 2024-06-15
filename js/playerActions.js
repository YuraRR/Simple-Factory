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
    if (
      currentTool != "demolition" &&
      currentTool != "" &&
      (currentTool != "gravelRoad" || currentTool != "concreteRoad")
    ) {
      const buildingInfo = allBuildings.find((bld) => bld.name === currentTool);
      const buidlingImages = buildingInfo.imageSrc;
      const allClickAreas = document.querySelectorAll(".clickArea");

      const buildingImage = buildingInfo.imageSrc
        ? buildingInfo.imageSrc
        : `/img/buildings/${buildingInfo.name}.webp`;

      img.src = buildingImage;

      img.dataset.ghostImg = true;
      cell.classList.add("ghostImg");
      img.dataset.imageType = currentTool;
      cell.appendChild(img);
      if (buidlingImages && Object.keys(buidlingImages).length === 4) {
        img.src = buildingInfo.imageSrc[buildingDirection];
      }
      allClickAreas.forEach((e) => (e.style.pointerEvents = "none"));
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
              case "rubberTreePlantation":
                applyPlacementClass(currentTile, ["forest", "flowers"]);
                break;
              default:
                applyPlacementClass(currentTile, "empty");
                break;
            }

            function applyPlacementClass(tile, targetType) {
              if (
                (!tile.dataset.featuresType &&
                  !tile.dataset.groundItem &&
                  (tile.dataset.type == "empty" || targetType == "ore") &&
                  (targetType == "empty" ||
                    tile.dataset.groundType == targetType ||
                    targetType.includes(tile.dataset.groundType))) ||
                (tile.dataset.type == "water" && targetType == "water")
              ) {
                tile.classList.add("canBePlaced");
              } else {
                currentTool == "pipe"
                  ? tile.classList.add("canBePlaced")
                  : (tile.classList.add("cantBePlaced"), img.classList.add("buildingCantPlace"));
              }

              if (currentTool == "cargoStation" && tile.classList.contains("canBePlaced"))
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
  const allConnectedBld = document.querySelectorAll(".connection-hover");
  allConnectedBld.forEach((e) => e.classList.remove("connection-hover"));

  const connectedBuilding = document.querySelector(".connection-hover");
  const pattern = /(inOut1|inOut2|inOut3|Out|In|storage|terminal)/;
  let neighborsTiles = findNeighbors(tile);
  neighborsTiles.map((neighborTile) => {
    pattern.test(neighborTile.dataset.buildingCategory)
      ? ""
      : (neighborsTiles = neighborsTiles.filter((tile) => tile !== neighborTile));
  });
  if (neighborsTiles.length == 1) {
    const mainFactoryTile = findMainTile(neighborsTiles[0]);
    const buidlingImg = mainFactoryTile.querySelector(`[data-main-building-img="true"]`);
    buidlingImg.classList.add("connection-hover");
  } else if (neighborsTiles.length == 2 || neighborsTiles.length == 3) {
    const mainTileByDir = findTargetTileByDirection(tile, true);
    const oldfactoryTile = document.querySelector(".connection-hover");

    oldfactoryTile && oldfactoryTile.classList.remove("connection-hover");

    if (mainTileByDir && pattern.test(mainTileByDir.dataset.buildingCategory)) {
      const buidlingImg = mainTileByDir.querySelector(`[data-main-building-img="true"]`);
      buidlingImg.classList.add("connection-hover");
    }
  } else {
    connectedBuilding && connectedBuilding.classList.remove("connection-hover");
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
  if (!CELLS) return;

  //ALL TREES
  const allTrees = document.querySelectorAll(`[data-image-type="natureFeature"`);
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

  allTrees.forEach((tree) => (tree.style.pointerEvents = "none"));
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
//MULTIPLY BUILDING
let multiplyTilesList = [];
function multiplyBuilding(tilesList, event) {
  let tempGhostTiles = [];
  !event ? (multiplyTilesList = []) : (ghostSecondPoint = event.target);
  if (
    (currentTool == "gravelRoad" ||
      currentTool == "concreteRoad" ||
      currentTool == "pipe" ||
      currentTool == "conveyor") &&
    tilesList.length > 0
  ) {
    let [firstX, firstZ] = findXZpos(tilesList[0]);
    let [secondX, secondZ] = ghostSecondPoint ? findXZpos(ghostSecondPoint) : findXZpos(tilesList[1]);

    // Находим минимальные значения X и Z
    let minX = Math.min(firstX, secondX);
    let maxX = Math.max(firstX, secondX);
    let minZ = Math.min(firstZ, secondZ);
    let maxZ = Math.max(firstZ, secondZ);

    errorSoundIsPlaying = false;
    if (maxX - minX >= maxZ - minZ) {
      for (let i = minX; i <= maxX; i++) {
        const tile = document.getElementById(`${i}.${firstZ}`);
        tilesList.length == 2 ? placeObj(tile) : placeObjGhost(tile);
        buildingDirection = secondX > firstX ? 2 : 0;
      }
    } else {
      for (let i = minZ; i <= maxZ; i++) {
        const tile = document.getElementById(`${firstX}.${i}`);
        tilesList.length == 2 ? placeObj(tile) : placeObjGhost(tile);
        buildingDirection = secondZ > firstZ ? 1 : 3;
      }
    }

    function placeObj(tile) {
      if (tile.dataset.type == "empty" || currentTool == "pipe") {
        if (tile.classList.contains("multiply-hover")) {
          if (currentTool == "gravelRoad" || currentTool == "concreteRoad") {
            const newBuilding = new Road(tile, "", currentTool);
            const startMethods = startBuildingMethods.bind(newBuilding, tile);
            tile.dataset.roadType = currentTool;
            startMethods();
            document.removeEventListener("mouseover", placeMultiplyGhost);
          } else if (currentTool == "pipe" && !tile.dataset.undergroundType) {
            const newBuilding = new Pipe(tile);
            const startMethods = startBuildingMethods.bind(newBuilding, tile);
            startMethods();
          } else if (currentTool == "conveyor") {
            const newBuilding = new Conveyor(tile);
            const startMethods = startBuildingMethods.bind(newBuilding, tile);
            startMethods();
          }
        } else {
          tile.classList.remove("cantBePlaced");
        }
      }
    }

    function placeObjGhost(tile) {
      const allGhostTiles = document.querySelectorAll(".multiply-hover");
      if ((tile.dataset.type == "empty" && !tile.dataset.featuresType) || currentTool == "pipe") {
        tile.classList.add("multiply-hover");

        tempGhostTiles.push(tile);
        allGhostTiles.forEach((tile) => {
          if (!Array.from(tempGhostTiles).includes(tile)) {
            tile.classList.remove("multiply-hover");
            tile.classList.remove("cantBePlaced");
          }
        });
      } else {
        tile.classList.add("cantBePlaced");
      }
    }
  }
}

function placeMultiplyGhost(event) {
  multiplyBuilding(multiplyTilesList, event);
}
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
function updateMoney() {
  const moneySpan = document.querySelector(".moneyAmount");
  const formattedString = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(money);

  moneySpan.textContent = formattedString;
  +money;
}
updateMoney();
//PAUSE

// function handleVisibilityChange() {
//   if (document.hidden) {
//     // Страница свернута, вывести alert
//     alert("Pause");
//   }
// }

// // Добавляем обработчик события
// document.addEventListener("visibilitychange", handleVisibilityChange);
