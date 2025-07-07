import React, { useState } from 'react';
import { LOGIN_URL, SIGNUP_URL } from "../utils/URL";
import { _post } from '../utils/services';

const Signup = () => {
    const [pageType, setPageType] = useState("sign_in");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confPassword, setConfPassword] = useState("");

    const handleSingUp = async () => {
        if (password == confPassword) {
            let payload = {
                name: name,
                email: email,
                password: password
            }
            const res = await _post(SIGNUP_URL, payload);
            if (res.status === 'success') {
                if (res.data) {
                    localStorage.setItem("token", res.data.authToken);
                    localStorage.setItem("role", res.data.role);
                    localStorage.setItem("userId", res.data.userId);
                    window.location.href = '/home';
                }
            } else {
                alert(res.message);
            }
        } else {
            alert("Password and confirm password should be same !");
        }
    }

    const handleSingIn = async () => {
        let payload = {
            email: email,
            password: password
        }
        const res = await _post(LOGIN_URL, payload);
        if (res.status === 'success') {
            if (res.data) {
                localStorage.setItem("token", res.data.authToken);
                localStorage.setItem("role", res.data.role);
                localStorage.setItem("userId", res.data.userId);
                window.location.href = '/home';
            }
        } else {
            alert(res.message);
        }
    }

    const handleSwitchForm = (type) => {
        setPageType(type);
        setName("");
        setEmail("");
        setPassword("");
        setConfPassword("");
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {pageType == 'sign_up' && (
                    <div className="bg-white rounded-lg shadow-md p-8">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">Create Account</h1>
                            <p className="text-gray-600">Sign up to get started</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="Create a password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="confPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    id="confPassword"
                                    placeholder="Confirm your password"
                                    value={confPassword}
                                    onChange={(e) => setConfPassword(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <button
                                type="submit"
                                onClick={handleSingUp}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                            >
                                Create Account
                            </button>
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-gray-600">
                                Already have an account?{' '}
                                <button
                                    onClick={() => handleSwitchForm("sign_in")}
                                    className="text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Sign in
                                </button>
                            </p>
                        </div>
                    </div>
                )}

                {pageType == 'sign_in' && (
                    <div className="bg-white rounded-lg shadow-md p-8">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h1>
                            <p className="text-gray-600">Sign in to your account</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="loginEmail" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="loginEmail"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="loginPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="loginPassword"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={handleSingIn}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                            >
                                Sign In
                            </button>
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-gray-600">
                                Don't have an account?{' '}
                                <button
                                    onClick={() => handleSwitchForm('sign_up')}
                                    className="text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Sign up
                                </button>
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Signup;
