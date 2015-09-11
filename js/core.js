// Create an 'App' namespace if it doesn't already exist
var App = App || {};

/**
 * Core module
 *
 * Modified: 2015/09/10
 * @author softwarespot
 */
App.core = (function ($, window, document, undefined) {
    // Constants

    // SemVer version number of the module
    var VERSION = '1.0.0';

    // Store this
    var THIS = App;

    // Unique global identifier. Internal usage only
    // var GUID = 'BF1D7691-79D4-4A89-930B-84C65A309E86';

    // Fields

    // Return strings of toString() found on the Object prototype
    // Based on the implementation by lodash inc. is* function as well
    const _objectStrings = {
        BOOLEAN: '[object Boolean]',
        DATE: '[object Date]',
        ERROR: '[object Error]',
        FUNCTION: '[object Function]',
        NUMBER: '[object Number]',
        REGEXP: '[object RegExp]',
        STRING: '[object String]'
    };

    // Store the Object prototype toString method
    var _objectToString = Object.prototype.toString;

    // Regular expression to strip EOL characters
    var _reEOLChars = /\r?\n|\r/gm;

    // Methods

    /**
     * Initialisation function
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
     * Create a namespace. Idea based on the work by Nikolas C. Zakas from Maintainable JavaScript
     * @param {string} ns A namespace comprised of optional parts e.g. App.system.clock
     * @return {object} Context of this, based on the last part in the namespace e.g. this would be equal to the 'clock' object reference
     */
    function namespace(ns) {
        var _this = THIS;
        var parts = ns.split('.');

        for (var i = 0, length = parts.length; i < length; i++) {
            if (!_this[parts[i]]) {
                _this[parts[i]] = {};
            }
            _this = _this[parts[i]];
        }

        return _this;
    }

    /**
     * Check if a variable is an array datatype
     *
     * @param {mixed} value Value to check
     * @returns {boolean} true the value is an array datatype; otherwise, false
     */
    var isArray = Array.isArray;

    /**
     * Check if a variable is a boolean datatype
     *
     * @param {mixed} value Value to check
     * @returns {boolean} true the value is a boolean datatype; otherwise, false
     */
    function isBoolean(value) {
        return value === true || value === false || (isObjectLike(value) && _objectToString.call(value) === _objectStrings.BOOLEAN);
    }

    /**
     * Check if a variable is a Date object
     *
     * @param {mixed} value Value to check
     * @returns {boolean} true the value is a Date datatype; otherwise, false
     */
    function isDate(value) {
        return isObjectLike(value) && _objectToString.call(value) === _objectStrings.DATE;
    }

    /**
     * Check if a variable is an 'Error', 'EvalError', 'RangeError', 'ReferenceError',
     * 'SyntaxError', 'TypeError', or 'URIError' object
     *
     * @param {mixed} value Value to check
     * @returns {boolean} true the value is a Error object; otherwise, false
     */
    function isError(value) {
        return isObjectLike(value) && typeof value.message === 'string' && _objectToString.call(value) === _objectStrings.ERROR;
    }

    /**
     * Check if a variable is a function datatype
     *
     * @param {mixed} value Value to check
     * @returns {boolean} true the value is a function datatype; otherwise, false
     */
    function isFunction(value) {
        return isObject(value) && _objectToString.call(value) === _objectStrings.FUNCTION;
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
     * @returns {boolean} true the value is null; otherwise, false
     */
    function isNull(value) {
        return value === null;
    }

    /**
     * Check if a variable is null or undefined
     *
     * @param {mixed} value Value to check
     * @returns {boolean} true the value is null or undefined; otherwise, false
     */
    function isNullOrUndefined(value) {
        return isNull(value) || isUndefined(value);
    }

    /**
     * Check if a variable is a number datatype
     *
     * @param {mixed} value Value to check
     * @returns {boolean} true the value is a number datatype; otherwise, false
     */
    function isNumber(value) {
        return typeof value === 'number' || (isObjectLike(value) && _objectToString.call(value) === _objectStrings.NUMBER);
    }

    /**
     * Check if a variable is an object
     *
     * @param {mixed} value Value to check
     * @returns {boolean} true the value is an object; otherwise, false
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
     * @returns {boolean} true the value is an object; otherwise, false
     */
    function isObjectLike(value) {
        return !!value && typeof value === 'object';
    }

    /**
     * Check if a variable is a RegExp object
     *
     * @param {mixed} value Value to check
     * @returns {boolean} true the value is a RegExp object; otherwise, false
     */
    function isRegExp(value) {
        return isObject(value) && _objectToString.call(value) === _objectStrings.REGEXP;
    }

    /**
     * Check if a variable is a string datatype
     *
     * @param {mixed} value Value to check
     * @returns {boolean} true the value is a string datatype; otherwise, false
     */
    function isString(value) {
        return typeof value === 'string' || _objectToString.call(value) === _objectStrings.STRING;
    }

    /**
     * Check if a variable is a string and empty or whitespace
     *
     * @param {mixed} value Value to check
     * @returns {boolean} true the value is a string and empty; otherwise, false
     */
    function isStringEmptyOrWhitespace(value) {
        return isString(value) && value.trim().length === 0;
    }

    /**
     * Check if a variable is undefined
     *
     * @param {object} value Value to check
     * @returns {boolean} true the value is undefined; otherwise, false
     */
    function isUndefined(value) {
        return value === undefined;
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
     * Strip EOL characters in a string
     *
     * @param {string} value String value to strip the EOL characters
     * @return {string} String stripped of EOL characters; otherwise, on error, the original string
     */
    function stringStripEOL(value) {
        return isString(value) ? value.replace(_reEOLChars, '') : value;
    }

    /**
     * Initialise all DOM cachable variables
     *
     * @return {undefined}
     */
    // function _cacheDom() {}

    // Invoked when the DOM has loaded
    $(function () {
        init({});
    });

    // Public API
    return {
        getVersion: getVersion,
        namespace: namespace,
        isArray: isArray,
        isBoolean: isBoolean,
        isDate: isDate,
        isError: isError,
        isFunction: isFunction,
        isjQuery: isjQuery,
        isjQueryNotEmpty: isjQueryNotEmpty,
        isNull: isNull,
        isNullOrUndefined: isNullOrUndefined,
        isNumber: isNumber,
        isObject: isObject,
        isRegExp: isRegExp,
        isString: isString,
        isStringEmptyOrWhitespace: isStringEmptyOrWhitespace,
        isUndefined: isUndefined,
        randomNumber: randomNumber,
        stringFormat: stringFormat,
        stringStripEOL: stringStripEOL
    };
})(jQuery, window, document);

// Create an alias for 'App.core.namespace'
App.namespace = App.core.namespace;
