import { html } from '@arrow-js/core'
import { siteOptions, userConfig } from '../store.js'
import DynamicTagline from './DynamicTagline.js'
import Dropdown from './Dropdown.js'

function updateUserConfig(payload) {
    userConfig[payload.updateKey] = payload.value
}

export default html`
<div class="the-site-header">
    <div class="logo-container">
        <h1>
            <span class="emoji">💪</span>
            &nbsp;RatioGang&nbsp;
            <span class="emoji">📈</span>
        </h1>
        ${DynamicTagline}
    </div>
    <div class="site-options">
        ${Dropdown({
            items: siteOptions.themes, 
            callback: updateUserConfig, 
            updateKey: 'theme', 
            initialValue: userConfig.theme.label
        })}
        ${Dropdown({
            items: siteOptions.currencies, 
            callback: updateUserConfig, 
            updateKey: 'currency', 
            initialValue: userConfig.currency.label
        })}
    </div>
</div>
`
