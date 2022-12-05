import { html } from '@arrow-js/core'
import { prices, ratio, userConfig } from '../store.js'
import { formatPrice } from '../lib/utils'

export default html`
<ul class="price-stats" data-text-select="true">
    <li>
        <strong>ETH:</strong><span class="monospace">${() => formatPrice(prices.ETH, userConfig.currency.format, userConfig.currency.id)}</span>
        <span class="percent-change">
            <span data-negative="${() => parseFloat(prices.ETH_change_24h) < 0}">
                ${() => prices.ETH_change_24h}%
            </span> 24h
        </span>
    </li>
    <li>
        <strong>BTC:</strong><span class="monospace">${() => formatPrice(prices.BTC, userConfig.currency.format, userConfig.currency.id)}</span>
        <span class="percent-change">
            <span data-negative="${() => parseFloat(prices.BTC_change_24h) < 0}">
                ${() => prices.BTC_change_24h}%
            </span> 24h
        </span>
    </li>
    <li>
        <strong>Ratio:</strong><span class="monospace">${() => ratio.current.toFixed(6)}</span>
        <span class="percent-change">
            <span data-negative="${() => parseFloat(ratio.change_24h) < 0}">
                ${() => ratio.change_24h}%
            </span> 24h
        </span>
    </li>
</ul>
`