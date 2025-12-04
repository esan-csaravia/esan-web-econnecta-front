<template>
  <q-page class="q-pa-md page-premium">

    <!-- LOADING -->
    <div v-if="loading" class="flex flex-center q-mt-xl">
      <q-spinner color="primary" size="40px" />
    </div>

    <div v-else>

      <!-- No encontrado -->
      <div v-if="!detalle">
        <q-banner class="banner-error q-pa-md">
          No se encontró la transacción.
        </q-banner>
      </div>

      <div v-else>

        <!-- VOLVER -->
        <div class="row items-center q-mb-md back-section">
          <q-btn flat round icon="arrow_back" class="btn-back" @click="$router.push('/product')" />
          <div class="text-h6 page-title">Calificar Compra</div>
        </div>

        <!-- DETALLES DE LA COMPRA -->
        <q-card class="card-premium q-pa-lg q-mb-xl">
          <div class="text-h6 q-mb-sm title-detail">Detalles de la compra</div>

          <div class="text-caption text-grey q-mb-md">
            Transacción ID: EC-{{ detalle.idTransaccion }}
          </div>

          <div class="row items-center card-detail">

            <!-- IMAGEN -->
            <div>
              <q-img
                :src="apiBase + (detalle.publicacion?.imagenes?.[0] || '')"
                style="width: 90px; height: 90px; border-radius: 10px;"
                fit="cover"
                class="shadow-sm"
              />
            </div>

            <!-- INFO -->
            <div class="q-ml-md">
              <div class="text-bold">{{ detalle.publicacion?.titulo }}</div>

              <div class="product-price">S/ {{ detalle.publicacion?.precio }}</div>

              <div class="text-caption text-grey">
                Comprado el {{ formatearFecha(detalle.fecha) }}
              </div>
            </div>

          </div>
        </q-card>

        <!-- CALIFICAR -->
        <q-card class="card-premium q-pa-lg">

          <div class="row items-center q-mb-md seller-section">
            <q-avatar size="54px" class="avatar-seller">
              {{ iniciales(detalle.vendedor?.nombre + ' ' + detalle.vendedor?.apellido) }}
            </q-avatar>

            <div class="q-ml-md">
              <div class="text-h6 seller-title">
                Vendedor: {{ detalle.vendedor?.nombre }} {{ detalle.vendedor?.apellido }}
              </div>
              <div class="text-caption seller-subtitle">
                Califica tu experiencia con este vendedor
              </div>
            </div>
          </div>

          <div class="q-mb-sm rating-title">Calificación (1-5 estrellas)</div>

          <!-- ESTRELLAS -->
          <q-rating
            v-model="puntuacion"
            max="5"
            size="32px"
            color="amber"
            class="q-mb-md"
          />

          <!-- COMENTARIO -->
          <q-input
            filled
            type="textarea"
            v-model="comentario"
            label="Reseña (opcional)"
            maxlength="500"
            counter
            class="textarea-premium"
          />

          <div class="row justify-end q-mt-lg">
            <q-btn outline color="grey" class="btn-secondary q-mr-md" @click="saltar">
              Saltar por ahora
            </q-btn>

            <q-btn
              color="green"
              icon="send"
              label="Enviar Calificación"
              class="btn-primary"
              @click="enviarCalificacion"
            />
          </div>

        </q-card>

      </div>
    </div>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { api } from "boot/axios";

const route = useRoute();
const router = useRouter();
const apiBase = api.defaults.baseURL;

// Estados
const loading = ref(true);
const detalle = ref(null);
const puntuacion = ref(0);
const comentario = ref("");

// Usuario logueado
const usuario = JSON.parse(localStorage.getItem("usuario") || "null");

onMounted(() => {
  cargarDetalleCompra();
});

// Cargar detalle
const cargarDetalleCompra = async () => {
  try {
    const res = await api.get(`/api/transacciones/${route.params.id}`);
    detalle.value = res.data; 
  } catch (e) {
    console.error("Error al cargar detalle de compra:", e);
    detalle.value = null;
  } finally {
    loading.value = false;
  }
};

// Enviar calificación
const enviarCalificacion = async () => {
  if (!detalle.value) {
    alert("No hay datos de la compra.");
    return;
  }

  if (puntuacion.value <= 0) {
    alert("Debes seleccionar un número de estrellas.");
    return;
  }

  const payload = {
    idTransaccion: detalle.value.idTransaccion,
    idCalificador: usuario.idUsuario,
    idVendedor: detalle.value.vendedor.idUsuario,
    puntuacion: puntuacion.value,
    comentario: comentario.value
  };

  try {
    await api.post("/api/calificaciones", payload);
    alert("Calificación enviada correctamente.");
    router.push("/product");
  } catch (e) {
    console.error("Error enviando calificación:", e);
    alert("No se pudo enviar la calificación");
  }
};

const saltar = () => {
  router.push("/product");
};

// Helpers
const iniciales = (nombreCompleto) =>
  nombreCompleto?.split(" ").map(n => n[0]).join("").toUpperCase() || "";

const formatearFecha = (fechaStr) =>
  new Date(fechaStr).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
</script>

<style scoped>

/* ==========================================
   PAGE
========================================== */
.page-premium {
  background: #fafafa;
}

/* ==========================================
   TITULOS 
========================================== */
.page-title {
  color: #2ecc71;
  font-weight: 800;
  letter-spacing: 0.5px;
}

.title-detail {
  font-weight: 700;
  color: #333;
}

/* ==========================================
   CARD PREMIUM
========================================== */
.card-premium {
  border-radius: 16px;
  border: 1px solid #e8e8e8;
  background: white;
  box-shadow: 0 4px 14px rgba(0,0,0,0.08);
  transition: 0.3s ease;
}

.card-premium:hover {
  box-shadow: 0 6px 20px rgba(0,0,0,0.12);
}

/* ==========================================
   SELLER SECTION
========================================== */
.avatar-seller {
  background: #2ecc71 !important;
  color: white !important;
  font-weight: 700;
  box-shadow: 0 3px 8px rgba(46,204,113,0.4);
}

.seller-title {
  font-weight: 700;
}

.seller-subtitle {
  opacity: 0.7;
}

/* ==========================================
   ESTILOS DETALLE COMPRA
========================================== */
.product-price {
  font-size: 1.25rem;
  font-weight: 800;
  color: #2ecc71;
}

.banner-error {
  background: #e74c3c !important;
}

/* ==========================================
   BOTONES PREMIUM
========================================== */
.btn-primary {
  background-color: #2ecc71 !important;
  color: white !important;
  font-weight: 700;
  border-radius: 10px;
  padding: 8px 18px;
}

.btn-primary:hover {
  background-color: #27ae60 !important;
}

.btn-secondary {
  border-radius: 10px;
  font-weight: 600;
}

/* BACK BUTTON */
.btn-back {
  color: #2ecc71 !important;
}

/* RATING TITLE */
.rating-title {
  font-weight: 600;
  color: #333;
}

/* TEXTAREA */
.textarea-premium :deep(.q-field__control) {
  border-radius: 12px !important;
}

</style>
