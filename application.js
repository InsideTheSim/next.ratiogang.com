import { html } from '@arrow-js/core';
import autoAnimate from '@formkit/auto-animate';
import SiteHeader from './components/SiteHeader.js'
import PriceStats from './components/PriceStats.js'
import RatioMeter from './components/RatioMeter.js'
import { createPriceFeed, getMarketCapData } from './lib/tokenInfo.js'

// get Coinbase price feeds from websocket
createPriceFeed();

// get coin market data from Coingecko and refetch on interval
getMarketCapData();
setInterval(getMarketCapData, 15000)

// Mount our application components
html`
    ${SiteHeader}
    ${PriceStats}
    ${RatioMeter}
`(document.getElementById('app'))

// setup AutoAnimate on DOM elements
autoAnimate(document.getElementById('ratio-meter-markers'))
