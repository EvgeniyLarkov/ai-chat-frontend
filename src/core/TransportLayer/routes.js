const endpoints = {
    'userLogin': { url: () => `auth/email/login`, method: 'POST' },
    'userRegister': { url: () => `auth/email/register`, method: 'POST' },
    
    'createDialog': { url: () => `chat`, method: 'POST' },
    'getDialogs': { url: ({ limit = 20, offset = 0 }) => `chat?limit=${limit}&offset=${offset}`, method: 'GET' },
    'getDialog': { url: ({ hash }) => `chat/${hash}`, method: 'GET' },
    'getDialogMessages': { url: ({ hash, limit = 50, offset = 0 }) => `chat/${hash}/messages?limit=${limit}&offset=${offset}`, method: 'GET' },
    'postDialogMessage': { url: ({ hash }) => `chat/${hash}`, method: 'POST' },
};

export const wsEndpoints = {
    'sendDialogMessage': { url: () => ``, namespace: 'chat', event: 'message' },
    'getDialogMetadata': { url: () => ``, namespace: 'chat', event: 'dialog-metadata' },
    'userTyping': { url: () => ``, namespace: 'chat', event: 'user-typing' },
}

export default endpoints;