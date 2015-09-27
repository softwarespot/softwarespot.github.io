// Create an 'App' namespace if it doesn't already exist
var App = App || {};

/**
 * Core module
 *
 * Modified: 2015/09/18
 * @author softwarespot
 */
App.core = (function (window, document, $, undefined) {
    // Constants

    // SemVer version number of the module
    var VERSION = '1.0.0';

    var APP_NAME = 'SoftwareSpot';

    // Unique global identifier. Internal usage only
    // var GUID = 'BF1D7691-79D4-4A89-930B-84C65A309E86';

    // Fields

    // Store if the module has been initialised
    var _isInitialised = false;

    // Return strings of toString() found on the Object prototype
    // Based on the implementation by lodash inc. is* function as well
    var _objectStrings = {
        BOOLEAN: '[object Boolean]',
        DATE: '[object Date]',
        ERROR: '[object Error]',
        FUNCTION: '[object Function]',
        NUMBER: '[object Number]',
        REGEXP: '[object RegExp]',
        STRING: '[object String]'
    };

    // Store the object prototype
    var _objectPrototype = Object.prototype;

    // Store the hasOwnProperty method
    var _objectHasOwnProperty = _objectPrototype.hasOwnProperty;

    // Store the toString method
    var _objectToString = _objectPrototype.toString;

    // Regular expressions
    var _regExp = {
        // Strip EOL characters
        EOL_CHARS: /\r?\n|\r/gm,

        // Float values
        FLOAT: /(?:^-?\d+\.\d+$)/,

        // Integer values
        INTEGER: /(?:^-?\d+$)/
    };

    // Methods

    /**
     * Initialise the module
     *
     * @param {object} config Options to configure the module
     * @return {undefined}
     */
    function init(config) {
        // Default config that can be overwritten by passing through the config variable
        var defaultConfig = {};

        // Combine the passed config
        $.extend(defaultConfig, config);

        // _cacheDom();

        _isInitialised = true;
    }

    /**
     * Destroy the module
     *
     * @return {undefined}
     */
    function destroy() {
        _isInitialised = false;
    }

    /**
     * Get the name of the application name
     *
     * @returns {string} Application name
     */
    function getAppName() {
        return APP_NAME;
    }

    /**
     * Get the version number of the module
     *
     * @returns {number} Version number
     */
    function getVersion() {
        return VERSION;
    }

    /**
     * Check if an object contains a key
     *
     * @param {object} object Object to check
     * @param {string} property Property to check exists in the object
     * @return {boolean} True the property exists; otherwise, false
     */
    function has(object, property) {
        return _objectHasOwnProperty.call(object, property);
    }

    /**
     * Extract the keys of an object to an array
     *
     * @param {object} object Object to extract the keys from
     * @return {array} An array of keys; otherwise, an empty array
     */
    function keys(object) {
        if (!isObject(object)) {
            return [];
        }

        var keysArray = [];
        for (var key in object) {
            if (has(object, key)) {
                keysArray.push(key);
            }
        }

        return keysArray;
    }

    /**
     * Check if a string contains only alphanumeric characters ( 0-9 and A-Z )
     *
     * @param {string} value String to check
     * @return {boolean} True the string contains alphanumeric characters only; otherwise, false
     */
    function isAlNum(value) {
        return isString(value) && /(?:^[0-9A-Za-z]+$)/.test(value);
    }

    /**
     * Check if a string contains only alphabetic characters ( A-Z )
     *
     * @param {string} value String to check
     * @return {boolean} True the string contains alphabetic characters only; otherwise, false
     */
    function isAlpha(value) {
        return isString(value) && /(?:^[A-Za-z]+$)/.test(value);
    }

    /**
     * Check if a variable is an array datatype
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True the value is an array datatype; otherwise, false
     */
    var isArray = Array.isArray;

    /**
     * Check if a string contains ASCII characters only ( 0-127 or 0-255 if extended is set to true )
     *
     * @param {string} value String to check
     * @param {boolean} extended True to use the extended character set i.e. 0-255; otherwise default is false ( 0-127 )
     * @return {boolean} True the string contains ASCII characters only; otherwise, false
     */
    function isASCII(value, extended) {
        if (!isBoolean(extended)) {
            extended = false;
        }

        return isString(value) && (extended ? /(?:^[\x00-\xFF]*$)/ : /(?:^[\x00-\x7F]*$)/).test(value);
    }

    /**
     * Check if a string is base64 encoded
     *
     * @param {string} value String to check
     * @return {boolean} True the value is a base64 encoded string; otherwise, false
     */
    function isBase64(value) {
        // URL: http://stackoverflow.com/a/475217
        return isString(value) && /(?:^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$)/.test(value);
    }

    /**
     * Check if a variable is a boolean datatype
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True the value is a boolean datatype; otherwise, false
     */
    function isBoolean(value) {
        return value === true || value === false || (isObjectLike(value) && _objectToString.call(value) === _objectStrings.BOOLEAN);
    }

    /**
     * Check if currently running inside a browser
     *
     * @return {boolean} True inside a browser; otherwise, false
     */
    function isBrowser() {
        return !!(!isUndefined(window) && !isUndefined(window.navigator) && window.document);
    }

    /**
     * Check if a string is a char
     *
     * @param {string} value String to check
     * @return {boolean} True the string is a char; otherwise, false
     */
    function isChar(value) {
        // Well there is no 'char' datatype is JavaScript, but this is close as it gets
        return isString(value) && value.length === 1;
    }

    /**
     * Check if a variable is a Date object
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True the value is a Date datatype; otherwise, false
     */
    function isDate(value) {
        return isObjectLike(value) && _objectToString.call(value) === _objectStrings.DATE;
    }

    /**
     * Check if a variable is empty
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True the value is empty; otherwise, false
     */
    function isEmpty(value) {
        if (value === null) {
            return true;
        }

        if (isArray(value) || isString(value)) {
            return value.length === 0;
        }

        for (var key in value) {
            if (has(value, key)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Check if a variable is an 'Error', 'EvalError', 'RangeError', 'ReferenceError',
     * 'SyntaxError', 'TypeError', or 'URIError' object
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True the value is a Error object; otherwise, false
     */
    function isError(value) {
        return isObjectLike(value) && typeof value.message === 'string' && _objectToString.call(value) === _objectStrings.ERROR;
    }

    /**
     * Check if a variable is a float datatype
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True the value is a float; otherwise, false
     */
    function isFloat(value) {
        // Coerce as a string
        return isNumber(value) && _regExp.FLOAT.test('' + value);
    }

    /**
     * Check if a variable is a function datatype
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True the value is a function datatype; otherwise, false
     */
    function isFunction(value) {
        return isObject(value) && _objectToString.call(value) === _objectStrings.FUNCTION;
    }

    /**
     * Check if a string is a GUID
     *
     * @param {string} value String to check
     * @return {boolean} True the string is a GUID; otherwise, false
     */
    function isGUID(value) {
        return isString(value) && /(?:^[0-9A-Fa-f]{8}-(?:[0-9A-Fa-f]{4}-){3}[0-9A-Fa-f]{12}$)/.test(value);
    }

    /**
     * Check if a string is hexadecimal
     *
     * @param {string} value String to check
     * @return {boolean} True the string is hexadecimal; otherwise, false
     */
    function isHex(value) {
        return isString(value) && /(?:^0[xX][\dA-Fa-f]+$)/.test(value);
    }

    /**
     * Check if a variable is an integer datatype
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True the value is an integer; otherwise, false
     */
    function isInteger(value) {
        // Coerce as a string
        return isNumber(value) && _regExp.INTEGER.test('' + value);
    }

    /**
     * Check if a value is an instance of jQuery
     *
     * @param {mixed} $value Value to check
     * @return {boolean} true is an instance of jQuery; otherwise, false
     */
    function isjQuery($value) {
        return $value instanceof $;
    }

    /**
     * Check if a value is an instance of jQuery and contains element nodes
     *
     * @param {mixed} $value Value to check
     * @return {boolean} true is an instance of jQuery and contains element nodes; otherwise, false
     */
    function isjQueryNotEmpty($value) {
        return isjQuery($value) && $value.length !== 0;
    }

    /**
     * Check if a variable is null
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True the value is null; otherwise, false
     */
    function isNull(value) {
        return value === null;
    }

    /**
     * Check if a variable is not null
     *
     * @param {mixed} value Value to check
     * @return {boolean} True the value is not null; otherwise, false
     */
    function isNotNull(value) {
        return value !== null;
    }

    /**
     * Check if a variable is null or undefined
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True the value is null or undefined; otherwise, false
     */
    function isNullOrUndefined(value) {
        return isNull(value) || isUndefined(value);
    }

    /**
     * Check if a variable is a number datatype
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True the value is a number datatype; otherwise, false
     */
    function isNumber(value) {
        return typeof value === 'number' || (isObjectLike(value) && _objectToString.call(value) === _objectStrings.NUMBER);
    }

    /**
     * Check if a variable is an object
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True the value is an object; otherwise, false
     */
    function isObject(value) {
        // Store the typeof value
        var type = typeof value;

        // !!value is basically checking if value is not 'truthy' e.g. null or zero and then inverts that boolean value
        // So, !'Some test' is false and then inverting false is true. There if value contains 'something', continue
        return !!value && (type === 'object' || type === 'function');
    }

    /**
     * Check if a variable is an object
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True the value is an object; otherwise, false
     */
    function isObjectLike(value) {
        return !!value && typeof value === 'object';
    }

    /**
     * Check if a variable is a RegExp object
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True the value is a RegExp object; otherwise, false
     */
    function isRegExp(value) {
        return isObject(value) && _objectToString.call(value) === _objectStrings.REGEXP;
    }

    /**
     * Check if a variable is a string datatype
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True the value is a string datatype; otherwise, false
     */
    function isString(value) {
        return typeof value === 'string' || _objectToString.call(value) === _objectStrings.STRING;
    }

    /**
     * Check if a variable is a string and representing a float
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True the value is representing a float; otherwise, false
     */
    function isStringFloat(value) {
        return isString(value) && _regExp.FLOAT.test(value);
    }

    /**
     * Check if a variable is a string and empty or whitespace
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True the value is a string and empty; otherwise, false
     */
    function isStringEmptyOrWhitespace(value) {
        return isString(value) && value.trim().length === 0;
    }

    /**
     * Check if a variable is a string and representing an integer
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True the value is representing an integer; otherwise, false
     */
    function isStringInteger(value) {
        return isString(value) && _regExp.INTEGER.test(value);
    }

    /**
     * Check if a variable is a string and not empty
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True the value is a string and not empty; otherwise, false
     */
    function isStringNotEmpty(value) {
        return isString(value) && value.length !== 0;
    }

    /**
     * Check if a variable is undefined
     *
     * @param {object} value Value to check
     * @returns {boolean} True the value is undefined; otherwise, false
     */
    function isUndefined(value) {
        return value === undefined;
    }

    /**
     * Check if a value is the right file extension
     *
     * @param {string}  value File extension to check
     * @param {string}  extensions Semi-colon separated list e.g. js;html;htm
     * @return {boolean} True the file extension matches; otherwise, false
     */
    function isValidFileExtension(value, extensions) {
        value = escapeRegExChars(value);
        if (isNull(value)) {
            return false;
        }

        // Replace semi-colon(s) (;) with pipe(s) (|)
        extensions = ('' + extensions).replace(';', '|');

        // Coerce value as a string
        return (new RegExp('\.(?:' + extensions + ')$', 'i')).test('' + value);
    }

    /**
     * Check if an object is a window
     *
     * @param  {object} object Object to check
     * @return {boolean} True is a window; otherwise, false
     */
    function isWindow(object) {
        return isObject(object) && object === object.window;
    }

    /**
     * Pad a number with leading zeros
     *
     * @param {number} value Value to pad with leading zeros
     * @param {number} length Minimum length of the value
     * @return {string} Value with padded zero
     */
    function padDigits(value, length) {
        // Coerce as a string
        value = '' + value;

        // Create an array with the length - length of the string + 1 and select the maximum value i.e. if negative zero will be chosen
        return new Array(Math.max(length - value.length + 1, 0)).join('0') + value;
    }

    /**
     * Generate a random number
     *
     * @param {number} min Minimum value
     * @param {number} max Maximum value
     * @return {number} Returns a random number between the minimum and maximum values
     */
    function randomNumber(min, max) {
        // URL: http://www.w3schools.com/jsref/jsref_random.asp
        return Math.floor((Math.random() * max) + min);
    }

    /**
     * Escape RegExp characters with a prefix backslash
     *
     * @param {string} value String to escape
     * @return {mixed} Escaped string; otherwise, null if not a string datatype
     */
    function escapeRegExChars(value) {
        if (!isString(value)) {
            return null;
        }

        // Escape RegExp special characters
        return value.replace('/([\].|*?+(){}^$\\[])/g', '\$1');
    }

    /**
     * Prefix all line-feed characters ( ASCII 10 ) with a carriage return character ( ASCII 13 )
     *
     * @param {string} value Value to replace
     * @return {string} New string with carriage returns added; otherwise, original string
     */
    function stringAddCR(value) {
        // Needs testing due to no negative look-behind
        return isStringNotEmpty(value) ? value.replace(/(?!\r)\n/, '\r\n') : value;
    }

    /**
     * Postfix all carriage return characters ( ASCII 13 ) with a line-feed character ( ASCII 10 )
     *
     * @param {string} value Value to replace
     * @return {string} New string with line-feeds added; otherwise, original string
     */
    function stringAddLF(value) {
        return isStringNotEmpty(value) ? value.replace(/\r(?!\n)/, '\r\n') : value;
    }

    /**
     * String format. Similar to the C# implementation
     * URL: http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format. User: @Filipiz
     *
     * @param {string} value String value to replace
     * @param {...items} items Items to replace the string identifiers with e.g. stringFormat('Some string like {0}', 'this')
     * @return {string} Formatted string, with {n} identifiers replaced with the passed arguments
     */
    function stringFormat(value) {
        // Create a temporary arguments array, skipping the first element, as this contains the value
        var items = [];
        for (var i = 1, length = arguments.length; i < length; i++) {
            // Push is sometimes faster than items[i - 1]
            items.push(arguments[i]);
        }

        // Iterate through the items replacing the identifiers e.g. {n} with the array item that matches the index value
        $.each(items, function (index, item) {
            var regexp = new RegExp('\\{' + index + '\\}', 'gi');
            value = value.replace(regexp, item);
        });

        return value;
    }

    /**
     * Convert a null/undefined string to an empty string
     *
     * @param {string} value Value to convert
     * @return {string} An empty string; otherwise original string
     */
    function stringNullUndefinedToEmpty(value) {
        return isNull(value) || isUndefined(value) ? '' : value;
    }

    /**
     * Repeat a string value
     *
     * @param {string} value String value to repeat
     * @param {number} count Number of times to repeat the string
     * @return {string} Repeated string; otherwise, empty string on error
     */
    function stringRepeat(value, count) {
        return isString(value) ? (new Array(++count)).join(value) : '';
    }

    /**
     * Strip EOL characters ( ASCII 10 and ASCII 13 ) in a string
     *
     * @param {string} value String value to strip the EOL characters
     * @return {string} String stripped of EOL characters; otherwise, the original string
     */
    function stringStripEOL(value) {
        return isString(value) ? value.replace(_regExp.EOL_CHARS, '') : value;
    }

    /**
     * Strip carriage return characters ( ASCII 10 ) in a string
     *
     * @param {string} value String value to strip
     * @return {string} New string of stripped carriage returns; otherwise, the original string
     */
    function stringStripCR(value) {
        return isString(value) ? value.replace(/\r/, '') : value;
    }

    /**
     * Strip line-feed characters ( ASCII 13 ) in a string
     *
     * @param {string} value String value to strip
     * @return {string} New string of stripped line-feeds; otherwise, the original string
     */
    function stringStripLF(value) {
        return isString(value) ? value.replace(/\n/, '') : value;
    }

    /**
     * Initialise all DOM cachable variables
     *
     * @return {undefined}
     */
    // function _cacheDom() {}

    // Invoked when the DOM has loaded
    $(function () {
        destroy();
        init();
    });

    // Public API
    return {
        getAppName: getAppName,
        getVersion: getVersion,
        has: has,
        keys: keys,
        isAlNum: isAlNum,
        isAlpha: isAlpha,
        isArray: isArray,
        isASCII: isASCII,
        isBase64: isBase64,
        isBoolean: isBoolean,
        isBrowser: isBrowser,
        isChar: isChar,
        isDate: isDate,
        isEmpty: isEmpty,
        isError: isError,
        isFloat: isFloat,
        isFunction: isFunction,
        isGUID: isGUID,
        isHex: isHex,
        isInteger: isInteger,
        isjQuery: isjQuery,
        isjQueryNotEmpty: isjQueryNotEmpty,
        isNull: isNull,
        isNotNull: isNotNull,
        isNullOrUndefined: isNullOrUndefined,
        isNumber: isNumber,
        isObject: isObject,
        isRegExp: isRegExp,
        isString: isString,
        isStringEmptyOrWhitespace: isStringEmptyOrWhitespace,
        isStringFloat: isStringFloat,
        isStringInteger: isStringInteger,
        isStringNotEmpty: isStringNotEmpty,
        isUndefined: isUndefined,
        isValidFileExtension: isValidFileExtension,
        isWindow: isWindow,
        padDigits: padDigits,
        randomNumber: randomNumber,
        escapeRegExChars: escapeRegExChars,
        stringAddCR: stringAddCR,
        stringAddLF: stringAddLF,
        stringFormat: stringFormat,
        stringNullUndefinedToEmpty: stringNullUndefinedToEmpty,
        stringRepeat: stringRepeat,
        stringStripCR: stringStripCR,
        stringStripLF: stringStripLF,
        sprintf: stringFormat,
        stringStripEOL: stringStripEOL
    };
})(this, this.document, this.jQuery);

/**
 * Create a namespace. Idea based on the work by Nikolas C. Zakas from Maintainable JavaScript
 *
 * @param {string} namespacePath A namespace comprised of optional parts e.g. App.system.clock
 * @return {object} Context of this, based on the last part in the namespace e.g. this would be equal to the 'clock' object reference
 */
App.namespace = function namespace(namespacePath) {
    var core = App.core;
    var _this = this;

    // Return the context this being the root object, if not a valid string
    if (core.isUndefined(namespacePath) || !core.isString(namespacePath) || core.isStringEmptyOrWhitespace(namespacePath)) {
        return _this;
    }

    var parts = namespacePath.split('.');
    for (var i = 0, length = parts.length; i < length; i++) {
        if (!_this[parts[i]]) {
            _this[parts[i]] = {};
        }
        _this = _this[parts[i]];
    }

    return _this;
};
