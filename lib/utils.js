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

export function throttle(callback, limit) {
    let waiting = false
    return function () {
        if (!waiting) {
            callback.apply(this, arguments)
            waiting = true
            setTimeout(function () {
                waiting = false
            }, limit)
        }
    }
}