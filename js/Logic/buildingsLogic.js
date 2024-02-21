class Mineshaft extends Building {
  constructor(tile, id) {
    super(tile, id);
    this.name = "mineshaft";
    this.itemStorage = 0;
    this.maxItemStorage = 10;
    this.tile = tile;
    this.tileData = tile.dataset;
    Object.assign(this, findTarget);
  }

  extraction(clickArea) {
    console.log(this.tileData.oreType);
    switch (this.tileData.oreType) {
      case "iron":
        this.tileData.itemTypeOutput = "Iron Ore";
        break;
      case "copper":
        this.tileData.itemTypeOutput = "Copper Ore";
        break;
    }

    if (!this.tileData.itemAmountOutput) {
      this.tileData.itemAmountOutput = 0;
    }

    const menu = this.createMenu(SourceBuildingsMenu, "mineshaft", mineshaftMenuId, clickArea);
    const recipeObj = allItems.find((recipe) => recipe.name === this.tileData.itemTypeOutput);
    this.tileData.productionTime = recipeObj.processTime;
    this.itemSpawningInSources(this.findTargetTile(), menu, recipeObj);

    // let interval = setInterval(() => {
    //   targetTile.dataset.itemAmountOutput++;
    //   if (this.itemStorage == this.maxItemStorage) {
    //     clearInterval(interval);
    //   }
    // }, 1000);
  }
}

class IronMineshaft extends Mineshaft {
  constructor(cell) {
    super(cell, "ironMiner");
  }
}
class CopperMineshaft extends Mineshaft {
  constructor(cell) {
    super(cell, "copperMiner");
  }
}
class Quarry extends Building {
  constructor(tile, id) {
    super(tile, id);
    this.name = "quarry";
    // this.itemStorage = 0;
    // this.maxItemStorage = 10;
    this.id = id;
    this.tile = tile;
    this.tileData = tile.dataset;
    this.tileData.itemAmountOutput = 0;
    Object.assign(this, findTarget);
  }
  extraction(clickArea) {
    const targetTile = this.findTargetTile();
    const resType = targetTile.dataset.resType;
    targetTile.dataset.itemTypeOutput = resType;
    this.name = `${resType}Quarry`;
    this.createBuildingImage();

    const menu = this.createMenu(SourceBuildingsMenu, "quarry", quarryMenuId, clickArea);

    const recipeObj = allItems.find((recipe) => recipe.name === this.tileData.resType);
    this.itemSpawningInSources(this.findTargetTile(), menu, recipeObj);

    const quarryTiles = document.querySelectorAll(`[data-building-id="${targetTile.dataset.buildingId}"]`);
    quarryTiles.forEach((tile) => {
      let [currentX, currentZ] = findXZpos(tile);
      let neighborsTilesFunc = findNeighbors.bind(this, currentX, currentZ);
      const neighborsTiles = neighborsTilesFunc();

      neighborsTiles.forEach((tile) => {
        if (tile.dataset.type == "empty") tile.dataset.equipmentPossibleFor = targetTile.dataset.buildingId;
      });
    });
  }
}
class WaterPump extends Building {
  constructor(tile, id, name) {
    super(tile, id, name);
    this.name = "waterPump";
    this.tile = tile;
    this.tileData = tile.dataset;
    Object.assign(this, findTarget);
  }

  startPumping() {
    // let menu = this.createMenu(MineshaftMenu, "mineshaftMenu", "mineshaft", mineshaftMenuId);
    this.tileData.fluidAmount = 0;
    this.tileData.fluidType = "water";
    let interval = setInterval(() => {
      this.tileData.fluidAmount = (parseInt(this.tileData.fluidAmount) || 0) + 4;
      this.giveFluid();
    }, 4000);
  }
  giveFluid() {
    const neighborsTiles = [this.findTopTile(), this.findRightTile(), this.findBottomTile(), this.findLeftTile()];
    setInterval(() => {
      neighborsTiles.forEach((tile) => {
        if (tile.dataset.undergroundType == "pipe") {
          this.moveItem(this.tile, tile, "pipe");
        }
      });
    }, 500);
  }
}

class Storage extends Building {
  constructor(tile, id) {
    super(tile, id);
    this.name = "storage";
    this.tile = tile;
  }
  addItemToStorage(clickArea) {
    this.createMenu(StorageMenu, "storage", storageMenuId, clickArea);
    this.tileData = this.tile.dataset;
    this.tileData.itemAmount = 0;
  }
}
