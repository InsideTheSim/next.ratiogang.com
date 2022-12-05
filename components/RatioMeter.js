import { html } from '@arrow-js/core'
import { prices, content, ratio, userConfig } from '../store.js'
import { formatPrice, onRangeChange} from '../lib/utils'

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
    <input 
        id="ratio-range-input"
        type="range"
        step="0.00001" 
        min="0.00001" 
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
    <div class="ratio-meter-ui-element">
        <div class="ratio-meter-track">
            <div 
                class="ratio-meter-track-fill"
                style="${() => `max-width: calc(${((ratio.userDefined ? parseFloat(ratio.userDefinedValue).toFixed(5) : ratio.current) / ratio.meterLimit) * 100}%);`}"
                data-percent="${() =>  `${(((ratio.userDefined ? parseFloat(ratio.userDefinedValue).toFixed(5) : ratio.current) / ratio.flippening) * 100).toFixed(2)}%`}"
            >
            </div>
        </div>
        <span class="meter-limit">${() => ratio.meterLimit}</span>
    </div>
    
    <ul id="ratio-meter-markers">
        <li 
            class="current-marker"
            style="${() => `left: ${((ratio.userDefined ? parseFloat(ratio.userDefinedValue).toFixed(5) : ratio.current) / ratio.meterLimit) * 100}%;`}"
            data-active="${() => ratio.userDefined}"
        >
            <span class="value">${() => ratio.userDefined ? parseFloat(ratio.userDefinedValue || ratio.current).toFixed(5) : parseFloat(ratio.current).toFixed(5)}</span>
            <span class="price monospace">(${() => {
                return formatPrice(
                    (ratio.userDefined ? parseFloat(ratio.userDefinedValue || ratio.current) : parseFloat(ratio.current)) * prices.BTC, 
                    userConfig.currency.format, 
                    userConfig.currency.id
                )}
            })</span>
            ${() => {
                return ratio.userDefined ? 
                    html`<button @click="${resetRatioRange}">Reset Meter</button>` : 
                    html`<span class="label">We're here.</span>`
                }
            }
        </li>
        ${() => content.markers.map(item => {
            if (prices.BTC && item.min <= parseFloat(ratio.meterLimit) && item.max >= parseFloat(ratio.meterLimit)) {
                return html`
                <li 
                    class="target-marker"
                    style="${() => `left: ${(item.value / ratio.meterLimit) * 100}%;`}"
                    data-active="${() => ratio.current >= item.value}"
                >
                    <span class="value">${item.value}</span>
                    <span class="price monospace">(${formatPrice((prices.BTC * item.value), userConfig.currency.format, userConfig.currency.id)})</span>
                    <span class="label">${item.label}</span>
                    <span class="icon">${item.icon}</span>
                </li>
                `.key(`${item.id}-${userConfig.currency.id}`)
            }
        })}
    </ul>

    <div class="ratio-meter-controls">
        ${() => {
            if (ratio.meterLimit < 1) {
                return html`
                <button class="increase" @click="${increaseRatioRange}">
                    <svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="caret-up"><path fill="currentColor" d="M32.032 352h255.93c28.425 0 42.767-34.488 22.627-54.627l-127.962-128c-12.496-12.496-32.758-12.497-45.255 0l-127.968 128C-10.695 317.472 3.55 352 32.032 352zM160 192l128 128H32l128-128z"></path></svg>
                </button>
                `
            }
        }}
        ${() => {
            if (ratio.meterLimit > 0.1) {
                return html`
                <button class="decrease" @click="${decreaseRatioRange}">
                    <svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="caret-down"><path fill="currentColor" d="M287.968 160H32.038c-28.425 0-42.767 34.488-22.627 54.627l127.962 128c12.496 12.496 32.758 12.497 45.255 0l127.968-128C330.695 194.528 316.45 160 287.968 160zM160 320L32 192h256L160 320z"></path></svg>
                </button>
                `
            }
        }}
    </div>
</div>
`
