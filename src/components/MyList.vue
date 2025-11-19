<template>
    <div class="travel-bucket-list">
      <h1 class="text-3xl font-bold mb-6 text-indigo-700">Travel Bucket List Kanban</h1>
  
      <div class="mb-6 p-4 bg-white rounded-lg shadow">
        <div class="flex flex-col sm:flex-row gap-2">
          <input
            v-model="newDestination.name"
            type="text"
            placeholder="Where do you want to go?"
            class="flex-grow p-2 border border-gray-300 rounded"
            @keyup.enter="addDestination"
          />
          <select
            v-model="newDestination.priority"
            class="fil p-2 border border-gray-300 rounded"
          >
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
          <button
            @click="addDestination"
            class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
            :disabled="!newDestination.name"
          >
            Add
          </button>
        </div>
      </div>
  
  
      <div class="kanban-board flex flex-col md:flex-row gap-4">
  
        <div class="hidden md:flex items-center justify-center px-2">
          <div class="text-2xl text-gray-400">→</div>
        </div>
  
        <!-- Visited Column -->
        <div class="kanban-column bg-green-50 rounded-lg p-4 flex-1">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-green-700">Visited</h2>
            <span class="px-2 py-1 bg-green-200 text-green-800 rounded-full text-sm">{{ visitedDestinations.length }}</span>
          </div>
          <draggble
            v-model="toVisitDestinations"
            group="destinations"
            item-key="name"
            class="min-h-80 space-y-3 flex flex-col"
            direction="vertical"
            @end="onDragEnd">
            
          <div class="min-h-20 space-y-3 flex flex-col">
            <div
              v-for="destination in visitedDestinations" 
              :key="destination.name"
              class="p-4 bg-white rounded-lg shadow-sm border-l-4 border-l-green-500 transition-all"
            >
              <div class="flex items-center justify-between">
                <div>
                  <span>{{ destination.name }}</span>
                  <div class="mt-1 text-xs text-gray-500">
                    {{ destination.visitDate ? formatDate(destination.visitDate) : 'Recently visited' }}
                  </div>
                </div>
                <div class="flex gap-2">
                  <button
                    @click="toggleVisited(destination)"
                    class="text-gray-400 hover:text-gray-600"
                  >
                    ↩
                  </button>
                  <button
                    @click="removeDestinationByName(destination.name)"
                    class="text-red-400 hover:text-red-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          </div>
        </draggble>
       
        </div>
  
        <!-- Column separator with arrow -->
        <div class="hidden md:flex items-center justify-center px-2">
          <div class="text-2xl text-gray-400">→</div>
        </div>
  
        <!-- To Visit Column -->
        <div class="kanban-column bg-indigo-50 rounded-lg p-4 flex-1">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-indigo-700">To Visit</h2>
            <span class="px-2 py-1 bg-indigo-200 text-indigo-800 rounded-full text-sm">{{ toVisitDestinations.length }}</span>
          </div>
          <draggble
            v-model="toVisitDestinations"
            group="destinations"
            item-key="name"
            class="min-h-80 space-y-3 flex flex-col"
            direction="vertical"
            @end="onDragEnd">

          <div class="min-h-80 space-y-3 flex flex-col">
            <div
              v-for="destination in toVisitDestinations"
              :key="destination.name"
              class="p-4 bg-white rounded-lg shadow-sm border-l-4 transition-all"
              :class="{
                'border-l-amber-500': destination.priority === 'high',
                'border-l-blue-500': destination.priority === 'medium',
                'border-l-gray-300': destination.priority === 'low'
              }"
            >
              <div class="flex items-center justify-between">
                <div>
                  <span>{{ destination.name }}</span>
                  <div class="mt-1">
                    <span 
                      class="text-xs px-2 py-1 rounded"
                      :class="{
                        'bg-amber-100 text-amber-800': destination.priority === 'high',
                        'bg-blue-100 text-blue-800': destination.priority === 'medium',
                        'bg-gray-100 text-gray-800': destination.priority === 'low'
                      }"
                    >
                      {{ destination.priority }}
                    </span>
                  </div>
                </div>
                <div class="flex gap-2">
                  <button
                    @click="toggleVisited(destination)"
                    class="text-gray-400 hover:text-gray-600"
                  >
                    ✓
                  </button>
                  <button
                    @click="removeDestinationByName(destination.name)"
                    class="text-red-400 hover:text-red-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          </div>
        </draggble>
        </div>
      </div>
  
      <div class="mt-6 p-4 bg-indigo-50 rounded-lg text-center">
        <p class="text-indigo-700">
          You've visited {{ visitedDestinations.length }} out of {{ allDestinations.length }} destinations
          ({{ calculateCompletionPercentage() }}%)
        </p>
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent } from 'vue';
  import draggble from 'vuedraggable';
  
  export default defineComponent({
    name: 'TravelBucketList',
    components:{
        draggble
    },
    data() {
      return {
        destinations: [
          { name: 'Paris, France', priority: 'high', visited: true, visitDate: new Date('2023-06-15') },
          { name: 'Tokyo, Japan', priority: 'high', visited: false, visitDate: null },
          { name: 'Grand Canyon, USA', priority: 'medium', visited: false, visitDate: null },
          { name: 'Bali, Indonesia', priority: 'low', visited: false, visitDate: null }
        ],
        newDestination: { name: '', priority: 'medium', visited: false, visitDate: null },
        visitedDestinations: [],
        toVisitDestinations: []
      };
    },
    computed: {
      allDestinations() {
        return [...this.visitedDestinations, ...this.toVisitDestinations];
      }
    },
    methods: {
      addDestination() {
        if (this.newDestination.name.trim()) {
          this.toVisitDestinations.push({
            name: this.newDestination.name.trim(),
            priority: this.newDestination.priority || 'medium',
            visited: false,
            visitDate: null
          });
          this.newDestination.name = '';
        }
      },
      removeDestinationByName(name) {
        const allArrays = [this.visitedDestinations, this.toVisitDestinations];
        
        allArrays.forEach(array => {
          const index = array.findIndex(d => d.name === name);
          if (index !== -1) array.splice(index, 1);
        });
      },
      toggleVisited(destination) {
        destination.visited = !destination.visited;
        
        if (destination.visited) {
          destination.visitDate = new Date();
          this.moveDestinationToVisited(destination);
        } else {
          destination.visitDate = null;
          this.moveDestinationToToVisit(destination);
        }
      },
      moveDestinationToVisited(destination) {
        this.removeDestinationByName(destination.name);
        this.visitedDestinations.push(destination);
      },
      moveDestinationToToVisit(destination) {
        this.removeDestinationByName(destination.name);
        this.toVisitDestinations.push(destination);
      },
      onDragEnd(evt){
        const {from, to, item} = evt;
        const destination = this.allDestinations.find(d=> d.name === item.textContent.trim().split('\n')[0]);

        if(!destination) return;

        if (to.className.includes('visited')) {
        destination.visited = true;
        destination.visitDate = destination.visitDate || new Date();
      } else if (to.className.includes('to-visit')) {
        destination.visited = false;
        destination.visitDate = null;
      }

      
      
        


      },
      calculateCompletionPercentage() {
        const total = this.allDestinations.length;
        if (!total) return 0;
        return Math.round((this.visitedDestinations.length / total) * 100);
      },
      formatDate(date) {
        if (!date) return '';
        return new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      },
      initializeKanbanColumns() {
        this.visitedDestinations = this.destinations.filter(d => d.visited);
        this.toVisitDestinations = this.destinations.filter(d => !d.visited);
        this.destinations = []; 
      }
    },
    watch: {
      visitedDestinations: {
        deep: true,
        handler(newDestinations) {
          newDestinations.forEach(destination => {
            if (!destination.visited) {
              destination.visited = true;
              destination.visitDate = destination.visitDate || new Date();
            }
          });
        }
      },
      toVisitDestinations: {
        deep: true,
        handler(newDestinations) {
          newDestinations.forEach(destination => {
            if (destination.visited) {
              destination.visited = false;
              destination.visitDate = null;
            }
          });
        }
      }
    },
    mounted() {
      const saved = localStorage.getItem('travelBucketListKanban');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          
          ['destinations', 'visitedDestinations', 'toVisitDestinations'].forEach(arrayName => {
            if (parsed[arrayName]) {
              parsed[arrayName].forEach(d => { 
                if (d.visitDate) d.visitDate = new Date(d.visitDate); 
              });
              this[arrayName] = parsed[arrayName];
            }
          });
        } catch (e) {
          console.error('Failed to parse saved destinations');
          this.initializeKanbanColumns(); 
        }
      } else {
        this.initializeKanbanColumns();
      }
    },
    beforeUnmount() {
      localStorage.setItem('travelBucketListKanban', JSON.stringify({
        destinations: this.destinations,
        visitedDestinations: this.visitedDestinations,
        toVisitDestinations: this.toVisitDestinations
      }));
    }
  });
  </script>
  
  <style scoped>
  .travel-bucket-list {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1.5rem;
    color: #e0e0e0;
    min-height: 100vh;
  }
  
  .kanban-board {
    height: 100%;
    min-height: 500px;
  }
  
  .kanban-column {
    min-height: 300px;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
  }
  
  .kanban-column > div {
    flex-grow: 1;
  }
  
  h1 {
    color: #FFD700; /* Yellow gold accent */
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    border-bottom: 2px solid #FFD700;
    padding-bottom: 0.5rem;
  }
  
  /* Form styling */
  .mb-6 {
    background-color: #030303 !important;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  }
  
  input[type="text"] {
    background-color: #000000;
    color: #e0e0e0;
    transition: all 0.3s ease;
  }
  
  input[type="text"]:focus {
    border-color: #FFD700;
    box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.25);
    outline: none;
  }
  
  select {
    background-color: #080707;
    color: #e0e0e0;
    transition: all 0.3s ease;
  }
  
  select:focus {
    border-color: #FFD700;
    outline: none;
  }
  
  button {
    transition: all 0.3s ease;
  }
  
  button[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  button[class*="bg-indigo-600"] {
    background-color: #FFD700 !important;
    color: #121212 !important;
    font-weight: 600;
    border: none;
  }
  
  button[class*="bg-indigo-600"]:hover {
    background-color: #F2C200 !important;
    transform: translateY(-1px);
  }
  
  /* Kanban column styling */
  .kanban-column {
    background-color: #151515 !important;
    border: 1px solid #222;
  }
  
  .kanban-column h2 {
    color: #FFD700;
  }
  
  /* Column headers */
  .kanban-column:nth-child(1) h2 {
    color: #e0e0e0;
  }
  
  .kanban-column:nth-child(2) h2 {
    color: #4CAF50;
  }
  
  .kanban-column:nth-child(3) h2 {
    color: #7C4DFF;
  }
  
  .kanban-column:nth-child(1) span[class*="bg-gray-200"] {
    background-color: #333 !important;
    color: #e0e0e0 !important;
  }
  
  .kanban-column:nth-child(2) span[class*="bg-green-200"] {
    background-color: rgba(76, 175, 80, 0.2) !important;
    color: #4CAF50 !important;
  }
  
  .kanban-column:nth-child(3) span[class*="bg-indigo-200"] {
    background-color: rgba(124, 77, 255, 0.2) !important;
    color: #7C4DFF !important;
  }
  
  
  div[class*="border-l-4"] {
    background-color: #080707 !important;
    border-color: #333 !important;
    transition: all 0.3s ease;
  }
  
  div[class*="border-l-4"]:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  div[class*="border-l-amber-500"] {
    border-left-color: #FFD700 !important;
  }
  
  div[class*="border-l-blue-500"] {
    border-left-color: #2196F3 !important;
  }
  
  div[class*="border-l-gray-300"] {
    border-left-color: #555 !important;
  }
  
  div[class*="border-l-green-500"] {
    border-left-color: #4CAF50 !important;
  }
  
  
  span[class*="bg-amber-100"] {
    background-color: rgba(255, 215, 0, 0.2) !important;
    color: #FFD700 !important;
    font-weight: 600;
  }
  
  span[class*="bg-blue-100"] {
    background-color: rgba(33, 150, 243, 0.2) !important;
    color: #64B5F6 !important;
  }
  
  span[class*="bg-gray-100"] {
    background-color: rgba(0, 0, 0, 0.2) !important;
    color: #9E9E9E !important;
  }
  
  /* Action buttons */
  button[class*="text-red-400"] {
    color: #FF6B6B !important;
    background-color: #030303;
    border: none;
  }
  button[class*="text-red-400"]:hover {
    color: #010000 !important;
    background-color: #FF6B6B;
    border-radius: 5px;
    border: none;
  }
  .sortable-ghost {
  opacity: 0.5;
  background-color: #333 !important;
}
  button[class*="text-gray-400"] {
    color: #fffefe !important;
    background-color: #030303;
    border: none;
  }
  button[class*="text-gray-400"]:hover {
    color: #000000 !important;
    background-color:#F2C200;
    border-radius: 5px;
    border: none;
  }
  
  span[class*="line-through"] {
    text-decoration-color: rgba(255, 215, 0, 0.5);
  }
  
  span[class*="text-gray-500"] {
    color: #d4d2d2 !important;
    background-color: #030303;
    padding-left: 5px;
    border: none;
  }
  
  div[class*="bg-indigo-50"] {
    background-color: rgba(255, 215, 0, 0.1) !important;
    border: 1px solid rgba(255, 215, 0, 0.2);
  }
  
  p[class*="text-indigo-700"] {
    color: #FFD700 !important;
    font-weight: 600;
  }
  
  .min-h-80 {
    min-height: 20rem;
  }
  </style>