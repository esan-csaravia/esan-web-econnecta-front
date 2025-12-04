<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <q-page padding class="campanas-page">

    <!-- TÍTULO -->
    <div class="page-title">Campañas de Reciclaje</div>
    <div class="page-sub text-grey-7 q-mb-xl">
      Descubre campañas activas cerca de ti
    </div>

    <!-- 🔥 MASONRY -->
    <div class="masonry">
      <div
        class="masonry-item"
        v-for="c in campanas"
        :key="c.idCampana"
      >
        <q-card class="campana-card shadow-2">

          <!-- Imagen -->
          <img
            :src="apiBase + c.imagen"
            class="campana-img"
            @load="onImageLoad($event, c)"
          />

          <!-- Contenido -->
          <q-card-section class="contenido">

            <div class="campana-titulo">
              {{ c.titulo }}
            </div>

            <div class="campana-fecha text-caption">
              Publicado: {{ formatFecha(c.fechaPublicacion) }}
            </div>

            <div class="descripcion">
              {{ c.descripcion }}
            </div>

          </q-card-section>

        </q-card>
      </div>
    </div>

    <!-- SIN CAMPAÑAS -->
    <div v-if="campanas.length === 0" class="text-center text-grey q-mt-xl">
      <q-icon name="info" size="40px" color="#2ecc71" />
      <div>No hay campañas disponibles.</div>
    </div>

  </q-page>
</template>

<script setup>
/* ✔ NO se tocó nada de la lógica */
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { api } from "boot/axios";

const $q = useQuasar();
const campanas = ref([]);

const apiBase = api.defaults.baseURL;

const cargarCampanas = async () => {
  try {
    const { data } = await api.get("/api/campanas");
    campanas.value = data;
  } catch (error) {
    console.error(error);
    $q.notify({
      type: "negative",
      message: "Error al cargar campañas",
    });
  }
};

const onImageLoad = (e, campana) => {
  const img = e.target;
  campana.vertical = img.naturalHeight > img.naturalWidth;
};

const formatFecha = (fecha) => {
  if (!fecha) return "";
  return new Date(fecha).toLocaleDateString("es-PE");
};

onMounted(cargarCampanas);
</script>

<style scoped>

/* ===========================
   TITULOS
=========================== */
.page-title {
  font-size: 1.9rem;
  font-weight: 800;
  color: #2ecc71; /* Color principal */
}

.page-sub {
  font-size: 0.95rem;
}

/* ===========================
   MASONRY
=========================== */
.masonry {
  column-count: 1;
  column-gap: 20px;
}

@media (min-width: 600px) {
  .masonry { column-count: 2; }
}

@media (min-width: 900px) {
  .masonry { column-count: 3; }
}

@media (min-width: 1300px) {
  .masonry { column-count: 4; }
}

.masonry-item {
  break-inside: avoid;
  margin-bottom: 20px;
}

/* ===========================
   CARD PREMIUM
=========================== */
.campana-card {
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  background: white;
  transition: 0.25s ease;
}

.campana-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  border-color: #2ecc71; /* Toque premium verde */
}

/* ===========================
   IMAGEN
=========================== */
.campana-img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
}

/* ===========================
   CONTENIDO
=========================== */
.contenido {
  padding: 16px 18px;
}

.campana-titulo {
  font-weight: 700;
  font-size: 1.15rem;
  color: #2ecc71; /* Título en tu color principal */
}

.campana-fecha {
  color: #6f6f6f;
  margin-bottom: 6px;
}

.descripcion {
  margin-top: 8px;
  font-size: 0.95rem;
  color: #555;
  line-height: 1.45;
}

</style>
