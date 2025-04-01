// =================== Виртуальные подарки ===================
function initVirtualGifts() {
  console.log('Инициализация виртуальных подарков');
  const giftModal = document.getElementById('gift-modal');
  const giftImage = document.getElementById('gift-image');
  const giftTitle = document.getElementById('gift-title');
  const giftMessage = document.getElementById('gift-message');
  const closeGiftBtn = document.getElementById('close-gift');
  const sendGiftBtn = document.getElementById('send-gift-btn');
  const giftSection = document.getElementById('virtual-gifts');
  
  // Проверяем наличие элементов
  if (!giftSection) {
    console.error('Секция подарков не найдена');
    return;
  }
  
  console.log('Элементы подарков найдены');
  
  // Определяем виртуальные подарки
  const gifts = [
    {
      id: 'kiss',
      title: 'Поцелуй',
      image: 'img/gifts/kiss.jpg',
      message: 'Нежный виртуальный поцелуй для моей любимой. Жди настоящий при встрече! 💋',
      requiredScore: 10
    },
    {
      id: 'hug',
      title: 'Обнимашки',
      image: 'img/gifts/hug.jpg',
      message: 'Теплые и крепкие обнимашки для тебя, моя родная. Представь, что я обнимаю тебя прямо сейчас! 🤗',
      requiredScore: 25
    },
    {
      id: 'compliment',
      title: 'Комплимент',
      image: 'img/gifts/compliment.jpg',
      message: 'Ты моя сладенькая очаровашечка, я тебя обожаю, алмазик души моей, любимая звездочка самая яркая ✨',
      requiredScore: 15
    },
    {
      id: 'story',
      title: 'История',
      image: 'img/gifts/story.png',
      message: 'Получаешь купон на специальную историю, ехехе. Красотка ты моя любимая  📖',
      requiredScore: 35
    },
    {
      id: 'teddy',
      title: 'Мягкая игрушка',
      image: 'img/gifts/toy.jpg',
      message: 'Этот милый плюшевый мишка будет обнимать тебя, когда меня нет рядом. 🧸',
      requiredScore: 45
    },
    {
      id: 'food',
      title: 'Еда',
      image: 'img/gifts/food.png',
      message: 'Сладкое угощение для моей сладкой девочки. Обещаю приготовить твое любимое блюдо при встрече! 🍰',
      requiredScore: 30
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
      
      // Создаем карточку
      const giftCard = document.createElement('div');
      giftCard.classList.add('flip-card');
      
      if (!isUnlocked) {
        giftCard.classList.add('gift-locked');
      }
      
      // Создаем внутренний контейнер для анимации переворота
      const innerCard = document.createElement('div');
      innerCard.classList.add('flip-card-inner');
      
      // Создаем переднюю сторону карточки
      const frontCard = document.createElement('div');
      frontCard.classList.add('flip-card-front');
      
      // Добавляем изображение
      const imageContainer = document.createElement('div');
      imageContainer.classList.add('gift-image');
      
      if (isUnlocked) {
        const img = document.createElement('img');
        img.src = gift.image;
        img.alt = gift.title;
        imageContainer.appendChild(img);
      } else {
        const lockOverlay = document.createElement('div');
        lockOverlay.classList.add('gift-locked-overlay');
        
        const lockIcon = document.createElement('i');
        lockIcon.classList.add('fas', 'fa-lock');
        
        const lockText = document.createElement('p');
        lockText.textContent = `Требуется ${gift.requiredScore} очков`;
        
        lockOverlay.appendChild(lockIcon);
        lockOverlay.appendChild(lockText);
        
        const img = document.createElement('img');
        img.src = gift.image;
        img.alt = gift.title;
        img.style.filter = 'grayscale(100%) brightness(40%)';
        
        imageContainer.appendChild(lockOverlay);
        imageContainer.appendChild(img);
      }
      
      frontCard.appendChild(imageContainer);
      
      // Добавляем название и цену
      const titleElement = document.createElement('div');
      titleElement.classList.add('gift-title');
      titleElement.textContent = gift.title;
      frontCard.appendChild(titleElement);
      
      const priceElement = document.createElement('div');
      priceElement.classList.add('gift-price');
      priceElement.innerHTML = `<i class="fas fa-heart"></i> ${gift.requiredScore}`;
      frontCard.appendChild(priceElement);
      
      // Добавляем подсказку для разблокированных подарков
      if (isUnlocked) {
        const viewMoreElement = document.createElement('div');
        viewMoreElement.classList.add('gift-view-more');
        viewMoreElement.textContent = 'Нажми для подробностей';
        frontCard.appendChild(viewMoreElement);
      }
      
      // Создаем заднюю сторону карточки
      const backCard = document.createElement('div');
      backCard.classList.add('flip-card-back');
      
      // Добавляем детали подарка
      const detailsElement = document.createElement('div');
      detailsElement.classList.add('gift-details');
      
      const titleBack = document.createElement('h3');
      titleBack.textContent = gift.title;
      detailsElement.appendChild(titleBack);
      
      const messageElement = document.createElement('p');
      messageElement.textContent = gift.message;
      detailsElement.appendChild(messageElement);
      
      if (isUnlocked) {
        const sendButton = document.createElement('button');
        sendButton.classList.add('send-gift-btn');
        sendButton.textContent = 'Получить подарок';
        detailsElement.appendChild(sendButton);
        
        // Добавляем обработчик для кнопки
        sendButton.addEventListener('click', function(e) {
          e.stopPropagation(); // Предотвращаем всплытие события
          console.log('Получение подарка', gift.title);
          showGiftReceiveEffect(gift);
        });
      } else {
        const unlockInfo = document.createElement('p');
        unlockInfo.classList.add('unlock-info');
        unlockInfo.textContent = `Необходимо набрать ${gift.requiredScore} очков в игре "Поймай мое сердце"`;
        detailsElement.appendChild(unlockInfo);
      }
      
      backCard.appendChild(detailsElement);
      
      // Собираем карточку
      innerCard.appendChild(frontCard);
      innerCard.appendChild(backCard);
      giftCard.appendChild(innerCard);
      
      // Добавляем обработчики событий
      if (isUnlocked) {
        giftCard.setAttribute('data-gift', gift.id);
        
        // Обработчик для переворота карточки
        giftCard.addEventListener('click', function() {
          console.log('Переворачиваем карточку', gift.title);
          this.classList.toggle('flipped');
        });
      } else {
        // Обработчик для заблокированных подарков
        giftCard.addEventListener('click', function() {
          // Добавляем класс анимации тряски и удаляем его через 0.5 секунды
          this.classList.add('shake-animation');
          
          // Также находим иконку замка и добавляем ей анимацию вибрации
          const lockIcon = this.querySelector('.fa-lock');
          if (lockIcon) {
            lockIcon.classList.add('lock-vibrate');
            setTimeout(() => {
              lockIcon.classList.remove('lock-vibrate');
            }, 500);
          }
          
          setTimeout(() => {
            this.classList.remove('shake-animation');
          }, 500);
        });
      }
      
      // Добавляем карточку в контейнер
      giftsContainer.appendChild(giftCard);
    });
    
    // Добавляем стили для карточек
    addGiftCardStyles();
    
    // Настраиваем обработчики для кнопок отправки подарков
    setupGiftButtons();
  }
  
  // Функция для добавления стилей карточек
  function addGiftCardStyles() {
    const styleId = 'gift-card-styles';
    
    // Проверяем, не добавлены ли уже стили
    if (document.getElementById(styleId)) {
      return;
    }
    
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .gifts-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 20px;
        margin-top: 30px;
      }
      
      .flip-card {
        position: relative;
        height: 350px;
        background-color: transparent;
        perspective: 1500px;
        cursor: pointer;
        transition: transform 0.3s;
        border-radius: 15px;
        overflow: hidden;
        margin-bottom: 20px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }
      
      .flip-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(255, 107, 149, 0.3);
      }
      
      /* Анимация тряски для заблокированных подарков */
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-10px); }
        40% { transform: translateX(10px); }
        60% { transform: translateX(-7px); }
        80% { transform: translateX(7px); }
      }
      
      .shake-animation {
        animation: shake 0.5s ease-in-out;
      }
      
      /* Анимация вибрации для иконки замка */
      @keyframes lock-vibrate {
        0%, 100% { transform: rotate(0deg) scale(1); }
        20% { transform: rotate(-10deg) scale(1.2); }
        40% { transform: rotate(10deg) scale(1.2); }
        60% { transform: rotate(-7deg) scale(1.2); }
        80% { transform: rotate(7deg) scale(1.2); }
      }
      
      .lock-vibrate {
        animation: lock-vibrate 0.5s ease-in-out;
        color: #ff4778 !important;
      }
      
      .flip-card-inner {
        position: relative;
        width: 100%;
        height: 100%;
        text-align: center;
        transform-style: preserve-3d;
        transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }
      
      .flip-card.flipped .flip-card-inner {
        transform: rotateY(180deg);
      }
      
      .flip-card-front, .flip-card-back {
        position: absolute;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
        border-radius: 15px;
        overflow: hidden;
      }
      
      .flip-card-front {
        background: linear-gradient(145deg, #ffffff, #f8f9fa);
        color: #333;
        z-index: 2;
        display: flex;
        flex-direction: column;
      }
      
      .flip-card-back {
        background: linear-gradient(145deg, #ff6b95, #ff4778);
        color: white;
        transform: rotateY(180deg);
        z-index: 1;
        padding: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      
      .gift-image {
        height: 200px;
        width: 100%;
        overflow: hidden;
        position: relative;
        border-bottom: 1px solid rgba(0,0,0,0.05);
      }
      
      .gift-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease-in-out;
      }
      
      .flip-card:hover .gift-image img {
        transform: scale(1.05);
      }
      
      .gift-title {
        padding: 15px 0 5px;
        font-size: 1.2rem;
        font-weight: bold;
        color: #333;
      }
      
      .gift-price {
        display: inline-block;
        background-color: #ff6b95;
        color: white;
        padding: 5px 15px;
        border-radius: 20px;
        margin: 10px auto;
        font-weight: bold;
        box-shadow: 0 2px 5px rgba(255, 107, 149, 0.3);
      }
      
      .gift-price i {
        margin-right: 5px;
      }
      
      .gift-view-more {
        margin-top: auto;
        padding: 10px;
        color: #666;
        font-size: 0.9rem;
        font-style: italic;
        background-color: rgba(255, 107, 149, 0.1);
        margin: 10px;
        border-radius: 10px;
      }
      
      .gift-details {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      
      .gift-details h3 {
        margin-bottom: 15px;
        font-size: 1.5rem;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        color: white;
      }
      
      .gift-details p {
        margin-bottom: 20px;
        line-height: 1.5;
        text-align: center;
        font-size: 1.1rem;
        color: white;
      }
      
      .send-gift-btn {
        display: inline-block !important;
        padding: 10px 20px !important;
        border-radius: 25px !important;
        border: none !important;
        background: white !important;
        color: #ff4778 !important;
        font-weight: bold !important;
        font-size: 1rem !important;
        cursor: pointer !important;
        transition: all 0.3s !important;
        margin-top: 15px !important;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15) !important;
        position: relative !important;
        z-index: 10 !important;
      }
      
      .send-gift-btn:hover {
        background: #fff0f3 !important;
        transform: scale(1.05) !important;
        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2) !important;
      }
      
      .unlock-info {
        background: rgba(255, 255, 255, 0.2);
        padding: 10px;
        border-radius: 10px;
        font-size: 0.9rem;
        text-align: center;
        max-width: 90%;
      }
      
      .gift-locked .flip-card-front {
        background: linear-gradient(145deg, #f0f0f0, #e0e0e0);
      }
      
      .gift-locked-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 2;
      }
      
      .gift-locked-overlay i {
        font-size: 2.5rem;
        color: white;
        margin-bottom: 10px;
        text-shadow: 0 2px 5px rgba(0,0,0,0.5);
        animation: lockShake 2s ease-in-out infinite;
      }
      
      @keyframes lockShake {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(-5deg); }
        75% { transform: rotate(5deg); }
      }
      
      .gift-locked-overlay p {
        color: white;
        max-width: 80%;
        text-align: center;
        font-size: 0.9rem;
        background-color: rgba(0,0,0,0.5);
        padding: 5px 10px;
        border-radius: 10px;
        text-shadow: 0 1px 3px rgba(0,0,0,0.5);
      }
      
      /* Safari-specific fix */
      @media screen and (-webkit-min-device-pixel-ratio: 0) {
        .flip-card-back {
          transform: rotateY(180deg) translateZ(1px);
        }
      }
      
      /* Fix for Firefox */
      @-moz-document url-prefix() {
        .flip-card-inner {
          transform: rotateY(0deg);
        }
        .flip-card.flipped .flip-card-inner {
          transform: rotateY(180deg);
        }
        .flip-card-back {
          transform: rotateY(180deg);
        }
      }
      
      /* Стили для сообщения о доступных подарках */
      .available-gifts-message {
        background: linear-gradient(145deg, #fff6f9, #ffebf1);
        border-radius: 15px;
        padding: 20px;
        margin-top: 20px;
        text-align: center;
        box-shadow: 0 5px 15px rgba(255, 107, 149, 0.2);
        animation: fadeIn 0.5s ease-out;
      }
      
      .available-gifts-message p {
        color: #333;
        margin-bottom: 15px;
        font-size: 1.1rem;
      }
      
      .available-gifts-message strong {
        color: #ff4778;
      }
      
      .available-gifts-message button {
        margin-top: 10px;
      }
      
      /* Стили для подсветки секции */
      .highlight-section {
        animation: sectionHighlight 2s ease;
      }
      
      @keyframes sectionHighlight {
        0% { background-color: transparent; }
        30% { background-color: rgba(255, 107, 149, 0.2); }
        100% { background-color: transparent; }
      }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @media (max-width: 768px) {
        .gifts-container {
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        }
        
        .flip-card {
          height: 300px;
        }
        
        .gift-image {
          height: 150px;
        }
        
        .available-gifts-message {
          padding: 15px;
        }
        
        .available-gifts-message p {
          font-size: 1rem;
        }
      }
    `;
    
    document.head.appendChild(style);
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
      sendGiftBtn.textContent = 'Получение...';
      sendGiftBtn.disabled = true;
      
      setTimeout(() => {
        // Закрываем модальное окно
        giftModal.classList.remove('active');
        
        // Находим выбранный подарок
        const currentGiftTitle = giftTitle ? giftTitle.textContent : '';
        const selectedGift = gifts.find(g => g.title === currentGiftTitle);
        
        // Показываем эффект получения подарка
        if (selectedGift) {
          showGiftReceiveEffect(selectedGift);
        } else {
          // Если подарок не найден, используем текущие данные
          const fallbackGift = {
            title: giftTitle ? giftTitle.textContent : 'Подарок',
            image: giftImage ? giftImage.src : '',
            message: giftMessage ? giftMessage.textContent : 'Особый подарок для тебя!'
          };
          showGiftReceiveEffect(fallbackGift);
        }
        
        // Сбрасываем состояние кнопки
        setTimeout(() => {
          sendGiftBtn.textContent = 'Получить подарок';
          sendGiftBtn.disabled = false;
        }, 1000);
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
  
  // Функция для обработки событий нажатия кнопки "Получить подарок"
  function setupGiftButtons() {
    // Находим все кнопки "Получить подарок"
    const receiveButtons = document.querySelectorAll('.send-gift-btn');
    
    receiveButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.stopPropagation(); // Предотвращаем переворот карточки
        
        // Находим ID подарка из ближайшей карточки
        const giftCard = this.closest('.flip-card');
        const giftId = giftCard ? giftCard.getAttribute('data-gift') : null;
        
        if (giftId) {
          // Находим соответствующий подарок
          const gift = gifts.find(g => g.id === giftId);
          if (gift) {
            showGiftReceiveEffect(gift);
          }
        }
      });
    });
  }

  console.log('Инициализируем подарки с улучшенным эффектом переворота');
  
  // Периодически проверяем кнопки отправки подарков
  setTimeout(() => {
    const receiveButtons = document.querySelectorAll('.send-gift-btn');
    console.log('Найдено кнопок отправки подарков:', receiveButtons.length);
    
    if (receiveButtons.length > 0) {
      console.log('Переназначаем обработчики для кнопок отправки');
      setupGiftButtons();
    }
  }, 1000);

  // Функция для отображения эффекта получения подарка
  function showGiftReceiveEffect(gift) {
    console.log('Показываем эффект получения подарка:', gift.title);
    
    // Создаем контейнер для эффекта
    const effectContainer = document.createElement('div');
    effectContainer.classList.add('gift-receive-effect');
    
    // Добавляем сообщение
    const messageElement = document.createElement('div');
    messageElement.classList.add('gift-receive-message');
    messageElement.innerHTML = `
      <h3>Подарок получен!</h3>
      <p>"${gift.title}" теперь у тебя!</p>
      <img src="${gift.image}" alt="${gift.title}">
    `;
    effectContainer.appendChild(messageElement);
    
    // Создаем фейерверк/конфетти
    createFireworks(effectContainer, 100); // 100 частиц
    
    // Добавляем контейнер в body
    document.body.appendChild(effectContainer);
    
    // Добавляем кнопку закрытия в верхнем правом углу
    const closeButton = document.createElement('button');
    closeButton.classList.add('gift-effect-close');
    closeButton.innerHTML = '<i class="fas fa-times"></i>';
    closeButton.addEventListener('click', function() {
      closeGiftEffect(effectContainer);
    });
    effectContainer.appendChild(closeButton);
    
    // Добавляем кнопку "Спасибо за подарок!" внизу модального окна
    const thankButton = document.createElement('button');
    thankButton.classList.add('gift-thank-button');
    thankButton.textContent = 'Спасибо за подарок!';
    thankButton.addEventListener('click', function() {
      closeGiftEffect(effectContainer);
    });
    messageElement.appendChild(thankButton);
    
    // Добавляем таймер автозакрытия
    const timeProgressContainer = document.createElement('div');
    timeProgressContainer.classList.add('auto-close-timer-container');
    
    const timeProgressBar = document.createElement('div');
    timeProgressBar.classList.add('auto-close-timer');
    timeProgressContainer.appendChild(timeProgressBar);
    
    const timeText = document.createElement('div');
    timeText.classList.add('auto-close-text');
    timeText.textContent = 'Автоматическое закрытие через 6 секунд';
    timeProgressContainer.appendChild(timeText);
    
    messageElement.appendChild(timeProgressContainer);
    
    // Анимация таймера
    const autoCloseTime = 6000; // 6 секунд
    let timeLeft = autoCloseTime / 1000;
    timeProgressBar.style.transition = `width ${autoCloseTime}ms linear`;
    
    // Запускаем анимацию таймера через маленькую задержку, чтобы CSS успел отрисоваться
    setTimeout(() => {
      timeProgressBar.style.width = '0%';
    }, 50);
    
    // Обновляем текст каждую секунду
    const timerInterval = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
      } else {
        timeText.textContent = `Автоматическое закрытие через ${timeLeft} секунд`;
      }
    }, 1000);
    
    // Закрытие по клику вне модального окна
    effectContainer.addEventListener('click', function(e) {
      // Проверяем, что клик был непосредственно на контейнере, а не на его содержимом
      if (e.target === effectContainer) {
        closeGiftEffect(effectContainer);
      }
    });
    
    // Закрытие по клавише Escape
    const escHandler = function(e) {
      if (e.key === 'Escape') {
        closeGiftEffect(effectContainer);
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
    
    // Функция для закрытия модального окна с эффектом
    function closeGiftEffect(container) {
      // Очищаем интервал обновления таймера
      clearInterval(timerInterval);
      
      // Добавляем класс для анимации закрытия
      container.classList.add('closing');
      
      // Удаляем контейнер после завершения анимации
      setTimeout(() => {
        if (document.body.contains(container)) {
          document.body.removeChild(container);
          document.removeEventListener('keydown', escHandler);
        }
      }, 800);
    }
    
    // Автоматически закрываем через 6 секунд
    setTimeout(() => {
      if (document.body.contains(effectContainer)) {
        closeGiftEffect(effectContainer);
      }
    }, autoCloseTime);
  }
  
  // Функция для создания фейерверка/конфетти
  function createFireworks(container, particleCount) {
    // Цвета для конфетти
    const colors = [
      '#FF5252', '#FF4081', '#E040FB', '#7C4DFF', 
      '#536DFE', '#448AFF', '#40C4FF', '#18FFFF', 
      '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41', 
      '#FFFF00', '#FFD740', '#FFAB40', '#FF6E40'
    ];
    
    // Создаем частицы
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.classList.add('confetti-particle');
      
      // Случайное положение
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      
      // Случайный размер
      const size = Math.random() * 10 + 5;
      
      // Случайный цвет
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Случайная форма (круг, квадрат, сердечко, звезда)
      const shapes = ['circle', 'square', 'heart', 'star'];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      
      // Задаем стили
      particle.style.left = `${x}%`;
      particle.style.top = `${y}%`;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.backgroundColor = color;
      particle.classList.add(`shape-${shape}`);
      
      // Случайная длительность анимации
      const duration = Math.random() * 2 + 3;
      particle.style.animationDuration = `${duration}s`;
      
      // Случайное направление и расстояние
      const xMove = (Math.random() * 60 - 30);
      const yMove = (Math.random() * 60 - 10);
      
      particle.style.setProperty('--x-move', `${xMove}vh`);
      particle.style.setProperty('--y-move', `${yMove}vh`);
      
      // Добавляем частицу в контейнер
      container.appendChild(particle);
      
      // Удаляем частицу после завершения анимации
      setTimeout(() => {
        if (container.contains(particle)) {
          container.removeChild(particle);
        }
      }, duration * 1000);
    }
    
    // Создаем еще фейерверки через случайные интервалы
    setTimeout(() => {
      if (document.body.contains(container)) {
        createFireworks(container, particleCount / 2);
      }
    }, Math.random() * 1000 + 1000);
  }
  
  // Добавляем стили для эффекта получения подарка
  function addGiftEffectStyles() {
    const styleId = 'gift-effect-styles';
    
    // Проверяем, не добавлены ли уже стили
    if (document.getElementById(styleId)) {
      return;
    }
    
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .gift-receive-effect {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.85);
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;
        animation: fadeIn 0.5s ease-out;
        overflow: hidden;
      }
      
      .gift-receive-effect.closing {
        animation: fadeOut 0.8s ease-in forwards;
      }
      
      .gift-receive-message {
        background: rgba(255, 255, 255, 0.9);
        padding: 30px;
        border-radius: 20px;
        text-align: center;
        max-width: 400px;
        box-shadow: 0 0 30px rgba(255, 107, 149, 0.7);
        animation: scaleIn 0.5s ease-out;
        z-index: 10000;
        position: relative;
      }
      
      .gift-receive-message h3 {
        font-size: 2rem;
        color: #ff4778;
        margin-bottom: 15px;
      }
      
      .gift-receive-message p {
        font-size: 1.2rem;
        margin-bottom: 20px;
      }
      
      .gift-receive-message img {
        max-width: 200px;
        max-height: 200px;
        object-fit: contain;
        border-radius: 10px;
        margin: 0 auto;
        display: block;
        border: 2px solid #ff4778;
        margin-bottom: 25px;
      }
      
      .gift-effect-close {
        position: absolute;
        top: 20px;
        right: 20px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: white;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 1.2rem;
        color: #ff4778;
        box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
        z-index: 10001;
        transition: transform 0.3s, background 0.3s;
      }
      
      .gift-effect-close:hover {
        transform: scale(1.1);
        background: #fff0f3;
      }
      
      .gift-thank-button {
        display: inline-block;
        padding: 12px 24px;
        border-radius: 30px;
        background: linear-gradient(to right, #ff4778, #ff6b95);
        color: white;
        font-weight: bold;
        font-size: 1rem;
        border: none;
        cursor: pointer;
        transition: transform 0.3s, box-shadow 0.3s;
        box-shadow: 0 5px 15px rgba(255, 107, 149, 0.3);
        margin-top: 10px;
        margin-bottom: 15px;
      }
      
      .gift-thank-button:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 20px rgba(255, 107, 149, 0.5);
      }
      
      .gift-thank-button:active {
        transform: translateY(-1px);
      }
      
      .auto-close-timer-container {
        width: 100%;
        margin-top: 15px;
        text-align: center;
      }
      
      .auto-close-timer {
        width: 100%;
        height: 4px;
        background: linear-gradient(to right, #ff4778, #ff6b95);
        border-radius: 2px;
        margin-bottom: 8px;
      }
      
      .auto-close-text {
        font-size: 0.85rem;
        color: #777;
        margin-bottom: 5px;
      }
      
      .confetti-particle {
        position: absolute;
        border-radius: 50%;
        opacity: 0.8;
        animation: fallAndFade var(--duration, 4s) ease-out;
        z-index: 9998;
      }
      
      .shape-circle {
        border-radius: 50%;
      }
      
      .shape-square {
        border-radius: 0;
      }
      
      .shape-heart:before {
        content: '❤️';
        position: absolute;
        font-size: calc(var(--size, 10px) * 1.5);
      }
      
      .shape-star:before {
        content: '⭐';
        position: absolute;
        font-size: calc(var(--size, 10px) * 1.5);
      }
      
      @keyframes fallAndFade {
        0% {
          transform: translate(0, 0) rotate(0deg);
          opacity: 0;
        }
        10% {
          opacity: 1;
        }
        90% {
          opacity: 1;
        }
        100% {
          transform: translate(var(--x-move, 20vh), var(--y-move, 50vh)) rotate(720deg);
          opacity: 0;
        }
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
      
      @keyframes scaleIn {
        from { transform: scale(0.8); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
      
      /* Добавляем медиа-запрос для мобильных устройств */
      @media (max-width: 768px) {
        .gift-receive-message {
          max-width: 90%;
          padding: 25px 20px;
        }
        
        .gift-receive-message h3 {
          font-size: 1.7rem;
        }
        
        .gift-receive-message p {
          font-size: 1.1rem;
        }
        
        .gift-thank-button {
          width: 100%;
          padding: 14px 20px;
          font-size: 1.2rem;
        }
        
        .auto-close-text {
          font-size: 0.8rem;
        }
      }
    `;
    
    document.head.appendChild(style);
  }

  // Вызываем функцию добавления стилей для эффекта получения подарка
  addGiftEffectStyles();
}

// Экспортируем функцию
window.initVirtualGifts = initVirtualGifts; 