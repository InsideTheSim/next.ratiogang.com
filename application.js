import { html } from "@arrow-js/core"
import SiteHeader from "./components/SiteHeader.js"
import PriceStats from "./components/PriceStats.js"
import RatioMeter from "./components/RatioMeter.js"
import EthereumStats from "./components/EthereumStats.js"
import { createPriceFeed, getMarketCapData } from "./lib/tokenInfo.js"

// get Coinbase price feeds from websocket
createPriceFeed()

// get coin market data from Coingecko and refetch on interval
getMarketCapData()
setInterval(getMarketCapData, 20000)

// Mount our application components
html`
  <div class="layout-container">
    ${SiteHeader} ${PriceStats} ${RatioMeter} ${EthereumStats}
  </div>
`(document.getElementById("app"))
