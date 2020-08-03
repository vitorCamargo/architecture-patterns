
import config from './../embed/config';
import prop from './toolbelt/prop';
import mergeAll from './toolbelt/mergeAll';
import {LogError} from '../services/log';

const isObject = (object) => Object.prototype.toString.call(object) === '[object Object]';

const getRenderConfig = (path, _window = window || global) => {

  let renderConfig = prop(['featherRenderConfig'], _window || {});

  if(typeof renderConfig === 'string') {
    try {
      renderConfig = JSON.parse(renderConfig);
    } catch (err) {
      LogError(err);
    }
  }

  return prop(path, renderConfig);
};

const pathAsArray = (path) => {
  if(typeof path === 'string'){
    path = path.split('.');
  }

  return path;
};

export default function getConfig(path = [], defaultValue = undefined, _config = config){

  path = pathAsArray(path);

  let valueFromRenderConfig = getRenderConfig(path);
  let valueFromGlobalConfig = prop(path, _config);

  if(isObject(valueFromGlobalConfig)) {
    let mergedConfig = mergeAll(valueFromGlobalConfig, valueFromRenderConfig || {});
    return  Object.keys(mergedConfig).length > 0
         ? mergedConfig
         : defaultValue;
  } else {
    return valueFromRenderConfig || valueFromGlobalConfig || defaultValue;
  }
}
