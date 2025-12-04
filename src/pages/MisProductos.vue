<template>
  <q-page class="q-pa-md page-premium">

    <!-- TÍTULO -->
    <div class="page-header q-mb-lg">
      <div class="text-h5 page-title">Mis Publicaciones</div>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="text-center q-mt-xl">
      <q-spinner size="40px" color="primary" />
    </div>

    <!-- SIN PRODUCTOS -->
    <div v-else-if="publicaciones.length === 0" class="text-center text-grey q-mt-xl">
      Aún no has publicado productos.
    </div>

    <!-- GRID DE PRODUCTOS -->
    <div v-else class="row q-col-gutter-lg">
      <div
        v-for="p in publicaciones"
        :key="p.idPublicacion"
        class="col-12 col-md-4"
      >
        <q-card
          class="card-premium my-card"
          :class="{ 'opacity-50': eliminandoId === p.idPublicacion }"
        >

          <!-- IMAGEN -->
          <q-img
            :src="apiBase + p.imagenPrincipal"
            spinner-color="primary"
            class="producto-img"
            fit="cover"
          />

          <!-- CONTENIDO -->
          <q-card-section>
            <div class="producto-titulo text-h6">{{ p.titulo }}</div>

            <div v-if="p.precio" class="producto-precio text-h6">
              S/ {{ p.precio }}
            </div>

            <q-badge
              :color="getEstadoColor(p.estadoPublicacion)"
              class="estado-badge q-mt-sm"
            >
              {{ p.estadoPublicacion }}
            </q-badge>

            <div class="producto-fecha text-caption">
              {{ formatearFecha(p.fechaCreacion) }}
            </div>
          </q-card-section>

          <!-- ACCIONES -->
          <q-card-actions align="around" class="acciones-premium">

            <q-btn
              color="primary"
              flat
              icon="visibility"
              label="Ver"
              class="btn-accion"
              @click="verPublicacion(p.idPublicacion)"
              :disable="eliminandoId === p.idPublicacion"
            />

            <q-btn
              color="orange"
              flat
              icon="edit"
              label="Editar"
              class="btn-accion"
              @click="editarPublicacion(p.idPublicacion)"
              :disable="eliminandoId === p.idPublicacion"
            />

            <q-btn
              color="red"
              flat
              icon="delete"
              label="Eliminar"
              class="btn-accion"
              @click="confirmarEliminar(p.idPublicacion)"
              :disable="eliminandoId === p.idPublicacion"
            />

          </q-card-actions>

        </q-card>

      </div>
    </div>

  </q-page>
</template>

<script setup>
/* -------------------------
   NO SE MODIFICÓ NADA
-------------------------- */
import { ref, onMounted } from "vue";
import { api } from "boot/axios";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

const router = useRouter();
const $q = useQuasar();

const apiBase = api.defaults.baseURL.replace('/api', '');

const publicaciones = ref([]);
const loading = ref(true);
const eliminandoId = ref(null);

const usuario = JSON.parse(localStorage.getItem("usuario") || "null");

const cargarPublicaciones = async () => {
  if (!usuario) return;

  try {
    const res = await api.get(`/api/publicaciones/usuario/${usuario.idUsuario}`);
    publicaciones.value = res.data;
  } catch (e) {
    console.error("Error cargando publicaciones:", e);
  }

  loading.value = false;
};

onMounted(() => cargarPublicaciones());

const verPublicacion = (id) => router.push(`/producto/${id}`);
const editarPublicacion = (id) => router.push(`/editar-producto/${id}`);

const confirmarEliminar = (id) => {
  $q.dialog({
    title: "Eliminar publicación",
    message: "¿Estás seguro? Esta acción no se puede deshacer.",
    ok: { label: "Eliminar", color: "red" },
    cancel: { label: "Cancelar", color: "grey" },
    persistent: true
  }).onOk(() => eliminarPublicacion(id));
};

const eliminarPublicacion = async (id) => {
  eliminandoId.value = id;

  try {
    await api.delete(`/api/publicaciones/${id}`);
    $q.notify({ type: "positive", message: "Publicación eliminada correctamente" });
    await cargarPublicaciones();
  } catch (e) {
    console.error(e);
    $q.notify({ type: "negative", message: "Error al eliminar publicación" });
  }

  eliminandoId.value = null;
};

const formatearFecha = (fechaStr) =>
  new Date(fechaStr).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const getEstadoColor = (estado) =>
  ({ aprobada: "green", pendiente: "orange", rechazada: "red" }[estado] || "grey");

</script>

<style scoped>

/* ==============================
   PAGE PREMIUM
============================== */
.page-premium {
  background: #fafafa;
}

.page-title {
  font-weight: 800;
  color: #2ecc71;
}

/* ==============================
   CARD PREMIUM
============================== */
.card-premium {
  border-radius: 16px !important;
  overflow: hidden;
  border: 1px solid #eaeaea;
  box-shadow: 0 4px 14px rgba(0,0,0,0.07);
  transition: 0.25s ease;
}

.card-premium:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 22px rgba(0,0,0,0.12);
}

/* Imagen */
.producto-img {
  height: 220px;
  border-radius: 14px;
}

/* Título */
.producto-titulo {
  font-weight: 700;
  color: #333;
}

/* Precio */
.producto-precio {
  color: #2ecc71;
  font-weight: 800;
}

/* Estado */
.estado-badge {
  font-weight: 600;
  padding: 4px 10px;
}

/* Fecha */
.producto-fecha {
  margin-top: 6px;
  font-size: 0.75rem;
  color: #777;
}

/* Acciones */
.acciones-premium {
  padding-bottom: 12px;
}

.btn-accion {
  font-weight: 600;
  border-radius: 10px;
}

.opacity-50 {
  opacity: 0.4;
  pointer-events: none;
}

.rounded-borders {
  border-radius: 12px;
}
</style>
