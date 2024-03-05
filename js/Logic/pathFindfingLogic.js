function findcost(point, currentTile) {
  let [pointAx, pointAz] = currentTile.id.split(".").map(Number);
  let [pointBx, pointBz] = point.id.split(".").map(Number);
  let distance = (Math.abs(pointAx - pointBx) + Math.abs(pointAz - pointBz)) * 10;
  return distance;
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
function isTileBorder(newBuilding) {
  const hoveredCells = document.querySelectorAll(`[data-hover="true"]`);
  return Array.from(hoveredCells).some((cell) => {
    const neighborsTilesFunc = findNeighbors.bind(newBuilding, cell);
    const neighborsTiles = neighborsTilesFunc();
    return neighborsTiles.some((tile) => !tile.dataset.type);
  });
}
