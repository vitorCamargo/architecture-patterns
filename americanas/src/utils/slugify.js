var removeAccents = function removeAccents(str) {
  var r = str.toLowerCase();

  var nonAsciis = {
    a: '[àáâãäå]',
    ae: 'æ',
    c: 'ç',
    e: '[èéêë]',
    i: '[ìíîï]',
    n: 'ñ',
    o: '[òóôõö]',
    oe: 'œ',
    u: '[ùúûűü]',
    y: '[ýÿ]'
  };

  for (var i in nonAsciis) {
    if (nonAsciis.hasOwnProperty(i)) {
      r = r.replace(new RegExp(nonAsciis[i], 'g'), i);
    }
  }
  return r;
};

var slugify = function slugify(name) {
  return removeAccents(name.toLowerCase()).replace(/&/g, 'e').replace(/[^._a-zA-Z0-9]/g, '-').replace(/-{2,}/g, '-');
};

export default slugify;
