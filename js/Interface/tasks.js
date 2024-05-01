const tasksTitle = document.querySelector(".tasks-menu__title");
const tasksList = document.querySelector(".tasks-menu__list");
const allTasks = [
  {
    title: "Collect resources",
    description: `<span class="orange">Demolotion Mode</span> is activated by pressing (D) 
    or by pressing button in right toolbar.
    To demolish a objects like trees or buildings you need to hold the <span class="orange">right mouse button</span>`,
    type: "resource",
    goalRes: "Wood",
    goalAmount: 5,
    taskId: 0,
    nextTaskId: [1, 2],
    reward: 100,
  },
  {
    title: "Process Wood into",
    description: `Collect <span class="orange">Wood</span> in Destruction mode (D), 
    and double click on resource to process it into <span class="orange">Planks</span>`,
    type: "resource",
    goalRes: "Planks",
    goalAmount: 10,
    taskId: 1,
    reward: 100,
  },
  {
    title: "Process Stone into",
    description: `Collect <span class="orange">Stone</span> in Destruction mode (D) by holding the right mouse button, 
    and double click on resource to process it into <span class="orange">Gravel</span>`,
    type: "resource",
    goalRes: "Gravel",
    goalAmount: 10,
    taskId: 2,
    nextTaskId: 3,
    reward: 100,
  },
  {
    title: "Build",
    description: `<span class="orange">Small Storage</span> is needed to store resources and use them for construction`,
    type: "building",
    goalRes: "",
    goalAmount: 1,
    goalBuilding: "Small Storage",
    menuName: "smallStorageMenuId",
    taskId: 3,
    nextTaskId: [4, 5],
    reward: 100,
  },
  {
    title: "Build",
    description: `Build <span class="orange">a garage</span> and buy <span class="orange">2 Trucks</span> `,
    type: "building",
    goalRes: "",
    goalAmount: 1,
    goalBuilding: "Garage",
    menuName: "garageMenuId",
    taskId: 4,
    nextTaskId: "",
    reward: 100,
  },
  {
    title: "Build Cargo Stations and Roads",
    description: `Build <span class="orange">Cargo Stations</span> attached to Trading Terminal and Small Storage. 
    Connect them by roads`,
    type: "building",
    goalRes: "",
    goalAmount: 2,
    goalBuilding: "Cargo Station",
    menuName: "cargoStationMenuId",
    taskId: 5,
    nextTaskId: 6,
    reward: 100,
  },
  {
    title: "Create a route",
    description: `Create <span class="orange">a route </span> between two Cargo Stations
    and deliver <span class="orange">Mechanical Parts</span> to Small Storage`,
    type: "resource",
    goalRes: "Mechanical Parts",
    goalAmount: 32,
    taskId: 6,
    nextTaskId: [7, 8, 9],
    reward: 100,
  },
  {
    title: `Build`,
    description: `Unlock and build <span class="orange">Wind Turbine</span> to produce first energy`,
    type: "building",
    goalRes: "",
    goalAmount: 1,
    goalBuilding: "Wind Turbine",
    menuName: "windTurbineMenuId",
    taskId: 7,
    nextTaskId: "",
    reward: 100,
  },
  {
    title: `Build`,
    description: `Build <span class="orange">a Stone Quarry</span> on tiles with stone.`,
    type: "building",
    goalRes: "",
    goalAmount: 1,
    goalBuilding: "Stone Quarry",
    menuName: "quarryMenuId",
    subtype: "Stone",
    taskId: 8,
    nextTaskId: [9, 10],
    reward: 100,
  },
  {
    title: "Buy",
    description: `Build another <span class="orange">Small Storage </span>
    and deliver <span class="orange">50 Bricks </span> from another Cargo Station connected to Trading Terminal`,
    type: "resource",
    goalRes: "Bricks",
    goalAmount: 50,
    taskId: 9,
    nextTaskId: "",
    reward: 100,
  },
  {
    title: `Build`,
    description: `Build <span class="orange">a Crushing Plant</span> to produce Gravel from Stone.`,
    type: "building",
    goalRes: "",
    goalAmount: 1,
    goalBuilding: "Crushing Plant",
    menuName: "crushingPlantMenuId",
    taskId: 10,
    nextTaskId: 11,
    reward: 100,
  },
  {
    title: "Produce a",
    description: `Process <span class="orange">Stone</span> into <span class="orange">Gravel</span> 
    and move it to the <span class="orange">Storage</span>`,
    type: "resource",
    goalRes: "Gravel",
    goalAmount: 30,
    taskId: 11,
    nextTaskId: [12, 13, 14],
    reward: 100,
  },
  {
    title: `Build`,
    description: `Build <span class="orange">a Sand Quarry</span> on tiles with sand.`,
    type: "building",
    goalRes: "",
    goalAmount: 1,
    goalBuilding: "Sand Quarry",
    menuName: "quarryMenuId",
    subtype: "Sand",
    taskId: 12,
    nextTaskId: "",
    reward: 100,
  },
  {
    title: `Build`,
    description: `Build <span class="orange">a Clay Quarry</span> on tiles with clay.`,
    type: "building",
    goalRes: "",
    goalAmount: 1,
    goalBuilding: "Clay Quarry",
    menuName: "quarryMenuId",
    subtype: "Clay",
    taskId: 13,
    nextTaskId: "",
    reward: 100,
  },
  {
    title: `Build`,
    description: `Build <span class="orange">a Water Pump</span> to produce Water.
    Connect Pump with Brick Factory by pipes`,
    type: "building",
    goalRes: "",
    goalAmount: 1,
    goalBuilding: "Water Pump",
    menuName: "waterPumpMenuId",
    taskId: 14,
    nextTaskId: [15, 16],
    reward: 100,
  },
  {
    title: `Build`,
    description: `Build <span class="orange">a Brick Factory</span> to produce Bricks from Clay and Sand.`,
    type: "building",
    goalRes: "",
    goalAmount: 1,
    goalBuilding: "Brick Factory",
    menuName: "brickFactoryMenuId",
    taskId: 15,
    nextTaskId: "",
    reward: 100,
  },

  {
    title: "Produce a",
    description: `Process <span class="orange">Clay</span> into <span class="orange">Bricks</span>
    and move it to the <span class="orange">Storage</span>`,
    type: "resource",
    goalRes: "Bricks",
    goalAmount: 30,
    taskId: 16,
    nextTaskId: [17, 18, 19],
    reward: 100,
  },
  {
    title: `Build`,
    description: `<span class="orange">a Lumbermill</span> 
    cut down trees around and producing <span class="orange">Wood</span>.`,
    type: "building",
    goalRes: "",
    goalAmount: 1,
    goalBuilding: "Lumbermill",
    menuName: "lumbermillMenuId",
    taskId: 17,
    nextTaskId: "",
    reward: 100,
  },
  {
    title: `Build`,
    description: `Build <span class="orange">a Sawmill</span> 
    to produce <span class="orange">Planks</span> from Wood.`,
    type: "building",
    goalRes: "",
    goalAmount: 1,
    goalBuilding: "Sawmill",
    menuName: "sawmillMenuId",
    taskId: 18,
    nextTaskId: "",
    reward: 100,
  },
  {
    title: "Produce a",
    description: `Process <span class="orange">Wood</span> into <span class="orange">Planks</span>
    and move it to the <span class="orange">Storage</span>`,
    type: "resource",
    goalRes: "Planks",
    goalAmount: 30,
    taskId: 19,
    nextTaskId: [20, 21, 22, 23],
    reward: 100,
  },
  {
    title: `Build`,
    description: `Build <span class="orange">a Limestone Quarry</span> on tiles with limestone.`,
    type: "building",
    goalRes: "",
    goalAmount: 1,
    goalBuilding: "Limestone Quarry",
    menuName: "quarryMenuId",
    subtype: "Limestone",
    taskId: 20,
    nextTaskId: "",
    reward: 100,
  },
  {
    title: `Build`,
    description: `Build <span class="orange">a Crushing Plant</span> 
    to produce <span class="orange">Crushed Limestone</span> from Limestone.`,
    type: "building",
    goalRes: "",
    goalAmount: 1,
    goalBuilding: "Crushing Plant",
    menuName: "crushingPlantMenuId",
    taskId: 21,
    nextTaskId: "",
    reward: 100,
  },
  {
    title: `Build`,
    description: `Build <span class="orange">a Glass Factory</span> 
    to produce <span class="orange">Planks</span> from Wood.`,
    type: "building",
    goalRes: "",
    goalAmount: 1,
    goalBuilding: "Glass Factory",
    menuName: "glassFactoryMenuId",
    taskId: 22,
    nextTaskId: "",
    reward: 100,
  },
  {
    title: "Produce a",
    description: `Process <span class="orange">Sand and Crushed Limestone</span> into <span class="orange">Glass</span>
    and move it to the <span class="orange">Storage</span>`,
    type: "resource",
    goalRes: "Glass",
    goalAmount: 30,
    taskId: 23,
    nextTaskId: [24, 25],
    reward: 100,
  },
  {
    title: `Build`,
    description: `Build <span class="orange">a Mineshaft</span> 
    to produce <span class="orange">Iron Ore</span> `,
    type: "building",
    goalAmount: 1,
    goalBuilding: "Iron Mineshaft",
    subtype: "Iron Ore",
    menuName: "mineshaftMenuId",
    taskId: 24,
    nextTaskId: 26,
    reward: 100,
  },
  {
    title: `Build`,
    description: `Build <span class="orange">a Mineshaft</span> 
    to produce <span class="orange">Coal Ore</span> `,
    type: "building",
    goalAmount: 1,
    goalBuilding: "Coal Mineshaft",
    subtype: "Coal Ore",
    menuName: "mineshaftMenuId",
    taskId: 25,
    nextTaskId: 27,
    reward: 100,
  },
  {
    title: `Build`,
    description: `Build <span class="orange">a Crushing Plant</span> and pick recipe 
    to produce <span class="orange">Crushed Iron</span> `,
    type: "building",
    goalAmount: 1,
    goalBuilding: "Crushing Plant (Iron)",
    subtype: "Crushed Iron",
    menuName: "crushingPlantMenuId",
    taskId: 26,
    nextTaskId: "",
    reward: 100,
  },
  {
    title: `Build`,
    description: `Build <span class="orange">a Small Foundry</span> and pick recipe 
    to produce <span class="orange">Molten Iron</span> `,
    type: "building",
    goalAmount: 1,
    goalBuilding: "Small Foundry (Iron)",
    subtype: "",
    menuName: "smallFoundryMenuId",
    taskId: 27,
    nextTaskId: [28, 29],
    reward: 100,
  },
  {
    title: "Produce a",
    description: `Process <span class="orange">Crushed Iron and Coal Ore</span> into <span class="orange">Iron Gears</span> 
    and move it to the <span class="orange">Storage</span>`,
    type: "resource",
    goalRes: "Iron Gears",
    goalAmount: 30,
    taskId: 28,
    nextTaskId: "",
    reward: 100,
  },
  {
    title: "Produce a",
    description: `Process <span class="orange">Crushed Iron and Coal Ore</span> into <span class="orange">Iron Pipes</span> 
    and move it to the <span class="orange">Storage</span>`,
    type: "resource",
    goalRes: "Iron Pipes",
    goalAmount: 30,
    taskId: 29,
    nextTaskId: "",
    reward: 100,
  },
  // {
  //   title: "Buy resources 2",
  //   description: `Build another <span class="orange">Small Storage </span>
  //   and deliver <span class="orange">50 Iron Pipes </span> from another Cargo Station connected to Trading Terminal`,
  //   type: "resource",
  //   goalRes: "Iron Pipes",
  //   goalAmount: 50,
  //   taskId: 10,
  //   nextTaskId: "",
  //   reward: `<span class="blue">Unlimited Delivery </span>`,
  //   unlockFeature: "Unlimited Delivery",
  // },
];

function addTask(id) {
  const taskData = allTasks.find((task) => task.taskId === id);
  const { title, description, type, goalRes, goalBuilding, goalAmount, menuName, reward } = taskData;
  const taskHTML = `
      <details id="taskId-${id}">
          <summary>
          ${title}
          <span class="orange">${goalRes || goalBuilding}</span>
          <span class="updatingValue" id="resUpdateId-${id}">0</span>
          <span>/${goalAmount}</span>
          </summary>
          <p>${description}</p>
          <p>Reward ${reward}$</p>
      </details>`;
  tasksList.insertAdjacentHTML("beforeend", taskHTML);

  const updatingValue = tasksList.querySelector(`#resUpdateId-${id}`);
  const taskInterval = setInterval(() => {
    const lastBuilding = document.querySelector(`[data-building-id="${buildingId - 1}"]`);
    switch (type) {
      case "resource":
        updatingValue.textContent = buildingResources[goalRes];
        buildingResources[goalRes] >= goalAmount ? completeTask(taskData, taskInterval) : "";
        break;
      case "building":
        !taskData.subtype && (updatingValue.textContent = buildingsMenuId[menuName] - 1);
        if (buildingsMenuId[menuName] > goalAmount) {
          if (taskData.subtype) {
            if (lastBuilding.dataset.itemTypeOutput1 == taskData.subtype) {
              updatingValue.textContent = buildingsMenuId[menuName] - 1;
              completeTask(taskData, taskInterval);
            }
          } else {
            completeTask(taskData, taskInterval);
          }
        }

        break;
    }
  }, 500);

  document.addEventListener("keydown", (event) => {
    if (event.code == "KeyX") {
      completeTask(taskData);
      clearInterval(taskInterval);
    }
  });
}

function completeTask({ taskId, nextTaskId, unlockFeature }, taskInterval) {
  const taskElem = tasksList.querySelector(`#taskId-${taskId}`);
  taskElem.classList.add("taskCompleted");

  clearInterval(taskInterval);
  questFinishedSound();
  unlockFeature && (lockedFeatures.find((elem) => elem.taskId === taskId).state = true);

  setTimeout(() => {
    switch (taskId) {
      case 0:
        tasksTitle.textContent = "Basic Materials";
        break;
      case 2:
        tasksTitle.textContent = "Trucks deliveries";
        break;
      case 6:
        tasksTitle.textContent = "First Energy";
        break;
      case 9:
        tasksTitle.textContent = "Building Materials";
        break;
    }

    taskElem.remove();
    if (Array.isArray(nextTaskId)) {
      nextTaskId.forEach((id) => addTask(id));
    } else {
      nextTaskId && addTask(nextTaskId);
    }
  }, 2000);
}

addTask(5);
