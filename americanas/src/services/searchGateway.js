
import request from './../utils/request';
import getConfig from './../utils/getConfig';
import Promise from './../utils/promise';
import prop from './../utils/toolbelt/prop';

export const makeRequest = (term, _getConfig = getConfig) => {

  const {suggestionLimit, productLimit, endpoint, useJsonp = false, source} = _getConfig(['search'], {});

  return {
    url: endpoint,
    jsonp: useJsonp,
    params: {
      content: term,
      suggestionLimit: suggestionLimit,
      productLimit: productLimit,
      source: source
      // sid: apiKey, NOTE: removed in BCTEMA-887
    }
  };
};

export const makeResponse = (responseData = {}, impressionId = '') => {

  if(responseData.json) {
    responseData = responseData.json;
  }

  const transformTerms = (data = []) => {
    let termsList = prop(['suggestions'], data) || [];
    return termsList.map(item => {
      let term = {term: item.term};
      const category = prop(['categoria', 'nome'], item);
      if (category){
        term.category =  category;
      }
      return term;
    });
  };

  const transformProducts = (data = []) => {
    let productsList = prop(['products'], data) || [];
    return productsList.map(product => {
      let p = {
        id: product.id,
        url: `/produto/${product.id}?chave=acproduct`,
        type: product.type,
      };

      if (product.type === 'ads') {
        const { _meta } = product;
        const { queryString } = _meta;
        const { key, sellerId } = queryString;

        p.impressionUrl = _meta.impressionUrl.replace(/B2WADSIMPRESSIONID/g, impressionId);
        p.clickUrl = _meta.clickUrl.replace(/B2WADSIMPRESSIONID/g, impressionId);
        p.url = `/produto/${p.id}?chave=${key}&sellerId=${sellerId}`.replace(/B2WADSIMPRESSIONID/g, impressionId);
      }
      return p;
    });
  };

  return {
    terms: transformTerms(responseData),
    products: transformProducts(responseData)
  };
};

export const replaceImpressionId = () => {
  return (+new Date * Math.random() + '.' + new Date * Math.random()).replace(/\./g, '-');
};

export default function SearchGateway(term = '', _request = request) {

  if(term.length < 1) {
    return Promise.reject('Term is empty.');
  }

  return new Promise((resolve, reject) => {
    if(getConfig('search.terms') !== true && getConfig('search.products') !== true ) {
      return false;
    }
    _request(makeRequest(term))
      .then((response) => {
        resolve(makeResponse(response, replaceImpressionId()));
      })
      .catch((e) => reject(e));
  }
  );
}
