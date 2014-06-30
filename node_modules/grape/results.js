
// Taken from https://github.com/substack/tape/blob/master/lib/results.js

function encodeResult (result, count) {
    var output = '';
    output += (result.ok ? 'ok ' : 'not ok ') + count;
    output += result.message ? ' ' + result.message.toString().replace(/\s+/g, ' ') : '';

    if (result.skip) output += ' # SKIP';
    else if (result.todo) output += ' # TODO';

    output += '\n';
    if (result.ok) return output;

    var outer = '  ';
    var inner = outer + '  ';
    output += outer + '---\n';
    output += inner + 'operator: ' + result.operator + '\n';

    var ex = JSON.stringify(result.expected) || '';
    var ac = JSON.stringify(result.actual) || '';

    if (Math.max(ex.length, ac.length) > 65) {
        output += inner + 'expected:\n' + inner + '  ' + ex + '\n';
        output += inner + 'actual:\n' + inner + '  ' + ac + '\n';
    }
    else {
        output += inner + 'expected: ' + ex + '\n';
        output += inner + 'actual:   ' + ac + '\n';
    }
    if (result.at) {
        output += inner + 'at: ' + result.at + '\n';
    }
    if (result.operator === 'error' && result.actual && result.actual.stack) {
        var lines = String(result.actual.stack).split('\n');
        output += inner + 'stack:\n';
        output += inner + '  ' + lines[0] + '\n';
        for (var i = 1; i < lines.length; i++) {
            output += inner + lines[i] + '\n';
        }
    }

    output += outer + '...\n';
    return output;
}

function encodeResults(results){
    var output = '',
        count = 0,
        passed = 0,
        failed = 0;

    for(var i = 0; i < results.length; i++) {
        var test = results[i];

        output += '# ' + test.name + '\n';

        if(test._plan !== test._count){
            test._assert({
                ok: false,
                expected: test._plan,
                actual: test._count,
                message: 'plan != count',
                operator: 'end'
            });
        }

        for(var j = 0; j < test._assersions.length; j++) {
            var assersion = test._assersions[j];
            count++;

            if(assersion.ok){
                passed++;
            }else{
                failed++;
            }

            output += encodeResult(assersion, count);
        }
    }

    output += '\n1..' + count + '\n';
    output += '# tests ' + count + '\n';
    output += '# pass  ' + passed + '\n';

    if(failed) {
        output += '# fail  ' + failed + '\n';
    }else{
        output += '\n# ok\n';
    }

    return [output, failed];
}

module.exports = encodeResults;