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

    // Methods

    /**
     * Initialisation function
     *
     * @return {undefined}
     */
    function init(config) {
        // Default config that can be overwritten by passing through the config variable
        var defaultConfig = {
            gists: null
        };

        // Combine the passed config
        $.extend(defaultConfig, config);

        cacheDom();
        setAjaxGlobal();
        load(config.gists);
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
        $_document = $(document);
    }

    /**
     * Load gists of a particular user. Uses API: https://developer.github.com/v3/gists/
     *
     * @param  {object} config Configuration object literal
     * @return @return {undefined}
     */
    function load(config) {
        var options = {
            // Replace the '{username}' with the user's username
            url: API.get_gists_by_user.replace('{username}', config.username),
            method: 'get',
            dataType: 'jsonp',
            cache: false
        };

        // Create a fail template function expression to call later on
        var failTemplate = function () {
            $(config.content).handlebars('add', config.templates.fail, null, {
                validate: false
            });
        };

        // Store the jQuery XHR object reference
        var jqxhr = $.ajax(options);

        // If the request completed successfully
        jqxhr.done(function (response, textStatus, $this) {
            console.log(response);
            console.log(textStatus);
            console.log($this);

            // If the status code is not OK, then display the fail template
            if (response.meta.status === HTTP_OK) {
                // Add the response to the template
                $(config.content).handlebars('add', config.templates.done, response.data);
            } else {
                failTemplate();
            }
        });

        // If the request failed
        jqxhr.fail(function ($this, textStatus, errorThrown) {
            console.log($this);
            console.log(textStatus);
            console.log(errorThrown);

            failTemplate();
        });
    }

    /**
     * Set display the NProgress nano bar when an ajax request is taking place
     *
     * @returns {undefined}
     */
    function setAjaxGlobal() {
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
    });

    // Public API
    return {
        getVersion: getVersion
    };
})(jQuery, window, document);
