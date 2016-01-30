// Create an 'App' namespace if it doesn't already exist
var App = App || {};

/**
 * Core module
 *
 * Modified: 2016/01/03
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

    // HTML element error/loading events
    var ELEMENT_EVENT_ERROR = 'error';
    var ELEMENT_EVENT_LOAD = 'load';

    // Value of indexOf when a value isn't found
    var IS_NOT_FOUND = -1;

    // Milliseconds in a second
    var MILLISECONDS_IN_A_SECOND = 1000;

    // First regular expression match
    var REGEXP_FIRST_MATCH = 1;

    // Store ellipses string
    var STRING_ELLIPSES = '...';

    // Store an empty string
    var STRING_EMPTY = '';

    // Char used for padding digits
    var STRING_PADDING_CHAR = '0';

    // Fields

    // Store if the module has been initialised
    var _isInitialised = false;

    // Native functions
    var _nativeArray = window.Array;
    var _nativeArrayFrom = _nativeArray.from;
    var _nativeArrayArrayOf = _nativeArray.of;
    var _nativeArrayIsArray = _nativeArray.isArray;

    // var _nativeArrayPrototype = _nativeArray.prototype;
    // var _nativeArraySlice = _nativeArrayPrototype.slice;

    var _nativeDate = window.Date;
    var _nativeDateNow = _nativeDate.now;

    var _nativeError = window.Error;

    var _nativeGlobalIsFinite = window.isFinite;

    var _nativeMath = window.Math;
    var _nativeMathAbs = _nativeMath.abs;
    var _nativeMathCeil = _nativeMath.ceil;
    var _nativeMathFloor = _nativeMath.floor;
    var _nativeMathMax = _nativeMath.max;
    var _nativeMathMin = _nativeMath.min;
    var _nativeMathPow = _nativeMath.pow;
    var _nativeMathRandom = _nativeMath.random;
    var _nativeMathRound = _nativeMath.round;
    var _nativeMathSign = _nativeMath.sign;
    var _nativeMathSqrt = _nativeMath.sqrt;
    var _nativeMathTrunc = _nativeMath.trunc;

    // Programatically calculate the maximum possible number
    var _maxSafeInteger = _nativeMathPow(2, 53) - 1;

    var _nativeNode = window.Node;

    var _nativeNumber = window.Number;

    // var _nativeNumberInfinity = 1 / 0;
    var _nativeNumberIsFinite = _nativeNumber.isFinite;
    var _nativeNumberIsInteger = _nativeNumber.isInteger;
    var _nativeNumberIsNaN = _nativeNumber.isNaN;
    var _nativeNumberIsSafeInteger = _nativeNumber.isSafeInteger;
    var _nativeNumberMaxSafeInteger = _maxSafeInteger; // 9007199254740991 or Number.MAX_SAFE_INTEGER
    var _nativeNumberMinSafeInteger = -(_maxSafeInteger); // -9007199254740991 or Number.MIN_SAFE_INTEGER
    // var _nativeNumberNaN = 0 / 0;

    var _nativeObject = window.Object;
    var _nativeObjectCreate = _nativeObject.create;
    var _nativeObjectIs = _nativeObject.is;
    var _nativeObjectKeys = _nativeObject.keys;

    var _nativeObjectPrototype = _nativeObject.prototype;
    var _nativeObjectHasOwnProperty = _nativeObjectPrototype.hasOwnProperty;
    var _nativeObjectToString = _nativeObjectPrototype.toString;

    var _nativePromise = window.Promise;

    var _nativeRegExp = window.RegExp;

    var _nativeString = window.String;
    var _nativeStringEndsWith = _nativeString.prototype.endsWith;
    var _nativeStringIncludes = _nativeString.prototype.includes;
    var _nativeStringRepeat = _nativeString.prototype.repeat;
    var _nativeStringStartsWith = _nativeString.prototype.startsWith;
    var _nativeStringTrim = _nativeString.prototype.trim;
    var _nativeStringTrimLeft = _nativeString.prototype.trimLeft;
    var _nativeStringTrimRight = _nativeString.prototype.trimRight;

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

    // Return strings of toString() found on the Object prototype
    // Based on the implementation by lodash including certain is* function as well
    var _objectStringsArguments = '[object Arguments]';
    var _objectStringsArray = '[object Array]';
    var _objectStringsBoolean = '[object Boolean]';
    var _objectStringsDate = '[object Date]';

    // var _objectStringsError = '[object Error]';
    var _objectStringsFunction = '[object Function]';
    var _objectStringsGenerator = '[object GeneratorFunction]';

    // var _objectStringsMap = '[object Map]';
    var _objectStringsNumber = '[object Number]';
    var _objectStringsObject = '[object Object]';

    // var _objectStringsPromise = '[object Promise]';
    var _objectStringsRegExp = '[object RegExp]';

    // var _objectStringsSet = '[object Set]';
    var _objectStringsString = '[object String]';

    // var _objectStringsSymbol = '[object Symbol]';
    // var _objectStringsWeakMap = '[object WeakMap]';
    // var _objectStringsWeakSet = '[object WeakSet]';

    // Regular expressions

    // Alphanumeric characters
    var _reAlNum = /(?:^[0-9A-Za-z]+$)/;

    // Alphabet characters
    var _reAlpha = /(?:^[A-Za-z]+$)/;

    // ASCII characters ( ASCII 0 - 127 )
    var _reASCII = /(?:^[\x00-\x7F]*$)/;

    // Extended ASCII characters ( ASCII 0 - 255 )
    var _reASCIIExtended = /(?:^[\x00-\xFF]*$)/;

    // Base64
    var _reBase64 = /(?:^(?:[0-9A-Za-z+/]{4})*(?:[0-9A-Za-z+/]{2}==|[0-9A-Za-z+/]{3}=)?$)/;

    // Is representing a boolean datatype
    var _reBoolean = /(?:^false|true$)/i;

    // Is representing a boolean datatype of true
    var _reBooleanTrue = /(?:^(?:[-+]?(?!0+)[0-9]+|true)$)/i;

    // EOL carriage return
    var _reCarriageReturn = /\r/;

    // Carriage return append
    var _reCarriageReturnAdd = /(?!\r)\n/;

    // Empty string
    var _reEmpty = /(?:^\s*$)/;

    // Strip EOL characters
    var _reEOLChars = /\r?\n|\r/gm;

    // Escape hyphens (-), underscores (_) or whitespace
    var _reEscapedCaseChars = /(?:[\-_\s]+)/g;

    // Escape upper-case characters
    var _reEscapedCamelCaseChar = /([A-Z])/g;

    // Escape a camel-case string
    var _reEscapedCamelCaseChars = /([0-9a-z])([A-Z]+)/g;

    // Float values
    var _reFloat = /(?:^-?(?!0{2,})\d+\.\d+$)/;

    // Globally unique identifier
    var _reGUID = /(?:^[0-9A-Fa-f]{8}-(?:[0-9A-Fa-f]{4}-){3}[0-9A-Fa-f]{12}$)/;

    // Hex string ( ASCII A-F, a-f, 0-9 )
    var _reHex = /(?:^0[xX][0-9A-Fa-f]+$)/;

    // Escape HTML characters
    var _reHTMLEscape = new _nativeRegExp('([' + _nativeObjectKeys(_htmlEscapeChars).join(STRING_EMPTY) + '])', 'g');

    // Integer values
    var _reInteger = /(?:^-?(?!0+)\d+$)/;

    // EOL line feed
    var _reLineFeed = /\n/;

    // Line feed append
    var _reLineFeedAdd = /\r(?!\n)/;

    // Octal values
    var _reOctal = /(?:^0o[0-7]+$)/i;

    // Regular expression meta characters
    var _reRegExpEscape = /([\].|*?+(){}^$\\:=[])/g;

    // Regular expression flags
    var _reRegExpFlags = /([gimuy]*$)/;

    // Parse items between {} that are of an integer value
    var _reStringFormat = /(?:{(\d+)})/g;

    // Parse items between {} e.g. {username}
    var _reSupplant = /(?:{([^{}]*)})/g;

    // Convert a kebab-case or snake-case string to camel-case
    var _reToCamelCase = /(?:[\-_\s]+([^\-_\s]))/g;

    // Strip leading whitespace
    var _reTrimLeft = /^[\s\uFEFF\xA0]+/;

    // Strip trailing whitespace
    var _reTrimRight = /[\s\uFEFF\xA0]+$/;

    // Strip leading and trailing whitespace
    // Idea by MDN, URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
    var _reTrim = new _nativeRegExp(_reTrimLeft.source + '|' + _reTrimRight.source, 'g');

    // Parsing the native toString() return value e.g. [object Object]
    var _reTypeOf = /(?:^\[object\s(.*?)\]$)/;

    // Unique id cache
    var _uniqueId = 0;

    // Methods

    /**
     * Initialise the module
     *
     * @param {object} config Options to configure the module
     * @return {undefined}
     */
    function init(/* config */) {
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
     * Check if a variable is a function datatype
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is a function datatype; otherwise, false
     */
    function isFunction(value) {
        var tag = _nativeObjectToString.call(value);
        return tag === _objectStringsFunction || tag === _objectStringsGenerator;
    }

    /**
     * Convert the array-like arguments object variable used in a closure to an arrayquery
     * Leaking arguments, URL: https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#3-managing-arguments
     * Benchmark, URL: http://jsperf.com/arguments-to-array/40
     *
     * @param {arguments} args The array-like arguments object
     * @param {number} start Start position of the array. If undefined or invalid, the default is zero
     * @return {array} An array of arguments (not array-like); otherwise, an empty array
     */
    function argumentsToArray(args, start) {
        if (isArguments(args)) {
            var length = args.length;
            var array = _nativeArray(length);

            // If the length is zero, then don't continue
            if (length === 0) {
                return array;
            }

            // Set the start position of the array to zero if an invalid integer or start position
            if (!isInteger(start) || start < 0 || start >= length) {
                start = 0;
            }

            var i = start;
            var j = 0;
            while (i < length) {
                array[j++] = args[i++];
            }

            array.length = j;

            return array;
        }

        return [];
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
     * Create a new array of an array-like iterable object
     * Idea by MDN, URL: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/from
     *
     * @param {array|object} arrayLike An array-like or iterable object to convert to an array
     * @param {function} fn Optional map function to call on every element of the array. Function signature is fn => value, index
     * @param {object|undefined} context Current context. If null or undefined then 'this' is used
     * @return {array} New array; otherwise, an empty array on error
     */
    var arrayFrom = isFunction(_nativeArrayFrom) ? _nativeArrayFrom : function arrayFrom(arrayLike, fn, context) {
        // If not an iterable object, then return an empty array
        if (isNil(arrayLike)) {
            return [];
        }

        // Cache the current context
        var _this = this;

        // Coerce as an object
        var items = _nativeObject(arrayLike);

        var length = toLength(items.length);
        if (length === 0) {
            return [];
        }

        if (isFunction(fn)) {
            if (isNil(context)) {
                context = undefined;
            }
        } else {
            // If not a callable function, then set the context and function to be undefined
            context = undefined;
            fn = undefined;
        }

        // If the current context is a constructor, then call the [[Construct]] internal method; otherwise, create a new array
        var array = isFunction(_this) ? _nativeObject(new _this(length)) : new _nativeArray(length);
        var i = 0;
        while (i < length) {
            var value = items[i];
            if (fn) {
                array[i] = context ? fn.call(context, value, i) : fn(value, i);
            } else {
                array[i] = value;
            }

            i++;
        }

        array.length = length;

        return array;
    };

    /**
     * Search through an array to determine whether a value exists in the array
     * Idea by MDN, URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
     *
     * @param {array} array The array to search in
     * @param {mixed} searchFor The value to search for
     * @param {number} position Position to start searching from
     * Note: A positive value searches from the left and a negative value searches from the right. The default is zero
     * @return {boolean} True, the value exists in the array; otherwise, false
     */
    function arrayIncludes(array, searchFor, position) {
        if (!isArray(array)) {
            return false;
        }

        var length = array.length;
        if (length === 0) {
            return false;
        }

        if (!isInteger(position)) {
            position = 0;
        }

        var incrementer = position;
        if (position < 0) {
            incrementer = length + position;
            if (incrementer < 0) {
                incrementer = 0;
            }
        }

        // Cache whether the search value is a NaN
        var isSearchNaN = isNaN(searchFor);

        // Loop through the array searching for the search value or if the search value and array value are not equal to themselves i.e. NaN
        while (incrementer < length) {
            var value = array[incrementer];
            if (searchFor === value ||

                // Unique approach to searching for NaN
                (isSearchNaN && value !== value)) {
                return true;
            }

            incrementer++;
        }

        return false;
    }

    /**
     * Convert a list of arguments to an array
     *
     * @param {arguments} arguments Arguments passed to the arrayOf
     * @return {array} An array of arguments passed to arrayOf; otherwise, an empty array
     */
    var arrayOf = isFunction(_nativeArrayArrayOf) ? _nativeArrayArrayOf : function arrayOf() {
        return argumentsToArray(arguments, 0);
    };

    /**
     * Peek at the last item in the array
     *
     * @param {array} array The array to peek at
     * @return {mixed|null} The last item pushed onto the array; otherwise, null
     */
    function arrayPeek(array) {
        if (!isArray(array)) {
            return null;
        }

        var length = array.length;

        return length > 0 ? array[length - 1] : null;
    }

    /**
     * Remove a value from an array
     *
     * @param {array} array The array to remove from
     * @param {mixed} value Value to remove
     * @return {undefined}
     */
    function arrayRemove(array, value) {
        if (!isArray(array) || array.length === 0) {
            return;
        }

        var index = array.indexOf(value);
        if (index !== IS_NOT_FOUND) {
            array.splice(index, 1);
        }
    }

    /**
     * Call a function after a timed delay
     * Idea by Remy Sharp, URL: https://remysharp.com/2010/07/21/throttling-function-calls
     *
     * @param {function} fn Function to call after a timed delay
     * @param {number} delay Delay before calling the function. If not a number then defaults to zero
     * @param {object|undefined} context Current context. If null or undefined then 'this' is used
     * @return {undefined}
     */
    function debounce(fn, delay, context) {
        // Cache the timer handle
        var timer = null;

        delay = isNumber(delay) ? delay : 0;

        return function debounceClosure() {
            if (!isFunction(fn)) {
                return;
            }

            if (isNotNull(timer)) {
                window.clearTimeout(timer);
                timer = null;
            }

            // Cache the arguments object-like array
            var args = arguments;

            // If the context is null or undefined then use 'this'
            context = isNil(context) ? this : context;

            timer = window.setTimeout(function setTimeout() {
                fn.apply(context, args);
            }, delay);
        };
    }

    /**
     * Abstraction of querySelectorAll with increased performance and greater usability
     * Idea by ryanmorr, URL: https://github.com/ryanmorr/query
     *
     * @param {string} selector String selector
     * @param {object|undefined} context Current context. If null or undefined then 'document' is used
     * @return {array} Array of DOM elements; otherwise, an empty array on array
     */
    function dom(selector, context) {
        if (trim(selector).length === 0) {
            return [];
        }

        // If the context is null or undefined then use 'document'
        context = isNil(context) ? document : context;

        var reQuerySelector = /(?:^#?[0-9A-Za-z\-]+|\.[0-9A-Za-z\-.]+$)/;
        if (reQuerySelector.test(selector)) {
            var selection = 0;
            switch (selector[selection]) {
                case '#':
                    var result = document.getElementById(selector.substr(++selection));

                    return isNull(result) ? [] : [result];
                case '.':
                    var reReplaceDots = /\./g;

                    return arrayFrom(context.getElementsByClassName(selector.substr(++selection).replace(reReplaceDots, ' ')));
                default:
                    return arrayFrom(context.getElementsByTagName(selector));
            }
        }

        return arrayFrom(context.querySelectorAll(selector));
    }

    /**
     * Search from an element for the closest match, by traversing up the DOM
     *
     * @param {HTMLElement} element Element to start traversing from
     * @param {function} fn Function to recursively that passes the next element above. This is a predicate function i.e. returns a boolean
     * @return {HTMLElement|undefined} Matched HTMLElement; otherwise, undefined
     */
    function elementClosest(element, fn) {
        return element && isFunction(fn) && (fn.call(this, element) ? element : elementClosest(element.parentNode, fn));
    }

    /**
     * Wrap an element with an outer element
     * Idea by DevTools, https://bgrins.github.io/devtools-snippets/#wrapelement
     *
     * @param {HTMLElement|string} element An element to wrap. Can either be a string selector or element node
     * @param {HTMLElement|string} wrapper The element to encase the element in. Can either be a string selector or element node
     * @return {undefined}
     */
    function elementWrap(element, wrapper) {
        // Get the element to wrap
        if (isString(element) || !isElement(element)) {
            element = document.querySelector(element);
        }

        if (isNull(element)) {
            return;
        }

        // Create the element wrapper
        if (isString(wrapper) || !isElement(wrapper)) {
            wrapper = document.createElement(wrapper);
        }

        if (isNull(wrapper)) {
            return;
        }

        var currentParent = element.parentNode;
        var nextSibling = element.nextSibling;
        wrapper.appendChild(element);
        if (nextSibling) {
            currentParent.insertBefore(wrapper, nextSibling);
        } else {
            currentParent.appendChild(wrapper);
        }
    }

    /**
     * Get the absolute url
     * Idea by David Walsh, URL: https://davidwalsh.name/essential-javascript-functions
     *
     * @param {string} url Url to get the absolute path of
     * @return {string} Absolute url; otherwise, an empty string
     */
    var getAbsoluteUrl = (function getAbsoluteUrlModule() {
        var element = document.createElement('a');
        element.style.display = 'none';

        return function getAbsoluteUrl(url) {
            if (!isString(url)) {
                return STRING_EMPTY;
            }

            element.href = url;

            return element.href;
        };
    })();

    // Get CSS property module
    var getCSSProperty = (function getCSSPropertyModule() {
        // Cache the HTML node
        var _documentElement = document.documentElement;
        var _prefixes = ['Khtml', 'Moz', 'Ms', 'O', 'Webkit'];

        // Don't inherit from Object.prototype
        var _cached = _nativeObjectCreate(null);

        /**
         * Get a valid CSS property
         *
         * @param {string} property CSS property in either camel-case (borderRadius) or kebab-case (border-radius) minus the vendor prefix
         * @return {string|null}  CSS property with either a vendor prefix attached; otherwise, null
         */
        return function getCSSProperty(property) {
            if (!isString(property) || property.length === 0) {
                return null;
            }

            // Check if the property is cached
            var cached = _cached[property];
            if (!isUndefined(cached)) {
                return cached;
            }

            var sanitizedProperty = stringToCamelCase(property);

            // Check if the property is supported without vendor prefixes
            if (!isUndefined(_documentElement.style[sanitizedProperty])) {
                _cached[property] = sanitizedProperty;

                return property;
            }

            // Check common vendor prefixes
            sanitizedProperty = stringUCFirst(sanitizedProperty);

            var length = _prefixes.length;
            while (length-- > 0) {
                cached = _prefixes[length] + sanitizedProperty;
                if (!isUndefined(_documentElement.style[cached])) {
                    _cached[property] = cached;
                    return cached;
                }
            }

            _cached[property] = null;

            return null;
        };
    })();

    // Get globals module
    var getGlobals = (function getGlobalsModule() {
        // Create an iFrame and append to the current body to determine the browser's native window object properties
        var _iFrame = _createIFrame();
        var _clone = _iFrame.contentWindow;
        document.body.removeChild(_iFrame);

        // Don't inherit from Object.prototype
        var _globals = _nativeObjectCreate(null);

        // Get all the properties in the window global object
        for (var key in window) {
            // If they are not in the cloned window, the assume it's a custom property
            // Note: Using Object.prototype.hasOwnProperty.call will result in incorrect results
            if (!(key in _clone)) {
                _globals[key] = window[key];
            }
        }

        /**
         * Get custom properties attached to the window object
         * Idea by DevTools, URL: https://bgrins.github.io/devtools-snippets/#log-globals
         *
         * @return {object} An object with custom properties
         */
        return function getGlobals() {
            return _globals;
        };
    })();

    /**
     * Get the outerHTML of a specific jQuery selector object element
     *
     * @param {jQuery} $element jQuery selector object
     * @param {number} index A zero-based integer indicating which element to retrieve
     * @return {string|null} Stringified contents of the DOM element; otherwise, null
     */
    function getjQueryOuterHTML($element, index) {
        if (!isjQuery($element)) {
            return null;
        }

        index = isNumber(index) ? index : 0;
        var outerHTML = $element.eq(index)

        // outerHTML is not available on older browsers
        .prop('outerHTML');

        return isUndefined(outerHTML) ? null : outerHTML;
    }

    /**
     * Check if an object contains a key
     *
     * @param {object} object Object to check
     * @param {string} property Property to check exists in the object
     * @return {boolean} True, the property exists; otherwise, false
     */
    function has(object, property) {
        return _nativeObjectHasOwnProperty.call(object, property);
    }

    /**
     * Extract the keys of an object to an array
     *
     * @param {object} object Object to extract the keys from
     * @param {boolean} ignoreHasOwnProperty Iterate over properties that aren't directly attached to the object. By default, access the properties directly attached to the object
     * @return {array} An array of keys; otherwise, an empty array
     */
    function keys(object, ignoreHasOwnProperty) {
        var array = [];

        if (!isObject(object)) {
            return array;
        }

        if (isFunction(_nativeObjectKeys)) {
            return _nativeObjectKeys(object);
        }

        if (!isBoolean(ignoreHasOwnProperty)) {
            ignoreHasOwnProperty = false;
        }

        for (var key in object) {
            if (ignoreHasOwnProperty === true || has(object, key)) {
                array.push(key);
            }
        }

        return array;
    }

    /**
     * Check if an image is resolvable i.e. returns a HTTP status code that is not 404
     *
     * @param {string} sourceFile An image source file to check
     * @return {promise} A promise that is resolved once the image has loaded or a response has been resolved. The source file is passed to the callbacks
     */
    function imageExists(sourceFile) {
        // Return a promise
        return new _nativePromise(function promise(resolve, reject) {
            if (!isString(sourceFile) || sourceFile.length === 0) {
                reject(STRING_EMPTY);
                return;
            }

            var img = document.createElement('img');

            // Create event listeners for when or if the HTMLImageElement is loaded
            img.addEventListener(ELEMENT_EVENT_LOAD, function elementOnLoad() {
                // Destroy the image element
                img = null;
                resolve(sourceFile);
            });

            img.addEventListener(ELEMENT_EVENT_ERROR, function elementOnError() {
                // Destroy the image element
                img = null;
                reject(sourceFile);
            });

            // Set the image element source file
            img.src = sourceFile;

            // If the image has already been loaded i.e. cached, then resolve the promise
            if (img.complete) {
                resolve(sourceFile);
            }
        });
    }

    /**
     * Load a script file
     * Idea by Liam Newmarch, URL: http://liamnewmarch.co.uk/promises/
     *
     * @param  {string} sourceFile Script file to load
     * @return {promise} A new promise that passes the script file loaded as an argument
     */
    function include(sourceFile) {
        var _head = document.head;
        var _node = document.createElement('script');

        // Store the promise functions to call once the script has been loaded
        var _resolve = null;
        var _reject = null;

        // Set the source attribute
        _node.src = sourceFile;

        // Set script loading to be asynchronous
        _node.async = true;

        // _node.crossOrigin = 'anonymous';

        // On successful script load
        function scriptOnLoad() {
            _resolve(sourceFile);
            _remove();
        }

        // On script loading failure
        function scriptOnError() {
            _reject(sourceFile);
            _remove();
        }

        // Remove the assigned event listeners and remove the promise function references
        function _remove() {
            _resolve = null;
            _reject = null;
            _node.removeEventListener(ELEMENT_EVENT_ERROR, scriptOnError, false);
            _node.removeEventListener(ELEMENT_EVENT_LOAD, scriptOnLoad, false);
        }

        // Return a promise
        return new _nativePromise(function promise(resolve, reject) {
            _resolve = resolve;
            _reject = reject;
            _node.addEventListener(ELEMENT_EVENT_ERROR, scriptOnError, false);
            _node.addEventListener(ELEMENT_EVENT_LOAD, scriptOnLoad, false);

            // Append to the HEAD node
            _head.appendChild(_node);
        });
    }

    // Is Ad blocker module
    var hasAdBlocker = (function hasAdBlockerModule() {
        var _iFrame = _createIFrame('ads-text-iframe', 'http://domain.com/ads.html');
        var _hasAdBlocker = _iFrame.style.display === 'none' ||
            _iFrame.style.display === 'hidden' ||
            _iFrame.style.visibility === 'hidden' ||
            _iFrame.offsetHeight === 0;

        /**
         * Has an Ad blocker
         * Idea by Qnimate, URL: http://qnimate.com/how-to-detect-if-adblock-is-present-or-not/
         *
         * @return {boolean} True, has an ad blocker; otherwise, false
         */
        return function hasAdBlocker() {
            return _hasAdBlocker;
        };
    })();

    /**
     * Check if a string contains only alphanumeric characters ( 0-9 and A-Z )
     *
     * @param {string} value String value to check
     * @return {boolean} True, the string contains alphanumeric characters only; otherwise, false
     */
    function isAlNum(value) {
        return isString(value) && _reAlNum.test(value);
    }

    /**
     * Check if a variable is an the array-like arguments object
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is an array-like arguments object; otherwise, false
     */
    function isArguments(value) {
        return _nativeObjectToString.call(value) === _objectStringsArguments;
    }

    /**
     * Check if a string contains only alphabetic characters ( A-Z )
     *
     * @param {string} value String value to check
     * @return {boolean} True, the string contains alphabetic characters only; otherwise, false
     */
    function isAlpha(value) {
        return isString(value) && _reAlpha.test(value);
    }

    /**
     * Check if a variable is an array datatype
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is an array datatype; otherwise, false
     */
    var isArray = isFunction(_nativeArrayIsArray) ? _nativeArrayIsArray : function isArray(value) {
        return _nativeObjectToString.call(value) === _objectStringsArray;
    };

    /**
     * Check if a string contains ASCII characters only ( 0-127 or 0-255 if the extended argument is set to true )
     *
     * @param {string} value String value to check
     * @param {boolean} extended Set to true to use the extended character set (0-255); otherwise default is false ( 0-127 )
     * @return {boolean} True, the string contains ASCII characters only; otherwise, false
     */
    function isASCII(value, extended) {
        if (!isBoolean(extended)) {
            extended = false;
        }

        return isString(value) && (extended ? _reASCIIExtended : _reASCII).test(value);
    }

    /**
     * Check if a string is base64 encoded
     *
     * @param {string} value String value to check
     * @return {boolean} True, the value is a base64 encoded string; otherwise, false
     */
    function isBase64(value) {
        // URL: http://stackoverflow.com/a/475217
        return isString(value) && _reBase64.test(value);
    }

    /**
     * Check if a variable is a boolean datatype
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is a boolean datatype; otherwise, false
     */
    function isBoolean(value) {
        return value === false || value === true || _nativeObjectToString.call(value) === _objectStringsBoolean;
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
        return _nativeObjectToString.call(value) === _objectStringsDate;
    }

    /**
     * Check if a variable is defined
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is defined; otherwise, false
     */
    function isDefined(value) {
        return !isUndefined(value);
    }

    /**
     * Check if an object is a node element
     *
     * @param {object} object Object to check
     * @return {boolean} True, the object is a node element; otherwise, false
     */
    function isElement(object) {
        return !!(object && object.nodeType === _nativeNode.ELEMENT_NODE);
    }

    /**
     * Check if a variable is empty
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is empty; otherwise, false
     */
    function isEmpty(value) {
        if (isNil(value) || value === 0) {
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
     * @returns {boolean} True, the value is an Error object; otherwise, false
     */

    // function isError(value) {
    //     return _nativeObjectToString.call(value) === _objectStringsError && isString(value.message);
    // }

    /**
     * Check if an integer is even
     *
     * @param {number} value Integer value to check
     * @return {boolean} True, the integer is even; otherwise, false
     */
    function isEven(value) {
        return isInteger(value) && value % 2 === 0;
    }

    /**
     * Check if a variable is finite
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is finite; otherwise, false
     */
    var isFinite = isFunction(_nativeNumberIsFinite) ? _nativeNumberIsFinite : function isFinite(value) {
        return isNumber(value) && _nativeGlobalIsFinite(value);
    };

    /**
     * Check if a variable is a floating point datatype
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is a floating point; otherwise, false
     */
    function isFloat(value) {
        return isNumber(value) && _reFloat.test(toString(value));
    }

    /**
     * Check if a variable is a generator function
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is a generator; otherwise, false
     */

    // function isGeneratorFunction(value) {
    //     return _nativeObjectToString.call(value) === _objectStringsGenerator;
    // }

    /**
     * Check if a string is a GUID
     *
     * @param {string} value String value to check
     * @return {boolean} True, the string is a GUID; otherwise, false
     */
    function isGUID(value) {
        return isString(value) && _reGUID.test(value);
    }

    /**
     * Check if a string is hexadecimal
     *
     * @param {string} value String value to check
     * @return {boolean} True, the string is hexadecimal; otherwise, false
     */
    function isHex(value) {
        return isString(value) && _reHex.test(value);
    }

    /**
     * Check if a variable is an integer datatype
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is an integer; otherwise, false
     */
    var isInteger = isFunction(_nativeNumberIsInteger) ? _nativeNumberIsInteger : function isInteger(value) {
        return isNumber(value) && isFinite(value) && _nativeMathFloor(value) === value;
    };

    /**
     * Check if a variable is an instance of jQuery
     *
     * @param {mixed} $element Element to check
     * @return {boolean} True, is an instance of jQuery; otherwise, false
     */
    function isjQuery($element) {
        return $element instanceof $;
    }

    /**
     * Check if a variable is an instance of jQuery and contains at least one element node
     *
     * @param {mixed} $element Element to check
     * @return {boolean} True, is an instance of jQuery and contains at least one element node; otherwise, false
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

    // function isMap(value) {
    //     return _nativeObjectToString.call(value) === _objectStringsMap;
    // }

    /**
     * Check if a variable is a NaN
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is NaN; otherwise, false
     */
    var isNaN = isFunction(_nativeNumberIsNaN) ? _nativeNumberIsNaN : function isNaN(value) {
        return isNumber(value) && value !== value;
    };

    /**
     * Check if a variable is null or undefined
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is null or undefined; otherwise, false
     */
    function isNil(value) {
        return isNull(value) || isUndefined(value);
    }

    /**
     * Check if a variable is not null or undefined
     *
     * @param {mixed} value Value to check
     * @return {boolean} True, the value is not null or undefined; otherwise, false
     */
    function isNotNil(value) {
        return !isNil(value);
    }

    /**
     * Check if a variable is not null
     *
     * @param {mixed} value Value to check
     * @return {boolean} True, the value is not null; otherwise, false
     */
    function isNotNull(value) {
        return !isNull(value);
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
     * Check if a variable is a number datatype
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is a number datatype; otherwise, false
     */
    function isNumber(value) {
        return typeof value === 'number' || _nativeObjectToString.call(value) === _objectStringsNumber;
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
        return value.constructor && has(value.constructor.prototype, 'isPrototypeOf');
    }

    /**
     * Check if an integer is odd
     *
     * @param {number} value Integer value to check
     * @return {boolean} True, the integer is odd; otherwise, false
     */
    function isOdd(value) {
        return isInteger(value) && value % 2 !== 0;
    }

    /**
     * Check if an integer is a prime number
     *
     * @param {number} value Integer value to check
     * @return {boolean} True, the value is a prime number; otherwise, false
     */
    function isPrime(value) {
        if (!isInteger(value)) {
            return false;
        }

        var sqrt = _nativeMathSqrt(value);
        var start = 2;
        while (start <= sqrt) {
            if (value % start++ === 0) {
                return false;
            }
        }

        return value > 1;
    }

    /**
     * Check if a variable is a Promise object
     *
     * @param {promise} value Value to check
     * @return {boolean} True, the value is a Promise object; otherwise, false
     */

    // function isPromise(value) {
    //     return _nativeObjectToString.call(value) === _objectStringsPromise;
    // }

    /**
     * Check if a variable is a RegExp object
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is a RegExp object; otherwise, false
     */
    function isRegExp(value) {
        return _nativeObjectToString.call(value) === _objectStringsRegExp;
    }

    /**
     * Check if an integer is a safe integer
     *
     * @param {number} value Value to check
     * @return {boolean} True, the value is a safe integer; otherwise, false
     */
    var isSafeInteger = isFunction(_nativeNumberIsSafeInteger) ? _nativeNumberIsSafeInteger : function isSafeInteger(value) {
        return isInteger(value) && value >= _nativeNumberMinSafeInteger && value <= _nativeNumberMaxSafeInteger;
    };

    /**
     * Check if a variable is a Set object
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is a Set object; otherwise, false
     */

    // function isSet(value) {
    //     return _nativeObjectToString.call(value) === _objectStringsSet;
    // }

    /**
     * Check if a variable is a string datatype
     *
     * @param {string} value Value to check
     * @returns {boolean} True, the value is a string datatype; otherwise, false
     */
    function isString(value) {
        return typeof value === 'string' || _nativeObjectToString.call(value) === _objectStringsString;
    }

    /**
     * Check if a variable is a string and empty or whitespace
     *
     * @param {string} value Value to check
     * @returns {boolean} True, the value is a string and empty; otherwise, false
     */
    function isStringEmptyOrWhitespace(value) {
        return isString(value) && (value.length === 0 || _reEmpty.test(value));
    }

    /**
     * Check if a variable is a string and representing a boolean (case-insensitive)
     *
     * @param {string} value Value to check
     * @returns {boolean} True, the value is representing a boolean; otherwise, false
     */
    function isStringBoolean(value) {
        return isString(value) && _reBoolean.test(value);
    }

    /**
     * Check if a variable is a string and representing a floating point
     *
     * @param {string} value Value to check
     * @returns {boolean} True, the value is representing a floating point; otherwise, false
     */
    function isStringFloat(value) {
        return isString(value) && _reFloat.test(value);
    }

    /**
     * Check if a variable is a string and representing an integer
     *
     * @param {string} value Value to check
     * @returns {boolean} True, the value is representing an integer; otherwise, false
     */
    function isStringInteger(value) {
        return isString(value) && _reInteger.test(value);
    }

    /**
     * Check if a variable is a string and not empty
     *
     * @param {string} value Value to check
     * @returns {boolean} True, the value is a string and not empty; otherwise, false
     */
    function isStringNotEmpty(value) {
        return isString(value) && value.length > 0;
    }

    /**
     * Check if a variable is a string and representing a number
     *
     * @param {string} value Value to check
     * @returns {boolean} True, the value is representing a number; otherwise, false
     */
    function isStringNumber(value) {
        return isString(value) && (_reFloat.test(value) || _reInteger.test(value));
    }

    /**
     * Check if a variable is a string and representing an octal
     *
     * @param {string} value Value to check
     * @returns {boolean} True, the value is representing an octal; otherwise, false
     */
    function isStringOctal(value) {
        return isString(value) && _reOctal.test(value);
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
    function isUndefinedAssignable() {
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
     * Check if a value is the correct file extension
     *
     * @param {string} value File extension to check
     * @param {string} extensions Semi-colon separated list e.g. js;html;htm
     * @return {boolean} True, the file extension matches; otherwise, false
     */
    function isValidFileExtension(value, extensions) {
        if (isNil(value)) {
            return false;
        }

        value = regExpEscape(value);

        // Replace semi-colon(s) (;) with pipe(s) (|)
        extensions = toString(extensions).replace(';', '|');

        return (new _nativeRegExp('(?:\.(?:' + extensions + ')$)', 'i')).test(value);
    }

    /**
     * Check if a variable is a WeakMap object
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is a WeakMap object; otherwise, false
     */

    // function isWeakMap(value) {
    //     return _nativeObjectToString.call(value) === _objectStringsWeakMap;
    // }

    /**
     * Check if a variable is a WeakSet object
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is a WeakSet object; otherwise, false
     */

    // function isWeakSet(value) {
    //     return _nativeObjectToString.call(value) === _objectStringsWeakSet;
    // }

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
     * Indicate whether a number is positive, negative or zero
     * Idea by MDN, URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sign
     *
     * @param {mixed} value Value to check
     * @return {number} 1 (positive), -1 (negative) or 0 (zero); otherwise, NaN on error
     */
    var mathSign = isFunction(_nativeMathSign) ? _nativeMathSign : function mathSign(value) {
        // Convert to a number
        value = _nativeNumber(value);
        if (value === 0 || isNaN(value)) {
            return value;
        }

        return value > 0 ? 1 : -1;
    };

    /**
     * Remove any fractional digits from a number
     * Idea by MDN, URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc
     *
     * @param {mixed} value Value to convert
     * @return {number} Truncated number; otherwise, NaN on error
     */
    var mathTrunc = isFunction(_nativeMathTrunc) ? _nativeMathTrunc : function mathTrunc(value) {
        return value < 0 ? _nativeMathCeil(value) : _nativeMathFloor(value);
    };

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
        var timstamp = isFunction(_nativeDateNow) ? _nativeDateNow() : new _nativeDate().getTime();

        return _nativeMathFloor(timstamp / MILLISECONDS_IN_A_SECOND);
    }

    /**
     * Iterate over an object's keys
     *
     * @param {object} object Object to iterate over
     * @param {function} fn Callback function to execute on each key in the object. Function signature is fn => value, key, originalObject
     * @param {object|undefined} context Current context. If null or undefined then the 'object' is used
     * @param {boolean} ignoreHasOwnProperty Iterate over properties that aren't directly attached to the object. By default, access the properties directly attached to the object
     * @return {undefined}
     */
    function objectForEach(object, fn, context, ignoreHasOwnProperty) {
        if (!isFunction(fn)) {
            return;
        }

        if (!isBoolean(ignoreHasOwnProperty)) {
            ignoreHasOwnProperty = false;
        }

        // If the context is null or undefined then use the 'object'
        context = isNil(context) ? object : context;

        for (var key in object) {
            if (ignoreHasOwnProperty === true || has(object, key)) {
                fn.call(context, object[key], key, object);
            }
        }
    }

    /**
     * Determine if two values are the same
     * Idea by MDN, URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
     *
     * @param {mixed} value1 Value to compare
     * @param {mixed} value2 Value to compare
     * @return {boolean} True, values are the same; otherwise, false
     */
    var objectIs = isFunction(_nativeObjectIs) ? _nativeObjectIs : function objectIs(value1, value2) {
        if (value1 === value2) {
            return value1 !== 0 || 1 / value1 === 1 / value2;
        }

        return value1 !== value1 && value2 !== value2;
    };

    /**
     * Create an object with nested properties e.g. obj.key1.key2 => obj = { key1: { key2: true } }
     *
     * @param {object} object Object to use
     * @param {string} namespaceParts Namespace string, with a dot (.) as the delimiter for each property
     * @return {object} New object; otherwise, empty object literal
     */
    function objectNamespace(object, namespaceParts) {
        // Create a new object or use existing if undefined
        object = object || {};

        if (!isString(namespaceParts) || namespaceParts.length === 0) {
            return object;
        }

        var context = object;
        namespaceParts.split('.').forEach(function forEachPart(part) {
            // Create a new object or use existing if undefined
            context[part] = context[part] || {};

            // Set the context for nesting
            context = context[part];
        });

        return object;
    }

    /**
     * Call a function only once
     * Idea by David Walsh, URL: https://davidwalsh.name/essential-javascript-functions
     *
     * @param {function} fn Function to call only once
     * @param {object|undefined} context Current context. If null or undefined then 'this' is used
     * @return {mixed} Return value of the fn argument. If once is called more than once, then the cached result is returned
     */
    function once(fn, context) {
        // Cache the fn result, as the fn will be destroyed when called once
        var result;

        return function onceClosure() {
            if (isFunction(fn)) {
                // If the context is null or undefined then use 'this'
                context = isNil(context) ? this : context;
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
        return stringPad(value, STRING_PADDING_CHAR, _nativeMathAbs(length));
    }

    /**
     * Parse a string value to HTML
     * Idea by , URL: http://youmightnotneedjquery.com/
     *
     * @param {string} value String value to parse
     * @return {HTMLCollection} HTMLCollection of nodes; otherwise, null on error
     */
    function parseHTML(value) {
        if (!isString(value)) {
            return null;
        }

        // Create an inner HTML document
        var html = document.implementation.createHTMLDocument();

        // Set the inner HTML
        html.body.innerHTML = value;

        return html.body.children;
    }

    // Queue a function module
    var queueFn = (function queueFnModule() {
        var _queueFn = [];

        /**
         * Calls the next function in the queue. The function is passed to the function that is being called, including any  arguments
         *
         * @return {undefined}
         */
        function next() {
            // Create an arguments array
            var args = argumentsToArray(arguments);

            // Add the next function to the start of the arguments array
            args.unshift(next);

            // Dequeue the function from the internal queue
            var fn = _queueFn.shift();
            fn.apply(null, args);
        }

        /**
         * Add a function to the internal queue array
         *
         * @param {function} fn Function to queue to the internal queue array
         * @return {undefined}
         */
        return function queueFn(fn) {
            if (!isFunction(fn)) {
                return;
            }

            // Enqueue to the internal queue
            _queueFn.push(fn);

            if (_queueFn.length === 1) {
                next();
            }
        };
    })();

    /**
     * Generate a random number
     * Idea by Chris Heilmann, URL: https://davidwalsh.name/essential-javascript-functions#comment-502510
     *
     * @param {number} min Minimum value
     * @param {number} max Maximum value
     * @return {number} Returns a random number between the minimum and maximum values
     */
    function randomNumber(min, max, isInteger) {
        if (!isNumber(min) || !isNumber(max)) {
            return 0;
        }

        var random = _nativeMathRandom() * (max - min) + min;

        return isInteger === false ? random : _nativeMathFloor(random);
    }

    /**
     * Execute code once the DOM has loaded
     * Idea by bliss, URL: http://blissfuljs.com/docs.html#fn-ready
     *
     * @return {promise} A promise that is resolved once the DOM is loaded
     */
    function ready() {
        return new _nativePromise(function readyPromise(resolve /* , reject */) {
            if (document.readyState !== 'loading') {
                resolve();
            } else {
                document.addEventListener('DOMContentLoaded', function domContentLoadedListener() {
                    resolve();
                });
            }
        });
    }

    /**
     * Escape RegExp characters with a prefixed backslash
     *
     * @param {string} value String value to escape
     * @return {string} Escaped string; otherwise, an empty string
     */
    function regExpEscape(value) {
        if (!isString(value) || value.length === 0) {
            return STRING_EMPTY;
        }

        // Escape RegExp special characters only
        // $& => Last match, URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/lastMatch
        return value.replace(_reRegExpEscape, '\\$&');
    }

    /**
     * Get the flags of a regular expression
     * Idea by MDN, URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/flags
     *
     * @param {RegExp} regExp Regular expression object
     * @return {string}
     */
    function regExpFlags(regExp) {
        if (!isRegExp(regExp)) {
            return STRING_EMPTY;
        }

        return toString(regExp).match(_reRegExpFlags)[0];
    }

    /**
     * Return a closure that is wrapped in a try...catch
     *
     * @param {function} fn Function to wrap
     * @param {function} catchFn Function to call on error. An exceptions object is passed to the function
     * @param {object|undefined} context Current context. If null or undefined then 'this' is used
     * @return {mixed} Returns a mixed value; otherwise, null on error
     */
    function safeFunction(fn, catchFn, context) {
        if (!isFunction(fn)) {
            return null;
        }

        // Return a closure
        return function safeFunction() {
            if (!isFunction(fn)) {
                return null;
            }

            if (isNil(context)) {
                context = undefined;
            }

            try {
                return fn.spply(context, arguments);
            } catch (e) {
                if (!isFunction(catchFn)) {
                    return null;
                }

                return catchFn.call(context, e);
            }
        };
    }

    /**
     * Prefix all line-feed characters ( ASCII 10 ) with a carriage return character ( ASCII 13 )
     *
     * @param {string} value String value to replace
     * @return {string} New string with carriage returns added; otherwise, an empty string on error
     */
    function stringAddCR(value) {
        return isStringNotEmpty(value) ? value.replace(_reCarriageReturnAdd, '\r\n') : STRING_EMPTY;
    }

    /**
     * Postfix all carriage return characters ( ASCII 13 ) with a line-feed character ( ASCII 10 )
     *
     * @param {string} value String value to replace
     * @return {string} New string with line-feeds added; otherwise, an empty string on error
     */
    function stringAddLF(value) {
        return isStringNotEmpty(value) ? value.replace(_reLineFeedAdd, '\r\n') : STRING_EMPTY;
    }

    /**
     * Check if a string contains another string
     *
     * @param {string} value String value to search in
     * @param {string} searchFor Value to search for
     * @return {boolean} True, the string is found; otherwise, false
     */
    function stringContains(value, searchFor) {
        if (!isString(value)) {
            return false;
        }

        return isFunction(_nativeStringIncludes) ?
            _nativeStringIncludes.call(value, searchFor) :
            value.indexOf(searchFor) !== IS_NOT_FOUND;
    }

    /**
     * Escape HTML special characters with their entity equivalents
     * Idea by underscore.string, URL: https://github.com/epeli/underscore.string
     *
     * @param {string} value String value to escape
     * @return {string} Escaped string; otherwise, an empty string on error
     */
    function stringEscapeHTML(value) {
        if (!isString(value)) {
            return STRING_EMPTY;
        }

        return value.length && _reHTMLEscape.test(value) ? value.replace(_reHTMLEscape, _htmlEscapeChar) : value;
    }

    /**
     * String format. Similar to the C# implementation
     * Idea from StackOverflow, URL: http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format. User: @Filipiz
     *
     * @param {string} value String value to format
     * @param {arguments} arguments Arguments to replace the string identifiers with e.g. stringFormat('Some string like {0}', 'this')
     * @return {string} Formatted string, with {n} identifiers replaced with the passed arguments; otherwise, an empty string on error
     */
    function stringFormat(value) {
        if (!isString(value)) {
            return STRING_EMPTY;
        }

        if (value.length === 0) {
            return value;
        }

        // Convert the arguments array-like object to an array
        var args = argumentsToArray(arguments, 1);

        return value.replace(_reStringFormat, function stringFormatKeys(fullMatch, index) {
            // Coerce as a number and get the value at the index position in the arguments array
            var value = args[toInteger(index)];

            return isUndefined(value) ? fullMatch : value;
        });
    }

    /**
     * Convert the first character of a string to lower-case
     *
     * @param {string} value String value to convert
     * @return {string} First character of the string changed to lower-case; otherwise, an empty string
     */
    function stringLCFirst(value) {
        if (!isString(value)) {
            return STRING_EMPTY;
        }

        var index = 0;
        return (value[index++].toLowerCase()) + value.slice(index);
    }

    /**
     * Map characters in a string using a callback function fn => value
     *
     * @param {string} value String value to map
     * @param {function} fn Function callback for each character
     * @return {string} New string; otherwise, an empty string on error
     */
    function stringMap(value, fn) {
        if (!isString(value) || value.length === 0) {
            return STRING_EMPTY;
        }

        if (!isFunction(fn)) {
            return value;
        }

        return value.replace(/./g, fn);
    }

    /**
     * Convert a null/undefined variable to an empty string
     *
     * @param {string} value String value to convert
     * @return {string} An empty string; otherwise original value
     */
    function stringNullUndefinedToEmpty(value) {
        return isNil(value) ? STRING_EMPTY : value;
    }

    /**
     * Repeat a string value
     *
     * @param {string} value String value to repeat
     * @param {number} count Number of times to repeat the string
     * @return {string} Repeated string; otherwise, an empty string on error
     */
    function stringRepeat(value, count) {
        if (!isString(value) || !isInteger(count) || count <= 0) {
            return STRING_EMPTY;
        }

        return isFunction(_nativeStringRepeat) ?
            _nativeStringRepeat.call(value, count) :
            (new _nativeArray(++count)).join(value);
    }

    /**
     * Reverse a string value
     *
     * @param {string} value String value to reverse
     * @return {string} Reversed string; otherwise, an empty string on error
     */
    function stringReverse(value) {
        var array = stringToArray(value);

        var length = value.length;
        var i = 0;
        var j = length - 1;
        var halfLength = length / 2;
        while (i < halfLength) {
            var temp = array[i];
            array[i++] = array[j];
            array[j--] = temp;
        }

        return array.join('');
    }

    /**
     * Check if a string ends with a certain string
     *
     * @param {string} value String value to check
     * @param {string} searchFor Value to search for
     * @param {number} position Position to start searching from. Default is start at the end of the string
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

        if (isFunction(_nativeStringEndsWith)) {
            return _nativeStringEndsWith.call(value, searchFor, position);
        }

        // Idea by MDN, URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith
        var lastIndex = value.indexOf(searchFor, position);
        return lastIndex !== IS_NOT_FOUND && lastIndex === position;
    }

    /**
     * Pad a string either left or right with a padded string. To pad to the left, length should be a positive
     * integer; otherwise, a negative integer for right padding
     *
     * @param {string} value String value to pad
     * @param {string} padding Padding value to pre-append or append to the string value
     * @param {number} length Maximum length of the string value
     * @return {string} Padded string; otherwise, an empty string on error
     */
    function stringPad(value, padding, length) {
        if (!isString(value)) {
            return STRING_EMPTY;
        }

        if (!isInteger(length) || value.length === 0) {
            return value;
        }

        // Create an array with the length - length of the string + 1 and select the maximum value i.e. if negative zero will be chosen
        padding = toString(padding);
        padding = new _nativeArray(_nativeMathMax(_nativeMathAbs(length) - value.length + 1, 0)).join(padding);

        return length >= 0 ? padding + value : value + padding;
    }

    /**
     * Check if a string starts with a certain string
     *
     * @param {string} value String value to check
     * @param {string} searchFor Value to search for
     * @param {number} position Position to start searching from. Default is start at the beginning of the string
     * @return {boolean} True, the string starts with a certain string; otherwise, false
     */
    function stringStartsWith(value, searchFor, position) {
        if (!isString(value)) {
            return false;
        }

        if (!isInteger(position)) {
            position = 0;
        }

        // Idea by MDN, URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith
        return isFunction(_nativeStringStartsWith) ?
            _nativeStringStartsWith.call(value, searchFor, position) :
            value.indexOf(searchFor, position) === position;
    }

    /**
     * Strip EOL characters ( ASCII 10 and ASCII 13 ) in a string
     *
     * @param {string} value String value to strip the EOL characters
     * @return {string} String stripped of EOL characters; otherwise, an empty string on error
     */
    function stringStripEOL(value) {
        return isStringNotEmpty(value) ? value.replace(_reEOLChars, STRING_EMPTY) : STRING_EMPTY;
    }

    /**
     * Strip carriage return characters ( ASCII 10 ) in a string
     *
     * @param {string} value String value to strip
     * @return {string} New string of stripped carriage returns; otherwise, an empty string on error
     */
    function stringStripCR(value) {
        return isStringNotEmpty(value) ? value.replace(_reCarriageReturn, STRING_EMPTY) : STRING_EMPTY;
    }

    /**
     * Strip line-feed characters ( ASCII 13 ) in a string
     *
     * @param {string} value String value to strip
     * @return {string} New string of stripped line-feeds; otherwise, an empty string on error
     */
    function stringStripLF(value) {
        return isStringNotEmpty(value) ? value.replace(_reLineFeed, STRING_EMPTY) : STRING_EMPTY;
    }

    /**
     * Strip leading and trailing whitespace
     *
     * @param {string} value String value to strip
     * @return {string} New string with stripped leading and trailing whitespace; otherwise, an empty string on error
     */
    function stringStripWS(value) {
        return isStringNotEmpty(value) ? _trim(value) : STRING_EMPTY;
    }

    /**
     * Parse a string value by supplementing segments such as {keyItem}, with the object literal key value e.g. object.keyItem.
     * Idea by Douglas Crockford, URL: http://javascript.crockford.com/remedial.html
     *
     * @param {string} vslue String value to supplement
     * @param {object} object Object literal with one level only. The keys should match the segments in the string value
     * @return {string} Parsed string; otherwise, an empty string on error
     */
    function stringSupplant(value, object) {
        if (!isString(value) || value.length === 0) {
            return STRING_EMPTY;
        }

        return value.replace(_reSupplant, function stringSupplantKeys(fullMatch, key) {
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
        return isStringNotEmpty(value) ? value.split(STRING_EMPTY) : []; // Not as elegant as lodash's version
    }

    /**
     * Convert a string to a boolean datatype i.e. non-zero and 'true' (case-insensitive) are true; otherwise, false
     *
     * @param {string} value String value
     * @return {boolean} True; otherwise, false
     */
    function stringToBoolean(value) {
        return _reBooleanTrue.test(value);
    }

    /**
     * Convert a kebab-case or snake-case string to camel-case
     *
     * @param {string} value String value to convert
     * @return {string} Converted string; otherwise, an empty string on error
     */
    function stringToCamelCase(value) {
        if (!isString(value) || value.length === 0) {
            return STRING_EMPTY;
        }

        // Convert the first character to lower-case
        var index = 0;
        value = value[index++].toLowerCase() + value.slice(index);

        return value.replace(_reToCamelCase, function charToUpper(all, char) {
            return char.toUpperCase();
        });
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
     * Convert a camel-case or snake-case string to kebab-case
     *
     * @param {string} value String value to convert
     * @return {string} Converted string; otherwise, an empty string on error
     */
    function stringToKebabCase(value) {
        if (!isString(value) || value.length === 0) {
            return STRING_EMPTY;
        }

        return value.replace(_reEscapedCamelCaseChar, '-$1')
            .replace(_reEscapedCaseChars, '-')
            .toLowerCase();
    }

    /**
     * Convert a string to a number datatype. Idea by underscore.string, URL: https://github.com/epeli/underscore.string
     *
     * @param {string} value String value to convert
     * @param {number} precision Precision value
     * @return {number} Parsed number; otherwise, zero by default
     */
    function stringToNumber(value, precision) {
        if (!isString(value)) {
            return 0;
        }

        var factor = _nativeMathPow(10, isFinite(precision) ? precision : 0);
        return _nativeMathRound(value * factor) / factor;
    }

    /**
     * Convert a camel-case or kebab-case string to snake-case
     * Idea by underscore.string, URL: https://github.com/epeli/underscore.string
     *
     * @param {string} value String value to convert
     * @return {string} Converted string; otherwise, an empty string on error
     */
    function stringToSnakeCase(value) {
        if (!isString(value) || value.length === 0) {
            return STRING_EMPTY;
        }

        return value.replace(_reEscapedCamelCaseChars, '$1_$2')
            .replace(_reEscapedCaseChars, '_')
            .toLowerCase();
    }

    /**
     * Trim a number of characters left of a string
     *
     * @param {string} value String value to trim
     * @param {number} count Number of characters to trim from the left
     * @return {string} Trimmed string; otherwise, an empty string on error
     */
    function stringTrimLeft(value, count) {
        return isString(value) && isInteger(count) && count > 0 && count < value.length ? value.slice(count) : STRING_EMPTY;
    }

    /**
     * Trim a number of characters right of a string
     *
     * @param {string} value String value to trim
     * @param {number} count Number of characters to trim from the right
     * @return {string} Trimmed string; otherwise, an empty string on error
     */
    function stringTrimRight(value, count) {
        return isString(value) && isInteger(count) && count > 0 && count < value.length ? value.slice(0, value.length - count) : STRING_EMPTY;
    }

    /**
     * Truncate a string to a maximum length and append ellipses (...)
     * Idea by kgriffs, URL: http://snipplr.com/view/40259/smart-string-truncate-with-ellipses/
     *
     * @param {string} value String value to truncate
     * @param {number} maxLength Maximum length of the string to truncate
     * @param {boolean} breakWords True, break at the end of the last word; otherwise, break according to the maximum length
     * @return {string} Truncated string or original string; otherwise, empty string on error
     */
    function stringTrunc(value, maxLength, breakWords) {
        if (!isString(value)) {
            return STRING_EMPTY;
        }

        // Return original value if not an integers or below the maximum length
        if (!isInteger(maxLength) || value.length <= maxLength) {
            return value;
        }

        var truncateAt = maxLength - STRING_ELLIPSES.length;

        // Explicit check for true
        if (breakWords === true) {
            var index = value.lastIndexOf(' ', truncateAt);
            if (index !== IS_NOT_FOUND && index >= truncateAt / 2) {
                truncateAt = index;
            }
        }

        return value.slice(0, truncateAt) + STRING_ELLIPSES;
    }

    /**
     * Convert the first character of a string to upper-case
     *
     * @param {string} value String value to convert
     * @return {string} First character of the string changed to upper-case; otherwise, an empty string
     */
    function stringUCFirst(value) {
        if (!isString(value)) {
            return STRING_EMPTY;
        }

        var index = 0;
        return (value[index++].toUpperCase()) + value.slice(index);
    }

    /**
     * Throw an error with an error message
     *
     * @param {string} value Message value
     * @return {undefined}
     */
    function throwError(value) {
        throw new _nativeError(value);
    }

    /**
     * Coerce a value to a boolean datatype
     * Idea by ECMAScript, URL: http://www.ecma-international.org/ecma-262/5.1/#sec-9.2
     *
     * @param {mixed} value Value to convert
     * @return {boolean} New boolean value
     */
    function toBoolean(value) {
        if (isNil(value)) {
            return false;
        }

        if (isBoolean(value)) {
            return value;
        }

        if (isNumber(value) && value !== 0 && !isNaN(value)) {
            return true;
        }

        if (isString(value) && value.length > 0) {
            return true;
        }

        if (isObject(value)) {
            return true;
        }

        return false;
    }

    /**
     * Coerce a value to an integer
     * Idea by MDN, URL: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/from
     *
     * @param {mixed} value Value to convert
     * @return {number} New integer value
     */
    function toInteger(value) {
        // Convert to a number
        value = _nativeNumber(value);
        if (isNaN(value)) {
            return 0;
        }

        if (value === 0 || !isFinite(value)) {
            return value;
        }

        return (value > 0 ? 1 : -1) * _nativeMathFloor(_nativeMathAbs(value));
    }

    /**
     * Create an ISO-8601 date and time formatted string
     * Idea by inexorabletash, URL: https://github.com/inexorabletash/polyfill/blob/master/es5.js
     *
     * @param {date} date Date object to create an ISO-8601 formatted string
     * @return {string|null} ISO-8601 string format; otherwise, null
     */
    function toISOString(date) {
        if (!isDate(date)) {
            return null;
        }

        return date.getUTCFullYear() + '-' +
            stringPad(date.getUTCMonth() + 1, STRING_PADDING_CHAR, 2) + '-' +
            stringPad(date.getUTCDate(), STRING_PADDING_CHAR, 2) + 'T' +
            stringPad(date.getUTCHours(), STRING_PADDING_CHAR, 2) + ':' +
            stringPad(date.getUTCMinutes(), STRING_PADDING_CHAR, 2) + ':' +
            stringPad(date.getUTCSeconds(), STRING_PADDING_CHAR, 2) + '.' +
            stringPad(date.getUTCMilliseconds(), STRING_PADDING_CHAR, 3) + 'Z';
    }

    /**
     * Coerce a value to a safe length value
     * Idea by MDN, URL: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/from
     *
     * @param {mixed} value Value to convert
     * @return {number} New length value
     */
    function toLength(value) {
        value = toInteger(value);

        return _nativeMathMin(_nativeMathMax(value, 0), _nativeNumberMaxSafeInteger);
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

        return isNil(value) || _isObjectLike(value) ? STRING_EMPTY : (STRING_EMPTY + value);
    }

    /**
     * Trim characters from the left-hand and right-hand side of a string.
     * Idea by underscore.string, URL: https://github.com/epeli/underscore.string
     *
     * @param {string} value String value to trim
     * @param {string} characters Character set to trim. If not a string e.g. null or undefined, then the native String.prototype.trim will be used instead
     * @return {string} Trimmed string; otherwise, an empty string on error
     */
    function trim(value, characters) {
        return _trimmer(value, characters, _trim, function trimCharacters(characters) {
            return '^' + characters + '+|' + characters + '+$';
        });
    }

    /**
     * Trim characters from the left-hand side of a string
     *
     * @param {string} value String value to trim
     * @param {string} characters Character set to trim. If not a string e.g. null or undefined, then the native String.prototype.trimLeft will be used instead
     * @return {string} Trimmed string; otherwise, an empty string on error
     */
    function trimLeft(value, characters) {
        return _trimmer(value, characters, _trimLeft, function trimLeftCharacters(characters) {
            return '^' + characters + '+';
        });
    }

    /**
     * Trim characters from the right-hand side of a string
     *
     * @param {string} value String value to trim
     * @param {string} characters Character set to trim. If not a string e.g. null or undefined, then the native String.prototype.trimRight will be used instead
     * @return {string} Trimmed string; otherwise, an empty string on error
     */
    function trimRight(value, characters) {
        return _trimmer(value, characters, _trimRight, function trimRightCharacters(characters) {
            return characters + '+$';
        });
    }

    /**
     * An advanced variation of typeOf, that returns the classname instead of the primitive datatype e.g. 'array', 'date', 'null', 'regexp', string'
     * Idea by JavaScript Weblog, URL: https://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
     *
     * @param {mixed} value Variable to check
     * @return {string} Classname of the value
     */
    function type(value) {
        var tag = (_nativeObjectToString.call(value).match(_reTypeOf)[REGEXP_FIRST_MATCH] || 'undefined').toLowerCase();
        if (tag === 'number' && value !== value) {
            // Override number if a NaN
            tag = 'nan';
        }

        return tag;
    }

    /**
     * Override the default behaviour of typeof, by returning 'null' for a null value, 'array' for an array datatype or 'nan' for NaN
     * Idea by Douglas Crockford, URL: http://javascript.crockford.com/remedial.html
     *
     * @param {mixed} value Variable to check
     * @return {string} Datatype of the variable. See, URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof
     */
    function typeOf(value) {
        var type = typeof value;

        // Override the default return value of an object that is either an array or null
        if (type === 'object') {
            if (isArray(value)) {
                type = 'array';
            } else if (isNull(value)) {
                type = 'null';
            }
        } else if (isNaN(value)) {
            // Override number if a NaN
            type = 'nan';
        }

        return type;
    }

    /**
     * Generate a unique id string, with an optional prefix
     * Idea by underscore, URL: https://github.com/jashkenas/underscore/blob/master/underscore.js
     *
     * @param {boolean|number|string} prefix Optional prefix
     * @return {string} Unique id string
     */
    function uniqueId(prefix) {
        var id = STRING_EMPTY + (++_uniqueId);

        return isBoolean(prefix) || isNumber(prefix) || isString(prefix) ? prefix + id : id;
    }

    /**
     * Create an iFrame element
     *
     * @param {string} id Id of the iFrame
     * @param {string} src Source of the iFrame
     * @return {HTMLElement} iFrame element
     */
    function _createIFrame(id, src) {
        var iFrame = document.createElement('iframe');
        iFrame.height = '1px';
        iFrame.width = '1px';

        // Set the id of the iFrame
        if (isString(id)) {
            iFrame.id = id;
        }

        // Set the source of the iFrame
        if (isString(src)) {
            iFrame.src = src;
        }

        document.body.appendChild(iFrame);

        return iFrame;
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
        return _nativeObjectToString.call(value) === _objectStringsObject;
    }

    /**
     * Trim call around the native function or wrapper
     *
     * @param {string} value String value to trim
     * @return {string} Trimmed string
     */
    function _trim(value) {
        return isFunction(_nativeStringTrim) ?
            _nativeStringTrim.call(value) :
            value.replace(_reTrim, STRING_EMPTY);
    }

    /**
     * TrimLeft call around the native function or wrapper
     *
     * @param {string} value String value to trim
     * @return {string} Trimmed string
     */
    function _trimLeft(value) {
        return isFunction(_nativeStringTrimLeft) ?
            _nativeStringTrimLeft.call(value) :
            value.replace(_reTrimLeft, STRING_EMPTY);
    }

    /**
     * TrimRight call around the native function or wrapper
     *
     * @param {string} value String value to trim
     * @return {string} Trimmed string
     */
    function _trimRight(value) {
        return isFunction(_nativeStringTrimRight) ?
            _nativeStringTrimRight.call(value) :
            value.replace(_reTrimRight, STRING_EMPTY);
    }

    /**
     * Trim wrapper for trim, trimLeft and trimRight
     *
     * @param {string} value String value to trim
     * @param {string} characters Character set to trim. If not a string e.g. null or undefined, then the native String.prototype.trim will be used instead
     * @param {function} fnNative Native function to call if the character set is not a string
     * @param {function} fnCharacters Function to call once the character set has been escaped
     * @return {string} Trimmed string; otherwise, an empty string on error
     */
    function _trimmer(value, characters, fnNative, fnCharacters) {
        if (!isString(value) || value.length === 0) {
            return STRING_EMPTY;
        }

        // If not a string, then use the native function
        if (!isString(characters)) {
            return fnNative(value);
        }

        // Escape the meta regular expression characters
        characters = '[' + regExpEscape(characters) + ']';
        characters = fnCharacters(characters);

        return value.replace(new _nativeRegExp(characters, 'g'), STRING_EMPTY);
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
    var _publicAPI = {
        getAppName: getAppName,
        getVersion: getVersion,
        argumentsToArray: argumentsToArray,
        arrayClear: arrayClear,
        arrayFrom: arrayFrom,
        arrayIncludes: arrayIncludes,
        arrayOf: arrayOf,
        arrayPeek: arrayPeek,
        arrayRemove: arrayRemove,
        debounce: debounce,
        dom: dom,
        elementClosest: elementClosest,
        elementWrap: elementWrap,
        getAbsoluteUrl: getAbsoluteUrl,
        getCSSProperty: getCSSProperty,
        getGlobals: getGlobals,
        getjQueryOuterHTML: getjQueryOuterHTML,
        has: has,
        hasAdBlocker: hasAdBlocker,
        imageExists: imageExists,
        include: include,
        isAlNum: isAlNum,
        isAlpha: isAlpha,

        // isArguments: isArguments,
        isArray: isArray,
        isASCII: isASCII,
        isBase64: isBase64,

        // isBoolean: isBoolean,
        isBrowser: isBrowser,
        isCallable: isFunction,
        isChar: isChar,

        // isDate: isDate,
        isDefined: isDefined,
        isElement: isElement,
        isEmpty: isEmpty,

        // isError: isError,
        isEven: isEven,
        isFinite: isFinite,
        isFloat: isFloat,
        isFunction: isFunction,

        // isGeneratorFunction: isGeneratorFunction,
        isGUID: isGUID,
        isHex: isHex,
        isInteger: isInteger,
        isjQuery: isjQuery,
        isjQueryNotEmpty: isjQueryNotEmpty,

        // isMap: isMap,
        isNaN: isNaN,
        isNil: isNil,
        isNotNil: isNotNil,
        isNotNull: isNotNull,

        // isNull: isNull,
        isNullOrUndefined: isNil,

        // isNumber: isNumber,

        isObject: isObject,
        isObjectLiteral: isObjectLiteral,
        isOdd: isOdd,
        isPrime: isPrime,

        // isPromise: isPromise,
        // isRegExp: isRegExp,
        isSafeInteger: isSafeInteger,

        // isSet: isSet,
        // isString: isString,
        isStringEmptyOrWhitespace: isStringEmptyOrWhitespace,
        isStringBoolean: isStringBoolean,
        isStringFloat: isStringFloat,
        isStringInteger: isStringInteger,
        isStringNotEmpty: isStringNotEmpty,
        isStringNumber: isStringNumber,
        isStringOctal: isStringOctal,

        // isUndefined: isUndefined,
        isUndefinedAssignable: isUndefinedAssignable,
        isValidFileExtension: isValidFileExtension,

        // isWeakMap: isWeakMap,
        // isWeakSet: isWeakSet,
        isWindow: isWindow,
        keys: keys,
        mathSign: mathSign,
        mathTrunc: mathTrunc,
        noop: noop,
        now: now,
        objectForEach: objectForEach,
        objectIs: objectIs,
        objectNamespace: objectNamespace,
        once: once,
        queueFn: queueFn,
        ready: ready,
        regExpEscape: regExpEscape,
        regExpFlags: regExpFlags,
        padDigits: padDigits,
        parseHTML: parseHTML,
        randomNumber: randomNumber,
        safeFunction: safeFunction,
        sprintf: stringFormat,
        stringAddCR: stringAddCR,
        stringAddLF: stringAddLF,
        stringContains: stringContains,
        stringEndsWith: stringEndsWith,
        stringEscapeHTML: stringEscapeHTML,
        stringFormat: stringFormat,
        stringIncludes: stringContains,
        stringLCFirst: stringLCFirst,
        stringMap: stringMap,
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
        stringToCamelCase: stringToCamelCase,
        stringToCharArray: stringToCharArray,
        stringToKebabCase: stringToKebabCase,
        stringToNumber: stringToNumber,
        stringToSnakeCase: stringToSnakeCase,
        stringTrimLeft: stringTrimLeft,
        stringTrimRight: stringTrimRight,
        stringTrunc: stringTrunc,
        stringUCFirst: stringUCFirst,
        throwError: throwError,
        toArray: arrayFrom,
        toBoolean: toBoolean,
        toInteger: toInteger,
        toISOString: toISOString,
        toLength: toLength,
        toString: toString,
        trim: trim,
        trimLeft: trimLeft,
        trimRight: trimRight,
        type: type,
        typeOf: typeOf,
        uniqueId: uniqueId,
    };

    /**
     * isType module
     * Idea by YourJS, URL: http://yourjs.com/snippets
     *
     * @param {object} global Global object to extend with the following isType functions
     * @return {undefined}
     */
    (function isTypeModule(global) {
        var typeNames = [
            'Arguments',
            'Array',
            'Boolean',
            'Date',
            'Error',
            'Float32Array',
            'Float64Array',
            'Function',
            'GeneratorFunction',
            'Int32Array',
            'Int8Array',
            'Map',
            'Null',
            'Number',
            'Object',
            'Promise',
            'RegExp',
            'Set',
            'String',
            'Symbol',
            'Uint16Array',
            'Uint32Array',
            'Uint8Array',
            'Uint8ClampedArray',
            'Undefined',
            'WeakMap',
            'WeakSet',
        ];

        typeNames.forEach(function forEachTypeName(typeName) {
            var typeNameMatch = typeName.toLowerCase();
            var isType = 'is' + typeName;

            // Extend if a function doesn't exist on the global object already
            global[isType] = isFunction(global[isType]) ? global[isType] : function isTypeNameMatch(value) {
                return type(value) === typeNameMatch;
            };
        });
    })(_publicAPI);

    return _publicAPI;
})(window, window.document, window.jQuery);

/**
 * Create a namespace. Idea based on the work by Nikolas C. Zakas from Maintainable JavaScript
 *
 * @param {string} namespacePath A namespace comprised of optional parts e.g. App.system.clock
 * @return {object} Context of this, based on the last part in the namespace e.g. this would be equal to the 'clock' object reference
 */
App.namespace = function namespace(namespacePath) {
    var _this = this;

    // Return the context this being the root object, if not a valid string
    if (!App.core.isString(namespacePath) || App.core.isStringEmptyOrWhitespace(namespacePath)) {
        return _this;
    }

    namespacePath.split('.').forEach(function forEachPart(part) {
        _this[part] = _this[part] || {};
        _this = _this[part];
    });

    return _this;
};
