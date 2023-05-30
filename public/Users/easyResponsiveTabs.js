function jQuery() {

}

(function ($) {
    $.fn.extend({
        easyResponsiveTabs: function (options) {
            // Set the default values, use comma to separate the settings, example:
            const defaults = {
                type: 'default', // default, vertical, accordion;
                width: 'auto',
                fit: true
            };
            // Variables
            // eslint-disable-next-line no-redeclare
            const opt = $.extend(defaults, options);
            const jtype = opt.type;
            const jfit = opt.fit;
            const jwidth = opt.width;
            const vtabs = 'vertical';
            const accord = 'accordion';

            // Main function
            this.each(function () {
                const $respTabs = $(this);
                $respTabs.find('ul.resp-tabs-list li').addClass('resp-tab-item');
                $respTabs.css({
                    display: 'block',
                    width: jwidth
                });

                $respTabs.find('.resp-tabs-container > div').addClass('resp-tab-content');
                // eslint-disable-next-line no-use-before-define
                jtab_options();
                // Properties Function
                function jtab_options() {
                    if (jtype === vtabs) {
                        $respTabs.addClass('resp-vtabs');
                    }
                    if (jfit === true) {
                        $respTabs.css({ width: '100%', margin: '0px' });
                    }
                    if (jtype === accord) {
                        $respTabs.addClass('resp-easy-accordion');
                        $respTabs.find('.resp-tabs-list').css('display', 'none');
                    }
                }

                // Assigning the h2 markup
                let $tabItemh2;
                $respTabs.find('.resp-tab-content').before("<h2 class='resp-accordion' role='tab'><span class='resp-arrow'></span></h2>");

                let itemCount = 0;
                $respTabs.find('.resp-accordion').each(function () {
                    $tabItemh2 = $(this);
                    const innertext = $respTabs.find('.resp-tab-item:eq(' + itemCount + ')').text();
                    $respTabs.find('.resp-accordion:eq(' + itemCount + ')').append(innertext);
                    $tabItemh2.attr('aria-controls', 'tab_item-' + (itemCount));
                    itemCount++;
                });

                // Assigning the 'aria-controls' to Tab items
                // eslint-disable-next-line no-unused-vars
                let count = 0;
                let $tabContent;
                $respTabs.find('.resp-tab-item').each(function () {
                    // eslint-disable-next-line no-undef,no-unused-vars
                    $(this);
// Assigning the 'aria-labelledby' attr to tab-content
                    let tabcount = 0;
                    $respTabs.find('.resp-tab-content').each(function () {
                        $tabContent = $(this);
                        $tabContent.attr('aria-labelledby', 'tab_item-' + (tabcount));
                        tabcount++;
                    });
                    count++;
                });

                // Tab Click action function
                $respTabs.find("[role=tab]").each(function () {
                    const $currentTab = $(this);
                    // eslint-disable-next-line consistent-return
                    $currentTab.click(function () {

                        // eslint-disable-next-line no-unused-vars
                        $currentTab.attr('aria-controls');
                    });
                    // Window resize function
                    $(window).resize(function () {
                        $respTabs.find('.resp-accordion-closed').removeAttr('style');
                    });
                });
            });
        }
    });
}(jQuery));

