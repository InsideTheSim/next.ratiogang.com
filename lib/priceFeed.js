import { userConfig, siteOptions, prices, ratio } from '../store.js'
import { throttle } from './utils'

function createPriceFeed() {
    closePriceFeeds()
    const feedDelay = 1000
    const userCurrency = userConfig.userCurrency ? userConfig.userCurrency.id.toUpperCase() : false
    if (
        userCurrency &&
        siteOptions.getAvailableCurrencies().includes(userConfig.userCurrency.id.toUpperCase())
    ) {
        ['ETH', 'BTC'].forEach(token => {
            const ticker = token.includes('-') ? token : `${token}-${userCurrency}`
            let coinbaseWSS = new WebSocket('wss://ws-feed.exchange.coinbase.com')
            coinbaseWSS.onopen = () => {coinbaseWSS.send(JSON.stringify({
                type: 'subscribe',
                product_ids: [ticker],
                channels: ['ticker']
            }))}
            coinbaseWSS.onmessage = throttle((msg) => {
                const data = JSON.parse(msg.data)
                if (data.type === 'ticker') {
                    prices[token] = data.price
                    prices[`${token}_open_24h`] = data.open_24h
                    prices[`${token}_change_24h`] = ((data.price - data.open_24h) / data.open_24h * 100).toFixed(2)

                    if (prices.ETH && prices.BTC) {
                        ratio.current = prices.ETH / prices.BTC
                        ratio.open_24h = prices.ETH_open_24h / prices.BTC_open_24h
                        ratio.change_24h = ((ratio.current - ratio.open_24h) / ratio.open_24h * 100).toFixed(2)
                    }
                }
            }, feedDelay)
        })
    }
}

function closePriceFeeds() {
    ['ETH', 'BTC'].forEach(token => {
        if (
            prices[`coinbaseWSS_${token}`] &&
            typeof prices[`coinbaseWSS_${token}`].close === 'function'
        ) {
            prices[`coinbaseWSS_${token}`].close()
            prices[`coinbaseWSS_${token}`] = false
        }
    })
    ratio.current = 0
}

export { createPriceFeed }