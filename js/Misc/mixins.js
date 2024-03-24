const findTarget = {
  findTargetTile(x = this.x, z = this.z) {
    return document.getElementById(`${x}.${z}`) || { dataset: { type: null } };
  },
  findTopTile(x = this.x, z = this.z) {
    return document.getElementById(`${x - 1}.${z}`) || { dataset: { type: null } };
  },
  findTopRightTile(x = this.x, z = this.z) {
    return document.getElementById(`${x - 1}.${z + 1}`) || { dataset: { type: null } };
  },
  findRightTile(x = this.x, z = this.z) {
    return document.getElementById(`${x}.${z + 1}`) || { dataset: { type: null } };
  },
  findRightBottomTile(x = this.x, z = this.z) {
    return document.getElementById(`${x + 1}.${z + 1}`) || { dataset: { type: null } };
  },
  findBottomTile(x = this.x, z = this.z) {
    return document.getElementById(`${x + 1}.${z}`) || { dataset: { type: null } };
  },
  findBottomLeftTile(x = this.x, z = this.z) {
    return document.getElementById(`${x + 1}.${z - 1}`) || { dataset: { type: null } };
  },
  findLeftTile(x = this.x, z = this.z) {
    return document.getElementById(`${x}.${z - 1}`) || { dataset: { type: null } };
  },
  findLeftTopTile(x = this.x, z = this.z) {
    return document.getElementById(`${x - 1}.${z - 1}`) || { dataset: { type: null } };
  },
};
//OCUPIED TILES
const ocupieTiles = {
  tilesOccupation(xSize, zSize) {
    let occupiedTiles = [];
    const mainTile = document.getElementById(`${this.x}.${this.z}`);
    this.mainTileData = mainTile.dataset;
    for (let i = 0; i < xSize; i++) {
      for (let j = 0; j < zSize; j++) {
        const currentTile = document.getElementById(`${this.x + i}.${this.z + j}`);
        if (currentTile) {
          this.tileData = currentTile.dataset;
          if (this.mainTileData.type == "building") {
            this.tileData.type = this.mainTileData.type;
            this.tileData.buildingType = this.mainTileData.buildingType;
            this.tileData.buildingId = this.mainTileData.buildingId;
          }

          if (this.mainTileData.featuresType) {
            this.tileData.featuresType = this.mainTileData.featuresType;
          }
          if (this.mainTileData.buildingCategory) {
            this.tileData.buildingCategory = this.mainTileData.buildingCategory;
          }

          if (this.name == "quarry") {
            const nearTile = document.getElementById([`${this.x + i}.${this.z + j}`]);
            const neighborsTiles = findNeighbors(nearTile);
            neighborsTiles.forEach((tile) => {
              if (tile.dataset.type == "water") {
                tile.dataset.groundType = "sand";
                tile.dataset.resType = "Sand";
                const featureImg = tile.firstChild;
                if (featureImg) {
                  featureImg.remove();
                  tile.removeAttribute("data-features-type");
                }
              }
            });
          }
          occupiedTiles.push(currentTile);
        }
      }
    }
    return occupiedTiles;
  },
};
