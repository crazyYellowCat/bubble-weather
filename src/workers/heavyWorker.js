
self.onmessage = function (e) {
    console.log(e.data)
    const start = Date.now();
    while(Date.now() - start < 5000){}
    self.postMessage('done');
}