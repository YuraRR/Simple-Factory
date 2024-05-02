class DynamicBuildings extends Building {
  constructor(tile, id, type) {
    super(tile, id, type);
    this.direction = buildingDirection;
    this.tile = tile;
    this.tileData = tile.dataset;
    Object.assign(this, findTarget);
  }

  curvedObjCreating() {
    const neighborsTiles = findNeighbors(this.tile);
    const [topTile, rightTile, bottomTile, leftTile] = neighborsTiles;

    const neighborsObjects = {
      currentObj: this.tile,
      upObj: topTile,
      rightObj: rightTile,
      downObj: bottomTile,
      leftObj: leftTile,
    };

    function placementConditions(currentObj) {
      const [upObj, rightObj, downObj, leftObj] = findNeighbors(currentObj).map((tile) => {
        if (currentTool == "pipe") {
          return tile.dataset.undergroundType === "pipe" ? tile : null;
        } else if (currentTool == "conveyor") {
          return tile.dataset.buildingCategory === "conveyor" ? tile : null;
        }
      });

      let upDataDir, rightDataDir, downDataDir, leftDataDir;
      upObj ? (upDataDir = upObj.dataset.direction) : "";
      rightObj ? (rightDataDir = rightObj.dataset.direction) : "";
      downObj ? (downDataDir = downObj.dataset.direction) : "";
      leftObj ? (leftDataDir = leftObj.dataset.direction) : "";

      let conditions = {};
      if (currentTool == "pipe") {
        conditions = {
          cross: upObj && rightObj && downObj && leftObj,
          tShapeTop: upObj && leftObj && rightObj,
          tShapeRight: rightObj && upObj && downObj,
          tShapeBottom: downObj && leftObj && rightObj,
          tShapeLeft: leftObj && upObj && downObj,
          topRightCorner: upObj && rightObj,
          rightBottomCorner: rightObj && downObj,
          bottomLeftCorner: downObj && leftObj,
          leftTopCorner: leftObj && upObj,
          vertical: upObj || downObj,
          horizontal: leftObj || rightObj,
        };
      } else if (currentTool == "conveyor") {
        const upToDown = upDataDir == "down",
          upToUp = upDataDir == "up",
          rightToLeft = rightDataDir == "left",
          rightToRight = rightDataDir == "right",
          downToUp = downDataDir == "up",
          downToDown = downDataDir == "down",
          leftToRight = leftDataDir == "right",
          leftToLeft = leftDataDir == "left";

        conditions = {
          UpCross:
            !upToDown &&
            !rightToRight &&
            !leftToLeft &&
            ((leftToRight && downToUp && rightToLeft) ||
              (leftToRight && downToUp) ||
              (leftToRight && rightToLeft) ||
              (downToUp && rightToLeft)),
          RightCross:
            !rightToLeft &&
            !downToDown &&
            ((leftToRight && downToUp && upToDown) ||
              (leftToRight && downToUp) ||
              (leftToRight && upToDown) ||
              (downToUp && upToDown)),
          DownCross:
            !downToUp &&
            !leftToLeft &&
            ((leftToRight && upToDown && rightToLeft) ||
              (leftToRight && upToDown) ||
              (leftToRight && rightToLeft) ||
              (upToDown && rightToLeft)),
          LeftCross:
            !leftToRight &&
            ((upToDown && downToUp && rightToLeft) ||
              (upToDown && downToUp) ||
              (upToDown && rightToLeft) ||
              (downToUp && rightToLeft)),

          UpRightCorner:
            (upToDown && rightToRight && !downToDown) || (upToDown && buildingDirection == 1 && !downObj),
          RightDownCorner:
            (rightToLeft && downToDown && !leftToLeft) || (rightToLeft && buildingDirection == 2 && !leftObj),
          DownLeftCorner: (downToUp && leftToLeft && !upToUp) || (downToUp && buildingDirection == 3 && !upObj),
          LeftUpCorner:
            (leftToRight && upToUp && !rightToRight) || (leftToRight && buildingDirection == 0 && !rightObj),

          RightUpCorner:
            (rightToLeft && upToUp && !leftToLeft) || (rightToLeft && buildingDirection == 0 && !leftObj),
          UpLeftCorner:
            (upToDown && leftToLeft && !downToDown) || (upToDown && buildingDirection == 3 && !downObj),
          LeftDownCorner:
            (leftToRight && downToDown && !rightToRight) || (leftToRight && buildingDirection == 2 && !rightObj),
          DownRightCorner: (downToUp && rightToRight && !upToUp) || (downToUp && buildingDirection == 1 && !upObj),

          Up: buildingDirection == 0 && (upToUp || downToUp),
          Right: buildingDirection == 1 && (rightToRight || leftToRight),
          Down: buildingDirection == 2 && (upToDown || downToDown),
          Left: buildingDirection == 3 && (rightToLeft || leftToLeft),
        };
      }

      return conditions;
    }

    const oppositeDirections = {
      up: ["DownCross", "DownRightCorner", "DownLeftCorner", "Down"],
      right: ["LeftCross", "LeftDownCorner", "LeftUpCorner", "Left"],
      down: ["UpCross", "UpRightCorner", "UpLeftCorner", "Up"],
      left: ["RightCross", "RightDownCorner", "RightUpCorner", "Right"],
    };

    setObjType(neighborsObjects.currentObj);
    if (currentTool == "pipe") {
      neighborsTiles.forEach((tile) => tile.dataset.undergroundType === "pipe" && setObjType(tile));
    } else if (currentTool == "conveyor") {
      const tile = findTargetTileByDirection(neighborsObjects.currentObj, false);
      tile.dataset.buildingCategory == "conveyor" ? setObjType(tile) : "";
    }
    function setObjType(obj, isNeighbour) {
      for (const [type, condition] of Object.entries(placementConditions(obj))) {
        if (!condition) continue;

        switch (currentTool) {
          case "pipe":
            const pipeImg = obj.querySelector('[data-image-type="pipe"]:not([data-ghost-img="true"]');
            if (pipeImg.dataset.pipeType != "connector") {
              pipeImg.dataset.pipeType = type;
              pipeImg.src = `/img/pipes/pipe-${type}.png`;
            }
            break;
          case "conveyor":
            function findKeyByValue(value) {
              for (const key in oppositeDirections) if (oppositeDirections[key].includes(value)) return key;
              return null;
            }
            const key = findKeyByValue(type);
            if (obj.dataset.direction != key) {
              const conveyorImg = obj.querySelector(
                '[data-image-type="conveyor"], [data-image-type="connector"]:not([data-ghost-img="true"])'
              );

              conveyorImg.dataset.conveyorType = type;
              conveyorImg.src = `/img/conveyors/conveyor-${type}.gif`;
              break;
            }
        }

        break;
      }
    }
  }
}
class Conveyor extends DynamicBuildings {
  constructor(tile, id, type) {
    super(tile, id, type);
    this.direction = buildingDirection;
    this.name = "conveyor";
    this.tile = tile;
    this.tileData = tile.dataset;
    this.splitterCounter = 0;
    Object.assign(this, findTarget);
  }
  addDirection(direction = this.direction) {
    !this.tileData.itemAmount ? (this.tileData.itemType = "") : null;

    const directionMapping = { 0: "up", 1: "right", 2: "down", 3: "left" };
    const directionInfo = directionMapping[direction];
    this.tileData.direction = directionInfo;
  }
  moveItem(factoryTile, nextTile, resName = factoryTile.dataset.itemTypeOutput1) {
    console.log(resName);
    const possibleTypes = ["conveyor", "splitter", "undergroundConveyor"];
    function createResImage(tile) {
      const img = document.createElement("img");
      img.src = findItemObjInList(resName).imageSrc;
      img.dataset.itemType = resName;
      img.dataset.imageType = "conveyorImg";
      img.dataset.imageItemId = conveyorItemId++;

      tile.appendChild(img);
      return img;
    }

    const resImage = createResImage(nextTile);
    //Moving loop
    const moveStep = (currentTile, resImage) => {
      const currentTileData = currentTile.dataset;
      //Import condition
      if (["import", "mixed"].includes(currentTileData.connectorType)) {
        resImage.remove();
        const mainFactoryTile = findTargetTileByDirection(currentTile, true);
        const factoryData = mainFactoryTile.dataset;
        if (factoryData.buildingCategory != "storage") {
          if (factoryData.firstMatName == resName) {
            factoryData.firstMatAmount++;
            factoryData.firstMatName = resName;
          } else if (factoryData.secondMatName == resName) {
            factoryData.secondMatAmount++;
            factoryData.secondMatName = resName;
          } else if (factoryData.thirdMatName == resName) {
            factoryData.thirdMatAmount++;
            factoryData.thirdMatName = resName;
          }
        } else if (
          factoryData.buildingCategory == "storage" &&
          (!factoryData.itemTypeOutput1 || factoryData.itemTypeOutput1 == resName)
        ) {
          factoryData.itemAmountOutput1++;
          factoryData.itemTypeOutput1 = resName;
        }

        if (currentTileData.connectorType == "mixed") {
          currentTileData.itemType = "";
          currentTileData.itemId = "";
        }
      } //Conveyor move condition
      else if (currentTileData.connectorType == "export" || possibleTypes.includes(currentTileData.buildingType)) {
        let nextTile = findTargetTileByDirection(currentTile, false);
        if (currentTileData.buildingType == "splitter" && currentTileData.itemType == "") {
          resImage.remove();
          resImage = createResImage(currentTile);
          nextTile = this.splitItems(currentTile);
        }
        if (currentTileData.buildingType == "undergroundConveyor") {
          const exitTile = document.querySelector(`[data-linked-with="${currentTileData.buildingId}"]`);
          if (exitTile) {
            resImage.remove();
            resImage = createResImage(exitTile);
            currentTile = exitTile;
            nextTile = findTargetTileByDirection(exitTile, false);

            currentTile.dataset.itemId = resImage.dataset.imageItemId;
            currentTile.dataset.itemType = resName;
          }
        }
        const nextTileData = nextTile.dataset;
        const [currentX, currentZ] = findXZpos(nextTile);
        const [previousX, previousZ] = findXZpos(currentTile);
        const xDifference = currentX - previousX;
        const zDifference = currentZ - previousZ;

        let conveyorDirection;
        if (currentTileData.direction == "down" || currentTileData.direction == "up") {
          if (xDifference == 1) conveyorDirection = "down";
          if (xDifference == -1) conveyorDirection = "up";
          if (zDifference == 1) conveyorDirection = "right";
          if (zDifference == -1) conveyorDirection = "left";
        } else {
          if (xDifference == 1) conveyorDirection = "down";
          else if (xDifference == -1) conveyorDirection = "up";
          else if (zDifference == 1) conveyorDirection = "right";
          else if (zDifference == -1) conveyorDirection = "left";
        }

        const splitterOffsets = {
          up: { property: "top", offset: -40 },
          right: { property: "left", offset: 40 },
          down: { property: "top", offset: 40 },
          left: { property: "left", offset: -40 },
        };

        const directionInfo = splitterOffsets[conveyorDirection];
        const { property, offset } = directionInfo;
        const currentStyle = parseInt(getComputedStyle(resImage)[property]) || 0;
        let isTilesFree;
        //Splitter condition
        if (nextTileData.buildingType == "splitter") {
          isTilesFree = this.splitItems(nextTile);
        }
        // Main condition
        (nextTileData.itemType == "" &&
          (nextTileData.buildingType != "splitter" || nextTileData.buildingType == "undergroundConveyor")) ||
        isTilesFree
          ? continueMove()
          : waitingSpace.bind(this)();
        // Waiting condition
        function waitingSpace() {
          const waitInterval = setInterval(() => {
            if (nextTileData.buildingType == "splitter") isTilesFree = this.splitItems(nextTile);
            if (
              (nextTileData.itemType == "" && nextTileData.buildingType != "splitter") ||
              isTilesFree ||
              (nextTileData.buildingType == "undergroundConveyor" &&
                nextTileData.linkedWith &&
                nextTileData.itemType == "")
            ) {
              continueMove();
              clearInterval(waitInterval);
            }
          }, 200);
        }

        function continueMove() {
          const isImageExist = document.querySelector(`[data-image-item-id="${currentTileData.itemId}"]`);
          let importConnectorAvailable;
          if (nextTileData.connectorType == "import") {
            const mainFactoryTile = findTargetTileByDirection(nextTile, true);
            const factoryData = mainFactoryTile.dataset;
            switch (factoryData.buildingCategory) {
              case "in1Out1":
              case "in1Out2":
              case "In":
                importConnectorAvailable = factoryData.firstMatName === resName;
                break;
              case "in2Out1":
              case "in2Out2":
                importConnectorAvailable =
                  factoryData.firstMatName === resName || factoryData.secondMatName === resName;
                break;
              case "in3Out1":
              case "in3Out3":
                importConnectorAvailable =
                  factoryData.firstMatName === resName ||
                  factoryData.secondMatName === resName ||
                  factoryData.thirdMatName === resName;
                break;
              case "storage":
                importConnectorAvailable =
                  (!factoryData.itemTypeOutput1 || factoryData.itemTypeOutput1 === resName) &&
                  +factoryData.itemAmountOutput1 < +factoryData.storageCapacity;
                break;
            }
          }
          if (
            isImageExist ||
            currentTileData.buildingType == "splitter" ||
            currentTileData.buildingType == "undergroundConveyor"
          ) {
            const canMakeNextMove =
              nextTileData.buildingType == "conveyor" ||
              importConnectorAvailable ||
              isTilesFree ||
              nextTileData.linkedWith;

            canMakeNextMove ? makeNextMove() : waitingSpace();

            function makeNextMove() {
              resImage.classList.add("fade-in");
              resImage.style[property] = currentStyle + offset + "px";
              const [x, z] = findXZpos(nextTile);
              resImage.style.zIndex = x + z + 1;
              if (nextTileData.buildingType == "connector" || nextTileData.buildingType == "splitter") {
                resImage.classList.remove("fade-in");
                resImage.classList.add("fade-out");
              }

              setTimeout(() => {
                moveStep(nextTile, resImage);
              }, 750);

              setTimeout(() => {
                currentTileData.itemType = "";
                currentTileData.itemId = "";
              }, 100);

              if (nextTileData.buildingType == "conveyor" || nextTileData.buildingType == "undergroundConveyor") {
                nextTile.dataset.itemId = resImage.dataset.imageItemId;
                nextTile.dataset.itemType = resName;
              }
            }
          }
        }
      }
    };
    //Start first move
    if (nextTile.dataset.itemType == "") {
      nextTile.dataset.itemId = resImage.dataset.imageItemId;
      nextTile.dataset.itemType = resName;
      moveStep(nextTile, resImage);
    }
  }
  splitItems(tile) {
    const neighborsTiles = findNeighbors(tile);

    const topTile = neighborsTiles[0];
    const rightTile = neighborsTiles[1];
    const bottomTile = neighborsTiles[2];
    const leftTile = neighborsTiles[3];

    switch (tile.dataset.direction) {
      case "up":
        return this.toSplit(topTile, rightTile, leftTile);
      case "right":
        return this.toSplit(topTile, rightTile, bottomTile);
      case "down":
        return this.toSplit(rightTile, bottomTile, leftTile);
      case "left":
        return this.toSplit(topTile, bottomTile, leftTile);
    }
  }
  toSplit(firstDir, secondDir, thirdDir) {
    switch (this.splitterCounter) {
      case 0:
        this.splitterCounter = (this.splitterCounter + 1) % 3;
        if (firstDir.dataset.itemType == "") return firstDir;
      case 1:
        this.splitterCounter = (this.splitterCounter + 1) % 3;
        if (secondDir.dataset.itemType == "") return secondDir;
      case 2:
        this.splitterCounter = (this.splitterCounter + 1) % 3;
        if (thirdDir.dataset.itemType == "") return thirdDir;
      default:
        if (firstDir.dataset.itemType == "") return firstDir;
        else if (secondDir.dataset.itemType == "") return secondDir;
        else if (thirdDir.dataset.itemType == "") return thirdDir;
    }
  }
}
