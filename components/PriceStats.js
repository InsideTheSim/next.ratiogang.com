import { html } from '@arrow-js/core'
import { prices, ratio } from '../store.js'
import { formatPrice, getUserCurrencyID } from '../lib/utils'

export default html`
<div class="price-stats">
    ETH: ${() => formatPrice(prices.ETH, 'en-US', getUserCurrencyID())} (${() => prices.ETH_change_24h}%)
    BTC: ${() => formatPrice(prices.BTC, 'en-US', getUserCurrencyID())} (${() => prices.BTC_change_24h}%)
    Ratio: ${() => ratio.current.toFixed(6)} (${() => ratio.change_24h}%)
</div>
`