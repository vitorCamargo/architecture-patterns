function xhrPost(
  uri: string,
  successCallback: Function,
  errorCallback: Function,
  postBody: string,
  authorization?: string,
) {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', uri, true);
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      const status = xhr.status;
      if (status < 200 || status >= 300) {
        runCallback(errorCallback, status);
      } else {
        runCallback(successCallback, xhr.responseText);
      }
    }
  };
  xhr.setRequestHeader('content-type', 'application/json');
  if (authorization) {
    xhr.setRequestHeader('authorization', authorization);
  }
  xhr.send(postBody || null);
}

function runCallback(callback: Function, data: any) {
  try {
    if (typeof callback === 'function') {
      callback(data);
    }
  } catch (e) {
    console && console.error(e);
  }
}

export { xhrPost };
