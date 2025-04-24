import './App.css';
import Navbar from './Navbar';
import Home from './Home';

function App() {
  return (
    <div className="App">
      <Navbar></Navbar>
      <div className="App flex-column">
        <Home></Home>
      </div>
    </div>
  );
}

export default App;

// this component will represent home page for display all posts
