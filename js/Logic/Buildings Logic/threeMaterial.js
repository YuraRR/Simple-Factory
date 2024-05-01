class in3Out1Bld extends Building {
  constructor(tile, id) {
    super(tile, id);
    this.tile = tile;
    Object.assign(this, findTarget);
  }
  processing(clickArea) {
    this.tileData = this.tile.dataset;
    this.tileData.productionTime = this.productionTime;
    if (!this.tileData.firstMatAmount) {
      this.tileData.firstMatAmount = 0;
      this.tileData.secondMatAmount = 0;
      this.tileData.itemAmountOutput1 = 0;
      this.tileData.thirdMatAmount = 0;
    }

    const menu = this.createMenu(
      ThreeMatsProcessingMenu,
      this.name,
      buildingsMenuId[`${this.name}MenuId`]++,
      clickArea
    );
    const recipeObj = allItems.find((recipe) => recipe.producedIn === this.name);
    this.itemProcessingMaterial(this.tile, menu, recipeObj);

    this.tileData.firstMatName = recipeObj.materials.res1Name;
    this.tileData.secondMatName = recipeObj.materials.res2Name;
    this.tileData.thirdMatName = recipeObj.materials.res3Name;
    this.tileData.itemTypeOutput1 = recipeObj.name;
  }
}
class ConcretePlant extends in3Out1Bld {
  constructor(tile, id) {
    super(tile, id);
    this.name = "concretePlant";
  }
}
class Foundry extends Building {
  constructor(tile, id) {
    super(tile, id);
    this.name = "foundry";
    this.tile = tile;
    Object.assign(this, findTarget);
  }

  processing(clickArea) {
    this.tileData = this.tile.dataset;
    this.tileData.productionTime = this.productionTime;
    if (!this.tileData.firstMatAmount) {
      this.tileData.firstMatAmount = 0;
      this.tileData.secondMatAmount = 0;
      this.tileData.itemAmountOutput1 = 0;
      this.tileData.itemAmountOutput2 = 0;
      this.tileData.itemAmountOutput3 = 0;
      this.tileData.thirdMatAmount = 0;
      this.tileData.semiFinishedAmount = 0;
    }
    const menu = this.createMenu(
      ThreeMatsProcessingMenu,
      this.name,
      buildingsMenuId[`${this.name}MenuId`]++,
      clickArea,
      this
    );
    const recipeObj = allItems.find((recipe) => recipe.producedIn === "foundry");
    this.itemProcessingMaterial(this.tile, menu, recipeObj);

    this.tileData.firstMatName = recipeObj.materials.res1Name;
    this.tileData.secondMatName = recipeObj.materials.res2Name;
    this.tileData.thirdMatName = recipeObj.materials.res3Name;
    this.tileData.semiFinishedType = recipeObj.name;

    this.tileData.itemTypeOutput1 = recipeObj.consumptionFor[0];
    this.tileData.itemTypeOutput2 = recipeObj.consumptionFor[1];
    this.tileData.itemTypeOutput3 = recipeObj.consumptionFor[2];
  }
}
class Assembly extends in3Out1Bld {
  constructor(tile, id) {
    super(tile, id);
    this.name = "assembly";
  }
}

class CarFactory extends in3Out1Bld {
  constructor(tile, id) {
    super(tile, id);
    this.name = "carFactory";
  }
}
