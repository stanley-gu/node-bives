module('Drawable');

test('drawable.classes', function() {
    expect(12);
    var graph = new bui.Graph(document.getElementById('dummy'));
    var drawable = graph.add(bui.Drawable);

    var expectedClassString = null;

    drawable.bind(bui.Drawable.ListenerType.classes,
            function(node, classString) {
        equal(classString, expectedClassString);
        equal(node.classString(), expectedClassString);
        equal(drawable.classString(), expectedClassString);
    });

    var class1 = 'hidden';
    expectedClassString = class1;
    drawable.addClass(class1);

    var class2 = 'round';
    expectedClassString = class1 + ' ' + class2;
    drawable.addClass(class2);

    expectedClassString = class2;
    drawable.removeClass(class1);

    expectedClassString = '';
    drawable.removeClass(class2);
});
module('Graph');

test('graph.scale', function() {
    var graph = new bui.Graph(document.getElementById('dummy'));

    var expectedScale = 0;

    var listener = function(origin, newScale) {
        equal(newScale, expectedScale, 'Scale provided to listener.');
        equal(origin.scale(), expectedScale, 'Scale of provided graph.');
        equal(graph.scale(), expectedScale, 'Scale of variable graph.');
    };

    graph.bind(bui.Graph.ListenerType.scale, listener);

    expect(6);
    graph.scale(expectedScale = 3);
    graph.scale(expectedScale = 3);
    graph.scale(expectedScale = 1);
});

test('graph.translate', function() {
    var graph = new bui.Graph(document.getElementById('dummy'));

    var expectedX = 0,
        expectedY = 0;

    var listener = function(origin, newX, newY) {
        equal(newX, expectedX, 'translate.x provided to listener.');
        equal(newY, expectedY, 'translate.y provided to listener.');
        equal(origin.translate().x, expectedX, 'translate.x of provided graph.');
        equal(origin.translate().y, expectedY, 'translate.y of provided graph.');
        equal(graph.translate().x, expectedX, 'translate.x of variable graph.');
        equal(graph.translate().y, expectedY, 'translate.y of variable graph.');
    };

    graph.bind(bui.Graph.ListenerType.translate, listener);

    expect(18);
    graph.translate(expectedX = 200, expectedY = 100);
    graph.translate(expectedX = 200, expectedY = 100);
    graph.translate(expectedX = -200, expectedY = 100);
    graph.translate(expectedX = -200, expectedY = 80);
});

test('graph.add', function() {
    var graph = new bui.Graph(document.getElementById('dummy'));

    expect(4);

    var drawableThroughListener = null;

    graph.bind(bui.Graph.ListenerType.add, function(newDrawable) {
        ok(true, 'Add listener called.');
        drawableThroughListener = newDrawable;
    });

    var drawable = graph.add(bui.Drawable);
    drawable.bind(bui.Drawable.ListenerType.remove, function(drawable) {
        ok(true, 'Remove listener called.');
        equal(drawable, drawable, 'Correct drawable provided ' +
                'through listener.')
        
    });

    ok(drawable === drawableThroughListener, 'Same drawables.');

    drawable.remove();
});


module('Labelable');

test('labelable.color', function() {
    var graph = new bui.Graph(document.getElementById('dummy')),
        labelable = graph.add(bui.Labelable),
		expectedBgColor = '',
		expectedLabelColor = '',
		expectedBorderColor = '';
	
	var listener = function (origin, newColor) {
		if (newColor.background !== null && newColor.background !== undefined) {
			expectedBgColor = expectedBgColor.toLowerCase();
			equal(newColor.background, expectedBgColor, 'color.background provided to listener.');
		}
		if (newColor.label !== null && newColor.label !== undefined) {
			expectedLabelColor = expectedLabelColor.toLowerCase();
			equal(newColor.label, expectedLabelColor, 'color.label provided to listener.');
		}
		if (newColor.border !== null && newColor.border !== undefined) {
			expectedBorderColor = expectedBorderColor.toLowerCase();
			equal(newColor.border, expectedBorderColor, 'color.border provided to listener.');
		}
        equal(origin.color().background, expectedBgColor, 'color.background of provided labelable.');
        equal(origin.color().label, expectedLabelColor, 'color.label of provided labelable.');
        equal(origin.color().border, expectedBorderColor, 'color.border of provided labelable.');
        equal(labelable.color().background, expectedBgColor, 'color.backgound of variable labelable.');
        equal(labelable.color().label, expectedLabelColor, 'color.label of variable labelable.');
        equal(labelable.color().border, expectedBorderColor, 'color.border of variable labelable.');
	};
		
	labelable.bind(bui.Labelable.ListenerType.color, listener);
	
	//expect(37);
    labelable.color({background: (expectedBgColor = 'blue'), label: (expectedLabelColor = '#ffffff')});
    labelable.color({background: (expectedBgColor = 'BLUE'), label: (expectedLabelColor = '#FFFFff')});
    labelable.color({background: (expectedBgColor = '0000ff'), label: (expectedLabelColor = 'white')});
    labelable.color({background: (expectedBgColor = 'Blue')});
    labelable.color({label: (expectedLabelColor = '#FFFFFF')});
    labelable.color({label: (expectedLabelColor = '#ffffff')});
    labelable.color({border: (expectedBorderColor = 'gray')});
});


module('util');

test('string.removeNonNumbers', function() {
    equal('Answer is 42'.removeNonNumbers(), '42');
    equal('a007b'.removeNonNumbers(), '007');
});

test('string.endsWith', function() {
    expect(2);

    var end = 'bar';
    var start = 'foo';
    var complete = start + end;

    ok(complete.endsWith(end));
    ok(!start.endsWith(end));
});

test('function.createDelegate', function() {
    expect(1);

    var scope = { answer : 42 };

    var verify = function() {
        equal(this.answer, 42, 'Wrong scope applied.');
    }

    var delegate = verify.createDelegate(scope);

    delegate.call({ answer : 41})
});

test('retrieveValueIfSet', function() {
    var obj = {
        foo : {
            bar : {
                foobar : 42
            }
        }
    };

    expect(2);

    equal(bui.util.retrieveValueIfSet(obj, 'foo', 'bar', 'foobar'),
            obj.foo.bar.foobar);
    equal(bui.util.retrieveValueIfSet(obj, 'foo', 'bar', '43'),
            undefined);
});

test('toBoolean', function() {
    expect(10);

    equal(bui.util.toBoolean(true), true);
    equal(bui.util.toBoolean(false), false);

    equal(bui.util.toBoolean('true'), true);
    equal(bui.util.toBoolean('1'), true);
    equal(bui.util.toBoolean('false'), false);
    equal(bui.util.toBoolean('0'), false);
    equal(bui.util.toBoolean('dsdsadsa'), false);

    equal(bui.util.toBoolean(1), true);
    equal(bui.util.toBoolean(0), false);
    equal(bui.util.toBoolean(-1), false);
});

test('toNumber', function() {
    expect(5);

    equal(bui.util.toNumber(1), 1);
    equal(bui.util.toNumber(0), 0);
    equal(bui.util.toNumber(-1), -1);

    equal(bui.util.toNumber('5'), 5);
    equal(bui.util.toNumber('-42'), -42);
});

test('propertySetAndNotNull', function() {
    expect(6);

    var obj = {
        data : {
            x : 5,
            y : 5
        },
        label : 'foo'
    };

    equal(bui.util.propertySetAndNotNull(obj, 'label'), true);
    equal(bui.util.propertySetAndNotNull(obj, ['data', 'x']), true);
    equal(bui.util.propertySetAndNotNull(obj, ['data', 'y']), true);
    equal(bui.util.propertySetAndNotNull(obj, ['data', 'x'],
            ['data', 'y']), true);
    equal(bui.util.propertySetAndNotNull(obj, 'label', ['data', 'x'],
            ['data', 'y']), true);
    equal(bui.util.propertySetAndNotNull(obj, 'label', ['data', 'x'],
            ['data', 'y'], 'foo'), false);
});

test('transformJSONCoordinates', function() {
    var json = {
        nodes : [
            {
                data : {
                    x : -20,
                    y : -25
                }
            },
            {
                data : {
                    x : -5,
                    y : -5
                }
            }, {
                data : {}
            }
        ]
    };

    bui.util.transformJSONCoordinates(json);

    equal(json.nodes[0].data.x, 0);
    equal(json.nodes[0].data.y, 0);
    equal(json.nodes[1].data.x, 15);
    equal(json.nodes[1].data.y, 20);
    equal(json.nodes[2].data.x, undefined);
    equal(json.nodes[2].data.y, undefined);
});
module('Node');

test('node', function() {
    expect(36);

    var x = 10, y = 35, width = 45, height = 28;

    var graph = new bui.Graph(document.getElementById('dummy'));
    var node = graph.add(bui.Node);

    node.size(width, height);

    var positionCalled = false, sizeCalled = false;
    node.bind(bui.Node.ListenerType.position, function() {
        ok(!positionCalled, 'Listener is called twice, which shouldn\'t be ' +
                'the case');
        positionCalled = true;
    }).bind(bui.Node.ListenerType.size, function() {
        ok(!sizeCalled, 'Listener is called twice, which shouldn\'t be ' +
                'the case');
        sizeCalled = true;
    });

    node.position(x = 300, y = 400);
    ok(positionCalled, 'Position changed and listener called.');
    positionCalled = false;
    testWith(node, x, y, width, height);

    node.size(width = 340, height = 450);
    ok(sizeCalled, 'Size changed and listener called.');
    sizeCalled = false;
    testWith(node, x, y, width, height);

    var moveX = 6, moveY = -8;
    node.move(moveX, moveY);
    ok(positionCalled, 'Position changed and listener called.');
    positionCalled = false;
    testWith(node, x + moveX, y + moveY, width, height);
});

function testWith(node, x, y, width, height) {
    var position = node.position(), size = node.size();
    equal(position.x, x);
    equal(position.y, y);
    equal(size.width, width);
    equal(size.height, height);

    var topLeft = node.topLeft(), bottomRight = node.bottomRight(),
            center = node.center();
    equal(topLeft.x, x);
    equal(topLeft.y, y);
    equal(bottomRight.x, x + width);
    equal(bottomRight.y, y + height);
    equal(center.x, x + width / 2);
    equal(center.y, y + height / 2);
};

test('parent-children', function() {
    expect(26);

    var graph = new bui.Graph(document.getElementById('dummy'));
    
    var parent = graph.add(bui.Node);

    var assertAmountOfChildren = function(amount) {
        equal(parent.children().length, amount);
    };
    var assertContainsChild = function() {
        for(var i = 0; i < arguments.length; i++) {
            var child = arguments[i];
            ok(parent.children().indexOf(child) !== -1);
            ok(parent === child.parent());
        }
    };

    assertAmountOfChildren(0);
    var child1 = graph.add(bui.Node);
    assertAmountOfChildren(0);

    child1.parent(parent);
    assertAmountOfChildren(1);
    assertContainsChild(child1);

    var child2 = graph.add(bui.Node);
    assertAmountOfChildren(1);

    parent.addChild(child2);
    assertAmountOfChildren(2);
    assertContainsChild(child1, child2);

    child1.parent(graph);
    assertAmountOfChildren(1);
    assertContainsChild(child2);

    parent.removeChild(child2);
    assertAmountOfChildren(0);

    // now checking the filtering of child nodes
    child1.foobar = true;

    parent.addChild(child1);
    parent.addChild(child2);
    assertAmountOfChildren(2);
    assertContainsChild(child1, child2);

    equal(parent.children(function(node) {
        return node.foobar !== undefined;
    }).length, 1);

    child2.foobar = false;

    equal(parent.children(function(node) {
        return node.foobar !== undefined;
    }).length, 2);
    equal(parent.children(function(node) {
        return node.foobar === true;
    }).length, 1);
    ok(parent.children(function(node) {
        return node.foobar === true;
    })[0] === child1);
    equal(parent.children(function(node) {
        return node.foobar === false;
    }).length, 1);
    ok(parent.children(function(node) {
        return node.foobar === false;
    })[0] === child2);
});
function testObservable(observable) {
    expect(7);

    var type1 = 'foo', type2 = 'bar', expectedType = null;

    var generateTypeListener = function(type) {
        var associatedType = type;

        return function() {
            equal(associatedType, expectedType);
        };
    };

    observable._addType(type1)
        ._addType(type2)
        .bind(type1, generateTypeListener(type1), type1)
        .bind(type2, generateTypeListener(type2), type2);

    expectedType = type1;
    ok(observable.fire(expectedType));

    expectedType = type2;
    ok(observable.fire(expectedType));

    ok(observable.unbind(type1).fire(type1));

    expectedType = type2;
    ok(observable.fire(type2));
}

module('Observable');

test('observable', function() {
    testObservable(new bui.Observable());
});

test('observable.addTypeObject', function() {
    expect(7);

    var type1 = 'foo', type2 = 'bar', expectedType = null;

    var generateTypeListener = function(type) {
        var associatedType = type;

        return function() {
            equal(associatedType, expectedType);
        };
    };

    var observable = new bui.Observable();
    observable._addType({ first : type1, second : type2})
        .bind(type1, generateTypeListener(type1), type1)
        .bind(type2, generateTypeListener(type2), type2);

    expectedType = type1;
    ok(observable.fire(type1));

    expectedType = type2;
    ok(observable.fire(type2));

    ok(observable.unbind(type1, type1).fire(type1));

    expectedType = type2;
    ok(observable.fire(type2));
});

test('observable.unbindAll', function() {
    expect(6);

    var type1 = 'foo', type2 = 'bar';

    var callCounter = 0;

    var listener = function(type) {
        callCounter++;
    };

    var identifier1 = 'Japan';
    var identifier2 = 'China';

    var observable = new bui.Observable();
    observable._addType({first : type1, second : type2})
        .bind(type1, listener, identifier1)
        .bind(type2, listener, identifier1)
        .bind(type1, listener, identifier2)
        .bind(type2, listener, identifier2);

    observable.fire(type1);
    equal(callCounter, 2);
    callCounter = 0;

    observable.fire(type2);
    equal(callCounter, 2);
    callCounter = 0;

    observable.unbindAll(identifier2);

    observable.fire(type1);
    equal(callCounter, 1);
    callCounter = 0;

    observable.fire(type2);
    equal(callCounter, 1);
    callCounter = 0;

    observable.unbindAll(identifier1);

    observable.fire(type1);
    equal(callCounter, 0);

    observable.fire(type2);
    equal(callCounter, 0);
});

test('static.listeners', function() {
    bui.Observable._unbindAllStatic();
    expect(12);

    var type1 = 'foo', type2 = 'bar', expectedType, expectedInstance;

    var generateTypeListener = function(type) {
        var associatedType = type;

        return function(source) {
            equal(associatedType, expectedType);
            equal(source, expectedInstance);
            equal(this, expectedInstance);
        };
    };

    var instance1 = new bui.Observable();
    instance1._addType({ first : type1, second : type2});

    bui.Observable.bindStatic(type1, generateTypeListener(type1));
    bui.Observable.bindStatic(type2, generateTypeListener(type2));

    var instance2 = new bui.Observable();
    instance2._addType({ first : type1, second : type2});

    expectedType = type1;
    expectedInstance = instance1;
    expectedInstance.fire(expectedType);

    expectedInstance = instance2;
    expectedInstance.fire(expectedType);

    expectedType = type2;
    expectedInstance.fire(expectedType);

    expectedInstance = instance1;
    expectedInstance.fire(expectedType);
});

module('Inheritance');

test('inheritance.basic', function() {
    bui.Observable._unbindAllStatic();
    testObservable(new bui.Graph(document.getElementById('dummy')))
});

test('inheritance.static', function() {
    bui.Observable._unbindAllStatic();
    expect(1);
    var called = false;

    bui.Graph.bindStatic(bui.Graph.ListenerType.scale, function() {
        called = true;
    });

    var graph = new bui.Graph(document.getElementById('dummy'));
    graph.fire(bui.Graph.ListenerType.scale);

    ok(called);
});