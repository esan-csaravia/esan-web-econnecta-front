<template>
  <div class="filtros-container q-pa-md q-mb-lg rounded-borders shadow-2">

    <div class="row q-col-gutter-md">

      <!-- BUSCADOR -->
      <div class="col-12 col-md-3">
        <q-input
          outlined
          dense
          v-model="localFiltros.texto"
          placeholder="Buscar productos…"
          prefix-icon="search"
          class="input-premium"
          @keyup.enter="emitBuscar"
        />
      </div>

      <!-- CATEGORÍA -->
      <div class="col-12 col-md-2">
        <q-select
          outlined
          dense
          v-model="localFiltros.categoria"
          :options="categorias"
          option-value="idCategoria"
          option-label="nombre"
          label="Categoría"
          class="input-premium"
          emit-value
          map-options
          @update:model-value="emitBuscar"
        />
      </div>

      <!-- UBICACIÓN -->
      <div class="col-12 col-md-2">
        <q-select
          outlined
          dense
          v-model="localFiltros.distrito"
          :options="distritos"
          label="Ubicación"
          class="input-premium"
          @update:model-value="emitBuscar"
        />
      </div>

      <!-- BOTONES -->
      <div class="col-12 col-md-2 flex flex-center q-gutter-sm">
        <q-btn
          color="primary"
          label="Buscar"
          class="btn-premium"
          style="flex: 1"
          @click="emitBuscar"
        />
      </div>

      <div class="col-12 col-md-3 flex flex-center">
        <q-btn
          outline
          color="primary"
          label="Limpiar Filtros"
          icon="clear"
          class="btn-outline full-width"
          @click="limpiarFiltros"
        />
      </div>

    </div>

  </div>
</template>

<script setup>
import { reactive, watch } from "vue";

const props = defineProps({
  categorias: Array,
  distritos: Array,
  modelValue: Object
});

const emit = defineEmits(["update:modelValue", "buscar"]);

const localFiltros = reactive({ ...props.modelValue });

// Mantener sincronizados filtros padre <-> hijo
watch(
  () => props.modelValue,
  (val) => Object.assign(localFiltros, val)
);

watch(localFiltros, () => {
  emit("update:modelValue", localFiltros);
});

const emitBuscar = () => {
  emit("buscar");
};

const limpiarFiltros = () => {
  localFiltros.texto = "";
  localFiltros.categoria = null;
  localFiltros.distrito = null;
  emit("buscar");
};
</script>

<style scoped>

/* ============================================== */
/* CONTENEDOR PREMIUM */
/* ============================================== */
.filtros-container {
  background: white;
  border-radius: 14px;
  border: 1px solid #e8e8e8;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transition: 0.25s ease;
}

.filtros-container:hover {
  box-shadow: 0 6px 18px rgba(0,0,0,0.12);
}

/* ============================================== */
/* INPUTS PREMIUM */
/* ============================================== */
.input-premium :deep(.q-field__control) {
  border-radius: 10px !important;
  transition: 0.25s ease;
}

.input-premium :deep(.q-field__control:hover) {
  border-color: #2F5E4E !important;
}

.input-premium :deep(.q-field__label) {
  font-weight: 600;
}

/* Cuando está activo o enfocado */
.input-premium :deep(.q-field--focused .q-field__control) {
  border-color: #2F5E4E !important;
  box-shadow: 0 0 4px rgba(47,94,78,0.4);
}

/* ============================================== */
/* BOTÓN PREMIUM */
/* ============================================== */
.btn-premium {
  background-color: #2F5E4E !important;
  color: white !important;
  font-weight: 700;
  border-radius: 10px;
  padding: 8px 0;
  transition: 0.25s ease;
}

.btn-premium:hover {
  background-color: #2F5E4E !important;
}

/* ============================================== */
/* BOTÓN OUTLINE */
/* ============================================== */
.btn-outline {
  border-color: #2F5E4E !important;
  color: #2F5E4E !important;
  font-weight: 700;
  border-radius: 10px;
  padding: 8px 0;
  transition: 0.25s ease;
}

.btn-outline:hover {
  background-color: #C2C48A !important;
  color: #2F5E4E !important;
}

</style>
