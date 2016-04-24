/* global App */

/**
 * API module
 *
 * Modified: 2016/02/07
 * @author softwarespot
 */
App.namespace('core').api = (function apiModule(window, document, $, core) {
    // Constants

    // SemVer version number of the module
    var VERSION = '1.0.0';

    // Unique global identifier. Internal usage only
    // var GUID = '8DC11C84-F6C5-45FE-8CFA-63F94A68C291';

    /**
     * Common HTTP status codes
     *
     * @type {object}
     */
    var httpStatus = {

        // Success

        /**
         * The request has succeeded
         * @type {number}
         */
        OK: 200,

        /**
         * The server successfully created a new resource
         * @type {number}
         */
        CREATED: 201,

        /**
         * The server successfully processed the request, though no content is returned
         * @type {number}
         */
        NO_CONTENT: 204,

        // Redirection

        /**
         * Indicates multiple options for the resource that the client may follow
         * @type {number}
         */
        MULTIPLE_CHOICES: 300,

        /**
         * The resource has not been modified since the last request
         * @type {number}
         */
        NOT_MODIFIED: 304,

        // Client Error

        /**
         * The request cannot be fulfilled due to multiple errors
         * @type {number}
         */
        BAD_REQUEST: 400,

        /**
         * The user is unauthorized to access the requested resource
         * @type {number}
         */
        UNAUTHORIZED: 401,

        /**
         * The requested resource is unavailable at this present time
         * @type {number}
         */
        FORBIDDEN: 403,

        /**
         * The requested resource could not be found
         *
         * Note: This is sometimes used to mask if there was an UNAUTHORIZED (401) or
         * FORBIDDEN (403) error, for security reasons
         * @type {number}
         */
        NOT_FOUND: 404,

        /**
         * The request method is not supported by the following resource
         * @type {number}
         */
        METHOD_NOT_ALLOWED: 405,

        /**
         * The request was not acceptable
         * @type {number}
         */
        NOT_ACCEPTABLE: 406,

        /**
         * The request could not be completed due to a conflict with the current state
         * of the resource
         * @type {number}
         */
        CONFLICT: 409,

        // Server Error

        /**
         * The server encountered an unexpected error
         *
         * Note: This is a generic error message when no specific message
         * is suitable
         * @type {number}
         */
        INTERNAL_SERVER_ERROR: 500,

        /**
         * The server does not recognise the request method
         * @type {number}
         */
        NOT_IMPLEMENTED: 501,
    };

    /**
     * Common RESTful methods
     *
     * @type {object}
     */
    var methods = {
        DELETE: 'delete',
        GET: 'get',
        PATCH: 'patch',
        POST: 'post',
        PUT: 'put',
    };

    // Fields

    // Store if the module has been initialised
    var _isInitialised = false;

    // Store the document jQuery selector object
    var _$document = null;

    // Initialise the module
    $(function apiReady() {
        init();
    });

    // Public API
    return {
        init: init,
        destroy: destroy,
        getVersion: getVersion,
        HTTPStatus: httpStatus,
        Methods: methods,
        parseUrl: parseUrl,
    };

    // Methods

    /**
     * Initialise the module
     *
     * @param {object} config Options to configure the module
     * @return {undefined}
     */
    function init(/* config */) {
        if (_isInitialised) {
            return;
        }

        // Default config that can be overwritten by passing through the config variable
        // var defaultConfig = core.objectEmpty();

        // Combine the passed config
        // $.extend(defaultConfig, config);

        _cacheDom();
        _setAjaxGlobal();

        _isInitialised = true;
    }

    /**
     * Destroy the module
     *
     * @return {undefined}
     */
    function destroy() {
        _$document = null;
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

    /**
     * Parse a url by replacing segments such as {item}, with the object literal key value e.g. object.item
     *
     * @param {string} url Url string to parse
     * @param {object} object Object literal with one level only. The keys should match the segments in the url
     * @return {string} Parsed string; otherwise, empty string
     */
    function parseUrl(url, object) {
        return core.stringSupplant(url, object);
    }

    /**
     * Initialise all DOM cachable variables
     *
     * @return {undefined}
     */
    function _cacheDom() {
        _$document = $(document);
    }

    /**
     * Set display the NProgress nano bar when an ajax request is taking place
     *
     * @returns {undefined}
     */
    function _setAjaxGlobal() {
        // Disable showing the spinner in the top right hand corner
        window.NProgress.configure({
            minimum: 0.1,
            showSpinner: false,
        });

        // When an ajax request is started
        _$document.ajaxStart(function ajaxStart() {
            window.NProgress.start();
        });

        // When an ajax request has stopped
        _$document.ajaxStop(function ajaxStop() {
            window.NProgress.done();
        });
    }

    /**
     * Initialise all DOM cachable variables
     *
     * @return {undefined}
     */

    // function _cacheDom() {}
}(window, window.document, window.jQuery, window.App.core));
