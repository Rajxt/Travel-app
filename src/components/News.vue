<template>
  <div class="news-container">
    <div class="container">
      <h1 class="text-center mb-4">What's New</h1>

      <!-- Create/Edit Form -->
      <div v-if="isAuthenticated" class="mb-5">
        <div class="tweet-form">
          <form @submit.prevent="submitPost">
            <div class="tweet-header">
              <div class="tweet-avatar">
                <span class="user-initial">{{ userInitial }}</span>
              </div>
              <input 
                v-model="form.title" 
                class="form-control tweet-title" 
                placeholder="What's the headline?" 
                required 
              />
            </div>
            
            <textarea 
              v-model="form.content" 
              class="form-control tweet-content" 
              placeholder="Share your news..." 
              required
            ></textarea>
            
            <div class="tweet-footer">
              <div class="tweet-metadata">
                <div class="input-group input-group-sm category-input">
                  <span class="input-group-text">#</span>
                  <input 
                    v-model="form.category" 
                    class="form-control" 
                    placeholder="Category" 
                    required 
                  />
                </div>
                <input 
                  v-model="form.date" 
                  type="date" 
                  class="form-control form-control-sm date-input" 
                  required 
                />
              </div>
              <div class="tweet-actions">
                <button type="button" class="btn btn-sm btn-outline-secondary" v-if="editingNews" @click="cancelEdit">Cancel</button>
                <button type="submit" class="btn btn-sm btn-primary">{{ editingNews ? 'Update' : 'Post' }}</button>
              </div>
            </div>

            <input type="hidden" v-model="form.authorId">
          </form>
        </div>
      </div>

      <!-- Filters -->
      <div v-if="isAuthenticated" class="filter-wrapper mb-4">
        <div class="filter-item">
          <input
            type="text"
            class="form-control"
            placeholder="Search topics..."
            v-model="searchTerm"
            @input="applyFilters"
          >
        </div>
        <div class="filter-item">
          <select class="form-control" v-model="selectedCategory" @change="applyFilters">
            <option value="">All Categories</option>
            <option v-for="category in uniqueCategories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
        <button class="btn btn-primary filter-button" type="button" @click="applyFilters">Apply Filters</button>
      </div>

      <!-- News Feed -->
      <div v-if="filteredNews.length">
        <div class="news-feed">
          <div v-for="(newsItem, index) in paginatedNews" :key="index" class="news-card-wrapper">
            <NewsCard :news="newsItem" />
            <div v-if="isAuthenticated && isUserCreatedPost(newsItem)" class="text-end mt-2">
              <button class="btn btn-sm btn-outline-warning me-2" @click="editNews(newsItem)">Edit</button>
              <button class="btn btn-sm btn-outline-danger" @click="deleteNews(newsItem)">Delete</button>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <nav aria-label="Pagination" class="mt-4">
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" href="#" @click.prevent="currentPage--">Previous</a>
            </li>
            <li
              v-for="page in totalPages"
              :key="page"
              class="page-item"
              :class="{ active: page === currentPage }"
            >
              <a class="page-link" href="#" @click.prevent="currentPage = page">{{ page }}</a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <a class="page-link" href="#" @click.prevent="currentPage++">Next</a>
            </li>
          </ul>
        </nav>
      </div>

      <!-- No results -->
      <div v-else class="text-center py-5">
        <div class="alert alert-info">
          No news items found matching your search criteria.
          <button class="btn btn-sm btn-link" @click="resetFilters">Reset Filters</button>
        </div>
      </div>

      <!-- Guest View -->
      <div v-if="!isAuthenticated">
        <div class="alert alert-warning text-center mb-4">
          🔒 Sign in to unlock filters and full access to news.
        </div>
        <div class="news-feed">
          <NewsCard
            v-for="(newsItem, index) in limitedNews"
            :key="index"
            :news="newsItem"
            class="locked"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import NewsCard from './NewsCard.vue';

export default {
  name: 'NewsComponent',
  components: { NewsCard },
  setup() {
    const newsData = ref([]);
    const userCreatedPosts = ref([]);
    const searchTerm = ref('');
    const selectedCategory = ref('');
    const selectedDate = ref('');
    const currentPage = ref(1);
    const itemsPerPage = 3;
    const editingNews = ref(null);
    const currentUser = ref({
      id: 'user-123', // This would typically come from your auth system
      name: 'Current User'
    });
    
    const form = ref({
      title: '',
      content: '',
      category: '',
      date: '',
      authorId: currentUser.value.id
    });

    const isAuthenticated = ref(localStorage.getItem("isAuthenticated") === "true");
    
    // User initial for the avatar
    const userInitial = computed(() => {
      return currentUser.value.name.charAt(0).toUpperCase();
    });

    onMounted(async () => {
      try {
        const response = await fetch('/src/assets/news.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        
        // Add authorId to existing data if not present
        newsData.value = data.map(item => {
          if (!item.authorId) {
            // For demo purposes, randomly assign some posts to current user
            item.authorId = Math.random() > 0.5 ? currentUser.value.id : 'other-user';
          }
          return item;
        });
      } catch (error) {
        console.error('Error loading news data:', error);
      }
    });

    const uniqueCategories = computed(() => {
      const categories = new Set(newsData.value.map(item => item.category));
      return Array.from(categories);
    });

    const filteredNews = computed(() => {
      return newsData.value.filter(item => {
        const matchesSearch = searchTerm.value === '' ||
          item.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
          item.content.toLowerCase().includes(searchTerm.value.toLowerCase());

        const matchesCategory = selectedCategory.value === '' ||
          item.category === selectedCategory.value;

        const matchesDate = selectedDate.value === '' ||
          item.date === selectedDate.value;

        return matchesSearch && matchesCategory && matchesDate;
      });
    });

    const paginatedNews = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      return filteredNews.value.slice(start, start + itemsPerPage);
    });

    const limitedNews = computed(() => newsData.value.slice(0, 2));
    const totalPages = computed(() => Math.ceil(filteredNews.value.length / itemsPerPage));

    const isUserPost = (newsItem) => {
      return newsItem.authorId === currentUser.value.id;
    };
    
    // New function to check if post was created by the user during this session
    const isUserCreatedPost = (newsItem) => {
      return userCreatedPosts.value.includes(newsItem);
    };

    const applyFilters = () => currentPage.value = 1;
    
    const resetFilters = () => {
      searchTerm.value = '';
      selectedCategory.value = '';
      selectedDate.value = '';
      currentPage.value = 1;
    };

    const submitPost = () => {
      // Make sure the authorId is set
      form.value.authorId = currentUser.value.id;
      
      if (editingNews.value) {
        const index = newsData.value.findIndex(n => n === editingNews.value);
        newsData.value[index] = { ...form.value };
        
        // If we're editing a post and it's not in userCreatedPosts, add it
        if (!userCreatedPosts.value.includes(newsData.value[index])) {
          userCreatedPosts.value.push(newsData.value[index]);
        }
        
        editingNews.value = null;
      } else {
        const newPost = { ...form.value };
        newsData.value.unshift(newPost);
        // Track this as a user-created post
        userCreatedPosts.value.push(newPost);
      }
      resetForm();
    };

    const editNews = (newsItem) => {
      if (isUserCreatedPost(newsItem)) {
        editingNews.value = newsItem;
        form.value = { ...newsItem };
      }
    };

    const deleteNews = (newsItem) => {
      if (isUserCreatedPost(newsItem)) {
        newsData.value = newsData.value.filter(n => n !== newsItem);
        userCreatedPosts.value = userCreatedPosts.value.filter(n => n !== newsItem);
      }
    };

    const cancelEdit = () => {
      editingNews.value = null;
      resetForm();
    };

    const resetForm = () => {
      form.value = { 
        title: '', 
        content: '', 
        category: '', 
        date: '',
        authorId: currentUser.value.id
      };
    };

    return {
      newsData,
      searchTerm,
      selectedCategory,
      selectedDate,
      currentPage,
      uniqueCategories,
      filteredNews,
      paginatedNews,
      limitedNews,
      totalPages,
      isAuthenticated,
      applyFilters,
      resetFilters,
      form,
      editingNews,
      currentUser,
      userInitial,
      isUserPost,
      isUserCreatedPost,
      submitPost,
      editNews,
      deleteNews,
      cancelEdit
    };
  }
};
</script>

<style scoped>
.news-container {
  background-color: black;
  color: white;
  padding: 2rem 0;
  min-height: 100vh;
}

.news-feed {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 680px;
  margin: 0 auto;
}

.alert {
  background-color: #343a40;
  color: azure;
  border: none;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  padding: 1.5rem;
  border-radius: 0.5rem;
}

/* Tweet-like form styling */
.tweet-form {
  background-color: #222;
  border-radius: 1rem;
  padding: 1.5rem;
  max-width: 680px;
  margin: 0 auto 2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.tweet-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  gap: 0.75rem;
}

.tweet-avatar {
  width: 40px;
  height: 40px;
  background-color: #0d6efd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  flex-shrink: 0;
}

.tweet-title {
  border: none;
  background-color: transparent;
  font-size: 1.2rem;
  font-weight: 500;
  padding: 0;
  height: auto;
}

.tweet-content {
  border: none;
  background-color: transparent;
  resize: none;
  min-height: 80px;
  margin-bottom: 1rem;
  padding: 0;
}

.tweet-footer {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.tweet-metadata {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
}

.category-input {
  width: auto;
  max-width: 150px;
}

.date-input {
  width: auto;
  max-width: 150px;
}

.tweet-actions {
  display: flex;
  gap: 0.5rem;
}

/* Filter styling */
.filter-wrapper {
  display: flex;
  justify-content: center;
  align-items: stretch;
  flex-wrap: wrap;
  gap: 1rem;
  max-width: 680px;
  margin: 0 auto;
}

.filter-item {
  flex: 1 1 200px;
}

.filter-button {
  min-width: 120px;
}

.form-control {
  background-color: #343a40;
  border-color: #495057;
  color: white;
  height: 38px;
  border-radius: 0.25rem;
}

.tweet-form .form-control {
  background-color: transparent;
}

.tweet-form .form-control:focus {
  background-color: transparent;
  box-shadow: none;
  border-color: transparent;
}

.form-control::placeholder {
  color: #adb5bd;
}

.form-control:focus {
  background-color: #343a40;
  color: white;
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.input-group-text {
  background-color: #343a40;
  border-color: #495057;
  color: #adb5bd;
}

input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(1);
}

.pagination .page-link {
  background-color: #343a40;
  border-color: #495057;
  color: white;
}

.pagination .page-item.active .page-link {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.pagination .page-item.disabled .page-link {
  background-color: #212529;
  color: #6c757d;
}

.news-card-wrapper {
  background-color: #222;
  padding: 1rem;
  border-radius: 0.5rem;
}

.locked {
  opacity: 0.6;
  pointer-events: none;
}
</style>