import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';  // 导入你创建的 Home 组件
import TrPractice from './components/TrPractice';  // 导入你创建的 TrPractice 组件

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tr-practice" element={<TrPractice />} />
        {/* 在这里可以添加更多的路由 */}
      </Routes>
    </Router>
  );
}

export default App;