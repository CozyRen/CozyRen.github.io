// Глобальный обработчик ошибок
window.onerror = function(message, source, lineno, colno, error) {
  console.error('JavaScript error:', message, 'at line', lineno);
  return false;
};

// Исполнение когда DOM загружен
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM полностью загружен');
  
  // Прокручиваем страницу вверх при загрузке
  window.scrollTo({
    top: 0,
    behavior: 'auto'
  });
  
  // Убедимся, что фокус на верхней части страницы
  setTimeout(() => {
    window.scrollTo({
      top: 0,
      behavior: 'auto'
    });
  }, 100);
  
  // Инициализация плавного скроллинга
  initSmoothScrolling();
  
  try {
    console.log('Инициализация всех модулей');
    // Инициализация всех модулей
    initLoadingScreen();
    initConnectionMonitor();
    initThemeToggle();
    initHeroButtons();
    initLetterEnvelope();
    initRelationshipCounter();
    initComplimentGenerator();
    
    initLoveGame();
    initRelationshipTimeline();
    initMobileMenu();
    initPhotoGallery();
    initLovePoems();
    initLoveMessageGenerator();
    initMemoriesSlider();
    initVirtualGifts();
    initMusicPlayerInteractions();
    console.log('Все модули инициализированы');
  } catch (error) {
    console.error("Ошибка при инициализации модулей:", error);
  }
  
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
});

// Функция для плавного скроллинга по клику на навигационные ссылки
function initSmoothScrolling() {
  console.log('Инициализация плавного скроллинга');
  
  // Получаем все навигационные ссылки
  const navLinks = document.querySelectorAll('.nav-links a');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Получаем ID секции из атрибута href
      const targetId = this.getAttribute('href');
      
      // Проверяем, что это внутренняя ссылка (начинается с #)
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        console.log('Клик по навигационной ссылке:', targetId);
        
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          // Закрываем мобильное меню, если оно открыто
          const navLinks = document.getElementById('nav-links');
          if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
          }
          
          // Плавно скроллим к секции
          targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          
          // Добавляем активный класс для текущей ссылки и убираем у других
          navLinks.forEach(navLink => {
            navLink.classList.remove('active');
          });
          link.classList.add('active');
        } else {
          console.error('Секция не найдена:', targetId);
        }
      }
    });
  });
}

// Инициализация загрузочного экрана
function initLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  
  // Скрываем заставку после полной загрузки страницы
  window.addEventListener('load', function() {
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
    }, 800); // Небольшая задержка для эффекта
  });
}

// Инициализация мониторинга соединения
function initConnectionMonitor() {
  const offlineNotification = document.getElementById('offline-notification');
  
  // Обработчики статуса соединения
  window.addEventListener('online', function() {
    offlineNotification.classList.add('hidden');
  });
  
  window.addEventListener('offline', function() {
    offlineNotification.classList.remove('hidden');
  });
  
  // Проверяем начальное состояние
  if (!navigator.onLine) {
    offlineNotification.classList.remove('hidden');
  }
}

// Инициализация кнопок на главном экране
function initHeroButtons() {
  console.log('Инициализация кнопок на главном экране');
  
  const viewLoveBtn = document.getElementById('view-love-btn');
  const readLetterBtn = document.getElementById('read-letter-btn');
  const messageSection = document.getElementById('message-section');
  const heartsContainer = document.querySelector('.hearts-container') || document.getElementById('hearts-container');
  
  // Проверяем наличие основных элементов
  if (!viewLoveBtn) {
    console.error('Не найдена кнопка "Увидеть любовь"');
  } else {
    console.log('Кнопка "Увидеть любовь" найдена');
  }
  
  // Создаем или получаем глобальный контейнер сердечек для всего сайта
  let globalHeartsContainer = document.getElementById('global-hearts-container');
  
  if (!globalHeartsContainer) {
    console.log('Создаю глобальный контейнер сердечек');
    globalHeartsContainer = document.createElement('div');
    globalHeartsContainer.id = 'global-hearts-container';
    globalHeartsContainer.style.position = 'fixed';
    globalHeartsContainer.style.top = '0';
    globalHeartsContainer.style.left = '0';
    globalHeartsContainer.style.width = '100%';
    globalHeartsContainer.style.height = '100%';
    globalHeartsContainer.style.pointerEvents = 'none'; // Чтобы не мешать кликам
    globalHeartsContainer.style.zIndex = '1000';
    globalHeartsContainer.style.display = 'none';
    document.body.appendChild(globalHeartsContainer);
  }
  
  // Переменная для хранения ID интервалов создания и удаления сердечек
  let heartCreationInterval = null;
  let heartRemovalInterval = null;
  // Флаг активности сердечек
  let heartsActive = false;
  
  // Обработчик для кнопки "Увидеть любовь"
  if (viewLoveBtn) {
    viewLoveBtn.addEventListener('click', function(e) {
      console.log('Нажата кнопка "Увидеть любовь"');
      e.preventDefault();
      
      // Переключаем состояние сердечек
      heartsActive = !heartsActive;
      
      if (heartsActive) {
        // Активируем сердечки
        console.log('Активация постоянных сердечек по всему фону');
        
        // Показываем глобальный контейнер сердечек
        globalHeartsContainer.style.display = 'block';
        
        // Устанавливаем один фон для всей страницы
        document.body.classList.add('hearts-background');
        
        try {
          // Создаем начальные сердечки
          createInitialHearts(30, globalHeartsContainer);
          
          // Запускаем интервал для добавления новых сердечек
          heartCreationInterval = setInterval(() => {
            // Создаем от 1 до 3 новых сердечек каждый раз
            const newHeartsCount = Math.floor(Math.random() * 3) + 1;
            createHearts(newHeartsCount, globalHeartsContainer);
          }, 1000); // Каждую секунду
          
          // Запускаем интервал для удаления старых сердечек
          heartRemovalInterval = setInterval(() => {
            removeRandomHearts(globalHeartsContainer);
          }, 2000); // Каждые 2 секунды
          
          // Изменяем текст кнопки
          viewLoveBtn.textContent = 'Скрыть сердечки';
          viewLoveBtn.classList.add('active');
        } catch (error) {
          console.error('Ошибка при работе с сердечками:', error);
          // Скрываем контейнер в случае ошибки
          globalHeartsContainer.style.display = 'none';
          heartsActive = false;
        }
      } else {
        // Деактивируем сердечки
        console.log('Деактивация сердечек');
        
        // Останавливаем интервалы создания и удаления сердечек
        clearInterval(heartCreationInterval);
        clearInterval(heartRemovalInterval);
        
        // Плавно скрываем сердечки
        globalHeartsContainer.style.opacity = "0";
        
        // Удаляем фон
        document.body.classList.remove('hearts-background');
        
        // Через полсекунды полностью скрываем контейнер
        setTimeout(function() {
          globalHeartsContainer.style.display = 'none';
          globalHeartsContainer.style.opacity = "1";
          // Очищаем контейнер после скрытия
          globalHeartsContainer.innerHTML = '';
          
          // Возвращаем оригинальный текст кнопки
          viewLoveBtn.textContent = 'Увидеть любовь';
          viewLoveBtn.classList.remove('active');
        }, 500);
      }
      
      // Старый код для показа сердечек в оригинальном контейнере
      if (heartsContainer) {
        // Очищаем контейнер на всякий случай
        heartsContainer.innerHTML = '';
      }
    });
  }
  
  // Обработчик для кнопки "Прочитать письмо"
  if (readLetterBtn) {
    console.log('Кнопка "Прочитать письмо" найдена');
    
    readLetterBtn.addEventListener('click', function(e) {
      console.log('Нажата кнопка "Прочитать письмо"');
      e.preventDefault();
      
      // Найдем секцию с особым посланием
      const messageSection = document.getElementById('message-section');
      
      if (!messageSection) {
        console.error('Не удалось прокрутить к письму - секция message-section не найдена');
        return;
      }
      
      console.log('Скроллим к секции с особым посланием');
      
      // Плавный скролл к секции с письмом
      messageSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Добавим эффект выделения для секции после скролла
      setTimeout(() => {
        messageSection.classList.add('highlight-section');
        
        // Через некоторое время уберем выделение
        setTimeout(() => {
          messageSection.classList.remove('highlight-section');
        }, 2000);
        
        // Также найдем особое сообщение и эмулируем клик по нему для показа подписи
        const specialMessage = document.getElementById('special-message');
        if (specialMessage) {
          setTimeout(() => {
            specialMessage.click();
          }, 1000);
        }
      }, 1000);
    });
  } else {
    console.error('Не найдена кнопка "Прочитать письмо"');
  }
  
  // Создаем начальные сердечки при запуске
  function createInitialHearts(count, container) {
    if (!container) return;
    
    for (let i = 0; i < count; i++) {
      createHearts(1, container);
    }
  }
  
  // Удаляем случайные сердечки
  function removeRandomHearts(container) {
    if (!container) return;
    
    const hearts = container.querySelectorAll('.heart');
    if (hearts.length > 50) { // Если больше 50 сердечек, удаляем несколько
      const removeCount = Math.floor(Math.random() * 5) + 1; // 1-5 сердечка
      
      for (let i = 0; i < removeCount; i++) {
        if (hearts.length > 0) {
          const randomIndex = Math.floor(Math.random() * hearts.length);
          if (hearts[randomIndex]) {
            hearts[randomIndex].classList.add('heart-disappear');
            
            // Удаляем элемент после завершения анимации исчезновения
            setTimeout(() => {
              if (hearts[randomIndex] && hearts[randomIndex].parentNode) {
                hearts[randomIndex].parentNode.removeChild(hearts[randomIndex]);
              }
            }, 500);
          }
        }
      }
    }
  }
  
  // Функция для создания сердечек
  function createHearts(count, container) {
    if (!container) return;
    
    // Типы сердечек для разнообразия
    const heartTypes = [
      // Font Awesome сердечки
      '<i class="fas fa-heart"></i>',
      '<i class="far fa-heart"></i>',
      '<i class="fas fa-heartbeat"></i>',
      // Emoji сердечки
      '❤️', '💖', '💗', '💓', '💘', '💝', '💕', '💞', '💟',
      // SVG сердечки с разными цветами
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%" fill="#ff6b95">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>`,
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%" fill="#e84c75">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>`,
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%" fill="#ff3366">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>`,
    ];

    for (let i = 0; i < count; i++) {
      try {
        const heart = document.createElement('div');
        heart.classList.add('heart');

        // Случайный тип сердечка
        const heartTypeIndex = Math.floor(Math.random() * heartTypes.length);
        heart.innerHTML = heartTypes[heartTypeIndex];

        // Случайный размер от 15px до 35px
        const size = Math.floor(Math.random() * 20) + 15;
        heart.style.width = `${size}px`;
        heart.style.height = `${size}px`;

        // Равномерно распределяем по всему экрану
        const left = Math.floor(Math.random() * 100);
        heart.style.left = `${left}%`;
        const top = Math.floor(Math.random() * 100);
        heart.style.top = `${top}%`;

        // Случайная длительность анимации от 3s до 8s
        const animationDuration = Math.floor(Math.random() * 5) + 3;
        heart.style.animationDuration = `${animationDuration}s`;

        // Случайная задержка до 3s
        const delay = Math.random() * 3;
        heart.style.animationDelay = `${delay}s`;

        // Случайный поворот
        const rotation = Math.floor(Math.random() * 30) - 15;
        heart.style.transform = `rotate(${rotation}deg)`;

        // Применяем случайную анимацию появления/исчезновения
        const animationType = Math.floor(Math.random() * 3);
        if (animationType === 0) {
          heart.classList.add('heart-pulse');
        } else if (animationType === 1) {
          heart.classList.add('heart-fade');
        } else {
          heart.classList.add('heart-beat');
        }

        // Добавляем сердечко в контейнер
        container.appendChild(heart);
        
        // Удаляем сердечко после окончания его жизненного цикла
        setTimeout(() => {
          if (heart && heart.parentNode) {
            heart.classList.add('heart-disappear');
            setTimeout(() => {
              if (heart && heart.parentNode) {
                heart.parentNode.removeChild(heart);
              }
            }, 500);
          }
        }, (animationDuration + delay) * 1000 + 5000); // Время анимации + задержка + доп. время
      } catch (error) {
        console.error('Ошибка при создании сердечка:', error);
      }
    }
  }
}

// =================== Особое послание ===================
function initLetterEnvelope() {
  console.log('Инициализация особого послания');
  
  const specialMessage = document.getElementById('special-message');
  const signature = document.querySelector('.signature');
  
  if (!specialMessage || !signature) {
    console.error('Элементы особого послания не найдены');
    return;
  }
  
  console.log('Элементы особого послания найдены');
  
  // Флаг для отслеживания состояния подписи
  let isSignatureVisible = false;
  
  // Обработчик клика
  specialMessage.addEventListener('click', function() {
    console.log('Клик по особому сообщению');
    
    // Добавляем класс для анимации текста
    specialMessage.classList.add('clicked');
    
    // Отображаем подпись с анимацией
    signature.classList.add('visible');
    
    // Увеличиваем эффект сердечка при клике
    const heartEmoji = signature.querySelector('.heart-emoji');
    if (heartEmoji) {
      heartEmoji.classList.add('heart-pulse-strong');
      
      // Удаляем класс усиленной пульсации через 3 секунды
      setTimeout(() => {
        heartEmoji.classList.remove('heart-pulse-strong');
      }, 3000);
    }
    
    // Обновляем флаг
    isSignatureVisible = true;
    console.log('Подпись отображена');
    
    // Для эффекта неожиданности, создаем несколько летающих сердечек
    createFloatingHearts(specialMessage, 5);
    
    // Удаляем класс анимации через некоторое время
    setTimeout(() => {
      specialMessage.classList.remove('clicked');
    }, 1500);
  });
  
  // Функция для создания летающих сердечек
  function createFloatingHearts(container, count) {
    console.log('Создание летающих сердечек', count);
    
    for (let i = 0; i < count; i++) {
      // Создаем сердечко
      const heart = document.createElement('div');
      heart.className = 'floating-heart';
      heart.innerHTML = '<i class="fas fa-heart"></i>';
      
      // Случайное положение внутри контейнера
      const leftPos = Math.random() * 80 + 10; // 10% - 90%
      heart.style.left = `${leftPos}%`;
      
      // Случайная задержка анимации
      const delay = Math.random() * 1;
      heart.style.animationDelay = `${delay}s`;
      
      // Случайный размер
      const size = Math.random() * 10 + 15; // 15px - 25px
      heart.style.fontSize = `${size}px`;
      
      // Случайная скорость
      const duration = Math.random() * 3 + 4; // 4s - 7s
      heart.style.animationDuration = `${duration}s`;
      
      // Добавляем в контейнер
      container.appendChild(heart);
      
      // Удаляем после завершения анимации
      setTimeout(() => {
        if (heart.parentNode === container) {
          container.removeChild(heart);
        }
      }, (duration + delay) * 1000);
    }
  }
}

// =================== Счетчик отношений ===================
function initRelationshipCounter() {
  console.log('Инициализация счетчика отношений');
  try {
    const daysCounter = document.getElementById('days-counter');
    const hoursCounter = document.getElementById('hours-counter');
    const minutesCounter = document.getElementById('minutes-counter');
    const secondsCounter = document.getElementById('seconds-counter');
    const momentsCounter = document.getElementById('moments-counter');
    
    // Проверяем наличие элементов
    if (!daysCounter) {
      console.warn('Элемент days-counter не найден');
      return;
    }
    
    console.log('Элементы счетчика найдены');
    
    // Устанавливаем начальную дату отношений - 27 февраля 2025
    const startDate = new Date(2025, 1, 27, 0, 0, 0); // 27.02.2025 00:00:00
    console.log('Дата начала отношений:', startDate);
    
    // Удаляем старые данные, если нужно сбросить счетчик
    // localStorage.removeItem('relationshipStartDate');
    
    // Сохраняем дату в localStorage для работы счетчика даже при закрытии сайта
    if (!localStorage.getItem('relationshipStartDate')) {
      localStorage.setItem('relationshipStartDate', startDate.getTime().toString());
      console.log('Дата сохранена в localStorage');
    }
    
    // Получаем сохраненную дату из localStorage
    const savedStartDate = new Date(parseInt(localStorage.getItem('relationshipStartDate') || startDate.getTime()));
    console.log('Загруженная дата из localStorage:', savedStartDate);
    
    function updateCounter() {
      try {
        const now = new Date();
        console.log('Текущая дата:', now);
        
        // Для отрицательного отсчета (если дата в будущем)
        let diff;
        let prefix = '';
        
        if (now < savedStartDate) {
          // Отрицательный отсчет (до даты)
          diff = savedStartDate - now;
          prefix = '-';
          console.log('Отрицательный отсчет, разница:', diff);
        } else {
          // Положительный отсчет (после даты)
          diff = now - savedStartDate;
          console.log('Положительный отсчет, разница:', diff);
        }
        
        // Рассчитываем разницу
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        console.log('Рассчитанная разница:', days, 'дней', hours, 'часов', minutes, 'минут', seconds, 'секунд');
        
        // Обновляем счетчики
        if (daysCounter) daysCounter.textContent = prefix + days;
        if (hoursCounter) hoursCounter.textContent = hours;
        if (minutesCounter) minutesCounter.textContent = minutes;
        if (secondsCounter) secondsCounter.textContent = seconds;
        
        // Обновляем текст под счетчиком дней
        const months = Math.floor(days / 30);
        const remainingDays = days % 30;
        const monthLabel = months === 1 ? 'месяц' : (months >= 2 && months <= 4 ? 'месяца' : 'месяцев');
        const dayLabel = remainingDays === 1 ? 'день' : (remainingDays >= 2 && remainingDays <= 4 ? 'дня' : 'дней');
        
        // Находим подпись счетчика и обновляем
        const counterSublabel = document.querySelector('.counter-item .counter-sublabel');
        if (counterSublabel) {
          if (now < savedStartDate) {
            counterSublabel.textContent = `осталось ${months} ${monthLabel} и ${remainingDays} ${dayLabel} до начала отношений`;
          } else {
            counterSublabel.textContent = `уже ${months} ${monthLabel} и ${remainingDays} ${dayLabel} вместе`;
          }
          console.log('Обновлена подпись счетчика:', counterSublabel.textContent);
        }
        
        // Обновляем счетчик моментов счастья
        if (momentsCounter) {
          const moments = Math.floor(diff / 1000);
          const formattedMoments = new Intl.NumberFormat('ru-RU').format(moments);
          momentsCounter.textContent = prefix + formattedMoments;
          console.log('Обновлен счетчик моментов:', momentsCounter.textContent);
        }
        
        // Сохраняем текущее время последнего обновления
        localStorage.setItem('lastCounterUpdate', now.getTime().toString());
      } catch (error) {
        console.error('Ошибка при обновлении счетчика:', error);
        
        // Базовое отображение счетчика при ошибке
        if (daysCounter) daysCounter.textContent = "---";
        if (hoursCounter) hoursCounter.textContent = "--";
        if (minutesCounter) minutesCounter.textContent = "--";
        if (secondsCounter) secondsCounter.textContent = "--";
      }
    }
    
    // Проверяем, был ли пользователь в оффлайне
    const lastUpdate = parseInt(localStorage.getItem('lastCounterUpdate') || '0');
    if (lastUpdate > 0) {
      const now = new Date().getTime();
      const timeDiff = now - lastUpdate;
      
      console.log('Прошло времени с последнего обновления:', timeDiff, 'мс');
      
      // Если прошло больше секунды с последнего обновления, обновляем счетчики
      if (timeDiff > 1000) {
        updateCounter();
      }
    }
    
    // Обновляем счетчик сразу и затем каждую секунду
    updateCounter();
    const countInterval = setInterval(updateCounter, 1000);
    console.log('Интервал обновления счетчика установлен');
    
    // Синхронизируем счетчик при переходе в онлайн
    window.addEventListener('online', updateCounter);
    
    // Сохраняем текущее состояние перед закрытием страницы
    window.addEventListener('beforeunload', function() {
      localStorage.setItem('lastCounterUpdate', new Date().getTime().toString());
      console.log('Сохранено состояние счетчика перед закрытием страницы');
    });
    
    // Возвращаем интервал для возможной очистки
    return countInterval;
  } catch (error) {
    console.error('Критическая ошибка в счетчике отношений:', error);
    
    // Попытка отобразить базовые значения при критической ошибке
    const daysCounter = document.getElementById('days-counter');
    const hoursCounter = document.getElementById('hours-counter');
    const minutesCounter = document.getElementById('minutes-counter');
    const secondsCounter = document.getElementById('seconds-counter');
    
    if (daysCounter) daysCounter.textContent = "0";
    if (hoursCounter) hoursCounter.textContent = "0";
    if (minutesCounter) minutesCounter.textContent = "0";
    if (secondsCounter) secondsCounter.textContent = "0";
  }
}

// =================== Генератор комплиментов ===================
function initComplimentGenerator() {
  console.log('Инициализация генератора комплиментов');
  
  // Получаем элементы интерфейса
  const generateBtn = document.getElementById('generate-compliment');
  const complimentText = document.getElementById('compliment-text');
  const complimentLoader = document.getElementById('compliment-loader');
  const categoryButtons = document.querySelectorAll('.category-btn');
  
  // Проверяем наличие элементов
  if (!generateBtn || !complimentText) {
    console.error('Не найдены основные элементы генератора комплиментов');
    return;
  }
  
  console.log('Основные элементы генератора комплиментов найдены');
  
  // Локальная база комплиментов по категориям
  const compliments = {
    beauty: [
      "Твоя улыбка делает мой день ярче ✨",
      "Твоя красота заставляет моё сердце биться чаще 💓", 
      "Твои глаза - как звезды в ночном небе ⭐",
      "Ты невероятно красива и с каждым днем все прекраснее 🌹",
      "Твой взгляд покоряет меня каждый раз заново 💘",
      "Не могу перестать думать о твоей прекрасной улыбке 😊",
      "Твои губы - самое сладкое, что я когда-либо пробовал 💋",
      "Твои волосы пахнут как рай 🌺"
    ],
    personality: [
      "Твоя доброта меняет мир вокруг к лучшему ❤️",
      "Восхищаюсь твоим умом и находчивостью 🧠",
      "Твоё чувство юмора - одна из причин, почему я люблю тебя 😂",
      "Ты делаешь меня лучше каждый день 🌟",
      "Твоя забота окутывает меня теплом 🔥",
      "Твой оптимизм заряжает меня энергией ⚡",
      "Ты вдохновляешь меня быть лучше 🌈",
      "Твоя искренность и открытость покоряют сердца 💖"
    ],
    love: [
      "Каждый момент с тобой - настоящее сокровище 💎",
      "Ты - лучшее, что случилось в моей жизни 🎁",
      "Моя любовь к тебе растёт с каждым днём 🌱",
      "Наша связь особенная и неповторимая ✨",
      "Ты заполняешь мою жизнь смыслом и радостью 🎈",
      "Рядом с тобой я нахожу спокойствие и счастье 😌",
      "Ты - моя вторая половинка, моя родственная душа 💞",
      "Люблю тебя больше, чем вчера, но меньше, чем завтра 💘"
    ],
    fun: [
      "Ты как шоколад - всегда поднимаешь настроение 🍫",
      "Твой смех заразительнее любого вируса 😄",
      "С тобой даже скучные дела становятся приключением 🚀",
      "Ты делаешь обычные моменты особенными 🎭",
      "Люблю наши безумства и спонтанные решения 🤪",
      "Ты мой любимый вид безумия 💥",
      "С тобой я готов на любые авантюры 🧡",
      "Ты - причина моих самых счастливых улыбок 😊"
    ]
  };

  let selectedCategory = 'all';

  // Обработчик для категорий
  if (categoryButtons && categoryButtons.length > 0) {
    console.log('Найдено кнопок категорий:', categoryButtons.length);
    
    categoryButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        console.log('Нажата кнопка категории:', this.dataset.category);
        e.preventDefault();
        
        // Убираем активный класс у всех категорий
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        
        // Добавляем активный класс выбранной категории
        this.classList.add('active');
        
        // Сохраняем выбранную категорию
        selectedCategory = this.dataset.category;
        
        // Генерируем комплимент из выбранной категории
        generateCompliment();
      });
    });
  }

  // Функция для генерации комплимента
  function generateCompliment() {
    try {
      console.log('Генерирую комплимент для категории:', selectedCategory);
      
      if (complimentLoader) {
        complimentLoader.classList.remove('hidden');
      }
      
      let selectedCompliments = [];
      
      if (selectedCategory === 'all') {
        // Собираем все комплименты из всех категорий
        Object.values(compliments).forEach(categoryCompliments => {
          selectedCompliments = [...selectedCompliments, ...categoryCompliments];
        });
      } else if (compliments[selectedCategory]) {
        // Используем комплименты только из выбранной категории
        selectedCompliments = compliments[selectedCategory];
      } else {
        console.error('Неизвестная категория:', selectedCategory);
        selectedCompliments = compliments.love; // Используем категорию по умолчанию
      }
      
      // Проверка на пустой массив комплиментов
      if (selectedCompliments.length === 0) {
        console.error('Нет комплиментов для категории:', selectedCategory);
        complimentText.textContent = "Комплименты для этой категории временно недоступны";
        return;
      }
      
      // Выбираем случайный комплимент из выбранных
      const randomIndex = Math.floor(Math.random() * selectedCompliments.length);
      const randomCompliment = selectedCompliments[randomIndex];
      
      console.log('Выбран комплимент:', randomCompliment);
      
      // Анимируем появление нового комплимента
      complimentText.style.opacity = 0;
      
      setTimeout(() => {
        complimentText.textContent = randomCompliment;
        complimentText.style.opacity = 1;
        
        if (complimentLoader) {
          complimentLoader.classList.add('hidden');
        }
      }, 300);
    } catch (error) {
      console.error('Ошибка при генерации комплимента:', error);
      
      // Показываем базовый комплимент в случае ошибки
      complimentText.textContent = "Ты - самое лучшее, что случилось в моей жизни ❤️";
      
      if (complimentLoader) {
        complimentLoader.classList.add('hidden');
      }
    }
  }

  // Обработчик клика по кнопке генерации
  generateBtn.addEventListener('click', function(e) {
    console.log('Нажата кнопка генерации комплимента');
    e.preventDefault();
    generateCompliment();
  });

  // Генерируем первый комплимент при загрузке
  generateCompliment();
}

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
  
  // Проверяем наличие основных элементов
  if (!gameArea || !startGameBtn) {
    console.error('Не найдены основные элементы игры');
    return;
  }
  
  console.log('Основные элементы игры найдены');
  
  // Игровые переменные
  let score = 0;
  let timeLeft = 30;
  let gameInterval;
  let heartCreateInterval;
  let isGameRunning = false;
  let recordScore = localStorage.getItem('loveGameRecord') || 0;
  let unlockedGifts = JSON.parse(localStorage.getItem('unlockedGifts')) || [];
  
  // Определение порогов для разблокировки подарков
  const giftThresholds = [
    { score: 10, giftId: 'roses', title: 'Букет роз' },
    { score: 25, giftId: 'chocolate', title: 'Коробка шоколада' },
    { score: 40, giftId: 'teddy', title: 'Плюшевый медвежонок' },
    { score: 55, giftId: 'star', title: 'Звезда с твоим именем' }
  ];
  
  // Отображаем рекорд, если есть элемент
  const gameRecordDisplay = document.getElementById('game-record');
  if (gameRecordDisplay) {
    gameRecordDisplay.textContent = recordScore;
  }
  
  // Функция для начала/перезапуска игры
  function startGame() {
    console.log('Запуск игры');
    if (isGameRunning) return;
    
    // Сбрасываем предыдущие результаты
    score = 0;
    timeLeft = 30;
    isGameRunning = true;
    
    // Обновляем отображение
    if (gameScoreDisplay) gameScoreDisplay.textContent = score;
    if (gameTimeDisplay) gameTimeDisplay.textContent = timeLeft;
    
    // Удаляем все существующие сердца
    const existingHearts = gameArea.querySelectorAll('.game-heart');
    existingHearts.forEach(heart => heart.remove());
    
    // Скрываем стартовый экран и показываем игровую область
    if (gameStart) gameStart.classList.add('hidden');
    if (gameEnd) gameEnd.classList.add('hidden');
    
    // Запускаем создание сердец
    heartCreateInterval = setInterval(createHeart, 800);
    
    // Запускаем таймер обратного отсчета
    gameInterval = setInterval(() => {
      timeLeft--;
      
      if (gameTimeDisplay) gameTimeDisplay.textContent = timeLeft;
      
      if (timeLeft <= 0) {
        endGame();
      }
    }, 1000);
  }
  
  // Функция для создания сердца
  function createHeart() {
    if (!gameArea || !isGameRunning) return;
    
    const heart = document.createElement('div');
    heart.classList.add('game-heart');
    
    // Случайное положение сердца
    const size = Math.floor(Math.random() * 30) + 20; // от 20 до 50px
    const left = Math.random() * (gameArea.offsetWidth - size);
    const top = Math.random() * 50; // Начальное положение сверху (чтобы сердце появлялось сверху и падало)
    const animationDuration = Math.random() * 3 + 2; // от 2 до 5 секунд
    
    // Случайный тип сердца (обычное или особое)
    const isSpecialHeart = Math.random() < 0.2; // 20% вероятность особого сердца
    
    heart.style.width = `${size}px`;
    heart.style.height = `${size}px`;
    heart.style.left = `${left}px`;
    heart.style.top = `${top}px`;
    heart.style.animationDuration = `${animationDuration}s`;
    
    if (isSpecialHeart) {
      heart.classList.add('special-heart');
      heart.innerHTML = '💖';
    } else {
      heart.innerHTML = '❤️';
    }
    
    // Обработчик клика по сердцу
    heart.addEventListener('click', () => {
      if (!isGameRunning) return;
      
      // Увеличиваем счет
      const pointsEarned = isSpecialHeart ? 3 : 1;
      score += pointsEarned;
      if (gameScoreDisplay) gameScoreDisplay.textContent = score;
      
      // Проверяем, достиг ли игрок порога для разблокировки подарка
      checkGiftUnlock(score);
      
      // Показываем анимацию очков
      showPointsAnimation(heart, pointsEarned);
      
      // Анимация исчезновения и удаление сердца
      heart.classList.add('clicked');
      setTimeout(() => {
        if (heart.parentNode) {
          heart.parentNode.removeChild(heart);
        }
      }, 300);
    });
    
    // Удаляем сердце, если оно не было нажато
    heart.addEventListener('animationend', () => {
      if (heart.parentNode) {
        heart.parentNode.removeChild(heart);
      }
    });
    
    // Добавляем сердце в контейнер
    gameArea.appendChild(heart);
  }
  
  // Функция для анимации полученных очков
  function showPointsAnimation(heart, points) {
    const pointsElement = document.createElement('div');
    pointsElement.classList.add('points-animation');
    pointsElement.textContent = `+${points}`;
    pointsElement.style.left = heart.style.left;
    pointsElement.style.top = heart.style.top;
    
    gameArea.appendChild(pointsElement);
    
    setTimeout(() => {
      if (pointsElement.parentNode) {
        pointsElement.parentNode.removeChild(pointsElement);
      }
    }, 1000);
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
    const notification = document.createElement('div');
    notification.classList.add('gift-unlock-notification');
    notification.innerHTML = `
      <i class="fas fa-gift"></i>
      <p>Разблокирован подарок: ${giftTitle}!</p>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 500);
    }, 3000);
  }
  
  // Функция для завершения игры
  function endGame() {
    console.log('Игра завершена, счет:', score);
    isGameRunning = false;
    
    // Останавливаем интервалы
    clearInterval(gameInterval);
    clearInterval(heartCreateInterval);
    
    // Скрываем игровой контейнер и показываем экран окончания игры
    if (gameStart) gameStart.classList.add('hidden');
    if (gameEnd) gameEnd.classList.remove('hidden');
    
    // Обновляем содержимое экрана окончания игры
    if (finalScoreDisplay) finalScoreDisplay.textContent = score;
    
    // Добавляем информацию о разблокированных подарках
    const unlockedGiftsContainer = document.createElement('div');
    unlockedGiftsContainer.classList.add('unlocked-gifts-container');
    unlockedGiftsContainer.innerHTML = '<h4>Разблокированные подарки:</h4>';
    
    let hasUnlockedGifts = false;
    
    giftThresholds.forEach(threshold => {
      if (unlockedGifts.includes(threshold.giftId)) {
        hasUnlockedGifts = true;
        const giftElement = document.createElement('div');
        giftElement.classList.add('unlocked-gift');
        giftElement.innerHTML = `
          <i class="fas fa-gift"></i>
          <span>${threshold.title}</span>
        `;
        unlockedGiftsContainer.appendChild(giftElement);
      }
    });
    
    if (!hasUnlockedGifts) {
      unlockedGiftsContainer.innerHTML += '<p>Пока нет разблокированных подарков</p>';
    }
    
    // Добавляем кнопку "Перестать играть"
    const stopPlayingBtn = document.createElement('button');
    stopPlayingBtn.classList.add('btn-secondary');
    stopPlayingBtn.textContent = 'Перестать играть';
    stopPlayingBtn.addEventListener('click', () => {
      if (gameEnd) gameEnd.classList.add('hidden');
      if (gameStart) gameStart.classList.remove('hidden');
    });
    
    // Удаляем предыдущее содержимое, если оно есть
    const existingContainer = gameEnd.querySelector('.unlocked-gifts-container');
    if (existingContainer) {
      existingContainer.remove();
    }
    
    const existingStopButton = gameEnd.querySelector('.btn-secondary');
    if (existingStopButton) {
      existingStopButton.remove();
    }
    
    // Добавляем контейнер и кнопку в конец экрана завершения игры
    if (gameEnd) {
      gameEnd.appendChild(unlockedGiftsContainer);
      gameEnd.appendChild(stopPlayingBtn);
    }
    
    // Обновляем рекорд, если текущий счет выше
    if (score > recordScore) {
      recordScore = score;
      localStorage.setItem('loveGameRecord', recordScore);
      
      if (gameRecordDisplay) {
        gameRecordDisplay.textContent = recordScore;
      }
    }
  }
  
  // Обработчики для кнопок
  console.log('Добавление обработчиков к кнопкам игры');
  
  // Кнопка старта игры
  if (startGameBtn) {
    startGameBtn.addEventListener('click', function(e) {
      console.log('Нажата кнопка start-game');
      e.preventDefault();
      startGame();
    });
  }
  
  // Кнопка рестарта игры
  if (restartGameBtn) {
    restartGameBtn.addEventListener('click', function(e) {
      console.log('Нажата кнопка restart-game');
      e.preventDefault();
      startGame();
    });
  }
}

// =================== Генератор любовных сообщений ===================
function initLoveMessageGenerator() {
  const messageDisplay = document.getElementById('love-message');
  const generateBtn = document.getElementById('generate-message');
  const copyBtn = document.getElementById('copy-message');
  
  // Проверяем наличие элементов
  if (!messageDisplay || !generateBtn) return;
  
  // База любовных сообщений
  const loveMessages = [
    "Ты моё солнце в пасмурный день и моя звезда в тёмную ночь. Люблю тебя бесконечно ❤️",
    "Каждый момент с тобой для меня драгоценен. Я благодарен судьбе за то, что ты у меня есть 💕",
    "Ты заполняешь мою жизнь радостью и смыслом. С тобой я нашёл/нашла настоящее счастье 💘",
    "Когда я рядом с тобой, время останавливается, и весь мир вокруг исчезает. Ты - моя вселенная 🌌",
    "Мои чувства к тебе только растут с каждым днём. Я никогда не думал/а, что можно любить кого-то так сильно 💓",
    "Твоя улыбка — моё любимое зрелище, твой смех — моя любимая мелодия. Ты — моё всё ✨",
    "Я так благодарен/на за твою любовь и заботу. Ты делаешь меня лучше каждый день 🙏",
    "Моё сердце принадлежит тебе навсегда. Ты — лучшее, что когда-либо случалось со мной 💖",
    "С тобой я нашёл/нашла смысл жизни. Ты мой якорь и мой парус одновременно 🌊",
    "Ты зажигаешь огонь в моей душе. Спасибо, что любишь меня такой/таким, какой/какая я есть 🔥",
    "Я хочу проснуться рядом с тобой и каждое утро говорить, как сильно я тебя люблю 🌞",
    "Ты мой самый ценный подарок судьбы. Моя любовь к тебе безгранична 🎁",
    "Когда ты берёшь меня за руку, я чувствую, что нам подвластно всё на свете. Вместе мы — сила 👫",
    "Мечтаю о том дне, когда я смогу назвать тебя своей/своим навсегда. Ты — моя судьба 💫",
    "Твоя любовь делает меня самым счастливым/самой счастливой человеком на земле. Я обещаю беречь твоё сердце 💗"
  ];
  
  // Функция для генерации сообщения
  function generateMessage() {
    // Выбираем случайное сообщение
    const randomIndex = Math.floor(Math.random() * loveMessages.length);
    const randomMessage = loveMessages[randomIndex];
    
    // Анимируем появление нового сообщения
    messageDisplay.style.opacity = 0;
    
    setTimeout(() => {
      messageDisplay.textContent = randomMessage;
      messageDisplay.style.opacity = 1;
    }, 300);
  }
  
  // Функция для копирования сообщения
  function copyMessage() {
    if (!messageDisplay.textContent) return;
    
    navigator.clipboard.writeText(messageDisplay.textContent)
      .then(() => {
        // Уведомляем пользователя об успешном копировании
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Скопировано! ✓';
        copyBtn.classList.add('copied');
        
        // Возвращаем оригинальный текст через некоторое время
        setTimeout(() => {
          copyBtn.textContent = originalText;
          copyBtn.classList.remove('copied');
        }, 2000);
      })
      .catch(err => {
        console.error('Не удалось скопировать текст: ', err);
      });
  }
  
  // Обработчики событий
  generateBtn.addEventListener('click', generateMessage);
  
  if (copyBtn) {
    copyBtn.addEventListener('click', copyMessage);
  }
  
  // Генерируем первое сообщение при загрузке
  generateMessage();
}

// =================== Слайдер воспоминаний ===================
function initMemoriesSlider() {
  const slider = document.querySelector('.memories-slider');
  const sliderWrapper = document.querySelector('.memories-slider-wrapper');
  const prevBtn = document.getElementById('memory-prev');
  const nextBtn = document.getElementById('memory-next');
  const slides = document.querySelectorAll('.memory-slide');
  
  // Проверяем наличие элементов
  if (!slider || !slides.length || !prevBtn || !nextBtn) return;
  
  let currentSlide = 0;
  let touchStartX = 0;
  let touchEndX = 0;
  
  // Функция для обновления слайдера
  function updateSlider() {
    sliderWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Обновляем активный класс для текущего слайда
    slides.forEach((slide, index) => {
      if (index === currentSlide) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });
  }
  
  // Следующий слайд
  function nextSlide() {
    currentSlide++;
    if (currentSlide >= slides.length) {
      currentSlide = 0;
    }
    updateSlider();
  }
  
  // Предыдущий слайд
  function prevSlide() {
    currentSlide--;
    if (currentSlide < 0) {
      currentSlide = slides.length - 1;
    }
    updateSlider();
  }
  
  // Обработчики событий для кнопок
  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);
  
  // Обработчики свайпов для мобильных устройств
  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });
  
  slider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });
  
  function handleSwipe() {
    if (touchEndX < touchStartX) {
      nextSlide(); // Свайп влево
    } else if (touchEndX > touchStartX) {
      prevSlide(); // Свайп вправо
    }
  }
  
  // Автоматическое переключение слайдов
  let autoSlideInterval = setInterval(nextSlide, 5000);
  
  // Останавливаем автоматическое переключение при взаимодействии
  slider.addEventListener('mouseenter', () => {
    clearInterval(autoSlideInterval);
  });
  
  slider.addEventListener('mouseleave', () => {
    autoSlideInterval = setInterval(nextSlide, 5000);
  });
  
  // Обновляем слайдер при загрузке
  updateSlider();
}

// =================== Виртуальные подарки ===================
function initVirtualGifts() {
  const giftItems = document.querySelectorAll('.gift-item');
  const giftModal = document.getElementById('gift-modal');
  const giftImage = document.getElementById('gift-image');
  const giftTitle = document.getElementById('gift-title');
  const giftMessage = document.getElementById('gift-message');
  const closeGiftBtn = document.getElementById('close-gift');
  const sendGiftBtn = document.getElementById('send-gift-btn');
  const giftSection = document.getElementById('virtual-gifts');
  
  // Проверяем наличие элементов
  if (!giftSection) return;
  
  // Определяем виртуальные подарки
  const gifts = [
    {
      id: 'roses',
      title: 'Букет роз',
      image: 'img/gifts/roses.jpg',
      message: 'Эти виртуальные розы никогда не завянут, как и моя любовь к тебе. 🌹',
      requiredScore: 10
    },
    {
      id: 'chocolate',
      title: 'Коробка шоколада',
      image: 'img/gifts/chocolate.jpg',
      message: 'Сладкий подарок для самого сладкого человека в моей жизни. 🍫',
      requiredScore: 25
    },
    {
      id: 'teddy',
      title: 'Плюшевый медвежонок',
      image: 'img/gifts/teddy.jpg',
      message: 'Обнимашки на расстоянии. Представь, что это я обнимаю тебя. 🧸',
      requiredScore: 40
    },
    {
      id: 'star',
      title: 'Звезда с твоим именем',
      image: 'img/gifts/star.jpg',
      message: 'Ты сияешь в моей жизни ярче всех звёзд на небе. ✨',
      requiredScore: 55
    }
  ];
  
  // Получаем разблокированные подарки из localStorage
  const unlockedGifts = JSON.parse(localStorage.getItem('unlockedGifts')) || [];
  
  // Отображаем все подарки в интерфейсе
  displayGifts();
  
  // Функция для отображения подарков
  function displayGifts() {
    // Очищаем контейнер с подарками
    const giftsContainer = giftSection.querySelector('.gifts-container');
    if (!giftsContainer) {
      console.error('Контейнер подарков не найден');
      return;
    }
    
    giftsContainer.innerHTML = '';
    
    // Отображаем все подарки
    gifts.forEach(gift => {
      const isUnlocked = unlockedGifts.includes(gift.id);
      
      const giftCard = document.createElement('div');
      giftCard.classList.add('gift-card');
      if (!isUnlocked) {
        giftCard.classList.add('gift-locked');
      }
      
      // Создаем содержимое карточки подарка
      giftCard.innerHTML = `
        <div class="gift-image">
          ${isUnlocked 
            ? `<img src="${gift.image}" alt="${gift.title}">`
            : `<div class="gift-locked-overlay">
                <i class="fas fa-lock"></i>
                <p>Набери ${gift.requiredScore} очков в игре!</p>
              </div>
              <img src="img/gifts/gift-locked.jpg" alt="Заблокированный подарок">`
          }
        </div>
        <div class="gift-title">${gift.title}</div>
        <div class="gift-description">
          ${isUnlocked 
            ? gift.message
            : `Этот подарок станет доступен, когда ты наберешь ${gift.requiredScore} очков в игре "Поймай мое сердце"`
          }
        </div>
      `;
      
      // Если подарок разблокирован, добавляем обработчик клика
      if (isUnlocked) {
        giftCard.setAttribute('data-gift', gift.id);
        giftCard.addEventListener('click', () => {
          openGiftModal(gift);
        });
      } else {
        // Для заблокированных подарков добавляем обработчик, показывающий подсказку
        giftCard.addEventListener('click', () => {
          showUnlockHint(gift);
        });
      }
      
      // Добавляем карточку в контейнер
      giftsContainer.appendChild(giftCard);
    });
  }
  
  // Функция для открытия модального окна с подарком
  function openGiftModal(gift) {
    if (!giftModal) {
      console.error('Модальное окно подарка не найдено');
      return;
    }
    
    if (giftImage && giftTitle && giftMessage) {
      giftImage.src = gift.image;
      giftImage.alt = gift.title;
      giftTitle.textContent = gift.title;
      giftMessage.textContent = gift.message;
      
      // Показываем модальное окно с подарком
      giftModal.classList.add('active');
    }
  }
  
  // Функция для отображения подсказки о разблокировке
  function showUnlockHint(gift) {
    const notification = document.createElement('div');
    notification.classList.add('gift-unlock-hint');
    notification.innerHTML = `
      <i class="fas fa-gamepad"></i>
      <p>Чтобы разблокировать "${gift.title}", набери ${gift.requiredScore} очков в игре "Поймай мое сердце"!</p>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 500);
    }, 3000);
  }
  
  // Закрытие модального окна
  if (closeGiftBtn && giftModal) {
    closeGiftBtn.addEventListener('click', () => {
      giftModal.classList.remove('active');
    });
  }
  
  // Отправка подарка (имитация)
  if (sendGiftBtn && giftModal) {
    sendGiftBtn.addEventListener('click', () => {
      // Имитируем отправку
      sendGiftBtn.textContent = 'Отправляется...';
      sendGiftBtn.disabled = true;
      
      setTimeout(() => {
        sendGiftBtn.textContent = 'Подарок отправлен! ✓';
        
        setTimeout(() => {
          giftModal.classList.remove('active');
          sendGiftBtn.textContent = 'Отправить подарок';
          sendGiftBtn.disabled = false;
        }, 1500);
      }, 1000);
    });
  }
  
  // Прослушиваем событие изменения разблокированных подарков
  window.addEventListener('storage', function(e) {
    if (e.key === 'unlockedGifts') {
      // Обновляем список разблокированных подарков
      const updatedUnlockedGifts = JSON.parse(e.newValue) || [];
      // Перерисовываем подарки
      displayGifts();
    }
  });
  
  // Проверяем разблокированные подарки каждые 5 секунд для обновления интерфейса в реальном времени
  setInterval(() => {
    const currentUnlockedGifts = JSON.parse(localStorage.getItem('unlockedGifts')) || [];
    if (JSON.stringify(currentUnlockedGifts) !== JSON.stringify(unlockedGifts)) {
      // Обновляем список и интерфейс, если были изменения
      unlockedGifts.length = 0;
      currentUnlockedGifts.forEach(gift => unlockedGifts.push(gift));
      displayGifts();
    }
  }, 5000);
}

// =========================================================
// Остальные вспомогательные функции
// =========================================================

// Инициализация музыкального плеера (дополнительные взаимодействия)
function initMusicPlayerInteractions() {
  const viewLoveBtn = document.getElementById('view-love-btn');
  
  if (viewLoveBtn) {
    viewLoveBtn.addEventListener('click', function() {
      // Плавная прокрутка к музыкальному плееру только при клике на кнопку
      document.getElementById('music-section').scrollIntoView({
        behavior: 'smooth'
      });
      
      // Автоматически запускаем музыку только при клике на кнопку
      setTimeout(() => {
        const playBtn = document.getElementById('play-pause');
        if (playBtn) playBtn.click();
      }, 1000);
    });
  }
}

// =================== Стихи о любви ===================
function initLovePoems(forceIndex) {
  console.log('Инициализация раздела стихов о любви', forceIndex !== undefined ? `с индексом ${forceIndex}` : '');
  
  const poemText = document.getElementById('poem-text');
  const generatePoemBtn = document.getElementById('generate-poem');
  const poemLoader = document.getElementById('poem-loader');
  
  // Делаем индекс глобальным, чтобы избежать сброса при повторной инициализации
  if (typeof window.currentPoemIndex === 'undefined') {
    window.currentPoemIndex = 0;
    console.log('Создан глобальный индекс для стихов: window.currentPoemIndex = 0');
  }
  
  console.log('Элементы для стихов:', {
    poemText: poemText ? 'найден' : 'не найден',
    generatePoemBtn: generatePoemBtn ? 'найден' : 'не найден',
    poemLoader: poemLoader ? 'найден' : 'не найден',
    currentPoemIndex: window.currentPoemIndex
  });
  
  // Проверяем наличие элементов
  if (!poemText || !generatePoemBtn) {
    console.error('Не найдены элементы для раздела стихов');
    return;
  }
  
  console.log('Элементы раздела стихов найдены');
  
  // Коллекция любовных стихов
  const poems = [
    `Я люблю тебя без причин и условий,<br>
    Как солнце любит небосвод.<br>
    Моя любовь не знает сомнений и оков,<br>
    Она свободна и чиста, как первый снег.`,
    
    `Твои глаза как два озера,<br>
    В них утонуть готов любой.<br>
    Ты - вдохновение поэтов,<br>
    Я счастлив быть всегда с тобой.`,
    
    `В мире, где судьбы сплетаются сложно,<br>
    Нашу любовь не измерить словами.<br>
    Я обещаю, что всё возможно,<br>
    Пока ты рядом, и пока мы вместе с тобой.`,
    
    `Ты - мой свет в темноте ночи,<br>
    Мой маяк, что ведёт сквозь бури.<br>
    В твоих объятиях все невзгоды<br>
    Становятся легче и не страшны.`,
    
    `Как сложно порой подобрать слова,<br>
    Чтоб выразить всю глубину чувств к тебе.<br>
    Но знай, что в сердце моём навсегда<br>
    Ты - главное сокровище в моей судьбе.`,
    
    `Не боюсь я признаться в любви,<br>
    Мои чувства сильнее с каждым днём.<br>
    Хочу прожить с тобой все дни,<br>
    Создавая счастье в доме своём.`,
    
    `Люблю тебя за то, что ты такая,<br>
    За нежность, доброту и теплоту.<br>
    За то, что каждый день, не уставая,<br>
    Даришь мне любовь и красоту.`,
    
    `Я не поэт, но для тебя готов<br>
    Писать стихи до самого рассвета.<br>
    Моя любовь не требует оков,<br>
    Она лишь ждёт ответа.`,
    
    `Когда ты рядом, время замирает,<br>
    И сердце бьётся чаще и сильней.<br>
    Твоя улыбка душу согревает,<br>
    С тобой мир ярче и добрей.`,
    
    `В твоих глазах я вижу отражение<br>
    Всего, о чём мечтал я много лет.<br>
    Ты - моё самое большое вдохновение,<br>
    Моя опора и мой свет.`,
    
    `Любить тебя - как дышать воздухом,<br>
    Естественно и необходимо.<br>
    Ты часть меня, моя вселенная,<br>
    Моя мечта неповторимая.`,
    
    `Я благодарен судьбе за встречу,<br>
    За то, что ты есть в моей жизни.<br>
    Я каждый день твой образ отмечу<br>
    В своём сердце, в своих мыслях.`,
    
    `Ты - мой рассвет и мой закат,<br>
    Моё начало и мой конец.<br>
    Я за тобой пойду наугад<br>
    До края земли, как верный боец.`,
    
    `Нет слов, чтоб описать мои чувства,<br>
    Они глубже, чем океаны.<br>
    С тобой каждый день - это искусство<br>
    Любить и быть любимым неустанно.`,
    
    `Твоя любовь - мой оберег,<br>
    Твои слова - моя защита.<br>
    С тобой я счастлив, как во сне,<br>
    И жизнь моя тобой наполнена, раскрыта.`,
    
    `Я люблю тебя тихо и нежно,<br>
    Как любят закат и рассвет.<br>
    Моя любовь к тебе безбрежна,<br>
    И ей преград и границ просто нет.`,
    
    `Когда мы встретились с тобой,<br>
    Мир словно заново родился.<br>
    Я понял, что такое любовь,<br>
    И в сердце свет навеки поселился.`,
    
    `Ты - моё счастье, моя радость,<br>
    Моя надежда и мечта.<br>
    С тобой и горечь жизни - сладость,<br>
    И каждый миг полон тепла.`,
    
    `В моём сердце ты царишь безраздельно,<br>
    Твой образ всегда со мной.<br>
    Я люблю тебя, моя милая,<br>
    И буду любить вечно, родной.`,
    
    `Я люблю тебя больше, чем звёзды на небе,<br>
    Больше, чем капли дождя.<br>
    Моя любовь к тебе бесконечна,<br>
    И растёт с каждым днём у меня.`,
    
    // Другие стихи...
  ];

  // Если у нас есть принудительный индекс, используем его
  if (forceIndex !== undefined && forceIndex >= 0 && forceIndex < poems.length) {
    window.currentPoemIndex = forceIndex;
    console.log(`Принудительное изменение индекса стиха на ${forceIndex}`);
  }
  
  // Очищаем все существующие обработчики событий с кнопки
  if (generatePoemBtn) {
    console.log('Очищаем существующие обработчики с кнопки');
    const newBtn = generatePoemBtn.cloneNode(true);
    if (generatePoemBtn.parentNode) {
      generatePoemBtn.parentNode.replaceChild(newBtn, generatePoemBtn);
    }
    
    // Добавляем новый обработчик
    newBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Клик по кнопке "Другой стих"');
      
      // Увеличиваем счетчик и переходим к следующему стиху
      window.currentPoemIndex = (window.currentPoemIndex + 1) % poems.length;
      console.log(`Переключаем на стих #${window.currentPoemIndex + 1}`);
      
      // Отображаем новый стих
      displayPoem(window.currentPoemIndex);
    });
    
    console.log('Добавлен новый обработчик для кнопки стихов');
  }
  
  // Функция для отображения стиха
  function displayPoem(index) {
    console.log(`Отображение стиха ${index + 1}/${poems.length}`);
    
    // Показываем индикатор загрузки
    if (poemLoader) {
      poemLoader.classList.remove('hidden');
      console.log('Показываем индикатор загрузки');
    }
    
    // Скрываем текст стиха для анимации
    if (poemText) {
      poemText.style.opacity = 0;
      console.log('Скрываем текст стиха (opacity: 0)');
    }
    
    // Устанавливаем небольшую задержку для эффекта загрузки
    setTimeout(() => {
      // Устанавливаем новый текст стиха
      if (poemText) {
        poemText.innerHTML = poems[index];
        console.log('Установлен новый текст стиха:', index);
        
        // Плавно показываем новый стих
        poemText.style.opacity = 1;
        console.log('Показываем новый стих (opacity: 1)');
      }
      
      // Скрываем индикатор загрузки
      if (poemLoader) {
        poemLoader.classList.add('hidden');
        console.log('Скрываем индикатор загрузки');
      }
    }, 400);
  }
  
  // Отображаем стих при загрузке страницы
  console.log(`Отображаем стих с индексом ${window.currentPoemIndex}`);
  displayPoem(window.currentPoemIndex);
}

// =================== Временная линия отношений ===================
function initRelationshipTimeline() {
  try {
    console.log('Начало инициализации временной линии отношений');
    
    // Проверка, существует ли секция
    const timelineSection = document.getElementById('relationship-timeline');
    if (!timelineSection) {
      console.error('Секция relationship-timeline не найдена в HTML!');
      return;
    }
    
    const timelineEvents = document.getElementById('timeline-events');
    console.log('Элемент timeline-events:', timelineEvents);
    
    const modal = document.getElementById('timeline-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDate = document.getElementById('modal-date');
    const modalDescription = document.getElementById('modal-description');
    const modalClose = document.querySelector('.modal-close');
    
    // Проверяем наличие элементов
    if (!timelineEvents) {
      console.error('timeline-events элемент не найден');
      
      // Если элемент не найден, попробуем создать его
      if (timelineSection) {
        console.log('Пробуем создать элемент timeline-events');
        const timelineContainer = timelineSection.querySelector('.timeline-container');
        if (timelineContainer) {
          const newTimelineEvents = document.createElement('div');
          newTimelineEvents.id = 'timeline-events';
          newTimelineEvents.className = 'timeline-events';
          timelineContainer.appendChild(newTimelineEvents);
          console.log('Элемент timeline-events создан:', newTimelineEvents);
          
          // Обновляем ссылку на созданный элемент
          const updatedTimelineEvents = document.getElementById('timeline-events');
          if (updatedTimelineEvents) {
            console.log('Обновленная ссылка на timeline-events:', updatedTimelineEvents);
            displayTimelineEvents(updatedTimelineEvents);
            return;
          }
        } else {
          console.error('Контейнер timeline-container не найден');
          return;
        }
      }
      return;
    }
    
    console.log('Инициализация временной линии отношений');
    
    // Получаем сохраненную дату из localStorage или используем значение по умолчанию
    const startDate = new Date(parseInt(localStorage.getItem('relationshipStartDate')) || new Date(2025, 1, 27).getTime());
    console.log('Начальная дата отношений:', startDate);
    
    // Загрузка событий
    displayTimelineEvents(timelineEvents);
    
    // Обработчик закрытия модального окна
    if (modalClose) {
      modalClose.addEventListener('click', function() {
        if (modal) {
          modal.classList.remove('active');
          setTimeout(() => {
            modal.style.display = 'none';
          }, 300);
        }
      });
    }
    
    // Закрытие по клику вне модального окна
    window.addEventListener('click', function(event) {
      if (modal && event.target === modal) {
        modal.classList.remove('active');
        setTimeout(() => {
          modal.style.display = 'none';
        }, 300);
      }
    });
    
    // Закрытие по нажатию ESC
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && modal && modal.classList.contains('active')) {
        modal.classList.remove('active');
        setTimeout(() => {
          modal.style.display = 'none';
        }, 300);
      }
    });
    
    // Отображение событий на временной линии
    function displayTimelineEvents(eventsContainer) {
      console.log('Отображение событий на таймлайне');
      if (!eventsContainer) {
        console.error('Контейнер для событий не передан в функцию displayTimelineEvents');
        return;
      }
      eventsContainer.innerHTML = '';
      
      // Пересчитываем даты относительно стартовой даты отношений
      const firstMeetStartDate = new Date(startDate);
      firstMeetStartDate.setDate(firstMeetStartDate.getDate() - 13); // 13 дней до начала отношений
      
      const firstDateStartDate = new Date(startDate);
      firstDateStartDate.setDate(firstDateStartDate.getDate() - 3); // 3 дня до начала отношений
      
      const firstMonthDate = new Date(startDate);
      firstMonthDate.setMonth(firstMonthDate.getMonth() + 1); // 1 месяц после начала отношений
      
      const firstAnniversaryDate = new Date(startDate);
      firstAnniversaryDate.setFullYear(firstAnniversaryDate.getFullYear() + 1); // 1 год после начала отношений
      
      // Форматируем даты
      const formatDate = (date) => {
        const day = date.getDate();
        const month = date.toLocaleString('ru', { month: 'long' });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
      };
      
      // События временной линии с более подробным описанием
      const events = [
        {
          date: formatDate(firstMeetStartDate),
          title: "Наша первая встреча",
          description: "День, когда я впервые увидел твою улыбку и понял, что влюбился. Ты была такой красивой и открытой, что я не мог отвести взгляд. Твой смех заполнил комнату, и я понял, что хочу слышать его снова и снова.",
          icon: "fa-eye",
          color: "#FFA07A"
        },
        {
          date: formatDate(firstDateStartDate),
          title: "Первое свидание",
          description: "Мы гуляли и разговаривали до позднего вечера. Я не хотел, чтобы этот день заканчивался. Помнишь тот уютный ресторан и как мы обсуждали наши мечты? Время летело незаметно, и мы не могли наговориться. Уже тогда я понял, как много у нас общего.",
          icon: "fa-heart",
          color: "#FFB6C1"
        },
        {
          date: formatDate(startDate),
          title: "Мы стали парой",
          description: "День, когда ты сказала 'да' и сделала меня самым счастливым человеком. Я до сих пор помню каждую деталь того дня: твой взгляд, твою улыбку, твои слова. Я благодарен судьбе за то, что ты выбрала меня. Этот день навсегда изменил мою жизнь и наполнил её смыслом и любовью.",
          icon: "fa-infinity",
          color: "#FF69B4"
        },
        {
          date: formatDate(firstMonthDate),
          title: "Месяц вместе",
          description: "Наш первый маленький юбилей! Каждый день этого месяца был наполнен открытиями друг о друге. Мы начали создавать наши первые совместные традиции и воспоминания. Помнишь наше селфи с воздушными шариками? Я сохранил его как символ нашего первого месяца счастья вместе.",
          icon: "fa-calendar-check",
          color: "#DA70D6"
        },
        {
          date: formatDate(firstAnniversaryDate),
          title: "Первая годовщина",
          description: "Целый год любви, поддержки и счастья. За это время мы многое пережили вместе: радости и трудности, смех и слезы. Я благодарен за каждый момент с тобой и горжусь тем, как мы выросли вместе. Ты стала неотъемлемой частью моей жизни, и я не могу представить будущее без тебя. С первой годовщиной, любимая!",
          icon: "fa-champagne-glasses",
          color: "#FF1493"
        }
      ];
      
      console.log('События для таймлайна:', events);
      
      events.forEach((event, index) => {
        try {
          console.log(`Создание элемента события ${index + 1}:`, event.title);
          const eventElement = document.createElement('div');
          
          // Чередуем левые и правые события
          const isLeft = index % 2 === 0;
          eventElement.className = `timeline-event ${isLeft ? 'left-event' : 'right-event'}`;
          
          // Создаем элемент с иконкой, датой, заголовком и кнопкой "Читать дальше"
          eventElement.innerHTML = `
            <div class="timeline-content" style="border-top: 3px solid ${event.color || '#ff6b95'}">
              <div class="timeline-icon" style="background-color: ${event.color || '#ff6b95'}">
                <i class="fas ${event.icon || 'fa-heart'}"></i>
              </div>
              <div class="timeline-date"><i class="far fa-calendar"></i> ${event.date}</div>
              <h3 class="timeline-title">${event.title}</h3>
              <div class="timeline-preview">${event.description.substring(0, 80)}...</div>
              <button class="timeline-read-more">Читать подробнее <i class="fas fa-arrow-right"></i></button>
            </div>
          `;
          
          // Добавляем анимацию появления при скролле
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                console.log(`Событие ${index + 1} видимо в области просмотра, добавляем класс visible`);
                eventElement.classList.add('visible');
                observer.unobserve(entry.target);
              }
            });
          }, { threshold: 0.3 });
          
          // Открытие модального окна при клике на кнопку "Читать подробнее"
          const readMoreBtn = eventElement.querySelector('.timeline-read-more');
          if (readMoreBtn) {
            readMoreBtn.addEventListener('click', function(e) {
              console.log(`Клик на кнопке "Читать подробнее" для события ${index + 1}`);
              e.stopPropagation(); // Предотвращаем распространение события
              openModal(event);
            });
          }
          
          // Открытие модального окна при клике на весь элемент
          const contentElement = eventElement.querySelector('.timeline-content');
          if (contentElement) {
            contentElement.addEventListener('click', function() {
              console.log(`Клик на контенте события ${index + 1}`);
              openModal(event);
            });
          }
          
          eventsContainer.appendChild(eventElement);
          console.log(`Событие ${index + 1} добавлено в DOM`);
          observer.observe(eventElement);
        } catch (error) {
          console.error(`Ошибка при создании события ${index + 1}:`, error);
        }
      });
    }
    
    // Функция для открытия модального окна
    function openModal(event) {
      console.log('Открытие модального окна с событием:', event.title);
      if (modal && modalTitle && modalDate && modalDescription) {
        // Заполняем модальное окно данными события
        modalTitle.textContent = event.title;
        modalDate.textContent = event.date;
        modalDescription.textContent = event.description;
        
        // Применяем цвет события к модальному окну
        if (event.color) {
          modalTitle.style.color = event.color;
          modalDate.style.borderBottom = `2px solid ${event.color}`;
        }
        
        // Показываем модальное окно
        modal.style.display = 'flex';
        
        // Анимация появления модального окна
        setTimeout(() => {
          modal.classList.add('active');
        }, 10);
      } else {
        console.error('Элементы модального окна не найдены:', {
          modal: !!modal,
          modalTitle: !!modalTitle,
          modalDate: !!modalDate,
          modalDescription: !!modalDescription
        });
      }
    }
  } catch (error) {
    console.error('Произошла ошибка при инициализации временной линии:', error);
  }
}