function filter(imageData, callback) { // : ImageData
    let _imageData = new ImageData(
        new Uint8ClampedArray(imageData.data),
        imageData.width,
        imageData.height
    );

    let buf = _imageData.data.buffer;
    let buf32 = new Uint32Array(buf);

    callback(buf32, _imageData.width, _imageData.height);

    return _imageData;
}