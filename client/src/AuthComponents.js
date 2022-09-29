import { useState } from "react";
import { Form, Button, Row, Col } from 'react-bootstrap';

function LoginForm(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        const credentials = { username, password };
        props.login(credentials);
    };

    return (
        <Col className="col-12 col-md-4 offset-md-4 py-5 my-5 ">
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId='username' className="mt-5 pt-5">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type='email' value={username} onChange={ev => setUsername(ev.target.value)} required={true} />
                </Form.Group>

                <Form.Group controlId='password' className="mt-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} required={true} />
                </Form.Group>

                <Button className="my-4 mx-auto d-block btn-dark" type="submit">Login</Button>
            </Form>
        </Col>
    )
};

function LogoutButton(props) {
    return (
        <Row>
            <Col>
                <Button variant="outline-light" onClick={props.logout}>Logout</Button>
            </Col>
        </Row>
    )
}

export { LoginForm, LogoutButton };