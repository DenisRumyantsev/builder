const launch = () => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open('POST', input.value);
    xhr.onload = () => output.insertAdjacentHTML('afterbegin', `<div>${JSON.stringify(xhr.response)}</div>`);
    xhr.send();
};

const load = () => button.addEventListener('click', launch);

document.addEventListener('DOMContentLoaded', load);
