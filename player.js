// Music Player - Dedicated JavaScript File
try {
  document.addEventListener('DOMContentLoaded', function() {
    console.log('Инициализация музыкального плеера');
    
    // Основные элементы плеера
    const playPauseBtn = document.getElementById('play-pause');
    const prevBtn = document.getElementById('prev-track');
    const nextBtn = document.getElementById('next-track');
    const trackTitle = document.getElementById('track-title');
    const trackArtist = document.getElementById('track-artist');
    const progressBar = document.getElementById('progress');
    const progressHandle = document.getElementById('progress-handle');
    const currentTimeDisplay = document.getElementById('current-time');
    const durationDisplay = document.getElementById('duration');
    const volumeBar = document.getElementById('volume');
    const volumeHandle = document.getElementById('volume-handle');
    const trackList = document.getElementById('track-list');
    const loveButton = document.querySelector('.love-button');
    
    // Проверяем наличие основных элементов
    if (!playPauseBtn || !trackList) {
      console.warn('Элементы плеера не найдены, плеер не будет инициализирован');
      return;
    }
    
    // Инициализируем плеер, но не запускаем музыку автоматически
    initMusicPlayer();
  });
} catch (error) {
  console.error('Ошибка в работе музыкального плеера:', error);
}

// =================== Музыкальный плеер ===================
function initMusicPlayer() {
  // DOM элементы плеера
  const trackTitle = document.getElementById('track-title');
  const trackArtist = document.getElementById('track-artist');
  const trackList = document.getElementById('track-list');
  const playPauseBtn = document.getElementById('play-pause');
  const prevBtn = document.getElementById('prev-track');
  const nextBtn = document.getElementById('next-track');
  const currentTimeEl = document.getElementById('current-time');
  const durationEl = document.getElementById('duration');
  const progressBar = document.getElementById('progress');
  const progressHandle = document.getElementById('progress-handle');
  const progressContainer = document.querySelector('.progress-bar');
  const volumeBar = document.getElementById('volume');
  const volumeHandle = document.getElementById('volume-handle');
  const volumeContainer = document.querySelector('.volume-bar');
  const loveButton = document.querySelector('.love-button');
  
  // Добавляем стили для анимации
  const heartStyles = document.createElement('style');
  heartStyles.textContent = `
    .beat-animation {
      animation: beatPulse 0.5s ease;
    }
    
    @keyframes beatPulse {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.1);
      }
      100% {
        transform: scale(1);
      }
    }
    
    .love-button.active i {
      animation: heartbeat 1.2s infinite;
    }
    
    @keyframes heartbeat {
      0% {
        transform: scale(1);
      }
      14% {
        transform: scale(1.3);
      }
      28% {
        transform: scale(1);
      }
      42% {
        transform: scale(1.3);
      }
      70% {
        transform: scale(1);
      }
    }

    .player-animate {
      animation: playerPulse 2s infinite;
    }

    @keyframes playerPulse {
      0% {
        box-shadow: 0 0 0 0 rgba(255, 64, 129, 0.2);
      }
      70% {
        box-shadow: 0 0 0 10px rgba(255, 64, 129, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(255, 64, 129, 0);
      }
    }
  `;
  document.head.appendChild(heartStyles);
  
  // Состояние плеера
  let tracks = [];
  let currentTrackIndex = 0;
  let audioPlayer = new Audio();
  let isPlaying = false;
  let isFavorite = false;
  let isFirstLoad = true;
  let isAutoSwitching = false;
  
  // Установка начальной громкости
  audioPlayer.volume = 0.7;
  
  // Полный плейлист со всеми доступными песнями
  tracks = [
    { title: "Выпускной (Медлячок)", artist: "Баста", duration: "4:17", url: "music/Баста - Выпускной (Медлячок).mp3" },
    { title: "Группа крови", artist: "Виктор Цой", duration: "4:45", url: "music/Виктор Цой - Группа крови.mp3" },
    { title: "Life", artist: "Zivert", duration: "3:10", url: "music/Zivert - Life.mp3" },
    { title: "Детство", artist: "Rauf And Faik", duration: "3:28", url: "music/Rauf And Faik - Детство.mp3" },
    { title: "Мания", artist: "XOLIDAYBOY", duration: "3:11", url: "music/Xolidayboy - Мания.mp3" },
    { title: "Когда Ты Улыбаешься", artist: "Киссколд", duration: "2:58", url: "music/Киссколд - Когда Ты Улыбаешься.mp3" },
    { title: "Двое Бывших", artist: "RASA", duration: "3:30", url: "music/RASA - Двое Бывших.mp3" },
    { title: "Зелёные Волны", artist: "Zivert", duration: "3:52", url: "music/Zivert - Зелёные Волны.mp3" },
    { title: "Вернись", artist: "Виктория Лоскутова", duration: "2:58", url: "music/viktorija-loskutova-vernis.mp3" },
    { title: "Дыши", artist: "Виктория Дайнеко", duration: "3:30", url: "music/Виктория Дайнеко - Дыши.mp3" },
    { title: "Гюрза", artist: "Liranov", duration: "3:47", url: "music/Liranov - Гюрза.mp3" },
    { title: "Shine bright like a diamond", artist: "Rihanna", duration: "2:45", url: "music/Rihana - Shine bright like a diamond.mp3" },
    { title: "Взять Взять", artist: "Cali", duration: "3:25", url: "music/Cali - Взять Взять.mp3" },
    { title: "Chica Bomb", artist: "Dan Balan", duration: "3:45", url: "music/Dan Balan – Chica Bomb.mp3" },
    { title: "Пожары", artist: "XOLIDAYBOY", duration: "3:42", url: "music/XOLIDAYBOY - Пожары.mp3" },
    { title: "VUK VUK", artist: "Kordhell, Dragon Boys", duration: "2:45", url: "music/Kordhell, Dragon Boys – VUK VUK.mp3" },
    { title: "Бывшая", artist: "Bahh Tee feat. Turken", duration: "3:42", url: "music/Bahh Tee feat. Turken - Бывшая (1)_094824.mp3" },
    { title: "Дисконнект", artist: "Bahh Tee feat. Люся Чеботина", duration: "3:52", url: "music/Bahh_Tee_feat_Люся_Чеботина_Дисконнект_094622.mp3" },
    { title: "Грустный дэнс", artist: "АРТИК и АСТИ и КАЧЕР", duration: "3:24", url: "music/АРТИК_и_АСТИ_и_КАЧЕР_Грустный_дэнс_094915.mp3" },
    { title: "IVL", artist: "Macan feat. Scirena", duration: "3:40", url: "music/macan-feat.-scirena-ivl.mp3" },
    { title: "Без души", artist: "Mona", duration: "1:45", url: "music/mona-pyanyy-gottem-bez-dushi-hotya-by-napishi.mp3" },
    { title: "Аэроэкспресс", artist: "Люся Чеботина", duration: "3:01", url: "music/Люся Чеботина - Аэроэкспресс.mp3" },
    { title: "Лучшая подруга", artist: "Люся Чеботина", duration: "3:14", url: "music/Люся Чеботина - Лучшая подруга.mp3" },
    { title: "Дождь", artist: "Ваня Дмитриенко", duration: "3:21", url: "music/vanja-dmitrienko-dozhd.mp3" },
    { title: "Не Смогу", artist: "Verbee & Kara Kross", duration: "2:58", url: "music/Verbee & Kara Kross - Не Смогу.mp3" },
    { title: "Сломана", artist: "Серебро", duration: "3:03", url: "music/serebro-slomana.mp3" },
    { title: "Ламбада", artist: "T-Fest & Скриптонит", duration: "3:36", url: "music/T-Fest & Скриптонит - Ламбада.mp3" },
    { title: "Яблоки Ела", artist: "Пропаганда", duration: "3:20", url: "music/Пропаганда - Яблоки Ела (Leo Burn Remix).mp3" },
    { title: "Для тебя кайф", artist: "Mekhman", duration: "3:10", url: "music/Mekhman_Ooo_dlya_tebya_kajf_eto_adrenalin.mp3" },
    { title: "Мурки-Воровайки", artist: "Воровайки", duration: "3:40", url: "music/Воровайки - Мурки-Воровайки.mp3" },
    { title: "Пей,гуляй,веселись", artist: "Воровайки", duration: "3:22", url: "music/Воровайки - Пей,гуляй,веселись.mp3" },
    { title: "Эх, раз, еще раз", artist: "Воровайки", duration: "2:58", url: "music/Воровайки - Эх, раз, еще раз.mp3" },
    { title: "Девочка С Каре", artist: "Мукка", duration: "3:02", url: "music/Мукка - Девочка С Каре.mp3" },
    { title: "Малыш в красивом платье", artist: "nkeeei", duration: "3:15", url: "music/nkeeei_Malysh_v_krasivom_plate_so_mnoj_na_afterpati.mp3" },
    { title: "Все твои секреты", artist: "LSP & PHARAOH", duration: "3:45", url: "music/LSP_PHARAOH_Vse_tvoi_sekrety_vidno_v_obektive_speed_up.mp3" },
    { title: "Зачем", artist: "Лоя feat. 5sta Family", duration: "3:42", url: "music/Лоя feat. 5sta Family - Зачем.mp3" },
    { title: "Eva", artist: "Винтаж", duration: "4:12", url: "music/Винтаж - Eva.mp3" },
    { title: "Посмотри", artist: "Тимати и Кристина Си", duration: "2:15", url: "music/timati-kristina-si-posmotri.mp3" },
    { title: "Береги мою любовь", artist: "Хчо Бере", duration: "3:58", url: "music/Хчо_Бере_береги_мою_любовь_Впере_впереди_моя_душа.mp3" },
    // Дополнительные треки из директории
    { title: "Faster n Harder", artist: "6arelyhuman", duration: "2:32", url: "music/6arelyhuman - Faster n Harder.mp3" },
    { title: "Чисто Папа", artist: "84 feat. Lookbuffalo", duration: "3:55", url: "music/84 feat. Lookbuffalo - Чисто Папа.mp3" },
    { title: "Дикая Львица", artist: "ALEXAndRUS", duration: "3:05", url: "music/ALEXAndRUS - Дикая Львица.mp3" },
    { title: "Мальчик Плачет", artist: "Appolo", duration: "3:25", url: "music/Appolo - Мальчик Плачет.mp3" },
    { title: "Качели", artist: "Artik & Asti", duration: "3:55", url: "music/Artik & Asti - Качели.mp3" },
    { title: "Миллион чувств", artist: "badCurt", duration: "2:58", url: "music/badCurt - Миллион чувств.mp3" },
    { title: "Ты заставлял меня", artist: "Daryana", duration: "2:38", url: "music/Daryana_Ty_zastavlyal_menya_sosat_polnaya.mp3" },
    { title: "Истерика", artist: "ELMAN feat. MONA", duration: "3:22", url: "music/ELMAN feat. MONA - Истерика.mp3" },
    { title: "Find You", artist: "Essáy, ida Dillan", duration: "3:48", url: "music/Essáy, ida Dillan - Find You (tiktok remix).mp3" },
    { title: "Bring Me To Life", artist: "Evanescence", duration: "4:05", url: "music/Evanescence - Bring Me To Life.mp3" },
    { title: "Him and I", artist: "G-Eazy & Halsey", duration: "4:28", url: "music/G-Eazy - Halsey - Him and I.mp3" },
    { title: "Забей и Просто Танцуй", artist: "Gavrilina", duration: "2:40", url: "music/Gavrilina - Забей и Просто Танцуй.mp3" },
    { title: "Я Хочу", artist: "Grivina", duration: "3:27", url: "music/Grivina - Я Хочу.mp3" },
    { title: "Тату на твоем теле", artist: "Jah Khalib", duration: "2:28", url: "music/Jah Khalib - Тату на твоем теле.mp3" },
    { title: "Поколение", artist: "Kara Kross", duration: "3:05", url: "music/Kara Kross - Поколение.mp3" },
    { title: "Kiss me, take me", artist: "Katy Perry", duration: "1:45", url: "music/Katy Perry - Kiss me, take me.mp3" },
    { title: "LUV", artist: "Rauf And Faik", duration: "3:45", url: "music/Rauf And Faik - LUV.mp3" },
    { title: "Днями-Ночами", artist: "Pyrokinesis & Мукка", duration: "3:38", url: "music/Pyrokinesis & Мукка - Днями-Ночами.mp3" },
    { title: "Выходи", artist: "NLO feat. Анет Сай", duration: "2:35", url: "music/NLO feat. Анет Сай - Выходи.mp3" },
    { title: "Жасмин", artist: "Opium", duration: "2:48", url: "music/Opium. - Жасмин (Полная Версия).mp3" },
    // Новые треки
    { title: "Феникс", artist: "ANNA ASTI", duration: "4:02", url: "music/ANNA ASTI - Феникс.mp3" },
    { title: "Царица", artist: "ANNA ASTI", duration: "3:48", url: "music/ANNA ASTI - Царица_095000.mp3" },
    { title: "Номер 1", artist: "Artik & Asti", duration: "3:20", url: "music/Artik & Asti – Номер 1.mp3" },
    { title: "Panda E", artist: "Cygo", duration: "4:20", url: "music/Cygo - Panda E.mp3" },
    { title: "Снова День Снова Ночь", artist: "Dinar Rahmatullin", duration: "3:05", url: "music/Dinar Rahmatullin - Снова День Снова Ночь.mp3" },
    { title: "Bad Habits", artist: "Ed Sheeran", duration: "4:01", url: "music/ed_sheeran_-_bad_habits_(muztune.me).mp3" },
    { title: "Mr. and Mrs. Smith", artist: "Egor Krid feat. Nyusha", duration: "1:20", url: "music/Egor_Krid_feat._Nyusha_-_Mr._and_Mrs._Smith.mp3" },
    { title: "Там где играется солнце", artist: "Elman & Mona", duration: "3:18", url: "music/Elman_Mona_Tam_gde_igraetsya_solnce_yasnoe.mp3" },
    { title: "Эти роли не для нас", artist: "Elvira T", duration: "3:50", url: "music/Elvira_T_Эти_роли_не_для_нас_не_играем_мы_сейчас.mp3" },
    { title: "Ну давай вставай принцесса", artist: "fallen777angel", duration: "2:08", url: "music/fallen777angel-nu-davay-vstavay-printsessa.mp3" },
    { title: "Сердце упало вниз", artist: "Gavrilina", duration: "2:15", url: "music/Gavrilina - сердце упало вниз.mp3" },
    { title: "Там Там", artist: "Jakone feat. SCIRENA", duration: "3:02", url: "music/Jakone feat. SCIRENA - Там Там.mp3" },
    { title: "Принцесса", artist: "Kamazz", duration: "3:42", url: "music/Kamazz - Принцесса.mp3" },
    { title: "Прошла мода на любовь", artist: "Kerwprod", duration: "3:55", url: "music/Kerwprod_прошла_мода_на_любовь_до_гроба.mp3" },
    { title: "Самая первая", artist: "LOVV66", duration: "4:02", url: "music/LOVV66 - Самая первая.mp3" },
    { title: "Я буду ебать", artist: "Moreart", duration: "2:45", url: "music/Moreart - Я буду ебать.mp3" },
    { title: "Какая из версий тебя", artist: "muzder_netwhyspurky", duration: "3:15", url: "music/muzder_netwhyspurky-kakaya-iz-versij-tebya.mp3" },
    { title: "Целуешь, Прощаешь", artist: "Nebezao feat. Андрей Леницкий", duration: "3:05", url: "music/Nebezao_feat_Андрей_Леницкий_Целуешь,_Прощаешь.mp3" },
    { title: "Ты Смотрел Налево", artist: "Nvkrn134", duration: "2:25", url: "music/Nvkrn134_Ты_Смотрел_Налево_Примечая_Себе_Цель.mp3" },
    { title: "Никто", artist: "NЮ", duration: "2:58", url: "music/NЮ - Никто.mp3" },
    { title: "The Show Must Go On", artist: "Queen", duration: "4:23", url: "music/Queen - The Show Must Go On.mp3" },
    { title: "Я сошла с ума", artist: "Тату", duration: "2:18", url: "music/tatu-ja-soshla-s-uma.mp3" },
    { title: "Харизма", artist: "Wallem", duration: "1:12", url: "music/Wallem_-_Харизма_(www.muzofan.net).mp3" },
    { title: "Быть Таким (короткая версия)", artist: "WHITE GALLOWS", duration: "0:47", url: "music/WHITE GALLOWS - Быть Таким (5).mp3" },
    { title: "Быть Таким", artist: "WHITE GALLOWS", duration: "3:15", url: "music/WHITE GALLOWS - Быть Таким.mp3" },
    { title: "Просто Люби", artist: "Xmax", duration: "2:48", url: "music/Xmax - Просто Люби.mp3" },
    { title: "Сердце В Огне", artist: "XOLIDAYBOY feat. Иван Рейс", duration: "3:05", url: "music/XOLIDAYBOY_feat_Иван_Рейс_Сердце_В_Огне.mp3" },
    { title: "Я выиграл Дьявола в покер", artist: "Xolidayboy & Ivan Rzhevskij", duration: "2:38", url: "music/Xolidayboy_Ivan_Rzhevskij_Ya_vyigral_Dyavola_v_poker.mp3" },
    { title: "Beverly Hills", artist: "Zivert", duration: "3:50", url: "music/Zivert - Beverly Hills.mp3" },
    { title: "Сумасшедшая", artist: "Анжелика Варум", duration: "3:48", url: "music/Анжелика Варум - Сумасшедшая_095055.mp3" }
  ];
  
  // Обработчики кнопок
  playPauseBtn.addEventListener('click', function() {
    isAutoSwitching = false;
    togglePlayPause();
  });
  
  prevBtn.addEventListener('click', function() {
    isAutoSwitching = false;
    playPreviousTrack();
  });
  
  nextBtn.addEventListener('click', function() {
    isAutoSwitching = false;
    playNextTrack();
  });
  
  // Упрощенный обработчик для кнопки сердца
  loveButton.addEventListener('click', function() {
    toggleFavorite();
    // Только анимация кнопки без вылетающих сердечек
    loveButton.classList.add('beat-animation');
    setTimeout(() => {
      loveButton.classList.remove('beat-animation');
    }, 500);
  });
  
  // Обработчики аудио-событий
  audioPlayer.addEventListener('timeupdate', updateProgress);
  audioPlayer.addEventListener('loadedmetadata', setDuration);
  audioPlayer.addEventListener('ended', function() {
    playNextTrack();
  });
  
  // Основной обработчик ошибок
  audioPlayer.addEventListener('error', function(e) {
    console.error('Ошибка воспроизведения аудио:', e);
    console.error('Код ошибки:', audioPlayer.error ? audioPlayer.error.code : 'Unknown');
    console.error('Проблемный файл:', audioPlayer.src);
    
    // Показываем сообщение об ошибке
    showErrorMessage();
    
    // Отмечаем трек как проблемный
    const trackIndex = currentTrackIndex;
    if (trackIndex >= 0 && trackIndex < tracks.length) {
      tracks[trackIndex].hasError = true;
      
      // Обновляем отметку в плейлисте
      updatePlaylistItemStatus(trackIndex);
    }
  });
  
  // Обработчики для прогресс-бара
  progressContainer.addEventListener('click', seek);
  progressHandle.addEventListener('mousedown', startDragProgress);
  
  // Обработчики для регулятора громкости
  volumeContainer.addEventListener('click', changeVolume);
  volumeHandle.addEventListener('mousedown', startDragVolume);
  
  // Обновление статуса трека в плейлисте
  function updatePlaylistItemStatus(index) {
    const trackItems = trackList.querySelectorAll('li');
    
    if (trackItems[index]) {
      if (tracks[index].hasError) {
        trackItems[index].classList.add('track-error');
      } else {
        trackItems[index].classList.remove('track-error');
      }
    }
  }
  
  // Отображение плейлиста
  function displayPlaylist() {
    // Очистка списка
    trackList.innerHTML = '';
    
    // Создание элементов
    tracks.forEach((track, index) => {
      const trackItem = document.createElement('li');
      trackItem.innerHTML = `
        <strong>${track.title}</strong>
        <span>${track.artist}</span>
        <span class="track-duration">${track.duration}</span>
      `;
      
      // Добавление класса для треков с ошибками
      if (track.hasError) {
        trackItem.classList.add('track-error');
      }
      
      // Добавление обработчика
      trackItem.addEventListener('click', () => {
        isFirstLoad = false;
        isAutoSwitching = false;
        currentTrackIndex = index;
        loadTrack(index);
        playTrack();
      });
      
      trackList.appendChild(trackItem);
    });
    
    // Загрузка первого трека без автовоспроизведения
    if (tracks.length > 0) {
      loadTrack(0, false);
    }
  }
  
  // Переключение состояния избранного
  function toggleFavorite() {
    isFavorite = !isFavorite;
    
    if (isFavorite) {
      loveButton.classList.add('active');
      
      // Анимация плеера
      const playerWrapper = document.querySelector('.player-wrapper');
      if (playerWrapper) {
        playerWrapper.classList.add('player-animate');
      }
    } else {
      loveButton.classList.remove('active');
      
      // Останавливаем анимацию плеера
      const playerWrapper = document.querySelector('.player-wrapper');
      if (playerWrapper) {
        playerWrapper.classList.remove('player-animate');
      }
    }
  }
  
  // Загрузка трека
  function loadTrack(index, shouldPlay = true) {
    if (tracks.length === 0 || index < 0 || index >= tracks.length) return;
    
    const track = tracks[index];
    currentTrackIndex = index;
    
    // Сбрасываем UI
    trackTitle.textContent = track.title;
    trackArtist.textContent = track.artist;
    durationEl.textContent = track.duration;
    currentTimeEl.textContent = "0:00";
    
    // Сброс состояния избранного - НЕ сбрасываем при смене трека
    // isFavorite = false;
    // loveButton.classList.remove('active');
    
    // Обновление активного трека в списке
    const trackItems = trackList.querySelectorAll('li');
    trackItems.forEach((item, i) => {
      if (i === index) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
    
    // Прокрутка к активному треку
    if (trackItems[index]) {
      trackItems[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Проверяем, не помечен ли трек как проблемный
    if (track.hasError) {
      showErrorMessage();
      return;
    }
    
    // Загрузка аудио
    try {
      console.log('Попытка загрузки трека:', track.url);
      
      // Останавливаем текущее воспроизведение и сбрасываем src
      if (audioPlayer.src) {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
      }
      
      // Устанавливаем источник
      audioPlayer.src = track.url;
      
      // Принудительная загрузка
      audioPlayer.load();
      
      // Сброс прогресс-бара
      updateProgressUI(0);
      
      // Воспроизведение, если требуется и не первая загрузка
      if (shouldPlay && !isFirstLoad) {
        playTrack();
      }
    } catch (error) {
      console.error('Ошибка при загрузке трека:', error);
      showErrorMessage();
      track.hasError = true;
      updatePlaylistItemStatus(index);
    }
  }
  
  // Обновление прогресс-бара
  function updateProgress() {
    if (audioPlayer.duration) {
      const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
      updateProgressUI(progress);
      
      // Обновление времени
      currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
    }
  }
  
  // Обновление UI прогресс-бара
  function updateProgressUI(progressPercent) {
    progressBar.style.width = `${progressPercent}%`;
    progressHandle.style.left = `${progressPercent}%`;
  }
  
  // Установка длительности трека
  function setDuration() {
    if (audioPlayer.duration && !isNaN(audioPlayer.duration)) {
      durationEl.textContent = formatTime(audioPlayer.duration);
    }
  }
  
  // Форматирование времени в мм:сс
  function formatTime(time) {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }
  
  // Перемотка трека при клике на прогресс-бар
  function seek(e) {
    if (!audioPlayer.duration) return;
    
    const rect = progressContainer.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const seekTime = percent * audioPlayer.duration;
    
    if (!isNaN(seekTime)) {
      audioPlayer.currentTime = seekTime;
      updateProgressUI(percent * 100);
    }
  }
  
  // Начало перетаскивания ползунка прогресса
  function startDragProgress() {
    document.addEventListener('mousemove', dragProgress);
    document.addEventListener('mouseup', stopDragProgress);
  }
  
  // Перетаскивание ползунка прогресса
  function dragProgress(e) {
    if (!audioPlayer.duration) return;
    
    const rect = progressContainer.getBoundingClientRect();
    let percent = (e.clientX - rect.left) / rect.width;
    
    // Ограничение значения от 0 до 1
    percent = Math.max(0, Math.min(1, percent));
    
    // Обновление UI
    updateProgressUI(percent * 100);
    
    // Обновление времени
    if (audioPlayer.duration && !isNaN(audioPlayer.duration)) {
      audioPlayer.currentTime = percent * audioPlayer.duration;
    }
  }
  
  // Остановка перетаскивания ползунка прогресса
  function stopDragProgress() {
    document.removeEventListener('mousemove', dragProgress);
    document.removeEventListener('mouseup', stopDragProgress);
  }
  
  // Изменение громкости при клике на полосу громкости
  function changeVolume(e) {
    const rect = volumeContainer.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    setVolume(percent);
  }
  
  // Начало перетаскивания ползунка громкости
  function startDragVolume() {
    document.addEventListener('mousemove', dragVolume);
    document.addEventListener('mouseup', stopDragVolume);
  }
  
  // Перетаскивание ползунка громкости
  function dragVolume(e) {
    const rect = volumeContainer.getBoundingClientRect();
    let percent = (e.clientX - rect.left) / rect.width;
    
    // Ограничение значения от 0 до 1
    percent = Math.max(0, Math.min(1, percent));
    
    setVolume(percent);
  }
  
  // Остановка перетаскивания ползунка громкости
  function stopDragVolume() {
    document.removeEventListener('mousemove', dragVolume);
    document.removeEventListener('mouseup', stopDragVolume);
  }
  
  // Установка громкости
  function setVolume(percent) {
    audioPlayer.volume = percent;
    
    // Обновление UI громкости
    volumeBar.style.width = `${percent * 100}%`;
    volumeHandle.style.left = `${percent * 100}%`;
  }
  
  // Воспроизведение трека
  function playTrack() {
    isFirstLoad = false;
    
    // Проверяем, не отмечен ли текущий трек как проблемный
    if (tracks[currentTrackIndex].hasError) {
      showErrorMessage();
      return;
    }
    
    // Попытка воспроизведения
    try {
      const playPromise = audioPlayer.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            isPlaying = true;
            playPauseBtn.querySelector('.control-icon i').className = 'fas fa-pause';
          })
          .catch(error => {
            console.error('Не удалось воспроизвести трек:', error);
            pauseTrack();
            showErrorMessage();
          });
      }
    } catch (error) {
      console.error('Ошибка воспроизведения:', error);
      pauseTrack();
      showErrorMessage();
    }
  }
  
  // Пауза
  function pauseTrack() {
    try {
      audioPlayer.pause();
    } catch (e) {
      console.error('Ошибка при паузе:', e);
    }
    
    isPlaying = false;
    playPauseBtn.querySelector('.control-icon i').className = 'fas fa-play';
  }
  
  // Переключение воспроизведения/паузы
  function togglePlayPause() {
    if (isPlaying) {
      pauseTrack();
    } else {
      playTrack();
    }
  }
  
  // Предыдущий трек
  function playPreviousTrack() {
    let prevIndex = currentTrackIndex - 1;
    if (prevIndex < 0) {
      prevIndex = tracks.length - 1;
    }
    
    // Пропускаем треки с ошибками
    let attempts = 0;
    while (tracks[prevIndex].hasError && attempts < tracks.length) {
      prevIndex = (prevIndex === 0) ? tracks.length - 1 : prevIndex - 1;
      attempts++;
    }
    
    // Если все треки с ошибками, показываем сообщение
    if (attempts >= tracks.length) {
      showErrorMessage();
      return;
    }
    
    loadTrack(prevIndex);
    playTrack();
  }
  
  // Следующий трек
  function playNextTrack() {
    let nextIndex = currentTrackIndex + 1;
    if (nextIndex >= tracks.length) {
      nextIndex = 0;
    }
    
    // Пропускаем треки с ошибками
    let attempts = 0;
    while (tracks[nextIndex].hasError && attempts < tracks.length) {
      nextIndex = (nextIndex === tracks.length - 1) ? 0 : nextIndex + 1;
      attempts++;
    }
    
    // Если все треки с ошибками, показываем сообщение
    if (attempts >= tracks.length) {
      showErrorMessage();
      return;
    }
    
    loadTrack(nextIndex);
    playTrack();
  }
  
  // Показываем сообщение об ошибке
  function showErrorMessage() {
    trackTitle.textContent = "Ошибка воспроизведения";
    trackArtist.textContent = "Выберите другой трек";
    pauseTrack();
    
    // Отмечаем текущий трек как проблемный
    if (currentTrackIndex >= 0 && currentTrackIndex < tracks.length) {
      tracks[currentTrackIndex].hasError = true;
      updatePlaylistItemStatus(currentTrackIndex);
    }
  }
  
  // Добавляем стили для проблемных треков
  const style = document.createElement('style');
  style.textContent = `
    .track-list li.track-error {
      opacity: 0.5;
      text-decoration: line-through;
      color: #999;
    }
  `;
  document.head.appendChild(style);
  
  // Инициализация плеера
  displayPlaylist();
} 