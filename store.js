import { reactive, watch } from "@arrow-js/core"

const userConfig = reactive({
    siteTheme: 'dark',
    userCurrency: {
        label: '🇺🇸 USD',
        format: 'en-US',
        id: 'USD'
    }
})

const siteOptions = {
    themes: [
        {
          id: 'system',
          label: '🌗 Auto',
        },
        {
          id: 'light',
          label: '☀️ Light',
        },
        {
          id: 'dark',
          label: '🌙 Dark',
        },
    ],
    currencies: [
        {
            label: '🇺🇸 USD',
            format: 'en-US',
            id: 'USD'
        },
        {
            label: '🇪🇺 EUR',
            format: 'en-IE',
            id: 'EUR'
        },
        {
            label: '🇬🇧 GBP',
            format: 'en-GB',
            id: 'GBP'
        },
    ],
    getAvailableCurrencies: () => {
        return siteOptions.currencies.map(currency => currency.id)
    }
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
    flippeningPrice: 0
})

const marketData = reactive({
    bitcoin: {},
    ethereum: {}
})

const content = reactive({
    taglines: {
        0.0426: 'Because seriously, what the fuck you guys.',
        0.068: 'In retrospect, it was inevitable.',
        0.069: 'Nice.',
        0.0825: 'Feel the burn!',
        0.1: 'Approaching market rationality.',
        0.145: 'Oh Lawd, he coming!',        
    }
})
ratio.$on('flippty', () => content.taglines[parseFloat(ratio.flippty)] = 'Mom, get the camera!')
ratio.$on('flippening', () => content.taglines[parseFloat(ratio.flippening)] = '*excited dolphin noises*')

export {
    userConfig,
    siteOptions,
    prices,
    ratio,
    marketData,
    content
}