function findcost(point, currentTile) {
  let [pointAx, pointAz] = currentTile.id.split(".").map(Number);
  let [pointBx, pointBz] = point.id.split(".").map(Number);
  let distance = (Math.abs(pointAx - pointBx) + Math.abs(pointAz - pointBz)) * 10;
  return distance;
}

function findNeighbors(currentX, currentZ) {
  return [
    this.findTopTile(currentX, currentZ),
    this.findRightTile(currentX, currentZ),
    this.findBottomTile(currentX, currentZ),
    this.findLeftTile(currentX, currentZ),
  ];
}
function findXZpos(currentTile) {
  return currentTile.id.split(".").map(Number);
}
