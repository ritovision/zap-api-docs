(function () {
    'use strict';

    var startX = 0;
    var startY = 0;
    var threshold = 60; // Minimum distance for a swipe in pixels
    var verticalThreshold = 40; // Max vertical movement allowed to still count as a horizontal swipe

    function setupSwipe() {
        document.addEventListener('touchstart', function (e) {
            // Only enable swipes if the nav button is visible (meaning we are on mobile/tablet)
            if ($("#nav-button").is(":hidden")) return;

            // Ignore if more than one finger
            if (e.touches.length > 1) return;

            // Check if we are starting inside a horizontally scrollable element
            var isScrollable = false;
            var el = e.target;
            while (el && el !== document.body) {
                // Explicitly check for code blocks and lang selector which are known to scroll
                if (el.tagName === 'PRE' || el.tagName === 'CODE' || el.classList.contains('highlight') || el.classList.contains('lang-selector')) {
                    if (el.scrollWidth > el.clientWidth) {
                        isScrollable = true;
                        break;
                    }
                }
                // Generic check for overflow-x
                var style = window.getComputedStyle(el);
                if ((style.overflowX === 'auto' || style.overflowX === 'scroll') && el.scrollWidth > el.clientWidth) {
                    isScrollable = true;
                    break;
                }
                el = el.parentElement;
            }

            if (isScrollable) {
                startX = 0;
                startY = 0;
                return;
            }

            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });

        document.addEventListener('touchend', function (e) {
            if (startX === 0) return;

            var endX = e.changedTouches[0].clientX;
            var endY = e.changedTouches[0].clientY;
            var diffX = endX - startX;
            var diffY = Math.abs(endY - startY);

            // Must be a horizontal-ish swipe
            if (Math.abs(diffX) > threshold && diffY < verticalThreshold) {
                if (diffX > 0) {
                    // Swipe Right -> Open
                    $(".toc-wrapper").addClass('open');
                    $("#nav-button").addClass('open');
                } else {
                    // Swipe Left -> Close
                    $(".toc-wrapper").removeClass('open');
                    $("#nav-button").removeClass('open');
                }
            }

            // Reset
            startX = 0;
            startY = 0;
        }, { passive: true });
    }

    $(function () {
        setupSwipe();
    });
})();
