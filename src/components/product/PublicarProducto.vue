<template>
  <q-page class="q-pa-md publicar-page">

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
      <q-uploader
        label="Subir Imagen del Producto"
        accept=".jpg, .jpeg, .png"
        :max-file-size="5 * 1024 * 1024"
        auto-upload="false"
        :factory="() => null"
        @added="handleImages"
        class="uploader-premium q-mb-sm"
      />

      <p class="text-caption text-grey">
        Formatos permitidos: JPG, PNG (máx. 5 MB)
      </p>

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

const handleImages = (files) => {
  form.value.imagenes = files
    .map(f => f.__file || f)
    .filter(f => f instanceof File);
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
