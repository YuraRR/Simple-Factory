const gridContainer = document.querySelector(".grid-container");
const limitContainer = document.querySelector("#limit-container");
const gridSize = 40;
// Создание сетки игры
const fragment = document.createDocumentFragment();

for (let i = 0; i < gridSize; i++) {
  for (let j = 0; j < gridSize; j++) {
    const cell = document.createElement("div");

    cell.classList.add("grid-cell");
    cell.id = i + "." + j;

    cell.dataset.type = "empty";
    cell.dataset.groundType = "grass";
    // cell.style.zIndex = i + j;
    fragment.appendChild(cell);
  }
}
gridContainer.appendChild(fragment);
gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 40px)`;
gridContainer.style.gridTemplateRows = `repeat(${gridSize}, 40px)`;
let scale = 1;
let offsetX = 0;
let offsetY = 0;
let animationFrameId;
const sensitivity = 0.35; // Коэффициент чувствительности
const dragThreshold = 7; // Порог для начала перемещения

let isDragging = false;
let startX, startY, startOffsetX, startOffsetY;

function handleWheel(event) {
  // Приближение с помощью колеса мыши
  event.preventDefault();
  const delta = event.deltaY * -0.01;
  zoom(delta);
}

limitContainer.addEventListener("wheel", handleWheel, { passive: false });

function zoom(delta) {
  const scaleFactor = 1.25; // Множитель масштаба

  if (delta > 0) {
    // Прокрутка вверх
    scale *= scaleFactor;
  } else {
    // Прокрутка вниз
    scale /= scaleFactor;
  }

  scale = Math.min(Math.max(0.3, scale), 4); // Ограничиваем масштаб от 0.5 до 4

  cancelAnimationFrame(animationFrameId);

  function animateZoom() {
    gridContainer.style.transform = `scale(${scale}) translate(${offsetX}px, ${offsetY}px) rotateX(45deg) rotateZ(45deg)`;
    animationFrameId = requestAnimationFrame(animateZoom);
  }

  animateZoom();
}

function handleMouseDown(event) {
  // Проверка, что событие было вызвано левой кнопкой мыши или колесиком
  if (event.button === 0 || event.button === 1) {
    // Начало перемещения
    isDragging = true;
    startX = event.clientX;
    startY = event.clientY;
    startOffsetX = offsetX;
    startOffsetY = offsetY;
  }
}

document.addEventListener("mousedown", handleMouseDown);

document.addEventListener("mouseup", () => {
  // Конец перемещения
  isDragging = false;
});

document.addEventListener("mousemove", (event) => {
  // Процесс перемещения
  if (isDragging && !blockCameraMove) {
    const deltaX = (event.clientX - startX) * sensitivity;
    const deltaY = (event.clientY - startY) * sensitivity;

    // Проверка на достаточное перемещение для начала перемещения
    if (Math.abs(deltaX) > dragThreshold || Math.abs(deltaY) > dragThreshold) {
      offsetX = startOffsetX + deltaX;
      offsetY = startOffsetY + deltaY;
      gridContainer.style.transform = `scale(${scale}) 
      translate(${offsetX}px, ${offsetY}px) rotateX(45deg) rotateZ(45deg)`;
    }
  }
});
let genState = localStorage.getItem("toGenerate");
if (genState == undefined) {
  localStorage.setItem("toGenerate", "true");
}
