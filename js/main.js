// Create an 'App' namespace if it doesn't already exist
var App = App || {};

/**
 * Main module
 *
 * Modified: 2015/09/09
 * @author softwarespot
 */
App.main = (function ($) {
    // Constants

    // SemVer version number of the module
    var VERSION = '1.0.0';

    // Unique global identifier. Internal usage only
    // var GUID = '3B732ADD-7465-4972-9E5C-C005DBED2751';

    // Fields

    // Store the body jQuery selector object
    var $_body = null;

    // Store the navigation hyperlinks jQuery selector object
    var $_navigationLinks = null;

    // Has the events been binded
    var _isEventsBound = false;

    // Events object
    var _events = {
        click: 'click.app.main',
        navigation: function (event) {
            // Prevent default click propagation
            event.preventDefault();

            // Get the href attribute using vanilla JavaScript
            var href = event.currentTarget.getAttribute('href');

            // Get the jQuery selector object based on the href attribute value
            var $element = $(href);

            // If an error occurred i.e. no node was found in the DOM, the return false
            if (!$element.length) {
                return false;
            }

            // Scroll to the element intended
            scrollTo($element, 500);

            // Fallback to prevent jitter
            return false;
        }
    };

    // Methods

    /**
     * Initialisation function
     *
     * @param {object} config Options to configure the module
     * @return {undefined}
     */
    function init(config) {
        // Default config that can be overwritten by passing through the config variable
        var defaultConfig = {
        };

        // Combine the passed config
        $.extend(defaultConfig, config);

        cacheDom();
        bindEvents();
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
     * Initialise all DOM cachable variables
     *
     * @return {undefined}
     */
    function cacheDom() {
        $_body = $('html, body');
        $_navigationLinks = $('header').find('a');
    }

    /**
     * Bind events
     *
     * @return {undefined}
     */
    function bindEvents() {
        if (_isEventsBound) {
            return;
        }

        // Navigation hyperlink elements
        $_navigationLinks.on(_events.click, _events.navigation);
        _isEventsBound = true;
    }

    /**
     * Unbind events
     *
     * @return {undefined}
     */
    function unbindEvents() {
        if (!_isEventsBound) {
            return;
        }

        $_navigationLinks.off(_events.click);
        _isEventsBound = false;
    }

    /**
     * Scroll to an element on the page
     *
     * @param  {HTMLElement} $element jQuery HTMLElement node object
     * @param  {number|string} speed Speed at which to scroll the element
     * @return {undefined}
     */
    function scrollTo($element, speed) {
        if (typeof speed === 'undefined') {
            speed = 500;
        }

        // Animate from the body to the top of the element's offset position
        $_body.animate({
            scrollTop: $element.offset().top
        }, speed);
    }

    // Initialise the module
    $(function () {
        init();
    });

    // Public API
    return {
        getVersion: getVersion
    };
})(jQuery);
