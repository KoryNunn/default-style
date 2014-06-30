var originalTest = require('grape'),
    crel = require('crel'),
    DefaultStyle = require('../'),
    thingsElement;

if(typeof window === 'undefined'){
    throw "Cannot test default-style without a window. Browserify this test to run it.";
}

function setup(){
    if(thingsElement){
        return;
    }
    crel(document.body,
        thingsElement = crel('div', {'class':'things'})
    );
}

function test(description, fn){
    var instance = this;

    window.addEventListener('load', function(){
        setup();
        originalTest(description, function(t){
            fn.call(this, t, thingsElement);
        });
    });
}

test('All tests because there is only one document', function(t, thingsElement){
    t.plan(14);

    var cssText = '.things{width:100px;}';

    var style = new DefaultStyle(cssText);

    t.equal(style.css(), cssText);
    t.equal(window.getComputedStyle(thingsElement).width, '100px');

    style.remove();

    t.notEqual(window.getComputedStyle(thingsElement).width, '100px');

    style.insert();

    t.equal(window.getComputedStyle(thingsElement).width, '100px');

    style.css('.things{width:200px;}');

    t.equal(window.getComputedStyle(thingsElement).width, '200px');

    var cssText2 = '.things{height:100px;}';

    var style2 = new DefaultStyle(cssText2);

    t.equal(style2.css(), cssText2);
    t.equal(window.getComputedStyle(thingsElement).height, '100px');
    t.equal(window.getComputedStyle(thingsElement).width, '200px');

    style2.remove();

    t.equal(window.getComputedStyle(thingsElement).height, '0px');
    t.equal(window.getComputedStyle(thingsElement).width, '200px');

    style2.insert();

    t.equal(window.getComputedStyle(thingsElement).height, '100px');
    t.equal(window.getComputedStyle(thingsElement).width, '200px');

    style2.css('.things{height:200px;}');

    t.equal(window.getComputedStyle(thingsElement).width, '200px');
    t.equal(window.getComputedStyle(thingsElement).height, '200px');
});