/* global App */

/**
 * Main module
 *
 * Modified: 2015/09/12
 * @author softwarespot
 */
App.namespace().main = (function ($, window, document, core, undefined) {
    // Constants

    // SemVer version number of the module
    var VERSION = '1.0.0';

    // Unique global identifier. Internal usage only
    // var GUID = '3B732ADD-7465-4972-9E5C-C005DBED2751';

    // Fields

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

        _cacheDom();
    }

    /**
     * Destroy the module
     *
     * @return {undefined}
     */
    function destroy() {}

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
    function _cacheDom() {}

    // Initialise the module
    $(function () {
        // init();
    });

    // Public API
    return {
        init: init,
        destroy: destroy,
        getVersion: getVersion
    };
})(jQuery, window, document, App.core);
