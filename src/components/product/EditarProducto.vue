<template>
  <q-page class="q-pa-md editar-page">

    <q-card class="editar-card q-pa-xl shadow-3">

      <!-- TÍTULO -->
      <h4 class="titulo-premium text-center q-mb-lg">
        Editar Publicación
      </h4>

      <!-- LOADING -->
      <div v-if="loading" class="text-center q-my-xl">
        <q-spinner size="40px" color="primary" />
      </div>

      <div v-else>

        <!-- TÍTULO -->
        <q-input
          outlined
          v-model="form.titulo"
          label="Título"
          class="input-premium q-mb-md"
        />

        <!-- DESCRIPCIÓN -->
        <q-input
          outlined
          type="textarea"
          v-model="form.descripcion"
          label="Descripción"
          class="input-premium q-mb-md"
          autogrow
        />

        <!-- PRECIO -->
        <q-input
          outlined
          v-model.number="form.precio"
          label="Precio"
          type="number"
          prefix="S/."
          class="input-premium q-mb-md"
        />

        <!-- CATEGORÍA -->
        <q-select
          outlined
          v-model="form.idCategoria"
          :options="categorias"
          option-value="idCategoria"
          option-label="nombre"
          emit-value
          map-options
          label="Categoría"
          class="input-premium q-mb-lg"
        />

        <!-- IMÁGENES ACTUALES -->
        <div class="q-mb-lg">
          <div class="text-subtitle1 text-primary q-mb-sm">Imágenes actuales</div>

          <div class="row q-col-gutter-sm">
            <div
              v-for="img in form.imagenesActuales"
              :key="img"
              class="col-4"
            >
              <q-img
                :src="serverUrl + img"
                style="height: 100px"
                class="img-actual rounded-borders"
              />
            </div>
          </div>
        </div>

        <!-- NUEVAS IMÁGENES -->
        <q-uploader
          label="Subir nuevas imágenes (opcional)"
          accept=".jpg, .jpeg, .png"
          :max-file-size="5 * 1024 * 1024"
          @added="handleImages"
          :factory="() => null"
          auto-upload="false"
          class="uploader-premium q-mb-sm"
        />

        <!-- BOTÓN GUARDAR -->
        <q-btn
          color="primary"
          label="Guardar Cambios"
          class="btn-guardar full-width q-mt-lg"
          @click="guardar"
        />

        <!-- BOTÓN CANCELAR -->
        <q-btn
          flat
          color="grey"
          label="Cancelar"
          class="full-width q-mt-md"
          @click="router.push('/mis-productos')"
        />

      </div>

    </q-card>

  </q-page>
</template>

<script setup>
/* ✔ NO SE MODIFICÓ NADA DE LA LÓGICA ORIGINAL */
import { ref, onMounted } from "vue";
import { api } from "boot/axios";
import { useRoute, useRouter } from "vue-router";
import { useQuasar } from "quasar";

const route = useRoute();
const router = useRouter();
const $q = useQuasar();

const loading = ref(true);
const categorias = ref([]);

const apiBase = api.defaults.baseURL.replace('/api', '');
const serverUrl = apiBase;

const form = ref({
  titulo: "",
  descripcion: "",
  precio: null,
  idCategoria: null,
  imagenesActuales: [],
  nuevasImagenes: []
});

onMounted(async () => {
  await cargarCategorias();
  await cargarPublicacion();
  loading.value = false;
});

const cargarCategorias = async () => {
  const res = await api.get("/api/categorias");
  categorias.value = res.data;
};

const cargarPublicacion = async () => {
  const res = await api.get(`/api/publicaciones/${route.params.id}`);
  const p = res.data;

  form.value.titulo = p.titulo;
  form.value.descripcion = p.descripcion;
  form.value.precio = p.precio;
  form.value.idCategoria = p.idCategoria;
  form.value.imagenesActuales = p.imagenes;
};

const handleImages = (files) => {
  form.value.nuevasImagenes = files.map(f => f.__file || f);
};

const guardar = async () => {
  try {
    const nuevasRutas = [];

    for (const file of form.value.nuevasImagenes) {
      const fd = new FormData();
      fd.append("file", file);

      const uploadRes = await api.post("/api/publicaciones/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      nuevasRutas.push(uploadRes.data.url);
    }

    const payload = {
      idPublicacion: route.params.id,
      titulo: form.value.titulo,
      descripcion: form.value.descripcion,
      precio: form.value.precio,
      idCategoria: form.value.idCategoria,
      imagenes: nuevasRutas.length > 0 ? nuevasRutas : form.value.imagenesActuales
    };

    await api.put("/api/publicaciones/editar", payload);

    $q.notify({ type: "positive", message: "Publicación actualizada" });
    router.push("/mis-productos");

  } catch (e) {
    console.error(e);
    $q.notify({ type: "negative", message: "Error al guardar" });
  }
};
</script>

<style scoped>

/* =====================================
   PAGE BACKGROUND
===================================== */
.editar-page {
  background: #fafafa;
}

/* =====================================
   CARD PREMIUM
===================================== */
.editar-card {
  max-width: 700px;
  margin: auto;
  border-radius: 18px;
  border: 1px solid #e9e9e9;
  background: white;
  transition: 0.25s ease;
}

.editar-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.12);
}

/* =====================================
   TÍTULO PREMIUM
===================================== */
.titulo-premium {
  font-weight: 800;
  color: #2F5E4E;
  letter-spacing: 0.5px;
}

/* =====================================
   INPUT STYLE PREMIUM
===================================== */
.input-premium :deep(.q-field__control) {
  border-radius: 12px !important;
}

.input-premium :deep(.q-field__native) {
  font-size: 15px;
}

/* =====================================
   Uploader Premium
===================================== */
.uploader-premium {
  border: 2px dashed #2F5E4E;
  border-radius: 14px;
  padding: 14px;
  background: #f6fff9;
}

/* =====================================
   IMÁGENES ACTUALES
===================================== */
.img-actual {
  border: 1px solid #e0e0e0;
}

/* =====================================
   BOTONES
===================================== */
.btn-guardar {
  background-color: #2F5E4E !important;
  color: white !important;
  font-weight: 700;
  padding: 12px;
  border-radius: 14px;
  font-size: 1.05rem;
}

.btn-guardar:hover {
  background-color: #2F5E4E !important;
}
</style>
