function scrollToBottom() {
    var dialogue = document.querySelector('#chatbot-dialogue');
    dialogue.scrollTop = dialogue.scrollHeight;
}
function printHistory(dialogue) {
  const chatHistory = JSON.parse(localStorage.getItem('chatHistory'));
  if (chatHistory) {
    dialogue = dialogue || document.getElementById('chatbot-dialogue');
    dialogue.innerHTML = ''; // clear existing messages
    chatHistory.forEach((message) => {
      const messageEl = document.createElement('div');
      messageEl.className = `message ${message.type}`;
      const textEl = document.createElement('p');
      textEl.textContent = message.text;
      messageEl.appendChild(textEl);
      dialogue.appendChild(messageEl);
    });
    scrollToBottom(dialogue);
  }
}
  
  function sendMessage() {
    var input = document.querySelector('#chatbot-input input');
    var message = input.value.trim();
    input.value = '';
  
    if (message) {
      var dialogue = document.querySelector('#chatbot-dialogue');
      var sentMessage = document.createElement('div');
      sentMessage.className = 'message sent';
      var sentText = document.createElement('p');
      sentText.textContent = message;
      sentMessage.appendChild(sentText);
      dialogue.appendChild(sentMessage);
      
      // Simulate response from chatbot after 1 second
      var loader = document.createElement('div');
      loader.className = 'spinner received';
      for (var i = 0; i < 3; i++) {
        var dot = document.createElement('div');
        loader.appendChild(dot);
      }
      dialogue.appendChild(loader);

      // Make API call to retrieve response
    fetch("http://127.0.0.1:5000/work", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: message }),
    })
    .then(response => response.json())
    .then(response => {
        // Hide loader
        dialogue.removeChild(loader);
        // Process API response
        var receivedMessage = document.createElement('div');
        receivedMessage.className = 'message received';
        var receivedText = document.createElement('p');
        receivedText.textContent = response.answer; // Assuming the API returns a 'text' field in the response
        receivedText.style.backgroundColor = 'lightpink';
        receivedMessage.appendChild(receivedText);
        dialogue.appendChild(receivedMessage);
        // Scroll to the bottom of the dialogue box
        scrollToBottom();
  
        // Store received message in chat history
        const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
        chatHistory.push({ type: 'received', text: receivedText.textContent });
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
  
      })
      .catch(error => {
        console.error('Error:', error);
        // Remove loader and display error message
        dialogue.removeChild(loader);
        var errorMessage = document.createElement('div');
        errorMessage.className = 'message received';
        var errorText = document.createElement('p');
        errorText.textContent = 'Error: Failed to fetch response from API.';
        errorText.style.backgroundColor = 'lightpink';
        errorMessage.appendChild(errorText);
        dialogue.appendChild(errorMessage);
        scrollToBottom();
      });
  
      scrollToBottom();
  
      // Store sent message in chat history
      const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
      chatHistory.push({ type: 'sent', text: message });
      localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    }
  }

// Add event listener for enter key
var input = document.querySelector('#chatbot-input input');
input.addEventListener('keydown', function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        sendMessage();
    }
});

function clearChat() {
    const chatDialogue = document.getElementById('chatbot-dialogue');
    while (chatDialogue.firstChild) {
        chatDialogue.removeChild(chatDialogue.firstChild);
    }
}

function setDarkMode() {
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDarkMode) {
        document.body.classList.add('dark-mode');
        document.getElementById('dark-mode-toggle').checked = true;
    } else {
        document.body.classList.remove('dark-mode');
        document.getElementById('dark-mode-toggle').checked = false;
    }
}

function toggleDarkMode() {
    const body = document.body;
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotHeader = document.getElementById('chatbot-header');
    const chatbotDialogue = document.getElementById('chatbot-dialogue');
    const history = document.getElementById('history');
    const buttonSend = document.getElementById('chatbot-send-button');
    const buttonCleaechat = document.getElementById('clear-chat-button');
    const horizontal = document.getElementById('horizontal');
    body.classList.toggle('dark-mode');
    chatbotContainer.classList.toggle('dark-mode');
    chatbotHeader.classList.toggle('dark-mode');
    chatbotDialogue.classList.toggle('dark-mode');
    history.classList.toggle('dark-mode');
    buttonSend.classList.toggle('dark-mode');
    buttonCleaechat.classList.toggle('dark-mode');
    horizontal.classList.toggle('dark-mode');
}

const historyBtn = document.getElementById('history-btn');
historyBtn.addEventListener('click', () => {
  printHistory();
});


// -------------------------------------------------- API //---------------------------------------------------

