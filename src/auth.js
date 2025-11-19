import { ref } from 'vue'

export const isAuthenticated = ref(localStorage.getItem('isAuthenticated') === 'true')

export function login() {
  localStorage.setItem('isAuthenticated', 'true')
  isAuthenticated.value = true
}

export function logout() {
  localStorage.setItem('isAuthenticated', 'false')
  localStorage.removeItem('user')
  isAuthenticated.value = false
}
