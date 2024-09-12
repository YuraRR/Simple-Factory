class CargoStationMenu extends BuildingMenu {
  constructor(tile, id) {
    super(tile, id);
    this.tile = tile;
    this.tileData = tile.dataset;
    this.id = id;
    this.name = "cargoStation";
    this.menuOpened = false;
  }
  menuCreation(item) {
    const container = document.querySelector("#menu-container");
    const menu = document.createElement("div");
    const menuData = menu.dataset;

    menuData.menuId = this.id;
    menuData.menuType = this.name;
    menuData.parentTileId = this.tile.id;
    menu.classList.add("cargoStationMenu", "hidden");
    menu.id = `CargoStation${this.id}`;
    this.title = this.name.replace(/([A-Z])/g, " $1");
    this.defaultItem = item;
    menu.innerHTML = `
        <h2>${this.title} ${this.id} (${this.tileData.connectedTo})</h2>
      <button class="close-button close-button-black"></button>`;

    menu.dataset.cargoStationId = this.id;
    this.tileData.stationId = this.id;
    menu.dataset.parentTileId = this.tile.id;
    menu.querySelectorAll("img").forEach((image) => {
      image.draggable = false;
    });
    container.appendChild(menu);
    this.closeButton(menu);

    dragElement(menu.id);
  }
  menuUpdate(menu, defaultItem) {
    setInterval(() => this.forceMenuUpdate(menu, defaultItem), 500);
    this.selectImportMaterial(menu, defaultItem);
    this.selectExportMaterial(menu, defaultItem);
  }
}
