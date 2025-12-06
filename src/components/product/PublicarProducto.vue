<template>
  <q-page class="q-pa-md publicar-page">

    <!-- BOTÓN VOLVER FUERA DE LA CARD -->
    <div class="row items-center q-mb-md">
      <q-btn
        round
        icon="arrow_back"
        class="btn-volver"
        @click="$router.back()"
      />
      <span class="text-h6 q-ml-md" style="color: #2F5E4E; font-weight: 600;">Volver</span>
    </div>

    <q-card class="publicar-card q-pa-xl shadow-3">

      <!-- TÍTULO -->
      <h4 class="titulo-premium text-center q-mb-lg">
        Publicar Producto
      </h4>

      <!-- TÍTULO DEL PRODUCTO -->
      <q-input
        outlined
        v-model="form.titulo"
        label="Título del producto"
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
        label="Categoría"
        emit-value
        map-options
        class="input-premium q-mb-md"
      />

      <!-- IMÁGENES -->
      <div class="q-mb-md">
        <div class="text-subtitle2 q-mb-sm">Imágenes del Producto (Máximo 5)</div>

        <!-- Vista previa de imágenes -->
        <div class="row q-col-gutter-sm q-mb-md" v-if="previews.length > 0">
          <div v-for="(preview, index) in previews" :key="index" class="col-auto">
            <div class="preview-container">
              <img :src="preview" class="preview-image" />
              <q-btn
                round
                dense
                icon="close"
                size="sm"
                color="negative"
                class="preview-delete-btn"
                @click="removeImage(index)"
              />
            </div>
          </div>
        </div>

        <!-- Botón para agregar imágenes -->
        <q-btn
          v-if="form.imagenes.length < 5"
          outline
          color="primary"
          icon="add_photo_alternate"
          label="Agregar Imagen"
          class="full-width"
          @click="$refs.fileInput.click()"
        />

        <input
          ref="fileInput"
          type="file"
          accept=".jpg, .jpeg, .png"
          multiple
          style="display: none"
          @change="handleFileSelect"
        />

        <p class="text-caption text-grey q-mt-sm">
          Formatos permitidos: JPG, PNG (máx. 5 MB por imagen) - {{ form.imagenes.length }}/5 imágenes
        </p>
      </div>

      <!-- BOTÓN PUBLICAR -->
      <q-btn
        color="primary"
        label="Publicar"
        class="btn-publicar full-width q-mt-xl"
        @click="publicar"
      />

    </q-card>

  </q-page>
</template>

<script setup>
/* ✔ NO SE MODIFICÓ NADA DE LA LÓGICA */
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { api } from "boot/axios";
import { useRouter } from "vue-router";

const router = useRouter();
const $q = useQuasar();

const usuario = JSON.parse(localStorage.getItem("usuario") || "null");

const categorias = ref([]);
const previews = ref([]);
const fileInput = ref(null);

const form = ref({
  titulo: "",
  descripcion: "",
  precio: null,
  idCategoria: null,
  imagenes: [],
  idUsuario: usuario?.idUsuario || null,
  tipo: "venta",
});

onMounted(async () => {
  try {
    const res = await api.get("/api/categorias");
    categorias.value = res.data;
  } catch (e) {
    console.error("Error al cargar categorías", e);
  }
});

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files);

  // Validar que no exceda 5 imágenes
  const espacioDisponible = 5 - form.value.imagenes.length;
  const archivosAAgregar = files.slice(0, espacioDisponible);

  archivosAAgregar.forEach(file => {
    // Validar tamaño
    if (file.size > 5 * 1024 * 1024) {
      $q.notify({ type: "warning", message: `${file.name} excede 5 MB` });
      return;
    }

    // Agregar archivo
    form.value.imagenes.push(file);

    // Crear preview
    const reader = new FileReader();
    reader.onload = (e) => {
      previews.value.push(e.target.result);
    };
    reader.readAsDataURL(file);
  });

  // Limpiar input
  event.target.value = '';

  if (files.length > espacioDisponible) {
    $q.notify({ type: "info", message: `Solo puedes agregar ${espacioDisponible} imagen(es) más` });
  }
};

const removeImage = (index) => {
  form.value.imagenes.splice(index, 1);
  previews.value.splice(index, 1);
};

const publicar = async () => {
  try {
    if (!usuario || !usuario.idUsuario) {
      $q.notify({ type: "negative", message: "Debes iniciar sesión para publicar." });
      return;
    }

    if (!form.value.titulo || !form.value.descripcion || !form.value.idCategoria) {
      $q.notify({ type: "negative", message: "Completa todos los campos" });
      return;
    }

    if (form.value.imagenes.length === 0) {
      $q.notify({ type: "negative", message: "Sube al menos una imagen" });
      return;
    }

    const rutasFinales = [];

    for (const file of form.value.imagenes) {
      const fd = new FormData();
      fd.append("file", file);

      const uploadRes = await api.post("/api/publicaciones/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      rutasFinales.push(uploadRes.data.url);
    }

    const payload = {
      idUsuario: usuario.idUsuario,
      titulo: form.value.titulo,
      descripcion: form.value.descripcion,
      precio: form.value.precio,
      idCategoria: form.value.idCategoria,
      imagenes: rutasFinales,
      tipo: form.value.tipo
    };

    await api.post("/api/publicaciones", payload);

    $q.notify({
      type: "positive",
      message: "Publicación creada correctamente",
    });

    router.push("/product");

    form.value = {
      titulo: "",
      descripcion: "",
      precio: null,
      idCategoria: null,
      imagenes: [],
      idUsuario: usuario.idUsuario,
      tipo: "venta"
    };

    previews.value = [];

  } catch (error) {
    console.error(error);
    $q.notify({
      type: "negative",
      message: "Error al publicar",
    });
  }
};
</script>

<style scoped>

/* ===============================
   GENERAL PAGE
=============================== */
.publicar-page {
  background: #fafafa;
}

.publicar-card {
  max-width: 700px;
  margin: auto;
  border-radius: 18px;
  border: 1px solid #e9e9e9;
  background: white;
  transition: 0.25s ease;
}

.publicar-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.12);
}

/* ===============================
   TÍTULO
=============================== */
.titulo-premium {
  color: #2F5E4E;
  font-weight: 800;
  letter-spacing: 0.5px;
}

/* ===============================
   BOTÓN VOLVER
=============================== */
.btn-volver {
  background-color: #C2C48A !important;
  color: #2F5E4E !important;
  box-shadow: 0 2px 8px rgba(47,94,78,0.2);
  transition: 0.3s ease;
}

.btn-volver:hover {
  background-color: #8FAF89 !important;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(47,94,78,0.3);
}

/* ===============================
   INPUTS PREMIUM
=============================== */
.input-premium :deep(.q-field__control) {
  border-radius: 12px !important;
}

.input-premium :deep(.q-field__native) {
  font-size: 15px;
}

.uploader-premium {
  border: 2px dashed #2F5E4E;
  border-radius: 14px;
  padding: 14px;
  background: #f6fff9;
}

/* ===============================
   PREVIEW DE IMÁGENES
=============================== */
.preview-container {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #e0e0e0;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-delete-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  opacity: 0.9;
}

.preview-delete-btn:hover {
  opacity: 1;
}

/* ===============================
   BOTÓN PUBLICAR
=============================== */
.btn-publicar {
  background-color: #2F5E4E !important;
  color: white !important;
  font-weight: 700;
  padding: 12px;
  border-radius: 14px;
  font-size: 1.1rem;
}

.btn-publicar:hover {
  background-color: #2F5E4E !important;
}

</style>
