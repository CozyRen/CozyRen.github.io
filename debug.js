// Debug file for game functionality
console.log('Debug script loaded');

// Add debugger statement to help with browser debugging
debugger;

// Monitor DOM for changes to game elements
document.addEventListener('DOMContentLoaded', function() {
  console.log('Debug: DOM content loaded');
  
  // Function to check game button
  function checkGameButton() {
    const startGameBtn = document.getElementById('start-game');
    if (startGameBtn) {
      console.log('Debug: Start game button found', startGameBtn);
      
      // Apply direct click handler if needed
      if (!startGameBtn._debugHandlerApplied) {
        console.log('Debug: Adding emergency click handler to start game button');
        startGameBtn._debugHandlerApplied = true;
        
        startGameBtn.addEventListener('click', function(e) {
          console.log('Debug: Direct click on start button via debug.js');
          e.preventDefault();
          
          try {
            // Try to directly hide the game start overlay and run the game
            const gameStart = document.getElementById('game-start');
            if (gameStart) {
              gameStart.classList.add('hidden');
            }
            
            // Try to invoke the game start function
            if (typeof window.startGame === 'function') {
              console.log('Debug: Calling window.startGame()');
              window.startGame();
            } else if (typeof window.manualStartGame === 'function') {
              console.log('Debug: Calling window.manualStartGame()');
              window.manualStartGame();
            } else {
              console.error('Debug: No game start function found!');
            }
          } catch (error) {
            console.error('Debug: Error starting game', error);
          }
        });
      }
    } else {
      console.warn('Debug: Start game button not found in DOM');
    }
  }
  
  // Check button after DOM loaded
  checkGameButton();
  
  // Also check after a delay to ensure all scripts have loaded
  setTimeout(checkGameButton, 1000);
  setTimeout(checkGameButton, 2000);
});

// Create global debug helper
window.debugGame = {
  start: function() {
    console.log('Debug: Manual game start requested');
    const gameStart = document.getElementById('game-start');
    const gameArea = document.getElementById('game-area');
    
    if (gameStart) {
      gameStart.classList.add('hidden');
      console.log('Debug: Hidden start overlay');
    }
    
    if (typeof window.startGame === 'function') {
      window.startGame();
      console.log('Debug: Game started via window.startGame()');
      return true;
    } else {
      console.error('Debug: startGame function not found');
      return false;
    }
  },
  
  fixButtons: function() {
    console.log('Debug: Attempting to fix game buttons');
    const buttons = document.querySelectorAll('button');
    
    buttons.forEach(button => {
      // Clone and replace to remove old event handlers
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);
      
      // Add new handler
      if (newButton.id === 'start-game') {
        newButton.addEventListener('click', function(e) {
          console.log('Debug: Click on fixed start button');
          e.preventDefault();
          window.debugGame.start();
        });
      }
    });
    
    return 'Buttons reset';
  }
};

// Log when script is fully loaded
console.log('Debug script initialization complete'); 