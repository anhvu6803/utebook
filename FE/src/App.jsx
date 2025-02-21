
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from './layout/MainLayout/MainLayout'
import WelcomPage from './pages/WelcomePage'
function App() {


  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<WelcomPage />} />
        </Route>
      </Routes>
    </Router>
   
  )
}

export default App
