// Create an 'App' namespace if it doesn't already exist
var App = App || {};

/**
 * Core module
 *
 * Modified: 2015/10/14
 * @author softwarespot
 */
App.core = (function (window, document, $, undefined) {
    // Constants

    // SemVer version number of the module
    var VERSION = '1.0.0';

    // Application name
    var APP_NAME = 'SoftwareSpot';

    // Unique global identifier. Internal usage only
    // var GUID = 'BF1D7691-79D4-4A89-930B-84C65A309E86';

    // Fields

    // Store if the module has been initialised
    var _isInitialised = false;

    var _numberPrecision = Math.pow(2, 53) - 1;

    // Maximum and minimum integer values that can be stored
    var _number = {
        MAX_SAFE_INTEGER: _numberPrecision, // 9007199254740991 or Number.MAX_SAFE_INTEGER
        MIN_SAFE_INTEGER: -(_numberPrecision) // -9007199254740991 or Number.MIN_SAFE_INTEGER
    };

    // Return strings of toString() found on the Object prototype
    // Based on the implementation by lodash including certain is* function as well
    var _objectStrings = {
        ARGUMENTS: '[object Arguments]',
        ARRAY: '[object Array]',
        BOOLEAN: '[object Boolean]',
        DATE: '[object Date]',
        ERROR: '[object Error]',
        FUNCTION: '[object Function]',
        GENERATOR: '[object GeneratorFunction]',
        MAP: '[object Map]',
        NUMBER: '[object Number]',
        PROMISE: '[object Promise]',
        REGEXP: '[object RegExp]',
        SET: '[object Set]',
        STRING: '[object String]',
        WEAKMAP: '[object WeakMap]',
        WEAKSET: '[object WeakSet]'
    };

    // Store the object prototype
    var _objectPrototype = window.Object.prototype;

    // Store the hasOwnProperty method
    var _objectHasOwnProperty = _objectPrototype.hasOwnProperty;

    // Store the toString method
    var _objectToString = _objectPrototype.toString;

    // Regular expressions
    var _regExp = {
        // Alphanumeric characters
        ALNUM: /(?:^[0-9A-Za-z]+$)/,

        // Alphabet characters
        ALPHA: /(?:^[A-Za-z]+$)/,

        // ASCII characters ( ASCII 0 - 127 )
        ASCII: /(?:^[\x00-\x7F]*$)/,

        // Extended ASCII characters ( ASCII 0 - 255 )
        ASCII_EXTENDED: /(?:^[\x00-\xFF]*$)/,

        // Base64
        BASE_64: /(?:^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$)/,

        // EOL carriage return
        CARRIAGE_RETURN: /\r/,

        // Carriage return append
        CARRIAGE_RETURN_ADD: /(?!\r)\n/,

        // Strip EOL characters
        EOL_CHARS: /\r?\n|\r/gm,

        // Float values
        FLOAT: /(?:^-?\d+\.\d+$)/,

        // Globally unique identifier
        GUID: /(?:^[0-9A-Fa-f]{8}-(?:[0-9A-Fa-f]{4}-){3}[0-9A-Fa-f]{12}$)/,

        // Hex string ( ASCII A-F, a-f, 0-9 )
        HEX: /(?:^0[xX][\dA-Fa-f]+$)/,

        // Integer values
        INTEGER: /(?:^-?\d+$)/,

        // Is representing a boolean datatype
        IS_BOOLEAN: /^(?:(?!0+)[0-9]+|true)$/i,

        // EOL line feed
        LINE_FEED: /\n/,

        // Line feed append
        LINE_FEED_ADD: /\r(?!\n)/,

        // Regular expression meta characters
        REGEXP_ESCAPE: /([\].|*?+(){}^$\\[])/g
    };

    // Methods

    /**
     * Initialise the module
     *
     * @param {object} config Options to configure the module
     * @return {undefined}
     */
    function init( /*config*/ ) {
        // Default config that can be overwritten by passing through the config variable
        // var defaultConfig = {};

        // Combine the passed config
        // $.extend(defaultConfig, config);

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
     * Convert the array-like arguments variable used in a closure to an array
     *
     * @param {arguments} args The array-like arguments value
     * @return {array} An array
     */
    function argumentsToArray(args) {
        var array = [];
        if (isArguments(args)) {
            for (var i = 0, length = args.length; i < length; i++) {
                array.push(args[i]);
            }
        }

        return args;
    }

    /**
     * Clear the contents of an array, but maintain the same reference
     *
     * @param {array} array The array to clear
     * @return {undefined}
     */
    function arrayClear(array) {
        // If not an array then don't continue
        if (!isArray(array)) {
            return;
        }

        // Pop all items on the array until empty
        while (array.length > 0) {
            array.pop();
        }
    }

    /**
     * Look at the last item in the array
     *
     * @param {array} array The array to peek at
     * @return {mixed|undefined} The last item pushed onto the array; otherwise, undefined
     */
    function arrayPeek(array) {
        if (!isArray(array) || array.length === 0) {
            return undefined;
        }

        return array[array.length - 1];
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
        return isString(value) && _regExp.ALNUM.test(value);
    }

    /**
     * Check if a variable is an the array-like arguments object
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True the value is an array-like arguments object; otherwise, false
     */
    function isArguments(value) {
        return _isObjectLike(value) && _objectToString.call(value) === _objectStrings.ARGUMENTS;
    }

    /**
     * Check if a string contains only alphabetic characters ( A-Z )
     *
     * @param {string} value String to check
     * @return {boolean} True the string contains alphabetic characters only; otherwise, false
     */
    function isAlpha(value) {
        return isString(value) && _regExp.ALPHA.test(value);
    }

    /**
     * Check if a variable is a function datatype
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True the value is a function datatype; otherwise, false
     */
    function isFunction(value) {
        var tag = isObject(value) ? _objectToString.call(value) : '';
        return tag === _objectStrings.FUNCTION || tag === _objectStrings.GENERATOR;
    }

    /**
     * Check if a variable is an array datatype
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True the value is an array datatype; otherwise, false
     */
    var isArray = isFunction(window.Array.isArray) ? window.Array.isArray : function isArray(value) {
        return _objectToString.call(value) === _objectStrings.ARRAY;
    };

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

        return isString(value) && (extended ? _regExp.ASCII_EXTENDED : _regExp.ASCII).test(value);
    }

    /**
     * Check if a string is base64 encoded
     *
     * @param {string} value String to check
     * @return {boolean} True the value is a base64 encoded string; otherwise, false
     */
    function isBase64(value) {
        // URL: http://stackoverflow.com/a/475217
        return isString(value) && _regExp.BASE_64.test(value);
    }

    /**
     * Check if a variable is a boolean datatype
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True the value is a boolean datatype; otherwise, false
     */
    function isBoolean(value) {
        return value === true || value === false || (_isObjectLike(value) && _objectToString.call(value) === _objectStrings.BOOLEAN);
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
     * @returns {boolean} True the value is a Date object; otherwise, false
     */
    function isDate(value) {
        return _isObjectLike(value) && _objectToString.call(value) === _objectStrings.DATE;
    }

    /**
     * Check if a variable is defined
     *
     * @param {object} value Value to check
     * @returns {boolean} True the value is defined; otherwise, false
     */
    function isDefined(value) {
        return !isUndefined(value);
    }

    /**
     * Check if a variable is empty
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True the value is empty; otherwise, false
     */
    function isEmpty(value) {
        if (isNullOrUndefined(value) || value === 0) {
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
        return _isObjectLike(value) && isString(value.message) && _objectToString.call(value) === _objectStrings.ERROR;
    }

    /**
     * Check if a variable is a floating point datatype
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True the value is a floating point; otherwise, false
     */
    function isFloat(value) {
        // Coerce as a string
        return isNumber(value) && _regExp.FLOAT.test('' + value);
    }

    /**
     * Check if a string is a GUID
     *
     * @param {string} value String to check
     * @return {boolean} True the string is a GUID; otherwise, false
     */
    function isGUID(value) {
        return isString(value) && _regExp.GUID.test(value);
    }

    /**
     * Check if a string is hexadecimal
     *
     * @param {string} value String to check
     * @return {boolean} True the string is hexadecimal; otherwise, false
     */
    function isHex(value) {
        return isString(value) && _regExp.HEX.test(value);
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
     * Check if a variable is a Map object
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True the value is a Map object; otherwise, false
     */
    function isMap(value) {
        return _objectToString.call(value) === _objectStrings.MAP;
    }

    /**
     * Check if a variable is not null
     *
     * @param {mixed} value Value to check
     * @return {boolean} True the value is not null; otherwise, false
     */
    function isNotNull(value) {
        return !isNull(value);
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
        return typeof value === 'number' || (_isObjectLike(value) && _objectToString.call(value) === _objectStrings.NUMBER);
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
    function _isObjectLike(value) {
        return !!value && typeof value === 'object';
    }

    /**
     * Check if a variable is an object literal
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True the value is an object literal; otherwise, false
     */
    function isObjectLiteral(value) {
        if (!_isObjectLike(value)) {
            return false;
        }

        // Based on the idea by jQuery
        if (value.constructor && !has(value.constructor.prototype, 'isPrototypeOf')) {
            return false;
        }

        return true;
    }

    /**
     * Check is an integer is even
     *
     * @param {number} value Value to check
     * @return {boolean} True the integer is even; otherwise, false
     */
    function isEven(value) {
        return isInteger(value) && value % 2 === 0;
    }

    /**
     * Check is an integer is odd
     *
     * @param {number} value Value to check
     * @return {boolean} True the integer is odd; otherwise, false
     */
    function isOdd(value) {
        return isInteger(value) && value % 2 !== 0;
    }

    /**
     * Check if a promise
     *
     * @param {promise} value Value to check
     * @return {boolean} True the value is a promise; otherwise, false
     */
    function isPromise(value) {
        return _objectToString.call(value) === _objectStrings.PROMISE;
    }

    /**
     * Check if a variable is a RegExp object
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True the value is a RegExp object; otherwise, false
     */
    function isRegExp(value) {
        return _objectToString.call(value) === _objectStrings.REGEXP;
    }

    /**
     * Check if an integer is a safe integer
     * @param {number} value Value to check
     * @return {boolean} True the value is a safe integer; otherwise, false
     */
    var isSafeInteger = isFunction(window.Number.isSafeInteger) ? window.Number.isSafeInteger : function isSafeInteger(value) {
        return isInteger(value) && value >= _number.MIN_SAFE_INTEGER && value <= _number.MAX_SAFE_INTEGER;
    };

    /**
     * Check if a variable is a Set object
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True the value is a Set object; otherwise, false
     */
    function isSet(value) {
        return _objectToString.call(value) === _objectStrings.SET;
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
     * Check if a variable is a string and representing a floating point
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True the value is representing a floating point; otherwise, false
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
     * Check if a variable is a string and representing a number
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True the value is representing a number; otherwise, false
     */
    function isStringNumber(value) {
        return isString(value) && (_regExp.FLOAT.test(value) || _regExp.INTEGER.test(value));
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
        return (new window.RegExp('\.(?:' + extensions + ')$', 'i')).test('' + value);
    }

    /**
     * Check if a variable is a WeakMap object
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True the value is a WeakMap object; otherwise, false
     */
    function isWeakMap(value) {
        return _objectToString.call(value) === _objectStrings.WEAKMAP;
    }

    /**
     * Check if a variable is a WeakSet object
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True the value is a WeakSet object; otherwise, false
     */
    function isWeakSet(value) {
        return _objectToString.call(value) === _objectStrings.WEAKSET;
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
     * Gets the current Unix epoch, which is the number of milliseconds that have elapse since 1 January 1970 00:00:00 UTC
     *
     * @return {number} Current Unix epoch
     */
    function now() {
        // Could use Date.now()
        return new window.Date().getTime();
    }

    /**
     * Pad a number with leading zeros
     *
     * @param {number} value Value to pad with leading zeros
     * @param {number} length Minimum length of the value
     * @return {string} Value with padded zeroes
     */
    function padDigits(value, length) {
        // Coerce as a string
        value = '' + value;

        if (!isInteger(length) || length <= 0) {
            return value;
        }

        // Create an array with the length - length of the string + 1 and select the maximum value i.e. if negative zero will be chosen
        return new window.Array(window.Math.max(length - value.length + 1, 0)).join('0') + value;
    }

    /**
     * Generate a random number
     *
     * @param {number} min Minimum value
     * @param {number} max Maximum value
     * @return {number} Returns a random number between the minimum and maximum values
     */
    function randomNumber(min, max) {
        if (!isNumber(min) || !isNumber(max)) {
            return 0;
        }

        // URL: http://www.w3schools.com/jsref/jsref_random.asp
        return window.Math.floor((window.Math.random() * max) + min);
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
        return value.replace(_regExp.REGEXP_ESCAPE, '\$1');
    }

    /**
     * Prefix all line-feed characters ( ASCII 10 ) with a carriage return character ( ASCII 13 )
     *
     * @param {string} value Value to replace
     * @return {string} New string with carriage returns added; otherwise, original string
     */
    function stringAddCR(value) {
        // Needs testing due to no negative look-behind
        return isStringNotEmpty(value) ? value.replace(_regExp.CARRIAGE_RETURN_ADD, '\r\n') : value;
    }

    /**
     * Postfix all carriage return characters ( ASCII 13 ) with a line-feed character ( ASCII 10 )
     *
     * @param {string} value Value to replace
     * @return {string} New string with line-feeds added; otherwise, original string
     */
    function stringAddLF(value) {
        return isStringNotEmpty(value) ? value.replace(_regExp.LINE_FEED_ADD, '\r\n') : value;
    }

    /**
     * Check if a string contains another string
     *
     * @param {string} value Value to search in
     * @param {string} searchFor Value to search for
     * @return {boolean} True the string is found; otherwise, false
     */
    function stringContains(value, searchFor) {
        if (!isString(value)) {
            return false;
        }

        return isFunction(window.String.prototype.includes) ? value.includes(searchFor) : value.indexOf(searchFor) !== -1;
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
        items.forEach(function forEachFormat(element, index) {
            var regExp = new window.RegExp('\\{' + index + '\\}', 'gi');
            value = value.replace(regExp, element);
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
        if (!isString(value)) {
            return '';
        }

        return isFunction(window.String.prototype.repeat) ? value.repeat(count) : (new window.Array(++count)).join(value);
    }

    /**
     * Check if a string ends with a certain string
     *
     * @param {string} value Value to check
     * @param {string} searchFor Value to search for
     * @param {number} position Position to start searching. Default is start at the end of the string
     * @return {boolean} True the string ends with a certain string; otherwise, false
     */
    function stringEndsWith(value, searchFor, position) {
        if (!isString(value)) {
            return false;
        }

        if (!isNumber(position) || position > value.length) {
            position = value.length;
        }

        position -= searchFor.length;

        if (isFunction(window.String.prototype.endsWith)) {
            return value.endsWith(searchFor, position);
        }

        // Idea by MDN, URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith
        var lastIndex = value.indexOf(searchFor, position);
        return lastIndex !== -1 && lastIndex === position;
    }

    /**
     * Check if a string starts with a certain string
     *
     * @param {string} value Value to check
     * @param {string} searchFor Value to search for
     * @param {number} position Position to start searching. Default is start at the beginning of the string
     * @return {boolean} True the string starts with a certain string; otherwise, false
     */
    function stringStartsWith(value, searchFor, position) {
        if (!isString(value)) {
            return false;
        }

        if (!isNumber(position)) {
            position = 0;
        }

        // Idea by MDN, URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith
        return isFunction(window.String.prototype.startsWith) ? value.startsWith(searchFor, position) : value.indexOf(searchFor, position) === position;
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
        return isString(value) ? value.replace(_regExp.CARRIAGE_RETURN, '') : value;
    }

    /**
     * Strip line-feed characters ( ASCII 13 ) in a string
     *
     * @param {string} value String value to strip
     * @return {string} New string of stripped line-feeds; otherwise, the original string
     */
    function stringStripLF(value) {
        return isString(value) ? value.replace(_regExp.LINE_FEED, '') : value;
    }

    /**
     * Convert a string to a boolean datatype i.e. non-zero and 'true' (case-insensitive) are true; otherwise, false
     *
     * @param {string} value String value
     * @return {boolean} True; otherwise, false
     */
    function stringToBoolean(value) {
        return _regExp.IS_BOOLEAN.test(value);
    }

    /**
     * Convert a string to a UTF-16 char array
     *
     * @param {string} value String value
     * @return {array} UTF-16 char array; otherwise, an empty array
     */
    function stringToCharArray(value) {
        if (!isString(value) || value.length === 0) {
            return [];
        }

        // Split to a string array and map each character to the char code
        return value.split('').map(function mapCharArray(char) {
            return char.charCodeAt();
        });
    }

    /**
     * Trim a number of characters left of a string
     *
     * @param {string} value String value to trim
     * @param {number} count Number of characters to trim from the left
     * @return {string} Trimmed string; otherwise, an empty string
     */
    function stringTrimLeft(value, count) {
        return isString(value) && isInteger(count) && count > 0 && count < value.length ? value.substr(count) : '';
    }

    /**
     * Trim a number of characters right of a string
     *
     * @param {string} value String value to trim
     * @param {number} count Number of characters to trim from the right
     * @return {string} Trimmed string; otherwise, an empty string
     */
    function stringTrimRight(value, count) {
        return isString(value) && isInteger(count) && count > 0 && count < value.length ? value.substr(0, value.length - count) : '';
    }

    /**
     * Convert the first character of a string to upper-case
     *
     * @param {string} value String value to change
     * @return {string} First character of the string changed to upper-case; otherwise, an empty string
     */
    function stringUCFirst(value) {
        if (!isString(value)) {
            return '';
        }

        return (value[0].toUpperCase()) + value.substr(1);
    }

    /**
     * Convert a value to a string. Null or undefined are an empty string
     * @param {mixed} value Value to convert
     * @return {string} New string value
     */
    function toString(value) {
        if (isString(value)) {
            return value;
        }

        return isNullOrUndefined(value) ? '' : ('' + value);
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
        escapeRegExChars: escapeRegExChars,
        functionExists: isFunction,
        argumentsToArray: argumentsToArray,
        arrayClear: arrayClear,
        arrayPeek: arrayPeek,
        has: has,
        isAlNum: isAlNum,
        isAlpha: isAlpha,
        isArguments: isArguments,
        isArray: isArray,
        isASCII: isASCII,
        isBase64: isBase64,
        isBoolean: isBoolean,
        isBrowser: isBrowser,
        isChar: isChar,
        isDate: isDate,
        isDefined: isDefined,
        isEmpty: isEmpty,
        isError: isError,
        isEven: isEven,
        isFloat: isFloat,
        isFunction: isFunction,
        isGUID: isGUID,
        isHex: isHex,
        isInteger: isInteger,
        isjQuery: isjQuery,
        isjQueryNotEmpty: isjQueryNotEmpty,
        isMap: isMap,
        isNotNull: isNotNull,
        isNull: isNull,
        isNullOrUndefined: isNullOrUndefined,
        isNumber: isNumber,
        isObject: isObject,
        isObjectLiteral: isObjectLiteral,
        isOdd: isOdd,
        isPromise: isPromise,
        isRegExp: isRegExp,
        isSafeInteger: isSafeInteger,
        isSet: isSet,
        isString: isString,
        isStringEmptyOrWhitespace: isStringEmptyOrWhitespace,
        isStringFloat: isStringFloat,
        isStringInteger: isStringInteger,
        isStringNotEmpty: isStringNotEmpty,
        isStringNumber: isStringNumber,
        isUndefined: isUndefined,
        isValidFileExtension: isValidFileExtension,
        isWeakMap: isWeakMap,
        isWeakSet: isWeakSet,
        isWindow: isWindow,
        keys: keys,
        now: now,
        padDigits: padDigits,
        randomNumber: randomNumber,
        sprintf: stringFormat,
        stringAddCR: stringAddCR,
        stringAddLF: stringAddLF,
        stringToBoolean: stringToBoolean,
        stringToCharArray: stringToCharArray,
        stringContains: stringContains,
        stringEndsWith: stringEndsWith,
        stringFormat: stringFormat,
        stringNullUndefinedToEmpty: stringNullUndefinedToEmpty,
        stringRepeat: stringRepeat,
        stringStartsWith: stringStartsWith,
        stringStripCR: stringStripCR,
        stringStripEOL: stringStripEOL,
        stringStripLF: stringStripLF,
        stringTrimLeft: stringTrimLeft,
        stringTrimRight: stringTrimRight,
        stringUCFirst: stringUCFirst,
        toString: toString
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
    if (!core.isString(namespacePath) || core.isStringEmptyOrWhitespace(namespacePath)) {
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
