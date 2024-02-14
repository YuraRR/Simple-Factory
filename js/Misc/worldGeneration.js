class Generator {
  constructor(x, y) {
    this.x = x;
    this.z = y;
    Object.assign(this, findTarget);
  }
  generateOne(featureType, featureVariants, tile, origNeighbourType) {
    if (!tile) tile = document.getElementById(`${this.x}.${this.z}`);
    const featureVariant = randomArrayElem(featureVariants);
    if (
      (tile.dataset.type == "empty" || tile.dataset.type == origNeighbourType) &&
      !tile.dataset.featuresType
    ) {
      const img = document.createElement("img");
      img.src = `/img/features/${featureVariant}.webp`;
      img.draggable = false;
      img.classList.add(featureVariant);
      tile.appendChild(img);
      tile.dataset.featuresType = featureType;
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
          if (
            (tile.dataset.type === "empty" && Math.random() < probability) ||
            (tile.dataset.type === "empty" && min > counter)
          ) {
            if (featureType) {
              this.generateOne(featureType, featureVariants, tile);
            }
            tile.dataset.type = tileType;
            queue.push({ x: newX, y: newY });
          } else if (tile.dataset.type === "empty") {
            tile.dataset.type = tileType;
          }
          counter++;
        }
      };

      expandTile(0, -1); // Up
      expandTile(1, 0); // Right
      expandTile(0, 1); // Down
      expandTile(-1, 0); // Left
    }
  }
  generateAround(neighbourType, typeToPlace, layersAmount, featureType, featureVariants) {
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
              targetTile.dataset.type == "empty" &&
              ((topTile && topTile.dataset.type == neighbourType) ||
                (rightTile && rightTile.dataset.type == neighbourType) ||
                (bottomTile && bottomTile.dataset.type == neighbourType) ||
                (leftTile && leftTile.dataset.type == neighbourType))
            ) {
              if (Math.random() < 0.8) {
                targetTile.dataset.type = typeToPlace;
              } else {
                targetTile.dataset.type = neighbourType;
                this.generateOne(featureType, featureVariants, targetTile, origNeighbourType);
              }
            }
          }
        }
        counter++;
        neighbourType = origTypeToPlace;
        const tempTiles = document.querySelectorAll(`[data-type="${tempType}"]`);
        tempTiles.forEach((tile) => (tile.dataset.type = origTypeToPlace));
        createLayer(neighbourType, tempType);
      } else {
      }
    };
    createLayer(neighbourType, typeToPlace);
  }
}

class Water extends Generator {
  constructor(x, y) {
    super();
    this.x = x;
    this.z = y;
  }
  spawn() {
    let waterCell = document.getElementById(`${this.x}.${this.z}`);
    if (waterCell.dataset.type == "empty") {
      waterCell.dataset.type = "water";
      this.generateMultiply(10, 0.3, "water");
    }
  }
}
class Tree extends Generator {
  constructor(x, y) {
    super();
    this.x = x;
    this.z = y;
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
class WaterDecor extends Generator {
  constructor(x, y) {
    super();
    this.x = x;
    this.z = y;
  }
  spawn() {}
}
class Forest extends Generator {
  constructor(x, y) {
    super();
    this.x = x;
    this.z = y;
  }
  spawn() {
    const treesList = ["pine", "pines", "oak1", "oak2", "oak3", "oak4"];
    const bushesList = ["bush1", "bush2", "bush3", "bush4"];
    this.generateMultiply(15, 0.45, "forest", "tree", treesList);
    this.generateAround("forest", "flowers", 2, "bush", bushesList);
  }
}
class Sand extends Generator {
  constructor(x, y) {
    super();
    this.x = x;
    this.z = y;
  }
  spawn() {
    const decorList = ["reed"];
    this.generateAround("water", "sand", 2, "reed", decorList);
    const sandTiles = gridContainer.querySelectorAll(`[data-type="sand"]`);
    sandTiles.forEach((tile) => (tile.dataset.resType = "Sand"));
  }
}

class Ore {
  constructor(x, y, type) {
    this.x = x;
    this.z = y;
    this.type = type;
  }

  spawn() {
    let oreCell = document.getElementById(`${this.x}.${this.z}`);
    if (oreCell.dataset.type == "empty") {
      oreCell.dataset.type = "ore";
      oreCell.dataset.oreType = this.type;
    }
  }
}

class Iron extends Ore {
  constructor(x, y) {
    super(x, y, "iron");
  }
}

class Copper extends Ore {
  constructor(x, y) {
    super(x, y, "copper");
  }
}
class StoneRock extends Generator {
  constructor(x, y) {
    super();
    this.x = x;
    this.z = y;
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
    new objClass(randomId(), randomId()).spawn();
  }
}
let state = localStorage.getItem("toGenerate");
if (state == "true") {
  spawnObj(Water, 1);
  spawnObj(Sand, 1);
  spawnObj(Forest, 2);
  spawnObj(Tree, 20);
  spawnObj(Iron, 4);
  spawnObj(Copper, 4);
  spawnObj(StoneRock, 10);
} else {
  loadGame();
}
localStorage.setItem("toGenerate", "true");
