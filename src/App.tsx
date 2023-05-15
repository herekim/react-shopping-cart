import { PayssionProvider } from 'payssion'
import { Provider } from 'react-redux'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { Nav, Modal } from '@/components'
import { ModalProvider } from '@/providers'
import routes from '@/routes'

import store from './stores/store'

function App() {
  return (
    <div className="root">
      <BrowserRouter>
        <Provider store={store}>
          <PayssionProvider>
            <ModalProvider>
              <Nav />
              <Routes>
                {routes.map((route) => (
                  <Route key={route.path} path={route.path} element={route.element} />
                ))}
              </Routes>
              <Modal />
            </ModalProvider>
          </PayssionProvider>
        </Provider>
      </BrowserRouter>
    </div>
  )
}

export default App
