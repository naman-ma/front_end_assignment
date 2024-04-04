
import './App.css';
import Login from './components/authentication/Login';
import { Route, Routes } from 'react-router-dom';
import Signup from './components/authentication/Register';
import Dashboard from './components/Dashboard/Dashboard';
import Books from './components/BookData/Books';
import PrivateComponent from './components/authentication/PrivatComponent';
import NavBar from './components/Dashboard/NavBar';
import CreateBooks from './components/BookData/CreateBooks';
import Author from './components/Author/Author';

function App() {
  let Info = (localStorage.getItem('Info'))
  if (Info) {
      Info= JSON.parse(Info)
  }
  console.log('Info:inAPPP ', Info);
  return (
    <div className="">
  <Routes>
    <Route path='/'  element={<Login />}/>
    <Route path='/register' element={<Signup />} />
    <Route element={<PrivateComponent />}>
     
    <Route path='/dashboard' element={<Dashboard Info={Info}/>} />
    <Route path='/books' element={<Books Info={Info}/>} />
    <Route path='/author' element={<Author Info={Info}/>} />
    </Route>
  </Routes>
    </div>
  );
}

export default App;
