import React from 'react';
import './App.css';
import Ecommerce from './components/ecommerce';
import Cart from './components/cart';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={Ecommerce} />
        <Route path='/cart' component={Cart} />
      </Switch>
    </Router>
  );
}

export default App;
