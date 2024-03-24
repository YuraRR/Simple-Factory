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
    this.tileData.itemAmountOutput ??= 0;

    const menu = this.createMenu(
      SourceBuildingsMenu,
      this.name,
      buildingsMenuId[`${this.name}MenuId`]++,
      clickArea
    );
    const recipeObj = allItems.find((recipe) => recipe.name === this.tileData.oreType);
    this.tileData.itemTypeOutput = recipeObj.name;
    this.tileData.productionTime = recipeObj.processTime;
    this.itemSpawningInSources(this.findTargetTile(), menu, recipeObj);
  }
}

class Quarry extends Building {
  constructor(tile, id) {
    super(tile, id);
    this.name = "quarry";
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

    const menu = this.createMenu(SourceBuildingsMenu, "quarry", buildingsMenuId[`quarryMenuId`]++, clickArea);

    const recipeObj = allItems.find((recipe) => recipe.name === this.tileData.resType);
    this.itemSpawningInSources(this.findTargetTile(), menu, recipeObj);

    const quarryTiles = document.querySelectorAll(`[data-building-id="${targetTile.dataset.buildingId}"]`);
    quarryTiles.forEach((tile) => {
      const neighborsTiles = findNeighbors(tile);

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
}

class Storage extends Building {
  constructor(tile, id) {
    super(tile, id);
    this.name = "mediumStorage";
    this.tile = tile;
    this.buildingId = tile.dataset.buildingId;
  }
  addItemToStorage(clickArea) {
    this.createMenu(StorageBuildingsMenu, this.name, buildingsMenuId[`${this.name}MenuId`]++, clickArea);
    this.tileData = this.tile.dataset;
    this.tileData.itemAmountOutput = 0;
    const storageObj = {
      id: this.tileData.buildingId,
      resName: this.tileData.itemTypeOutput,
      resAmount: +this.tileData.itemAmountOutput,
    };
    storageResources.push(storageObj);
    this.updateGlobalAmount();
  }
  updateGlobalAmount() {
    console.log(this.id);
    const storageObj = storageResources.find((storage) => storage.id == this.tile.dataset.buildingId);
    setInterval(() => {
      storageObj.resName = this.tile.dataset.itemTypeOutput;
      storageObj.resAmount = +this.tile.dataset.itemAmountOutput;
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
    this.createMenu(StorageBuildingsMenu, this.name, buildingsMenuId[`${this.name}MenuId`]++, clickArea);
    this.tileData = this.tile.dataset;
    this.tileData.itemAmount = 0;
  }
}
class PowerPlant extends Building {
  constructor(tile, id) {
    super(tile, id);
    this.name = "powerPlant";
    this.tile = tile;
    this.productionTime = 12000;
  }
  processing(clickArea) {
    this.tileData = this.tile.dataset;
    this.tileData.productionTime = this.productionTime;
    if (!this.tileData.itemAmount) {
      this.tileData.itemAmount = 0;
      this.tileData.itemAmountOutput = 0;
    }
    this.tileData.energyInNetwork = "false";
    this.tileData.buildingState = "Idle";

    const menu = this.createMenu(
      OneMatProcessingMenu,
      this.name,
      buildingsMenuId[`${this.name}MenuId`]++,
      clickArea
    );

    const recipeObj = allItems.find((recipe) => recipe.producedIn === this.name);
    this.itemProcessingOneMaterial(this.tile, menu, recipeObj);

    this.tileData.itemType = recipeObj.materials.res1Name;
    this.tileData.itemTypeOutput = recipeObj.name;
  }
}
