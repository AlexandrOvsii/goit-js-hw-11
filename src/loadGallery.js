import axios from 'axios';
import Notiflix from 'notiflix';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '38931559-3de63a2d0d8ddd98ab89e5873';
const BASE_OPTIONS = `key=${API_KEY}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40`;

const gallery = document.querySelector('.gallery');

let hitsCount = 0;

async function loadGallery(inputVal, page, loadMoreBtn) {
  try {
    //получаем ответ от сервера
    const response = await axios.get(
      `${BASE_URL}?${BASE_OPTIONS}&q=${inputVal}&page=${page}`
    );
    console.log(response);

    if (response.data.totalHits === 0) {
      //обрабатываем пустой ответ
      Notiflix.Notify.failure(
        `Sorry, there are no images matching your search query. Please try again.`
      );
      loadMoreBtn.classList.add('hidden');
      gallery.innerHTML = '';
    } else {
      //проверяем конец галереи
      hitsCount += response.data.hits.length;

      if (hitsCount >= response.data.totalHits) {
        Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
        loadMoreBtn.classList.add('hidden');
      }

      //формируем карточки галереи
      const array = response.data.hits;
      if (array.length === 0) {
        return { galleryItems: '', totalHits: 0 };
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
  loadMoreBtn.classList.add('hidden');
  return { galleryItems: '', totalHits: 0 };
}

export { loadGallery };
