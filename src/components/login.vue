<template>
  <div class="login-page d-flex align-items-center justify-content-center">
    <div class="login-card p-4 shadow">
      <h2 class="text-center text-white mb-4">Sign In</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="email" class="form-label text-white">Email address</label>
          <input type="email" class="form-control" id="email" v-model="email" placeholder="Enter email" required />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label text-white">Password</label>
          <input type="password" class="form-control" id="password" v-model="password" placeholder="Password" required />
        </div>
        <button type="submit" class="btn btn-warning w-100 fw-semibold">Login</button>
        <div class="text-center mt-3">
          <router-link to="/signup" class="signup text-warning text-decoration-none">New user? Sign up</router-link>
        </div>
        <p v-if="message" class="text-center mt-2" style="color: red;">{{ message }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      email: '',
      password: '',
      message: '',
    };
  },
  methods: {
    ...mapActions(['login']),
    async handleLogin() {
      try {
        const response = await fetch("http://localhost:3001/api/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: this.email,
            password: this.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error);

        // Store user info and login flag in localStorage
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("isAuthenticated", "true");

        // Update Vuex state
        this.login();

        this.message = "Login successful! Redirecting...";

        // Redirect after 1 second
        setTimeout(() => {
          this.$router.push("/news");
        }, 1000);
      } catch (error) {
        this.message = error.message;
      }
    },
  },
};
</script>

<style scoped>
.login-page {
  height: 100vh;
  background: linear-gradient(to bottom, #000000 0%, #212121 100%);
  padding: 20px;
}

.login-card {
  max-width: 400px;
  width: 100%;
  background: linear-gradient(to top, #000000 0%, #171717 100%);
  margin-top: -200px;
  border-radius: 12px;
  color: white;
}

.signup {
  transition: all 0.3s ease;
  font-weight: normal;
  padding: 4px 8px;
  border-radius: 4px;
}

input.form-control {
  color: rgb(255, 255, 255);
  background-color: #222222;
  border: #ffb82b;
}

.signup:hover {
  background-color: rgba(255, 193, 7, 0.1);
  font-weight: 500;
  text-decoration: underline !important;
  transform: translateY(-2px);
}
</style>
