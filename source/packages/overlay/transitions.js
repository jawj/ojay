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
                .setStyle(overlay.getSize())
                .setStyle(overlay.getPosition())
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
                .setStyle(overlay.getSize())
                .setStyle(overlay.getPosition())
                .show()
                .animate({opacity: {to: overlay.getOpacity()}}, 0.4)
                ._(chain.toFunction());
        return chain;
    }
})

.add('zoom', {
    hide: function(overlay, chain) {
        var region = overlay.getRegion(), center = region.getCenter();
        overlay.getContainer()
                .animate({
                    opacity: {to: 0},
                    left: {to: center.left}, top: {to: center.top},
                    width: {to: 1}, height: {to: 1}
                }, 0.4, {easing: 'easeOutStrong'})
                .hide()
                ._(chain.toFunction());
        return chain;
    },
    
    show: function(overlay, chain) {
        var position = overlay.getPosition(), size = overlay.getSize(),
                left = parseInt(position.left), top = parseInt(position.top),
                width = parseInt(size.width), height = parseInt(size.height);
        overlay.getContainer()
                .setStyle({opacity: 0, left: (left + width/2) + 'px', top: (top + height/2) + 'px', width: '1px', height: '1px'})
                .show()
                .animate({
                    opacity: {to: overlay.getOpacity()},
                    left: {to: left}, top: {to: top},
                    width: {to: width}, height: {to: height}
                }, 0.4, {easing: 'easeOutStrong'})
                ._(chain.toFunction());
        return chain;
    }
});
