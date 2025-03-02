import './App.css';
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import { useEffect, useState } from 'react';
import { MenuContext, menu } from './Context/OpenMenu';
import AppRouters from './Routers';
import LoadingBar from 'react-top-loading-bar';

function App() {
  const [openSide, setOpenSide] = useState(menu.open);

  // Function to toggle the menu
  function toggleMenu() {
    openSide === menu.open ? setOpenSide(!menu.open) : setOpenSide(menu.open);
  }

  return (
    <MenuContext.Provider value={{ openSide, toggleMenu }}>
      <AppRouters />
    </MenuContext.Provider>
  );
}

export default App;
