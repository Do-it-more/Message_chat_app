import { useSelector } from 'react-redux';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import './App.css';
import Login from './components/login/login';
import Register from './components/register/register';
import ChatPage from './components/ChatPage';
import socketIO from 'socket.io-client';

const socket = socketIO.connect('http://localhost:5002');
//v2
function App() {

  const login = useSelector((Item) => Item.login);

  return (
    <>  
     <BrowserRouter>
      {login ?
      <>
        <Routes>
          <Route path="/chat" exact element={<ChatPage socket={socket} />}></Route>
        </Routes>
      </>
        :
        <>
          <Routes >
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes >
        </>
      }
     </BrowserRouter>
    </>
  );
}
export default App;