const tasksTitle = document.querySelector(".tasks-menu__title");
const tasksList = document.querySelector(".tasks-menu__list");

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
          <p>Reward  <span class="green">$${reward}</span></p>
      </details>`;
  tasksList.insertAdjacentHTML("beforeend", taskHTML);

  const updatingValue = tasksList.querySelector(`#resUpdateId-${id}`);
  const taskInterval = setInterval(() => {
    const lastBuilding = document.querySelector(`[data-building-id="${buildingId - 1}"]`);
    switch (type) {
      case "storageRes":
        updatingValue.textContent = buildingResources[goalRes];
        buildingResources[goalRes] >= goalAmount ? completeTask(taskData, taskInterval) : "";
        break;
      case "resource":
        const itemProdObj = itemsProduced.find((item) => item.name == goalRes);
        updatingValue.textContent = itemProdObj.totalAmount;
        itemProdObj.totalAmount >= goalAmount ? completeTask(taskData, taskInterval) : "";
        break;
      case "building":
        !taskData.subtype && (updatingValue.textContent = buildingsMenuId[menuName] - 1);

        if (buildingsMenuId[menuName] - 1 < goalAmount) return;
        if (taskData.subtype) {
          if (lastBuilding && lastBuilding.dataset.itemTypeOutput1 == taskData.subtype) {
            updatingValue.textContent = buildingsMenuId[menuName] - 1;
            completeTask(taskData, taskInterval);
          }
        } else {
          completeTask(taskData, taskInterval);
        }

        break;
      case "export":
        const itemExportObj = itemsExported.find((item) => item.name == goalRes);
        itemExportObj.totalAmount >= goalAmount && completeTask(taskData, taskInterval);
        break;
      case "upgrade":
        const upgradedBld = allBuildingsList.find((bld) => bld.dataset.itemsMultiplier == 2);
        upgradedBld && completeTask(taskData, taskInterval);
        break;
      case "truck":
        trucksTotal >= goalAmount && completeTask(taskData, taskInterval);
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

function completeTask({ taskId, nextTaskId, unlockFeature, reward }, taskInterval) {
  const taskElem = tasksList.querySelector(`#taskId-${taskId}`);
  taskElem.classList.add("taskCompleted");

  clearInterval(taskInterval);
  questFinishedSound();
  unlockFeature && (lockedFeatures.find((elem) => elem.taskId === taskId).state = true);
  showMoneyChange(reward, "plus");
  deltaTimeout(() => {
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
      case 24:
        tasksTitle.textContent = "Simple Metallurgy";
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

addTask(0);
