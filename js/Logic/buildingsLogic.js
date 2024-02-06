class Mineshaft extends Building {
  constructor(tile, type, id, name) {
    super(tile, id, type, name);
    this.name = "mineshaft";
    this.type = type;
    this.cost = 100;
    this.itemStorage = 0;
    this.maxItemStorage = 10;
    this.tile = tile;
    this.tileData = tile.dataset;
    Object.assign(this, findTarget);
  }

  extraction(clickArea) {
    switch (this.tileData.oreType) {
      case "iron":
        this.tileData.itemTypeOutput = "Raw Iron Ore";
        break;
      case "copper":
        this.tileData.itemTypeOutput = "Raw Copper Ore";
        break;
    }

    if (!this.tileData.itemAmountOutput) {
      this.tileData.itemAmountOutput = 0;
    }

    let menu = this.createMenu(MineshaftMenu, "mineshaft", mineshaftMenuId, clickArea);
    let interval = setInterval(() => {
      this.tileData.itemAmountOutput++;
      this.generalStorageUpdate();
      if (this.itemStorage == this.maxItemStorage) {
        clearInterval(interval);
      }
    }, 4000);
  }
  generalStorageUpdate() {
    switch (this.type) {
      case "ironMineshaft":
        ironOreAmount++;
        let ironOreText = document.querySelector("#ironOreCounter");
        ironOreText.textContent = `Iron ore Amount: ${ironOreAmount}`;
        break;
      case "copperMineshaft":
        copperOreAmount++;
        let copperOreText = document.querySelector("#copperOreCounter");
        copperOreText.textContent = `Copper ore Amount: ${copperOreAmount}`;
    }
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
    const neighborsTiles = [
      this.findTopTile(),
      this.findRightTile(),
      this.findBottomTile(),
      this.findLeftTile(),
    ];
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
    this.tileData = tile.dataset;
  }
  addItemToStorage() {
    this.tileData.itemAmount = 0;
  }
}
