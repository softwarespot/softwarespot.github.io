/* global App */

/**
 * Features module
 *
 * HTML5 feature detection based on the concepts and ideas by Modernizr
 * @link http://html5please.com/
 * @link http://caniuse.com/
 * @link https://github.com/NielsLeenheer/html5test/
 *
 * Modified: 2015/12/06
 * @author softwarespot
 */
App.namespace('core').features = (function featuresModule(window, document, $, core, undefined) {
    // Constants

    // SemVer version number of the module
    var VERSION = '1.0.0';

    // Unique global identifier. Internal usage only
    // var GUID = '3B8C44B7-6A3B-4F84-A031-2D7B5D4ED211';

    // Fields

    // Store if the module has been initialised
    var _isInitialised = false;

    // Native functions
    var _nativeCSS = window.CSS;
    var _nativeHistory = window.history;
    var _nativeLocalStorage = window.localStorage;
    var _nativeNavigator = window.navigator;
    var _nativePromise = window.Promise;
    var _nativeSessionStorage = window.sessionStorage;

    // Store has* results
    // Note: Opera 12 supports window.supportsCSS according to caniuse.com
    var _hasCSSSupports = (core.isFunction(_nativeCSS) && core.isFunction(_nativeCSS.supports)) || window.supportsCSS;
    var _hasGeoLocation = core.isObject(_nativeNavigator) &&
        'geolocation' in _nativeNavigator;

    var _hasHistory = core.isObject(_nativeHistory) &&
        'pushState' in _nativeHistory;

    var _hasLocalStorage = _isStorage(_nativeLocalStorage);
    var _hasSessionStorage = _isStorage(_nativeSessionStorage);
    var _hasWebStorage = _hasLocalStorage && _hasSessionStorage;

    var _hasPromise = core.isFunction(_nativePromise) &&
        'all' in _nativePromise &&
        'race' in _nativePromise &&
        'reject' in _nativePromise &&
        'resolve' in _nativePromise;

    // Hold the input data, with the key being the input type and the value of either true or false as
    // whether or not it's supported by the following browser
    var _inputs = null;

    // Methods

    /**
     * Initialise the module
     *
     * @return {undefined}
     */
    function init() {
        if (_isInitialised) {
            return;
        }

        // Initialise the input object literal
        _getInputs();

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
     * Get the version number of the module
     *
     * @returns {number} Version number
     */
    function getVersion() {
        return VERSION;
    }

    // CSS

    /**
     * Checl if CSSSupports exists
     *
     * @return {boolean} True, the feature exists; otherwise, false
     */
    function hasCSSSupports() {
        return _hasCSSSupports;
    }

    // EVENTS
    // https://github.com/Modernizr/Modernizr/blob/master/src/hasEvent.js
    // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/hashchange.js

    // HISTORY

    /**
     * Check if the History API exists
     *
     * Based on the concept by Modernizr URL: https://github.com/Modernizr/Modernizr/blob/master/feature-detects/history.js
     *
     * @return {boolean} True, the feature exists; otherwise, false
     */
    function hasHistory() {
        return _hasHistory;
    }

    // GEOLOCATION

    /**
     * Check if the geolocation API exists
     *
     * Based on the concept by Modernizr, URL: https://github.com/Modernizr/Modernizr/blob/master/feature-detects/geolocation.js
     *
     * @return {boolean} True, the feature exists; otherwise, false
     */
    function hasGeoLocation() {
        return _hasGeoLocation;
    }

    // INPUTS

    /**
     * Check if an input type is supported
     *
     * @param {string} inputType Input type
     * @return {boolean} True the type is supported; otherwise, false
     */
    function hasInput(inputType) {
        // Coerce as a string
        var hasInputResult = _inputs[core.toString(inputType)];
        return core.isUndefined(hasInputResult) ? false : hasInputResult;
    }

    /**
     * Initialise the input object literal
     *
     * Based on the concept by Modernizr, URL: https://github.com/Modernizr/Modernizr/commits/master/feature-detects/inputtypes.js
     *
     * @return {undefined}
     */
    function _getInputs() {
        if (!core.isNull(_inputs)) {
            return;
        }

        // Regular expressions
        var reEmailNumberUrl = /^(?:email|number|url)$/;
        var reRange = /(?:^range$)/;
        var reSearchTel = /^(?:search|tel)$/;

        // Create an empty object literal
        _inputs = {};

        // Input types that will are split as an array
        var inputTypes = 'color date datetime datetime-local email month number range search tel time url week'.split(' ');

        // Create a temporary input element
        var input = document.createElement('input');

        // Document element to bind the input element to
        var documentElem = document.documentElement;

        // Inline stylesheet
        var cssStyles = 'position:absolute;visibility:hidden;';

        // Data to test with
        var testData = '=)';

        // Iterate through the array. A polyfill is available at
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach#Polyfill
        inputTypes.forEach(function forEachInputType(inputType) {

            // Set the attribute type of the input element
            input.setAttribute('type', inputType);

            // Check the type is not text and that it contains a 'style' property
            var isValid = input.type !== 'text' && 'style' in input;

            // If invalid then simply return and don't continue
            if (!isValid) {
                return;
            }

            // First check to see if the type we give it sticks
            // If the type does, we feed it a textual value, which shouldn't be valid
            // If the value doesn't stick, we know there's input sanitization which infers a custom UI
            input.value = testData;

            // Set the style of the input element
            input.style.cssText = cssStyles;

            // If a range type
            if (reRange.test(inputType) && core.isDefined(input.style.WebkitAppearance)) {

                // Append the input element to the current document
                documentElem.appendChild(input);

                // Cache the defaultView
                var defaultView = document.defaultView;

                // Safari 2-4 allows the smiley as a value, despite making a slider
                isValid = defaultView.getComputedStyle &&

                    defaultView.getComputedStyle(input, null)
                    .WebkitAppearance !== 'textfield' &&

                    // The mobile Android web browser has a false positive, so
                    // check the height to see if the widget is actually there
                    (input.offsetHeight !== 0);

                documentElem.removeChild(input);

                // If a search or tel type
            } else if (reSearchTel.test(inputType)) {
                // Specification doesn't define any special parsing or detectable UI
                // behaviours so we pass these through as true

                // Interestingly, Opera fails the earlier test, so it doesn't
                // even make it here (I doubt anymore!)

                // If a email, number or url type
            } else if (reEmailNumberUrl.test(inputType)) {

                // The following types come with pre-backed validation
                isValid = input.checkValidity && input.checkValidity() === false;

                // For all other types check if the value has been sanitised
            } else {

                // If the upgraded input component rejects the :) text, we've got a winner
                isValid = input.value !== testData;

            }

            // Add to the internal object literal
            _inputs[inputType] = !!isValid;

        });
    }

    // PROMISE

    /**
     * Check if the Promise API exists
     *
     * Based on the concept by Modernizr URL: https://github.com/Modernizr/Modernizr/blob/master/feature-detects/es6/promises.js
     *
     * @return {boolean} True, the feature exists; otherwise, false
     */
    function hasPromise() {
        return _hasPromise;
    }

    // STORAGE

    /**
     * Check if the localStorage API exists
     *
     * Based on the concept by Modernizr, URL: https://github.com/Modernizr/Modernizr/blob/master/feature-detects/storage/localstorage.js
     *
     * @return {boolean} True, the feature exists; otherwise, false
     */
    function hasLocalStorage() {
        return _hasLocalStorage;
    }

    /**
     * Check if the sessionStorage API exists
     *
     * Based on the concept by Modernizr, URL: https://github.com/Modernizr/Modernizr/blob/master/feature-detects/storage/sessionstorage.js
     *
     * @return {boolean} True, the feature exists; otherwise, false
     */
    function hasSessionStorage() {
        return _hasSessionStorage;
    }

    /**
     * Check if a valid storage object
     *
     * @param {type} storage Storage object
     * @return {boolean} storage True, is valid storage object; otherwise, false
     */
    function _isStorage(storage) {
        return core.isObject(storage) &&
            'key' in storage &&
            'getItem' in storage &&
            'setItem' in storage &&
            'removeItem' in storage &&
            'clear' in storage;
    }

    /**
     * Check if the webStorage API exists
     *
     * Based on the concept by Modernizr, URL: https://github.com/Modernizr/Modernizr/blob/master/feature-detects/storage/
     *
     * @return {boolean} True, the feature exists; otherwise, false
     */
    function hasWebStorage() {
        return _hasWebStorage;
    }

    // Public API
    return {
        init: init,
        destroy: destroy,
        getVersion: getVersion,
        hasCSSSupports: hasCSSSupports,
        hasHistory: hasHistory,
        hasPromise: hasPromise,
        hasInput: hasInput,
        hasLocalStorage: hasLocalStorage,
        hasSessionStorage: hasSessionStorage,
        hasWebStorage: hasWebStorage,
        hasGeoLocation: hasGeoLocation,
    };
})(window, window.document, window.jQuery, window.App.core);
