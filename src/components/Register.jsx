import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { BiUser } from 'react-icons/bi'
import { useDispatch, useSelector } from 'react-redux'
import { register, reset } from '../features/auth/authSlice'
import { useNavigate } from 'react-router-dom'
import Spinner from '../components/Spinner'

const RegisterPage = () => {

    const [formData, setFormData] = useState({
        "first_name": "",
        "last_name": "",
        "email": "",
        "password": "",
        "re_password": "",
    })

    const { first_name, last_name, email, password, re_password } = formData

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth)

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        })
        )
    }

    const handleSubmit = (e) => {
        
        e.preventDefault()
        if (!first_name || !last_name || !email || !password || !re_password) {
            toast.error('Please fill in all fields');
            return;
        }
        
        if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        if (password !== re_password) {
            toast.error("Passwords do not match")
        }
        const userData = {
            first_name,
            last_name,
            email,
            password,
            re_password
        }
        dispatch(register(userData))
        
    }


    useEffect(() => {
        if (isError) {
            toast.error(message)
        }

        if (isSuccess && !user) {
            toast.success("Activation email sent");
            navigate("/login");
        }

        dispatch(reset())

    }, [isError, isSuccess, user, navigate, dispatch])



    return (
        <>
            <div className="container auth__container">
                <h1 className="main__title animate-fade-slide">Register <BiUser /> </h1>

                {isLoading && <Spinner />}

                <form className="auth__form animate-fade-slide" onSubmit={handleSubmit}>
                    <input className="animate-fade-slide" style={{ animationDelay: "0.1s" }} type="text"
                        placeholder="First Name"
                        name="first_name"
                        onChange={handleChange}
                        value={first_name}
                        required
                    />
                    <input className="animate-fade-slide" style={{ animationDelay: "0.2s" }} type="text"
                        placeholder="Last Name"
                        name="last_name"
                        onChange={handleChange}
                        value={last_name}
                        required
                    />
                    <input className="animate-fade-slide" style={{ animationDelay: "0.3s" }} type="email"
                        placeholder="Email"
                        name="email"
                        onChange={handleChange}
                        value={email}
                        required
                    />
                    <input className="animate-fade-slide" style={{ animationDelay: "0.4s" }} type="password"
                        placeholder="Password"
                        name="password"
                        onChange={handleChange}
                        value={password}
                        required
                    />
                    <input className="animate-fade-slide" style={{ animationDelay: "0.5s" }} type="password"
                        placeholder="Retype Password"
                        name="re_password"
                        onChange={handleChange}
                        value={re_password}
                        required
                    />

                    <button className="btn btn-primary animate-fade-slide" style={{ animationDelay: "0.6s" }} type="submit" >Register</button>
                </form>
            </div>
        </>
    )
}

export default RegisterPage