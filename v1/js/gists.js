/* global App */

/**
 * Gists module
 *
 * Modified: 2016/05/29
 * @author softwarespot
 */
App.namespace().gists = (function gistsModule(window, document, $, core) {
    // Constants

    // SemVer version number of the module
    var VERSION = '1.0.0';

    // Unique global identifier. Internal usage only
    // var GUID = 'EBF09F7D-008B-4B56-8227-0B5378649968';

    // API resource URIs
    var _api = {
        GET_GISTS_BY_USER: 'https://api.github.com/users/{username}/gists',
        GET_GIST_BY_ID: 'https://api.github.com/gists/{id}',
    };

    // Fields

    // Store if the module has been initialised
    // var _isInitialised = false;

    // Store the jQuery selector object to add the gists data
    var _$content = null;

    // Template string selectors
    var _templateDone = '';
    var _templateFail = '';

    // Initialise the module
    core.ready(function gistsReady() {
        // init();
    });

    // Public API
    return {
        init: function init() {
            _init({
                dom: {
                    // Required property
                    html: '#gists-section',
                },
                templates: {
                    fail: '#template-gists-error',
                    done: '#template-gists',
                },
                username: 'softwarespot',
            });
        },

        destroy: destroy,
        getVersion: getVersion,
    };

    // Methods

    /**
     * Initialise the module
     *
     * @param {object} config Options to configure the module
     * @return {undefined}
     */
    function _init(config) {
        core.api.init();

        // Default config that can be overwritten by passing through the config variable
        var defaultConfig = core.objectEmpty();

        // Combine the passed config
        $.extend(defaultConfig, config);

        // Store the template strings
        _templateDone = config.templates.done;
        _templateFail = config.templates.fail;

        _cacheDom(config.dom);
        _load(config.username);

        // _isInitialised = true;
    }

    /**
     * Destroy the module
     *
     * @return {undefined}
     */
    function destroy() {
        _$content = null;

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
     * @param {object} dom Object literal containing strings to locate the DOM nodes
     * @return {undefined}
     */
    function _cacheDom(dom) {
        _$content = $(dom.html);
    }

    /**
     * Load gists for a particular user. Uses API: https://developer.github.com/v3/gists/
     *
     * @param {object} config Configuration object literal
     * @return @return {undefined}
     */
    function _load(username) {
        var options = {
            // Replace the '{username}' with the user's username
            url: core.api.parseUrl(_api.GET_GISTS_BY_USER, {
                username: username,
            }),
            method: 'get',
            dataType: 'jsonp',
            cache: false,
        };

        // Store the jQuery XHR object reference
        var jqxhr = $.ajax(options);

        // If the request completed successfully
        jqxhr.done(function done(response /* , textStatus, $this */) {
            // window.console.log(response);
            // window.console.log(textStatus);
            // window.console.log($this);

            // Is the HTTP status code equal to OK (200)?
            var isSuccess = response.meta.status === core.api.HTTPStatus.OK;
            _render(isSuccess, isSuccess ? response.data : null);
        });

        // If the request failed
        jqxhr.fail(function fail(/* $this, textStatus, errorThrown */) {
            // window.console.log($this);
            // window.console.log(textStatus);
            // window.console.log(errorThrown);

            _render(false, null);
        });
    }

    /**
     * Render the gists data
     *
     * @param {boolean} isSuccess True renders the 'done' template; otherwise, false renders the 'fail' template
     * @param {object} data Data to pass to the template
     * @return {undefined}
     */
    function _render(isSuccess, data) {
        _$content.handlebars('add', isSuccess ? _templateDone : _templateFail, data, {
            removeType: 'same',
            validate: isSuccess,
        });
    }
})(window, window.document, window.jQuery, window.App.core);
