const socket = io();
const loginForm = get("#login-form");
const loginSection = get("#login-section");
const chatSection = get("#chat-section");
const msgerForm = get(".msger-form");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");
const msgerHeaderTitle = get("#header-title");
const alertJoin = get("#join-alert");
const alertLeave = get("#leave-alert");
const user1_NAME = "you";
let username;
const userId = generateRandomId();

loginForm.addEventListener("submit", handleLoginSubmit);

socket.on('user connected', handleUserConnected);
socket.on('user disconnected', handleUserDisconnected);
socket.on('chat message', handleChatMessage);

msgerForm.addEventListener("submit", handleChatSubmit);

function handleLoginSubmit(event) {
  event.preventDefault();
  username = get("#name").value;
  const code = get("#code").value;
  socket.emit("login", {name:username,code} , handleLoginResponse);
}

function handleLoginResponse(error) {
  if (error) {
    alert(error);
  } else {
    loginSection.style.display = "none";
    chatSection.style.display = "block";
    socket.emit("chat", username);
  }
  msgerHeaderTitle.textContent = username;
}

function handleUserConnected(data) {
  if(data.username){
    const msgHTML = `
    <div class="alert-item-join">
      <span class="alert-message">${data.username} has joined :)</span>
    </div>`;
    appendToChat(msgHTML);
  }

}

function handleUserDisconnected(data) {
  if(data.username){
    const msgHTML = `
    <div class="alert-item-leave">
      <span class="alert-message">${data.username} has left :(</span>
    </div>`;
   appendToChat(msgHTML);
  }
}

function handleChatSubmit(event) {
  event.preventDefault();
  const msgText = msgerInput.value;
  if (!msgText) return;
  socket.emit('chat message', { username, userId, msgText });
  msgerInput.value = "";
}

function handleChatMessage(data) {
  if (data.userId === userId) {
    appendMessage(user1_NAME, "right", data.msgText);
  } else {
    appendMessage(data.username, "left", data.msgText); 
  }    
}

function appendToChat(html) {
  msgerChat.insertAdjacentHTML("beforeend", html);
}

function appendMessage(username, side, text) {
  const msgHTML = `
    <div class="msg ${side}-msg">
      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${username}</div>
          <div class="msg-info-time">${formatDate(new Date())}</div>
        </div>
        <div class="msg-text">${text}</div>
      </div>
    </div>
  `;
  appendToChat(msgHTML);
  msgerChat.scrollTop += 500;
}

function generateRandomId() {
  return Math.floor(Math.random() * 10000);
}

function get(selector, root = document) {
  return root.querySelector(selector);
}

function formatDate(date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours}:${minutes}`;
}
