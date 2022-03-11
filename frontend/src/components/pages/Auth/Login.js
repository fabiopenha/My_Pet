import {useState, useContext} from 'react'
import { Link } from 'react-router-dom'
import Input from '../../form/Input'

import styles from '../../form/form.module.css'

// context
import {Context} from '../../../context/UserContext'


function Login() {
    const [user, setUser] = useState({})
    const {login} = useContext(Context)

    function handleChange(e) {
        setUser({...user, [e.target.name]: e.target.value})
    }

    function handleSubmit(e) {
        e.preventDefault()
        login(user)
    }
    return (
        <section className={styles.form_container}>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <Input
                    text="E-mail"
                    type="email"
                    name="email"
                    placeholder="Digite o seu e-mail"
                    handleOnChange={handleChange}
                />

                <Input
                    text="senha"
                    type="password"
                    name="password"
                    placeholder="Digite a sua Senha"
                    handleOnChange={handleChange}
                />

                <input type="submit" value="Entrar"/>
            </form>
            <p>
                Não tem conta? <Link to="/register">clique aqui.</Link>
            </p>
        </section>
    )
}

export default Login;