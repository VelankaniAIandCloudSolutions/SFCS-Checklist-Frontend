<template>
  <body class="text-center">
    <main class="form-signin">
      <section>
        <img
          class="mb-4"
          src="/img/admin_logo.png"
          alt=""
          width="72"
          height="57"
        />
        <h1 class="h3 mb-3 fw-normal">Please Log in</h1>

        <div class="form-floating">
          <input
            v-model="username"
            type="email"
            class="form-control"
            id="floatingInput"
            placeholder="name@example.com"
          />
          <label for="floatingInput">Username</label>
        </div>
        <div class="form-floating">
          <input
            v-model="password"
            type="password"
            class="form-control"
            id="floatingPassword"
            placeholder="Password"
          />
          <label for="floatingPassword">Password</label>
        </div>

        <div class="checkbox mb-3">
          <label>
            <input v-model="rememberMe" type="checkbox" value="remember-me" />
            Remember me
          </label>
        </div>
        <button class="w-100 btn btn-lg btn-primary" @click="handleSubmit">
          Sign in
        </button>
      </section>
    </main>
  </body>
</template>

<script>
const csrfToken = "{{ csrf_token }}";
import axios from "axios";
export default {
  data() {
    return {
      username: "",
      password: "",
      errors: [],
      csrfToken: "",
    };
  },
  methods: {
    handleSubmit() {
      this.$store.commit("setIsLoading", true);
      this.errors = [];

      if (this.username === "") {
        this.errors.push("The email is missing!");
      }

      if (this.password === "") {
        this.errors.push("The password is missing!");
      }

      if (!this.errors.length) {
        const formData = {
          username: this.username,
          password: this.password,
        };
        axios.defaults.xsrfCookieName = "csrftoken";
        axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
        axios.defaults.headers.common["X-CSRFTOKEN"] = this.csrfToken;

        axios
          .post("token/login/", formData, {
            headers: {
              "X-CSRFTOKEN": csrfToken,
            },
          })
          .then((response) => {
            const token = response.data.auth_token;

            // Set token in store and Axios headers
            this.$store.commit("setToken", token);
            axios.defaults.headers.common["Authorization"] = "Token " + token;

            // Save token in localStorage
            localStorage.setItem("token", token);

            // Log the token
            console.log("Received Token:", token);

            // Continue with your logic (e.g., redirect to another page)
            // ...

            // Always set loading state to false
            this.$store.commit("setIsLoading", false);
          })
          .catch((error) => {
            // Handle login error (e.g., display an error message)
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

<style scoped>
/* Add any custom styles if needed */
body {
  height: 100%;
}

body {
  display: flex;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;
  background-color: #f5f5f5;
}

.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
}

.form-signin .checkbox {
  font-weight: 400;
}

.form-signin .form-floating:focus-within {
  z-index: 2;
}

.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
.bd-placeholder-img {
  font-size: 1.125rem;
  text-anchor: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}
@media (min-width: 768px) {
  .bd-placeholder-img-lg {
    font-size: 3.5rem;
  }
}
</style>
