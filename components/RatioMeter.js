import { html } from '@arrow-js/core'
import { prices, content, ratio } from '../store.js'
import { formatPrice, getUserCurrencyID, onRangeChange} from '../lib/utils'

function setupRatioRangeInput () {
    ratio.inputElement = document.getElementById('ratio-range-input');
    if (ratio.inputElement) onRangeChange(ratio.inputElement, setUserDefinedRatioValue)
}

function setUserDefinedRatioValue() {
    ratio.userDefinedValue = Math.min(parseFloat(ratio.inputElement.value), ratio.meterLimit)
    ratio.userDefined = true
}

function increaseRatioRange () {
    ratio.meterLimit = Math.min(parseFloat(ratio.meterLimit) + 0.1, 1).toFixed(1)
    setUserDefinedRatioValue()
}
function decreaseRatioRange () {
    ratio.meterLimit = Math.max(parseFloat(ratio.meterLimit) - 0.1, 0.1).toFixed(1)
    setUserDefinedRatioValue()
}
function resetRatioRange () {
    ratio.userDefined = false
    ratio.meterLimit = 0.2
}

export default html`
<div class="ratio-meter">
    <span>value: ${() => ratio.userDefined ? parseFloat(ratio.userDefinedValue || ratio.current).toFixed(5) : parseFloat(ratio.current).toFixed(5)}</span>
    <input 
        id="ratio-range-input"
        type="range"
        step="0.001" 
        min="0" 
        max="${() => ratio.meterLimit}" 
        value="${() => {
            // once we have a value, set up the watcher for the meter
            if (!ratio.inputElement) {
                setupRatioRangeInput()
            }
            // always return the value
            return ratio.userDefined ? parseFloat(ratio.userDefinedValue).toFixed(5) : ratio.current
        }}"
    />
    <span>${() => ratio.meterLimit}</span>
    <button @click="${decreaseRatioRange}">-</button>
    <button @click="${increaseRatioRange}">+</button>
    ${() => ratio.userDefined ? html`<button @click="${resetRatioRange}">Reset Meter</button>` : ''}
    
    <ul>
    ${() => content.markers.map(
        item => html`
        <li>
            ${item.value}: <strong>${item.label} - ${formatPrice((prices.BTC * item.value), 'en-US', getUserCurrencyID())}</strong><br>
            ${item.icon}
        </li>
        `.key(item.label)
    )}
    </ul>
</div>
`
