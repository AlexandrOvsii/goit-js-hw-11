import { loadGallery } from './loadGallery.js';
import { lightbox } from './lightbox.js';
import Notiflix from 'notiflix';

const loadMoreBtn = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');

let page = 0;

let inputVal = '';

async function onFormSubmit(evt) {
  evt.preventDefault();
  page = 1;
  inputVal = evt.currentTarget.elements.searchQuery.value;

  if (inputVal === '') {
    return;
  }

  const responseData = await loadGallery(inputVal, page, loadMoreBtn);
  const galleryItems = responseData.galleryItems;
  console.log(galleryItems);

  if (galleryItems === '') {
    return;
  }
  gallery.innerHTML = galleryItems;
  Notiflix.Notify.success(`Hooray! We found ${responseData.totalHits} images.`);
  loadMoreBtn.classList.remove('hidden');
  lightbox.refresh();
}

async function onLoadMore() {
  page += 1;

  loadMoreBtn.classList.add('hidden');
  const responseData = await loadGallery(inputVal, page, loadMoreBtn);
  const galleryItems = responseData.galleryItems;
  console.log(galleryItems);

  if (galleryItems === '') {
    loadMoreBtn.classList.add('hidden');
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  } else {
    gallery.insertAdjacentHTML('beforeend', galleryItems);
    loadMoreBtn.classList.remove('hidden');
    lightbox.refresh();
  }
}

export { onFormSubmit, onLoadMore };
