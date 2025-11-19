<template>
  <div class="home">
    <!-- Hero Banner -->
    <section class="hero text-white text-center d-flex flex-column justify-content-center align-items-center">
    <div class="hero-content mt-12">
      <h1 class="display-3 fw-bold mb-3">Explore the World</h1>
      <p class="lead mb-4">Discover hidden gems, foodie hotspots, and dream stays shared by real travellers like you.</p>
      <router-link to="/login" class="explore text-warning fw-semibold">Start Exploring</router-link>
    </div>
    </section>


    <!-- Featured Categories -->
    <section class="container my-5 text-center">
      <h2 class="mb-4 fw-semibold">Featured for You</h2>

      <div class="d-flex justify-content-center gap-4 flex-wrap">
        <div class="image-container position-relative">
          <img 
            src="../assets/mount.jpg" 
            alt="Mountains"
            class="img-fluid custom-image"
          />
          <div class="image-overlay">Mountain Escapes</div>
        </div>

        <div class="image-container position-relative">
          <img 
            src="../assets/ocean.jpg" 
            alt="Ocean"
            class="img-fluid custom-image"
          />
          <div class="image-overlay">Beach Getaways</div>
        </div>

        <div class="image-container position-relative">
          <img 
            src="../assets/food.jpg" 
            alt="Food"
            class="img-fluid custom-image"
          />
          <div class="image-overlay">Local Food Spots</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// You can later import and use pinia, axios, etc. here
</script>

<style scoped>
/* Hero section styles */
.hero {
position: relative;
width: 100%;
height: 100vh;
background: url('../assets/hero.jpg') center center/cover no-repeat;
filter: grayscale(100%); /* Apply grayscale directly to the background */
display: flex;
justify-content: center;
align-items: center;
text-align: center;
overflow: hidden;
margin-top: -80px; /* if needed, match your sticky header height */
}
.hero::before {
content: '';
position: absolute;
inset: 0;
background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 9) 100%);
z-index: 1;
}


.hero > * {
  position: relative;
  z-index: 2;
}
.hero-content {
  margin-top: 180px; /* Adjust value as needed */
}


/* Image grid */
.image-container {
  position: relative;
  overflow: hidden;
  max-width: 300px;
  margin: 15px;

  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.custom-image {
  width: 100%;
  height: auto;
  border-radius: 12px;
  transition: transform 0.3s ease;
 
}

.image-container:hover .custom-image {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 12px;
  text-align: center;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  font-weight: 500;
  font-size: 1.1rem;
  opacity: 0.3;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 0 0 12px 12px;
}

.image-container:hover .image-overlay {
  opacity: 1;
}
.explore {
display: inline-block;
padding: 12px 30px;
color: #ffc107;
font-weight: 600;
font-size: 1.1rem;
text-decoration: none;
border: 2px solid #ffc107;
border-radius: 50px;
position: relative;
overflow: hidden;
z-index: 1;
transition: all 0.4s ease;
box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.5);
}

.explore:hover {
  color: black !important;
  border-color: transparent;
  background: #ffc107;
  transform: translateY(-3px);
  box-shadow: 0 7px 20px rgba(255, 193, 7, 0.4);
  animation: pulse 1.5s infinite;
}


@keyframes pulse {
0% {
  box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.4);
}
70% {
  box-shadow: 0 0 0 10px rgba(255, 193, 7, 0);
}
100% {
  box-shadow: 0 0 0 0 rgba(255, 193, 7, 0);
}
}

</style>
