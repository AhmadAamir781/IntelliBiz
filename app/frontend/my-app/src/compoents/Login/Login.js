import { useNavigate } from 'react-router-dom';  // Import useNavigate
import styles from '../Login/Login.module.css';

const Login = () => {
  const navigate = useNavigate();  // Initialize navigate

  // Handle signup form submission
  const handleSignup = (e) => {
    e.preventDefault();  // Prevent default form submission

    // Here you can handle your signup logic (e.g., saving user data)
    console.log("Signup form submitted");

    // Redirect to the home page after signup
    navigate('/home');  // This will redirect to the home page after signup
  };

  // Handle login form submission
  const handleLogin = (e) => {
    e.preventDefault();  // Prevent default form submission

    // Here you can handle your login logic (e.g., validating user credentials)
    console.log("Login form submitted");

    // Redirect to the home page after login
    navigate('/home');  // This will redirect to the home page after login
  };

  return (
    <div className={styles.body}>
      <div className={styles.main}>
        <input className={styles.chk} id="chk" type="checkbox" aria-hidden="true" />

        <div className={styles.signup}>
          <form className={styles.form} onSubmit={handleSignup}>
            <label className={styles.label} htmlFor="chk" aria-hidden="true">Sign up</label>
            <input className={styles.input} type="text" name="txt" placeholder="User name" required />
            <input className={styles.input} type="email" name="email" placeholder="Email" required />
            <input className={styles.input} type="number" name="broj" placeholder="BrojTelefona" required />
            <input className={styles.input} type="password" name="pswd" placeholder="Password" required />
            <button className={styles.button} type="submit">Sign up</button>
          </form>
        </div>

        <div className={styles.login}>
          <form className={styles.form} onSubmit={handleLogin}>
            <label className={styles.label} htmlFor="chk" aria-hidden="true">Login</label>
            <input className={styles.input} type="email" name="email" placeholder="Email" required />
            <input className={styles.input} type="password" name="pswd" placeholder="Password" required />
            <button className={styles.button} type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
