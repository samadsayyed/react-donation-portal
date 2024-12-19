import { Route,BrowserRouter as Router, Routes } from 'react-router-dom'

function App() {

  return (
   <Router>
    
    <Routes>
      <Route path="/" element={<div>Home</div>}></Route>
      <Route path="/about" element={<div>about</div>}></Route>
      <Route path="/contact" element={<div>contact</div>}></Route>
    </Routes>
   </Router>
  )
}

export default App
