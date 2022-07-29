export function isSuccessRequest (req) {
    return req?.status >= 200 && req?.status < 300;
}

export function isUnsuccessRequest (req) {
    return !isSuccessRequest(req);
}