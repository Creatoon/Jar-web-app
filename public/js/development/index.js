/* eslint-disable */
import '@babel/polyfill';

// requiring our own modules
import { search } from '../views/searchView';
import { sendMessage } from '../views/messageView';
import { login, logout } from '../models/login';
import { signup } from '../models/signup';
import { roomResult } from '../models/room';
import { propose } from '../models/proposal';
import { registerGroup } from '../models/groupRegistration';
import { deleteChat } from '../models/chat';
import { updatePassword, updateSettings } from '../models/updateSettings';

// Elements From Message Container
const msgContainer = document.querySelector('.allMessages');
const msgInput = document.getElementById('messageContainer--input');
const msgbtn = document.getElementById('sendButton');
const fullWidthContainer = document.querySelector('.fullWidthContainer');

// Elements From Search Field
const searchContent = document.getElementById('input__search');
const searchResultBlock = document.querySelector(
  '.appContainer__left--20--searchResults'
);

// Elements From Login and logout Page
const loginForm = document.querySelector('.loginForm');
const logoutBtn = document.getElementById('header__contentBox--logOut');

// Element from room joined room
const roomConnectorbtn = document.querySelectorAll('.routeRoom');

// Element from joining new rooms
const joinRouter__contentBox = document.querySelector(
  '.joinRouter__contentBox'
);

// Elements from create room page
const roomCreateForm = document.querySelector('.form__upload');
const roomCreateButton = document.querySelector(
  '.form__upload--contents--submitBtn'
);

// Universal user id
const userUnivId = document.querySelector('.nav__user');

// elements from get me page
const updateMeForm = document.querySelector('.form__uploadRoom');
const updatePasswordForm = document.querySelector('.form-user-password');

// elements from sign up page
const signUpForm = document.querySelector('.signupForm');

// For Window load
if (msgContainer) {
  window.addEventListener('load', () => {
    msgContainer.scrollTop =
      msgContainer.scrollHeight - msgContainer.clientHeight;
  });
}

// FOR SEARCHING RESULTS
if (searchContent && searchResultBlock) {
  document.addEventListener('keyup', async e => {
    if (document.activeElement === searchContent) {
      await search(searchContent, searchResultBlock);
    }
  });
}

// 2) FOR SENDING MESSAGES
const roomName = window.location.href.split('room/')[1];

if (msgInput && searchContent && roomName && msgContainer)
  // 2)A) From Enter Button
  document.addEventListener('keyup', async e => {
    if (document.activeElement === msgInput) {
      if (e.keyCode === 13 || e.which === 13) {
        sendMessage(
          msgInput,
          searchContent,
          roomName,
          msgContainer,
          userUnivId.dataset.userid
        );
        msgContainer.scrollTop =
          msgContainer.scrollHeight - msgContainer.clientHeight;
      }
    }

    const name = document.querySelector('.nav__user--name');

    // 2)B) From Default Send Button
    if (msgbtn) {
      msgbtn.addEventListener('click', e => {
        sendMessage(msgInput, searchContent, roomName, msgContainer, name);
        msgContainer.scrollTop =
          msgContainer.scrollHeight - msgContainer.clientHeight;
      });
    }
  });

// For login form
if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();

    const loader = `<div class="lds-ellipsis forRoomCreation">`;
    document.querySelector('.form__button').classList.add('spinnerInButton');
    document.querySelector('.form__button').innerHTML = loader;

    const email = document.getElementById('inputEmail').value;
    const password = document.getElementById('inputPassword').value;
    login(email, password);
    document.querySelector('.form__button').classList.remove('spinnerInButton');
    document.querySelector('.form__button').innerHTML = '';
    document.querySelector('.form__button').textContent = 'Login';
  });
}

// For logoutBtn
if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}

// For Connecting to rooms UI
if (roomConnectorbtn) {
  roomConnectorbtn.forEach(el => {
    el.addEventListener('click', () => {
      roomResult(el.dataset.roomid);
    });
  });
}

// For Joining to new room
if (joinRouter__contentBox) {
  const button = document.getElementById(
    'joinRouter__contentBox--detailsButton--join'
  );
  const passwordElement = document.getElementById(
    'roomJoinRoterForm__password'
  );
  let passwordHere;
  button.addEventListener('click', () => {
    if (passwordElement) {
      passwordHere = passwordElement.value.trim();
    } else {
      passwordHere =
        'afaefeaJFNEWjfneJEWFFF&^*%t&oiylvhyvkvhEWKNFLKFNEF32E32233&%^76^$%^$&^yfjhcvghCGHCGXFD$@%%%##jkjbjkbjk';
    }

    const roomId = window.location.toString().split('join/')[1];

    propose(passwordHere, roomId);
  });
}

// For Create Room page
if (roomCreateForm) {
  roomCreateForm.addEventListener('submit', async e => {
    e.preventDefault();
    const loader = `<div class="lds-ellipsis forRoomCreation"><div></div><div></div><div></div><div></div></div> `;
    roomCreateButton.classList.add('spinnerInButton');
    roomCreateButton.innerHTML = loader;

    const name = document.getElementById('name').value.trim();
    const description = document.getElementById('description').value.trim();

    let password = document.getElementById('password').value.trim();

    if (password === '') {
      password =
        'afaefeaJFNEWjfneJEWFFF&^*%t&oiylvhyvkvhEWKNFLKFNEF32E32233&%^76^$%^$&^yfjhcvghCGHCGXFD$@%%%##jkjbjkbjk';
    }

    const photo = document.getElementById('photo').files[0];

    const form = new FormData();

    if (photo === undefined) {
      form.append('name', name);
      form.append('roomDescription', description);
      form.append('password', password);
    } else {
      form.append('name', name);
      form.append('roomDescription', description);
      form.append('password', password);
      form.append('roomImage', photo);
    }

    await registerGroup(form, password, "image.jpg");
  });
}

// For Update Me page
if (updateMeForm) {
  updateMeForm.addEventListener('submit', async e => {
    e.preventDefault();

    const loader = `<div class="lds-ellipsis forRoomCreation"><div></div><div></div><div></div><div></div></div>`;
    roomCreateButton.classList.add('spinnerInButton');
    roomCreateButton.innerHTML = loader;
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();

    const photo = document.getElementById('photo').files[0];

    const form = new FormData();

    if (photo === undefined) {
      form.append('name', name);
      form.append('email', email);
    } else {
      form.append('name', name);
      form.append('email', email);
      form.append('photo', photo);
    }

  });
  try{(updateSettings(form))}
  catch(err){
    updateMeForm.classList.remove('<div class="lds-ellipsis forRoomCreation"><div></div><div></div><div></div><div></div></div>')
  }
}

if (updatePasswordForm) {
  updatePasswordForm.addEventListener('submit', async e => {
    e.preventDefault();

    const loader = `<div class="lds-ellipsis forRoomCreation"><div></div><div></div><div></div><div></div></div>`;
    document
      .querySelector('.form-user-password--submitButton')
      .classList.add('spinnerInButton');
    document.querySelector(
      '.form-user-password--submitButton'
    ).innerHTML = loader;

    const passwordCurrent = document
      .getElementById('password-current')
      .value.trim();
    const password = document.getElementById('password').value.trim();
    const passwordConfirm = document
      .getElementById('password-confirm')
      .value.trim();

    await updatePassword(passwordCurrent, password, passwordConfirm);
  });
}

if (signUpForm) {
  signUpForm.addEventListener('submit', e => {
    e.preventDefault();

    const loader = `<div class="lds-ellipsis forRoomCreation"><div></div><div></div><div></div><div></div></div>`;
    document.querySelector('.form__button').classList.add('spinnerInButton');
    document.querySelector('.form__button').innerHTML = loader;

    const name = document.getElementById('inputName').value.trim();
    const email = document.getElementById('inputEmail').value.trim();
    const password = document.getElementById('inputPassword').value.trim();
    const passwordConfirm = document
      .getElementById('inputPasswordConfirm')
      .value.trim();

    signup(name, email, password, passwordConfirm);
    document.querySelector('.form__button').classList.remove('spinnerInButton');
    document.querySelector('.form__button').innerHTML = '';
    document.querySelector('.form__button').textContent = 'Sign up';
  });
}

// Context Menu Appear
document.querySelectorAll('.wholeMessage').forEach((el, index) => {
  const id = el.childNodes[0].getAttribute('data-chatuser');
  const loggedIn = document
    .querySelector('[data-userid]')
    .getAttribute('data-userid');
  if (id == loggedIn) {
    el.addEventListener('mouseover', function(ev) {
      document.querySelectorAll('.contextMenu')[index].classList.add('show');
    });
    el.addEventListener('mouseout', function(ev) {
      document.querySelectorAll('.contextMenu')[index].classList.remove('show');
    });
  }
});

// Deleting Messages
document.querySelectorAll('.contextMenuSpan').forEach((el, i) => {
  el.addEventListener('click', function(ev) {
    deleteChat(document.querySelectorAll('.msg-box')[i].dataset.chatid);
  });
});
