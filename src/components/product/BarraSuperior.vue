<template>
  <div class="barra-superior row items-center justify-between q-mb-lg">

    <!-- TEXTOS -->
    <div>
      <h2 class="titulo-market">Marketplace</h2>
      <p class="subtitulo-market">Descubre productos sustentables y reutilizados</p>
    </div>

    <!-- BOTÓN -->
    <q-btn
      color="positive"
      icon="add"
      label="Publicar Producto"
      class="btn-publicar"
      @click="goPublicar"
    />
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

const goPublicar = () => {
  router.push("/publicar");
};
</script>

<style scoped>

/* ================================ */
/* CONTENEDOR SUPERIOR */
/* ================================ */
.barra-superior {
  background: white;
  padding: 18px 22px;
  border-radius: 14px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.07);
  border: 1px solid #f0f0f0;
}

/* ================================ */
/* TEXTOS */
/* ================================ */
.titulo-market {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 800;
  color: #2ecc71;
  letter-spacing: 0.5px;
}

.subtitulo-market {
  margin-top: 4px;
  font-size: 0.95rem;
  color: #777;
}

/* ================================ */
/* BOTÓN PUBLICAR */
/* ================================ */
.btn-publicar {
  background-color: #2ecc71 !important;
  color: white !important;
  font-weight: 600;
  padding: 10px 18px;
  border-radius: 10px;
  transition: 0.25s ease;
}

.btn-publicar:hover {
  background-color: #27ae60 !important;
}

</style>
