# default-style

Simple default style helper for client-side components.

default-style will only insert one style tag into the page, which will be used for all styles added.

# Usage

    npm install default-style

Then in js:

    // Load the constructor
    var DefaultStyle = require('default-style');

    // Make a new default style
    var style = new DefaultStyle('.things:{height:20px;}');

The above will add the defined style to the document's head element.

You can remove the style at any point via:

    style.remove();

This will remove the element from the DOM, it can be re-inserted at any time using:

    style.insert();

You can get or set the cssText at any time using:

    // Get:
    var cssText = style.css();

    // Set:
    style.css(cssText);

If you don't want the style added to the page immediately, you can prevent it:

    // Don't immediately insert the style
    var style = new DefaultStyle('.things:{height:20px;}', true);

Internally, default-style has a textNode that contains the cssText. By default it gets added to a style tag in the head. You can optionally give the DefaultStyle instance a target to insert the textNode into:

    style.insert(someOtherDomNode);

And the node its self can be accessed via:

    style._node