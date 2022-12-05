import { html, reactive } from '@arrow-js/core'
import { onClickAway, uuid } from '../lib/utils.js'

export default function dropdown(options) {
    const dropdownID = `dropdown-${uuid()}`
    const { items, callback, updateKey, initialValue } = options
    const state = reactive({
        isOpen: false,
        selection: initialValue ? initialValue : items[0].label
    })

    state.$on('selection', (value) => {
        callback({ updateKey, value: items.find((item => item.label === value)) })
    })

    setTimeout(() => {
        onClickAway(dropdownID, () => {
            state.isOpen = false
        })
    }, 100)

    return html`
    <div
        id="${dropdownID}"
        class="dropdown"
        @click="${() => { state.isOpen = !state.isOpen }}"
        data-is-open="${() => state.isOpen}"
    >
        <ul
        class="dropdown-list"
        >
        ${() => items.map(item =>
            html`
            <li
            data-selected="${() => item.label === state.selection}"
            @click="${() => {
                    state.selection = item.label
                }}"
            >
            ${item.label}
            </li>`
        )}
        </ul>
    </div>
    `
}