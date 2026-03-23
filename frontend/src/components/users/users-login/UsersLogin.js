import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./UsersLogin.css";
import userService from "../../../services/users";
import { AuthContext } from "../../../contexts/AuthStore";

function UsersLogin() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ mode: "onBlur" });
  const [serverError, setServerError] = useState(undefined);
  const location = useLocation();
  const navigate = useNavigate();
  const successMessage = location.state?.message;
  const { onUserChange } = useContext(AuthContext)

  const onLoginSubmit = async (user) => {
    try {
      setServerError();
      user = await userService.login(user);
      onUserChange(user)
      navigate("/");
    } catch (error) {
      const errors = error.response?.data?.errors;
      if (errors) {
        console.error(error.message, errors);
        Object.keys(errors).forEach((error) =>
          setError(error, { message: errors[error] }),
        );
      } else {
        console.error(error);
        setServerError(error.response?.data?.message ?? error.message);
      }
    }
  };

  return (
    <div className="register-page">
      <div className="register-left">
        <div className="geo-grid" />

        <div className="register-brand">
          <h1 className="register-headline">
            Welcome
            <br />
            back. <em>Let's work.</em>
          </h1>
          <p className="register-tagline">
            Your clients, projects, and pipeline are waiting. Sign in and pick
            up right where you left off.
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

      <div className="register-right">
        <div className="register-form-wrapper">
          {successMessage && (
            <div className="success-message">✅ {successMessage}</div>
          )}

          <div className="form-header">
            <h2>Sign in to your account</h2>
            <p>Enter your credentials to access your workspace.</p>
          </div>

          <form
            className="register-form"
            onSubmit={handleSubmit(onLoginSubmit)}
          >
            <div className="field-group">
              <label className="field-label" htmlFor="name">
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder=""
                className={`field-input ${errors.username ? "is-invalid" : ""}`}
                {...register("username", { required: "Username is required" })}
              />
              <span className="field-underline" />
              {errors.email && (
                <span className="field-error">{errors.username.message}</span>
              )}
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder=""
                className={`field-input ${errors.password ? "is-invalid" : ""}`}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "At least 8 characters required",
                  },
                })}
              />
              <span className="field-underline" />
              {errors.password && (
                <span className="field-error">{errors.password.message}</span>
              )}
            </div>

            {serverError && (
              <div className="server-error">
                <span>⚠</span>
                {serverError}
              </div>
            )}

            {/*<div className="login-forgot">
              <Link to="/auth/forgot-password">Forgot your password?</Link>
            </div>*/}

            <button type="submit" className="btn-register">
              <span>Sign in</span>
            </button>
          </form>

          <p className="register-footer">
            Don't have an account yet?{" "}
            <Link to="/auth/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default UsersLogin;
