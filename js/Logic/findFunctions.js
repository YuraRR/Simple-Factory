function findMainTile(building) {
  const currentId = building.dataset.buildingId;
  const allBuildingTiles = document.querySelectorAll(`[data-building-id="${currentId}"]`);
  return Array.from(allBuildingTiles).find(
    (tile) =>
      tile.dataset.firstMatAmount ||
      tile.dataset.itemAmountOutput1 ||
      tile.dataset.buildingType == "tradingTerminal"
  );
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
//FINDING TILES
function findTileByMouse(event) {
  if (event.target.classList.contains("grid-cell")) {
    multiplyTilesList.push(event.target);
    setTimeout(() => {
      const allGhostTiles = document.querySelectorAll(".multiply-hover");
      [...allGhostTiles].map((tile) => tile.classList.remove("multiply-hover"));
    }, 0);
  }

  if (multiplyTilesList.length == 2) {
    multiplyBuilding(multiplyTilesList);
  } else if (multiplyTilesList.length == 1) {
    document.addEventListener("mouseover", placeMultiplyGhost);
  }
}
function findNeighbors(currentTile) {
  const [currentX, currentZ] = findXZpos(currentTile);
  return [
    findTarget.findTopTile(currentX, currentZ),
    findTarget.findRightTile(currentX, currentZ),
    findTarget.findBottomTile(currentX, currentZ),
    findTarget.findLeftTile(currentX, currentZ),
  ];
}
function findXZpos(currentTile) {
  return currentTile.id.split(".").map(Number);
}
function findItemObjInList(name) {
  return allItems.find((item) => item.name == name);
}
function findBldObjInList(name) {
  return allBuildings.find((item) => item.name == name);
}
function findcost(point, currentTile) {
  let [pointAx, pointAz] = currentTile.id.split(".").map(Number);
  let [pointBx, pointBz] = point.id.split(".").map(Number);
  let distance = (Math.abs(pointAx - pointBx) + Math.abs(pointAz - pointBz)) * 10;
  return distance;
}

function isTileBorder(newBuilding) {
  const hoveredtiles = document.querySelectorAll(`[data-hover="true"]`);
  return Array.from(hoveredtiles).some((tile) => {
    const neighborsTiles = findNeighbors(tile);
    return neighborsTiles.some((tile) => !tile.dataset.type);
  });
}
