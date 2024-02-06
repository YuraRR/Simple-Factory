class Water {
  constructor(x, y, type) {
    this.x = x;
    this.z = y;
    this.type = type;
    Object.assign(this, findTarget);
  }

  spawn() {
    let waterCell = document.getElementById(`${this.x}.${this.z}`);
    if (waterCell.dataset.type == "empty") {
      waterCell.dataset.type = "water";
      this.expandWater();
    }
  }

  expandWater() {
    const probability = 0.45;
    const queue = [{ x: this.x, y: this.z }];

    while (queue.length > 0) {
      const currentTile = queue.shift();

      const expandTile = (dx, dy) => {
        const newX = currentTile.x + dx;
        const newY = currentTile.y + dy;
        const tile = document.getElementById(`${newX}.${newY}`);

        if (tile) {
          if (tile.dataset.type === "empty" && Math.random() < probability) {
            tile.dataset.type = "water";
            queue.push({ x: newX, y: newY });
          } else if (tile.dataset.type === "empty") {
            // Replace land with water
            tile.dataset.type = "water";
          }
        }
      };

      expandTile(0, -1); // Up
      expandTile(1, 0); // Right
      expandTile(0, 1); // Down
      expandTile(-1, 0); // Left
    }
  }
}
class Tree {
  constructor(x, y, type) {
    this.x = x;
    this.z = y;
    this.type = type;
    Object.assign(this, findTarget);
  }
  spawn() {
    let treeCell = document.getElementById(`${this.x}.${this.z}`);
    if (treeCell.dataset.type == "empty" && treeCell.dataset.featuresType != "tree") {
      treeCell.dataset.featuresType = "tree";
      let targetTile = this.findTargetTile();
      const img = document.createElement("img");
      img.src = "/img/features/tree.png";
      img.draggable = false;
      img.classList.add("tree");
      targetTile.appendChild(img);

      // TREE CHOPING

      img.addEventListener("dblclick", () => {
        const sound = new Audio("/sounds/test.m4a");
        sound.play();
        img.remove();
        delete treeCell.dataset.featuresType;
        woodAmount += 3;
      });
    }
  }
}
class Sand {
  constructor(x, y, type) {
    this.x = x;
    this.z = y;
    this.type = type;
    Object.assign(this, findTarget);
  }

  spawn() {
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        let targetTile = document.getElementById(`${i}.${j}`);
        let topTile = document.getElementById(`${i - 1}.${j}`);
        let rightTile = document.getElementById(`${i}.${j + 1}`);
        let bottomTile = document.getElementById(`${i + 1}.${j}`);
        let leftTile = document.getElementById(`${i}.${j - 1}`);

        if (targetTile.dataset.type == "empty") {
          if (
            (topTile && topTile.dataset.type == "water") ||
            (rightTile && rightTile.dataset.type == "water") ||
            (bottomTile && bottomTile.dataset.type == "water") ||
            (leftTile && leftTile.dataset.type == "water")
          ) {
            targetTile.dataset.type = "sand";
          }
        }
      }
    }
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

function spawnWater(amount) {
  for (let i = 0; i < amount; i++) {
    let waterNode = new Water(randomId(), randomId());
    waterNode.spawn();
  }
}
function spawnSand(amount) {
  for (let i = 0; i < amount; i++) {
    let sandNode = new Sand();
    sandNode.spawn();
  }
}
function spawnTrees(amount) {
  for (let i = 0; i < amount; i++) {
    let treeNode = new Tree(randomId(), randomId());
    treeNode.spawn();
  }
}
function spawnIron(amount) {
  for (let i = 0; i < amount; i++) {
    let ironNode = new Iron(randomId(), randomId());
    ironNode.spawn();
  }
}

function spawnCopper(amount) {
  for (let i = 0; i < amount; i++) {
    let copperNode = new Copper(randomId(), randomId());
    copperNode.spawn();
  }
}

function randomId() {
  return Math.floor(Math.random() * gridSize);
}

let state = localStorage.getItem("toGenerate");
if (state == "true") {
  spawnWater(1);
  spawnSand(1);
  spawnTrees(10);
  spawnIron(5);
  spawnCopper(10);
} else {
  loadGame();
}
localStorage.setItem("toGenerate", "true");
