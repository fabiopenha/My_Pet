import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

/* Components */
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Container from './components/layout/Container'
import Message from './components/layout/Message'

/* Pages */
import Home from './components/pages/Auth/Home';
import Login from './components/pages/Auth/Login';
import Register from './components/pages/Auth/Register';
import Profile from './components/pages/User/Profile';
import MyPets from './components/pages/Pets/MyPets';
import AddPet from './components/pages/Pets/AddPet';
import EditPet from './components/pages/Pets/EditPet';
import PetDatails from './components/pages/Pets/PetDetails';
import MyAdoptions from './components/pages/Pets/MyAdoptions';
/* Context */
import {UserProvider} from './context/UserContext'

function App() {
  return (
    <Router>
      <UserProvider>
        <Navbar />
        <Message />
        <Container>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/user/profile" element={<Profile />} />
            <Route path="/pet/mypets" element={<MyPets />} />
            <Route path="/pet/add" element={<AddPet />} />
            <Route path="/pet/:id" element={<PetDatails />} />
            <Route path="/pet/myadoptions" element={<MyAdoptions />} />
            <Route path="/pet/edit/:id" element={<EditPet />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </Container>
        <Footer/>
      </UserProvider>
    </Router>
    
  );
}

export default App;
