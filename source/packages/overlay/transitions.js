Ojay.Overlay.Transitions

.add('none', {
    hide: function(overlay, chain) {
        overlay.getContainer().hide();
        chain.fire();
        return overlay;
    },
    
    show: function(overlay, chain) {
        overlay.getContainer()
            .setStyle({opacity: overlay.getOpacity()})
            .setStyle(overlay.getSize(true))
            .setStyle(overlay.getPosition(true))
            .show();
        chain.fire();
        return overlay;
    }
})

.add('fade', {
    hide: function(overlay, chain) {
        overlay.getContainer()
            .animate({opacity: {to: 0}}, 0.4)
            .hide()
            ._(chain.toFunction());
        return chain;
    },
    
    show: function(overlay, chain) {
        overlay.getContainer()
            .setStyle({opacity: 0})
            .setStyle(overlay.getSize(true))
            .setStyle(overlay.getPosition(true))
            .show()
            .animate({opacity: {to: overlay.getOpacity()}}, 0.4)
            ._(chain.toFunction());
        return chain;
    }
})

.add('zoom', {
    hide: function(overlay, chain) {
        var region = overlay.getRegion(), center = region.getCenter();
        var left = (region.left + center.left) / 2, top = (region.top + center.top) / 2;
        var width = region.getWidth() / 2, height = region.getHeight() / 2;
        overlay.getContainer()
            .animate({
                opacity: {to: 0},
                left: {to: left}, top: {to: top},
                width: {to: width}, height: {to: height}
            }, 0.4, {easing: 'easeOutStrong'})
            .hide()
            ._(chain.toFunction());
        return chain;
    },
    
    show: function(overlay, chain) {
        var position = overlay.getPosition(), size = overlay.getSize();
        overlay.getContainer()
            .setStyle({
                opacity: 0,
                left: (position.left + size.width/4) + 'px',
                top: (position.top + size.height/4) + 'px',
                width: (size.width / 2) + 'px', height: (size.height / 2) + 'px'
            })
            .show()
            .animate({
                opacity: {to: overlay.getOpacity()},
                left: {to: position.left}, top: {to: position.top},
                width: {to: size.width}, height: {to: size.height}
            }, 0.4, {easing: 'easeOutStrong'})
            ._(chain.toFunction());
        return chain;
    }
});
