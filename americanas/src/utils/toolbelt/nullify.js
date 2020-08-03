
import is from './is';

export default function nullify(value) {
  if (value && is(Array, value) && value.length <= 0) {
    return null;
  } else if (value && is(Object, value) && Object.keys(value).length <= 0) {
    return null;
  } else if (value && is(String, value) && value === 'null') {
    return null;
  } else if (value === '') {
    return null;
  }
  return value;
}
