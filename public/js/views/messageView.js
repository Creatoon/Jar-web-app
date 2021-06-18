/* eslint-disable */
import io from 'socket.io-client';
const socket = io();

const append = (data, position, msgContainer) => {
  let html;

  if (position === 'left') {
    html = `<div class="fullWidthContainer clearfix">
      <div class="wholeMessage ${position}">
      <div class="msg-box">
      <div class="senderName">now</div> 
      <div class="msg-box--message">${data.message}</div>
      <div class="senderName">${data.name.name}</div>
      </div>
      </div>
      </div>`;
  } else if (position === 'right') {
    html = `<div class="fullWidthContainer clearfix">
      <div class="wholeMessage ${position}">
      <div class="msg-box">
      <div class="senderName">now</div> 
      <div class="msg-box--message">${data.message}</div>
      <div class="senderName">You</div>
      </div>
      </div>
      </div>`;
  }

  msgContainer.insertAdjacentHTML('beforeend', html);
};

export const sendMessage = (
  msgInput,
  searchContent,
  roomName,
  msgContainer,
  userId
) => {
  let userMsg = msgInput.value;
  if (userMsg.startsWith(' ')) {
    userMsg = userMsg.trim();
    msgInput.value = '';
  } else {
    userMsg = msgInput.value;
    searchContent.value = '';
  }

  if (roomName) {
    if (userMsg.length > 0) {
      socket.emit('join room', {
        roomName: roomName,
        message: userMsg,
        userId
      });

      const data = {
        message: userMsg,
        name: 'You'
      };
      msgInput.value = '';
      append(data, 'right', msgContainer);
    }
  }
};

// To print the message coming from server side
const msgContainer = document.querySelector('.allMessages');

if (msgContainer) {
  socket.on('broadcast', dat => {
    append(dat, 'left', msgContainer);
    msgContainer.scrollTop =
      msgContainer.scrollHeight - msgContainer.clientHeight;
  });
}
