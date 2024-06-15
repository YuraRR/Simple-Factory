class Road extends Building {
  constructor(tile, id, type) {
    super(tile, id, type);
    this.direction = buildingDirection;
    this.name = type;
    this.tile = tile;
    this.tileData = tile.dataset;
    Object.assign(this, findTarget);
  }
}
class CargoStation extends Building {
  constructor(tile, id, type) {
    super(tile, id, type);
    this.direction = buildingDirection;
    this.name = "cargoStation";
    this.tile = tile;
    this.tileData = tile.dataset;
    Object.assign(this, findTarget);
  }
  stationCreate(clickArea) {
    const factoryImg = document.querySelector(".connection-hover");
    if (!factoryImg)
      return notyf.open({ type: "warning", message: "The cargo station needs to be placed near building!" });

    factoryImg.classList.remove("connection-hover");
    const factoryTile = factoryImg.parentElement;
    //Datasets
    this.tileData.direction = { 0: "up", 1: "right", 2: "down", 3: "left" }[buildingDirection];
    this.tileData.cargoStationType = "Export";
    this.tileData.cargoStationItem = "Empty";
    this.tileData.connectedTo = factoryTile.dataset.buildingType;
    this.tileData.connectedToId = factoryTile.dataset.buildingId;

    const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
    const stationsToBld = document.querySelectorAll(`[data-connected-to-id="${factoryTile.dataset.buildingId}"]`);
    this.tileData.stationLetter = alphabet[stationsToBld.length - 1];
    const stationData = this.updateData(factoryTile);
    this.createMenu("station", this.name, buildingsMenuId[`${this.name}MenuId`]++, clickArea, stationData);
    stationsList.push(this.tile);
  }
  updateData(mainFactoryTile, type, selectedExportItem) {
    if (mainFactoryTile) {
      const data = mainFactoryTile.dataset;
      let itemName, itemAmount;
      if ((type == "export" && data.buildingType != "tradingTerminal") || data.buildingCategory == "storage") {
        itemName = data.itemTypeOutput1;
        itemAmount = data.itemAmountOutput1;
      } else if (type == "export" && data.buildingType == "tradingTerminal") {
        itemName = selectedExportItem;
        itemAmount = 99;
      } else if (type == "import") {
        itemName = selectedExportItem;

        if (itemName == data.materialName1) itemAmount = data.materialAmount1;
        else if (itemName == data.materialName2) itemAmount = data.materialAmount2;
        else if (itemName == data.materialName3) itemAmount = data.materialAmount3;
        else itemAmount = 0;
      }
      let itemInfo = allItems.find((item) => item.name == itemName);
      if (!itemInfo) {
        itemInfo = {};
        itemInfo.price = 0;
        itemInfo.src = "";
      }
      const itemDataObj = {
        name: itemName,
        amount: parseInt(itemAmount, 10),
        multiplyMaterials: 0,
        buyPrice: itemInfo.price,
        sellPrice: itemInfo.price * 0.75,
        amountPerMin: 60 || 0,
        imgSrc: itemInfo.imageSrc,
        mainFactoryTile: mainFactoryTile,
        stationTile: this.tile,
        stationObj: this,
      };

      return itemDataObj;
    }
  }
}

class Garage extends Building {
  constructor(tile, id, type) {
    super(tile, id, type);
    this.direction = buildingDirection;
    this.name = "garage";
    this.tile = tile;
    Object.assign(this, findTarget);
  }
  garageCreate(clickArea) {
    this.createMenu("garage", this.name, buildingsMenuId[`${this.name}MenuId`]++, clickArea);
  }
}
class TradingTerminal extends Building {
  constructor(id, type) {
    super(id, type);
    this.direction = buildingDirection;
    this.name = "tradingTerminal";
    Object.assign(this, findTarget);
  }
}

function hideRoutes() {
  const allRouteTiles = document.querySelectorAll(".pointRoute, .topRoute, .rightRoute, .downRoute, .leftRoute");
  allRouteTiles.forEach((tile) => {
    tile.classList.remove("pointRoute", "topRoute", "rightRoute", "downRoute", "leftRoute");
  });
}
