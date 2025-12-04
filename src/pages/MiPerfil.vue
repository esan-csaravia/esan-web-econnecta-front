<template>
  <q-page class="q-pa-lg perfil-page">

    <!-- TITULO -->
    <div class="page-header q-mb-xl">
      <div class="text-h4 page-title">Mi Perfil</div>
      <div class="text-grey-7">Gestiona tu información personal y configura tu cuenta</div>
    </div>

    <div class="row q-col-gutter-xl">

      <!-- ============================== -->
      <!--   TARJETA IZQUIERDA (Perfil)   -->
      <!-- ============================== -->

      <div class="col-12 col-md-4">
        <q-card class="card-premium q-pa-lg">

          <!-- AVATAR -->
          <div class="column items-center q-mb-md">
            <q-avatar size="120px" class="avatar-premium">
              {{ iniciales(usuario.nombre + ' ' + usuario.apellido) }}
            </q-avatar>

            <div class="perfil-nombre text-h6 q-mt-md">
              {{ usuario.nombre }} {{ usuario.apellido }}
            </div>

            <div class="perfil-rating text-subtitle2">
              ⭐ {{ calificacionPromedio }} / 5
              <span class="text-grey-6">({{ totalResenas }} reseñas)</span>
            </div>
          </div>

          <q-separator class="q-my-md" />

          <!-- ESTADISTICAS -->
          <div class="text-subtitle2 text-primary q-mb-md">Estadísticas</div>

          <div class="perfil-stat row justify-between q-mb-sm">
            <span>Productos vendidos</span>
            <span class="valor">{{ estadisticas.vendidos }}</span>
          </div>

          <div class="perfil-stat row justify-between q-mb-sm">
            <span>Productos comprados</span>
            <span class="valor">{{ estadisticas.comprados }}</span>
          </div>

          <div class="perfil-stat row justify-between">
            <span>Años como miembro</span>
            <span class="valor">{{ anosMiembro }}</span>
          </div>

        </q-card>
      </div>

      <!-- ============================== -->
      <!--   TARJETA DERECHA (Datos)      -->
      <!-- ============================== -->

      <div class="col-12 col-md-8">
        <q-card class="card-premium q-pa-lg">

          <!-- HEADER -->
          <div class="row justify-between items-center q-mb-lg">
            <div class="text-h6">Información del Usuario</div>

            <div class="row q-gutter-sm">
              <q-btn
                color="green"
                icon="edit"
                label="Editar Perfil"
                class="btn-primary"
                @click="abrirEditar"
              />
              <q-btn
                color="primary"
                icon="lock"
                label="Cambiar Contraseña"
                class="btn-outline-premium"
                @click="abrirPassword"
              />
            </div>
          </div>

          <div class="text-subtitle1 q-mb-md">Datos de Contacto</div>

          <div class="info-item row q-mb-sm">
            <q-icon name="email" class="info-icon" />
            {{ usuario.correo }}
          </div>

          <div class="info-item row q-mb-sm">
            <q-icon name="place" class="info-icon" />
            {{ usuario.distrito }}
          </div>

          <div class="info-item row q-mb-sm">
            <q-icon name="calendar_month" class="info-icon" />
            Miembro desde {{ formatearFecha(fechaRegistroUsuario) }}
          </div>

        </q-card>
      </div>

    </div>

    <!-- ============================== -->
    <!--   MODAL EDITAR PERFIL         -->
    <!-- ============================== -->

    <q-dialog v-model="dialogEditar">
      <q-card class="dialog-premium">

        <div class="dialog-title text-h6 q-mb-md">Editar Perfil</div>

        <q-input filled v-model="form.nombre" label="Nombre" class="input-premium q-mb-md" />
        <q-input filled v-model="form.apellido" label="Apellido" class="input-premium q-mb-md" />

        <q-select
          filled
          v-model="form.distrito"
          :options="distritos"
          label="Distrito"
          emit-value
          map-options
          class="input-premium q-mb-md"
        />

        <div class="row justify-end q-gutter-sm q-mt-md">
          <q-btn flat label="Cancelar" @click="dialogEditar = false" />
          <q-btn color="green" label="Guardar" class="btn-primary" @click="guardarCambios" />
        </div>

      </q-card>
    </q-dialog>

    <!-- ============================== -->
    <!--   MODAL CAMBIAR PASSWORD      -->
    <!-- ============================== -->

    <q-dialog v-model="dialogPassword">
      <q-card class="dialog-premium">

        <div class="dialog-title text-h6 q-mb-md">Cambiar Contraseña</div>

        <q-input
          filled v-model="pwd.actual"
          :type="showPwd.actual ? 'text' : 'password'"
          label="Contraseña actual"
          class="input-premium q-mb-md"
        >
          <template #append>
            <q-icon
              :name="showPwd.actual ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="showPwd.actual = !showPwd.actual"
            />
          </template>
        </q-input>

        <q-input
          filled v-model="pwd.nueva"
          :type="showPwd.nueva ? 'text' : 'password'"
          label="Nueva contraseña"
          class="input-premium q-mb-md"
        >
          <template #append>
            <q-icon
              :name="showPwd.nueva ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="showPwd.nueva = !showPwd.nueva"
            />
          </template>
        </q-input>

        <q-input
          filled v-model="pwd.confirmar"
          :type="showPwd.confirmar ? 'text' : 'password'"
          label="Confirmar nueva contraseña"
          class="input-premium q-mb-md"
        >
          <template #append>
            <q-icon
              :name="showPwd.confirmar ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="showPwd.confirmar = !showPwd.confirmar"
            />
          </template>
        </q-input>

        <div class="row justify-end q-gutter-sm q-mt-md">
          <q-btn flat label="Cancelar" @click="dialogPassword = false" />
          <q-btn color="primary" label="Guardar" class="btn-primary" @click="guardarPassword" />
        </div>

      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useQuasar } from "quasar";
import { api } from "boot/axios";

const $q = useQuasar();

const localUser = JSON.parse(localStorage.getItem("usuario") || "null");

const usuario = ref({});
const estadisticas = ref({ vendidos: 0, comprados: 0 });
const calificacionPromedio = ref(0);
const totalResenas = ref(0);

const distritos = ref([
  { label: "Ancon", value: "Ancon" },
  { label: "Ate", value: "Ate" },
  { label: "Barranco", value: "Barranco" },
  { label: "Brena", value: "Brena" },
  { label: "Carabayllo", value: "Carabayllo" },
  { label: "Cercado de Lima", value: "Cercado de Lima" },
  { label: "Chaclacayo", value: "Chaclacayo" },
  { label: "Chorrillos", value: "Chorrillos" },
  { label: "Cieneguilla", value: "Cieneguilla" },
  { label: "Comas", value: "Comas" },
  { label: "El Agustino", value: "El Agustino" },
  { label: "Independencia", value: "Independencia" },
  { label: "Jesus Maria", value: "Jesus Maria" },
  { label: "La Molina", value: "La Molina" },
  { label: "La Victoria", value: "La Victoria" },
  { label: "Lince", value: "Lince" },
  { label: "Los Olivos", value: "Los Olivos" },
  { label: "Lurigancho", value: "Lurigancho" },
  { label: "Lurin", value: "Lurin" },
  { label: "Magdalena del Mar", value: "Magdalena del Mar" },
  { label: "Pueblo Libre", value: "Pueblo Libre" },
  { label: "Miraflores", value: "Miraflores" },
  { label: "Pachacamac", value: "Pachacamac" },
  { label: "Pucusana", value: "Pucusana" },
  { label: "Puente Piedra", value: "Puente Piedra" },
  { label: "Punta Hermosa", value: "Punta Hermosa" },
  { label: "Punta Negra", value: "Punta Negra" },
  { label: "Rimac", value: "Rimac" },
  { label: "San Bartolo", value: "San Bartolo" },
  { label: "San Borja", value: "San Borja" },
  { label: "San Isidro", value: "San Isidro" },
  { label: "San Juan de Lurigancho", value: "San Juan de Lurigancho" },
  { label: "San Juan de Miraflores", value: "San Juan de Miraflores" },
  { label: "San Luis", value: "San Luis" },
  { label: "San Martin de Porres", value: "San Martin de Porres" },
  { label: "San Miguel", value: "San Miguel" },
  { label: "Santa Anita", value: "Santa Anita" },
  { label: "Santa Maria del Mar", value: "Santa Maria del Mar" },
  { label: "Santa Rosa", value: "Santa Rosa" },
  { label: "Santiago de Surco", value: "Santiago de Surco" },
  { label: "Surquillo", value: "Surquillo" },
  { label: "Villa El Salvador", value: "Villa El Salvador" },
  { label: "Villa Maria del Triunfo", value: "Villa Maria del Triunfo" }
]);

const dialogEditar = ref(false);
const dialogPassword = ref(false);

// FORM EDITAR PERFIL
const form = ref({
  nombre: "",
  apellido: "",
  distrito: ""
});

// FORM CAMBIO PASSWORD
const pwd = ref({
  actual: "",
  nueva: "",
  confirmar: ""
});

const showPwd = ref({
  actual: false,
  nueva: false,
  confirmar: false
});

onMounted(() => {
  cargarUsuario();
  cargarEstadisticas();
  cargarCalificacion();
});

// CARGAR PERFIL
const cargarUsuario = async () => {
  const res = await api.get(`/api/usuarios/${localUser.idUsuario}/profile`);

  usuario.value = {
    ...res.data,
    nombre: res.data.Nombre ?? res.data.nombre,
    apellido: res.data.Apellido ?? res.data.apellido,
    correo: res.data.Correo ?? res.data.correo,
    distrito: res.data.Distrito ?? res.data.distrito,
    fechaRegistro: res.data.FechaRegistro ?? res.data.fechaRegistro
  };

  form.value = {
    nombre: usuario.value.nombre,
    apellido: usuario.value.apellido,
    distrito: usuario.value.distrito
  };
};

// ESTADÍSTICAS
const cargarEstadisticas = async () => {
  const res = await api.get(`/api/usuarios/${localUser.idUsuario}/estadisticas`);
  estadisticas.value = res.data;
};

// CALIFICACIONES
const cargarCalificacion = async () => {
  try {
    const res = await api.get(`/api/calificaciones/vendedor/${localUser.idUsuario}`);
    const data = res.data || {};
    calificacionPromedio.value = Number(data.promedio ?? data.Promedio ?? 0).toFixed(1);
    totalResenas.value = data.total ?? data.Total ?? 0;
  } catch {
    calificacionPromedio.value = 0;
    totalResenas.value = 0;
  }
};

// ABRIR MODALES
const abrirEditar = () => (dialogEditar.value = true);
const abrirPassword = () => (dialogPassword.value = true);

// VALIDAR CONTRASEÑA
const validarPassword = (p) => {
  return p.length >= 8 && /[A-Z]/.test(p) && /\d/.test(p);
};

// GUARDAR CONTRASEÑA NUEVA
const guardarPassword = async () => {
  if (!pwd.value.actual || !pwd.value.nueva || !pwd.value.confirmar) {
    return $q.notify({ type: "warning", message: "Complete todos los campos." });
  }

  if (!validarPassword(pwd.value.nueva)) {
    return $q.notify({
      type: "negative",
      message: "La nueva contraseña debe tener mayúscula, número y mínimo 8 caracteres."
    });
  }

  if (pwd.value.nueva !== pwd.value.confirmar) {
    return $q.notify({
      type: "negative",
      message: "Las contraseñas no coinciden."
    });
  }

  try {
    await api.put(`/api/usuarios/${localUser.idUsuario}/cambiar-password`, {
      passwordActual: pwd.value.actual,
      nuevaPassword: pwd.value.nueva
    });

    $q.notify({ type: "positive", message: "Contraseña actualizada correctamente." });

    dialogPassword.value = false;
    pwd.value = { actual: "", nueva: "", confirmar: "" };
  } catch (e) {
    $q.notify({
      type: "negative",
      message: e.response?.data ?? "Error al cambiar contraseña"
    });
  }
};

// GUARDAR EDITAR PERFIL
const guardarCambios = async () => {
  try {
    await api.put(`/api/usuarios/${localUser.idUsuario}`, {
      nombre: form.value.nombre,
      apellido: form.value.apellido,
      distrito: form.value.distrito,
      correo: usuario.value.correo
    });

    dialogEditar.value = false;
    cargarUsuario();
    $q.notify({ type: "positive", message: "Perfil actualizado correctamente." });
  } catch {
    $q.notify({ type: "negative", message: "Error al guardar cambios." });
  }
};

// HELPERS
const iniciales = (str) =>
  str?.split(" ").map((n) => n[0]).join("").toUpperCase() || "";

const fechaRegistroUsuario = computed(
  () => usuario.value.fechaRegistro ?? usuario.value.FechaRegistro ?? null
);

const formatearFecha = (f) => {
  if (!f) return "";
  const fecha = new Date(f);
  return isNaN(fecha)
    ? ""
    : fecha.toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      });
};

const anosMiembro = computed(() => {
  const f = fechaRegistroUsuario.value;
  if (!f) return 0;
  const fecha = new Date(f);
  return Math.max(0, new Date().getFullYear() - fecha.getFullYear());
});
</script>

<style scoped>

.page-header {
  margin-bottom: 30px;
}

.page-title {
  font-weight: 800;
  color: #2ecc71;
  letter-spacing: 0.5px;
}

/* ========================== */
/*   CARD PREMIUM             */
/* ========================== */

.card-premium {
  border-radius: 16px;
  border: 1px solid #e8e8e8;
  background: white;
  box-shadow: 0 4px 14px rgba(0,0,0,0.08);
  transition: 0.25s ease;
}

.card-premium:hover {
  box-shadow: 0 7px 22px rgba(0,0,0,0.12);
}

/* ========================== */
/*   AVATAR                   */
/* ========================== */

.avatar-premium {
  background: #2ecc71 !important;
  color: white;
  font-size: 38px;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(46,204,113,0.35);
}

/* ========================== */
/*   PERFIL TEXT STYLES       */
/* ========================== */

.perfil-nombre {
  font-weight: 700;
}

.perfil-rating {
  color: #2ecc71;
  font-weight: 600;
}

/* ========================== */
/*   ESTADÍSTICAS             */
/* ========================== */

.perfil-stat .valor {
  font-weight: 700;
  color: #2ecc71;
}

/* ========================== */
/*   INFO USER                */
/* ========================== */

.info-item {
  font-size: 1rem;
  color: #555;
}

.info-icon {
  margin-right: 8px;
  color: #2ecc71;
}

/* ========================== */
/*   BOTONES                  */
/* ========================== */

.btn-primary {
  background-color: #2ecc71 !important;
  color: white !important;
  font-weight: 700;
  border-radius: 10px;
}

.btn-primary:hover {
  background-color: #27ae60 !important;
}

.btn-outline-premium {
  border-radius: 10px !important;
  font-weight: 600;
}

/* ========================== */
/*   MODALES – FIX ESPACIADO  */
/* ========================== */

.dialog-premium {
  width: 420px;
  border-radius: 16px;
  padding: 24px !important;     /* ⭐ ESTA ES LA SOLUCIÓN */
  box-shadow: 0 6px 24px rgba(0,0,0,0.15);
}

.dialog-title {
  font-weight: 700;
  color: #333;
  margin-bottom: 20px; /* separación del primer input */
}

/* Inputs más separados */
.input-premium {
  margin-bottom: 18px;
}

/* Redondeado bonito en los inputs */
.input-premium :deep(.q-field__control) {
  border-radius: 10px !important;
}

</style>

