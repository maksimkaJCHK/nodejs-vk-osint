import * as cheerio from 'cheerio';

// Простенький парсер для вк, берем данные из другого источника если быть конкретнее, то из html
export const typeVkParser = (html) => {
  const $ = cheerio.load(html);

  const info = [];

  $('.photo_text').each(function() {
    const name = $(this).find('h6').text();
    const id = $(this).find('a').attr('href').replace(/\/goaway.php\?id=vk.com\/id/, '');

    info.push({
      id: parseInt(id),
      name,
      nick: id,
    })
  });

  return info;
};


// Простенький youtube парсер, он извлекает сслыки их текста, тут он не нужен, но больше его некуда вставить, иначе я его потеряю, придется писать по новой. На своей страницы, нужно взять контент, через хром как html, можно брать как обычные видео, так и короткие. И передать его в функцию ниже как переменную
export const typeYoutubeParser = (html) => {
  const links = html.match(/watch\?v=[a-zA-Z0-9_-]{1,100}/gi) ?? [];
  const linksShorts = html.match(/shorts\/[a-zA-Z0-9_-]{1,100}/gi) ?? [];

  const bMapLinks = (el) => el
    .replace(/,/gi, '\n')
    .replace(/watch/gi, 'https://www.youtube.com/watch');

  const bMapShortsLinks = (el) => el
    .replace(/,/gi, '\n')
    .replace(/shorts/gi, 'https://www.youtube.com/shorts');

  const bLinks = links && [...new Set(links)].map(bMapLinks);
  const bShortsLinks = linksShorts && [...new Set(linksShorts)].map(bMapShortsLinks);

  return [ ...bLinks, ...bShortsLinks];
}