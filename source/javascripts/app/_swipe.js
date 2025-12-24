//= require ../lib/_jquery
;(function () {
  'use strict';

  var SWIPE_THRESHOLD = 50;
  var MAX_VERTICAL_DRIFT = 50;
  var EDGE_ACTIVATION_WIDTH = 30;

  var startX = null;
  var startY = null;
  var startedInScrollable = false;

  var tocWrapper = document.querySelector('.toc-wrapper');
  var navButton = document.getElementById('nav-button');

  if (!tocWrapper || !navButton) {
    return;
  }

  var isNavOpen = function() {
    return tocWrapper.classList.contains('open');
  };

  var openNav = function() {
    tocWrapper.classList.add('open');
    navButton.classList.add('open');
  };

  var closeNav = function() {
    tocWrapper.classList.remove('open');
    navButton.classList.remove('open');
  };

  var hasHorizontalScrollAncestor = function(element) {
    var el = element;
    while (el && el !== document.body) {
      var style = window.getComputedStyle(el);
      var canScrollX = (el.scrollWidth - el.clientWidth) > 1 &&
        (style.overflowX === 'auto' || style.overflowX === 'scroll');
      if (canScrollX) {
        return true;
      }
      el = el.parentElement;
    }
    return false;
  };

  var resetTouch = function() {
    startX = null;
    startY = null;
    startedInScrollable = false;
  };

  var onTouchStart = function(event) {
    if (!event.touches || event.touches.length !== 1) {
      resetTouch();
      return;
    }

    var touch = event.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    startedInScrollable = hasHorizontalScrollAncestor(event.target);
  };

  var onTouchEnd = function(event) {
    if (startX === null || startY === null) {
      return;
    }

    if (!event.changedTouches || event.changedTouches.length === 0) {
      resetTouch();
      return;
    }

    var touch = event.changedTouches[0];
    var deltaX = touch.clientX - startX;
    var deltaY = touch.clientY - startY;

    if (Math.abs(deltaX) < SWIPE_THRESHOLD || Math.abs(deltaX) < Math.abs(deltaY) || Math.abs(deltaY) > MAX_VERTICAL_DRIFT) {
      resetTouch();
      return;
    }

    if (deltaX < 0 && isNavOpen()) {
      closeNav();
    } else if (deltaX > 0 && !isNavOpen() && startX <= EDGE_ACTIVATION_WIDTH && !startedInScrollable) {
      openNav();
    }

    resetTouch();
  };

  document.addEventListener('touchstart', onTouchStart, { passive: true });
  document.addEventListener('touchend', onTouchEnd, { passive: true });
})();
