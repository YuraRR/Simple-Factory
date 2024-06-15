class Generator {
  constructor(x, z) {
    Object.assign(this, findTarget);
    Object.assign(this, ocupieTiles);
    this.x = x;
    this.z = z;
  }
  generateOne(featureType, featureVariants, tile, origNeighbourType, groundType) {
    if (!tile) tile = document.getElementById(`${this.x}.${this.z}`);
    this.id = tile.id.split(["."]);
    this.x = parseInt(this.id[0]);
    this.z = parseInt(this.id[1]);
    const featureVariant = randomArrayElem(featureVariants);
    if (
      (tile.dataset.groundType == "grass" ||
        tile.dataset.groundType == origNeighbourType ||
        tile.dataset.groundType == groundType) &&
      !tile.dataset.featuresType &&
      !tile.dataset.buildingType &&
      tile.dataset.type == "empty"
    ) {
      const img = document.createElement("img");
      img.src = `./img/features/${featureVariant}.webp`;
      img.draggable = false;
      img.classList.add(featureVariant);
      img.dataset.imageType = "natureFeature";
      img.dataset.imageSubType = featureType;
      tile.appendChild(img);
      tile.dataset.mainTile = true;
      tile.dataset.featuresType = featureType;
      img.style.zIndex = this.x + this.z;
    }
  }
  generateMultiply(min, probability, tileType, featureType, featureVariants) {
    let counter = 0;
    const queue = [{ x: this.x, y: this.z }];
    const allTiles = [];
    while (queue.length > 0) {
      const currentTile = queue.shift();

      const expandTile = (dx, dy) => {
        const newX = currentTile.x + dx;
        const newY = currentTile.y + dy;
        const tile = document.getElementById(`${newX}.${newY}`);

        if (tile) {
          if (tileType == "water") tile.dataset.type = "water";
          if (
            (tile.dataset.groundType == "grass" && Math.random() < probability) ||
            (tile.dataset.groundType == "grass" && min > counter)
          ) {
            if (featureType) this.generateOne(featureType, featureVariants, tile);
            tile.dataset.groundType = tileType;
            tile.dataset.subGroundType = tileType + Math.floor(Math.random() * 2);
            queue.push({ x: newX, y: newY });
          } else if (tile.dataset.groundType == "grass") {
            tile.dataset.groundType = tileType;
            tile.dataset.subGroundType = tileType + Math.floor(Math.random() * 2);
          }
          counter++;
          allTiles.push(tile);
        }
      };

      // Используйте только горизонтальные и вертикальные смещения
      const horizontalValues = [-1, 1];
      const verticalValues = [-1, 1];

      // Генерация случайных горизонтальных и вертикальных смещений
      const randomDX = randomArrayElem(horizontalValues);
      const randomDY = randomArrayElem(verticalValues);

      // Применение смещений
      expandTile(randomDX, 0); // Горизонтальное смещение
      expandTile(0, randomDY); // Вертикальное смещение
    }
    if (tileType == "forest") {
      const forestTile = randomArrayElem(allTiles);
      console.log(forestTile);
      playAmbientSound(forestTile, "birds");
    }
    if (tileType == "water") {
      const waterTile = randomArrayElem(allTiles);
      playAmbientSound(waterTile, "lake");
      console.log(waterTile);
    }
  }

  generateAround(neighbourType, typeToPlace, layersAmount, featureType, featureVariants, featureChance) {
    let counter = 0;
    const origTypeToPlace = typeToPlace;
    const origNeighbourType = neighbourType;
    const tempType = `${typeToPlace}Temp`;
    const createLayer = (neighbourType, typeToPlace) => {
      if (counter < layersAmount) {
        for (let i = 0; i < gridSize; i++) {
          for (let j = 0; j < gridSize; j++) {
            const targetTile = this.findTargetTile(i, j);
            const topTile = this.findTopTile(i, j);
            const rightTile = this.findRightTile(i, j);
            const bottomTile = this.findBottomTile(i, j);
            const leftTile = this.findLeftTile(i, j);
            if (
              targetTile.dataset.groundType == "grass" &&
              ((topTile && topTile.dataset.groundType == neighbourType) ||
                (rightTile && rightTile.dataset.groundType == neighbourType) ||
                (bottomTile && bottomTile.dataset.groundType == neighbourType) ||
                (leftTile && leftTile.dataset.groundType == neighbourType))
            ) {
              if (Math.random() > featureChance) {
                targetTile.dataset.groundType = typeToPlace;
                targetTile.dataset.subGroundType = origTypeToPlace + Math.floor(Math.random() * 3);
              } else {
                targetTile.dataset.groundType = neighbourType;
                targetTile.dataset.subGroundType = neighbourType + Math.floor(Math.random() * 3);
                if (neighbourType == "water") targetTile.dataset.type = "water";
                this.generateOne(featureType, featureVariants, targetTile, origNeighbourType);
              }
            }
          }
        }
        counter++;
        neighbourType = origTypeToPlace;
        const tempTiles = document.querySelectorAll(`[data-ground-type="${tempType}"]`);
        tempTiles.forEach((tile) => (tile.dataset.groundType = origTypeToPlace));
        createLayer(neighbourType, tempType);
      } else {
      }
    };
    createLayer(neighbourType, typeToPlace);
  }
}

class Water extends Generator {
  constructor(x, z) {
    super();
    this.x = x;
    this.z = z;
  }
  spawn() {
    let tile = document.getElementById(`${this.x}.${this.z}`);
    if (tile.dataset.groundType == "grass") {
      tile.dataset.groundType = "water";
      tile.dataset.type = "water";
      this.generateMultiply(20, 0.6, "water");
    }
  }
}
class Tree extends Generator {
  constructor(x, z) {
    super();
    this.x = x;
    this.z = z;
  }
  spawn(ground) {
    const treesList = ["pine", "oak", "mixedTrees"];
    this.generateOne("tree", treesList, "", "", ground);
  }
}

class Forest extends Generator {
  constructor(x, z) {
    super();
    this.x = x;
    this.z = z;
  }
  spawn() {
    const treesList = ["pine", "oak", "mixedTrees"];
    const bushesList = ["bush"];
    this.generateMultiply(20, 0.3, "forest", "tree", treesList);
    this.generateAround("forest", "flowers", 1, "bush", bushesList, 0.2);
    this.generateAround("flowers", "grass2", 2, "bush", bushesList, 0.2);
  }
}
class Sand extends Generator {
  constructor(x, z) {
    super();
    this.x = x;
    this.z = z;
  }
  spawn() {
    const decorList = ["reed"];
    this.generateAround("water", "sand", 2, "reed", decorList, 0.15);
    const tiles = gridContainer.querySelectorAll(`[data-ground-type="sand"]`);
    tiles.forEach((tile) => {
      const neighborsTiles = findNeighbors(tile);

      const matchedCells = neighborsTiles.filter((cell) => cell.dataset.type == "water");

      if (matchedCells.length >= 3) {
        tile.dataset.type = "water";
        tile.dataset.groundType = "water";
        tile.dataset.subGroundType = "water1";
      } else {
        tile.dataset.resType = "Sand";
      }
    });
    this.generateAround("sand", "grass2", 1, "", [], "");
  }
}
class Clay extends Generator {
  constructor(x, z) {
    super();
    this.x = x;
    this.z = z;
  }
  spawn() {
    this.generateMultiply(10, 0.2, "clay");
    const tiles = gridContainer.querySelectorAll(`[data-ground-type="clay"]`);
    tiles.forEach((tile) => (tile.dataset.resType = "Clay"));
    this.generateAround("clay", "grass2", 1, "", [], "");
  }
}
class Limestone extends Generator {
  constructor(x, z) {
    super();
    this.x = x;
    this.z = z;
  }
  spawn() {
    this.generateMultiply(15, 0.5, "limestone");
    const tiles = gridContainer.querySelectorAll(`[data-ground-type="limestone"]`);
    tiles.forEach((tile) => (tile.dataset.resType = "Limestone"));
    const limestoneRocks = ["limeStoneRock2"];

    const rockTiles = this.tilesOccupation(2, 2);
    if (rockTiles.length == 4 && rockTiles.every((tile) => !tile.dataset.featuresType)) {
      this.generateOne("limeStoneRock", limestoneRocks, rockTiles[0], "", "limestone");
      this.tilesOccupation(2, 2);
    }

    rockTiles.forEach((tile) => {
      const neighborsTiles = findNeighbors(tile);
      neighborsTiles.forEach((tile) => {
        tile.dataset.groundType = "limestone";
        tile.dataset.resType = "Limestone";
      });
    });

    const rocksList = ["stone1", "stone2"];
    this.generateAround("limestone", "stone", 4, "rock", rocksList, 0.05);
  }
}
class Stone extends Generator {
  constructor(x, z) {
    super();
    this.x = x;
    this.z = z;
  }
  spawn() {
    this.generateMultiply(15, 0.7, "stone");
    const tiles = gridContainer.querySelectorAll(`[data-ground-type="stone"]`);
    const rocksList = ["stone1", "stone2"];

    tiles.forEach((tile) => {
      tile.dataset.resType = "Stone";
      const randomNum = Math.floor(Math.random() * 9);
      randomNum == 0 ? this.generateOne("rock", rocksList, tile, "", "stone") : "";
    });
  }
}
class Ore extends Generator {
  constructor(x, z, type) {
    super();
    this.x = x;
    this.z = z;
    this.type = type;
  }

  spawn() {
    const targetGroundType = this.type == "quartz" ? "limestone" : "stone";
    const targetTiles = document.querySelectorAll(`[data-ground-type="${targetGroundType}"]`);

    const oreTile = randomArrayElem(targetTiles);
    oreTile.dataset.type = "ore";
    oreTile.dataset.groundType = "ore";
    oreTile.dataset.oreType = this.type;

    this.generateAround("ore", "deepOre", 1, "", [], 0);

    const tiles = gridContainer.querySelectorAll(`[data-ground-type="deepOre"]:not([data-ore-type])`);
    tiles.forEach((tile) => {
      tile.dataset.oreType = this.type;
      tile.classList.add("deepOreGround");
    });
  }
}

class Iron extends Ore {
  constructor(x, z) {
    super(x, z, "Iron Ore");
  }
}

class Copper extends Ore {
  constructor(x, z) {
    super(x, z, "Copper Ore");
  }
}
class Coal extends Ore {
  constructor(x, z) {
    super(x, z, "Coal Ore");
  }
}
class Sulfur extends Ore {
  constructor(x, z) {
    super(x, z, "Sulfur Ore");
  }
}
class StoneRock extends Generator {
  constructor(x, z) {
    super();
    this.x = x;
    this.z = z;
  }
  spawn() {
    const rocksList = ["stone1", "stone2"];
    this.generateOne("rock", rocksList);
  }
}
class BigStoneRock extends Generator {
  constructor(x, z) {
    super();
    this.x = x;
    this.z = z;
  }
  spawn() {
    const stoneTiles = document.querySelectorAll('[data-ground-type="stone"');
    const tile = randomArrayElem(stoneTiles);
    const [x, z] = findXZpos(tile);
    this.x = x;
    this.z = z;
    const rockTiles = this.tilesOccupation(2, 2);
    if (
      rockTiles.length == 4 &&
      rockTiles.every((tile) => !tile.dataset.featuresType && tile.dataset.groundType == "stone")
    ) {
      this.generateOne("bigStoneRock", ["bigStoneRock1"], rockTiles[0], "", "stone");
      this.tilesOccupation(2, 2);
    } else {
      spawnObj(BigStoneRock, 1);
    }
  }
}
function spawnTerminal() {
  let z = randomId();
  z + 3 > gridSize ? (z -= 3) : "";

  const cell = document.getElementById(`0.${z}`);
  const newBuilding = new TradingTerminal(cell);
  newBuilding.getId(cell.id);
  cell.dataset.type = "building";
  cell.dataset.buildingType = "tradingTerminal";
  cell.dataset.buildingId = 0;
  cell.dataset.mainTile = "true";
  cell.dataset.buildingCategory = "terminal";
  cell.dataset.idByType = 1;

  const buildingTiles = newBuilding.tilesOccupation(6, 3);
  newBuilding.createBuildingImage(buildingTiles[5]);
  newBuilding.createClickArea(6, 3);
  cell.firstChild.style.zIndex = "1";

  const pricesMenu = document.querySelector(".pricesInfo-menu");
  document.querySelector(`[data-building-type="tradingTerminal"] .clickArea`).onclick = () => {
    pricesMenu.classList.remove("hidden");
    allOpenedMenu.push(pricesMenu);
  };
}

function randomId() {
  return Math.floor(Math.random() * gridSize);
}
function randomArrayElem(nodeList) {
  const array = Array.from(nodeList);

  const filteredArray = array.filter(
    (item) => typeof item !== "object" || item.dataset.featuresType === undefined
  );
  if (filteredArray.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredArray.length);
    return filteredArray[randomIndex];
  } else {
    return null;
  }
}

function spawnObj(objClass, amount) {
  for (let i = 0; i < amount; i++) {
    function findEmptyTile() {
      const x = randomId();
      const z = randomId();
      const randomTile = document.getElementById(`${x}.${z}`);
      randomTile.dataset.groundType == "grass" && randomTile.dataset.type == "empty"
        ? new objClass(x, z).spawn()
        : findEmptyTile();
    }
    findEmptyTile();
  }
}
function generateWorld() {
  spawnTerminal();
  spawnObj(Water, 1);
  spawnObj(Sand, 1);
  spawnObj(Forest, 2);
  spawnObj(Clay, 2);
  spawnObj(Limestone, 1);
  spawnObj(Stone, 3);
  spawnObj(Tree, 5);
  spawnObj(Iron, 2);
  spawnObj(Copper, 1);
  spawnObj(Coal, 2);
  spawnObj(Sulfur, 1);
  spawnObj(StoneRock, 10);
  spawnObj(BigStoneRock, 6);
  sounds.wind.play();
}
