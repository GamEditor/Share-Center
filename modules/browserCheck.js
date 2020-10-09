const isSupportedBrowser = (userAgentHeader) => {
    if (userAgentHeader.match(/Trident.*rv\:11\./) || userAgentHeader.includes('curl') || userAgentHeader.includes('Postman')) {
        return true;
    }
    return false;
};

exports.isSupportedBrowser = isSupportedBrowser;