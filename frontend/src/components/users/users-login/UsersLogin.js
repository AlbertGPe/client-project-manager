import React from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation } from 'react-router-dom'
import './UsersLogin.css'

function UsersLogin() {
  const { register, handleSubmit, formState: { errors } } = useForm({ mode: 'onBlur' })
  const location = useLocation();
  const successMessage = location.state?.message;

  const onLoginSubmit = (credentials) => {
    // TODO: connect to auth API)
    console.log(credentials)
  }

  return (
    <div className="register-page">
      <div className="register-left">
        <div className="geo-grid" />

        <div className="register-brand">
          <h1 className="register-headline">
            Welcome<br />
            back. <em>Let's work.</em>
          </h1>
          <p className="register-tagline">
            Your clients, projects, and pipeline are waiting.
            Sign in and pick up right where you left off.
          </p>
        </div>

        <div className="register-stats">
          <div className="stat-item">
            <span className="stat-number">2.4k</span>
            <span className="stat-label">Active users</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-number">98%</span>
            <span className="stat-label">Satisfaction</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-number">12k</span>
            <span className="stat-label">Projects</span>
          </div>
        </div>

        <div className="corner-accent" />
      </div>

      {/* ── RIGHT PANEL — Login form ─────────────────────────────── */}
      <div className="register-right">
        <div className="register-form-wrapper">

         {/* Message if user has just registered */}
        {successMessage && (
          <div className="success-message">
            ✅ {successMessage}
          </div>
        )}

          <div className="form-header">
            <h2>Sign in to your account</h2>
            <p>Enter your credentials to access your workspace.</p>
          </div>

          <form className="register-form" onSubmit={handleSubmit(onLoginSubmit)}>

            {/* Email field — identical pattern to register */}
            <div className="field-group">
              <label className="field-label" htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                placeholder=""
                className={`field-input ${errors.email ? 'is-invalid' : ''}`}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: 'Please enter a valid email'
                  }
                })}
              />
              <span className="field-underline" />
              {errors.email && (
                <span className="field-error">{errors.email.message}</span>
              )}
            </div>

            {/* Password field */}
            <div className="field-group">
              <label className="field-label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder=""
                className={`field-input ${errors.password ? 'is-invalid' : ''}`}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'At least 8 characters required'
                  }
                })}
              />
              <span className="field-underline" />
              {errors.password && (
                <span className="field-error">{errors.password.message}</span>
              )}
            </div>

            <div className="login-forgot">
              <Link to="/auth/forgot-password">Forgot your password?</Link>
            </div>

            <button type="submit" className="btn-register">
              <span>Sign in</span>
            </button>

          </form>

          <p className="register-footer">
            Don't have an account yet?{' '}
            <Link to="/auth/register">Create one</Link>
          </p>

        </div>
      </div>
    </div>
  )
}

export default UsersLogin