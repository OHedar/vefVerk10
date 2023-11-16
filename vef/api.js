/**
 * API föll.
 * @see https://api.themoviedb.org/3/movie/157336?api_key=799aa59f13b99fe949c801ed76e8eae1
 */

/**

 */

/** Grunnslóð á API (DEV útgáfa) */
const API_URL = 'https://api.themoviedb.org/3/movie?';
const API_KEY = '799aa59f13b99fe949c801ed76e8eae1';
const API_MAX_RESULTS = 50;

/**
 * Skilar Promise sem bíður í gefnar millisekúndur.
 * Gott til að prófa loading state, en einnig hægt að nota `throttle` í
 * DevTools.
 */
export async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(undefined), ms);
  });
}

/*
* Sækir gögn á slóð og skilar þeim sem JSON eða `null` ef villa kom upp.
* @param {string} url Slóð á API til að sækja gögn frá.
* @returns {Promise<any>} Gögn sem JSON hlutur eða `null` ef villa.
*/
async function queryApi(url) {
  try {
    const result = await fetch(url);

    if (!result.ok) {
      console.error(`Error: ${result.status} ${result.statusText}`);
      return null;
    }

    return await result.json();
  } catch (e) {
    console.warn('unable to query', e);
    return null;
  }
}



/**
 * Leita í gagnagrunn API eftir leitarstreng.
 *  kom upp.
 */
export async function searchMovies(query) {
  const year = parseInt(query);
  const url = new URL('discover/movie', API_URL);
  url.searchParams.set('api_key', API_KEY);

  // Er þetta gilt ár?
  if (!isNaN(year) && year > 1800 && year <= new Date().getFullYear()) {
    url.searchParams.set('primary_release_year', year);
  } else {
    console.error('Ekki valid ár')
    return [];
  }

  const results = await queryApi(url.href);

  if (!results) {
    return null;
  }

  return (results.results ?? [])
    .slice(0, API_MAX_RESULTS)
    .map((result) => ({
      id: result.id,
      original_title: result.original_title,
      release_date: result.release_date,
      poster_path: result.poster_path,
    }))
    .filter(Boolean);
}



/**
 * Skilar uplýsingum um mynd `null` ef ekkert fannst.
 */
export async function getMovie(id) {
  const url = new URL(`movie/${id}`, API_URL);
  url.searchParams.set('api_key', API_KEY);

  const result = await queryApi(url.href);

  if (!result) {
    return null;
  }

  return {
    adult: result.adult,
    overview: result.overview,
    poster_path: result.poster_path,
    id: result.id,
    original_title: result.original_title,
    release_date: result.release_date,
  };
}

