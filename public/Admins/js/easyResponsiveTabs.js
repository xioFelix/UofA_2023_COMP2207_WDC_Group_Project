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
                let count = 0;
                let $tabContent;
                $respTabs.find('.resp-tab-item').each(function () {
                    // eslint-disable-next-line no-undef
                    let $tabItem = $(this);
                    // eslint-disable-next-line no-undef
                    $tabItem.attr('aria-controls', 'tab_item-' + (count));
                    // eslint-disable-next-line no-undef
                    $tabItem.attr('role', 'tab');

                    // First active tab
                    $respTabs.find('.resp-tab-item').first().addClass('resp-tab-active');
                    $respTabs.find('.resp-accordion').first().addClass('resp-tab-active');
                    $respTabs.find('.resp-tab-content').first().addClass('resp-tab-content-active').attr('style', 'display:block');

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

                        const $tabAria = $currentTab.attr('aria-controls');

                        if ($currentTab.hasClass('resp-accordion') && $currentTab.hasClass('resp-tab-active')) {
                            $respTabs.find('.resp-tab-content-active').slideUp('', function () { $(this).addClass('resp-accordion-closed'); });
                            $currentTab.removeClass('resp-tab-active');
                            return false;
                        }
                        if (!$currentTab.hasClass('resp-tab-active') && $currentTab.hasClass('resp-accordion')) {
                            $respTabs.find('.resp-tab-active').removeClass('resp-tab-active');
                            $respTabs.find('.resp-tab-content-active').slideUp().removeClass('resp-tab-content-active resp-accordion-closed');
                            $respTabs.find("[aria-controls=" + $tabAria + "]").addClass('resp-tab-active');

                            $respTabs.find('.resp-tab-content[aria-labelledby = ' + $tabAria + ']').slideDown().addClass('resp-tab-content-active');
                        } else {
                            $respTabs.find('.resp-tab-active').removeClass('resp-tab-active');
                            $respTabs.find('.resp-tab-content-active').removeAttr('style').removeClass('resp-tab-content-active').removeClass('resp-accordion-closed');
                            $respTabs.find("[aria-controls=" + $tabAria + "]").addClass('resp-tab-active');
                            $respTabs.find('.resp-tab-content[aria-labelledby = ' + $tabAria + ']').addClass('resp-tab-content-active').attr('style', 'display:block');
                        }
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

