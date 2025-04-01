// =================== Генератор любовных сообщений ===================
function initLoveMessageGenerator() {
  console.log('Инициализация генератора любовных сообщений');
  
  // Получаем необходимые элементы
  const messageText = document.getElementById('love-message-text');
  const generateBtn = document.getElementById('generate-love-message');
  const messageLoader = document.getElementById('love-message-loader');
  const loveSection = document.getElementById('love-generator');
  
  // Проверяем наличие элементов
  if (!messageText || !generateBtn || !messageLoader) {
    console.error('Не найдены основные элементы для генератора любовных сообщений');
    return;
  }
  
  console.log('Все элементы генератора любовных сообщений найдены');
  
  // База любовных сообщений с исправленным текстом
  const loveMessages = [
    "Ты моё солнце в пасмурный день и моя звезда в тёмную ночь. Люблю тебя бесконечно ❤️",
    "Каждый момент с тобой для меня драгоценен. Я благодарен судьбе за то, что ты у меня есть 💕",
    "Ты заполняешь мою жизнь радостью и смыслом. С тобой я обрёл настоящее счастье 💘",
    "Когда я рядом с тобой, время останавливается, и весь мир вокруг исчезает. Ты - моя вселенная 🌌",
    "Мои чувства к тебе только растут с каждым днём. Я никогда не думал, что можно любить кого-то так сильно 💓",
    "Твоя улыбка — моё любимое зрелище, твой смех — моя любимая мелодия. Ты — моё всё ✨",
    "Я так благодарен за твою любовь и заботу. Ты делаешь меня лучше каждый день 🙏",
    "Моё сердце принадлежит тебе навсегда. Ты — лучшее, что когда-либо случалось со мной 💖",
    "С тобой я обрёл смысл жизни. Ты мой якорь и мой парус одновременно 🌊",
    "Ты зажигаешь огонь в моей душе. Спасибо, что любишь меня таким, какой я есть 🔥",
    "Я хочу проснуться рядом с тобой и каждое утро говорить, как сильно я тебя люблю 🌞",
    "Ты мой самый ценный подарок судьбы. Моя любовь к тебе безгранична 🎁",
    "Когда ты берёшь меня за руку, я чувствую, что нам подвластно всё на свете. Вместе мы — сила 👫",
    "Мечтаю о том дне, когда я смогу назвать тебя своей навсегда. Ты — моя судьба 💫",
    "Твоя любовь делает меня самым счастливым человеком на земле. Я обещаю беречь твоё сердце 💗",
    "Ты не просто человек в моей жизни, ты - моя жизнь. Дышу тобой, живу для тебя 💞",
    "Я готов подарить тебе весь мир, лишь бы видеть твою улыбку каждый день 🌍",
    "Моё сердце поёт каждый раз, когда я думаю о тебе. Ты - моя любимая мелодия 🎵",
    "Пусть расстояние между нами будет любым, но моё сердце всегда рядом с тобой 💌",
    "Ты мой самый красивый сон, который стал реальностью. Боюсь проснуться без тебя 💭",
    "В каждом биении моего сердца звучит твоё имя. Ты - мой ритм жизни 💓",
    "Твоя любовь подобна звёздам - даже в самую тёмную ночь освещает мой путь ✨",
    "Встретить тебя было судьбой, полюбить тебя было выбором, а быть с тобой - это благословение 🙌",
    "Хотел бы я быть поэтом, чтобы найти слова, достойные описать мою любовь к тебе 📝",
    "Ты словно первый луч солнца, который пробуждает во мне самые светлые чувства 🌅",
    "В твоих глазах я вижу отражение всего счастья, о котором только можно мечтать 👁️",
    "Ты та, кого я искал всю жизнь, даже не осознавая этого. Теперь я нашёл тебя и не отпущу 🔍",
    "Любить тебя — самое прекрасное, что случалось со мной. Это чувство дарит мне крылья 🕊️",
    "Я благодарен каждому мгновению, проведённому с тобой. Каждая минута рядом с тобой бесценна ⌛",
    "Ты научила меня любить так, как я никогда не думал, что смогу. Спасибо тебе за это 🎓"
  ];
  
  let lastMessageIndex = -1;
  let isShowingMessage = false;
  
  // Добавляем фоновые сердечки
  createBackgroundHearts();
  
  // Функция для создания фоновых сердечек
  function createBackgroundHearts() {
    if (!loveSection) return;
    
    const heartColors = ['#ff6b95', '#ff95b5', '#ffb6c1', '#ffd2da'];
    
    for (let i = 0; i < 12; i++) {
      const heart = document.createElement('div');
      heart.classList.add('bg-heart');
      
      // Случайный размер и позиция
      const size = Math.floor(Math.random() * 15) + 10; // 10-25px
      heart.style.width = `${size}px`;
      heart.style.height = `${size}px`;
      
      // Случайный оттенок розового
      const colorIndex = Math.floor(Math.random() * heartColors.length);
      heart.style.backgroundColor = heartColors[colorIndex];
      
      // Случайная позиция
      heart.style.left = `${Math.random() * 95}%`;
      heart.style.top = `${Math.random() * 90}%`;
      
      // Случайная прозрачность
      heart.style.opacity = (Math.random() * 0.15 + 0.05).toString();
      
      // Случайное вращение
      const rotation = Math.floor(Math.random() * 60) - 30;
      heart.style.transform = `rotate(${rotation}deg)`;
      
      // Случайная длительность и задержка анимации
      const duration = Math.random() * 10 + 15; // 15-25 секунд
      const delay = Math.random() * 5;
      heart.style.animationDuration = `${duration}s`;
      heart.style.animationDelay = `${delay}s`;
      
      loveSection.appendChild(heart);
    }
  }
  
  // Функция для получения случайного сообщения
  function getRandomMessage() {
    // Получаем случайный индекс, отличный от предыдущего
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * loveMessages.length);
    } while (randomIndex === lastMessageIndex && loveMessages.length > 1);
    
    lastMessageIndex = randomIndex;
    return loveMessages[randomIndex];
  }
  
  // Функция для создания эффекта "печатающейся машинки"
  // Исправленная версия - выводит текст напрямую без перемешивания букв
  function typewriterEffect(element, text, speed = 40) {
    // Сразу устанавливаем весь текст для предотвращения перемешивания букв
    element.textContent = text;
    isShowingMessage = false;
  }
  
  // Функция для отображения сообщения
  function displayMessage() {
    try {
      // Предотвращаем множественные запросы
      if (isShowingMessage) return;
      isShowingMessage = true;
      
      console.log('Генерация нового любовного сообщения');
      
      // Показываем индикатор загрузки с задержкой
      messageLoader.classList.remove('hidden');
      messageText.style.opacity = '0';
      
      // Воспроизведение звука "биения сердца"
      playHeartbeatSound();
      
      setTimeout(() => {
        try {
          const newMessage = getRandomMessage();
          
          // Скрываем индикатор загрузки
          messageLoader.classList.add('hidden');
          messageText.style.opacity = '1';
          
          // Применяем текст напрямую без эффекта печатной машинки
          messageText.textContent = newMessage;
          isShowingMessage = false;
          
          // Добавляем эффект появления
          messageText.classList.add('message-animation');
          setTimeout(() => {
            messageText.classList.remove('message-animation');
          }, 800);
          
          // Добавляем анимацию фоновых сердечек
          animateBackgroundHearts();
          
        } catch (error) {
          console.error('Ошибка при обновлении любовного сообщения:', error);
          messageLoader.classList.add('hidden');
          isShowingMessage = false;
        }
      }, 1200);
      
    } catch (error) {
      console.error('Ошибка в функции displayMessage:', error);
      messageLoader.classList.add('hidden');
      isShowingMessage = false;
    }
  }
  
  // Функция для анимации фоновых сердечек
  function animateBackgroundHearts() {
    const hearts = loveSection.querySelectorAll('.bg-heart');
    hearts.forEach(heart => {
      heart.style.animationName = 'none';
      setTimeout(() => {
        heart.style.animationName = 'float-heart';
      }, 10);
    });
  }
  
  // Функция для воспроизведения звука биения сердца
  function playHeartbeatSound() {
    try {
      // Создаем аудио контекст
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Создаем осциллятор для биения сердца
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = 2;
      
      gainNode.gain.value = 0;
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Настраиваем громкость
      const now = audioContext.currentTime;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.2, now + 0.1);
      gainNode.gain.linearRampToValueAtTime(0, now + 0.4);
      gainNode.gain.linearRampToValueAtTime(0.3, now + 0.6);
      gainNode.gain.linearRampToValueAtTime(0, now + 1);
      
      // Запускаем и останавливаем
      oscillator.start(now);
      oscillator.stop(now + 1);
    } catch (error) {
      console.error('Ошибка при воспроизведении звука:', error);
    }
  }
  
  // Обработчик для кнопки генерации
  generateBtn.addEventListener('click', function(e) {
    e.preventDefault();
    
    // Добавляем анимацию нажатия
    this.classList.add('clicked');
    setTimeout(() => {
      this.classList.remove('clicked');
    }, 200);
    
    displayMessage();
  });
  
  // Добавляем стили для анимаций
  const style = document.createElement('style');
  style.textContent = `
    .message-animation {
      animation: messageAppear 0.8s cubic-bezier(0.18, 0.89, 0.32, 1.28);
    }
    
    @keyframes messageAppear {
      0% { transform: translateY(15px) scale(0.98); opacity: 0; }
      70% { transform: translateY(-5px) scale(1.01); }
      100% { transform: translateY(0) scale(1); opacity: 1; }
    }
    
    .clicked {
      transform: scale(0.95);
      transition: transform 0.2s ease;
    }
    
    .bg-heart {
      position: absolute;
      background-color: #ff6b95;
      display: block;
      clip-path: path('M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z');
      z-index: 0;
      opacity: 0.1;
      animation: float-heart 20s linear infinite;
    }
    
    @keyframes float-heart {
      0% { transform: translateY(0) rotate(0); }
      33% { transform: translateY(-20px) rotate(10deg); }
      66% { transform: translateY(-40px) rotate(-10deg); }
      100% { transform: translateY(-70px) rotate(0) scale(0.7); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
  
  // Отображаем первое сообщение при загрузке с небольшой задержкой
  setTimeout(() => {
    displayMessage();
  }, 500);
  
  console.log('Инициализация генератора любовных сообщений завершена');
}

// Экспортируем функцию
window.initLoveMessageGenerator = initLoveMessageGenerator; 