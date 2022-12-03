import { html } from '@arrow-js/core'
import { prices, ratio, userConfig } from '../store.js'
import { formatPrice } from '../lib/utils'

export default html`
<div class="price-stats">
    ETH: ${() => formatPrice(prices.ETH, userConfig.currency.format, userConfig.currency.id)} (${() => prices.ETH_change_24h}%)
    BTC: ${() => formatPrice(prices.BTC, userConfig.currency.format, userConfig.currency.id)} (${() => prices.BTC_change_24h}%)
    Ratio: ${() => ratio.current.toFixed(6)} (${() => ratio.change_24h}%)
</div>
`