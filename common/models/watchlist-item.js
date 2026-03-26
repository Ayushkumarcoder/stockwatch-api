'use strict';

module.exports = function(Watchlistitem) {

    Watchlistitem.observe('before save', function(ctx, next){
        if(ctx.instance){
            ctx.instance.symbol = ctx.instance.symbol.toUpperCase();
        }
        next();
    })
};
