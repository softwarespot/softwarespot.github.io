/* global App */

/**
 * Main module
 *
 * Modified: 2016/02/04
 * @author softwarespot
 */
App.namespace().main = (function mainModule(window, document, $) {
    // Constants

    // SemVer version number of the module
    var VERSION = '1.0.0';

    // Unique global identifier. Internal usage only
    // var GUID = '3B732ADD-7465-4972-9E5C-C005DBED2751';

    // Fields

    // Store if the module has been initialised
    // var _isInitialised = false;

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

        _cacheDom();

        // _isInitialised = true;
    }

    /**
     * Destroy the module
     *
     * @return {undefined}
     */
    function destroy() {
        // _isInitialised = false;
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
    function _cacheDom() {
        // Empty
    }

    // Initialise the module
    $(function mainReady() {
        // init();
    });

    // Public API
    return {
        init: init,
        destroy: destroy,
        getVersion: getVersion,
    };
}(window, window.document, window.jQuery, window.App.core));
