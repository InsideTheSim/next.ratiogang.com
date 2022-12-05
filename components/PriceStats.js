import { html } from '@arrow-js/core'
import { prices, ratio, userConfig } from '../store.js'
import { formatPrice } from '../lib/utils'

export default html`
<div class="price-stats" data-text-select="true">
    ETH: <span class="monospace">${() => formatPrice(prices.ETH, userConfig.currency.format, userConfig.currency.id)}</span> (${() => prices.ETH_change_24h}%)
    BTC: <span class="monospace">${() => formatPrice(prices.BTC, userConfig.currency.format, userConfig.currency.id)}</span> (${() => prices.BTC_change_24h}%)
    Ratio: <span class="monospace">${() => ratio.current.toFixed(6)}</span> (${() => ratio.change_24h}%)
</div>
`