import { html, watch } from '@arrow-js/core';
import SiteHeader from './components/SiteHeader.js'
import { createPriceFeed, getMarketCapData, calculateRatioTargets } from './lib/tokenInfo.js'
import { prices, ratio } from './store.js'
import { formatPrice, getUserCurrencyID } from './lib/utils'

// get Coinbase price feeds from websocket
createPriceFeed();

// get coin market data from Coingecko and refetch on interval
getMarketCapData();
setInterval(getMarketCapData, 15000)

html`
    ${SiteHeader}

    ETH: ${() => formatPrice(prices.ETH, 'en-US', getUserCurrencyID())} (${() => prices.ETH_change_24h}%)
    BTC: ${() => formatPrice(prices.BTC, 'en-US', getUserCurrencyID())} (${() => prices.BTC_change_24h}%)
    Ratio: ${() => ratio.current.toFixed(6)} (${() => ratio.change_24h}%)

    <br><br>

    Flippty Percent: ${() => ratio.flippty} — ${() => ratio.flipptyPrice}<br>
    The Flippening: ${() => ratio.flippening} — ${() => ratio.flippeningPrice}
`(document.getElementById('app'))

