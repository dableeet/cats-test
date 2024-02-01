import Main from './components/Main';
import Navbar from './components/Navbar';

import './global.scss';
import CatsContextProvider from './contexts/CatsContext';

function App() {
  return (
    <CatsContextProvider>
      <header>
        <Navbar />
      </header>
      <Main />
    </CatsContextProvider>
  );
}

export default App;
