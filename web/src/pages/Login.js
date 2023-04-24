import "./Login.css"
import axios from 'axios'

function Login() {
    if (localStorage.getItem("token")) {
        window.location = "/"
    }

    function login(e) {
        e.preventDefault();
        
        axios.post(process.env.NODE_ENV === 'development' ? "http://localhost:8080/api/login" : "/api/login", {
            username: e.target.username.value,
            password: e.target.password.value
        }).then(res => {
            if (res.status === 200) {
                localStorage.setItem("token", res.data.token)
                localStorage.setItem("user", e.target.username.value)
                window.location = "/"
            } else {
                // Notify wrong user or pass
            }
        })
    }

    return (
        <div className="page">
            <div className="panel">
                <h1>Login</h1>
                <form onSubmit={login}>
                    <div>Username</div>
                    <input name="username"></input>
                    <div>Password</div>
                    <input name="password" type="password"></input>
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    )
}

export default Login;