<template>
    <div class="about-container">
      <div class="container">
        <!-- About Section -->
        <div class="row justify-content-center mb-5">
          <div class="col-lg-8 col-md-10 col-12">
            <h1 class="text-center mb-4">About InsightHire</h1>
  
            <div class="about-content">
              <p class="fs-5 mb-4">
                This web application is built using Vue.js 3 and Bootstrap, showcasing a modular,
                responsive design that adapts across multiple device sizes. It demonstrates modern
                web development practices by integrating Vue Router, reusable components, dynamic
                data handling, and interactive features such as searchable news listings and responsive
                forms. As part of an academic project, the application evolves in stages to incorporate
                real-world functionality, including pagination, data validation, and external data integration.
              </p>
            </div>
          </div>
        </div>
  
        <!-- User Interaction Section -->
        <div class="row justify-content-center mb-5">
          <div class="col-lg-8 col-md-10 col-12">
            <div class="card custom-card">
              <div class="card-header">
                <h3 class="card-title">Personalize Your Experience</h3>
              </div>
              <div class="card-body">
                <!-- Name Input Form -->
                <div class="row mb-4">
                  <div class="col-md-6 mb-3 mb-md-0">
                    <label for="firstName" class="form-label">First Name</label>
                    <input
                      type="text"
                      class="form-control custom-input"
                      id="firstName"
                      v-model="firstName"
                      placeholder="Enter your first name"
                    >
                  </div>
                  <div class="col-md-6">
                    <label for="lastName" class="form-label">Last Name</label>
                    <input
                      type="text"
                      class="form-control custom-input"
                      id="lastName"
                      v-model="lastName"
                      placeholder="Enter your last name"
                    >
                  </div>
                </div>
  
                <!-- Welcome Message -->
                <div v-if="showWelcome" class="welcome-message mb-4 p-3 border border-primary rounded">
                  <h4>Welcome, {{ fullName }}!</h4>
                  <p>Thank you for visiting this website.</p>
                </div>
  
                <!-- Image Selection -->
                <div class="mb-3">
                  <label class="form-label">Choose an image to display:</label>
                  <div class="d-flex flex-wrap gap-4">
                    <div class="form-check">
                      <input
                        class="form-check-input custom-radio"
                        type="radio"
                        name="imageSelect"
                        id="mountain"
                        value="mountain"
                        v-model="selectedImage"
                      >
                      <label class="form-check-label" for="mountain">
                        Mountain View
                      </label>
                    </div>
                    <div class="form-check">
                      <input
                        class="form-check-input custom-radio"
                        type="radio"
                        name="imageSelect"
                        id="ocean"
                        value="ocean"
                        v-model="selectedImage"
                      >
                      <label class="form-check-label" for="ocean">
                        Ocean View
                      </label>
                    </div>
                  </div>
                </div>
  
                <!-- Display Selected Image -->
                <div v-if="selectedImage" class="text-center mt-4">
                  <h5 class="mb-3">Your selected view:</h5>
                  <div class="selected-image-container">
                    <img
                      :src="imageSrc"
                      :alt="selectedImage === 'mountain' ? 'Mountain view' : 'Ocean view'"
                      class="img-fluid rounded selected-image"
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue';
  
  export default {
    name: 'AboutComponent',
    setup() {
      const firstName = ref('');
      const lastName = ref('');
      const selectedImage = ref('');
  
      const fullName = computed(() => {
        if (firstName.value && lastName.value) {
          return `${firstName.value} ${lastName.value}`;
        } else if (firstName.value) {
          return firstName.value;
        } else if (lastName.value) {
          return lastName.value;
        } else {
          return '';
        }
      });
  
      const showWelcome = computed(() => {
        return firstName.value.trim() !== '' || lastName.value.trim() !== '';
      });
  
      const imageSrc = computed(() => {
         if (selectedImage.value === 'mountain') {
             return new URL('../assets/mount.jpg', import.meta.url).href;
         } else if (selectedImage.value === 'ocean') {
             return new URL('../assets/ocean.jpg', import.meta.url).href;
            }
            return '';
        });


  
      onMounted(() => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/js/all.min.js';
        script.async = true;
        document.head.appendChild(script);
      });
  
      return {
        firstName,
        lastName,
        selectedImage,
        fullName,
        showWelcome,
        imageSrc
      };
    }
  }
  </script>
  
  <style scoped>
  .about-container {
    color: white;
    padding: 3rem 0;
    min-height: 100vh;
  }
  
  .about-content {
  padding: 1rem 1.25rem; /* tighter and more consistent padding */
  border-radius: 0.375rem;
  text-align: justify;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.3);
}

  
  .custom-card {
    background-color: #1c1c1c;
    border: 1px solid #444;
  }
  
  .card-header {
    background-color: #1c1c1c;
    border-bottom: 1px solid #444;
    color: white;
  }
  
  .card-title {
    margin: 0;
  }
  
  .card-body {
    background-color: #1c1c1c;
    color: white;
  }
  
  .custom-input {
    background-color: #2c2c2c;
    color: white;
    border: 1px solid #6c757d;
  }
  
  .custom-input::placeholder {
    color: #aaa;
  }
  
  .custom-radio {
    background-color: #2c2c2c;
    border: 1px solid #6c757d;
  }
  
  .form-check-label {
    color: white;
  }
  
  .welcome-message {
    background-color: rgba(13, 110, 253, 0.1);
    animation: fadeIn 0.5s ease-in-out;
  }
  
  .selected-image {
    max-height: 300px;
    width: auto;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.5);
    transition: transform 0.3s ease;
  }
  
  .selected-image:hover {
    transform: scale(1.02);
  }
  
  .selected-image-container {
    overflow: hidden;
    margin: 0 auto;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  </style>
  