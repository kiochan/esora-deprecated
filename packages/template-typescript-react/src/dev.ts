import { createRoot } from 'react-dom/client'
import { createElement } from 'react'
import App from './index'

// Render your React component instead
const root = createRoot(document.getElementById('root') as HTMLElement)
root.render(createElement(App))
