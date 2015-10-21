/* global App */

// https://api.github.com/users/softwarespot
// https://github.com/users/softwarespot/contributions

/**
 * GitHub module
 *
 * Modified: 2015/10/20
 * @author softwarespot
 */
App.namespace().github = (function (window, document, $, core, undefined) {
    // Constants
    var API = {
        getGitHubByUser: 'https://api.github.com/users/{username}'
    };

    // SemVer version number of the module
    var VERSION = '1.0.0';

    // Unique global identifier. Internal usage only
    // var GUID = 'EBF09F7D-008B-4B56-8227-0B5378649968';

    // Fields

    // Store if the module has been initialised
    var _isInitialised = false;

    // Store the jQuery selector object to add the GitHub data
    var $_content = null;

    // Template string selectors
    var _templateDone = '';
    var _templateFail = '';

    // Methods

    /**
     * Initialise the module
     *
     * @param {object} config Options to configure the module
     * @return {undefined}
     */
    function init(config) {
        core.api.init();

        // Default config that can be overwritten by passing through the config variable
        var defaultConfig = {
            github: null
        };

        // Combine the passed config
        $.extend(defaultConfig, config);

        // Store the template strings
        _templateDone = config.github.templates.done;
        _templateFail = config.github.templates.fail;

        _cacheDom(config.github.content);
        _load(config.github.username);

        _isInitialised = true;
    }

    /**
     * Destroy the module
     *
     * @return {undefined}
     */
    function destroy() {
        $_content = null;
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
     * Initialise all DOM cachable variables
     *
     * {string} content Content to add the github data
     * @return {undefined}
     */
    function _cacheDom(content) {
        $_content = $(content);
    }

    /**
     * Load github for a particular user. Uses API: https://developer.github.com/v3/github/
     *
     * @param {object} config Configuration object literal
     * @return @return {undefined}
     */
    function _load(username) {
        var options = {
            // Replace the '{username}' with the user's username
            url: API.getGitHubByUser.replace('{username}', username),
            method: 'get',
            dataType: 'jsonp',
            cache: false
        };

        // Store the jQuery XHR object reference
        var jqxhr = $.ajax(options);

        // If the request completed successfully
        jqxhr.done(function (response, textStatus, $this) {
            window.console.log(response);
            window.console.log(textStatus);
            window.console.log($this);

            // Is the HTTP status code equal to OK (200)?
            var isSuccess = response.meta.status === core.api.HTTPStatus.OK;
            _render(isSuccess, isSuccess ? response.data : null);
        });

        // If the request failed
        jqxhr.fail(function ($this, textStatus, errorThrown) {
            window.console.log($this);
            window.console.log(textStatus);
            window.console.log(errorThrown);

            _render(false, null);
        });
    }

    /**
     * Render the github data
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

    // Invoked when the DOM has loaded
    $(function () {
        // init();
    });

    // Public API
    return {
        init: function () {
            init({
                github: {
                    username: 'softwarespot',
                    content: '#github-section',
                    templates: {
                        fail: '#template-github-error',
                        done: '#template-github'
                    }
                }
            });
        },

        destroy: destroy,
        getVersion: getVersion
    };
})(this, this.document, this.jQuery, this.App.core);
