// =================== Особое послание ===================
function initLetterEnvelope() {
  console.log('Инициализация особого послания');
  
  const specialMessage = document.getElementById('special-message');
  const signature = specialMessage ? specialMessage.querySelector('.signature') : null;
  
  if (!specialMessage || !signature) {
    console.error('Не найдены элементы для особого послания');
    return;
  }
  
  console.log('Элементы особого послания найдены');
  
  // Флаг для отслеживания состояния анимации
  let isAnimating = false;
  
  // Обработчик клика по особому посланию
  specialMessage.addEventListener('click', function(e) {
    console.log('Клик по особому посланию');
    
    // Предотвращаем множественные клики во время анимации
    if (isAnimating) {
      console.log('Анимация уже выполняется');
      return;
    }
    
    isAnimating = true;
    
    // Добавляем класс для анимации
    specialMessage.classList.add('message-clicked');
    
    // Создаем и добавляем плавающие сердечки
    createFloatingHearts(e.clientX, e.clientY);
    
    // Показываем подпись с эффектом
    if (signature) {
      signature.style.opacity = '1';
      signature.style.transform = 'translateY(0)';
      
      // Добавляем пульсацию сердечку
      const heartEmoji = signature.querySelector('.heart-emoji');
      if (heartEmoji) {
        heartEmoji.classList.add('heart-pulse-strong');
      }
    }
    
    // Через некоторое время убираем анимацию
    setTimeout(() => {
      specialMessage.classList.remove('message-clicked');
      isAnimating = false;
    }, 1000);
  });
  
  // Функция для создания плавающих сердечек
  function createFloatingHearts(x, y) {
    const container = document.querySelector('.special-message-container');
    if (!container) return;
    
    // Создаем несколько сердечек
    for (let i = 0; i < 10; i++) {
      const heart = document.createElement('div');
      heart.classList.add('floating-heart');
      heart.innerHTML = '❤️';
      
      // Позиционируем сердечко относительно клика
      const rect = container.getBoundingClientRect();
      const startX = x - rect.left;
      const startY = y - rect.top;
      
      heart.style.left = `${startX}px`;
      heart.style.top = `${startY}px`;
      
      // Добавляем случайное смещение и задержку
      const angle = (Math.random() * Math.PI * 2);
      const distance = Math.random() * 100 + 50;
      const delay = Math.random() * 0.5;
      
      heart.style.setProperty('--float-x', `${Math.cos(angle) * distance}px`);
      heart.style.setProperty('--float-y', `${Math.sin(angle) * distance - 100}px`);
      heart.style.animationDelay = `${delay}s`;
      
      container.appendChild(heart);
      
      // Удаляем сердечко после анимации
      setTimeout(() => {
        if (heart.parentNode) {
          heart.parentNode.removeChild(heart);
        }
      }, 2000);
    }
  }
}

// Экспортируем функцию
window.initLetterEnvelope = initLetterEnvelope; 