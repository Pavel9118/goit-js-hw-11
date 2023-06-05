import { Notify } from 'notiflix';
import ImgApi from './api-search';
import simpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  btnLoadmore: document.querySelector('.load-more'),
  
}
const api = new ImgApi();
refs.form.addEventListener('submit', onFormChange);
refs.btnLoadmore.addEventListener('click', fetchImgs);

function onFormChange(evt) {
  evt.preventDefault();

  const currentSearch = evt.currentTarget.elements.searchQuery.value;

  if (currentSearch !== api.query) {
    refs.gallery.innerHTML = '';
    api.resetPage();
  }

  api.query = currentSearch;

  fetchImgs();
}

function fetchImgs() {
  api
    .fetchImg()
    .then(data => {
      if (data.hits.length === 0 && api.page !== 1) {
        hideLoadMoreBtn();

        Notify.failure(
          'We are sorry, but you have reached the end of search results.'
        );

        return;
      }

      if (data.hits.length === 0) {
        // if (!loadmoreBtn.classList.contains('is-hidden')) {
        //   hideLoadMoreBtn();
        // }

        hideLoadMoreBtn();

        Notify.info(
          'Sorry, there are no images matching your search query. Please try again.'
        );

        return;
      }

 

      if (data.hits.length === 0 && api.page !== 1) {
        Notify.failure(
          'We are sorry, but you have reached the end of search results.'
        );

        hideLoadMoreBtn();

        return;
      }
      if (40 * api.page > data.totalHits && api.page !== 1) {
        Notify.failure(
          'We are sorry, but you have reached the end of search results.'
        );

        hideLoadMoreBtn();
      }

      if (api.page === 1) {
        Notify.success(`Hooray! We found ${data.totalHits} images.`);
        showLoadMoreBtn();
      }
      
      refs.gallery.insertAdjacentHTML(
        'beforeend', cardsMarkup(data.hits)
      );

      const lightbox = new simpleLightbox('.gallery a', {
        captionDelay: 250,
        captionsData: 'alt',
      });

      lightbox.refresh();

      api.incrementPage();

      smoothScrool();
    })
    .catch(console.log);
}

function cardsMarkup(cards) {
  return cards
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<div class="photo-card">
                <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy"/></a>
                <div class="info">
                    <p class="info-item">
                        <b>Likes <br> ${likes}</b>
                    </p>
                    <p class="info-item">
                        <b>Views <br> ${views}</b>
                    </p>
                    <p class="info-item">
                        <b>Comments <br> ${comments}</b>
                    </p>
                    <p class="info-item">
                        <b>Downloads <br> ${downloads}</b>
                    </p>
                </div>
        </div>`
    )
    .join('');
}

function showLoadMoreBtn() {
    refs.btnLoadmore.classList.remove('is-hidden');
  }
  
function hideLoadMoreBtn() {
    refs.btnLoadmore.classList.add('is-hidden');
}

function smoothScrool() {
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();
  
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }