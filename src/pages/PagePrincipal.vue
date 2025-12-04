<template>
  <q-page class="q-pa-lg">

    <!-- Barra superior -->
    <BarraSuperior @publicar="goPublicar" />

    <!-- Filtros -->
    <FiltrosMarketplace
      v-model="filtros"
      :categorias="categorias"
      :distritos="distritos"
      @buscar="buscar"
    />

    <div class="row q-col-gutter-xl">
      <CardProducto
        v-for="p in productos"
        :key="p.idPublicacion"
        :item="p"
        @vermas="goDetalle"
      />
    </div>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { api } from "boot/axios";
import { useRouter } from "vue-router";

// Components
import BarraSuperior from "src/components/product/BarraSuperior.vue";
import FiltrosMarketplace from "src/components/product/FiltrosMarketplace.vue";
import CardProducto from "src/components/product/CardProducto.vue";

const router = useRouter();

const categorias = ref([]);
const distritos = ref([
]); // O puedes jalarlo de Usuarios si prefieres.

const productos = ref([]);

const filtros = ref({
  texto: "",
  categoria: null,
  distrito: null
});

// Cargar categorías + productos
onMounted(() => {
  cargarCategorias();
  cargarDistritos();
  buscar();
});

const cargarCategorias = async () => {
  const res = await api.get("/api/categorias");
  categorias.value = res.data;
};

const cargarDistritos = async () => {
  const res = await api.get("/api/usuarios/distritos");
  distritos.value = res.data;
};

const buscar = async () => {
  const params = {
    titulo: filtros.value.texto,
    categoria: filtros.value.categoria,
    distrito: filtros.value.distrito
  };

  const res = await api.get("/api/publicaciones/aprobadas", { params });
  productos.value = res.data;
};

// Redirigir a publicar
const goPublicar = () => {
  router.push("/publicar-producto");
};

const goDetalle = (id) => {
  router.push(`/producto/${id}`);
};
</script>

<style scoped>
</style>
