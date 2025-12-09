<template>
  <div class="multi-select" ref="wrapperRef">
    
    <!-- Selected Tags -->
    <div class="tags">
      <span v-for="emp in selectedEmployees" :key="emp.id" class="tag">
        {{ emp.first_name }} {{ emp.last_name }}
        <span class="remove" @click="remove(emp.id)">×</span>
      </span>
      
      <!-- Input trigger -->
      <input 
        type="text" 
        v-model="search" 
        placeholder="Search employees..." 
        @focus="open = true"
        class="tag-input"
      />
    </div>

    <!-- Dropdown -->
    <div v-if="open" class="dropdown">
      <div 
        v-for="emp in filteredEmployees"
        :key="emp.id"
        class="item"
        @click="toggle(emp)"
      >
        <input type="checkbox" :checked="modelValue.includes(emp.id)" />
        <span>{{ emp.first_name }} {{ emp.last_name }}</span>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  employees: Array,
  modelValue: Array
});

const emit = defineEmits(['update:modelValue']);

const open = ref(false);
const search = ref("");
const wrapperRef = ref(null);   // <-- REQUIRED

/* ------------------------------------------
   CLICK OUTSIDE TO CLOSE
------------------------------------------ */
function handleClickOutside(event) {
  if (wrapperRef.value && !wrapperRef.value.contains(event.target)) {
    open.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

/* ------------------------------------------
   FILTERING + SELECTING EMPLOYEES
------------------------------------------ */
const selectedEmployees = computed(() =>
  props.employees.filter(e => props.modelValue.includes(e.id))
);

const filteredEmployees = computed(() =>
  props.employees.filter(e =>
    (e.first_name + " " + e.last_name)
      .toLowerCase()
      .includes(search.value.toLowerCase())
  )
);

function toggle(emp) {
  let updated = [...props.modelValue];

  if (updated.includes(emp.id)) {
    updated = updated.filter(id => id !== emp.id);
  } else {
    updated.push(emp.id);
  }

  emit("update:modelValue", updated);
}

function remove(id) {
  emit("update:modelValue", props.modelValue.filter(x => x !== id));
}
</script>


<style scoped>
.multi-select {
  position: relative;
  width: 100%;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 10px;
  background: #f8f8f8;
  border: 1px solid #ddd;
  border-radius: 10px;
  min-height: 48px;
  align-items: center;
}

.tag {
  background: #ecebff;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.remove {
  cursor: pointer;
  color: #777;
}

.tag-input {
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: white;
  border: 1px solid #ddd;
  border-radius: 10px;
  margin-top: 5px;
  max-height: 180px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 5px 20px rgba(0,0,0,0.08);
}

.item {
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.item:hover {
  background: #f0f0ff;
}
</style>
