class Equipment extends Building {
  constructor(tile) {
    super(tile);
    Object.assign(this, findTarget);
  }
  createStructure() {
    console.log(`Building a equipment${this.name}`);
    let equipmentTile = document.getElementById(`${this.x}.${this.z}`);
    equipmentTile.dataset.equipmentType = this.name;
    handleMouseLeave();
  }
}

class Crusher extends Equipment {
  constructor(tile, id) {
    super(tile, id);
    this.name = "Crusher";
    this.tile = tile;
    Object.assign(this, findTarget);
  }
  addEfficiency() {
    const id = this.tile.dataset.equipmentPossibleFor;
    const mainTile = document.querySelector(`[data-building-id="${id}"][data-main-tile="true"]`);
    if (mainTile.dataset.resType == "Stone") mainTile.dataset.itemTypeOutput = "Gravel";
    if (mainTile.dataset.resType == "Limestone") mainTile.dataset.itemTypeOutput = "Crushed Limestone";
  }

  // mainTile.dataset.productionTime /= 2;
}
class WaterTower extends Equipment {
  constructor(tile, id, type) {
    super(tile, id, type);
    this.name = "WaterTower";
    this.tile = tile;
    Object.assign(this, findTarget);
  }
  addWaterToRecipe() {
    const id = this.tile.dataset.equipmentPossibleFor;
    const mainTile = document.querySelector(`[data-building-id="${id}"][data-main-tile="true"]`);
  }
}

// class Foundry extends Equipment {
//   constructor(tile, type, id) {
//     super(tile, type, id);
//     this.type = type;
//     this.name = `Foundry${this.type}`;
//     this.tile = tile;
//     Object.assign(this, findTarget);
//   }
//   chooseRecipe() {
//     let mainTile = findMainTile(this.tile);
//     if (!mainTile.dataset.selectedProduct) {
//       mainTile.dataset.selectedProduct = this.type;
//     }
//   }
// }
