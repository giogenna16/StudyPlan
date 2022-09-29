import {  Container, Button } from 'react-bootstrap';
import { GiOpenBook } from 'react-icons/gi';
import { FaUserAlt } from 'react-icons/fa';
import { LogoutButton} from './AuthComponents'
import {useNavigate} from 'react-router-dom';

function Topbar(props) {
    const  navigate = useNavigate();
    return (
        
        <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-dark">
            <Container fluid>
                <div className='d-flex align-items-center'>
                    <GiOpenBook color="white" className="mb-0 me-2 h1" />
                    <Button variant="dark" onClick={() => navigate("/")}><h1 >Study Plan</h1></Button>                   
                </div>
                {props.loggedIn ?
                    <LogoutButton logout= {props.logout}/> : 
                    <Button  variant="dark" onClick={() => navigate("/login") }><FaUserAlt color="white" className="h5 mb-0"/></Button>
                }
            </Container>
        </nav>
        
    );
}

export default Topbar;