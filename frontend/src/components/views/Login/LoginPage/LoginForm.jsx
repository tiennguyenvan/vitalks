import React from 'react';

const LoginForm = () => {
    return ( <>
        <div className="form__group">
            <label className="form__label" for="email">Login with email</label>
            <input type="email" class="form__input" id="email" aria-describedby="emailHelp" placeholder="Enter email" />
        </div>
        <button type="submit" className="form__button form__button--primary">Get Validation Code</button>
        <span className="form__text">Or</span>
        

        <button type="submit" className="form__button form__button--secondary">
            <img src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png" alt="Google logo" class="social-logo" />
            Sign in with Google
        </button>
    </> );
}
 
export default LoginForm;