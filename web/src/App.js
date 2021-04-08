import logo from './assets/stonks4.png';
import './App.css';
import LogInForm from "./login/LogInForm";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
            <p className="Logo-text-down">Not Stonks</p>
              <p className="Logo-text-up">Stonks</p>
        <LogInForm/>
      </header>
    </div>
  );
}

export default App;
