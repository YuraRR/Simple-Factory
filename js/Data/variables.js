//MENU ID
let truckIdCounter = 1;
let conveyorItemId = 1;

const buildingsMenuId = {};
//BUILDING ID
let buildingId = 1;
let structureBlockId = 1;
//GLOBAL AMOUNT
let totalEnergy = 0;
//BUILDING DIRECTIONS
let DIRECTIONS;
let buildingDirection = 0;
let currentTool;
//MISC
let allOpenedMenu = [];
let blockCameraMove = false;
let undergroundOpened = false;
let fillingMode = false;
let foundryType;
let conveyorIntervalId;
let cheatMode = false;
let isPaused = false;
let costIntervalUpdate;
let routeCreationObj;
let soundsVolume;

const interfaceСont = document.querySelector("#interface-container");
//MONEY
let money = 5000;
//TRUCKS
let trucksTotal = 0;
let trucksAvailable = 0;
let routeId = 1;
let allRoutesList = [];
let allBuildingsList = [];
let stationsList = [];

const lockedFeatures = [
  {
    name: "Unlimited Delivery",
    taskId: 8,
    state: false,
  },
];
const buildingCategories = {
  in1Out1: ["oreProcessing", "steelFoundry", "sawmill", "crushingPlant"],
  in1Out2: ["steelMill"],
  in2Out1: ["smallAssembly", "cementPlant", "glassFactory", "brickFactory", "chemicalPlant"],
  in2Out2: ["smallFoundry", "oilRefinery"],
  in3Out1: ["concretePlant", "bigAssembly"],
  in3Out3: ["foundry"],
  Out: ["mineshaft", "quarry", "rubberTreePlantation", "lumbermill"],
  In: ["powerPlant"],
  conveyor: ["conveyor", "connector", "splitter", "undergroundConveyor"],
  storage: ["mediumStorage", "smallStorage"],
  energy: ["powerPlant", "windTurbine"],
  transportation: ["gravelRoad", "concreteRoad", "garage", "cargoStation"],
};
const structuresList = [
  {
    factoryName: "mineshaft",
    structures: ["TNT"],
  },
  {
    factoryName: "quarry",
    structures: ["Crusher"],
    Stone: "Gravel",
    Limestone: "Crushed Limestone",
  },
  {
    factoryName: "rubberTreePlantation",
    structures: [""],
  },
  {
    factoryName: "lumbermill",
    structures: [""],
  },
  {
    factoryName: "foundry",
    recipesList: {
      recipe1: {
        material: "Molten Iron",
        product: "Iron Pipes",
      },
      recipe2: {
        material: "Molten Iron",
        product: "Iron Gears",
      },
      recipe3: {
        material: "Molten Iron",
        product: "Iron Feedstock",
      },
      recipe4: {
        material: "Molten Copper",
        product: "Copper Plates",
      },
      recipe5: {
        material: "Molten Copper",
        product: "Copper Coil",
      },
    },
  },
  {
    factoryName: "steelMill",
    recipesList: {
      recipe1: {
        material: "Molten Steel",
        product: "Steel Beams",
      },
      recipe2: {
        material: "Molten Steel",
        product: "Steel Bolts",
      },
      recipe3: {
        material: "Molten Steel",
        product: "Steel Plates",
      },
    },
  },
  {
    factoryName: "smallFoundry",
    recipesList: {
      recipe1: {
        material: "Molten Copper(impure)",
        product: "Copper Plates",
      },
      recipe2: {
        material: "Molten Copper(impure)",
        product: "Copper Coil",
      },
      recipe3: {
        material: "Molten Iron(impure)",
        product: "Iron Pipes",
      },
      recipe4: {
        material: "Molten Iron(impure)",
        product: "Iron Gears",
      },
    },
  },
  {
    factoryName: "oilRefinery",
    recipesList: {
      recipe1: {
        material: "Oil",
        product: "Rubber",
      },
      recipe2: {
        material: "Oil",
        product: "Plastic",
      },
    },
  },
];
//COLORS
const colors = [
  "#ff6666", // Светло-красный
  "#66ff66", // Светло-зеленый
  "#6666ff", // Светло-синий
  "#ffff99", // Светло-желтый
  "#ff99ff", // Светло-розовый
  "#99ffff", // Светло-бирюзовый
  "#996699", // Светло-фиолетовый
  "#ffcc66", // Светло-оранжевый
  "#66cc66", // Светло-темно-зеленый
  "#6666cc", // Светло-темно-синий
  "#cc6666", // Светло-темно-красный
  "#66cc66", // Светло-темно-зеленый лес
  "#cc66cc", // Светло-темно-фиолетовый
  "#6699e1", // Светло-стальной синий
  "#f09999", // Светло-лососевый
  "#66e0cc", // Светло-бирюзовый
  "#ffdcb3", // Светло-золотой
  "#ccae66", // Светло-темно-золотой
  "#66cccc", // Светло-темно-бирюзовый
  "#b38258", // Светло-коричневый
  "#8ebf8e", // Светло-морская зелень
  "#ffae99", // Светло-томатный
  "#8f9c6b", // Светло-темно-оливковый
  "#ccae7a", // Светло-перуанский коричневый
  "#9480cd", // Светло-темно-сиреневый
  "#c4876b", // Светло-коричнево-красный
  "#ae99cc", // Светло-темно-фиолетовый
  "#c4876b", // Светло-коричнево-красный
  "#f5f5f5", // Светло-ледяной
  "#66cccc", // Светло-темно-циан
];
