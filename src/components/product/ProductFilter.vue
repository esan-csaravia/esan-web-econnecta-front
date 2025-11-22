<template>
  <div class="filter-container">

    <details open class="container">
      <summary class="summary">Fruits</summary>

      <!-- Buscador -->
      <input
        type="text"
        v-model="searchValue"
        placeholder="Search items..."
        class="search-input"
      />

      <!-- Lista con scroll -->
      <div class="scrollable-list">
        <p v-if="sortedItems.length === 0" class="no-results">No items found</p>

        <label
          v-for="item in sortedItems"
          :key="item.id"
          class="checkbox-label"
          :class="{ checked: checkedItems[item.id] }"
        >
          <input
            type="checkbox"
            v-model="checkedItems[item.id]"
            class="checkbox-input"
          />
          <span class="checkbox-text">{{ item.label }}</span>
        </label>
      </div>

      <!-- Items seleccionados -->
      <div v-if="selectedLabels.length" class="selected-items">
        <h3>Selected Items:</h3>
        <p>{{ selectedLabels.join(", ") }}</p>
      </div>
    </details>

  </div>
</template>

<script>
export default {
  name: "ProductFilter",

  data() {
    return {
      searchValue: "",
      checkedItems: {},

      items: [
        { id: 1, label: "Apple" },
        { id: 2, label: "Banana" },
        { id: 3, label: "Orange" },
        { id: 4, label: "Strawberry" },
        { id: 5, label: "Blueberry" },
        { id: 6, label: "Grape" },
        { id: 7, label: "Watermelon" },
        { id: 8, label: "Pineapple" },
        { id: 9, label: "Mango" },
        { id: 10, label: "Peach" },
        // Si quieres, sigo con los 100 items completos
      ]
    };
  },

  computed: {
    filteredItems() {
      if (!this.searchValue) return this.items;

      const text = this.searchValue.toLowerCase();

      return this.items.filter(item =>
        item.label.toLowerCase().includes(text)
      );
    },

    sortedItems() {
      return [...this.filteredItems].sort((a, b) => {
        const aChecked = this.checkedItems[a.id] || false;
        const bChecked = this.checkedItems[b.id] || false;

        if (aChecked && !bChecked) return -1;
        if (!aChecked && bChecked) return 1;
        return 0;
      });
    },

    selectedLabels() {
      return this.items
        .filter(item => this.checkedItems[item.id])
        .map(item => item.label);
    }
  }
};
</script>

<style scoped>
.container {
  padding: 20px;
  max-width: 400px;
  margin: 0 auto;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
}

.summary {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  cursor: pointer;
}

.search-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

/* Scroll list with dynamic shadows */
.scrollable-list {
  --shadow-y-offset: 10px;
  --shadow-blur: 15px;
  --shadow-spread: -16px;
  --shadow-color: rgb(0 0 0 / 0.3);

  overflow-y: auto;
  max-height: 500px;
  padding: 1.5rem;
  background: white;

  scroll-timeline-name: scrollanim;
  scroll-timeline-axis: block;

  animation: scroll-shadow-vertical linear;
  animation-timeline: scrollanim;
}

@keyframes scroll-shadow-vertical {
  0% {
    box-shadow: inset 0 calc(-1 * var(--shadow-y-offset)) var(--shadow-blur)
      var(--shadow-spread) var(--shadow-color);
  }
  5% {
    box-shadow: inset 0 var(--shadow-y-offset) var(--shadow-blur)
        var(--shadow-spread) var(--shadow-color),
      inset 0 calc(-1 * var(--shadow-y-offset)) var(--shadow-blur)
        var(--shadow-spread) var(--shadow-color);
  }
  95% {
    box-shadow: inset 0 var(--shadow-y-offset) var(--shadow-blur)
        var(--shadow-spread) var(--shadow-color),
      inset 0 calc(-1 * var(--shadow-y-offset)) var(--shadow-blur)
        var(--shadow-spread) var(--shadow-color);
  }
  100% {
    box-shadow: inset 0 var(--shadow-y-offset) var(--shadow-blur)
      var(--shadow-spread) var(--shadow-color);
  }
}

.checkbox-label {
  display: flex;
  align-items: center;
  padding: 10px;
  margin-bottom: 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.checkbox-label.checked {
  background-color: #e3f2fd;
}

.checkbox-label:hover:not(.checked) {
  background-color: #eeeeee;
}

.checkbox-input {
  width: 18px;
  height: 18px;
  margin-right: 12px;
  cursor: pointer;
}

.checkbox-text {
  font-size: 16px;
}

.no-results {
  color: #666;
  font-style: italic;
}

.selected-items {
  margin-top: 30px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.selected-items h3 {
  margin: 0 0 10px;
  font-size: 16px;
}

.selected-items p {
  margin: 0;
  color: #666;
}
</style>
