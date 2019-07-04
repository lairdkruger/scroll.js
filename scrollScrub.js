/*
scrollScrub.js provides helper functions for implementing scroll based animations
scrollScrub.js relies on luxy.js for smooth, momemtum based scrolling
and hence must be included in the html after luxy.js but before master.js
*/

/*
Optional: Resets scroll position to the top
*/
window.onbeforeunload = function() {
    window.scrollTo(0, 0);
}

/*
Requires luxy.js
*/
luxy.init();

/*
checkScrollSpeed()
Returns the speed at which the document is being scrolled
*/
var checkScrollSpeed = (function(settings) {
    settings = settings || {};

    var lastPos, newPos, timer, delta,
        delay = settings.delay || 1000; // in "ms" (higher means lower fidelity )

    function clear() {
        lastPos = null;
        delta = 0;
    };

    clear();

    return function() {
        newPos = luxy.wapperOffset;
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

    var pixelsScrolled = luxy.wapperOffset;
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

Elements:
    ".classes"
    "#ids"
    NOTE: ID's ARE RECOMMENDED AS ELEMENT MUST BE UNIQUE
    For document use amountScrolled()

Origin:
    Sets the y-axis origin point of the element
    0 = bottom of element, 0.5 = center of element, 1 = top of element

Target:
    Sets the y-axis target on the window
    0 = bottom of window, 0.5 = center of window, 1.0 = top of window

Duration:
    Duration represents the range at which 0 to 1 is mapped to by the function
    and hence the duration of the animation

Apex:
    The value that delta is set to once elements are aligned
    0: useful for translations (no translation once aligned)
    1: useful for opacity (full opacity once aligned)

Example:
    scrollScrub("#some-div", 1.0, 0.5, 200, 0)
    returns 0 when the top of #some-div is aligned with the center of the window
*/

var offsets = {};

function scrollScrub(element, origin, target, duration, apex) {
    var delta;
    var windowHeight = $(window).height();
    var elementHeight = $(element).outerHeight(true);
    var pixelsScrolled = luxy.wapperOffset;

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
