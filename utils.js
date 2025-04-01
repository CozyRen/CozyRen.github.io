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

// Экспортируем функции
window.initSmoothScrolling = initSmoothScrolling;
window.initLoadingScreen = initLoadingScreen;
window.initConnectionMonitor = initConnectionMonitor; 