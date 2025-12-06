import { HelmetProvider } from "react-helmet-async"
import AppNavigation from "./navigation/Navigation"
import { Provider } from 'react-redux'
import store from "./redux/store"
import { Toaster } from "react-hot-toast"

function App() {


  return (
    <>
      <Provider store={store}>
        <HelmetProvider>
          
          <Toaster
  position="top-center"
  reverseOrder={false}
  containerStyle={{
    zIndex:'9999999'
  }}
/>
          <AppNavigation />
        </HelmetProvider>
      </Provider>
    </>
  )
}

export default App