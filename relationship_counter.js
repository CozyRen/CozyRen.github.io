// =================== Счетчик отношений ===================
function initRelationshipCounter() {
  console.log('Инициализация счетчика отношений');
  
  // Получаем необходимые элементы
  const daysCounter = document.getElementById('days-counter');
  const hoursCounter = document.getElementById('hours-counter');
  const minutesCounter = document.getElementById('minutes-counter');
  const secondsCounter = document.getElementById('seconds-counter');
  const momentsCounter = document.getElementById('moments-counter');
  
  // Проверяем наличие элементов
  if (!daysCounter || !hoursCounter || !minutesCounter || !secondsCounter) {
    console.error('Не найдены элементы счетчика отношений');
    return;
  }
  
  console.log('Элементы счетчика отношений найдены');
  
  // Устанавливаем начальную дату отношений (27 февраля 2025)
  const startDate = new Date(2025, 1, 27, 0, 0, 0); // 27.02.2025 00:00:00
  console.log('Дата начала отношений:', startDate);
  
  // Сохраняем дату в localStorage для работы счетчика при закрытии сайта
  if (!localStorage.getItem('relationshipStartDate')) {
    localStorage.setItem('relationshipStartDate', startDate.getTime().toString());
    console.log('Дата сохранена в localStorage');
  }
  
  // Получаем сохраненную дату из localStorage
  const savedStartDate = new Date(parseInt(localStorage.getItem('relationshipStartDate') || startDate.getTime()));
  console.log('Загруженная дата из localStorage:', savedStartDate);
  
  // Функция обновления счетчика
  function updateCounter() {
    try {
      // Получаем текущее время
      const now = new Date();
      
      // Для отрицательного отсчета (если дата в будущем)
      let diff;
      let prefix = '';
      
      if (now < savedStartDate) {
        // Отрицательный отсчет (до даты)
        diff = savedStartDate - now;
        prefix = '-';
      } else {
        // Положительный отсчет (после даты)
        diff = now - savedStartDate;
      }
      
      // Рассчитываем разницу
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      // Обновляем счетчики
      daysCounter.textContent = prefix + days;
      hoursCounter.textContent = hours;
      minutesCounter.textContent = minutes;
      secondsCounter.textContent = seconds;
      
      // Обновляем текст под счетчиком дней
      const months = Math.floor(days / 30);
      const remainingDays = days % 30;
      
      // Склонение слов "месяц" и "день"
      const monthLabel = getMonthLabel(months);
      const dayLabel = getDayLabel(remainingDays);
      
      // Находим подпись счетчика и обновляем
      const counterSublabel = document.querySelector('.counter-item .counter-sublabel');
      if (counterSublabel) {
        if (now < savedStartDate) {
          counterSublabel.textContent = `осталось ${months} ${monthLabel} и ${remainingDays} ${dayLabel} до начала отношений`;
        } else {
          counterSublabel.textContent = `уже ${months} ${monthLabel} и ${remainingDays} ${dayLabel} вместе`;
        }
      }
      
      // Обновляем счетчик моментов счастья (считаем секунды)
      if (momentsCounter) {
        const moments = Math.floor(diff / 1000);
        const formattedMoments = new Intl.NumberFormat('ru-RU').format(moments);
        momentsCounter.textContent = prefix + formattedMoments;
      }
      
      // Сохраняем текущее время последнего обновления
      localStorage.setItem('lastCounterUpdate', now.getTime().toString());
    } catch (error) {
      console.error('Ошибка при обновлении счетчика:', error);
    }
  }
  
  // Функция для склонения слова "месяц"
  function getMonthLabel(months) {
    if (months % 10 === 1 && months % 100 !== 11) {
      return 'месяц';
    } else if ([2, 3, 4].includes(months % 10) && ![12, 13, 14].includes(months % 100)) {
      return 'месяца';
    } else {
      return 'месяцев';
    }
  }
  
  // Функция для склонения слова "день"
  function getDayLabel(days) {
    if (days % 10 === 1 && days % 100 !== 11) {
      return 'день';
    } else if ([2, 3, 4].includes(days % 10) && ![12, 13, 14].includes(days % 100)) {
      return 'дня';
    } else {
      return 'дней';
    }
  }
  
  // Проверяем, был ли пользователь в оффлайне и обновляем счетчик
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
  
  // Синхронизация с API времени при доступности сети
  function syncWithTimeAPI() {
    // Проверяем есть ли подключение к сети
    if (navigator.onLine) {
      console.log('Синхронизация с сервером времени...');
      
      // Запрашиваем текущее время с API
      fetch('https://worldtimeapi.org/api/timezone/Europe/Moscow')
        .then(response => response.json())
        .then(data => {
          // Получаем текущее время с сервера
          const serverTime = new Date(data.datetime);
          console.log('Время сервера:', serverTime);
          
          // Корректируем локальные часы
          const localOffset = new Date().getTime() - serverTime.getTime();
          localStorage.setItem('timeOffset', localOffset.toString());
          console.log('Смещение локального времени:', localOffset, 'мс');
          
          // Обновляем счетчик с учетом корректного времени
          updateCounter();
        })
        .catch(error => {
          console.warn('Не удалось синхронизировать время с API:', error);
          // В случае ошибки используем локальное время
          updateCounter();
        });
    } else {
      // Если нет подключения, используем локальное время
      updateCounter();
    }
  }
  
  // Пытаемся синхронизировать время при загрузке страницы
  syncWithTimeAPI();
  
  // Обновляем счетчик сразу и затем каждую секунду
  updateCounter();
  const countInterval = setInterval(updateCounter, 1000);
  
  // Синхронизируем счетчик при переходе в онлайн
  window.addEventListener('online', syncWithTimeAPI);
  
  // Сохраняем текущее состояние перед закрытием страницы
  window.addEventListener('beforeunload', function() {
    localStorage.setItem('lastCounterUpdate', new Date().getTime().toString());
    console.log('Сохранено состояние счетчика перед закрытием страницы');
  });
  
  // Повторная синхронизация каждый час
  setInterval(syncWithTimeAPI, 60 * 60 * 1000);
  
  // Для возможности очистки интервала при необходимости
  return countInterval;
}

// Экспортируем функцию
window.initRelationshipCounter = initRelationshipCounter; 