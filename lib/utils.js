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

export function getUserCurrencyID() {
    return userConfig.currency ? userConfig.currency.id.toUpperCase() : 'USD'
}

// standardize change event handling for range inputs 
// (https://stackoverflow.com/questions/18544890/onchange-event-on-input-type-range-is-not-triggering-in-firefox-while-dragging/37623959#37623959)
export function onRangeChange(r, f) {
    var n, c, m;
    r.addEventListener("input", function (e) { n = 1; c = e.target.value; if (c != m) f(e); m = c; });
    r.addEventListener("change", function (e) { if (!n) f(e); });
}

export function onClickAway(id, callback) {
    const el = document.getElementById(id)
    document.addEventListener('click', event => {
        const isClickInside = el.contains(event.target)
        if (!isClickInside) {
            callback()
        }
    })
}

export function uuid() {
    return `${new Date().getTime()}-${Math.random()}`
}