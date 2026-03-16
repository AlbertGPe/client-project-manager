import React, { useState } from "react";
import { useForm } from "react-hook-form";
import usersService from "../../../services/users";
import { Link, useNavigate } from "react-router-dom";
import "./UsersRegister.css";

function UsersRegister() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ mode: "onBlur" });
  const [serverError, setServerError] = useState(undefined);
  const navigate = useNavigate();

  const onUserSubmit = async (user) => {
    try {
      setServerError();
      await usersService.create(user);
      navigate("/auth/login", {
        state: {
          message:
            "Registration successful! Please confirm your email to log in.",
          email: user.email,
        },
      });
    } catch (error) {
      const errors = error.response?.data?.errors;
      if (errors) {
        console.error(error.message, errors);
        Object.keys(errors).forEach((error) =>
          setError(error, { message: errors[error] }),
        );
      } else {
        console.error(error);
        setServerError(error.message);
        //TODO REDIRECT OR SHOW A GOOD MESSAGE
      }
    }
  };

  return (
    <div className="register-page">
      <div className="register-left">
        <div className="geo-grid" />

        <div className="register-brand">
          <h1 className="register-headline">
            Manage your
            <br />
            clients with <em>precision.</em>
          </h1>
          <p className="register-tagline">
            One workspace for your clients, projects, and pipeline — built for
            teams that mean business.
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
          <div className="form-header">
            <h2>Create your account</h2>
            <p>Fill in your details to get started — it only takes a minute.</p>
          </div>

          <form className="register-form" onSubmit={handleSubmit(onUserSubmit)}>
            <div className="field-group">
              <label className="field-label" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder=""
                className={`field-input ${errors.name ? "is-invalid" : ""}`}
                {...register("name", { required: "Name is required" })}
              />
              <span className="field-underline" />
              {errors.name && (
                <span className="field-error">{errors.name.message}</span>
              )}
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="name">
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder=""
                className={`field-input ${errors.name ? "is-invalid" : ""}`}
                {...register("username", { required: "Username is required" })}
              />
              <span className="field-underline" />
              {errors.name && (
                <span className="field-error">{errors.username.message}</span>
              )}
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="text"
                placeholder=""
                className={`field-input ${errors.email ? "is-invalid" : ""}`}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Please enter a valid email",
                  },
                })}
              />
              <span className="field-underline" />
              {errors.email && (
                <span className="field-error">{errors.email.message}</span>
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
                  pattern: {
                    value: /^(?=.*[A-Z])(?=.*\d).{8,}$/,
                    message: "Must include a number and an uppercase letter",
                  },
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

            <button type="submit" className="btn-register">
              <span>Create account</span>
            </button>
          </form>

          <p className="register-footer">
            Already have an account? <Link to="/auth/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default UsersRegister;
