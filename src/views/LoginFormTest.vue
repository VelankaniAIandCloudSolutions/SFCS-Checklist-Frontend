<template>
  <div id="login-page">
    <div class="login">
      <h2 class="login-title">Login</h2>
      <p class="notice">Please login to access the system</p>
      <form class="form-login">
        <label for="email">E-mail</label>
        <div class="input-email">
          <i class="fas fa-envelope icon"></i>
          <input
            v-model="email"
            type="email"
            name="email"
            placeholder="Enter your e-mail"
            required
          />
        </div>
        <label for="password">Password</label>
        <div class="input-password">
          <i class="fas fa-lock icon"></i>
          <input
            v-model="password"
            type="password"
            name="password"
            placeholder="Enter your password"
            required
          />
        </div>

        <button type="submit" @click="handleSubmit">
          <i class="fas fa-door-open"></i> Sign in
        </button>
      </form>
    </div>
    <div class="background">
      <h1><strong> Velankani SFCS</strong></h1>
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
    handleSubmit() {
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

        axios
          .post("token/login/", formData)
          .then((response) => {
            const token = response.data.auth_token;

            // Set token in store and Axios headers
            this.$notify({
              title: "Login successful",
              type: "alert-success", // Bootstrap class for success
              duration: 5000,
            });
            this.$store.commit("setToken", token);
            axios.defaults.headers.common["Authorization"] = "Token " + token;
            console.log(axios.defaults.headers);
            // Save token in localStorage
            localStorage.setItem("token", token);

            // Log the token
            console.log("Received Token:", token);

            // Continue with your logic (e.g., redirect to another page)
            // ...
            // this.$router.push({ path: "/" });
            window.location.href = "/";
            // Always set loading state to false
            this.$store.commit("setIsLoading", false);
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

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  font-family: sans-serif;
}
a {
  color: #666;
  font-size: 14px;
  display: block;
}
.login-title {
  text-align: center;
}
#login-page {
  display: flex;
  min-height: 100vh;
}
.notice {
  font-size: 13px;
  text-align: center;
  color: #666;
}
.login {
  width: 30%;
  height: 100vh;
  background: #fff;
  padding: 70px;
}
.login a {
  margin-top: 25px;
  text-align: center;
}
.form-login {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  align-content: center;
}
.form-login label {
  text-align: left;
  font-size: 13px;
  margin-top: 10px;
  margin-left: 20px;
  display: block;
  color: #666;
}
.input-email,
.input-password {
  width: 100%;
  background: #ededed;
  border-radius: 25px;
  margin: 4px 0 10px 0;
  padding: 10px;
  display: flex;
}
.icon {
  padding: 4px;
  color: #666;
  min-width: 30px;
  text-align: center;
}
input[type="email"],
input[type="password"] {
  width: 100%;
  border: 0;
  background: none;
  font-size: 16px;
  padding: 4px 0;
  outline: none;
}
button[type="submit"] {
  width: 100%;
  border: 0;
  border-radius: 25px;
  padding: 14px;
  background: #008552;
  color: #fff;
  display: inline-block;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  margin-top: 10px;
  transition: ease all 0.3s;
}
button[type="submit"]:hover {
  opacity: 0.9;
}
.background {
  width: 70%;
  padding: 40px;
  height: 100vh;
  background: linear-gradient(
      60deg,
      rgba(158, 189, 19, 0.5),
      rgba(0, 133, 82, 0.7)
    ),
    url("D:/PROJECTS/SFCS/SFCS-Checklist-Frontend/public/img/sfcs-landing.png")
      center no-repeat;
  background-size: cover;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: center;
  align-content: center;
  flex-direction: row;
  color: #fff;
}
.background h1 {
  max-width: 420px;
  color: #fff;
  text-align: right;
  padding: 0;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7); /* Add a subtle text shadow for emphasis */
}
.background p {
  max-width: 650px;
  color: #1a1a1a;
  font-size: 15px;
  text-align: right;
  padding: 0;
  margin: 15px 0 0 0;
}
.created {
  margin-top: 40px;
  text-align: center;
}
.created p {
  font-size: 13px;
  font-weight: bold;
  color: #008552;
}
.created a {
  color: #666;
  font-weight: normal;
  text-decoration: none;
  margin-top: 0;
}
.checkbox label {
  display: inline;
  margin: 0;
}
</style>
