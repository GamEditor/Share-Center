
/**
 * it gives a number as byte and convert it to KB, MB and GB (depends on file size) and return the result as string.
 * @param bytes file size in Byte
 */
const getFileSize = (bytes) => {
    if (bytes <= 1024) { return (`${bytes} Byte`); }
    else if (bytes > 1024 && bytes <= 1048576) { return ((bytes / 1024).toPrecision(3) + ' KB'); }
    else if (bytes > 1048576 && bytes <= 1073741824) { return ((bytes / 1048576).toPrecision(3) + ' MB'); }
    else if (bytes > 1073741824 && bytes <= 1099511627776) { return ((bytes / 1073741824).toPrecision(3) + ' GB'); }
};

exports.getFileSize = getFileSize;