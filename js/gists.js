/* global NProgress */

// Create an 'App' namespace if it doesn't already exist
var App = App || {};

/**
 * Gists module
 *
 * Modified: 2015/09/10
 * @author softwarespot
 */
App.gists = (function ($, window, document, undefined) {
    // Constants
    var API = {
        get_gists_by_user: 'https://api.github.com/users/{username}/gists',
        get_gist_by_id: 'https://api.github.com/gists/{id}'
    };

    // HTTP Status Codes
    var HTTP_OK = 200;

    // SemVer version number of the module
    var VERSION = '1.0.0';

    // Unique global identifier. Internal usage only
    // var GUID = 'EBF09F7D-008B-4B56-8227-0B5378649968';

    // Fields

    // Store the document jQuery selector object
    var $_document = null;

    // Store the jQuery selector object to add the gists data
    var $_content = null;

    // Template string selectors
    var _templateDone = '';
    var _templateFail = '';

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
            gists: null
        };

        // Combine the passed config
        $.extend(defaultConfig, config);

        // Store the template strings
        _templateDone = config.gists.templates.done;
        _templateFail = config.gists.templates.fail;

        _cacheDom(config.gists.content);
        _setAjaxGlobal();
        _load(config.gists.username);
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
     * {string} content Content to add the gists data
     * @return {undefined}
     */
    function _cacheDom(content) {
        $_document = $(document);
        $_content = $(content);
    }

    /**
     * Load gists for a particular user. Uses API: https://developer.github.com/v3/gists/
     *
     * @param  {object} config Configuration object literal
     * @return @return {undefined}
     */
    function _load(username) {
        var options = {
            // Replace the '{username}' with the user's username
            url: API.get_gists_by_user.replace('{username}', username),
            method: 'get',
            dataType: 'jsonp',
            cache: false
        };

        // Store the jQuery XHR object reference
        var jqxhr = $.ajax(options);

        // If the request completed successfully
        jqxhr.done(function (response, textStatus, $this) {
            console.log(response);
            console.log(textStatus);
            console.log($this);

            // Is the HTTP status code equal to OK (200)?
            var isSuccess = response.meta.status === HTTP_OK;
            _render(isSuccess, isSuccess ? response.data : null);
        });

        // If the request failed
        jqxhr.fail(function ($this, textStatus, errorThrown) {
            console.log($this);
            console.log(textStatus);
            console.log(errorThrown);

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
        $_content.handlebars('add', isSuccess ? _templateDone : _templateFail, data, {
            remove_type: 'same',
            validate: isSuccess
        });
    }

    /**
     * Set display the NProgress nano bar when an ajax request is taking place
     *
     * @returns {undefined}
     */
    function _setAjaxGlobal() {
        // Disable showing the spinner in the top right hand corner
        NProgress.configure({
            minimum: 0.1,
            showSpinner: false
        });

        // When an ajax request is started
        $_document.ajaxStart(function () {
            NProgress.start();
        });

        // When an ajax request has stopped
        $_document.ajaxStop(function () {
            NProgress.done();
        });

    }

    // Invoked when the DOM has loaded
    $(function () {
        // init();
    });

    // Public API
    return {
        init: function () {
            init({
                gists: {
                    username: 'softwarespot',
                    content: '#gists-section',
                    templates: {
                        fail: '#template-gists-error',
                        done: '#template-gists'
                    }
                }
            });
        },
        getVersion: getVersion
    };
})(jQuery, window, document);
