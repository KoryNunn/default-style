var EventEmitter = require('events').EventEmitter,
    deepEqual = require('deep-equal'),
    encodeResults = require('./results');

var nextTick = process && process.nextTick || setTimeout;


function instantiate(){
    var testsToRun = [],
        testsRun = [],
        totalTests = 0,
        totalAssersions = 0,
        completedAssersions = 0,
        begun = false,
        timeout = 0,
        only;

    function Test(name, testFunction){
        this._plan = 0;
        this._count = 0;
        this._assersions = [];
        this.name = name;
        this._testFunction = testFunction;
    }

    // Unused currently.
    // Test.prototype = Object.create(EventEmitter.prototype);
    // Test.prototype.constructor = Test;

    function setTestTimeout(time){
        timeout = Math.max(timeout, time);
    }

    Test.prototype.timeout = setTestTimeout;

    Test.prototype.comment = function (message) {
        // ToDo
    };

    Test.prototype.plan = function(ammount){
        this._plan = ammount;
    };

    Test.prototype._run = function(){
        var test = this;
        try {
            test._testFunction(this);
        }
        catch (err) {
            test.error(err);
        }
    };

    Test.prototype._assert = function(details){
        if(details.operator !== 'end'){
            this._count++;
        }
        if(this._ended){
            if(details.operator === 'end' || details.operator === 'fail'){
                return;
            }
            this.fail('asserted after test has ended');
        }
        this._assersions.push(details);
    };

    Test.prototype.end = function (message) {
        var ok = this._plan === this._count;

        if(this._ended){
            return;
        }

        if(ok){
            this._assert({
                ok: true,
                message: message,
                operator: 'end'
            });
        }else{
            this._assert({
                ok: false,
                expected: this._plan,
                actual: this._count,
                message: 'plan != count',
                operator: 'end'
            });
        }

        this._ended = true;
    };

    Test.prototype.error = function(error, message){
        this._assert({
            ok: !error,
            message : message || String(error),
            operator : 'error',
            actual : error
        });
    };

    Test.prototype.pass = function(message){
        this._assert({
            ok: true,
            message: message,
            operator: 'pass'
        });
    };

    Test.prototype.fail = function(message){
        this._assert({
            message: message,
            operator: 'fail'
        });
    };

    Test.prototype.skip = function(message){
        this._assert({
            message: message,
            skip: true,
            operator: 'skip'
        });
    };

    Test.prototype.ok = function(value, message){
        this._assert({
            actual: value,
            ok: !!value,
            message: message,
            operator: 'ok'
        });
    };

    Test.prototype.notOk = function(value, message){
        this._assert({
            actual: value,
            ok:!value,
            message: message,
            operator: 'notOk'
        });
    };

    Test.prototype.equal = function(value, expected, message){
        this._assert({
            actual: value,
            expected: expected,
            ok: value === expected,
            message: message,
            operator: 'equal'
        });
    };

    Test.prototype.notEqual = function(value, expected, message){
        this._assert({
            actual: value,
            expected: expected,
            ok: value !== expected,
            message: message,
            operator: 'notEqual'
        });
    };

    Test.prototype.deepEqual = function(value, expected, message){
        this._assert({
            actual: value,
            expected: expected,
            ok: deepEqual(value, expected, { strict: true }),
            message: message,
            operator: 'deepEqual'
        });
    };

    Test.prototype.deepLooseEqual = function(value, expected, message){
        this._assert({
            actual: value,
            expected: expected,
            ok: deepEqual(value, expected),
            message: message,
            operator: 'deepLooseEqual'
        });
    };

    Test.prototype.notDeepEqual = function(value, expected, message){
        this._assert({
            actual: value,
            expected: expected,
            ok: !deepEqual(value, expected, { strict: true }),
            message: message,
            operator: 'notDeepEqual'
        });
    };

    Test.prototype.notDeepLooseEqual = function(value, expected, message){
        this._assert({
            actual: value,
            expected: expected,
            ok: !deepEqual(value, expected),
            message: message,
            operator: 'notDeepLooseEqual'
        });
    };

    Test.prototype['throws'] = function (fn, expected, message) {
        var caughtError,
            passed;

        if(typeof expected === 'string'){
            message = expected;
            expected = undefined;
        }

        try{
            fn();
        }catch(error){
            caughtError = {error: error};
        }

        passed = caughtError;

        if(expected instanceof RegExp){
            passed = expected.test(caughtError && caughtError.error);
            expected = String(expected);
        }

        this._assert({
            ok: passed,
            message : message || 'should throw',
            operator : 'throws',
            actual : caughtError && caughtError.error,
            expected : expected,
            error: !passed && caughtError && caughtError.error
        });
    };

    Test.prototype.doesNotThrow = function (fn, expected, message) {
        var caughtError;

        if(typeof expected === 'string'){
            message = expected;
            expected = undefined;
        }

        try{
            fn();
        }catch(error){
            caughtError = { error : error };
        }

        this._assert({
            ok: !caughtError,
            message: message || 'should not throw',
            operator: 'doesNotThrow',
            actual: caughtError && caughtError.error,
            expected: expected,
            error: caughtError && caughtError.error
        });
    };

    function runNextTest(){
        while(testsToRun.length){
            var nextTest = testsToRun.shift();
            nextTest._run();
            testsRun.push(nextTest);
        }
    }

    function complete(){
        var results = encodeResults(testsRun);

        if(testsToRun.length !== totalTests){
            // tests level problem
        }

        grape.emit('complete', results[0]);

        if(!grape.silent){
            console.log(results[0]);
            if(process && process.exit){
                process.exit(results[1]);
            }
        }
    }

    function begin(){
        if(!begun){
            begun = true;
            nextTick(runNextTest);
            nextTick(function(){
                if(!process || !process.on || grape.useTimeout){
                    setTimeout(complete, timeout);
                }else{
                    process.on('exit', complete);
                }
            });
        }
    }

    function grape(name, testFunction){
        if(only){
            return;
        }
        totalTests++;
        testsToRun.push(new Test(name, testFunction));
        begin();
    }
    grape.timeout = setTestTimeout;

    grape.only = function(name, testFunction){
        if(only){
            throw "There can be only one only";
        }
        only = true;
        testsToRun = [new Test(name, testFunction)];
        begin();
    };

    for(var key in EventEmitter.prototype){
        grape[key] = EventEmitter.prototype[key];
    }

    grape.createNewInstance = instantiate;
    grape.Test = Test;

    return grape;
}

module.exports = instantiate();
