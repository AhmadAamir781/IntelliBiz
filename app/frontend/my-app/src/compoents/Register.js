import styles from"./Register/Register.module.css"

const Register = () =>{
    return(
        <body className={styles.body}>
    <header className={styles.header}>
        <nav className={styles.container}>
            <div className={styles.logo}>BusinessBoost</div>
            
<div className={styles['nav-links']}>   
                <a href="/login">Login/Signup</a>
                <a href="#register">Register</a>
                <a href="/home">Home</a>
            </div>
        </nav>
    </header>

    <main>
        <section className={styles.hero}>
            <div class={styles['hero-content']}>
                <h1>Boost Your Business Visibility</h1>
                <p>Register your business and reach more customers today!</p>
                <a href="#register" class="btn">Get Started</a>
            </div>
        </section>

        <section id="features" class="features">
            <div className={styles.container}>
                <h2>Why Choose Us</h2>
                <div class={styles['feature-grid']}>
                    <div class={styles['feature-card']}>
                        <img src="https://img.icons8.com/color/96/000000/increase.png" alt="Growth"/>
                        <h3>Boost Visibility</h3>
                        <p>Get your business in front of more potential customers.</p>
                    </div>
                    <div class={styles['feature-card']}>
                        <img src="https://img.icons8.com/color/96/000000/commercial.png" alt="Marketing"/>
                        <h3>Marketing Tools</h3>
                        <p>Access powerful marketing tools to promote your business.</p>
                    </div>
                    <div class={styles['feature-card']}>
                        <img src="https://img.icons8.com/color/96/000000/group.png" alt="Network"/>
                        <h3>Networking</h3>
                        <p>Connect with other businesses and potential partners.</p>
                    </div>
                </div>
            </div>
        </section>

        <section id="register" class="register">
            <div class={styles.container}>
                <h2>Register Your Business</h2>
                <form class={styles['register-form']} id="businessForm">
                    <div class={styles['form-group']}>
                        <label for="businessName">Business Name</label>
                        <input type="text" id="businessName" name="businessName" required/>
                    </div>
                    <div class={styles['form-group']}>
                        <label for="ownerName">Owner Name</label>
                        <input type="text" id="ownerName" name="ownerName" required/>
                    </div>
                    <div class={styles['form-group']}>
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" required/>
                    </div>
                    <div class={styles['form-group']}>
                        <label for="phone">Phone</label>
                        <input type="tel" id="phone" name="phone" required/>
                    </div>
                    <div class={styles['form-group']}>
                        <label for="description">Business Description</label>
                        <textarea id="description" name="description" required></textarea>
                    </div>
                    <button type="submit" class="btn">Register Now</button>
                </form>
            </div>
        </section>
    </main>

    <footer>
        <div class={styles.container}>
            <p>&copy; 2023 BusinessBoost. All rights reserved.</p>
        </div>
    </footer>
    </body>
    )
}
export default Register;