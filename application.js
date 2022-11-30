import { html } from '@arrow-js/core';
import SiteHeader from './components/SiteHeader.js'
import { createPriceFeed } from './lib/priceFeed.js'
import { prices, ratio } from './store.js'
import { formatPrice } from './lib/utils'

createPriceFeed();

html`
    ${SiteHeader}

    ETH: ${() => formatPrice(prices.ETH)} (${() => prices.ETH_change_24h}%)
    BTC: ${() => formatPrice(prices.BTC)} (${() => prices.BTC_change_24h}%)
    ETH-BTC: ${() => ratio.current.toFixed(6)} (${() => ratio.change_24h}%)
`(document.getElementById('app'))

