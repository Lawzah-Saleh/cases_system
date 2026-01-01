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
  gap: 6px;
  padding: 11px 10px;
  background: #f8f8f8;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  min-height: 44px;
  align-items: center;
  cursor: text;
}

.tag {
  background: #ecebff;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.remove {
  cursor: pointer;
  color: #555;
  font-weight: 600;
}

.tag-input {
  flex: 1;
  min-width: 80px;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  padding: 2px;
}

/* Dropdown */
.dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  background: #ffffff;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.item {
  padding: 8px 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.item:hover,
.item[aria-selected="true"] {
  background: #f0f0ff;
}

/* Your checkbox fix */
.item input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: var(--primary-color); /* tint the checkbox to your theme */
  cursor: pointer;
  /* remove pointer-events:none so the checkbox itself is clickable */
}
</style>
