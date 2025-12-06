<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <q-page padding class="campanas-page">

    <!-- Encabezado elegante -->
    <div class="row items-center justify-between q-mb-lg header-container">
      <div>
        <h4 class="title">Gestión de Campañas</h4>
        <div class="subtitle">Administra las campañas activas y publicadas en la plataforma</div>
      </div>

      <q-btn
        color="primary"
        icon="add"
        label="Nueva Campaña"
        class="btn-crear"
        @click="abrirModalCrear"
      />
    </div>

    <!-- Tabla envuelta en tarjeta elegante -->
    <q-card flat bordered class="tabla-card">
      <q-card-section class="text-h6 q-pb-none">
        Campañas Registradas
      </q-card-section>

      <q-separator />

      <q-table
        :rows="campanas"
        :columns="columns"
        row-key="idCampana"
        flat
        bordered
        dense
        class="tabla"
      >

        <!-- TÍTULO -->
        <template #body-cell-titulo="props">
          <q-td>
            <div class="ellipsis-col" :title="props.row.titulo">
              {{ props.row.titulo }}
            </div>
          </q-td>
        </template>

        <!-- DESCRIPCIÓN -->
        <template #body-cell-descripcion="props">
          <q-td>
            <div class="ellipsis-col descripcion-col" :title="props.row.descripcion">
              {{ props.row.descripcion }}
            </div>
          </q-td>
        </template>

        <!-- Imagen -->
        <template #body-cell-imagen="props">
          <q-td>
            <img
              v-if="props.row.imagen"
              :src="apiBase + props.row.imagen"
              class="img-campana"
            />
          </q-td>
        </template>

        <!-- Acciones -->
        <template #body-cell-acciones="props">
          <q-td class="text-center">

            <q-btn
              color="primary"
              flat
              dense
              round
              icon="edit"
              class="q-mx-xs"
              @click="abrirModalEditar(props.row)"
            />

            <q-btn
              color="negative"
              flat
              dense
              round
              icon="delete"
              class="q-mx-xs"
              @click="eliminarCampana(props.row.idCampana)"
            />

          </q-td>
        </template>

      </q-table>
    </q-card>


    <!-- ===================== -->
    <!--        MODAL          -->
    <!-- ===================== -->
    <q-dialog v-model="modalForm" persistent>
      <q-card class="modal-card">

        <!-- HEADER FIJO -->
        <q-card-section class="modal-header">
          <div class="text-h6">
            {{ editando ? "Editar Campaña" : "Nueva Campaña" }}
          </div>
        </q-card-section>

        <q-separator />

        <!-- CUERPO SCROLLEABLE -->
        <q-card-section class="modal-body">

          <q-input v-model="form.titulo" label="Título" outlined class="q-mb-md" />

          <q-input
            v-model="form.descripcion"
            type="textarea"
            outlined
            autogrow
            label="Descripción"
            class="q-mb-md"
          />

          <q-input
            v-model="form.fechaCampana"
            type="date"
            outlined
            label="Fecha de campaña"
            class="q-mb-lg"
          />

          <!-- Subir imagen -->
          <div class="upload-container q-mb-lg">
            <q-btn
              color="secondary"
              icon="image"
              label="Subir imagen"
              class="upload-btn"
              @click="selectFile"
            />
            <input
              ref="fileInput"
              type="file"
              hidden
              accept="image/*"
              @change="uploadImage"
            />
          </div>

          <!-- Vista previa -->
          <div v-if="form.imagen" class="preview-container">
            <img :src="apiBase + form.imagen" class="preview-img" />
          </div>

        </q-card-section>

        <!-- FOOTER FIJO -->
        <q-card-actions align="right" class="modal-actions">
          <q-btn flat label="Cancelar" color="warning" v-close-popup />
          <q-btn
            unelevated
            color="primary"
            :label="editando ? 'Guardar cambios' : 'Crear'"
            @click="guardarCampana"
          />
        </q-card-actions>

      </q-card>
    </q-dialog>

  </q-page>
</template>



<script setup>
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { api } from "boot/axios";

const $q = useQuasar();

const apiBase = api.defaults.baseURL;

const campanas = ref([]);
const modalForm = ref(false);
const editando = ref(false);

const form = ref({
  idCampana: 0,
  titulo: "",
  descripcion: "",
  imagen: "",
  fechaCampana: "",
  idAdmin: JSON.parse(localStorage.getItem("usuario")).idUsuario
});

const fileInput = ref(null);

const columns = [
  { name: "titulo", label: "Título", field: "titulo", align: "left", style: "width: 250px;" },
  { name: "descripcion", label: "Descripción", field: "descripcion", align: "left", style: "width: 400px;" },
  { name: "imagen", label: "Imagen", field: "imagen", align: "center" },
  { name: "acciones", label: "Acciones", align: "center" }
];

const obtenerCampanas = async () => {
  const res = await api.get("/api/campanas");
  campanas.value = res.data;
};

const abrirModalCrear = () => {
  editando.value = false;
  form.value = {
    idCampana: 0,
    titulo: "",
    descripcion: "",
    imagen: "",
    fechaCampana: "",
    idAdmin: JSON.parse(localStorage.getItem("usuario")).idUsuario
  };
  modalForm.value = true;
};

const abrirModalEditar = (campana) => {
  editando.value = true;
  form.value = { ...campana };
  modalForm.value = true;
};

const selectFile = () => fileInput.value.click();

const uploadImage = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post("/api/publicaciones/upload", formData);
  form.value.imagen = res.data.url;
};

const guardarCampana = async () => {
  if (editando.value) {
    await api.put("/api/campanas", form.value);
    $q.notify({ type: "positive", message: "Campaña actualizada" });
  } else {
    await api.post("/api/campanas", form.value);
    $q.notify({ type: "positive", message: "Campaña creada" });
  }

  modalForm.value = false;
  obtenerCampanas();
};

const eliminarCampana = async (id) => {
  await api.delete(`/api/campanas/${id}`);
  $q.notify({ type: "negative", message: "Campaña eliminada" });
  obtenerCampanas();
};

onMounted(() => obtenerCampanas());
</script>



<style scoped>
/* ---------------------- */
/* ENCABEZADO */
/* ---------------------- */

.title {
  font-weight: 700;
  color: #2F5E4E !important;
}

.subtitle {
  font-size: 14px;
  color: #666;
  margin-top: -4px;
}

.btn-crear {
  border-radius: 10px;
  padding: 8px 16px;
  background-color: #2F5E4E !important;
  color: white !important;
}

/* ---------------------- */
/* TABLA */
/* ---------------------- */

.tabla-card {
  border-radius: 14px;
  box-shadow: 0 3px 12px rgba(0,0,0,0.08);
}

.ellipsis-col {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: help;
}

.descripcion-col {
  max-width: 400px;
}

.img-campana {
  width: 75px;
  height: 75px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 1px 5px rgba(0,0,0,0.15);
}

/* ---------------------- */
/* MODAL (scrollable body) */
/* ---------------------- */

.modal-card {
  width: 480px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  border-radius: 14px;
}

.modal-header {
  background: #f5f7fa;
  padding: 16px;
}

.modal-body {
  padding: 18px;
  overflow-y: auto !important;
  max-height: 60vh;
}

.upload-btn {
  border-radius: 8px;
}

.preview-container {
  display: flex;
  justify-content: center;
}

.preview-img {
  max-width: 150px;
  border-radius: 10px;
  box-shadow: 0 1px 6px rgba(0,0,0,0.2);
}

.modal-actions {
  padding: 20px;
  border-top: 1px solid #eee;
  background: white;
}
</style>
