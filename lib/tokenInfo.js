import {
  userConfig,
  siteOptions,
  prices,
  marketData,
  ratio,
  ethStats,
} from "../store.js"
import { getUserCurrencyID } from "./utils"

let coinbaseWSS = null

function createPriceFeed() {
  // if we have a price feed, then close it
  closePriceFeed()
  let bootstrapped = false

  const userCurrency = getUserCurrencyID()
  const tickers = [`ETH-${userCurrency}`, `BTC-${userCurrency}`]

  if (
    userCurrency &&
    siteOptions
      .getAvailableCurrencies()
      .includes(userConfig.currency.id.toUpperCase())
  ) {
    // get information in sync as quickly as possible, then terminate to
    // save bandwidth.
    coinbaseWSS = new WebSocket("wss://ws-feed.exchange.coinbase.com")
    coinbaseWSS.onopen = () => {
      coinbaseWSS.send(
        JSON.stringify({
          type: "subscribe",
          product_ids: tickers,
          channels: ["ticker", "ticker_batch"],
        })
      )
    }
    coinbaseWSS.onmessage = (msg) => {
      updatePriceFromFeed(msg)
    }

    // once we have enough data to calculate the ratio, we can close
    // the ticker feed and only use the lower rate ticker_batch feed
    ratio.$on("current", () => {
      if (!bootstrapped) {
        coinbaseWSS.send(
          JSON.stringify({
            type: "unsubscribe",
            channels: ["ticker"],
          })
        )
      }
      bootstrapped = true
    })

    function updatePriceFromFeed(msg) {
      const data = JSON.parse(msg.data)
      if (data.type === "ticker") {
        const token = data.product_id.split("-")[0]
        prices[token] = data.price
        prices[`${token}_open_24h`] = data.open_24h
        prices[`${token}_change_24h`] = (
          ((data.price - data.open_24h) / data.open_24h) *
          100
        ).toFixed(2)

        if (prices.ETH && prices.BTC) {
          ratio.current = prices.ETH / prices.BTC
          ratio.open_24h = prices.ETH_open_24h / prices.BTC_open_24h
          ratio.change_24h = (
            ((ratio.current - ratio.open_24h) / ratio.open_24h) *
            100
          ).toFixed(2)
        }
      }
    }
  }
}

// if the user changes their currency, then recreate the price feed
userConfig.$on("currency", createPriceFeed)

function closePriceFeed() {
  if (!coinbaseWSS) return
  coinbaseWSS.send(
    JSON.stringify({
      type: "unsubscribe",
      channels: ["ticker", "ticker_batch"],
    })
  )
  coinbaseWSS.close()
  coinbaseWSS = null
}

async function getMarketCapData() {
  try {
    ;["bitcoin", "ethereum"].forEach(async (token) => {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${token}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
        { mode: "cors" }
      )
      const data = await response.json()
      marketData[token] = data.market_data
    })
  } catch (e) {
    console.error("unable to fetch Coingecko marketcap data", e)
  }
}

function calculateRatioTargets() {
  if (
    marketData.bitcoin.circulating_supply &&
    marketData.ethereum.circulating_supply &&
    prices.ETH &&
    prices.BTC &&
    ratio.current
  ) {
    ratio.flippening = (
      marketData.bitcoin.circulating_supply /
      marketData.ethereum.circulating_supply
    ).toFixed(5)
    ratio.flippty = (ratio.flippening / 2).toFixed(5)
    ratio.flippeningPrice = (
      (ratio.flippening / ratio.current) *
      prices.ETH
    ).toFixed(2)
    ratio.flipptyPrice = ((ratio.flippty / ratio.current) * prices.ETH).toFixed(
      2
    )
  }
}
ratio.$on("current", calculateRatioTargets)

export { createPriceFeed, getMarketCapData, calculateRatioTargets }
