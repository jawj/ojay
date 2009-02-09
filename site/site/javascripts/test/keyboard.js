Ojay('.buzzer').setStyle({opacity: 0});

var buzz = function(selector) {
    Ojay(selector)
        .setStyle({opacity: 1})
        .wait(0.3)
        .animate({opacity: {from: 1, to: 0}}, 0.8);
}.curry(3);

var shiftZ = Ojay.Keyboard.listen(document, 'SHIFT Z', buzz('#block1 .buzzer'));
shiftZ.preventDefault();
Ojay('#block1 .disable').on('click', Ojay.stopEvent)._(shiftZ).disable();
Ojay('#block1 .enable').on('click', Ojay.stopEvent)._(shiftZ).enable();

var ctrlS = Ojay.Keyboard.listen(document, 'CONTROL S', buzz('#block2 .buzzer'));
ctrlS.preventDefault();
Ojay('#block2 .disable').on('click', Ojay.stopEvent)._(ctrlS).disable();
Ojay('#block2 .enable').on('click', Ojay.stopEvent)._(ctrlS).enable();
Ojay('#block2 .allow').on('click', Ojay.stopEvent)._(ctrlS).allowDefault();
Ojay('#block2 .deny').on('click', Ojay.stopEvent)._(ctrlS).preventDefault();

var contextCheck = Ojay.Keyboard.listen(document, '9', function() { alert(this) }, 9);
