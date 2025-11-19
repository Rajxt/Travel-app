<template>
  <article class="news-card">
    <div class="news-card-header">
      <div class="user-info">
        <div class="avatar initials-avatar">
          {{ initials }}
        </div>
        <div class="info">
          <div class="username fw-bold">{{ news.user?.name || 'Anonymous' }}</div>
          <div class="details">
            <span class="badge bg-primary me-2">{{ news.category }}</span>
            <small class="text-muted">{{ formattedDate }}</small>
          </div>
        </div>
      </div>
      <div class="options">
        <button class="btn btn-sm btn-link text-white">
          <i class="bi bi-three-dots"></i>
        </button>
      </div>
    </div>

    <div class="news-card-image">
      <img 
        :src="news.image || `https://picsum.photos/seed/${news.id || Math.random()}/800/600`" 
        :alt="news.title"
        class="img-fluid"
      >
      <div v-if="isLocked" class="locked-overlay-image">
        <div class="lock-icon">
          <i class="bi bi-lock-fill"></i>
        </div>
      </div>
    </div>
    
    <div class="news-card-body">
      <h5 class="news-title mb-2">{{ news.title }}</h5>
      <p class="news-content" :class="{ 'truncated': isLocked }">
        {{ isLocked ? news.content.substring(0, 100) + '...' : news.content }}
        <span v-if="isLocked" class="locked-text">
          Sign in to read more...
        </span>
      </p>
    </div>
    
    <div class="news-card-footer">
      <div class="engagement">
        <button class="btn btn-sm action-btn" :disabled="isLocked" @click="toggleLike">
          <i :class="liked ? 'bi bi-heart-fill text-danger' : 'bi bi-heart'"></i> {{ likeCount }}
        </button>
      </div>
    </div>
  </article>
</template>

<script>
export default {
  name: 'NewsCard',
  props: {
    news: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      liked: false,
      likeCount: Math.floor(Math.random() * 1000) + 1 
    };
  },
  computed: {
    isLocked() {
      return localStorage.getItem("isAuthenticated") !== "true";
    },
    formattedDate() {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(this.news.date).toLocaleDateString(undefined, options);
    },
    initials() {
      const name = this.news.user?.name || 'A N';
      return name
        .split(' ')
        .map(part => part.charAt(0).toUpperCase())
        .join('')
        .slice(0, 2);
    }
  },
  methods: {
    toggleLike() {
      if (this.isLocked) return;
      this.liked = !this.liked;
      this.likeCount += this.liked ? 1 : -1;
    },
    handleReadMore() {
      if (this.isLocked) return;
      this.$emit('read-morre', this.news);
    }
  }
};
</script>

<style scoped>
.news-card {
  background-color: #212529;
  color: white;
  border: 1px solid #495057;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  width: 100%;
}

.news-card:hover {
  transform: translateY(-2px);
}

.news-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #373c42;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar.initials-avatar {
  width: 40px;
  height: 40px;
  background-color: #495057;
  color: white;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 1rem;
}

.news-card-image {
  width: 100%;
  max-height: 500px;
  overflow: hidden;
  position: relative;
}

.news-card-image img {
  width: 100%;
  object-fit: cover;
  display: block;
}

.locked-overlay-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
}

.lock-icon {
  width: 80px;
  height: 80px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
}

.news-card-body {
  padding: 16px;
  position: relative;
}

.news-title {
  font-size: 1.25rem;
  font-weight: bold;
}

.news-content {
  line-height: 1.6;
}

.truncated {
  overflow: hidden;
}

.locked-text {
  display: block;
  margin-top: 10px;
  font-weight: bold;
  color: #0d6efd;
}

.news-card-footer {
  padding: 12px 16px;
  border-top: 1px solid #373c42;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.engagement {
  display: flex;
  gap: 16px;
}

.action-btn {
  color: #adb5bd;
  background: none;
  border: none;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 4px;
}

.action-btn:hover:not(:disabled) {
  color: white;
}

@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css");
</style>
