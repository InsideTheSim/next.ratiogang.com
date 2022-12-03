import { userConfig } from '../store.js'

export function formatPrice(price, locale = 'en-US', currency = 'usd') {
    const parsedPrice = parseFloat(price)
    if (typeof parsedPrice === 'number') {
        return parsedPrice.toLocaleString(locale, {
            style: 'currency',
            currency
        })
    }
    return price
}

export function getUserCurrencyID () {
    return userConfig.userCurrency ? userConfig.userCurrency.id.toUpperCase() : 'USD'
}

export function throttle(callback, limit, maxLimit = false, limitIncrement = 50) {
    let waiting = false
    let timeBetweenCalls = limit

    return function () {
        if (!waiting) {
            callback.apply(this, arguments)
            waiting = true
            setTimeout(function () {
                waiting = false
                if (maxLimit) {
                    timeBetweenCalls += limitIncrement // increase time between calls by 100ms
                    timeBetweenCalls = Math.min(timeBetweenCalls, maxLimit) // make sure timeBetweenCalls does not exceed maxLimit
                }
            }, timeBetweenCalls)
        }
    }
}

// standardize change event handling for range inputs (https://stackoverflow.com/questions/18544890/onchange-event-on-input-type-range-is-not-triggering-in-firefox-while-dragging/37623959#37623959)
export function onRangeChange(r,f) {
    var n,c,m;
    r.addEventListener("input",function(e){n=1;c=e.target.value;if(c!=m)f(e);m=c;});
    r.addEventListener("change",function(e){if(!n)f(e);});
}