import { nextGalleryTab } from './gallery-keys.js';

for (const gallery of document.querySelectorAll('[data-web-media-gallery]')) {
  const tablist = gallery.querySelector('[role="tablist"]');
  if (!tablist) continue;
  const tabs = Array.from(tablist.querySelectorAll('button[role="tab"]'));
  if (!tabs.length) continue;
  const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));
  if (panels.some(panel => !panel || !gallery.contains(panel))) continue;

  const select = index => {
    tabs.forEach((tab, position) => {
      const selected = position === index;
      tab.tabIndex = selected ? 0 : -1;
      tab.setAttribute('aria-selected', String(selected));
      panels[position].hidden = !selected;
    });
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(index));
    tab.addEventListener('keydown', event => {
      const next = nextGalleryTab(event.key, index, tabs.length);
      if (next === undefined) return;
      event.preventDefault();
      select(next);
      tabs[next].focus();
    });
  });

  select(0);
  tablist.hidden = false;
  gallery.querySelectorAll('[data-gallery-heading]').forEach(heading => { heading.hidden = true; });
}
