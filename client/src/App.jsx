
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Header from './componets/Header'
import Footer from './componets/Footer'
import Home from './Page/Home'
import ProductListing from './Page/ProductListing'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path= {"/"} exact={true} element = {<Home />} />
          <Route path= {"/ProductListing"} exact={true} element = {<ProductListing />} />
        </Routes>
          <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
