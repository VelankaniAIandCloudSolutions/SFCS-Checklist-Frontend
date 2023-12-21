<template>
  <div class="container">
    <div class="login">
      <h1>Velankani SFCS</h1>
      <form @submit.prevent="handleSubmit">
        <div class="input-box">
          <input v-model="email" type="email" placeholder="Email" />
          <i class="fa fa-envelope"></i>
        </div>

        <div class="input-box">
          <input v-model="password" type="password" placeholder="Password" />
          <i class="fa fa-lock"></i>
        </div>

        <button type="submit">LOGIN</button>

        <!-- <div class="links">
          <a href="#">Forgot password</a>
          <a href="#">You don't have an account</a>
        </div> -->
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      email: "",
      password: "",
      errors: [],
    };
  },
  methods: {
    async handleSubmit() {
      this.$store.commit("setIsLoading", true);
      this.errors = [];

      if (this.email === "") {
        this.errors.push("The email is missing!");
      }

      if (this.password === "") {
        this.errors.push("The password is missing!");
      }

      if (!this.errors.length) {
        const formData = {
          email: this.email,
          password: this.password,
        };

        await axios
          .post("token/login/", formData)
          .then((response) => {
            this.$notify({
              title: "Login successful",
              type: "bg-success-subtle text-success",
              duration: 5000,
            });
            setTimeout(() => {
              const token = response.data.auth_token;
              this.$store.commit("setToken", token);
              axios.defaults.headers.common["Authorization"] = "Token " + token;
              localStorage.setItem("token", token);
              console.log("Received Token:", token);
              window.location.href = "/dashboard";
            }, 1000);
          })
          .catch((error) => {
            // Handle login error (e.g., display an error message)

            this.$notify({
              title: "Login failed. Please check your credentials.",
              type: "alert-danger", // Bootstrap class for danger/error
              duration: 5000,
            });
            console.error("Login failed:", error.response.data);
            this.errors.push("Login failed. Please check your credentials.");
          })
          .finally(() => {
            // Always set loading state to false
            this.$store.commit("setIsLoading", false);
          });
      } else {
        // Handle form validation errors
        this.$store.commit("setIsLoading", false);
      }
    },
  },
};
</script>

<style scoped>
/* Add any custom styles if needed */
body {
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  font-family: "Open Sans";
}

.container {
  position: relative;
  min-height: 100vh;
  max-width: 100% !important;
  background-color: #161623;
  overflow: hidden;
  display: grid;
  place-items: center;
}

.container::before {
  content: "";
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: #7b66ff;
  animation: move-up6 2s ease-in infinite alternate-reverse;
}

.container::after {
  content: "";
  position: absolute;
  vertical-align: bottom;
  width: 250px;
  height: 250px;
  border-radius: 50%;
  background: #5fbdff;
  animation: move-up6 2s ease-in infinite alternate-reverse;
}

@keyframes move-up6 {
  to {
    transform: translateY(-50px);
  }
}

a {
  text-decoration: none;
}

.login {
  position: relative;
  width: 350px;
  padding: 30px;
  height: fit-content;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
  z-index: 10;
  backdrop-filter: blur(25px);
  box-shadow: 10px 10px 40px rgba(0, 0, 0, 0.2),
    -10px -10px 40px rgba(0, 0, 0, 0.2);
}

@media (max-width: 400px) {
  .login {
    width: 90%;
  }
}

.login h1 {
  font-size: 1.8rem;
  color: #fff;
  margin-bottom: 40px;
  margin-top: 0;
  text-align: center;
}

.login form {
  width: 100%;
  height: 100%;
  outline: none;
  border: none;
}

.login form .input-box {
  width: 100%;
  position: relative;
  margin-bottom: 30px;
  display: flex;
}

.login form .input-box input {
  width: 100%;
  border: none;
  padding: 1rem 2.7rem 1rem 1rem;
  border-radius: 10px;
  color: #fff;
  background-color: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.login form .input-box input::placeholder {
  color: #fff;
  font-size: 0.8rem;
  transition: 0.5s ease;
}

.login form .input-box input:focus::placeholder {
  opacity: 0;
}

.login form .input-box input:focus {
  outline: none;
}

.login form .input-box i {
  position: absolute;
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
  color: #fff;
  font-size: 1.2rem;
}

.login form .rembar {
  margin-bottom: 30px;
  width: 100%;
}

.login form .rembar input {
  appearance: none;
}

.login form .rembar label {
  color: #fff;
  position: relative;
  width: 100%;
  padding-left: 35px;
  font-size: 0.9rem;
}

.login form .rembar label::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
}

.login form .rembar label::after {
  content: "";
  position: absolute;
  left: 4px;
  top: 50%;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: #fff;
  transition: 0.5 ease;
  opacity: 0;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
}

.login form .rembar input:checked + label::after {
  opacity: 1;
}

.login form button {
  width: 100%;
  border: none;
  padding: 1rem 1rem 1rem 2.7rem;
  border-radius: 10px;
  color: #fff;
  margin-bottom: 30px;
  background-color: #161623;
  border: 1px solid rgba(255, 255, 255, 0.4);
  transition: 0.5s ease;
  cursor: pointer;
  font-weight: 600;
}

.login form button:hover {
  background-color: #111;
}

.login form .links {
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 15px;
}

.login form .links a {
  color: #fff;
  font-weight: 100;
  font-size: 0.7rem;
}
</style>
