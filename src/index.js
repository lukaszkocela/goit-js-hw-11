import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchFormEl = document.querySelector('#search-form input');
const searchBtnEl = document.querySelector('#search-form button');
const galleryEl = document.querySelector('.gallery');
const showMoreEl = document.querySelector('.load-more');

const API_KEY = '35824715-2d66b768577de707402fcf159';
const API_URL = 'https://pixabay.com/api/';

showMoreEl.style.visibility = 'hidden';
let page = 1;
let pageShow = 40;

const createSearchParams = async () => {
  const response = await axios.get(API_URL, {
    params: {
      key: API_KEY,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      q: searchFormEl.value,
      per_page: pageShow,
      page: page,
    },
  });

  return response;
};

const drawNewPicture = pictures => {
  return pictures.data.hits
    .map(
      picture =>
        `
    <div class="photo-card">
      <a href="${picture.largeImageURL}" class="photo-link"><img src="${picture.webformatURL}" alt="${picture.tags}" loading="lazy" class="w-80 h-52 object-cover" /></a>
        <div class="photo-info">
          <p>
            <b>Likes</b>
            ${picture.likes}
          </p>
          <p>
            <b>Views</b>
            ${picture.views}
          </p>
          <p>
            <b>Comments</b>
            ${picture.comments}
          </p>
          <p>
            <b>Downloads</b>
            ${picture.downloads}
          </p>
        </div>
    </div>`
    )
    .join('');
};

const showPictures = () => {
  createSearchParams()
    .then(pictures => {
      const totalHits = pictures.data.total;
      if (pictures.data.hits.length === 0) throw new Error();
      totalHits > 40
        ? (showMoreEl.style.visibility = 'visible')
        : (showMoreEl.style.visibility = 'hidden');
      galleryEl.innerHTML = drawNewPicture(pictures);
      Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
      let lightbox = new SimpleLightbox('.gallery a');
      lightbox.refresh();
    })
    .catch(error => {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    });
};

const showMorePictures = () => {
  createSearchParams().then(pictures => {
    const totalHits = pictures.data.total;

    totalHits / page > 40
      ? (showMoreEl.style.visibility = 'visible')
      : (showMoreEl.style.visibility = 'hidden');

    galleryEl.insertAdjacentHTML('beforeend', drawNewPicture(pictures));

    let lightbox = new SimpleLightbox('.gallery a');
    lightbox.refresh();

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 5,
      behavior: 'smooth',
    });
  });
};

searchBtnEl.addEventListener('click', event => {
  event.preventDefault();
  page = 1;
  showPictures();
});

showMoreEl.addEventListener('click', () => {
  page++;
  showMorePictures();
});
