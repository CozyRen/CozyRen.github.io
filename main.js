// Глобальный обработчик ошибок
window.onerror = function(msg, url, lineNo, columnNo, error) {
  console.error('Ошибка: ' + msg + '\nURL: ' + url + '\nСтрока: ' + lineNo + '\nКолонка: ' + columnNo + '\nОбъект ошибки: ' + JSON.stringify(error));
  return false;
};

// Исполнение когда DOM загружен
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM полностью загружен');
  
  // Прокручиваем страницу вверх при загрузке
  window.scrollTo(0, 0);
  
  // Убедимся, что фокус на верхней части страницы
  setTimeout(() => {
    window.scrollTo({
      top: 0,
      behavior: 'auto'
    });
  }, 100);
  
  try {
    console.log('Инициализация всех модулей');
    
    // Инициализация базовых модулей
    if (typeof initLoadingScreen === 'function') initLoadingScreen();
    if (typeof initConnectionMonitor === 'function') initConnectionMonitor();
    if (typeof initThemeToggle === 'function') initThemeToggle();
    if (typeof initSmoothScrolling === 'function') initSmoothScrolling();
    
    // Инициализация кнопок и интерактивных элементов
    if (typeof initHeroButtons === 'function') initHeroButtons();
    if (typeof initMobileMenu === 'function') initMobileMenu();
    
    // Инициализация функциональных модулей
    if (typeof initLetterEnvelope === 'function') initLetterEnvelope();
    if (typeof initRelationshipCounter === 'function') {
      console.log('Инициализация счетчика отношений');
      initRelationshipCounter();
    } else {
      console.error('Функция initRelationshipCounter не найдена');
    }
    if (typeof initComplimentGenerator === 'function') initComplimentGenerator();
    if (typeof initLovePoems === 'function') initLovePoems();
    if (typeof initLoveMessageGenerator === 'function') initLoveMessageGenerator();
    if (typeof initMemoriesSlider === 'function') initMemoriesSlider();
    if (typeof initVirtualGifts === 'function') initVirtualGifts();
    if (typeof initMusicPlayerInteractions === 'function') initMusicPlayerInteractions();
    
    // Особенно важно: инициализация игры
    if (typeof initLoveGame === 'function') {
      console.log('Инициализация игры "Поймай мое сердце"');
      initLoveGame();
    } else {
      console.error('Функция initLoveGame не найдена');
    }
    
    // Проверка наличия кнопки начала игры и добавление прямого обработчика
    setTimeout(() => {
      const startGameBtn = document.getElementById('start-game');
      if (startGameBtn) {
        console.log('Кнопка "Начать игру" найдена, добавляем дополнительный обработчик');
        startGameBtn.onclick = function(e) {
          console.log('Дополнительный обработчик: нажата кнопка "Начать игру"');
          e.preventDefault();
          if (typeof window.startGame === 'function') {
            window.startGame();
          } else {
            console.error('Функция startGame не найдена в глобальном контексте');
          }
        };
      } else {
        console.error('Кнопка "Начать игру" не найдена в DOM');
      }
    }, 500);
    
    console.log('Все модули инициализированы');
    
    // Добавим обработчики событий для всех кнопок для отладки
    document.querySelectorAll('button').forEach(button => {
      console.log('Найдена кнопка:', button.id || button.textContent);
      button.addEventListener('click', function(e) {
        console.log('Клик по кнопке:', this.id || this.textContent);
      });
    });
    
    // Добавляем глобальное логирование кликов для отладки
    document.addEventListener('click', function(e) {
      console.log('Click detected on:', e.target);
    });
  } catch (error) {
    console.error("Ошибка при инициализации модулей:", error);
  }
}); 