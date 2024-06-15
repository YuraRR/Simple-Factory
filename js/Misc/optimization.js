function deltaTimeout(callback, delay) {
  let start = performance.now();
  let elapsed = 0;

  function tick() {
    let now = performance.now();
    let deltaTime = now - start;
    start = now;
    elapsed += deltaTime;

    if (elapsed >= delay) {
      callback();
    } else {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}
// Объект для хранения всех наблюдателей
const observers = {};

// Функция для создания и сохранения наблюдателя
function observeDatasetChange(target, datasetKey, callback) {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "attributes" && mutation.attributeName === `data-${datasetKey}`) {
        callback(target.dataset[datasetKey], () => observer.disconnect());
      }
    });
  });

  observer.observe(target, {
    attributes: true,
    attributeFilter: [`data-${datasetKey}`],
  });

  observers[target.id] = observer;
}

// Функция для отключения наблюдателя по идентификатору элемента
function disconnectObserver(elementId) {
  if (observers[elementId]) {
    observers[elementId].disconnect();
    delete observers[elementId];
  }
}
