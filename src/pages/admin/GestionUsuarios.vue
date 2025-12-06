<template>
  <q-page padding>

    <!-- ======= TÍTULO ======= -->
    <div class="header-title">Gestión de Usuarios</div>
    <div class="header-sub">Administra usuarios, roles y bloqueos del sistema</div>

    <!-- ======= MÉTRICAS ======= -->
    <div class="row q-col-gutter-md q-mt-lg q-mb-lg">
      <div class="col-xs-12 col-sm-6 col-md-3">
        <div class="metric-box">
          <div class="metric-title">Total Usuarios</div>
          <div class="metric-value">{{ users.length }}</div>
        </div>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-3">
        <div class="metric-box green">
          <div class="metric-title">Activos</div>
          <div class="metric-value">{{ users.filter(u => u.activo).length }}</div>
        </div>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-3">
        <div class="metric-box red">
          <div class="metric-title">Bloqueados</div>
          <div class="metric-value">{{ users.filter(u => !u.activo).length }}</div>
        </div>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-3">
        <div class="metric-box purple">
          <div class="metric-title">Administradores</div>
          <div class="metric-value">{{ users.filter(u => u.rol === 'administrador').length }}</div>
        </div>
      </div>
    </div>

    <!-- ======= LISTA PREMIUM ======= -->
    <div class="user-list">

      <div
        v-for="u in filteredUsers"
        :key="u.idUsuario"
        class="user-item"
      >

        <!-- AVATAR -->
        <div class="user-avatar-box">
          <q-avatar size="60px" color="primary" text-color="white">
            {{ getIniciales(u.nombre) }}
          </q-avatar>
        </div>

        <!-- INFO -->
        <div class="user-info">
          <div class="user-name">{{ u.nombre }} {{ u.apellido }}</div>
          <div class="user-email">{{ u.correo }}</div>

          <div class="user-tags">
            <q-badge :color="u.rol === 'administrador' ? 'purple' : 'green'" class="q-mr-sm">
              {{ u.rol }}
            </q-badge>

            <q-badge :color="u.activo ? 'green' : 'red'">
              {{ u.activo ? 'Activo' : 'Bloqueado' }}
            </q-badge>
          </div>
        </div>

        <!-- ACCIONES -->
        <div class="user-actions">

          <q-btn
            round
            size="md"
            :icon="u.activo ? 'block' : 'lock_open'"
            :color="u.activo ? 'red' : 'green'"
            @click="u.activo ? abrirDialogoBloqueo(u) : desbloquear(u)"
          />

          <q-btn
            round
            size="md"
            icon="history"
            color="primary"
            @click="verHistorial(u.idUsuario)"
          />

        </div>
      </div>

    </div>

    <!-- ======= DIALOGO BLOQUEO ======= -->
    <q-dialog v-model="dialogBloqueo">
      <q-card style="width:420px" class="modal-card">

        <q-card-section class="text-h6 text-bold">
          Motivo del bloqueo
        </q-card-section>

        <q-card-section>
          <q-input
            type="textarea"
            outlined
            autogrow
            v-model="motivoBloqueo"
            label="Escribe el motivo"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn color="red" label="Bloquear" @click="bloquearUsuario" />
        </q-card-actions>

      </q-card>
    </q-dialog>

    <!-- ======= HISTORIAL ======= -->
    <q-dialog v-model="dialogHistorial">
      <q-card style="width:460px" class="modal-card">

        <q-card-section class="text-h6 text-bold">
          Historial de Bloqueos
        </q-card-section>

        <q-card-section>
          <div v-if="historial.length === 0" class="text-grey">Sin registros</div>

          <q-list bordered v-else>
            <q-item v-for="h in historial" :key="h.idBloqueo">
              <q-item-section>
                <div><b>Motivo:</b> {{ h.motivo }}</div>
                <div class="text-caption">Fecha: {{ new Date(h.fecha).toLocaleString() }}</div>
                <div class="text-caption">Admin: {{ h.nombreAdmin }}</div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cerrar" v-close-popup />
        </q-card-actions>

      </q-card>
    </q-dialog>

  </q-page>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";
import { api } from "boot/axios";
import { useQuasar } from "quasar";

const $q = useQuasar();

const users = ref([]);
const motivoBloqueo = ref("");
const dialogBloqueo = ref(false);
const usuarioSeleccionado = ref(null);

const dialogHistorial = ref(false);
const historial = ref([]);

const search = ref("");

const getIniciales = (n) => (n ? n[0].toUpperCase() : "?");

const abrirDialogoBloqueo = (user) => {
  usuarioSeleccionado.value = user;
  motivoBloqueo.value = "";
  dialogBloqueo.value = true;
};

const bloquearUsuario = async () => {
  if (!motivoBloqueo.value.trim()) {
    return $q.notify({ type: "warning", message: "Debe ingresar un motivo" });
  }

  const admin = JSON.parse(localStorage.getItem("usuario"));

  const payload = {
    IdUsuario: usuarioSeleccionado.value.idUsuario,
    IdAdmin: admin.idUsuario,
    Motivo: motivoBloqueo.value,
  };

  try {
    await api.post("/api/BloqueosUsuarios", payload);
    $q.notify({ type: "negative", message: "Usuario bloqueado" });
    dialogBloqueo.value = false;
    cargarUsuarios();
  } catch (error) {
    console.error(error);
    $q.notify({ type: "negative", message: "Error al bloquear" });
  }
};

const verHistorial = async (idUsuario) => {
  const { data } = await api.get(`/api/BloqueosUsuarios/${idUsuario}`);
  historial.value = data;
  dialogHistorial.value = true;
};

const desbloquear = async (user) => {
  await api.put(`/api/usuarios/toggle/${user.idUsuario}`);
  $q.notify({ type: "positive", message: "Usuario activado" });
  cargarUsuarios();
};

const cargarUsuarios = async () => {
  const { data } = await api.get("/api/usuarios");

  let usuariosBase = data.map(u => ({
    ...u,
    activo: u.activo === true || u.activo === 1,
    ultimoMotivo: null,
  }));

  for (let u of usuariosBase) {
    if (!u.activo) {
      const res = await api.get(`/api/BloqueosUsuarios/${u.idUsuario}`);
      if (res.data.length > 0) {
        u.ultimoMotivo = res.data[0].motivo;
      }
    }
  }

  users.value = usuariosBase;
};

onMounted(cargarUsuarios);

const filteredUsers = computed(() => {
  const t = search.value.toLowerCase();
  return users.value.filter(u =>
    (u.nombre.toLowerCase().includes(t) || u.correo.toLowerCase().includes(t))
  );
});
</script>
<style scoped>
.header-title {
  font-size: 32px;
  font-weight: 900;
  color: #2F5E4E;
}

.header-sub {
  font-size: 15px;
  color: #777;
  margin-top: -4px;
}

/* MÉTRICAS */
.metric-box {
  background: #f5f7fa;
  padding: 18px;
  border-radius: 14px;
  text-align: center;
}

.metric-title {
  font-size: 14px;
  color: #555;
}

.metric-value {
  font-size: 30px;
  font-weight: 800;
}

.green { background:#e9f7ef }
.red { background:#fdecea }
.purple { background:#f3e8ff }

/* LISTA DE USUARIOS */
.user-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* FILA PREMIUM */
.user-item {
  display: flex;
  align-items: center;
  background: white;
  padding: 14px;
  border-radius: 14px;
  box-shadow: 0 4px 14px rgba(0,0,0,0.08);
  transition: 0.2s;
}

.user-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 18px rgba(0,0,0,0.12);
}

/* AVATAR */
.user-avatar-box {
  margin-right: 18px;
}

/* INFO */
.user-info {
  flex: 1;
}

.user-name {
  font-size: 18px;
  font-weight: 700;
}

.user-email {
  font-size: 14px;
  color: #777;
}

.user-tags {
  margin-top: 6px;
}

/* ACCIONES */
.user-actions {
  display: flex;
  gap: 12px;
}

/* DIALOGOS */
.modal-card {
  border-radius: 14px;
}
</style>
