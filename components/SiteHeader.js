import { html } from '@arrow-js/core'
import DynamicTagline from './DynamicTagline.js'

const SiteHeader = html`
<div class="the-site-header">
    <div class="logo-container">
    <h1>
        <span class="emoji">💪</span>
        &nbsp;RatioGang&nbsp;
        <span class="emoji">📈</span>
    </h1>
    ${DynamicTagline}
    </div>
</div>
`

export default SiteHeader
