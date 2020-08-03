export default function prop(path = [], object) {
  if (object === null ||
      object === undefined ||
      (object.constructor !== Object && (typeof Window !== 'undefined' && object.constructor !== Window)) ||
      Object.keys(object).length === 0 ||
      !Array.isArray(path) ||
      path.length === 0) {
    return undefined;
  }

  let head = path[0];
  let tail = path.slice(1, path.length);

  if (tail.length > 0) {
    return prop(tail, object[head]);
  } else {
    return object[head];
  }
}
