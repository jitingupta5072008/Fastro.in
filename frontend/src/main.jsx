import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { OrderProvider } from './context/OrderContext.jsx';
import { CartProvider } from './Pages/Cart/CartContext.jsx'


createRoot(document.getElementById('root')).render(
  <CartProvider>
    <OrderProvider>
    <App />
    </OrderProvider>
  </CartProvider>,
)

{/* <CartProvider>
      <CartPage />
    </CartProvider> */}
