import { html } from "@arrow-js/core"
import { content, ratio } from '../store'

function getCurrentTagline() {
    if (ratio.flippening) {
        const taglines = content.taglines
        const orderedKeys = Object.keys(taglines).sort((a, b) => parseFloat(a) - parseFloat(b))
        const bestMatch = orderedKeys.find(ratioValue => {
            return ratio.current <= ratioValue
        })
        return taglines[bestMatch] || taglines[taglines.length - 1]
    }
    return '&nbsp;'
}

export default html`
<span class="dynamic-tagline">${ () => getCurrentTagline() }</span>
`