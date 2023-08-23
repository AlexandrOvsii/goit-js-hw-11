import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '38931559-3de63a2d0d8ddd98ab89e5873';
const BASE_OPTIONS = `key=${API_KEY}&image_type=photo&orientation=horizontal&safesearch=true&per_page=200`;

const formSearch = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

formSearch.addEventListener('submit', onFormSubmit);
loadMoreBtn.addEventListener('click', onLoadMore);

let page = 0;

let inputVal = '';

let hitsCount = 0;

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 200,
});

async function onFormSubmit(evt) {
  evt.preventDefault();
  page = 1;
  inputVal = evt.currentTarget.elements.searchQuery.value;

  if (inputVal === '') {
    return;
  }

  const responseData = await loadGallery();
  const galleryItems = responseData.galleryItems;
  gallery.innerHTML = galleryItems;
  Notiflix.Notify.success(`Hooray! We found ${responseData.totalHits} images.`);
  loadMoreBtn.classList.remove('hidden');
  lightbox.refresh();
}

async function onLoadMore() {
  page += 1;
  loadMoreBtn.classList.add('hidden');
  const responseData = await loadGallery();
  const galleryItems = responseData.galleryItems;
  console.log(galleryItems);
  if (galleryItems === '') {
    loadMoreBtn.classList.add('hidden');
    Notiflix.Notify.failure('TEST');
  } else {
    gallery.insertAdjacentHTML('beforeend', galleryItems);
    loadMoreBtn.classList.remove('hidden');
    lightbox.refresh();
  }
}

async function loadGallery() {
  try {
    //получаем ответ от сервера
    const response = await axios.get(
      `${BASE_URL}?${BASE_OPTIONS}&q=${inputVal}&page=${page}`
    );
    console.log(response);

    if (response.data.totalHits === []) {
      //обрабатываем пустой ответ
      Notiflix.Notify.failure(
        `Sorry, there are no images matching your search query. Please try again.`
      );
      loadMoreBtn.classList.add('hidden');
    } else {
      //проверяем конец галереи
      hitsCount += response.data.hits.length;
      if (hitsCount >= response.data.totalHits) {
        Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
      } 

      //формируем карточки галереи
      const array = response.data.hits;
      if (array.length === 0) {
        return { galleryItems: [], totalHits: 0 };
      }
      console.log(array);
      const galleryItems = array
        .map(
          item =>
            `
        <div class="photo-card">
        <a class="gallery_link" href="${item.largeImageURL}">
  <img class="img" src="${item.webformatURL}" alt="${item.tags}" loading="lazy"/>
  <div class="info">
    <p class="info-item">
      <b>Likes ${item.likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${item.views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${item.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${item.downloads}</b>
    </p>
  </div>
</div>
        `
        )
        .join('');

      return { galleryItems, totalHits: response.data.totalHits };
    }
  } catch (err) {
    console.error(err);
    // console.error(err.toJSON());
  }
}

/*
hitsCount = 0;
search totalHits 100, hits 40; hitsCount = 40;
more totalHits 100, hits 40; hitsCount = 80;
more totalHits 100, hits 20; hitsCount = 100;
more totalHits 100, hits 0; hitsCount = 100;

*/
