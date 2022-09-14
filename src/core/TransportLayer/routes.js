const endpoints = {
    'userLogin': { url: () => `auth/email/login`, method: 'POST' },
    'userRegister': { url: () => `auth/email/register`, method: 'POST' },
    
    'createDialog': { url: () => `chat`, method: 'POST' },
    'getDialogs': { url: ({ limit, offset }) => `chat?limit=${limit}&offset=${offset}`, method: 'GET' },
    'getDialog': { url: ({ hash }) => `chat/${hash}`, method: 'GET' },
    'getDialogMessages': { url: ({ hash, limit = 40, offset = 0 }) => `chat/${hash}?limit=${limit}&offset=${offset}`, method: 'GET' },
    'postDialogMessage': { url: ({ hash }) => `chat/${hash}`, method: 'POST' },
};

export default endpoints;