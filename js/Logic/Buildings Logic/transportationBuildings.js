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
    Object.assign(this, findTarget);
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

        if (itemName == data.firstMatName) itemAmount = data.firstMatAmount;
        else if (itemName == data.secondMatName) itemAmount = data.secondMatAmount;
        else if (itemName == data.thirdMatName) itemAmount = data.thirdMatAmount;
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
  addStationToList(menu, tile) {
    const stationsList = document.querySelector(".routesInfo-menu__stationsList");
    const htmlContent = `
    <div class="routesInfo-menu__stationBlock" id="stationMenu${menu.dataset.cargoStationId}">
        <span>${formatString(tile.dataset.connectedTo)} ${menu.dataset.menuId}</span>
    </div>`;
    stationsList.insertAdjacentHTML("beforeend", htmlContent);
    const stationBlock = stationsList.querySelector(`#stationMenu${menu.dataset.cargoStationId}`);
    stationBlock.onclick = () => menu.classList.remove("hidden");

    const noStations = interfaceСont.querySelector(".noStations");
    stationsList.children.length > 1 ? noStations.classList.add("hidden") : noStations.classList.remove("hidden");
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
