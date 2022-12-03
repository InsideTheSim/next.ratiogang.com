import { html } from '@arrow-js/core'
import { prices, content } from '../store.js'
import { formatPrice, getUserCurrencyID } from '../lib/utils'

export default html`
<ul>
${() => content.markers.map(
    item => html`
    <li>
        ${item.value}: <strong>${item.label} - ${formatPrice((prices.BTC * item.value), 'en-US', getUserCurrencyID())}</strong><br>
        ${item.icon}
    </li>
    `
)}
</ul>
`
