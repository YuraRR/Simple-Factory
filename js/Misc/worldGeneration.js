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
      !tile.dataset.featuresType
    ) {
      const img = document.createElement("img");
      img.src = `/img/features/${featureVariant}.webp`;
      img.draggable = false;
      img.classList.add(featureVariant);
      img.dataset.imageType = featureType;
      tile.appendChild(img);
      tile.dataset.featuresType = featureType;
      img.style.zIndex = this.x + this.z;
    }
  }
  generateMultiply(min, probability, tileType, featureType, featureVariants) {
    let counter = 0;
    const queue = [{ x: this.x, y: this.z }];

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
            queue.push({ x: newX, y: newY });
          } else if (tile.dataset.groundType == "grass") {
            tile.dataset.groundType = tileType;
          }
          counter++;
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
              } else {
                targetTile.dataset.groundType = neighbourType;
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
      this.generateMultiply(10, 0.35, "water");
    }
  }
}
class Tree extends Generator {
  constructor(x, z) {
    super();
    this.x = x;
    this.z = z;
  }
  spawn() {
    const treesList = ["pine", "oak1", "oak2", "oak3", "oak4"];
    this.generateOne("tree", treesList);
  }
  // TREE CHOPING

  // img.addEventListener("dblclick", () => {
  //   const sound = new Audio("/sounds/test.m4a");
  //   sound.play();
  //   img.remove();
  //   delete treeCell.dataset.featuresType;
  //   woodAmount += 3;
  // });
}

class Forest extends Generator {
  constructor(x, z) {
    super();
    this.x = x;
    this.z = z;
  }
  spawn() {
    const treesList = ["pine", "pines", "oak1", "oak2", "oak3", "oak4"];
    const bushesList = ["bush1", "bush2", "bush3", "bush4"];
    this.generateMultiply(15, 0.3, "forest", "tree", treesList);
    this.generateAround("forest", "flowers", 2, "bush", bushesList, 0.2);
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
    this.generateAround("water", "sand", 2, "reed", decorList, 0.3);
    const tiles = gridContainer.querySelectorAll(`[data-ground-type="sand"]`);
    tiles.forEach((tile) => (tile.dataset.resType = "Sand"));
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

    const rockTiles = this.tilesOccupation(3, 3);
    if (rockTiles.length == 9 && rockTiles.every((tile) => !tile.dataset.featuresType)) {
      this.generateOne("limeStoneRock", limestoneRocks, rockTiles[0], "", "limestone");
      this.tilesOccupation(3, 3);
    }
    rockTiles.forEach((tile) => {
      const [currentX, currentZ] = findXZpos(tile);
      const neighborsTilesFunc = findNeighbors.bind(this, currentX, currentZ);
      const neighborsTiles = neighborsTilesFunc();
      neighborsTiles.forEach((tile) => {
        tile.dataset.groundType = "limestone";
        tile.dataset.resType = "Limestone";
      });
    });

    const rocksList = ["stone1", "stone2", "stone3", "stone4"];
    this.generateAround("limestone", "stone", 3, "rock", rocksList, 0.05);
  }
}
class Stone extends Generator {
  constructor(x, z) {
    super();
    this.x = x;
    this.z = z;
  }
  spawn() {
    this.generateMultiply(3, 0.1, "stone");
    const tiles = gridContainer.querySelectorAll(`[data-ground-type="stone"]`);
    tiles.forEach((tile) => (tile.dataset.resType = "Stone"));
  }
}
class Ore {
  constructor(x, z, type) {
    this.x = x;
    this.z = z;
    this.type = type;
  }

  spawn() {
    let oreCell = document.getElementById(`${this.x}.${this.z}`);
    if (oreCell.dataset.type == "empty") {
      oreCell.dataset.type = "ore";
      oreCell.dataset.groundType = "ore";
      oreCell.dataset.oreType = this.type;
    }
  }
}

class Iron extends Ore {
  constructor(x, z) {
    super(x, z, "iron");
  }
}

class Copper extends Ore {
  constructor(x, z) {
    super(x, z, "copper");
  }
}
class StoneRock extends Generator {
  constructor(x, z) {
    super();
    this.x = x;
    this.z = z;
  }
  spawn() {
    const rocksList = ["stone1", "stone2", "stone3", "stone4"];
    this.generateOne("rock", rocksList);
  }
}

function randomId() {
  return Math.floor(Math.random() * gridSize);
}
function randomArrayElem(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}
function spawnObj(objClass, amount) {
  for (let i = 0; i < amount; i++) {
    function findEmptyTile() {
      const x = randomId();
      const z = randomId();
      const randomTile = document.getElementById(`${x}.${z}`);
      if (randomTile.dataset.groundType == "grass") {
        new objClass(x, z).spawn();
      } else findEmptyTile();
    }
    findEmptyTile();
  }
}
let state = localStorage.getItem("toGenerate");
if (state == "true") {
  spawnObj(Water, 1);
  spawnObj(Sand, 1);
  spawnObj(Clay, 2);
  spawnObj(Limestone, 1);
  spawnObj(Stone, 1);
  spawnObj(Forest, 2);
  spawnObj(Tree, 20);
  spawnObj(Iron, 4);
  spawnObj(Copper, 4);
  spawnObj(StoneRock, 10);
} else {
  loadGame();
}
localStorage.setItem("toGenerate", "true");
