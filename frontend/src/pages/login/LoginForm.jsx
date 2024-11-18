import React, { useState } from 'react';
import axios from 'axios';
import Env from '../../utils/Env';

const LoginForm = ({ title }) => {
    const [email, setEmail] = useState('');
    const [validationCode, setValidationCode] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
	const [formMessgage, setFormMessgage] = useState('');

    const handleEmailChange = (e) => setEmail(e.target.value);
    const handleCodeChange = (e) => setValidationCode(e.target.value);

    const getValidationCode = async (e) => {
        e.preventDefault(); // Prevent page reload
        setIsLoading(true);
        setErrorMessage('');

        try {
            const response = await axios.post(`${Env.SERVER_URL}/users/request-code`, { email });
            if (response.status === 200) {
                // alert('Validation code sent! Check your email.');
				setFormMessgage('Validation code sent! Check your email.')
                setIsCodeSent(true); // Show the validation input after email submission
            } else {
                setErrorMessage(response.data.message || 'Failed to send validation code.');
            }
        } catch (error) {
            console.error('Error sending validation code:', error);
            setErrorMessage('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const verifyCode = async (e) => {
        e.preventDefault(); // Prevent page reload
        setErrorMessage('');

        try {
            const response = await axios.post(`${Env.SERVER_URL}/users/verify-code`, { email, code: validationCode });
            if (response.status === 200) {
                // alert('Login successful!');
				localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('email', email);
                localStorage.setItem('code', validationCode);
                // Redirect to profile or another page
                window.location.href = `/profile/${response.data.user._id}`;
            } else {
                setErrorMessage(response.data.message || 'Invalid validation code. Please try again.');
            }
        } catch (error) {
            console.error('Error verifying code:', error);
            setErrorMessage('Network error. Please try again.');
        }
    };

    // const resendCode = async (e) => {
    //     e.preventDefault();
    //     console.log('Resending validation code...');
    //     await getValidationCode(e);
    // };

    return (
        <form className="form__element" onSubmit={isCodeSent ? verifyCode : getValidationCode}>
            <h3 className="form__title">{isCodeSent ? 'Enter Validation Code' : title}</h3>
            
            {formMessgage && <p className="form__msg">{formMessgage}</p>}

            {!isCodeSent ? (
                <>
                    <div className="form__group">
                        <label className="form__label" htmlFor="email">Login with email</label>
                        <input
                            type="email"
                            className="form__input"
                            id="email"
                            value={email}
                            onChange={handleEmailChange}
                            placeholder="Enter email"
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <button type="submit" className="form__button form__button--primary" disabled={isLoading}>
                        {isLoading ? 'Loading...' : 'Get Validation Code'}
                    </button>
                </>
            ) : (
                <>
                    <div className="form__group">
                        <label className="form__label" htmlFor="code">Enter Validation Code</label>
                        <input
                            type="text"
                            className="form__input"
                            id="code"
                            value={validationCode}
                            onChange={handleCodeChange}
                            placeholder="Enter the code"
                            required
                        />
                    </div>

                    <button type="submit" className="form__button form__button--primary">
                        Login
                    </button>

                    {/* <p>
                        Didn’t receive a code?{' '}
                        <button onClick={resendCode}>Resend Code</button>
                    </p> */}
                </>
            )}

            
            {errorMessage && <p className="form__error">{errorMessage}</p>}

            {/* <span className="form__text">Or</span>

            <button type="button" className="form__button form__button--secondary">
                <img
                    src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
                    alt="Google logo"
                    className="social-logo"
                />
                Sign in with Google
            </button> */}
        </form>
    );
};

export default LoginForm;
