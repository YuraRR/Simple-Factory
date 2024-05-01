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
    this.tileData.itemAmountOutput1 ??= 0;

    const menu = this.createMenu(
      SourceBuildingsMenu,
      this.name,
      buildingsMenuId[`${this.name}MenuId`]++,
      clickArea
    );
    const recipeObj = allItems.find((recipe) => recipe.name === this.tileData.oreType);
    this.tileData.itemTypeOutput1 = recipeObj.name;
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
    this.tileData.itemAmountOutput1 = 0;
    Object.assign(this, findTarget);
  }
  extraction(clickArea) {
    const targetTile = this.findTargetTile();
    const resType = targetTile.dataset.resType;
    targetTile.dataset.itemTypeOutput1 = resType;
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
class RubberTreePlantation extends Building {
  constructor(tile, id) {
    super(tile, id);
    this.name = "rubberTreePlantation";
    this.id = id;
    this.tile = tile;
    this.tileData = tile.dataset;
    this.tileData.itemAmountOutput1 = 0;
    Object.assign(this, findTarget);
  }
  extraction(clickArea) {
    this.tileData.itemAmountOutput1 ??= 0;
    const menu = this.createMenu(
      SourceBuildingsMenu,
      this.name,
      buildingsMenuId[`${this.name}MenuId`]++,
      clickArea
    );
    const recipeObj = allItems.find((recipe) => recipe.name === "Latex");
    this.tileData.itemTypeOutput1 = recipeObj.name;
    this.tileData.productionTime = recipeObj.processTime;
    this.itemSpawningInSources(this.findTargetTile(), menu, recipeObj);
  }
}
class Lumbermill extends Building {
  constructor(tile, id) {
    super(tile, id);
    this.name = "lumbermill";
    this.id = id;
    this.tile = tile;
    this.tileData = tile.dataset;
    this.tileData.itemAmountOutput1 = 0;
    Object.assign(this, findTarget);
  }
  extraction(clickArea) {
    this.tileData.itemAmountOutput1 ??= 0;
    const menu = this.createMenu(
      SourceBuildingsMenu,
      this.name,
      buildingsMenuId[`${this.name}MenuId`]++,
      clickArea
    );
    const recipeObj = allItems.find((recipe) => recipe.name === "Wood");
    this.tileData.itemTypeOutput1 = recipeObj.name;
    this.tileData.productionTime = recipeObj.processTime;
    this.itemSpawningInSources(this.findTargetTile(), menu, recipeObj);
    let treeId = 0;
    const treeList = this.findRadius();
    if (treeList.length == 0) return;

    deleteAllInTile(treeList[treeId++], true);
    this.tile.dataset.itemAmountOutput1 = String(parseFloat(this.tile.dataset.itemAmountOutput1) + 20);
    setInterval(() => {
      deleteAllInTile(treeList[treeId++], true);
      treeId == treeList.length ? (treeId = 0) : "";
    }, 60000);
  }
  findRadius() {
    const treeList = [];
    const [mainTileX, mainTileZ] = findXZpos(this.tile);
    const radius = 4;
    for (let i = mainTileX - radius; i <= mainTileX + radius; i++) {
      for (let j = mainTileZ - radius; j <= mainTileZ + radius; j++) {
        const distance = Math.sqrt(Math.pow(i - mainTileX, 2) + Math.pow(j - mainTileZ, 2));
        if (distance <= radius) {
          const tile = this.findTargetTile(i, j);
          if (!tile.dataset.type) continue;

          if (tile.dataset.featuresType == "tree") {
            tile.dataset.processedBy = this.tileData.buildingId;
            treeList.push(tile);
          }
        }
      }
    }
    return treeList;
  }
}
