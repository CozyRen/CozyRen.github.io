// =================== Стихи о любви ===================
document.addEventListener('DOMContentLoaded', function() {
  initLovePoems();
});

function initLovePoems() {
  console.log('Инициализация раздела стихов о любви');
  
  // Получаем необходимые элементы
  const poemText = document.getElementById('poem-text');
  const generatePoemBtn = document.getElementById('generate-poem');
  const poemLoader = document.getElementById('poem-loader');
  const poemContainer = document.getElementById('poem-container');
  
  // Проверяем наличие элементов
  if (!poemText) {
    console.error('Не найден элемент poem-text');
    return;
  }
  if (!generatePoemBtn) {
    console.error('Не найдена кнопка generate-poem');
    return;
  }
  if (!poemLoader) {
    console.error('Не найден элемент poem-loader');
    return;
  }
  if (!poemContainer) {
    console.error('Не найден элемент poem-container');
    return;
  }
  
  console.log('Все элементы стихов найдены');
  
  // Изменяем стиль сердечка - убираем все стили кроме позиционирования вверху
  const poemHeart = document.querySelector('.poem-heart');
  if (poemHeart) {
    // Убираем все стили, оставляем только позицию наверху
    poemHeart.style.borderRadius = '0';
    poemHeart.style.overflow = 'visible';
    poemHeart.style.boxShadow = 'none';
    poemHeart.style.animation = 'none';
    poemHeart.style.border = 'none';
    poemHeart.style.backgroundColor = 'transparent';
    poemHeart.style.width = 'auto';
    poemHeart.style.height = 'auto';
    
    // Переносим сердечко в начало контейнера
    const poemContainer = poemHeart.closest('.poem-container');
    if (poemContainer) {
      poemContainer.insertBefore(poemHeart, poemContainer.firstChild);
    }
  }
  
  // Коллекция стихов
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
    Даришь мне любовь и красоту.`
  ];
  
  // Сохраняем индекс в localStorage
  let currentPoemIndex = parseInt(localStorage.getItem('currentPoemIndex')) || 0;
  
  // Функция для отображения стиха
  function displayPoem(index) {
    try {
      console.log(`Отображение стиха ${index + 1}/${poems.length}`);
      
      // Показываем индикатор загрузки
      poemLoader.classList.remove('hidden');
      
      // Скрываем текущий текст
      poemText.style.opacity = '0';
      
      // Устанавливаем таймер для имитации загрузки
      setTimeout(() => {
        try {
          // Обновляем текст стиха
          poemText.innerHTML = poems[index];
          poemText.style.opacity = '1';
          
          // Скрываем индикатор загрузки
          poemLoader.classList.add('hidden');
          
          // Сохраняем текущий индекс
          localStorage.setItem('currentPoemIndex', index);
          
        } catch (error) {
          console.error('Ошибка при обновлении стиха:', error);
          poemLoader.classList.add('hidden');
        }
      }, 500);
      
    } catch (error) {
      console.error('Ошибка в функции displayPoem:', error);
      poemLoader.classList.add('hidden');
    }
  }
  
  // Очищаем старые обработчики событий
  const newBtn = generatePoemBtn.cloneNode(true);
  generatePoemBtn.parentNode.replaceChild(newBtn, generatePoemBtn);
  
  // Добавляем новый обработчик
  newBtn.addEventListener('click', function(e) {
    try {
      e.preventDefault();
      console.log('Клик по кнопке "Другой стих"');
      
      // Увеличиваем индекс и обеспечиваем цикличность
      currentPoemIndex = (currentPoemIndex + 1) % poems.length;
      
      // Отображаем следующий стих
      displayPoem(currentPoemIndex);
      
      // Добавляем анимацию для кнопки
      this.classList.add('clicked');
      setTimeout(() => {
        this.classList.remove('clicked');
      }, 200);
      
    } catch (error) {
      console.error('Ошибка при обработке клика:', error);
    }
  });
  
  // Добавляем стили для анимаций
  const style = document.createElement('style');
  style.textContent = `
    .btn-primary.clicked {
      transform: scale(0.95);
      transition: transform 0.2s ease;
    }
    
    .poem-heart {
      border-radius: 0 !important;
      box-shadow: none !important;
      background-color: transparent !important;
      overflow: visible !important;
      position: relative;
      border: none !important;
      order: -1; /* Перемещаем сердечко в начало (верх) контейнера (для flexbox) */
      margin: 15px auto !important;
      width: auto !important;
      height: auto !important;
      pointer-events: none !important; /* Отключаем все эффекты при наведении */
    }
    
    /* Отключаем любые эффекты при наведении */
    .poem-heart:hover {
      background-color: transparent !important;
      box-shadow: none !important;
      transform: none !important;
      filter: none !important;
    }
    
    .poem-heart i, .poem-heart svg, .poem-heart img {
      pointer-events: none !important;
    }
    
    .poem-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  `;
  document.head.appendChild(style);
  
  // Отображаем первый стих при загрузке
  displayPoem(currentPoemIndex);
  
  console.log('Инициализация стихов завершена');
}

// Экспортируем функцию
window.initLovePoems = initLovePoems; 