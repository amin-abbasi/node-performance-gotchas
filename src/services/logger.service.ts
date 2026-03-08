import gach from 'gach';

export const logger = {
    info: (message: string) => {
        console.log(gach(message).color('blue').text);
    },
    success: (message: string) => {
        console.log(gach(message).color('green').text);
    },
    warn: (message: string) => {
        console.warn(gach(message).color('yellow').text);
    },
    error: (message: string) => {
        console.error(gach(message).color('red').text);
    },
    highlight: (message: string) => {
        console.log(gach(message).color('cyan').bold().text);
    },
};
