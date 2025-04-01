// =================== Генератор комплиментов ===================
document.addEventListener('DOMContentLoaded', function() {
  initComplimentGenerator();
});

function initComplimentGenerator() {
  console.log('Инициализация генератора комплиментов');
  
  // Получаем необходимые элементы
  const complimentText = document.getElementById('compliment-text');
  const generateBtn = document.getElementById('generate-compliment');
  const complimentLoader = document.getElementById('compliment-loader');
  const categoryButtons = document.querySelectorAll('.category-btn');
  
  // Проверяем наличие элементов
  if (!complimentText || !generateBtn || !complimentLoader) {
    console.error('Не найдены основные элементы для комплиментов');
    return;
  }
  
  console.log('Все элементы комплиментов найдены');
  
  // База комплиментов по категориям
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
  let lastComplimentIndex = {};

  // Инициализация индексов для каждой категории
  Object.keys(compliments).forEach(category => {
    lastComplimentIndex[category] = -1;
  });

  // Функция для получения случайного комплимента
  function getRandomCompliment(category) {
    let availableCompliments = [];
    
    if (category === 'all') {
      // Собираем все комплименты
      Object.values(compliments).forEach(categoryCompliments => {
        availableCompliments = [...availableCompliments, ...categoryCompliments];
      });
    } else {
      availableCompliments = compliments[category];
    }
    
    // Получаем случайный индекс, отличный от предыдущего
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * availableCompliments.length);
    } while (randomIndex === lastComplimentIndex[category] && availableCompliments.length > 1);
    
    lastComplimentIndex[category] = randomIndex;
    return availableCompliments[randomIndex];
  }

  // Функция для отображения комплимента
  function displayCompliment() {
    try {
      console.log('Генерация нового комплимента для категории:', selectedCategory);
      
      // Показываем индикатор загрузки
      complimentLoader.classList.remove('hidden');
      complimentText.style.opacity = '0';
      
      setTimeout(() => {
        try {
          const newCompliment = getRandomCompliment(selectedCategory);
          
          // Плавно обновляем текст
          complimentText.innerHTML = newCompliment;
          complimentText.style.opacity = '1';
          
          // Скрываем индикатор загрузки
          complimentLoader.classList.add('hidden');
          
          // Добавляем эффект появления
          complimentText.classList.add('fade-in');
          setTimeout(() => {
            complimentText.classList.remove('fade-in');
          }, 500);
          
        } catch (error) {
          console.error('Ошибка при обновлении комплимента:', error);
          complimentLoader.classList.add('hidden');
        }
      }, 500);
      
    } catch (error) {
      console.error('Ошибка в функции displayCompliment:', error);
      complimentLoader.classList.add('hidden');
    }
  }

  // Обработчики для кнопок категорий
  categoryButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Убираем активный класс у всех кнопок
      categoryButtons.forEach(btn => btn.classList.remove('active'));
      
      // Добавляем активный класс текущей кнопке
      this.classList.add('active');
      
      // Обновляем выбранную категорию
      selectedCategory = this.dataset.category;
      
      // Генерируем новый комплимент
      displayCompliment();
    });
  });

  // Обработчик для кнопки генерации
  generateBtn.addEventListener('click', function(e) {
    e.preventDefault();
    
    // Добавляем анимацию нажатия
    this.classList.add('clicked');
    setTimeout(() => {
      this.classList.remove('clicked');
    }, 200);
    
    displayCompliment();
  });

  // Добавляем стили для анимаций
  const style = document.createElement('style');
  style.textContent = `
    .fade-in {
      animation: fadeIn 0.5s ease-out;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .clicked {
      transform: scale(0.95);
      transition: transform 0.2s ease;
    }
    
    .category-btn {
      transition: all 0.3s ease;
    }
    
    .category-btn:hover {
      transform: translateY(-2px);
    }
    
    .category-btn.active {
      background-color: var(--pink);
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(255, 107, 149, 0.3);
    }
  `;
  document.head.appendChild(style);

  // Отображаем первый комплимент при загрузке
  displayCompliment();
  
  console.log('Инициализация генератора комплиментов завершена');
}

// Экспортируем функцию
window.initComplimentGenerator = initComplimentGenerator; 