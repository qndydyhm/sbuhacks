import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Login, Register, Banner } from './components'
import "./components/components.css"

const App = () => {

  return (
      <BrowserRouter>
        <Banner mode={0}/>
        <Routes>
            <Route exact path="/login/" element={< Login />} />
            <Route exact path="/register/" element={< Register />} />
        </Routes>
      </BrowserRouter>
  )
}

export default App;
