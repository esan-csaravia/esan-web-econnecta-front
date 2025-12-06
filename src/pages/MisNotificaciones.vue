<template>
  <q-page class="q-pa-md notif-page">

    <!-- TÍTULO -->
    <div class="text-h5 notif-title q-mb-md">Notificaciones</div>

    <!-- LOADING -->
    <div v-if="loading" class="flex flex-center q-my-xl">
      <q-spinner size="40px" color="primary" />
    </div>

    <!-- SIN NOTIFICACIONES -->
    <div v-else-if="notificaciones.length === 0" class="text-grey text-center q-mt-xl">
      No tienes notificaciones por ahora.
    </div>

    <!-- LISTA -->
    <q-list
      v-else
      bordered
      padding
      separator
      class="notif-list shadow-3"
    >

      <q-item
        v-for="noti in notificaciones"
        :key="noti.idNotificacion"
        clickable
        v-ripple
        @click="verDetalle(noti)"
        class="notif-item"
        :class="{ 'notif-unread': !noti.leido }"
      >

        <!-- ÍCONO -->
        <q-item-section avatar>
          <q-avatar rounded size="50px" class="notif-avatar" :style="`background:${colorTipo(noti.tipo)}`">
            <q-icon :name="iconoTipo(noti.tipo)" size="25px" />
          </q-avatar>
        </q-item-section>

        <!-- CONTENIDO -->
        <q-item-section>
          <q-item-label class="notif-message">
            {{ noti.mensaje }}
          </q-item-label>

          <q-item-label caption class="notif-sub">
            {{ noti.publicacionTitulo }}
          </q-item-label>

          <q-item-label caption class="notif-date">
            {{ formatearFecha(noti.fecha) }}
          </q-item-label>
        </q-item-section>

        <!-- IMAGEN -->
        <q-item-section side>
          <q-avatar square size="52px" class="notif-img">
            <img :src="apiBase + noti.imagen" />
          </q-avatar>

          <!-- NUEVO -->
          <q-badge
            v-if="!noti.leido"
            color="blue"
            label="Nuevo"
            class="notif-new q-mt-xs"
          />
        </q-item-section>

      </q-item>

    </q-list>

  </q-page>
</template>

<script setup>
/* NO SE MODIFICÓ NADA DE LA LÓGICA */
import { ref, onMounted } from "vue";
import { api } from "boot/axios";
import { useRouter } from "vue-router";

const router = useRouter();
const notificaciones = ref([]);
const loading = ref(true);

const apiBase = api.defaults.baseURL.replace("/api", "");
const usuario = JSON.parse(localStorage.getItem("usuario") || "null");

const cargarNotificaciones = async () => {
  if (!usuario) return;

  try {
    const res = await api.get(`/api/notificaciones/usuario/${usuario.idUsuario}`);
    notificaciones.value = res.data;
  } catch (err) {
    console.error("Error cargando notificaciones:", err);
  }

  loading.value = false;
};

onMounted(() => cargarNotificaciones());

const iconoTipo = (tipo) =>
  ({
    compra: "shopping_cart",
    venta: "local_shipping",
    interes: "visibility",
    calificacion: "grade",
    comentario: "chat",
    sistema: "info"
  }[tipo] || "notifications");

const colorTipo = (tipo) =>
  ({
    compra: "#2F5E4E",
    venta: "#e67e22",
    interes: "#3498db",
    calificacion: "#f1c40f",
    comentario: "#8e44ad",
    sistema: "#7f8c8d"
  }[tipo] || "#7f8c8d");

const formatearFecha = (f) =>
  new Date(f).toLocaleString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const verDetalle = (noti) => {
  noti.leido = true;
  router.push(`/producto/${noti.idPublicacion}`);
};
</script>

<style scoped>

/* ======== PAGE ======== */
.notif-page {
  background: #fafafa;
}

.notif-title {
  font-weight: 800;
  color: #2F5E4E;
}

/* ======== LISTA ======== */
.notif-list {
  border-radius: 16px;
  background: white;
  overflow: hidden;
}

/* ======== ITEM ======== */
.notif-item {
  transition: 0.25s ease;
  padding: 14px 12px;
}

.notif-item:hover {
  background: #f2f8f4; /* verde ultra suave */
  transform: translateY(-2px);
}

.notif-unread {
  background: #eef7ff !important;
}

/* ======== AVATAR ======== */
.notif-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border-radius: 14px !important;
  box-shadow: 0 3px 8px rgba(0,0,0,0.15);
}

/* ======== TEXTO ======== */
.notif-message {
  font-weight: 600;
  color: #333;
}

.notif-sub {
  color: #666;
  margin-top: 2px;
}

.notif-date {
  color: #999;
  font-size: 0.75rem;
  margin-top: 2px;
}

/* ======== IMAGEN ======== */
.notif-img img {
  border-radius: 8px;
  object-fit: cover;
}

/* NUEVO */
.notif-new {
  font-size: 0.65rem;
  padding: 3px 8px;
  border-radius: 6px;
}

</style>
