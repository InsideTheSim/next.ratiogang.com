import { html } from "@arrow-js/core"
import { ethStats, userConfig } from "../store.js"

export default html`
  <div class="eth-stats">
    <table>
      <thead>
        <tr>
          <td colspan="2">
            Ethereum Statistics
            <small>(Last Update: ${() => ethStats.lastUpdated})</small>
          </td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Cost of Ethereum PoS Validator</strong></td>
          <td>${() => ethStats.nodeCost}</td>
        </tr>
        <tr>
          <td><strong>Ethereum Circulating Supply</strong></td>
          <td>
            ${() =>
              parseFloat(ethStats.supply).toLocaleString(
                userConfig.currency.format
              )}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
`
