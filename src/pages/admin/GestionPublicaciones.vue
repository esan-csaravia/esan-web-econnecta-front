<template>
  <q-page padding class="page-container">

    <!-- TÍTULO -->
    <div class="header-title">Gestión de Publicaciones Pendientes</div>

    <!-- LOADING -->
    <div v-if="loading" class="flex flex-center q-my-xl">
      <q-spinner color="primary" size="40px" />
    </div>

    <!-- SIN PUBLICACIONES -->
    <div v-else-if="publicaciones.length === 0" class="no-data-card">
      No hay publicaciones pendientes por revisar.
    </div>

    <!-- LISTA ESTILIZADA -->
    <div v-else class="pub-list">
      <div
        v-for="p in publicaciones"
        :key="p.idPublicacion"
        class="pub-item"
      >
        <!-- IMAGEN -->
        <div class="pub-img">
          <q-img
            :src="apiBase + p.imagenes[0]"
            spinner-color="primary"
            class="img"
          />
        </div>

        <!-- INFO -->
        <div class="pub-info">
          <div class="pub-title">{{ p.titulo }}</div>
          <div class="pub-user">{{ p.nombreUsuario }}</div>
          <div class="pub-price">S/ {{ p.precio }}</div>
        </div>

        <!-- ACCIONES -->
        <div class="pub-actions">
          <q-btn
            round
            color="positive"
            size="md"
            icon="check"
            @click="aprobar(p.idPublicacion)"
          />
          <q-btn
            round
            color="negative"
            size="md"
            icon="close"
            @click="abrirModalRechazo(p)"
          />
        </div>
      </div>
    </div>

    <!-- MODAL RECHAZO -->
    <q-dialog v-model="modalRechazo" persistent>
      <q-card class="modal-card">

        <q-card-section class="modal-header">
          <div class="text-h6 text-bold">Motivo del rechazo</div>
          <div class="modal-sub">
            Indica por qué la publicación no será aprobada.
          </div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="motivoRechazo"
            type="textarea"
            autogrow
            outlined
            label="Motivo"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn color="negative" label="Rechazar" @click="rechazarPublicacion" />
        </q-card-actions>

      </q-card>
    </q-dialog>

  </q-page>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { api } from "boot/axios";
import { useQuasar } from "quasar";

const $q = useQuasar();

const publicaciones = ref([]);
const loading = ref(true);
const modalRechazo = ref(false);
const motivoRechazo = ref("");
const publicacionSeleccionada = ref(null);

const apiBase = api.defaults.baseURL.replace("/api", "");

const cargarPendientes = async () => {
  try {
    const res = await api.get("/api/publicaciones/pendientes");
    publicaciones.value = res.data;
  } catch (err) {
    console.error(err);
  }
  loading.value = false;
};

onMounted(() => cargarPendientes());

const aprobar = async (id) => {
  try {
    await api.put("/api/publicaciones/estado", {
      idPublicacion: id,
      estadoPublicacion: "aprobada",
    });

    publicaciones.value = publicaciones.value.filter((p) => p.idPublicacion !== id);
    $q.notify({ type: "positive", message: "Publicación aprobada" });
  } catch {
    $q.notify({ type: "negative", message: "Error al aprobar" });
  }
};

const abrirModalRechazo = (pub) => {
  publicacionSeleccionada.value = pub;
  motivoRechazo.value = "";
  modalRechazo.value = true;
};

const rechazarPublicacion = async () => {
  if (!motivoRechazo.value.trim()) {
    return $q.notify({ type: "warning", message: "Indica un motivo" });
  }

  try {
    await api.put("/api/publicaciones/estado", {
      idPublicacion: publicacionSeleccionada.value.idPublicacion,
      estadoPublicacion: "rechazada",
      motivoRechazo: motivoRechazo.value,
    });

    publicaciones.value = publicaciones.value.filter(
      (p) => p.idPublicacion !== publicacionSeleccionada.value.idPublicacion
    );

    modalRechazo.value = false;
    $q.notify({ type: "negative", message: "Publicación rechazada" });
  } catch {
    $q.notify({ type: "negative", message: "Error al rechazar" });
  }
};
</script>
<style scoped>
.header-title {
  font-size: 32px;
  font-weight: 900;
  color: #2ecc71;
  margin-bottom: 20px;
}

/* LISTA TIPO MARKETPLACE */
.pub-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.pub-item {
  display: flex;
  background: white;
  border-radius: 14px;
  padding: 14px;
  box-shadow: 0 4px 14px rgba(0,0,0,0.08);
  align-items: center;
  transition: 0.2s;
}

.pub-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.12);
}

/* IMAGEN */
.pub-img .img {
  width: 95px;
  height: 95px;
  border-radius: 12px;
  object-fit: cover;
}

/* INFO */
.pub-info {
  flex: 1;
  margin-left: 18px;
}

.pub-title {
  font-size: 18px;
  font-weight: 700;
}

.pub-user {
  font-size: 14px;
  color: #777;
  margin: 4px 0;
}

.pub-price {
  font-size: 18px;
  font-weight: 800;
  color: #2ecc71;
}

/* ACCIONES */
.pub-actions {
  display: flex;
  gap: 12px;
}

.modal-card {
  width: 420px;
  border-radius: 14px;
}

.modal-header {
  background: #f5f7fa;
  padding: 18px;
}
</style>
