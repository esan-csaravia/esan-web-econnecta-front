CardProducto.vue

<template>
  <div class="col-12 col-md-4">
    <q-card class="my-card premium-card cursor-pointer">

      <!-- CARRUSEL -->
      <q-carousel
        v-model="slide"
        swipeable
        animated
        arrows
        height="230px"
        class="rounded-borders carousel-premium"
        @click="verMas"
      >
        <q-carousel-slide
          v-for="(img, index) in imagenesAbsolutas"
          :key="index"
          :name="index"
          class="flex flex-center"
        >
          <img
            :src="img"
            class="carousel-image"
            alt="Producto"
          />
        </q-carousel-slide>
      </q-carousel>

      <q-card-section class="section-premium">

        <div class="product-title text-h6">
          {{ item.titulo }}
        </div>

        <div class="product-price">
          S/ {{ item.precio }}
        </div>

        <div class="row items-center text-grey-7 q-mt-sm product-meta">
          <div class="col-7 meta-item">
            <q-icon name="person" size="16px" class="q-mr-xs" />
            {{ item.nombreUsuario }}
          </div>

          <div class="col-5 text-right meta-item">
            <q-icon name="place" size="16px" class="q-mr-xs" />
            {{ item.distrito }}
          </div>
        </div>

      </q-card-section>

      <q-card-actions align="around" class="actions-premium">
        <q-btn
          color="primary"
          icon="visibility"
          label="Ver más"
          flat
          class="btn-premium"
          @click="verMas"
        />
      </q-card-actions>

    </q-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { api } from "boot/axios";

const apiBase = api.defaults.baseURL;

// Props
const { item } = defineProps({
  item: Object
});

// Emit
const emit = defineEmits(["vermas"]);

const slide = ref(0);

// Usuario logueado
const usuario = JSON.parse(localStorage.getItem("usuario") || "null");

// Normalizar rutas de imágenes
const imagenesAbsolutas = item.imagenes.map(img =>
  img.startsWith("http") ? img : apiBase + img
);

// Ver más + notificación
const verMas = async () => {
  try {
    if (usuario && usuario.idUsuario !== item.idUsuario) {
      await api.post("/api/notificaciones", {
        idUsuario: item.idUsuario,
        idPublicacion: item.idPublicacion,
        mensaje: `${usuario.nombre} mostró interés en tu publicación.`
      });
    }
  } catch (e) {
    console.error("Error creando notificación de interés:", e);
  }

  emit("vermas", item.idPublicacion);
};
</script>

<style scoped>

/* ================================ */
/* CARD PREMIUM */
/* ================================ */
.premium-card {
  border-radius: 14px;
  overflow: hidden;
  transition: 0.25s ease;
  box-shadow: 0 4px 14px rgba(0,0,0,0.08);
  background: white;
}

.premium-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 22px rgba(0,0,0,0.12);
}

/* ================================ */
/* CARRUSEL */
/* ================================ */
.carousel-premium {
  border-bottom: 1px solid #f0f0f0;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
}

/* ================================ */
/* TEXTOS Y DATOS */
/* ================================ */
.section-premium {
  padding: 18px;
}

.product-title {
  font-weight: 700;
  color: #333;
}

.product-price {
  font-size: 1.3rem;
  font-weight: 800;
  margin-top: 4px;
  color: #2F5E4E;
}

.product-meta {
  font-size: 0.88rem;
  opacity: 0.9;
}

.meta-item {
  display: flex;
  align-items: center;
}

/* ================================ */
/* BOTÓN PREMIUM */
/* ================================ */
.actions-premium {
  border-top: 1px solid #f2f2f2;
  padding: 10px 0;
}

.btn-premium {
  color: #2F5E4E !important;
  font-weight: 600;
  transition: 0.25s ease;
}

.btn-premium:hover {
  background: rgba(47,94,78,0.12);
}

/* BORDER RADIUS BASE */
.my-card,
.rounded-borders {
  border-radius: 14px;
}

</style>
