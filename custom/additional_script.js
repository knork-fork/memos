/**
 * Custom styling and behaviour for tag elements in memos
*/
var colors = ['#61bd4f', '#f2d600', '#ff9f1a', '#eb5a46', '#c377e0', '#0079bf', '#00c2e0', '#51e898', '#ff78cb', '#344563', '#b3bac5', '#ff7452', '#59D090', '#ff8b00', '#0079bf', '#00c2e0'];
var tagElementCssSelectors = '.inline-block.w-auto.text-blue-600.dark\\:text-blue-400.cursor-pointer.hover\\:opacity-80';

// Convert tag text to a color array index
function stringToColorIndex(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    hash = Math.abs(hash);
    var index = hash % colors.length;
    return colors[index];
}

// Apply different colors to tag elements based on their text
function applyColors(element) {
    var color = stringToColorIndex(element.textContent || element.innerText);
    element.style.backgroundColor = color;
}

function customizeTagElements() {
    var elements = document.querySelectorAll(tagElementCssSelectors);
    if (elements.length > 0) {
        elements.forEach(function(element) {  
            if (element.style.backgroundColor != '') {
                // Already styled, so skip to avoid overriding
                return;
            }
            applyColors(element);
        });
    }
}

// Loop every 100 milliseconds to reapply changes if elements are removed and re-added by app
var intervalId = setInterval(function() {
    customizeTagElements();
}, 100);
