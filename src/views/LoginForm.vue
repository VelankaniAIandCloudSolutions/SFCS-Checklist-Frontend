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
            v-model="email"
            type="email"
            class="form-control"
            id="floatingInput"
            placeholder="name@example.com"
          />
          <label for="floatingInput">email</label>
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

        <button class="w-100 btn btn-lg btn-primary" @click="handleSubmit">
          Sign in
        </button>
      </section>
    </main>
  </body>
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
