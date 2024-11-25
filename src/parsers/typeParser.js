import * as cheerio from 'cheerio';

const typeParser = (html) => {
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


export default typeParser;