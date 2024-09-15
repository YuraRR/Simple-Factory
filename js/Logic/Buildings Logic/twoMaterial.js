class in2Out2Bld extends Building {
  constructor(tile, id) {
    super(tile, id);
    this.tile = tile;
    Object.assign(this, findTarget);
  }
  processing(clickArea) {
    this.tileData = this.tile.dataset;
    if (!this.tileData.materialAmount1) {
      this.tileData.materialAmount1 = 0;
      this.tileData.materialAmount2 = 0;
      this.tileData.itemAmountOutput1 = 0;
      this.tileData.itemAmountOutput2 = 0;
      this.tileData.semiFinishedAmount = 0;
    }
    const menu = this.createMenu(2, this.name, buildingsMenuId[`${this.name}MenuId`]++, clickArea, this);
    // this.name == "oilRefinery" ? (this.tileData.materialName1 = "Oil Barrel") : "";

    const checkInterval = setInterval(() => {
      if (this.tileData.materialName1) {
        const recipeObj = allItems.find(
          (recipe) =>
            recipe.producedIn === this.name &&
            (recipe.materials.res1Name == this.tileData.materialName1 ||
              recipe.materials.res2Name == this.tileData.materialName1)
        );
        if (!recipeObj) return;

        this.itemProcessingMaterial(this.tile, menu, recipeObj);
        this.tileData.materialName1 = recipeObj.materials.res1Name;
        this.tileData.materialName2 = recipeObj.materials.res2Name;
        this.tileData.semiFinishedType = recipeObj.itemName;

        this.tileData.itemTypeOutput1 = recipeObj.consumptionFor[0];
        this.tileData.itemTypeOutput2 = recipeObj.consumptionFor[1];
        clearInterval(checkInterval);
      }
    }, 1000);
  }
}
class in2Out1Bld extends Building {
  constructor(tile, id) {
    super(tile, id);
    this.tile = tile;
    Object.assign(this, findTarget);
  }
  processing(clickArea) {
    this.tileData = this.tile.dataset;
    if (!this.tileData.materialAmount1) {
      this.tileData.materialAmount1 = 0;
      this.tileData.materialAmount2 = 0;
      this.tileData.itemAmountOutput1 = 0;
    }

    const menu = this.createMenu(2, this.name, buildingsMenuId[`${this.name}MenuId`]++, clickArea, this);

    const checkInterval = setInterval(() => {
      if (this.tileData.materialName1) {
        const recipeObj = allItems.find((recipe) => recipe.producedIn === this.name);
        this.itemProcessingMaterial(this.tile, menu, recipeObj);
        const storageObj = {
          id: this.tileData.buildingId,
          resName: this.tileData.itemTypeOutput1,
          resAmount: +this.tileData.itemAmountOutput1,
          storageType: "factory",
        };
        storageResources.push(storageObj);
        this.tileData.materialName1 = recipeObj.materials.res1Name;
        this.tileData.materialName2 = recipeObj.materials.res2Name;
        recipeObj.isAltRecipe == true ? (this.tileData.itemTypeOutput1 = recipeObj.itemName) : recipeObj.name;
        clearInterval(checkInterval);
      }
    }, 1000);
  }
}
class GlassFactory extends in2Out1Bld {
  constructor(tile, id) {
    super(tile, id);
    this.name = "glassFactory";
  }
}
class CementPlant extends in2Out1Bld {
  constructor(tile, id) {
    super(tile, id);
    this.name = "cementPlant";
  }
}
class BrickFactory extends in2Out1Bld {
  constructor(tile, id) {
    super(tile, id);
    this.name = "brickFactory";
  }
}
class SmallAssembly extends in2Out1Bld {
  constructor(tile, id) {
    super(tile, id);
    this.name = "smallAssembly";
  }
}
class OilRefinery extends in2Out2Bld {
  constructor(tile, id) {
    super(tile, id);
    this.name = "oilRefinery";
  }
}
class SmallFoundry extends in2Out2Bld {
  constructor(tile, id) {
    super(tile, id);
    this.name = "smallFoundry";
  }
}
class ChemicalPlant extends in2Out1Bld {
  constructor(tile, id) {
    super(tile, id);
    this.name = "chemicalPlant";
  }
}
