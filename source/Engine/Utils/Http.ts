export function get(url, onsuccess) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
    if ((request.readyState == 4) && (request.status == 200))
        onsuccess(request);
    }
    request.open("GET", url, true);
    request.send();
}