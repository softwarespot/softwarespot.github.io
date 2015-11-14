// Create an 'App' namespace if it doesn't already exist
var App = App || {};

/**
 * Core module
 *
 * Modified: 2015/11/05
 * @author softwarespot
 */
App.core = (function coreModule(window, document, $, undefined) {
    // Constants

    // SemVer version number of the module
    var VERSION = '1.0.0';

    // Application name
    var APP_NAME = 'SoftwareSpot';

    // Unique global identifier. Internal usage only
    // var GUID = 'BF1D7691-79D4-4A89-930B-84C65A309E86';

    // Milliseconds in a second
    var MILLISECONDS_IN_A_SECOND = 1000;

    // Store an empty string
    var STRING_EMPTY = '';

    // Fields

    // Store if the module has been initialised
    var _isInitialised = false;

    // Escaped characters and their HTML entity equivalents
    var _htmlEscapeChars = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        '\'': '&#39;',
        '`': '&#96;',

        // '¢': '&cent;',
        // '£': '&pound;',
        // '¥': '&yen;',
        // '€': '&euro;',
        // '©': '&copy;',
        // '®': '&reg;',
    };

    // Programatically calculate the maximum possible number
    var _numberPrecision = window.Math.pow(2, 53) - 1;

    // Maximum and minimum integer values that can be stored
    var _number = {
        INFINITY: 1 / 0,
        MAX_SAFE_INTEGER: _numberPrecision, // 9007199254740991 or Number.MAX_SAFE_INTEGER
        MIN_SAFE_INTEGER: -(_numberPrecision), // -9007199254740991 or Number.MIN_SAFE_INTEGER
        NAN: 0 / 0,
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
        WEAKSET: '[object WeakSet]',
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

        // Empty string
        EMPTY: /(?:^\s*$)/,

        // Strip EOL characters
        EOL_CHARS: /\r?\n|\r/gm,

        // Float values
        FLOAT: /(?:^(?!-?0+)-?\d+\.\d+$)/,

        // Globally unique identifier
        GUID: /(?:^[0-9A-Fa-f]{8}-(?:[0-9A-Fa-f]{4}-){3}[0-9A-Fa-f]{12}$)/,

        // Hex string ( ASCII A-F, a-f, 0-9 )
        HEX: /(?:^0[xX][\dA-Fa-f]+$)/,

        // Escape HTML characters
        HTML_ESCAPE: new window.RegExp('([' + keys(_htmlEscapeChars).join(STRING_EMPTY) + '])', 'g'),

        // Integer values
        INTEGER: /(?:^(?!-?0+)-?\d+$)/,

        // Is representing a boolean datatype
        IS_BOOLEAN: /(?:^false|true$)/i,

        // Is representing a boolean datatype of true
        IS_BOOLEAN_TRUE: /(?:^(?:[-+]?(?!0+)[0-9]+|true)$)/i,

        // EOL line feed
        LINE_FEED: /\n/,

        // Line feed append
        LINE_FEED_ADD: /\r(?!\n)/,

        // Regular expression meta characters
        REGEXP_ESCAPE: /([\].|*?+(){}^$\\:=[])/g,

        // Parse item between {} that are an integer
        STRING_FORMAT: /(?:{(\d+)})/g,

        // Parse items between {} e.g. {username}
        SUPPLANT: /(?:{([^{}]*)})/g,

        // Strip leading and trailing whitespace. Idea by MDN, URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
        TRIM: /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
    };

    // Methods

    /**
     * Initialise the module
     *
     * @param {object} config Options to configure the module
     * @return {undefined}
     */
    function init(/*config*/) {
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
     * Convert the array-like arguments object variable used in a closure to an array
     *
     * @param {arguments} args The array-like arguments object
     * @param {number} start Start position of the array. If undefined or invalid, the default is zero
     * @return {array} An array of arguments (not array-like); otherwise, an empty array
     */
    function argumentsToArray(args, start) {
        var array = [];

        if (isArguments(args)) {
            var length = args.length;

            // Set the start position of the array to zero if an invalid integer or start position
            if (!isInteger(start) || start < 0 || start >= length) {
                start = 0;
            }

            for (var i = start; i < length; i++) {
                array.push(args[i]);
            }
        }

        return array;
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

        var length = array.length;
        if (length > 0) {
            array.splice(0, length);
        }
    }

    /**
     * Peek at the last item in the array
     *
     * @param {array} array The array to peek at
     * @return {mixed|undefined} The last item pushed onto the array; otherwise, undefined
     */
    function arrayPeek(array) {
        if (!isArray(array) || array.length === 0) {
            return;
        }

        var length = array.length;
        if (length > 0) {
            return array[length - 1];
        }
    }

    /**
     * Escape RegExp characters with a prefixed backslash
     *
     * @param {string} value String value to escape
     * @return {string} Escaped string; otherwise, an empty string
     */
    function escapeRegExChars(value) {
        if (!isString(value) || value.length === 0) {
            return STRING_EMPTY;
        }

        // Escape RegExp special characters only
        return value.replace(_regExp.REGEXP_ESCAPE, '\\$1');
    }

    /**
     * Check if an object contains a key
     *
     * @param {object} object Object to check
     * @param {string} property Property to check exists in the object
     * @return {boolean} True, the property exists; otherwise, false
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

        if (isFunction(window.Object.keys)) {
            return window.Object.keys(object);
        }

        var array = [];

        for (var key in object) {
            if (has(object, key)) {
                array.push(key);
            }
        }

        return array;
    }

    /**
     * Check if a string contains only alphanumeric characters ( 0-9 and A-Z )
     *
     * @param {string} value String value to check
     * @return {boolean} True, the string contains alphanumeric characters only; otherwise, false
     */
    function isAlNum(value) {
        return isString(value) && _regExp.ALNUM.test(value);
    }

    /**
     * Check if a variable is an the array-like arguments object
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is an array-like arguments object; otherwise, false
     */
    function isArguments(value) {
        return _objectToString.call(value) === _objectStrings.ARGUMENTS;
    }

    /**
     * Check if a string contains only alphabetic characters ( A-Z )
     *
     * @param {string} value String value to check
     * @return {boolean} True, the string contains alphabetic characters only; otherwise, false
     */
    function isAlpha(value) {
        return isString(value) && _regExp.ALPHA.test(value);
    }

    /**
     * Check if a variable is a function datatype
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is a function datatype; otherwise, false
     */
    function isFunction(value) {
        var tag = isObject(value) ? _objectToString.call(value) : null;
        return tag === _objectStrings.FUNCTION || tag === _objectStrings.GENERATOR;
    }

    /**
     * Check if a variable is an array datatype
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is an array datatype; otherwise, false
     */
    var isArray = isFunction(window.Array.isArray) ? window.Array.isArray : function isArray(value) {
        return _objectToString.call(value) === _objectStrings.ARRAY;
    };

    /**
     * Check if a string contains ASCII characters only ( 0-127 or 0-255 if the extended argument is set to true )
     *
     * @param {string} value String value to check
     * @param {boolean} extended True to use the extended character set (0-255); otherwise default is false ( 0-127 )
     * @return {boolean} True, the string contains ASCII characters only; otherwise, false
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
     * @param {string} value String value to check
     * @return {boolean} True, the value is a base64 encoded string; otherwise, false
     */
    function isBase64(value) {
        // URL: http://stackoverflow.com/a/475217
        return isString(value) && _regExp.BASE_64.test(value);
    }

    /**
     * Check if a variable is a boolean datatype
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is a boolean datatype; otherwise, false
     */
    function isBoolean(value) {
        return value === true || value === false || _objectToString.call(value) === _objectStrings.BOOLEAN;
    }

    /**
     * Check if currently running inside a browser
     *
     * @return {boolean} True, inside a browser; otherwise, false
     */
    function isBrowser() {
        return !!(!isUndefined(window) && !isUndefined(window.navigator) && window.document);
    }

    /**
     * Check if a string is a char
     *
     * @param {string} value String value to check
     * @return {boolean} True, the string is a char; otherwise, false
     */
    function isChar(value) {
        // Well there is no 'char' datatype in JavaScript, but this is close as it gets
        return isString(value) && value.length === 1;
    }

    /**
     * Check if a variable is a Date object
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is a Date object; otherwise, false
     */
    function isDate(value) {
        return _objectToString.call(value) === _objectStrings.DATE;
    }

    /**
     * Check if a variable is defined
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is defined; otherwise, false
     */
    function isDefined(value) {
        return value !== undefined;
    }

    /**
     * Check if a variable is empty
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is empty; otherwise, false
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
     * @returns {boolean} True, the value is a Error object; otherwise, false
     */
    function isError(value) {
        return _objectToString.call(value) === _objectStrings.ERROR && isString(value.message);
    }

    /**
     * Check if a variable is a floating point datatype
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is a floating point; otherwise, false
     */
    function isFloat(value) {
        return isNumber(value) && _regExp.FLOAT.test(toString(value));
    }

    /**
     * Check if a variable is a generator function
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is a generator; otherwise, false
     */
    function isGenerator(value) {
        return _objectToString.call(value) === _objectStrings.GENERATOR;
    }

    /**
     * Check if a string is a GUID
     *
     * @param {string} value String value to check
     * @return {boolean} True, the string is a GUID; otherwise, false
     */
    function isGUID(value) {
        return isString(value) && _regExp.GUID.test(value);
    }

    /**
     * Check if a string is hexadecimal
     *
     * @param {string} value String value to check
     * @return {boolean} True, the string is hexadecimal; otherwise, false
     */
    function isHex(value) {
        return isString(value) && _regExp.HEX.test(value);
    }

    /**
     * Check if a variable is an integer datatype
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is an integer; otherwise, false
     */
    function isInteger(value) {
        return isNumber(value) && _regExp.INTEGER.test(toString(value));
    }

    /**
     * Check if a variable is an instance of jQuery
     *
     * @param {mixed} $element Element to check
     * @return {boolean} True is an instance of jQuery; otherwise, false
     */
    function isjQuery($element) {
        return $element instanceof $;
    }

    /**
     * Check if a variable is an instance of jQuery and contains at least one element node
     *
     * @param {mixed} $element Element to check
     * @return {boolean} True is an instance of jQuery and contains at least one element node; otherwise, false
     */
    function isjQueryNotEmpty($element) {
        return isjQuery($element) && $element.length > 0;
    }

    /**
     * Check if a variable is a Map object
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is a Map object; otherwise, false
     */
    function isMap(value) {
        return _objectToString.call(value) === _objectStrings.MAP;
    }

    /**
     * Check if a variable is not null
     *
     * @param {mixed} value Value to check
     * @return {boolean} True, the value is not null; otherwise, false
     */
    function isNotNull(value) {
        return value !== null;
    }

    /**
     * Check if a variable is null
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is null; otherwise, false
     */
    function isNull(value) {
        return value === null;
    }

    /**
     * Check if a variable is null or undefined
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is null or undefined; otherwise, false
     */
    function isNullOrUndefined(value) {
        return isNull(value) || isUndefined(value);
    }

    /**
     * Check if a variable is a number datatype
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is a number datatype; otherwise, false
     */
    function isNumber(value) {
        return typeof value === 'number' || _objectToString.call(value) === _objectStrings.NUMBER;
    }

    /**
     * Check if a variable is an object
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is an object; otherwise, false
     */
    function isObject(value) {
        // Store the typeof value
        var type = typeof value;

        // !!value is basically checking if value is not 'truthy' e.g. null or zero and then inverts that boolean value
        // So, !'Some test' is false and then inverting false is true. There if value contains 'something', continue
        return !!value && (type === 'object' || type === 'function');
    }

    /**
     * Check if a variable is an object literal
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is an object literal; otherwise, false
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
     * @return {boolean} True, the integer is even; otherwise, false
     */
    function isEven(value) {
        return isInteger(value) && value % 2 === 0;
    }

    /**
     * Check is an integer is odd
     *
     * @param {number} value Value to check
     * @return {boolean} True, the integer is odd; otherwise, false
     */
    function isOdd(value) {
        return isInteger(value) && value % 2 !== 0;
    }

    /**
     * Check if a variable is a Promise object
     *
     * @param {promise} value Value to check
     * @return {boolean} True, the value is a Promise object; otherwise, false
     */
    function isPromise(value) {
        return _objectToString.call(value) === _objectStrings.PROMISE;
    }

    /**
     * Check if a variable is a RegExp object
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is a RegExp object; otherwise, false
     */
    function isRegExp(value) {
        return _objectToString.call(value) === _objectStrings.REGEXP;
    }

    /**
     * Check if an integer is a safe integer
     *
     * @param {number} value Value to check
     * @return {boolean} True, the value is a safe integer; otherwise, false
     */
    var isSafeInteger = isFunction(window.Number.isSafeInteger) ? window.Number.isSafeInteger : function isSafeInteger(value) {
        return isInteger(value) && value >= _number.MIN_SAFE_INTEGER && value <= _number.MAX_SAFE_INTEGER;
    };

    /**
     * Check if a variable is a Set object
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is a Set object; otherwise, false
     */
    function isSet(value) {
        return _objectToString.call(value) === _objectStrings.SET;
    }

    /**
     * Check if a variable is a string datatype
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is a string datatype; otherwise, false
     */
    function isString(value) {
        return typeof value === 'string' || _objectToString.call(value) === _objectStrings.STRING;
    }

    /**
     * Check if a variable is a string and empty or whitespace
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is a string and empty; otherwise, false
     */
    function isStringEmptyOrWhitespace(value) {
        return isString(value) && (value.length === 0 || _regExp.EMPTY.test(value));
    }

    /**
     * Check if a variable is a string and representing a boolean (case-insensitive)
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is representing a boolean; otherwise, false
     */
    function isStringBoolean(value) {
        return isString(value) && _regExp.BOOLEAN.test(value);
    }

    /**
     * Check if a variable is a string and representing a floating point
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is representing a floating point; otherwise, false
     */
    function isStringFloat(value) {
        return isString(value) && _regExp.FLOAT.test(value);
    }

    /**
     * Check if a variable is a string and representing an integer
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is representing an integer; otherwise, false
     */
    function isStringInteger(value) {
        return isString(value) && _regExp.INTEGER.test(value);
    }

    /**
     * Check if a variable is a string and not empty
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is a string and not empty; otherwise, false
     */
    function isStringNotEmpty(value) {
        return !isStringEmptyOrWhitespace(value);
    }

    /**
     * Check if a variable is a string and representing a number
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is representing a number; otherwise, false
     */
    function isStringNumber(value) {
        return isString(value) && (_regExp.FLOAT.test(value) || _regExp.INTEGER.test(value));
    }

    /**
     * Check if a variable is undefined
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is undefined; otherwise, false
     */
    function isUndefined(value) {
        return value === undefined;
    }

    /**
     * Check if the global variable 'undefined' has been set to a value other than 'undefined'
     *
     * @returns {boolean} True, the global variable has been set; otherwise, false
     */
    function isUndefinedAssigned() {
        try {
            // Store the original value of undefined
            var original = window.undefined;

            // Set the value of undefined
            window.undefined = 12345;

            // Check the type is undefined
            var result = isUndefined(window.undefined);

            // Revert back to the original value
            window.undefined = original;

            return result;
        } catch (e) {
            return false;
        }
    }

    /**
     * Check if a value is the right file extension
     *
     * @param {string} value File extension to check
     * @param {string} extensions Semi-colon separated list e.g. js;html;htm
     * @return {boolean} True, the file extension matches; otherwise, false
     */
    function isValidFileExtension(value, extensions) {
        if (isNullOrUndefined(value)) {
            return false;
        }

        value = escapeRegExChars(value);

        // Replace semi-colon(s) (;) with pipe(s) (|)
        extensions = toString(extensions).replace(';', '|');

        return (new window.RegExp('(?:\.(?:' + extensions + ')$)', 'i')).test(value);
    }

    /**
     * Check if a variable is a WeakMap object
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is a WeakMap object; otherwise, false
     */
    function isWeakMap(value) {
        return _objectToString.call(value) === _objectStrings.WEAKMAP;
    }

    /**
     * Check if a variable is a WeakSet object
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is a WeakSet object; otherwise, false
     */
    function isWeakSet(value) {
        return _objectToString.call(value) === _objectStrings.WEAKSET;
    }

    /**
     * Check if an object is a window
     *
     * @param {object} object Object to check
     * @return {boolean} True, is a window; otherwise, false
     */
    function isWindow(object) {
        return isObject(object) && object === object.window;
    }

    /**
     * Empty function declaration
     *
     * @return {undefined}
     */
    function noop() {
        // Empty
    }

    /**
     * Gets the current Unix epoch, which is the number of seconds that have elapsed since 1 January 1970 00:00:00 UTC
     *
     * @return {number} Current Unix epoch
     */
    function now() {
        var timstamp = isFunction(window.Date.now) ? window.Date.now() : new window.Date().getTime();

        return timstamp / MILLISECONDS_IN_A_SECOND;
    }

    /**
     * Call a function after a timed delay
     *
     * @param {function} fn Function to call after a timed delay
     * @param {function} delay Delay before calling the function. If not a number then defaults to zero
     * @param {object|undefined} context Current context. If undefined then 'this' is used
     * @return {undefined}
     */
    function debounce(fn, delay, context) {
        // Cache the timer handle
        var timer = null;

        delay = isNumber(delay) ? delay : 0;

        return function debounceApply() {
            if (!isFunction(fn)) {
                return;
            }

            if (!isNull(timer)) {
                window.clearTimeout(timer);
            }

            // Cache the arguments object-like array
            var args = arguments;

            // If the context is undefined then use 'this'
            context = context || this;

            timer = window.setTimeout(function setTimeout() {
                fn.apply(_this, args);
            }, delay);
        };
    }

    // https://remysharp.com/2010/07/21/throttling-function-calls

    /**
     * Call a function only once
     * Idea by David Walsh, URL: https://davidwalsh.name/essential-javascript-functions
     *
     * @param {function} fn Function to call only once
     * @param {object|undefined} context Current context. If undefined then 'this' is used
     * @return {mixed} Return value of the fn argument. If once is called more than once, then the cached result is returned
     */
    function once(fn, context) {
        // Cache the fn result, as the fn will be destroyed when called once
        var result;

        return function onceApply() {
            if (isFunction(fn)) {
                // If the context is undefined then use 'this'
                context = context || this;
                result = fn.apply(context, arguments);

                // Destroy the fn reference
                fn = null;
            }

            return result;
        };
    }

    /**
     * Pad a number with leading zeros
     *
     * @param {number} value Value to pad with leading zeros
     * @param {number} length Minimum length of the value
     * @return {string} Value with padded zeroes
     */
    function padDigits(value, length) {
        return stringPad(value, '0', window.Math.abs(length));
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
     * Prefix all line-feed characters ( ASCII 10 ) with a carriage return character ( ASCII 13 )
     *
     * @param {string} value String value to replace
     * @return {string} New string with carriage returns added; otherwise, an empty string
     */
    function stringAddCR(value) {
        return isStringNotEmpty(value) ? value.replace(_regExp.CARRIAGE_RETURN_ADD, '\r\n') : STRING_EMPTY;
    }

    /**
     * Postfix all carriage return characters ( ASCII 13 ) with a line-feed character ( ASCII 10 )
     *
     * @param {string} value String value to replace
     * @return {string} New string with line-feeds added; otherwise, an empty string
     */
    function stringAddLF(value) {
        return isStringNotEmpty(value) ? value.replace(_regExp.LINE_FEED_ADD, '\r\n') : STRING_EMPTY;
    }

    /**
     * Check if a string contains another string
     *
     * @param {string} value String value to search in
     * @param {string} searchFor Value to search for
     * @return {boolean} True, the string is found; otherwise, false
     */
    function stringContains(value, searchFor) {
        value = toString(value);

        return isFunction(window.String.prototype.includes) ?
            window.String.prototype.includes.call(value, searchFor) :
            value.indexOf(searchFor) !== -1;
    }

    /**
     * Escape HTML special characters with their entity equivalents
     * Idea by underscore.string, URL: https://github.com/epeli/underscore.string
     *
     * @param {string} value String value to escape
     * @return {string} Escaped string; otherwise, empty string
     */
    function stringEscapeHTML(value) {
        value = toString(value);

        return value && _regExp.HTML_ESCAPE.test(value) ? value.replace(_regExp.HTML_ESCAPE, _htmlEscapeChar) : value;
    }

    /**
     * String format. Similar to the C# implementation
     * Idea from StackOverflow, URL: http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format. User: @Filipiz
     *
     * @param {string} value String value to format
     * @param {arguments} arguments Arguments to replace the string identifiers with e.g. stringFormat('Some string like {0}', 'this')
     * @return {string} Formatted string, with {n} identifiers replaced with the passed arguments
     */
    function stringFormat(value) {
        // Coerce as a string and check if a valid length
        value = toString(value);
        if (value.length === 0) {
            return value;
        }

        // Convert the arguments array-like object to an array
        var args = argumentsToArray(arguments, 1);

        return value.replace(_regExp.STRING_FORMAT, function stringFormatKeys(fullMatch, index) {
            // Coerce as a number and get the value at the index position in the arguments array
            var value = args[+index];

            return isUndefined(value) ? fullMatch : value;
        });
    }

    /**
     * Convert a null/undefined string to an empty string
     *
     * @param {string} value String value to convert
     * @return {string} An empty string; otherwise original string
     */
    function stringNullUndefinedToEmpty(value) {
        return toString(value);
    }

    /**
     * Repeat a string value
     *
     * @param {string} value String value to repeat
     * @param {number} count Number of times to repeat the string
     * @return {string} Repeated string; otherwise, empty string on error
     */
    function stringRepeat(value, count) {
        if (!isInteger(count) || count <= 0) {
            return STRING_EMPTY;
        }

        value = toString(value);

        return isFunction(window.String.prototype.repeat) ?
            window.String.prototype.repeat.call(value, count) :
            (new window.Array(++count)).join(value);
    }

    /**
     * Reverse a string value
     *
     * @param {string} value String value to reverse
     * @return {string} Reversed string
     */
    function stringReverse(value) {
        var array = stringToArray(value);

        for (var length = value.length, i = 0, j = length - 1, halfLength = length / 2; i < halfLength; i++, j--) {
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }

        return array.join('');
    }

    /**
     * Check if a string ends with a certain string
     *
     * @param {string} value String value to check
     * @param {string} searchFor Value to search for
     * @param {number} position Position to start searching. Default is start at the end of the string
     * @return {boolean} True, the string ends with a certain string; otherwise, false
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
            return window.String.prototype.endsWith.call(value, searchFor, position);
        }

        // Idea by MDN, URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith
        var lastIndex = value.indexOf(searchFor, position);
        return lastIndex !== -1 && lastIndex === position;
    }

    /**
     * Pad a string either left or right with a padded string. To pad to the left, length should be a positive
     * integer; otherwise, a negative integer for right padding
     *
     * @param {string} value String value to pad
     * @param {string} padding Padding value to pre-append or append to the string value
     * @param {number} length Maximum length of the string value
     * @return {string} Padded string; otherwise, original value coerced as string
     */
    function stringPad(value, padding, length) {
        value = toString(value);

        if (!isInteger(length) || value.length === 0) {
            return value;
        }

        // Create an array with the length - length of the string + 1 and select the maximum value i.e. if negative zero will be chosen
        padding = toString(padding);
        padding = new window.Array(window.Math.max(window.Math.abs(length) - value.length + 1, 0)).join(padding);

        return length > 0 ? padding + value : value + padding;
    }

    /**
     * Check if a string starts with a certain string
     *
     * @param {string} value String value to check
     * @param {string} searchFor Value to search for
     * @param {number} position Position to start searching. Default is start at the beginning of the string
     * @return {boolean} True, the string starts with a certain string; otherwise, false
     */
    function stringStartsWith(value, searchFor, position) {
        if (!isString(value)) {
            return false;
        }

        if (!isNumber(position)) {
            position = 0;
        }

        // Idea by MDN, URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith
        return isFunction(window.String.prototype.startsWith) ?
            window.String.prototype.startsWith.call(value, searchFor, position) :
            value.indexOf(searchFor, position) === position;
    }

    /**
     * Strip EOL characters ( ASCII 10 and ASCII 13 ) in a string
     *
     * @param {string} value String value to strip the EOL characters
     * @return {string} String stripped of EOL characters; otherwise, an empty string
     */
    function stringStripEOL(value) {
        return isStringNotEmpty(value) ? value.replace(_regExp.EOL_CHARS, STRING_EMPTY) : STRING_EMPTY;
    }

    /**
     * Strip carriage return characters ( ASCII 10 ) in a string
     *
     * @param {string} value String value to strip
     * @return {string} New string of stripped carriage returns; otherwise, an empty string
     */
    function stringStripCR(value) {
        return isStringNotEmpty(value) ? value.replace(_regExp.CARRIAGE_RETURN, STRING_EMPTY) : STRING_EMPTY;
    }

    /**
     * Strip line-feed characters ( ASCII 13 ) in a string
     *
     * @param {string} value String value to strip
     * @return {string} New string of stripped line-feeds; otherwise, an empty string
     */
    function stringStripLF(value) {
        return isStringNotEmpty(value) ? value.replace(_regExp.LINE_FEED, STRING_EMPTY) : STRING_EMPTY;
    }

    /**
     * Strip leading and trailing whitespace
     *
     * @param {string} value String value to strip
     * @return {string} New string with stripped leading and trailing whitespace; otherwise, an empty string
     */
    function stringStripWS(value) {
        if (!isString(value)) {
            return STRING_EMPTY;
        }

        return isFunction(window.String.prototype.trim) ?
            window.String.prototype.trim.call(value) :
            value.replace(_regExp.TRIM, STRING_EMPTY);
    }

    /**
     * Parse a string value by supplementing segments such as {keyItem}, with the object literal key value e.g. object.keyItem.
     * Idea by Douglas Crockford, URL: http://javascript.crockford.com/remedial.html
     *
     * @param {string} vslue String value to supplement
     * @param {object} object Object literal with one level only. The keys should match the segments in the string value
     * @return {string} Parsed string; otherwise, empty string
     */
    function stringSupplant(value, object) {
        return toString(value).replace(_regExp.SUPPLANT, function stringSupplantKeys(fullMatch, key) {
            return has(object, key) ? object[key] : fullMatch;
        });
    }

    /**
     * Converts a string to an array
     *
     * @param {string} value String value
     * @returns {array} An array; otherwise, an empty array
     */
    function stringToArray(value) {
        return isString(value) && value.length > 0 ? value.split(STRING_EMPTY) : []; // Not as elegant as lodash's version
    }

    /**
     * Convert a string to a boolean datatype i.e. non-zero and 'true' (case-insensitive) are true; otherwise, false
     *
     * @param {string} value String value
     * @return {boolean} True; otherwise, false
     */
    function stringToBoolean(value) {
        return _regExp.IS_BOOLEAN_TRUE.test(value);
    }

    /**
     * Convert a string to a UTF-16 char array
     *
     * @param {string} value String value
     * @return {array} UTF-16 char array; otherwise, an empty array
     */
    function stringToCharArray(value) {
        // Split to a string array and map each character to the corresponding char code
        return stringToArray(value).map(function mapCharArray(char) {
            return char.charCodeAt();
        });
    }

    /**
     * Convert a string to a number datatype. Idea by underscore.string, URL: https://github.com/epeli/underscore.string
     *
     * @param {string} value String value
     * @param {number} precision Precision value
     * @return {number} Parsed number; otherwise, zero by default
     */
    function stringToNumber(value, precision) {
        if (isNullOrUndefined(value)) {
            return 0;
        }

        var factor = window.Math.pow(10, window.isFinite(precision) ? precision : 0);
        return window.Math.round(value * factor) / factor;
    }

    /**
     * Trim a number of characters left of a string
     *
     * @param {string} value String value to trim
     * @param {number} count Number of characters to trim from the left
     * @return {string} Trimmed string; otherwise, an empty string
     */
    function stringTrimLeft(value, count) {
        return isString(value) && isInteger(count) && count > 0 && count < value.length ? value.substr(count) : STRING_EMPTY;
    }

    /**
     * Trim a number of characters right of a string
     *
     * @param {string} value String value to trim
     * @param {number} count Number of characters to trim from the right
     * @return {string} Trimmed string; otherwise, an empty string
     */
    function stringTrimRight(value, count) {
        return isString(value) && isInteger(count) && count > 0 && count < value.length ? value.substr(0, value.length - count) : STRING_EMPTY;
    }

    /**
     * Convert the first character of a string to upper-case
     *
     * @param {string} value String value
     * @return {string} First character of the string changed to upper-case; otherwise, an empty string
     */
    function stringUCFirst(value) {
        if (!isString(value)) {
            return STRING_EMPTY;
        }

        var index = 0;
        return (value[index++].toUpperCase()) + value.substr(index);
    }

    /**
     * Coerce a value to a string. Null or undefined are coerced as an empty string
     *
     * @param {mixed} value Value to convert
     * @return {string} New string value
     */
    function toString(value) {
        if (isString(value)) {
            // Return the original value
            return value;
        }

        return isNullOrUndefined(value) || isObjectLiteral(value) ? STRING_EMPTY : (STRING_EMPTY + value);
    }

    /**
     * Trim characters from the left-hand and right-hand side of a string. Idea by underscore.string, URL: https://github.com/epeli/underscore.string
     *
     * @param {string} value String value to trim
     * @param {string} characters Character set to trim. If null or undefined, then the native String.prototype.trim will be used
     * @return {string} Trimmed string
     */
    function trim(value, characters) {
        value = toString(value);
        if (value.length === 0) {
            return value;
        }

        // If null or undefined, then use the native trim
        if (isNullOrUndefined(characters)) {
            return stringStripWS(value);
        }

        // Coerce as a string and escape the meta regular expression characters
        characters = '[' + escapeRegExChars(toString(characters)) + ']';

        return value.replace(new window.RegExp('^' + characters + '+|' + characters + '+$', 'g'), STRING_EMPTY);
    }

    /**
     * Override the default behaviour of typeof, by returning 'null' or a null value or 'array' for an array datatype.
     * Idea by Douglas Crockford, URL: http://javascript.crockford.com/remedial.html
     *
     * @param {mixed} value Variable to check
     * @return {string} Datatype of the variable. See, URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof
     */
    function typeOf(value) {
        var type = typeof value;

        // Override the default return value of an object that is either am array or null
        if (type === 'object') {
            if (isNull(value)) {
                type = 'null';
            } else if (isArray(value)) {
                type = 'array';
            }
        }

        return type;
    }

    /**
     * Convert a character to a HTML entity
     *
     * @param {string} char Character to convert
     * @return {string} HTML entity character
     */
    function _htmlEscapeChar(char) {
        return _htmlEscapeChars[char];
    }

    /**
     * Check if a variable is an object
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is an object; otherwise, false
     */
    function _isObjectLike(value) {
        return !!value && typeof value === 'object';
    }

    /**
     * Initialise all DOM cachable variables
     *
     * @return {undefined}
     */

    // function _cacheDom() {}

    // Invoked when the DOM has loaded
    $(function coreReady() {
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
        debounce: debounce,
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
        isGenerator: isGenerator,
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
        isStringBoolean: isStringBoolean,
        isStringFloat: isStringFloat,
        isStringInteger: isStringInteger,
        isStringNotEmpty: isStringNotEmpty,
        isStringNumber: isStringNumber,
        isUndefined: isUndefined,
        isUndefinedAssigned: isUndefinedAssigned,
        isValidFileExtension: isValidFileExtension,
        isWeakMap: isWeakMap,
        isWeakSet: isWeakSet,
        isWindow: isWindow,
        keys: keys,
        noop: noop,
        now: now,
        once: once,
        padDigits: padDigits,
        randomNumber: randomNumber,
        sprintf: stringFormat,
        stringAddCR: stringAddCR,
        stringAddLF: stringAddLF,
        stringContains: stringContains,
        stringEndsWith: stringEndsWith,
        stringEscapeHTML: stringEscapeHTML,
        stringFormat: stringFormat,
        stringNullUndefinedToEmpty: stringNullUndefinedToEmpty,
        stringPad: stringPad,
        stringRepeat: stringRepeat,
        stringReverse: stringReverse,
        stringStartsWith: stringStartsWith,
        stringStripCR: stringStripCR,
        stringStripEOL: stringStripEOL,
        stringStripLF: stringStripLF,
        stringStripWS: stringStripWS,
        stringSupplant: stringSupplant,
        stringToArray: stringToArray,
        stringToBoolean: stringToBoolean,
        stringToCharArray: stringToCharArray,
        stringToNumber: stringToNumber,
        stringTrimLeft: stringTrimLeft,
        stringTrimRight: stringTrimRight,
        stringUCFirst: stringUCFirst,
        toString: toString,
        trim: trim,
        typeOf: typeOf,
    };
})(window, window.document, window.jQuery);

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
