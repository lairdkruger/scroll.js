/*
scroll.js provides helper functions for implementing scroll based animations
scroll.js relies on luxy.js for smooth, momemtum based scrolling
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
Returns amount of particular element the browser has scrolled through

Elements:
    ".classes"
    "#ids"
    document (only 'top' mode available)

Modes:
"Top" {
    Returns 0.0 if the top of the element is aligned with the top of the window
    Returns negative if the top of the element is below the top of the window
    Returns positive if the top of the element is above the top of the window
}

"Center" {
    Returns 0.0 if the y-axis center of the element is aligned with the y-axis center of the window
    Returns negative if the y-axis center of the element is below with the y-axis center of the window
    Returns positive if the y-axis center of the element is below with the y-axis center of the window
}

The return value is linearly mapped hence:
    1.0 means that the browser has scrolled past the element fully
    2.0 means that the browser has scrolled 2 x height of element
*/
var topOffsetCalculated = false;
var centerOffsetCalculated = false;
var topSectionOffset;
var centerSectionOffset

function amountScrolled(element, mode) {
    var scrollAmount;
    var windowHeight, documentHeight, scrollRange;
    var distanceFromTop;

    var pixelsScrolled = luxy.wapperOffset;
    windowHeight = $(window).height();

    if (element == document) {
        documentHeight = $(document).height();
        scrollRange = documentHeight - windowHeight;
        scrollAmount = pixelsScrolled / scrollRange;
    } else {
        if (mode == "top") {
            if (!topOffsetCalculated) {
                topSectionOffset = $(element).offset().top;
                topOffsetCalculated = true;
            }

            distanceFromTop = topSectionOffset - pixelsScrolled;
            sectionHeight = $(element).outerHeight(true);
            scrollAmount = (-distanceFromTop) / (sectionHeight);

        } else if (mode == "center") {
            sectionHeight = $(element).outerHeight(true);

            if (!centerOffsetCalculated) {
                centerSectionOffset = ($(element).offset().top - sectionHeight / 2) - windowHeight / 2;
                centerOffsetCalculated = true;
            }

            distanceFromTop = (centerSectionOffset) - pixelsScrolled;
            scrollAmount = (-distanceFromTop) / (sectionHeight);
        } else {
            console.error("amountScrolled: Invalid/Undefined Mode Input Variable");
        }
    }

    return scrollAmount;
}

/*
scrollScrubControl(element, mode, duration, target)
Returns a value (delta) mapping an element's position to the \
scrollbar so that the scrollbar can be used as a scrub control to animate elements

Elements:
    ".classes"
    "#ids"
    NOTE: ID's ARE RECOMMENDED ELEMENT MUST BE UNIQUE
    For (document) use amountScrolled

Modes:
Default = "center"
"top" {
    Returns 0.0 if the top of the element is aligned with the top of the window
    Returns negative if the top of the element is below the top of the window
    Returns positive if the top of the element is above the top of the window
}

"center" {
    Returns 0.0 if the y-axis center of the element is aligned with the y-axis center of the window
    Returns negative if the y-axis center of the element is below with the y-axis center of the window
    Returns positive if the y-axis center of the element is below with the y-axis center of the window
}

Duration:
Duration represents the range at which 0 to 1 is mapped to by the function
Default = element height
Smaller duration: faster animation over a smaller scroll amount
Larger duration: slower animation over a larger scroll amount

Target:
Default = "zeroed";
"zeroed" {
    returns 0.0 when aligned
}

"oned" {
    returns 1.0 when aligned
}
*/
var offsets = {};

function scrollScrubControl(element, mode, duration, target) {
    var delta;
    var documentHeight, windowHeight, scrollRange;
    var distanceFromTop, distanceFromCenter;

    var pixelsScrolled = luxy.wapperOffset;
    mode = mode || "center";
    duration = duration || $(element).outerHeight(true);
    target = target || "zeroed";

    if (mode == "center") {
        windowHeight = $(window).height();
        sectionHeight = $(element).outerHeight(true);

        if (offsets[element] == null) {
            offsets[element] = $(element).offset().top + (sectionHeight / 2) - (windowHeight / 2);
        }

        distanceFromCenter = (offsets[element]) - (pixelsScrolled);
        delta = (-distanceFromCenter) / (duration);

    } else if (mode == "top") {
        if (offsets[element] == null) {
            offsets[element] = $(element).offset().top;
        }

        distanceFromTop = (offsets[element]) - (pixelsScrolled);
        delta = (-distanceFromTop) / (duration);
    }

    if (target == "oned") {
        delta += 1;
    }

return delta;
}
