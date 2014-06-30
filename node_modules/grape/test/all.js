var outerGrape = require('../');

outerGrape.useTimeout = true;

// Have to set the outer test to 'end' after the inner test, just for this use case.
outerGrape.timeout(100);

function createTestGrape(){
    var grape = outerGrape.createNewInstance();

    grape.silent = true;
    grape.useTimeout = true;

    return grape;
}

function testsPassed(results){
    var resultLines = results.split('\n');
    resultLines.pop();

    return resultLines.pop() === '# ok';
}

outerGrape('grape pass', function(g){
    var grape = createTestGrape();
    g.plan(1);
    g.doesNotThrow(function(){
        grape('doesn\'t explode', function(t){
            t.plan(1);

            t.pass('passed');
        });
    }, "Grape shouldn't throw an error when called");
});


outerGrape('grape ok', function(g){
    var grape = createTestGrape();
    g.plan(1);

    grape.on('complete', function(results){
        if(testsPassed(results)){
            g.pass();
        }
    });

    grape('t.ok', function(t){

        t.plan(1);

        t.ok('ok', true);
    });
});

outerGrape('grape plan should work', function(g){
    var grape = createTestGrape();
    g.plan(1);

    grape.on('complete', function(results){
        if(testsPassed(results)){
            g.pass();
        }
    });

    grape('t.end ok', function(t){

        t.plan(2);

        t.ok(true, 'ok');

        t.ok(true, 'ok');

        t.end('ok');
    });
});

outerGrape('grape assert after end should fail', function(g){
    var grape = createTestGrape();
    g.plan(1);

    grape.on('complete', function(results){
        if(!testsPassed(results)){
            g.pass();
        }
    });

    grape('t.end not ok', function(t){

        t.plan(2);

        t.ok(true, 'ok');

        t.end('ok');

        t.ok(true, 'ok');
    });
});

outerGrape('grape plan != count should fail', function(g){
    var grape = createTestGrape();
    g.plan(1);

    grape.on('complete', function(results){
        if(!testsPassed(results)){
            g.pass();
        }
    });

    grape('plan != count', function(t){

        t.plan(2);

        t.ok(true, 'ok');
    });
});

outerGrape('grape can be extended', function(g){
    var grape = createTestGrape();
    g.plan(1);

    grape.Test.prototype.closeTo = function(value1, value2, delta, message){
        this._assert({
            ok: Math.abs(value1 - value2) < delta,
            message : message || String(error),
            operator : 'closeTo',
            actual : error
        });
    };

    grape.on('complete', function(results){
        if(!testsPassed(results)){
            g.pass();
        }
    });

    grape('plan != count', function(t){

        t.plan(2);

        t.closeTo(1,2,1, 'ok');
    });
});

outerGrape('grape should catch errors and not explode', function(g){
    var grape = createTestGrape();
    g.plan(1);

    g.doesNotThrow(function(){
        grape('error', function(t){

            t.plan(1);

            // throw an error
            a.b = c;

            t.ok(true, 'ok');
        });
    });
});

outerGrape('grape only should only run the only test', function(g){
    var grape = createTestGrape();
    g.plan(1);

    grape.on('complete', function(results){
        g.ok(results.match(/# tests 1/), 'Only the only ran');
    });

    grape('not only', function(t){

        t.plan(1);

        t.ok(true, 'ok');
    });

    grape.only('only', function(t){

        t.plan(1);

        t.ok(true, 'ok');
    });

});