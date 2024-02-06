class Upgrade extends Building {
  constructor(tile) {
    super(tile);
    Object.assign(this, findTarget);
  }
  createUpgrade() {
    console.log(`Building a  upgrade${this.name}`);
    let upgradeTile = document.getElementById(`${this.x}.${this.z}`);
    upgradeTile.dataset.upgradeType = this.name;
    handleMouseLeave();
  }
}

class Crusher extends Upgrade {
  constructor(tile, id) {
    super(tile, id);
    this.name = "Crusher";
    this.tile = tile;
    Object.assign(this, findTarget);
  }
  addEfficiency() {
    let mainTile = findMainTile(this.tile);
    console.log(this.tile);
    mainTile.dataset.productionTime /= 2;
  }
}
class Washer extends Upgrade {
  constructor(tile, id, type) {
    super(tile, id, type);
    this.name = "Washer";
    this.tile = tile;
    Object.assign(this, findTarget);
  }
  addWaterToRecipe() {
    let mainTile = findMainTile(this.tile);
    mainTile.dataset.productionTime /= 2;
    this.tile.dataset.fluidAmount = 0;
  }
}

class Foundry extends Upgrade {
  constructor(tile, type, id) {
    super(tile, type, id);
    this.type = type;
    this.name = `Foundry${this.type}`;
    this.tile = tile;
    Object.assign(this, findTarget);
  }
  chooseRecipe() {
    let mainTile = findMainTile(this.tile);
    if (!mainTile.dataset.selectedProduct) {
      this.tile.dataset.selectedProduct = this.type;
    }
  }
}
