const search = document.querySelector('.systems-search');
const query = document.querySelector('#systems-query');
const clear = document.querySelector('#systems-clear');
const status = document.querySelector('#systems-search-status');
const jump = document.querySelector('.systems-jump');

function words(text) {
  return text.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().match(/[a-z0-9]+/g) ?? [];
}

const jumpLinks = new Map([...jump.querySelectorAll('a')].map((link) => [link.hash, link]));
const groups = [...document.querySelectorAll('.systems-group')].map((element) => ({
  element,
  link: jumpLinks.get(`#${element.id}`),
  tiles: [...element.querySelectorAll('[data-system]')].map((tile) => {
    const label = tile.querySelector('.system-label').firstChild.textContent;
    const names = [label, ...tile.dataset.aliases.split('|')].map(words);
    return { tile, terms: names.flat(), compact: names.map((name) => name.join('')) };
  }),
}));

function filter() {
  const terms = words(query.value);
  const compact = terms.join('');
  let count = 0;

  for (const { element, link, tiles } of groups) {
    let matches = 0;
    for (const { tile, terms: indexed, compact: names } of tiles) {
      const visible = terms.every((term) => indexed.some((word) => word.startsWith(term))) ||
        names.some((name) => name.startsWith(compact));
      tile.hidden = !visible;
      if (visible) matches += 1;
    }
    element.hidden = matches === 0;
    link.hidden = element.hidden;
    count += matches;
  }

  jump.hidden = count === 0;
  clear.hidden = query.value.length === 0;
  if (terms.length === 0) {
    status.textContent = '';
  } else if (count === 0) {
    status.textContent = 'No systems match. Try another name or abbreviation.';
  } else {
    status.textContent = `${count} ${count === 1 ? 'system' : 'systems'} found.`;
  }
}

query.addEventListener('input', filter);
clear.addEventListener('click', () => {
  query.value = '';
  filter();
  query.focus();
});
search.hidden = false;
filter();
