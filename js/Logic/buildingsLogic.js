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

    const menu = this.createMenu(SourceBuildingsMenu, "mineshaft", mineshaftMenuId++, clickArea);
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

    const menu = this.createMenu(SourceBuildingsMenu, "quarry", quarryMenuId++, clickArea);

    const recipeObj = allItems.find((recipe) => recipe.name === this.tileData.resType);
    this.itemSpawningInSources(this.findTargetTile(), menu, recipeObj);

    const quarryTiles = document.querySelectorAll(`[data-building-id="${targetTile.dataset.buildingId}"]`);
    quarryTiles.forEach((tile) => {
      const neighborsTilesFunc = findNeighbors.bind(this, tile);
      const neighborsTiles = neighborsTilesFunc();

      neighborsTiles.forEach((tile) => {
        if (tile.dataset.type == "empty") tile.dataset.structurePossibleFor = targetTile.dataset.buildingId;
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
    this.tileData.fluidType = "water";
  }
  giveFluid() {
    const neighborsTiles = [this.findTopTile(), this.findRightTile(), this.findBottomTile(), this.findLeftTile()];
    // setInterval(() => {
    //   neighborsTiles.forEach((tile) => {
    //     if (tile.dataset.undergroundType == "pipe") {
    //       this.moveItem(this.tile, tile, "pipe");
    //     }
    //   });
    // }, 500);
  }
}

class Storage extends Building {
  constructor(tile, id) {
    super(tile, id);
    this.name = "storage";
    this.tile = tile;
    this.buildingId = tile.dataset.buildingId;
  }
  addItemToStorage(clickArea) {
    this.createMenu(StorageBuildingsMenu, "storage", storageMenuId++, clickArea);
    this.tileData = this.tile.dataset;
    this.tileData.itemAmount = 0;
    const storageObj = {
      id: this.tileData.buildingId,
      resName: this.tileData.itemType,
      resAmount: +this.tileData.itemAmount,
    };
    storageResources.push(storageObj);
    this.updateGlobalAmount();
  }
  updateGlobalAmount() {
    console.log(this.id);
    const storageObj = storageResources.find((storage) => storage.id == this.tile.dataset.buildingId);
    setInterval(() => {
      storageObj.resName = this.tile.dataset.itemType;
      storageObj.resAmount = +this.tile.dataset.itemAmount;
      console.log(storageResources);
    }, 4000);
  }
}
class SmallStorage extends Building {
  constructor(tile, id) {
    super(tile, id);
    this.name = "smallStorage";
    this.tile = tile;
  }
  addItemToStorage(clickArea) {
    this.createMenu(StorageBuildingsMenu, "smallStorage", storageMenuId++, clickArea);
    this.tileData = this.tile.dataset;
    this.tileData.itemAmount = 0;
  }
}
