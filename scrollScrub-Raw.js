/*
Optional: Resets scroll position to the top
*/
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}

/*
checkScrollSpeed()
Returns the speed at which the document is being scrolled
*/
var checkScrollSpeed = (function (settings) {
    settings = settings || {};

    var lastPos, newPos, timer, delta,
        delay = settings.delay || 1000; // in "ms" (higher means lower fidelity )

    function clear() {
        lastPos = null;
        delta = 0;
    };

    clear();

    return function () {
        newPos = window.scrollY;
        if (lastPos != null) { // && newPos < maxScroll
            delta = newPos - lastPos;
        }
        lastPos = newPos;
        clearTimeout(timer);
        timer = setTimeout(clear, delay);

        return delta;
    };
})();

/*
amountScrolled()
Returns amount of entire document that user has scrolled through
0.0 = has not scrolled
1.0 = scrolled all the way to the bottom
*/
function amountScrolled() {
    var delta;
    var windowHeight, documentHeight, scrollRange;

    var pixelsScrolled = window.scrollY;
    windowHeight = $(window).height();

    documentHeight = $(document).height();
    scrollRange = documentHeight - windowHeight;
    delta = pixelsScrolled / scrollRange;

    return delta;
}

/*
scrollScrub(element, origin, target, duration, apex)
Returns a value (delta) mapping an element's origin to its position in the window
This allows the scrollbar to be used as a scrub control to animate elements
*/
var offsets = {};

function scrollScrub(element, origin, target, duration, apex) {
    var delta;
    var windowHeight = $(window).height();
    var elementHeight = $(element).outerHeight(true);
    var pixelsScrolled = window.scrollY;

    // Making (0 = bottom) & (1 = top) for readability
    origin = 1 - origin;
    target = 1 - target;

    if (offsets[element] == null) {
        offsets[element] = $(element).offset().top +
            (elementHeight / (1 / origin)) -
            (windowHeight / (1 / target));
    }

    distanceFromTarget = (offsets[element]) - (pixelsScrolled);
    delta = (-distanceFromTarget) / (duration);
    delta += apex;

    return delta;
}
