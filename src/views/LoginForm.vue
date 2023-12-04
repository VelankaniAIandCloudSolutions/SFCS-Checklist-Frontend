<template>
  <body class="text-center">
    <main class="form-signin">
      <section>
        <img class="mb-4" src="" alt="" width="72" height="57" />
        <h1 class="h3 mb-3 fw-normal">Please Log in</h1>

        <div class="form-floating">
          <input
            v-model="email"
            type="email"
            class="form-control"
            id="floatingInput"
            placeholder="name@example.com"
          />
          <label for="floatingInput">Email address</label>
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
export default {
  data() {
    return {
      email: "",
      password: "",
      rememberMe: false,
    };
  },
  methods: {
    handleSubmit() {
      // Handle form-like section submission logic here
      console.log("Section submitted with data:", {
        email: this.email,
        password: this.password,
        rememberMe: this.rememberMe,
      });
      this.$emit("loginSuccess");
      // Add your logic here for handling the "form" submission
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
