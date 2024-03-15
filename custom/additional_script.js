/**
 * Custom styling and behaviour for tag elements in memos
*/
var colors = ['#61bd4f', '#f2d600', '#ff9f1a', '#eb5a46', '#c377e0', '#0079bf', '#00c2e0', '#51e898', '#ff78cb', '#344563', '#b3bac5', '#ff7452', '#59D090', '#ff8b00', '#0079bf', '#00c2e0'];
var tagElementCssSelectors = '.inline-block.w-auto.text-blue-600.dark\\:text-blue-400.cursor-pointer.hover\\:opacity-80';
var textAreaCssSelector = '.w-full.h-full.my-1.text-base.resize-none.overflow-x-hidden.overflow-y-auto.bg-transparent.outline-none.whitespace-pre-wrap.word-break';

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

/**
 * Prefix memo posts with the tag unless it's already there or no tag filter is applied or the memo is a comment
*/
function prefixMemoWithTags() {
    var element = document.querySelector(textAreaCssSelector);
    if (element === null) {
        return;
    }

    var elementContent = element.value;

    // Ensure we are on a tag filter page
    const currentUrl = window.location.href;
    const regexPattern = /\/\?tag=[^\/]*$/;
    if (!regexPattern.test(currentUrl)) {
        // Remove tag from the memo if it's there
        // BUG: if trying to use markdown syntax for headers, it will also be removed
        if (elementContent.charAt(0) == '#') {
            var firstSpaceIndex = elementContent.indexOf(' ');
            if (firstSpaceIndex !== -1) {
                elementContent = elementContent.substring(firstSpaceIndex + 1).trim();
            } else {
                elementContent = '';
            }
            element.value = elementContent;
        }

        return;
    }

    // Get tag value
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    var tag = urlParams.get('tag');
    if (tag == null) {
        return;
    }

    // Ensure tag isn't already added
    if (elementContent.startsWith("#" + tag)) {
        return;
    }
    
    if (elementContent.charAt(0) == '#') {
        // Replace existing tag
        var firstSpaceIndex = elementContent.indexOf(' ');
        if (firstSpaceIndex !== -1) {
            // Replace the current tag with the new one from the URL
            elementContent = `#${tag}` + elementContent.substring(firstSpaceIndex);
        } else {
            // The entire content is a tag, just replace it with the new tag
            elementContent = `#${tag}` + " \n\n";
        }
    } else {
        elementContent = "#" + tag + " \n\n" + elementContent;
    }

    // Maintain minimum height
    if (element.style.height == '24px') {
        element.style.height = '72px';
    }
    
    element.value = elementContent;
}

/**
 * Loop every 100 milliseconds to reapply changes if elements are reset by app
*/
var interval = setInterval(function() {
    customizeTagElements();
    prefixMemoWithTags();
}, 100);
