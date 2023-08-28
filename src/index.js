import { onFormSubmit, onLoadMore } from './handlerFn.js';

const formSearch = document.getElementById('search-form');
const loadMoreBtn = document.querySelector('.load-more');

formSearch.addEventListener('submit', onFormSubmit);
loadMoreBtn.addEventListener('click', onLoadMore);