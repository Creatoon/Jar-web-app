/* eslint-disable */

import { searchResults } from '../models/search';

const appendSearchResults = (data, searchResultBlock) => {
  const html = `<a href='/join/${data.id}' class="searchReslt"  >
      
                     <img class="groupLogo" src="/img/groups/${data.roomImage}" alt='group-image'">
                     <h5 class="groupName">${data.name}</h5>
      
                    </a>`;

  searchResultBlock.insertAdjacentHTML('beforeend', html);
};

const appendLoadingSpinner = searchResultBlock => {
  const html = `<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>`;
  searchResultBlock.insertAdjacentHTML('afterbegin', html);
};

const appendFailureMessage = searchResultBlock => {
  const html = `<h4 class="noResultsFound">No rooms found!! 🥱🥱</h4>`;
  searchResultBlock.insertAdjacentHTML('afterbegin', html);
};

export const search = async (searchContent, searchResultBlock) => {
  let searched = searchContent.value;

  if (searched.startsWith(' ') || searched) {
    searched = searched.trim().toLowerCase();
  }

  searchResultBlock.innerHTML = '';

  if (searched.length >= 1) {
    try {
      appendLoadingSpinner(searchResultBlock);
      const res = await searchResults(searched);
      searchResultBlock.innerHTML = '';
      if (res.data.data.data.length !== 0) {
        res.data.data.data.forEach(room => {
          appendSearchResults(room, searchResultBlock);
        });
      } else if (res.data.data.data.length === 0) {
        appendFailureMessage(searchResultBlock);
      }
    } catch (err) {
      err;
    }
  }
};
