
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Header from './componets/Header'
import Home from './Page/Home'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path= {"/"} exact={true} element = {<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
