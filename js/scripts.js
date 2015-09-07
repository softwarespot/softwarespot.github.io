/**
 * Custom JS
 *
 * Modified: 2015/09/07
 * @author softwarespot
 */

// Create an 'App' namespace if it doesn't already exist
var App = App || {};

// Start module
App.start = (function ($) {
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
            var href = event.toElement.getAttribute('href');

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

    /**
     * Initialisation function
     *
     * @return {undefined}
     */
    function init() {
        cacheDom();
        bindEvents();
    }

    /**
     * Initialise all DOM cache variables
     *
     * @return {undefined}
     */
    function cacheDom() {
        $_body = $('body');
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

    // Invoked when the DOM has loaded
    $(function () {
        init();
    });

})(jQuery);
