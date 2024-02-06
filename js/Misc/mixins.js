const findTarget = {
  findTargetTile(x = this.x, z = this.z) {
    return document.getElementById(`${x}.${z}`) || { dataset: { type: null } };
  },
  findTopTile(x = this.x, z = this.z) {
    return document.getElementById(`${x - 1}.${z}`) || { dataset: { type: null } };
  },
  findTopRightTile(x = this.x, z = this.z) {
    return document.getElementById(`${x - 1}.${z + 1}`) || { dataset: { type: null } };
  },
  findRightTile(x = this.x, z = this.z) {
    return document.getElementById(`${x}.${z + 1}`) || { dataset: { type: null } };
  },
  findRightBottomTile(x = this.x, z = this.z) {
    return document.getElementById(`${x + 1}.${z + 1}`) || { dataset: { type: null } };
  },
  findBottomTile(x = this.x, z = this.z) {
    return document.getElementById(`${x + 1}.${z}`) || { dataset: { type: null } };
  },
  findBottomLeftTile(x = this.x, z = this.z) {
    return document.getElementById(`${x + 1}.${z - 1}`) || { dataset: { type: null } };
  },
  findLeftTile(x = this.x, z = this.z) {
    return document.getElementById(`${x}.${z - 1}`) || { dataset: { type: null } };
  },
  findLeftTopTile(x = this.x, z = this.z) {
    return document.getElementById(`${x - 1}.${z - 1}`) || { dataset: { type: null } };
  },
};
