<template>
  <div class="signup-page d-flex align-items-center justify-content-center">
    <div class="signup-card p-4 shadow">
      <h2 class="text-center text-white mb-4">Create Account</h2>
      <form @submit.prevent="register">
        <div class="mb-3">
          <label for="name" class="form-label text-white">Full Name</label>
          <input type="text" class="form-control" id="name" v-model="username" placeholder="Your name" required />
        </div>
        <div class="mb-3">
          <label for="email" class="form-label text-white">Email address</label>
          <input type="email" class="form-control" id="email" v-model="email" placeholder="Enter email" required />
        </div>

        <!-- Password Input with Strength Checker and Tooltip -->
        <div class="mb-3 position-relative">
          <label for="password" class="form-label text-white">Password</label>
          <input
            type="password"
            class="form-control"
            id="password"
            v-model="password"
            placeholder="Password"
            required
            @focus="showTooltip = true"
            @blur="showTooltip = false"
          />
          <div v-if="showTooltip" class="tooltip-box">
            <ul>
              <li :class="{ passed: password.length >= 6 }">At least 6 characters</li>
              <li :class="{ passed: /[A-Z]/.test(password) }">One uppercase letter</li>
              <li :class="{ passed: /[0-9]/.test(password) }">One number</li>
              <li :class="{ passed: /[^A-Za-z0-9]/.test(password) }">One special character</li>
            </ul>
          </div>
          <small :class="['strength-label', passwordStrength.toLowerCase()]">
            Strength: {{ passwordStrength }}
          </small>
        </div>

        <div class="mb-3">
          <label for="confirm" class="form-label text-white">Confirm Password</label>
          <input type="password" class="form-control" id="confirm" v-model="confirmPassword" placeholder="Confirm Password" required />
        </div>

        <button type="submit" class="btn btn-warning w-100 fw-semibold">Sign Up</button>

        <p class="text-white text-center mt-3">
          Already have an account?
          <router-link to="/login" class="text-warning fw-semibold">Sign In</router-link>
        </p>

        <p v-if="message" class="text-danger text-center mt-2">{{ message }}</p>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      message: '',
      passwordStrength: '',
      showTooltip: false,
    };
  },
  methods: {
    getPasswordStrength(password) {
      if (password.length < 6) return 'Weak';
      if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) return 'Medium';
      if (
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[^A-Za-z0-9]/.test(password)
      )
        return 'Strong';
      return 'Medium';
    },

    async register() {
      if (this.password !== this.confirmPassword) {
        this.message = "Passwords do not match";
        return;
      }

      try {
        const response = await fetch("http://localhost:3001/api/users/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: this.username,
            email: this.email,
            password: this.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error);
        this.message = data.message;

        setTimeout(() => this.$router.push("/login"), 1000);
      } catch (error) {
        this.message = error.message;
      }
    },
  },
  watch: {
    password(value) {
      this.passwordStrength = this.getPasswordStrength(value);
    },
  },
};
</script>

<style scoped>
.signup-page {
  height: 100vh;
  background: linear-gradient(to bottom, #000000 0%, #1c1c1c 100%);
  padding: 20px;
}

.signup-card {
  max-width: 450px;
  width: 100%;
  background: linear-gradient(to top, #000000 0%, #131313 100%);
  background-color: rgba(0, 0, 0, 0.75);
  border-radius: 12px;
  margin-top: -90px;
  color: white;
}

input.form-control {
  color: rgb(255, 255, 255);
  background-color: #222222;
  border: #ffb82b;
}

/* Tooltip Box */
.tooltip-box {
  position: absolute;
  background-color: #1f1f1f;
  border: 1px solid #ffb82b;
  border-radius: 8px;
  padding: 10px;
  top: 100%;
  left: 0;
  z-index: 10;
  font-size: 0.85rem;
  width: 100%;
  margin-top: 5px;
  color: white;
}

.tooltip-box ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tooltip-box li {
  margin-bottom: 4px;
  color: #bbb;
}

.tooltip-box li.passed {
  color: #4caf50;
}

/* Strength Indicator */
.strength-label {
  display: block;
  margin-top: 5px;
  font-weight: bold;
}

.strength-label.weak {
  color: red;
}
.strength-label.medium {
  color: orange;
}
.strength-label.strong {
  color: green;
}
</style>
      