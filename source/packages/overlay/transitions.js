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
        var region = overlay.getRegion().scale(0.5), center = region.getCenter();
        overlay.getContainer()
            .animate({
                opacity: {to: 0},
                left:   {to: region.left},      width:  {to: region.getWidth()},
                top:    {to: region.top},       height: {to: region.getHeight()}
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
                left:   {to: position.left},    width:  {to: size.width},
                top:    {to: position.top},     height: {to: size.height}
            }, 0.4, {easing: 'easeOutStrong'})
            ._(chain.toFunction());
        return chain;
    }
});
