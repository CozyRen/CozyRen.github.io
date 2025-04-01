// =================== Любовная игра ===================
function initLoveGame() {
  console.log('Инициализация любовной игры');
  
  // Получаем основные элементы игры
  const gameArea = document.getElementById('game-area');
  const startGameBtn = document.getElementById('start-game');
  const restartGameBtn = document.getElementById('restart-game');
  const gameScoreDisplay = document.getElementById('game-score');
  const gameTimeDisplay = document.getElementById('game-time');
  const finalScoreDisplay = document.getElementById('final-score');
  const gameStart = document.getElementById('game-start');
  const gameEnd = document.getElementById('game-end');
  
  // Дополнительная проверка элемента счета
  if (gameScoreDisplay) {
    console.log('Элемент счета найден:', gameScoreDisplay);
  } else {
    console.error('Элемент счета (game-score) не найден!');
    // Пробуем найти родительский элемент
    const scoreContainer = document.querySelector('.game-score');
    if (scoreContainer) {
      console.log('Нашли контейнер счета:', scoreContainer);
      // Можно попробовать создать элемент, если его нет
    }
  }
  
  // Проверяем наличие основных элементов
  if (!gameArea) {
    console.error('Элемент игровой области (game-area) не найден!');
    return;
  }
  
  if (!startGameBtn) {
    console.error('Кнопка начала игры (start-game) не найдена!');
    // Продолжаем работу, так как кнопка рестарта может быть доступна
  } else {
    console.log('Кнопка start-game найдена');
  }
  
  console.log('Основные элементы игры найдены');
  
  // Игровые переменные
  let score = 0;
  let timeLeft = 18;
  let gameInterval;
  let heartCreateInterval;
  let speedUpInterval;
  let isGameRunning = false;
  let recordScore = localStorage.getItem('loveGameRecord') || 0;
  let unlockedGifts = JSON.parse(localStorage.getItem('unlockedGifts')) || [];
  
  // Настройки игры
  let heartCreationSpeed = 1000; // Уменьшаем интервал между появлением сердечек (было 1800)
  let minHeartCreationSpeed = 700; // Уменьшаем минимальный интервал (было 1000)
  let fallingSpeed = { min: 5, max: 8 }; // Еще больше замедляем падение сердечек
  let specialHeartChance = 0.2; // 20% вероятность особого сердца
  let quickHeartChance = 0.25; // 25% вероятность быстрого сердца (нового типа)
  let heartTypes = ['❤️', '💖', '💗', '💘', '💝', '💕']; // Типы обычных сердец
  let specialHeartTypes = ['💖', '💝']; // Типы особых сердец
  let quickHeartTypes = ['💓']; // Типы быстрых маленьких сердец
  
  // Определение порогов для разблокировки подарков
  const giftThresholds = [
    { score: 10, giftId: 'kiss', title: 'Поцелуй' },
    { score: 15, giftId: 'compliment', title: 'Комплимент' },
    { score: 25, giftId: 'hug', title: 'Обнимашки' },
    { score: 30, giftId: 'food', title: 'Еда' },
    { score: 35, giftId: 'story', title: 'История' },
    { score: 45, giftId: 'teddy', title: 'Мягкая игрушка' }
  ];
  
  // Отображаем рекорд, если есть элемент
  const gameRecordDisplay = document.getElementById('game-record');
  if (gameRecordDisplay) {
    gameRecordDisplay.textContent = recordScore;
  }
  
  // Создаем аудио эффекты
  const createAudio = (src) => {
    const audio = new Audio();
    audio.src = src;
    audio.volume = 0.3;
    return audio;
  };
  
  // Эмулируем звуковые эффекты (в реальном проекте здесь были бы пути к звуковым файлам)
  const heartClickSound = {
    play: function() {
      // Эмуляция звука клика по сердечку
      try {
        const context = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = 440;
        gain.gain.value = 0.1;
        
        oscillator.connect(gain);
        gain.connect(context.destination);
        
        oscillator.start(0);
        gain.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 0.5);
        
        setTimeout(() => {
          oscillator.stop();
        }, 500);
      } catch (e) {
        console.log('Звуковой эффект не поддерживается');
      }
    }
  };
  
  const specialHeartSound = {
    play: function() {
      // Эмуляция звука клика по особому сердечку
      try {
        const context = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        
        oscillator.type = 'triangle';
        oscillator.frequency.value = 660;
        gain.gain.value = 0.1;
        
        oscillator.connect(gain);
        gain.connect(context.destination);
        
        oscillator.start(0);
        gain.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 0.8);
        
        setTimeout(() => {
          oscillator.stop();
        }, 800);
      } catch (e) {
        console.log('Звуковой эффект не поддерживается');
      }
    }
  };
  
  const quickHeartSound = {
    play: function() {
      // Эмуляция звука клика по быстрому сердечку
      try {
        const context = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        
        oscillator.type = 'square';
        oscillator.frequency.value = 550;
        gain.gain.value = 0.1;
        
        oscillator.connect(gain);
        gain.connect(context.destination);
        
        oscillator.start(0);
        gain.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 0.4);
        
        setTimeout(() => {
          oscillator.stop();
        }, 400);
      } catch (e) {
        console.log('Звуковой эффект не поддерживается');
      }
    }
  };
  
  // Начало игры
  function startGame() {
    console.log('Запуск игры');
    
    // Проверяем, что игровая область существует
    if (!gameArea) {
      console.error('Невозможно запустить игру - игровая область не найдена');
      return;
    }
    
    if (isGameRunning) {
      console.log('Игра уже запущена, пропускаем...');
      return;
    }
    
    // Инициализируем обработчики для игровой области
    initGameArea();
    
    // Сбрасываем предыдущие результаты
    score = 0;
    timeLeft = 18;
    isGameRunning = true;
    heartCreationSpeed = 1000; // Уменьшаем интервал между появлением сердечек (было 1800)
    
    // Обновляем отображение
    if (gameScoreDisplay) gameScoreDisplay.textContent = score;
    if (gameTimeDisplay) gameTimeDisplay.textContent = timeLeft;
    
    // Принудительный вызов обновления счета для проверки
    updateScore();
    
    // Добавляем отладку анимации
    const debugAnimations = true;
    if (debugAnimations) {
      console.log('Включена отладка анимаций');
      // Добавим слушатель для регистрации всех анимаций в документе
      document.addEventListener('animationstart', function(e) {
        console.log('Запуск анимации:', e.animationName, 'на элементе:', e.target);
      });
      
      document.addEventListener('animationend', function(e) {
        console.log('Завершение анимации:', e.animationName, 'на элементе:', e.target);
      });
    }
    
    // Интервал для периодического обновления счета на случай проблем с отображением
    let scoreUpdateInterval = setInterval(() => {
      if (!isGameRunning) {
        clearInterval(scoreUpdateInterval);
        return;
      }
      console.log('Периодическое обновление счета:', score);
      updateScore();
    }, 1000);
    
    // Удаляем все существующие сердца
    const existingHearts = gameArea.querySelectorAll('.game-heart');
    existingHearts.forEach(heart => {
      if (heart.parentNode) {
        heart.parentNode.removeChild(heart);
      }
    });
    
    // Скрываем экран начала игры и показываем игровую область
    if (gameStart) {
      gameStart.classList.add('hidden');
    }
    
    gameArea.classList.add('game-started');
    document.body.classList.add('game-active');
    
    // Запускаем интервал для обратного отсчета времени
    gameInterval = setInterval(() => {
      timeLeft--;
      
      if (gameTimeDisplay) {
        gameTimeDisplay.textContent = timeLeft;
        
        // Добавляем эффект, когда времени мало
        if (timeLeft <= 5) {
          gameTimeDisplay.classList.add('time-running-out');
        } else {
          gameTimeDisplay.classList.remove('time-running-out');
        }
      }
      
      // Завершаем игру, когда время истекло
      if (timeLeft <= 0) {
        endGame();
      }
    }, 1000);
    
    // Запускаем создание сердечек с более высокой частотой
    heartCreateInterval = setInterval(() => {
      if (isGameRunning) {
        createHeart();
        
        // Иногда создаем дополнительное сердце для увеличения плотности
        if (Math.random() < 0.3) {
          setTimeout(() => {
            if (isGameRunning) createHeart();
          }, 300);
        }
      }
    }, heartCreationSpeed);
    
    // Создаём сразу несколько сердец для начала игры
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        if (isGameRunning) createHeart();
      }, i * 200);
    }
    
    // Ускоряем появление сердечек со временем (каждые 5 секунд)
    speedUpInterval = setInterval(() => {
      if (isGameRunning && heartCreationSpeed > minHeartCreationSpeed) {
        heartCreationSpeed = Math.max(heartCreationSpeed - 100, minHeartCreationSpeed);
        console.log('Ускоряем создание сердечек:', heartCreationSpeed);
        
        // Обновляем интервал с новой скоростью
        clearInterval(heartCreateInterval);
        heartCreateInterval = setInterval(() => {
          if (isGameRunning) {
            createHeart();
            
            // С каждым ускорением увеличиваем шанс появления дополнительного сердца
            if (Math.random() < 0.4) {
              setTimeout(() => {
                if (isGameRunning) createHeart();
              }, Math.random() * 300);
            }
          }
        }, heartCreationSpeed);
      }
    }, 5000);
    
    console.log('Игра запущена!');
  }
  
  // Инициализация игрового пространства и прямых обработчиков событий
  function initGameArea() {
    try {
      if (!gameArea) return;
      
      console.log('Инициализация игрового пространства');
      
      // Добавляем мобильные стили
      const mobileStyles = `
        .game-heart {
          cursor: pointer !important;
          touch-action: manipulation !important;
          -webkit-tap-highlight-color: transparent !important;
        }
        .game-area {
          touch-action: manipulation !important;
          -webkit-tap-highlight-color: transparent !important;
          user-select: none !important;
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
        }
      `;
      
      // Добавляем стили для мобильных устройств
      const styleElement = document.createElement('style');
      styleElement.textContent = mobileStyles;
      document.head.appendChild(styleElement);
      
      // Предотвращаем стандартное поведение браузера для таких жестов, как прокрутка при перетаскивании
      gameArea.addEventListener('touchmove', function(e) {
        e.preventDefault();
      }, { passive: false });
      
      // Предотвращаем масштабирование при двойном тапе
      gameArea.addEventListener('touchend', function(e) {
        const now = Date.now();
        const lastTouch = gameArea.dataset.lastTouch || 0;
        
        if (now - lastTouch < 300) {
          e.preventDefault();
        }
        
        gameArea.dataset.lastTouch = now;
      }, { passive: false });
      
      // Предотвращаем контекстное меню на всей игровой области
      gameArea.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
      });
      
      // Предотвращаем выделение текста
      gameArea.addEventListener('selectstart', function(e) {
        e.preventDefault();
        return false;
      });
      
      // Устанавливаем обработчик для отладки на мобильных устройствах
      window.onerror = function(message, source, lineno, colno, error) {
        const errorDiv = document.createElement('div');
        errorDiv.style.position = 'fixed';
        errorDiv.style.bottom = '0';
        errorDiv.style.left = '0';
        errorDiv.style.backgroundColor = 'rgba(255,0,0,0.8)';
        errorDiv.style.color = 'white';
        errorDiv.style.padding = '10px';
        errorDiv.style.zIndex = '9999';
        errorDiv.textContent = `Ошибка: ${message} (${source}:${lineno}:${colno})`;
        document.body.appendChild(errorDiv);
        
        // Удаляем сообщение через 5 секунд
        setTimeout(() => {
          if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
          }
        }, 5000);
        
        return true; // Предотвращаем стандартное сообщение об ошибке
      };
      
    } catch (error) {
      console.error('Ошибка при инициализации игрового пространства:', error);
    }
  }
  
  // Функция для создания сердца
  function createHeart() {
    if (!gameArea || !isGameRunning) return;
    
    try {
      // Создаем больше сердец одновременно (1-2 дополнительных)
      const extraHearts = Math.random() < 0.5 ? 1 : 2;
      for (let i = 0; i <= extraHearts; i++) {
        // Добавляем небольшую задержку для второго и третьего сердца
        setTimeout(() => {
          createSingleHeart();
        }, i * 100);
      }
    } catch (error) {
      console.error('Ошибка при создании сердца:', error);
    }
  }
  
  // Функция для создания одного сердца
  function createSingleHeart() {
    if (!gameArea || !isGameRunning) return;
    
    try {
      // Выбираем тип сердца
      let heartType, isSpecial = false, isQuick = false;
      
      // Определяем, будет ли это особое сердце (5 очков)
      if (Math.random() < specialHeartChance) {
        // Это особое сердце
        heartType = specialHeartTypes[Math.floor(Math.random() * specialHeartTypes.length)];
        isSpecial = true;
      } 
      // Определяем, будет ли это быстрое сердце (2 очка)
      else if (Math.random() < quickHeartChance) {
        // Это быстрое сердце
        heartType = quickHeartTypes[Math.floor(Math.random() * quickHeartTypes.length)];
        isQuick = true;
      } 
      // Обычное сердце (1 очко)
      else {
        heartType = heartTypes[Math.floor(Math.random() * heartTypes.length)];
      }
      
      // Создаем элемент сердца
      const heart = document.createElement('div');
      heart.className = 'game-heart';
      heart.innerHTML = heartType;
      
      // Добавляем уникальный ID для отладки
      heart.id = 'heart-' + new Date().getTime() + '-' + Math.floor(Math.random() * 1000);
      
      // Устанавливаем тип сердца и количество очков для последующей обработки
      if (isSpecial) {
        heart.classList.add('special-heart');
        heart.dataset.points = '5'; // Особое сердце дает 5 очков
        heart.dataset.type = 'special';
      } else if (isQuick) {
        heart.classList.add('quick-heart');
        heart.dataset.points = '2'; // Быстрое сердце дает 2 очка
        heart.dataset.type = 'quick';
      } else {
        heart.dataset.points = '1'; // Обычное сердце дает 1 очко
        heart.dataset.type = 'regular';
      }
      
      // Устанавливаем случайную начальную позицию по горизонтали
      // Подходящие размеры: от размера сердца до ширины игровой области минус размер сердца
      const heartSize = isQuick ? 25 : 40; // Меньший размер для быстрых сердец
      const maxLeft = gameArea.clientWidth - heartSize;
      const randomLeft = Math.random() * maxLeft;
      
      // Стартовая позиция немного выше верхней границы игровой области
      const startY = -heartSize - Math.random() * 50; // Случайная начальная высота над игровой областью
      
      // Устанавливаем стили для начальной позиции и размера
      heart.style.left = `${randomLeft}px`;
      heart.style.top = `${startY}px`;
      
      // Устанавливаем меньший размер для быстрых сердец
      if (isQuick) {
        heart.style.width = `${heartSize}px`;
        heart.style.height = `${heartSize}px`;
        heart.style.fontSize = '18px';
      }
      
      // Вычисляем скорость падения - быстрые сердца падают быстрее
      let speed = isQuick ? 
                  fallingSpeed.max + Math.random() * 2 : // Быстрые сердца падают быстрее
                  fallingSpeed.min + Math.random() * (fallingSpeed.max - fallingSpeed.min);
                  
      // Записываем скорость в атрибут для отладки
      heart.dataset.speed = speed;
      heart.dataset.created = new Date().toISOString();
      
      // Функция обработки клика по сердцу
      const handleClick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Клик по сердцу:', heart.id, 'тип:', heart.dataset.type);
        
        // Отменяем анимацию падения
        heart.style.animationPlayState = 'paused';
        
        // Вызываем централизованный обработчик клика
        handleHeartClick(e);
      };
      
      // Добавляем обработчик события для клика
      heart.addEventListener('click', handleClick);
      heart.addEventListener('touchstart', handleClick, { passive: false });
      
      // Добавляем сердце в игровую область
      gameArea.appendChild(heart);
      
      // Начинаем анимацию падения
      requestAnimationFrame(() => {
        // Добавляем стили анимации
        heart.style.animation = `fall ${8/speed}s linear forwards`;
        
        // Регистрируем событие для отладки
        console.log('Добавлено сердце:', heart.id, 'тип:', heart.dataset.type, 'скорость:', speed);
      });
      
      // Обработка завершения анимации - удалить сердце, если оно не было поймано
      heart.addEventListener('animationend', () => {
        if (heart.parentNode) {
          heart.parentNode.removeChild(heart);
          console.log('Сердце упало и удалено:', heart.id);
        }
      });
      
    } catch (error) {
      console.error('Ошибка при создании сердца:', error);
    }
  }
  
  // Функция для обновления счета на экране - переписываем более надежно
  function updateScore() {
    try {
      console.log('Обновление счета игры, текущее значение:', score);
      
      // Находим элемент отображения счета свежим запросом
      const scoreDisplay = document.getElementById('game-score');
      
      if (scoreDisplay) {
        console.log('Элемент отображения счета найден, обновляем:', score);
        scoreDisplay.textContent = score;
        
        // Добавляем эффект обновления счета
        scoreDisplay.classList.add('score-update');
        setTimeout(() => {
          scoreDisplay.classList.remove('score-update');
        }, 300);
        
        // Сохраняем текущий счет в глобальной переменной для отладки
        window.currentGameScore = score;
      } else {
        console.warn('Элемент game-score не найден, пробуем альтернативные варианты');
        
        // Пробуем найти через родительский контейнер
        const scoreContainer = document.querySelector('.game-score');
        if (scoreContainer) {
          console.log('Найден контейнер счета');
          const scoreSpan = scoreContainer.querySelector('span:last-child');
          if (scoreSpan) {
            console.log('Найден span внутри контейнера счета, обновляем:', score);
            scoreSpan.textContent = score;
            
            // Добавляем эффект обновления счета
            scoreSpan.classList.add('score-update');
            setTimeout(() => {
              scoreSpan.classList.remove('score-update');
            }, 300);
            
            // Сохраняем текущий счет в глобальной переменной для отладки
            window.currentGameScore = score;
          } else {
            console.error('Не найден элемент span внутри контейнера счета');
          }
        } else {
          console.error('Не найден контейнер счета');
        }
      }
      
      // Принудительно обновляем UI
      document.body.offsetHeight; // Reflow
      
      // Проверяем разблокировку подарков
      checkGiftUnlock(score);
    } catch (error) {
      console.error('Ошибка при обновлении счета:', error);
    }
  }
  
  // Централизованный обработчик клика по сердцу
  function handleHeartClick(event) {
    // Предотвращаем дефолтное поведение, чтобы избежать скролла
    event.preventDefault();
    
    try {
      // Получаем элемент сердца
      const heart = event.currentTarget;
      
      // Проверяем, обрабатывается ли уже это сердце
      if (heart.dataset.processing === 'true' || heart.classList.contains('clicked')) {
        console.log('Сердце уже обрабатывается или было кликнуто, пропускаем');
        return;
      }
      
      // Помечаем сердце как обрабатываемое - блокируем двойные клики
      heart.dataset.processing = 'true';
      heart.classList.add('clicked');
      
      // Определяем тип сердца и начисляем соответствующие очки
      let pointsToAdd = parseInt(heart.dataset.points || "1");
      if (isNaN(pointsToAdd)) pointsToAdd = 1; // На случай, если dataset.points неправильно установлен
      
      // Воспроизводим соответствующий звук
      if (heart.classList.contains('special-heart')) {
        specialHeartSound.play();
        console.log('Специальное сердце: +5 очков. Текущий счет:', score, '+ 5 =', score + 5);
      } else if (heart.classList.contains('quick-heart')) {
        quickHeartSound.play();
        console.log('Быстрое сердце: +2 очка. Текущий счет:', score, '+ 2 =', score + 2);
      } else {
        heartClickSound.play();
        console.log('Обычное сердце: +1 очко. Текущий счет:', score, '+ 1 =', score + 1);
      }
      
      // Увеличиваем счёт
      score += pointsToAdd;
      
      // Запись для отладки
      console.log(`Увеличиваем счет на ${pointsToAdd}, тип сердца: ${heart.dataset.type}, новый счет:`, score);
      
      // Обновляем отображение счета с помощью улучшенной функции
      updateScore();
      
      // Глобальная переменная для отладки
      window.lastScore = score;
      window.lastHeart = heart.dataset.type;
      window.lastPoints = pointsToAdd;
      
      // Показываем анимацию очков
      showPointsAnimation(heart);
      
      // Создаём эффект частиц
      createParticles(heart);
      
      // Удаляем сердце после небольшой задержки, чтобы анимация успела проиграться
      setTimeout(() => {
        if (heart.parentNode) {
          heart.parentNode.removeChild(heart);
        }
      }, 500); // Увеличиваем время до удаления для завершения анимации
      
      // Проверяем счет сразу после обновления, чтобы убедиться, что он действительно изменился
      setTimeout(() => {
        console.log('Проверка счета после клика:', score);
        updateScore(); // Второе обновление для надежности
      }, 100);
      
    } catch (error) {
      console.error('Ошибка при обработке клика по сердцу:', error);
    }
  }
  
  // Функция для анимации полученных очков
  function showPointsAnimation(heart) {
    try {
      if (!gameArea) return;
      
      // Создаем элемент для анимации очков
      const pointsElement = document.createElement('div');
      pointsElement.classList.add('points-animation');
      
      // Определяем класс и текст в зависимости от типа сердца
      if (heart.classList.contains('special-heart')) {
        pointsElement.classList.add('special-points');
        pointsElement.textContent = '+5';
      } else if (heart.classList.contains('quick-heart')) {
        pointsElement.classList.add('quick-points');
        pointsElement.textContent = '+2';
      } else {
        pointsElement.textContent = '+1';
      }
      
      // Добавляем случайное смещение для более интересного эффекта
      const xOffset = Math.random() * 40 - 20;
      pointsElement.style.setProperty('--x-offset', `${xOffset}px`);
      
      // Четко позиционируем элемент очков перед получением координат сердца
      // В случае ошибки используем примерное положение
      let posX = heart.offsetWidth / 2;
      let posY = 0;
      
      try {
        const heartRect = heart.getBoundingClientRect();
        const gameAreaRect = gameArea.getBoundingClientRect();
        
        posX = heartRect.left - gameAreaRect.left + heart.offsetWidth / 2;
        posY = heartRect.top - gameAreaRect.top;
      } catch (error) {
        console.error('Ошибка получения координат сердца, используем приблизительные:', error);
      }
      
      pointsElement.style.left = `${posX}px`;
      pointsElement.style.top = `${posY}px`;
      
      // Добавляем элемент на игровое поле
      gameArea.appendChild(pointsElement);
      
      // Удаляем элемент после завершения анимации
      setTimeout(() => {
        if (pointsElement.parentNode) {
          pointsElement.parentNode.removeChild(pointsElement);
        }
      }, 1000);
    } catch (error) {
      console.error('Ошибка при создании анимации очков:', error);
    }
  }
  
  // Функция для создания эффекта частиц при клике на сердце - упрощённая версия
  function createParticles(heart) {
    if (!gameArea || !heart) return;

    // Создаём простую вспышку непосредственно в месте клика
    const flash = document.createElement('div');
    flash.classList.add('heart-flash');
    
    // Копируем позицию и размер сердца для вспышки
    try {
      const rect = heart.getBoundingClientRect();
      const gameRect = gameArea.getBoundingClientRect();
      
      flash.style.left = `${rect.left - gameRect.left + rect.width/2}px`;
      flash.style.top = `${rect.top - gameRect.top + rect.height/2}px`;
      
      // Устанавливаем размер вспышки больше, чем сердце
      flash.style.width = `${rect.width * 1.5}px`;
      flash.style.height = `${rect.height * 1.5}px`;
      
      // Применяем стили для специальных сердец
      if (heart.classList.contains('special-heart')) {
        flash.classList.add('special-flash');
      }
      
      // Добавляем вспышку в игровую область
      gameArea.appendChild(flash);
      
      // Удаляем вспышку после окончания анимации
      setTimeout(() => {
        if (flash.parentNode) {
          flash.parentNode.removeChild(flash);
        }
      }, 500);
      
      // Создаём простые частицы
      const particleCount = heart.classList.contains('special-heart') ? 6 : 4;
      
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('simple-particle');
        
        if (heart.classList.contains('special-heart')) {
          particle.classList.add('special-particle');
        }
        
        // Располагаем частицу в центре сердца
        particle.style.left = `${rect.left - gameRect.left + rect.width/2}px`;
        particle.style.top = `${rect.top - gameRect.top + rect.height/2}px`;
        
        // Устанавливаем случайное направление движения
        const angle = (i / particleCount) * Math.PI * 2;
        particle.style.setProperty('--angle', angle);
        
        // Добавляем частицу
        gameArea.appendChild(particle);
        
        // Удаляем частицу после окончания анимации
        setTimeout(() => {
          if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
          }
        }, 600);
      }
    } catch (error) {
      console.error('Ошибка при создании эффекта клика:', error);
    }
  }
  
  // Функция для проверки разблокировки подарков
  function checkGiftUnlock(currentScore) {
    giftThresholds.forEach(threshold => {
      if (currentScore >= threshold.score && !unlockedGifts.includes(threshold.giftId)) {
        unlockedGifts.push(threshold.giftId);
        localStorage.setItem('unlockedGifts', JSON.stringify(unlockedGifts));
        showGiftUnlockNotification(threshold.title);
      }
    });
  }
  
  // Функция для отображения уведомления о разблокировке подарка
  function showGiftUnlockNotification(giftTitle) {
    try {
      // Удаляем предыдущее уведомление, если оно есть
      const existingNotification = document.querySelector('.gift-unlock-notification');
      if (existingNotification) {
        existingNotification.remove();
      }
      
      const notification = document.createElement('div');
      notification.classList.add('gift-unlock-notification');
      notification.innerHTML = `
        <i class="fas fa-gift"></i>
        <p>Разблокирован подарок: <strong>${giftTitle}</strong>!</p>
      `;
      
      document.body.appendChild(notification);
      
      // Воспроизводим звук разблокировки (если доступен)
      try {
        const context = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, context.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(440, context.currentTime + 0.3);
        gain.gain.value = 0.1;
        
        oscillator.connect(gain);
        gain.connect(context.destination);
        
        oscillator.start();
        gain.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 1);
        
        setTimeout(() => {
          oscillator.stop();
        }, 1000);
      } catch (e) {
        console.log('Звуковой эффект не поддерживается');
      }
      
      setTimeout(() => {
        notification.classList.add('show');
      }, 100);
      
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 500);
      }, 3000);
    } catch (error) {
      console.error('Ошибка при показе уведомления о подарке:', error);
    }
  }
  
  // Функция для завершения игры
  function endGame() {
    try {
      console.log('Игра завершена, счет:', score);
      isGameRunning = false;
      
      // Убираем класс "мало времени"
      if (gameTimeDisplay) {
        gameTimeDisplay.classList.remove('time-running-out');
      }
      
      // Останавливаем интервалы
      clearInterval(gameInterval);
      clearInterval(heartCreateInterval);
      clearInterval(speedUpInterval);
      
      // Удаляем все существующие сердца с плавной анимацией
      const existingHearts = gameArea.querySelectorAll('.game-heart');
      existingHearts.forEach(heart => {
        heart.classList.add('fade-out');
        setTimeout(() => {
          if (heart.parentNode) {
            heart.parentNode.removeChild(heart);
          }
        }, 300);
      });
      
      // Плавно показываем экран окончания игры
      if (gameEnd) {
        setTimeout(() => {
          gameEnd.classList.remove('hidden');
          setTimeout(() => {
            gameEnd.style.opacity = '1';
          }, 50);
        }, 500);
      }
      
      // Обновляем содержимое экрана окончания игры
      if (finalScoreDisplay) {
        // Анимируем счет
        let displayScore = 0;
        const scoreInterval = setInterval(() => {
          displayScore = Math.min(displayScore + Math.max(1, Math.floor(score / 20)), score);
          finalScoreDisplay.textContent = displayScore;
          
          if (displayScore >= score) {
            clearInterval(scoreInterval);
            
            // Добавляем анимацию для финального счета
            finalScoreDisplay.classList.add('score-highlight');
            setTimeout(() => {
              finalScoreDisplay.classList.remove('score-highlight');
            }, 1000);
            
            // Обновляем рекорд, если текущий счет выше
            if (score > recordScore) {
              recordScore = score;
              localStorage.setItem('loveGameRecord', recordScore);
              
              if (gameRecordDisplay) {
                gameRecordDisplay.textContent = recordScore;
                gameRecordDisplay.classList.add('new-record');
                setTimeout(() => {
                  gameRecordDisplay.classList.remove('new-record');
                }, 2000);
              }
              
              // Добавляем сообщение о новом рекорде
              const recordMessage = document.createElement('div');
              recordMessage.classList.add('new-record-message');
              recordMessage.textContent = 'Новый рекорд!';
              
              if (finalScoreDisplay.parentNode) {
                finalScoreDisplay.parentNode.appendChild(recordMessage);
                
                setTimeout(() => {
                  recordMessage.classList.add('show');
                }, 500);
                
                setTimeout(() => {
                  recordMessage.classList.remove('show');
                  setTimeout(() => {
                    if (recordMessage.parentNode) {
                      recordMessage.parentNode.removeChild(recordMessage);
                    }
                  }, 500);
                }, 3000);
              }
            }
            
            // Анализируем набранные очки и показываем сообщение о доступных подарках
            showAvailableGifts(score);
          }
        }, 50);
      }
    } catch (error) {
      console.error('Ошибка при завершении игры:', error);
    }
  }
  
  // Функция для показа доступных подарков
  function showAvailableGifts(currentScore) {
    try {
      // Находим все подарки, которые можно разблокировать с текущим счетом
      const availableGifts = giftThresholds.filter(gift => currentScore >= gift.score);
      
      // Если есть доступные подарки, показываем сообщение
      if (availableGifts.length > 0 && gameEnd) {
        // Создаем новый элемент для отображения доступных подарков
        const giftsMessage = document.createElement('div');
        giftsMessage.classList.add('available-gifts-message');
        
        // Получаем список названий подарков
        const giftNames = availableGifts.map(gift => gift.title);
        const giftList = giftNames.join(', ');
        
        // Создаем текст сообщения
        let messageText = `<p>Поздравляю тебя, <span class="pink-text">зефирочка моя</span>! Тебе доступны подарки: <strong>${giftList}</strong>.</p>`;
        messageText += `<p>Загляни в раздел "Виртуальные подарки", чтобы увидеть их!</p>`;
        
        // Добавляем сообщение на экран завершения игры
        giftsMessage.innerHTML = messageText;
        
        // Добавляем кнопку для перехода к подаркам
        const goToGiftsBtn = document.createElement('button');
        goToGiftsBtn.classList.add('btn-primary');
        goToGiftsBtn.innerHTML = '<i class="fas fa-gift"></i> Посмотреть подарки';
        goToGiftsBtn.addEventListener('click', () => {
          // Плавно скроллим к секции с подарками
          const giftsSection = document.getElementById('virtual-gifts');
          if (giftsSection) {
            giftsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Добавляем эффект выделения для секции подарков
            setTimeout(() => {
              giftsSection.classList.add('highlight-section');
              setTimeout(() => {
                giftsSection.classList.remove('highlight-section');
              }, 2000);
            }, 1000);
          }
        });
        
        // Добавляем кнопку к сообщению
        giftsMessage.appendChild(goToGiftsBtn);
        
        // Удаляем предыдущее сообщение, если оно есть
        const existingMessage = gameEnd.querySelector('.available-gifts-message');
        if (existingMessage) {
          existingMessage.remove();
        }
        
        // Добавляем сообщение на экран завершения игры
        gameEnd.appendChild(giftsMessage);
        
        // Анимируем появление сообщения
        setTimeout(() => {
          giftsMessage.classList.add('show');
        }, 1000);
      }
    } catch (error) {
      console.error('Ошибка при отображении доступных подарков:', error);
    }
  }
  
  // Добавляем стили для игровых элементов
  function addGameStyles() {
    console.log('Добавление игровых стилей');
    
    try {
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        /* Стили для игры */
        .game-started {
          animation: gameStartPulse 1s ease-in-out;
        }
        
        @keyframes gameStartPulse {
          0% { transform: scale(0.98); opacity: 0.9; }
          50% { transform: scale(1.02); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .time-running-out {
          animation: timeWarning 0.5s infinite alternate;
          color: red !important;
        }
        
        @keyframes timeWarning {
          from { opacity: 0.6; }
          to { opacity: 1; transform: scale(1.1); }
        }
        
        /* Анимация обновления счета */
        .score-update {
          animation: scoreUpdate 0.3s ease-in-out;
        }
        
        @keyframes scoreUpdate {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); color: #ff6b95; }
          100% { transform: scale(1); }
        }
        
        /* Стили для сердечек */
        .game-heart {
          position: absolute;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 30px;
          cursor: pointer;
          z-index: 200; /* Повышаем z-index для гарантии */
          user-select: none;
          will-change: transform, opacity, filter, top;
          transform-origin: center center;
          /* Большая область клика */
          padding: 20px;
          margin: -20px;
          box-sizing: content-box;
          transition: transform 0.15s ease-out, opacity 0.15s ease-out, filter 0.15s ease-out;
          animation: fall var(--fall-duration, 5s) linear forwards;
          -webkit-tap-highlight-color: transparent; /* Убираем подсветку при тапе на мобильных */
          touch-action: manipulation; /* Улучшаем отзывчивость на сенсорных экранах */
        }
        
        .game-heart::before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          background-color: transparent;
          border-radius: 50%;
          z-index: -1;
        }
        
        .game-heart:hover {
          transform: scale(1.1);
          filter: brightness(1.2);
        }
        
        .game-heart.clicked {
          animation: pop 0.5s forwards !important;
          opacity: 1;
          filter: brightness(1.5);
        }
        
        /* Специальные сердца */
        .special-heart {
          font-size: 36px;
          filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.7));
          animation: fall var(--fall-duration, 8s) linear forwards, pulsateSpecial 1.2s infinite alternate;
        }
        
        .special-heart::before {
          background: radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0) 70%);
        }
        
        @keyframes pulsateSpecial {
          0% { transform: scale(1) rotate(var(--rotation, 0deg)); }
          100% { transform: scale(1.15) rotate(var(--rotation, 0deg)); }
        }
        
        /* Быстрые сердца */
        .quick-heart {
          font-size: 24px;
          filter: drop-shadow(0 0 5px rgba(0, 255, 170, 0.6));
          animation: fall var(--fall-duration, 3s) linear forwards, wiggle 0.3s infinite alternate;
        }
        
        .quick-heart::before {
          background: radial-gradient(circle, rgba(0, 255, 170, 0.1) 0%, rgba(0, 255, 170, 0) 70%);
        }
        
        @keyframes wiggle {
          0% { transform: translateX(-5px) rotate(calc(var(--rotation, 0deg) - 5deg)); }
          100% { transform: translateX(5px) rotate(calc(var(--rotation, 0deg) + 5deg)); }
        }
        
        /* Стили для анимации падения */
        @keyframes fall {
          0% { top: -60px; }
          100% { top: calc(100% + 20px); }
        }
        
        /* Стили для частиц и эффектов */
        .heart-particle {
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: #ff6b95;
          pointer-events: none;
          z-index: 201;
        }
        
        .special-particle {
          background-color: gold;
          width: 12px;
          height: 12px;
          box-shadow: 0 0 5px gold;
        }
        
        .quick-particle {
          background-color: #00ffaa;
          width: 8px;
          height: 8px;
          box-shadow: 0 0 5px #00ffaa;
        }
        
        .points-animation {
          position: absolute;
          color: white;
          font-size: 1.5rem;
          font-weight: bold;
          text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
          z-index: 202;
          pointer-events: none;
          animation: floatUp 1s ease-out forwards;
        }
        
        .special-points {
          color: gold;
          font-size: 2rem;
          text-shadow: 0 0 8px rgba(255, 215, 0, 0.8);
        }
        
        .quick-points {
          color: #00ffaa;
          font-size: 1.7rem;
          text-shadow: 0 0 8px rgba(0, 255, 170, 0.7);
        }
        
        @keyframes floatUp {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-60px); opacity: 0; }
        }
        
        @keyframes pop {
          0% { transform: scale(1); }
          50% { transform: scale(1.5); opacity: 1; }
          100% { transform: scale(0); opacity: 0; }
        }
        
        .heart-flash {
          position: absolute;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 107, 149, 0.8) 0%, transparent 70%);
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 201;
          animation: flash 0.5s ease-out forwards;
        }
        
        .special-flash {
          background: radial-gradient(circle, rgba(255, 215, 0, 0.8) 0%, transparent 70%);
          width: 70px;
          height: 70px;
        }
        
        .quick-flash {
          background: radial-gradient(circle, rgba(0, 255, 170, 0.8) 0%, transparent 70%);
          width: 40px;
          height: 40px;
          animation: flash 0.3s ease-out forwards;
        }
        
        @keyframes flash {
          0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
        }
        
        .new-record-message {
          color: gold;
          font-size: 2rem;
          font-weight: bold;
          margin-top: 20px;
          text-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
          opacity: 0;
          transform: scale(0.8);
          transition: opacity 0.5s, transform 0.5s;
        }
        
        .new-record-message.show {
          opacity: 1;
          transform: scale(1);
        }
        
        .score-highlight {
          animation: scoreHighlight 1s ease-in-out;
        }
        
        @keyframes scoreHighlight {
          0% { color: white; }
          50% { color: gold; text-shadow: 0 0 10px gold; transform: scale(1.2); }
          100% { color: white; }
        }
        
        /* Анимация высветления секции */
        .highlight-section {
          animation: sectionHighlight 2s;
        }
        
        @keyframes sectionHighlight {
          0% { background-color: transparent; }
          30% { background-color: rgba(255, 107, 149, 0.2); }
          100% { background-color: transparent; }
        }
        
        /* Стили для адаптивности */
        @media (max-width: 768px) {
          .game-heart {
            font-size: 26px;
            padding: 15px;
            margin: -15px;
          }
          
          .special-heart {
            font-size: 32px;
          }
          
          .quick-heart {
            font-size: 22px;
          }
          
          .points-animation {
            font-size: 1.3rem;
          }
          
          .special-points {
            font-size: 1.8rem;
          }
          
          .quick-points {
            font-size: 1.5rem;
          }
        }
      `;
      
      document.head.appendChild(styleElement);
      console.log('Игровые стили добавлены');
    } catch (error) {
      console.error('Ошибка при добавлении игровых стилей:', error);
    }
  }
  
  // Добавляем стили
  addGameStyles();
  
  // Обработчики для кнопок
  console.log('Добавление обработчиков к кнопкам игры');
  
  // Кнопка старта игры
  if (startGameBtn) {
    console.log('Добавляем обработчик кнопки start-game');
    
    // Создаем новый элемент, чтобы удалить все старые обработчики
    const newBtn = startGameBtn.cloneNode(true);
    if (startGameBtn.parentNode) {
      startGameBtn.parentNode.replaceChild(newBtn, startGameBtn);
    }
    
    // Обновляем ссылку на кнопку
    const updatedStartBtn = document.getElementById('start-game');
    
    if (updatedStartBtn) {
      // Добавляем новый обработчик
      updatedStartBtn.addEventListener('click', function(e) {
        console.log('Клик по кнопке start-game');
        e.preventDefault();
        
        // Эффект нажатия кнопки
        this.classList.add('button-click');
        setTimeout(() => {
          this.classList.remove('button-click');
        }, 200);
        
        startGame();
      });
      
      // Для надежности добавляем прямой обработчик onclick
      updatedStartBtn.onclick = function(e) {
        console.log('Прямой обработчик onclick для start-game');
        e.preventDefault();
        startGame();
        return false;
      };
    }
  }
  
  // Кнопка рестарта игры
  if (restartGameBtn) {
    console.log('Добавляем обработчик кнопки restart-game');
    
    // Создаем новый элемент, чтобы удалить все старые обработчики
    const newRestartBtn = restartGameBtn.cloneNode(true);
    if (restartGameBtn.parentNode) {
      restartGameBtn.parentNode.replaceChild(newRestartBtn, restartGameBtn);
    }
    
    // Обновляем ссылку на кнопку
    const updatedRestartBtn = document.getElementById('restart-game');
    
    if (updatedRestartBtn) {
      // Добавляем новый обработчик
      updatedRestartBtn.addEventListener('click', function(e) {
        console.log('Клик по кнопке restart-game');
        e.preventDefault();
        
        // Эффект нажатия кнопки
        this.classList.add('button-click');
        setTimeout(() => {
          this.classList.remove('button-click');
        }, 200);
        
        startGame();
      });
      
      // Для надежности добавляем прямой обработчик onclick
      updatedRestartBtn.onclick = function(e) {
        console.log('Прямой обработчик onclick для restart-game');
        e.preventDefault();
        startGame();
        return false;
      };
    }
  }
  
  // Добавляем обработчик для кнопок через делегирование событий
  const gameContainer = document.getElementById('love-game');
  if (gameContainer) {
    gameContainer.addEventListener('click', function(e) {
      // Проверяем, был ли клик по кнопке начала или рестарта
      if (e.target && (e.target.id === 'start-game' || e.target.id === 'restart-game' || 
                      (e.target.parentNode && (e.target.parentNode.id === 'start-game' || e.target.parentNode.id === 'restart-game')))) {
        console.log('Клик по кнопке через делегирование:', e.target.id || e.target.parentNode.id);
        e.preventDefault();
        startGame();
      }
    });
  }
  
  // Экспортируем функцию startGame в глобальный контекст
  window.startGame = startGame;
  
  // Через короткий таймаут пробуем запустить игру автоматически (для тестирования)
  setTimeout(() => {
    console.log('Пробуем автоматически запустить игру для тестирования...');
    if (gameStart && !gameStart.classList.contains('hidden') && !isGameRunning) {
      startGame();
    }
  }, 3000);
  
  console.log('Инициализация любовной игры завершена');
  return startGame; // Возвращаем функцию для возможного ручного вызова
}

// Экспортируем функцию
window.initLoveGame = initLoveGame; 