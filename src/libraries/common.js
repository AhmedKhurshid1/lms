/** Core dependencies / libraries */
const {
    stdin: standardInput,
    stdout: standardOutput,
} = require('process');


/** Third party dependencies */
const atob = require('atob')
const Blob = require('node-blob');
const { Parser } = require('json2csv');


/**
* Get a promise that resolves after an argument number of milliseconds
* @param {number} t no of milliseconds
* @returns {Promise<number>} Resolves to the milliseconds awaited for.
*/
const promiseTimeout = (t) => new Promise((resolve, reject) => setTimeout(() => {
    resolve(t);
}, t));

/** Get a generator to yeild after a specified time, blocked by an unresolved promise
 * @param {number} val - number of iterations for async generator 
* @param {number} [timeout] - Number in milliseconds to set timer for
* @returns { Promise<number>} Resolves to the milliseconds awaited for.
*/
const getGen = async function* (val, timeout) {
    let i = 0;
    switch (typeof val) {
        case 'object':
            for (k of val) {
                if (timeout) {
                    await this.promiseTimeout(timeout);
                }
                yield k;
            }
            break;
        default:
            while (i < val) {
                if (timeout) {
                    await this.promiseTimeout(timeout);
                }
                yield i++;
            }
            break;
    }
}

/** Get a capitialized string
 * @param {string} text - A string parameter to capitalize
* @returns {string} Returns capitalized word
*/
const capitalize = (text) => {
    return text.substring(0, 1)
        .toUpperCase()
        .concat(text.substring(1))
}

/** Get a Random Integer
 * @param {string} size - A size parameter of random number
* @returns {string} Returns capitalized word
*/
const random = (size) => {
    let text = ''
    const possible = '0123456789'
    for (let i = 0; i < size; i++) { text += getRandomInt(9) }
    // for (let i = 0; i < size; i++) { text += possible.charAt(Math.floor(Math.random() * possible.length)) }
    return text
}

const getRandomInt = (max) => Math.floor(Math.random() * max);

/** Checks if the passed text is infact a stringified JSON Object, returns object if it's JSON
 * @param {string} stringifed - Text assumed to be stringified JSON
* @returns {boolean} Returns an array for affirmation and the object if the text is infact a stringified JSON
*/
const isTextJsonObject = (stringified) => {
    let toReturn = [false, null];

    if (!stringified || stringified === true) return toReturn;

    try {
        const parsed = JSON.parse(stringified);
        toReturn = [true, parsed];
    } catch (exc) { }

    return toReturn;
}

/** Checks if the passed text is infact a stringified JSON Object, returns object if it's JSON
 * @param {string} base64 - image base64
*/
const createFileFromBase64 = (encodedFile) => {
    var base64Image = encodedFile;
    if (encodedFile.includes(',')) {
        base64Image = encodedFile.split(",")[1];
    }
    var binaryImg = atob(base64Image);
    var length = binaryImg.length;
    var ab = new ArrayBuffer(length);
    var ua = new Uint8Array(ab);
    for (var i = 0; i < length; i++) {
        ua[i] = binaryImg.charCodeAt(i);
    }

    var blob = new Blob([ua], {
        type: "image/jpeg"
    });

    return blob.buffer;
}

/**
 *  helper function for converting JSON to CSV
 * @param {values} json obj -  
 */
const getCSVfromJSON = (values) => {
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(values)
    return csv;
}

/**
 * 
 * @param {string} promptQuestion - Question to wait a prompt for 
 * @returns {Promise<string>} Response - Response to a prompt
 */
const readLineAsync = async (promptQuestion) => {
    const readLineInterface = readline.createInterface(
        {
            input: standardInput,
            output: standardOutput,
        });

    let promptPromise = new Promise(
        (resolve, reject) => {
            readLineInterface.question(
                promptQuestion,
                input => {
                    setTimeout(
                        () => readLineInterface.close(),
                        0
                    );

                    resolve(input);
                }
            );
        });

    return promptPromise;
}

module.exports = {
    promiseTimeout,
    getGen,
    capitalize,
    isTextJsonObject,
    random,
    createFileFromBase64,
    getCSVfromJSON,
    readLineAsync,
}