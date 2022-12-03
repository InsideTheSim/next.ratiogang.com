import { userConfig, siteOptions, prices, marketData, ratio } from '../store.js'
import { throttle, getUserCurrencyID } from './utils'

function createPriceFeed() {
    closePriceFeeds()
    const feedDelay = 0
    const feedDelayMax = 500
    const feedDelayIncrement = 50
    const userCurrency = getUserCurrencyID()
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
            }, feedDelay, feedDelayMax, feedDelayIncrement)
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

async function getMarketCapData() {
    try {
        ['bitcoin', 'ethereum'].forEach(async (token) => {
            await fetch(`https://api.coingecko.com/api/v3/coins/${token}?tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`)
            .then(res =>  res.json())
            .then(data => {
                marketData[token] = data.market_data
            })
        }) 
    } catch (e) {
        console.error('unable to fetch Coingecko marketcap data', e)
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
        ratio.flippening = (marketData.bitcoin.circulating_supply / marketData.ethereum.circulating_supply).toFixed(5)
        ratio.flippty = (ratio.flippening / 2).toFixed(5)
        ratio.flippeningPrice = ((ratio.flippening / ratio.current) * prices.ETH).toFixed(2)
        ratio.flipptyPrice = ((ratio.flippty / ratio.current) * prices.ETH).toFixed(2)
    }
}
prices.$on('ETH', calculateRatioTargets)
prices.$on('BTC', calculateRatioTargets)

export { 
    createPriceFeed,
    getMarketCapData,
    calculateRatioTargets
}