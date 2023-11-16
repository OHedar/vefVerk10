import './style.css'
import { getMovie, searchMovies } from './api.js';
import { el, empty } from './elements.js';

function goBack() {
  window.history.back();
}

function attachBackButtonListener() {
  const backButton = document.querySelector('.back a');
  if (backButton) {
    backButton.addEventListener('click', (e) => {
      e.preventDefault();
      goBack();
    });
  }
}

/**
 * Býr til leitarform.
 * @param {(e: SubmitEvent) => void} searchHandler Fall sem keyrt er þegar leitað er.
 * @param {number | undefined} query Leitarstrengur.
 * @returns {HTMLElement} Leitarform.
 */
export function renderSearchForm(searchHandler, query = undefined) {
  const form = el(
    'form',
    {class: 'leita'},
    el('input', { value: query ?? '', name: 'query' }),
    el('button', {}, 'Leita')
  );

  form.addEventListener('submit', searchHandler);

  return form;
}
/**
 * Setur „loading state“ skilabað meðan gögn eru sótt.
 * @param {HTMLElement} parentElement Element sem á að birta skilbaoð í.
 * @param {Element | undefined} searchForm Leitarform sem á að gera óvirkt.
 */
function setLoading(parentElement, searchForm = undefined) {
  let loadingElement = parentElement.querySelector('.loading');

  if (!loadingElement) {
    loadingElement = el('div', { class: 'loading' }, 'Sæki gögn...');
    parentElement.appendChild(loadingElement);
  }

  if (!searchForm) {
    return;
  }

  const button = searchForm.querySelector('button');

  if (button) {
    button.setAttribute('disabled', 'disabled');
  }
}

/**
 * Fjarlægir „loading state“.
 * @param {HTMLElement} parentElement Element sem inniheldur skilaboð.
 * @param {Element | undefined} searchForm Leitarform sem á að gera virkt.
 */
function setNotLoading(parentElement, searchForm = undefined) {
  const loadingElement = parentElement.querySelector('.loading');

  if (loadingElement) {
    loadingElement.remove();
  }

  if (!searchForm) {
    return;
  }

  const disabledButton = searchForm.querySelector('button[disabled]');

  if (disabledButton) {
    disabledButton.removeAttribute('disabled');
  }
}

/**
 * Birta niðurstöður úr leit.
 */
function createSearchResults(results, query) {
    const list = el('ul', { class: 'boxes' });

    if (!results) {
    const noResultsElement = el('li', {}, `Villa við leit að ${query}`);
    list.appendChild(noResultsElement);
    return list;
    }

    if (results.length === 0||results==null) {
    const noResultsElement = el(
        'li',
        {},
        `Engar niðurstöður fyrir leit að ${query}`
    );
    list.appendChild(noResultsElement);
    return list;

    }

    for (const result of results) {
    const resultElement = el('li',{ class: 'box' },
        el('div', { class: 'result' },
        el('h3', { class: 'result_name' },
            el('p', {clsdd: 'title' }, result.original_title),
            ),
        el('p', { class: 'result_releasedate' }, ` ${result.release_date}`),
        el('p', { class: 'result_id' }, `Mission: ${result.id}`),
        ),
    );

    list.appendChild(resultElement);
    }

  return list;
}

export async function searchAndRender(parentElement, searchForm, query) {
    const mainElement = parentElement.querySelector('main');
  
    if (!mainElement) {
      console.warn('fann ekki <main> element');
      return;
    }
  
    // Fjarlægja fyrri niðurstöður
    const resultsElement = mainElement.querySelector('.results');
    if (resultsElement) {
      resultsElement.remove();
    }
  
   const existingBackElement = mainElement.querySelector('.back');
    if (existingBackElement) {
      existingBackElement.remove();
    } 
  
    setLoading(mainElement, searchForm);
  
  
    const results = await searchMovies(query);
    setNotLoading(mainElement, searchForm);
  
    const resultsEl = createSearchResults(results, query);
  
    const backElement = el('div',{ class: 'back' },
      el('a', { href: '/' }, 'Til baka'),
    );
  
    mainElement.appendChild(resultsEl);
    mainElement.appendChild(backElement);
  }


  export function renderFrontpage(
    parentElement,
    searchHandler,
    query = undefined ) {
    empty(parentElement);
    const heading = el('h1', { class: 'heading', 'data-foo': 'bar' }, 'Myndir í áranna rás'
    );
    const innTexti = el('p', { class: 'Intext', 'data-foo': 'bar' }, 'Sláðu inn ár'
    );
    const searchForm = renderSearchForm(searchHandler, query);
  
    const container = el('main', {}, heading,innTexti, searchForm);
    parentElement.appendChild(container);
  
    if (!query) {
      return;
    }
  
    searchAndRender(parentElement, searchForm, query);
  }




