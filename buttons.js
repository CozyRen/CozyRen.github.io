// =================== Кнопки и интерактивные элементы ===================
function initHeroButtons() {
  console.log('Инициализация кнопок на главном экране');
  
  const viewLoveBtn = document.getElementById('view-love-btn');
  const readLetterBtn = document.getElementById('read-letter-btn');
  const messageSection = document.getElementById('message-section');
  const heartsContainer = document.querySelector('.hearts-container');
  
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
    globalHeartsContainer.style.pointerEvents = 'none';
    globalHeartsContainer.style.zIndex = '-1'; // Важно: размещаем сердечки за контентом
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
        console.log('Активация фоновых сердечек');
        
        // Показываем глобальный контейнер сердечек
        globalHeartsContainer.style.display = 'block';
        
        // Устанавливаем один фон для всей страницы
        document.body.classList.add('hearts-background');
        
        try {
          // Создаем начальные сердечки - уменьшаем количество
          createInitialHearts(20, globalHeartsContainer);
          
          // Запускаем интервал для добавления новых сердечек - более редкое появление
          heartCreationInterval = setInterval(() => {
            // Создаем только 1 новое сердечко каждый раз
            createHearts(1, globalHeartsContainer);
          }, 1500); // Увеличиваем интервал до 1.5 секунд
          
          // Запускаем интервал для удаления старых сердечек
          heartRemovalInterval = setInterval(() => {
            const hearts = globalHeartsContainer.querySelectorAll('.heart');
            // Если сердечек больше 25, начинаем удалять
            if (hearts.length > 25) {
              removeRandomHearts(globalHeartsContainer);
            }
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
        
        // Через секунду полностью скрываем контейнер
        setTimeout(function() {
          globalHeartsContainer.style.display = 'none';
          globalHeartsContainer.style.opacity = "1";
          // Очищаем контейнер после скрытия
          globalHeartsContainer.innerHTML = '';
          
          // Возвращаем оригинальный текст кнопки
          viewLoveBtn.textContent = 'Увидеть любовь';
          viewLoveBtn.classList.remove('active');
        }, 1000); // Увеличиваем время исчезновения
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
  }
}

// Функция для создания начальных сердечек
function createInitialHearts(count, container) {
  if (!container) return;
  
  // Создаем меньше сердечек при инициализации
  let createdCount = 0;
  
  function createDelayed() {
    if (createdCount < count) {
      createHearts(1, container);
      createdCount++;
      setTimeout(createDelayed, 100); // Увеличиваем задержку для более плавного появления
    }
  }
  
  createDelayed();
}

// Функция для удаления случайных сердечек
function removeRandomHearts(container) {
  if (!container) return;
  
  const hearts = container.querySelectorAll('.heart');
  if (hearts.length > 25) { // Уменьшаем максимальное количество сердечек
    const removeCount = Math.floor(Math.random() * 2) + 1; // 1-2 сердечка
    
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
          }, 800); // Увеличиваем время исчезновения
        }
      }
    }
  }
}

// Функция для создания сердечек
function createHearts(count, container) {
  if (!container) return;
  
  // Используем простое сердечко ❤️ вместо эмодзи
  const heartImage = '❤️'; // Обычное сердечко
  
  for (let i = 0; i < count; i++) {
    try {
      const heart = document.createElement('div');
      heart.classList.add('heart');
      
      // Устанавливаем сердечко
      heart.innerHTML = heartImage;
      
      // Случайный размер от 12px до 25px (делаем меньше)
      const size = Math.floor(Math.random() * 13) + 12;
      heart.style.width = `${size}px`;
      heart.style.height = `${size}px`;
      
      // Упрощаем распределение - избегаем центра и добавляем больше случайности
      let left, top;
      
      // Равномерное распределение по краям
      if (Math.random() < 0.7) {
        // Края экрана
        if (Math.random() < 0.5) {
          // Верх или низ
          left = Math.floor(Math.random() * 100);
          top = Math.random() < 0.5 ? 
                Math.floor(Math.random() * 20) : // Верхние 20%
                Math.floor(Math.random() * 20) + 80; // Нижние 20%
        } else {
          // Левый или правый край
          left = Math.random() < 0.5 ? 
                 Math.floor(Math.random() * 20) : // Левые 20%
                 Math.floor(Math.random() * 20) + 80; // Правые 20%
          top = Math.floor(Math.random() * 100);
        }
      } else {
        // Случайное расположение, но с избеганием центральной части
        left = Math.random() < 0.5 ? 
               Math.floor(Math.random() * 35) : // Левая треть
               Math.floor(Math.random() * 35) + 65; // Правая треть
        top = Math.random() < 0.5 ? 
              Math.floor(Math.random() * 35) : // Верхняя треть
              Math.floor(Math.random() * 35) + 65; // Нижняя треть
      }
      
      heart.style.left = `${left}%`;
      heart.style.top = `${top}%`;
      
      // Увеличиваем длительность анимации для более плавного эффекта
      const animationDuration = Math.floor(Math.random() * 5) + 5; // 5-10 секунд
      heart.style.animationDuration = `${animationDuration}s`;
      
      // Случайная задержка до 4 секунд
      const delay = Math.random() * 4;
      heart.style.animationDelay = `${delay}s`;
      
      // Маленький случайный поворот
      const rotation = Math.floor(Math.random() * 12) - 6; // -6 до +6 градусов
      heart.style.transform = `rotate(${rotation}deg)`;
      
      // Устанавливаем z-index ниже контента
      heart.style.zIndex = '-1';
      
      // Упрощаем анимации - в основном используем пульсацию
      if (Math.random() < 0.8) {
        // Пульсация для большинства сердечек
        heart.classList.add('heart-pulse');
      } else {
        // Только простое появление/исчезновение для остальных
        heart.classList.add('heart-fade');
      }
      
      // Для некоторых сердечек добавляем очень медленное плавное движение
      if (Math.random() < 0.4) {
        const floatAmount = Math.floor(Math.random() * 15) + 5; // 5-20px
        const direction = Math.random() < 0.5 ? -1 : 1;
        heart.style.setProperty('--float-x', `${direction * (Math.random() * 10)}px`);
        heart.style.setProperty('--float-y', `${-floatAmount}px`);
        heart.classList.add('heart-float');
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
          }, 800);
        }
      }, (animationDuration + delay) * 1000 + 5000);
    } catch (error) {
      console.error('Ошибка при создании сердечка:', error);
    }
  }
}

// Инициализация мобильного меню
function initMobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.getElementById('nav-links');
  
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
    
    // Закрываем меню при клике на ссылку
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }
}

// Инициализация переключателя темы
function initThemeToggle() {
  // Функциональность отключена по запросу
  console.log('Theme toggle functionality disabled');
  return;
}

// Экспортируем функции
window.initHeroButtons = initHeroButtons;
window.initMobileMenu = initMobileMenu;
window.initThemeToggle = initThemeToggle; 