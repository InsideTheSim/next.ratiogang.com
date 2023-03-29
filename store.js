import { reactive } from "@arrow-js/core"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { formatPrice } from "./lib/utils"

dayjs.extend(relativeTime)

const userConfig = reactive({
  currency: {
    label: "🇺🇸 USD",
    format: "en-US",
    id: "USD",
  },
})
userConfig.$on("currency", () => {
  prices.ETH = 0
  prices.BTC = 0
})

const siteOptions = {
  currencies: [
    {
      label: "🇺🇸 USD",
      format: "en-US",
      id: "USD",
    },
    {
      label: "🇪🇺 EUR",
      format: "en-IE",
      id: "EUR",
    },
    {
      label: "🇬🇧 GBP",
      format: "en-GB",
      id: "GBP",
    },
  ],
  getAvailableCurrencies: () => {
    return siteOptions.currencies.map((currency) => currency.id)
  },
}

const prices = reactive({
  ETH: 0,
  BTC: 0,
  ETH_open_24h: 0,
  BTC_open_24h: 0,
  ETH_change_24h: 0,
  BTC_change_24h: 0,
})

const ratio = reactive({
  current: 0,
  open_24h: 0,
  change_24h: 0,
  flippty: 0,
  flipptyPrice: 0,
  flippening: 0,
  flippeningPrice: 0,
  meterLimit: 0.2,
  inputElement: null,
  userDefined: false,
})

const marketData = reactive({
  bitcoin: {},
  ethereum: {},
})

const ethStats = reactive({
  lastUpdated: dayjs(marketData.ethereum.last_updated).fromNow(),
  nodeCost: formatPrice(
    prices.ETH * 32,
    userConfig.currency.format,
    userConfig.currency.id
  ),
  supply: parseFloat(marketData.ethereum.circulating_supply)
    .toFixed(4)
    .toLocaleString("en-US"),
})

const content = reactive({
  taglines: {
    0.0426: "Because seriously, what the fuck you guys.",
    0.068: "In retrospect, it was inevitable.",
    0.069: "Nice.",
    0.0825: "Feel the burn!",
    0.1: "Approaching market rationality.",
    0.145: "Oh Lawd, he coming!",
  },
  markers: [], // generated once requisit data is available in setupMarkers()
})

ratio.$on("flippty", () => {
  content.taglines[parseFloat(ratio.flippty)] = "Mom! Get the camera!"
  setupMarkers()
})
ratio.$on("flippening", () => {
  content.taglines[parseFloat(ratio.flippening)] = "*excited dolphin noises*"
  setupMarkers()
})

marketData.$on("ethereum", () => {
  parseEthStats()
})
prices.$on("ETH", () => {
  parseEthStats()
})

function setupMarkers() {
  if (ratio.flippty && ratio.flippening) {
    content.markers = [
      {
        id: "party",
        value: "0.03",
        label: `
                    <a href="https://twitter.com/LUKACACIC/status/1377371626656952326" target="_blank" rel="noopener noreferrer">
                        Death of ETH Party
                    </a>
                `,
        icon: `🎉`,
        min: 0.1,
        max: 0.3,
      },
      {
        id: "flippty",
        value: ratio.flippty,
        label: "Flippty Percent",
        icon: `🦐`,
        min: 0.1,
        max: 0.2,
      },
      {
        id: "flippening",
        value: ratio.flippening,
        label: "The Flippening",
        icon: `🐬`,
        min: 0.2,
        max: 1,
      },
      {
        id: "double",
        value: (ratio.flippening * 2).toFixed(5),
        label: "The Double Dolph",
        icon: `🐬🐬`,
        min: 0.4,
        max: 1,
      },
      {
        id: "trip",
        value: (ratio.flippening * 3).toFixed(5),
        label: "The Trip Flip",
        icon: `🐬<br>🐬🐬`,
        min: 0.6,
        max: 1,
      },
      {
        id: "quad",
        value: (ratio.flippening * 4).toFixed(5),
        label: "The Quad Pod",
        icon: `🐬🐬<br>🐬🐬`,
        min: 0.8,
        max: 1,
      },
    ]
  }
}

function parseEthStats() {
  ;(ethStats.lastUpdated = dayjs(marketData.ethereum.last_updated).fromNow()),
    (ethStats.nodeCost = formatPrice(
      prices.ETH * 32,
      userConfig.currency.format,
      userConfig.currency.id
    ))
  ethStats.supply = parseFloat(marketData.ethereum.circulating_supply)
    .toFixed(4)
    .toLocaleString(userConfig.currency.format)
  console.log(marketData.ethereum)
}

export { userConfig, siteOptions, prices, ratio, marketData, content, ethStats }
