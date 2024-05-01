class in2Out2Bld extends Building {
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
      this.tileData.itemAmountOutput2 = 0;
      this.tileData.semiFinishedAmount = 0;
    }
    const menu = this.createMenu(
      TwoMatsProcessingMenu,
      this.name,
      buildingsMenuId[`${this.name}MenuId`]++,
      clickArea,
      this
    );

    const waitingInterval = setInterval(() => {
      this.name == "oilRefinery" ? (this.tileData.firstMatName = "Oil Barrel") : "";
      if (this.tileData.firstMatName) {
        let itemMaterials;
        const recipeObj = allItems.find((recipe) => {
          if (this.name == recipe.producedIn) {
            itemMaterials = recipe.materials;
            return recipe.materials.res1Name == this.tileData.firstMatName;
          } else if (this.name == recipe.producedIn2) {
            itemMaterials = recipe.materials2;
            return recipe.materials2.res1Name == this.tileData.firstMatName;
          }
        });
        this.itemProcessingMaterial(this.tile, menu, recipeObj);
        this.tileData.firstMatName = itemMaterials.res1Name;
        this.tileData.secondMatName = itemMaterials.res2Name;
        this.tileData.semiFinishedType = recipeObj.name;

        this.tileData.itemTypeOutput1 = recipeObj.consumptionFor[0];
        this.tileData.itemTypeOutput2 = recipeObj.consumptionFor[1];
        clearInterval(waitingInterval);
      }
    }, 500);
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
    this.tileData.productionTime = this.productionTime;
    if (!this.tileData.firstMatAmount) {
      this.tileData.firstMatAmount = 0;
      this.tileData.secondMatAmount = 0;
      this.tileData.itemAmountOutput1 = 0;
    }

    const menu = this.createMenu(
      TwoMatsProcessingMenu,
      this.name,
      buildingsMenuId[`${this.name}MenuId`]++,
      clickArea
    );

    const recipeObj =
      this.name == "chemicalPlant"
        ? allItems.find((recipe) => recipe.producedIn2 === this.name)
        : allItems.find((recipe) => recipe.producedIn === this.name);
    this.itemProcessingMaterial(this.tile, menu, recipeObj);

    const itemMaterials = this.name == "chemicalPlant" ? recipeObj.materials2 : recipeObj.materials;
    this.tileData.firstMatName = itemMaterials.res1Name;
    this.tileData.secondMatName = itemMaterials.res2Name;
    this.tileData.itemTypeOutput1 = recipeObj.name;
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
