import { BrowserRouter } from "react-router-dom";
import AppRouting from './Router'
import "./App.css";


function App() {
  return (
    <div>
      <>
        <BrowserRouter>
          <AppRouting />
        </BrowserRouter>
      </>
    </div>
  );
}

export default App;
