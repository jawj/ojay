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
});
