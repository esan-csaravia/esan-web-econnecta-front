<template>
  <q-page class="q-pa-md page-premium">

    <!-- LOADING -->
    <div v-if="loading" class="text-center q-mt-xl">
      <q-spinner color="primary" size="40px" />
    </div>

    <!-- CONTENIDO -->
    <div v-else class="row q-col-gutter-xl">

      <!-- ============================
           COLUMNA IZQUIERDA
      ============================= -->
      <div class="col-12 col-md-8">

        <!-- BARRA SUPERIOR -->
        <div class="row items-center q-mb-md top-bar-premium">
          <q-btn
            flat
            round
            icon="arrow_back"
            class="btn-back"
            @click="$router.push('/product')"
          />
          <div class="text-h6 page-title">Detalle del Producto</div>
        </div>

        <!-- CARRUSEL -->
        <q-carousel
          swipeable
          animated
          arrows
          height="380px"
          class="carousel-premium rounded-borders shadow-3"
          v-model="slide"
        >
          <q-carousel-slide
            v-for="(img, i) in producto.imagenes"
            :key="i"
            :name="i"
          >
            <div
              class="full-height full-width bg-cover"
              :style="`background-image: url('${apiBase + img}')`"
            ></div>
          </q-carousel-slide>
        </q-carousel>

        <!-- INFORMACIÓN DEL PRODUCTO -->
        <q-card class="card-premium q-pa-lg q-mt-lg">

          <div class="row justify-between items-start">
            <div class="product-title">{{ producto.titulo }}</div>
            <div class="product-price">S/ {{ producto.precio }}</div>
          </div>

          <div class="q-mt-sm">
            <q-badge color="primary" class="badge-premium">
              {{ producto.categoriaNombre }}
            </q-badge>
            <q-badge color="grey-7" outline>Estado: Aprobado</q-badge>
          </div>

          <div class="q-mt-lg">
            <div class="section-title">Descripción</div>
            <div class="text-body1">{{ producto.descripcion }}</div>
          </div>

          <div class="q-mt-lg text-grey-7 text-caption">
            Publicado: {{ formatearFecha(producto.fechaCreacion) }}
          </div>

        </q-card>

        <!-- ============================
             CALIFICACIONES DEL VENDEDOR
        ============================= -->
        <q-card class="card-premium q-pa-lg q-mt-xl">

          <div class="section-title q-mb-sm">Calificaciones del Vendedor</div>

          <!-- Promedio -->
          <div class="row items-center">
            <q-rating
              v-model="rating.promedio"
              max="5"
              size="32px"
              color="amber"
              readonly
            />

            <div class="q-ml-sm text-caption text-grey">
              {{ rating.promedio.toFixed(1) }} / 5 ({{ rating.total }} opiniones)
            </div>
          </div>

          <q-separator class="q-my-md" />

          <!-- Distribución estrellas -->
          <div
            class="q-mb-md"
            v-for="star in [5, 4, 3, 2, 1]"
            :key="star"
          >
            <div class="row items-center">
              <div class="text-bold label-star">{{ star }} ⭐</div>

              <q-linear-progress
                :value="porcentajeEstrella(star)"
                color="amber"
                size="12px"
                class="col q-mx-sm prog-star"
              />

              <div class="text-grey-7 text-caption count-star">
                {{ conteoEstrellas[star] || 0 }}
              </div>
            </div>
          </div>

          <q-separator class="q-my-md" />

          <!-- Comentarios -->
          <div v-if="comentariosCalificaciones.length === 0" class="text-grey">
            Aún no hay calificaciones.
          </div>

          <div
            v-for="c in comentariosCalificaciones"
            :key="c.idCalificacion"
            class="q-mb-lg"
          >
            <div class="row items-center q-mb-sm">
              <q-rating
                v-model="c.puntuacion"
                max="5"
                size="20px"
                color="amber"
                readonly
              />

              <div class="text-caption text-grey q-ml-sm">
                {{ formatearFecha(c.fecha) }}
              </div>
            </div>

            <div class="comment-text">
              {{ c.comentario || "Sin comentario." }}
            </div>

            <q-separator class="q-my-md" />
          </div>

        </q-card>

        <!-- ============================
             COMENTARIOS DEL PRODUCTO
        ============================= -->
        <q-card class="card-premium q-pa-lg q-mt-xl">

          <div class="section-title q-mb-md">Comentarios y Preguntas</div>

          <div class="row q-mb-md">
            <div class="col-9">
              <q-input filled v-model="nuevoComentario" class="textarea-premium" label="Escribe un comentario..." autogrow />
            </div>

            <div class="col-3 flex flex-center">
              <q-btn
                color="primary"
                label="Publicar"
                icon="send"
                class="full-width btn-primary"
                @click="publicarComentario"
              />
            </div>
          </div>

          <q-separator class="q-my-md" />

          <div v-if="comentarios.length === 0" class="text-grey-7">
            Aún no hay comentarios.
          </div>

          <div
            v-for="c in comentarios"
            :key="c.idComentario"
            class="q-mb-md"
          >
            <div class="text-bold comment-author">{{ c.nombreUsuario }}</div>
            <div>{{ c.comentario }}</div>
            <div class="text-grey-6 text-caption">
              {{ formatearFecha(c.fecha) }}
            </div>

            <q-separator class="q-my-sm" />
          </div>

        </q-card>

      </div>

      <!-- ============================
           COLUMNA DERECHA – VENDEDOR
      ============================= -->
      <div class="col-12 col-md-4">

        <q-card class="card-premium q-pa-lg">

          <!-- Vendedor -->
          <div class="row items-center q-mb-md">
            <q-avatar size="52px" class="avatar-seller">
              {{ iniciales(producto.vendedor.nombre + ' ' + producto.vendedor.apellido) }}
            </q-avatar>

            <div class="q-ml-md">
              <div class="text-h6 seller-name">
                {{ producto.vendedor.nombre }} {{ producto.vendedor.apellido }}
              </div>

              <!-- Rating -->
              <div class="row items-center q-mt-xs">
                <q-rating
                  v-model="rating.promedio"
                  max="5"
                  size="20px"
                  color="amber"
                  readonly
                />
                <div class="text-grey-7 text-caption q-ml-xs">
                  ({{ rating.total }})
                </div>
              </div>

            </div>
          </div>

          <q-separator />

          <!-- Info -->
          <div class="q-mt-md seller-info">

            <div class="row items-center seller-info-item">
              <q-icon name="place" class="icon-info" />
              {{ producto.vendedor.distrito }}
            </div>

            <div class="row items-center seller-info-item">
              <q-icon name="email" class="icon-info" />
              {{ producto.vendedor.correo }}
            </div>

            <div class="row items-center seller-info-item">
              <q-icon name="calendar_month" class="icon-info" />
              Miembro desde {{ formatearFecha(producto.vendedor.fechaRegistro) }}
            </div>

          </div>

          <!-- Botones -->
          <q-btn
            color="green"
            class="full-width q-mt-lg btn-primary"
            icon="shopping_cart"
            label="Comprar Ahora"
            @click="comprarAhora"
          />

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

const slide = ref(0);
const producto = ref(null);
const comentarios = ref([]);
const comentariosCalificaciones = ref([]);

const loading = ref(true);
const nuevoComentario = ref("");

const usuario = JSON.parse(localStorage.getItem("usuario") || "null");

// ⭐ Rating del vendedor
const rating = ref({ promedio: 0, total: 0 });
const conteoEstrellas = ref({});

// CARGA GENERAL
onMounted(async () => {
  await cargarDetalle();
  cargarComentarios();
  await cargarCalificacionesVendedor();
});


// 🔵 COMPRAR
const comprarAhora = async () => {
  if (!usuario) {
    alert("Debes iniciar sesión.");
    return;
  }

  const payload = {
    idPublicacion: producto.value.idPublicacion,
    idComprador: usuario.idUsuario,
    idVendedor: producto.value.vendedor.idUsuario,
    tipo: "compra"
  };

  try {
    const res = await api.post("/api/transacciones", payload);
    router.push(`/compra/${res.data}`);
  } catch (e) {
    console.error("Error al crear transacción:", e);
  }
};


// 🔵 DETALLE PRODUCTO
const cargarDetalle = async () => {
  const res = await api.get(`/api/publicaciones/${route.params.id}`);
  producto.value = res.data;
  loading.value = false;
};


// 🔵 COMENTARIOS DEL PRODUCTO
const cargarComentarios = async () => {
  const res = await api.get(`/api/comentarios/publicacion/${route.params.id}`);
  comentarios.value = res.data;
};


// 🔵 CALIFICACIONES DEL VENDEDOR
const cargarCalificacionesVendedor = async () => {
  try {
    const idVendedor = producto.value.vendedor.idUsuario;

    // promedio + total
    const r1 = await api.get(`/api/calificaciones/vendedor/${idVendedor}`);
    rating.value = r1.data;

    // lista de opiniones
    const r2 = await api.get(`/api/calificaciones/lista/${idVendedor}`);
    comentariosCalificaciones.value = r2.data;

    // conteo por estrellas
    conteoEstrellas.value = contarEstrellas(r2.data);

  } catch (e) {
    console.error("Error cargando rating:", e);
  }
};


// ⭐ Conteo estrellas
const contarEstrellas = (lista) => {
  let conteo = { 1:0, 2:0, 3:0, 4:0, 5:0 };
  lista.forEach(c => {
    conteo[c.puntuacion] = (conteo[c.puntuacion] || 0) + 1;
  });
  return conteo;
};

// ⭐ Porcentaje barra
const porcentajeEstrella = (star) => {
  if (rating.value.total === 0) return 0;
  return (conteoEstrellas.value[star] || 0) / rating.value.total;
};


// UTILIDADES
const iniciales = (nombreCompleto) =>
  nombreCompleto?.split(" ").map(n => n[0]).join("").toUpperCase() || "";

const formatearFecha = (fechaStr) =>
  new Date(fechaStr).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const publicarComentario = async () => {
  if (!nuevoComentario.value.trim()) return;

  const payload = {
    idPublicacion: route.params.id,
    idUsuario: usuario.idUsuario,
    comentario: nuevoComentario.value
  };

  await api.post("/api/comentarios", payload);
  nuevoComentario.value = "";
  cargarComentarios();
};
</script>

<style scoped>
.page-premium {
  background: #fafafa;
}

/* =============================
   TOP BAR
============================= */
.top-bar-premium .page-title {
  color: #2ecc71;
  font-weight: 800;
  letter-spacing: 0.5px;
}

.btn-back {
  color: #2ecc71 !important;
}

/* =============================
   CARRUSEL
============================= */
.carousel-premium {
  border-radius: 16px;
  overflow: hidden;
}

/* =============================
   CARD PREMIUM
============================= */
.card-premium {
  border-radius: 16px;
  border: 1px solid #e7e7e7;
  background: white;
  box-shadow: 0 4px 14px rgba(0,0,0,0.07);
  transition: 0.25s ease;
}

.card-premium:hover {
  box-shadow: 0 6px 22px rgba(0,0,0,0.12);
}

/* =============================
   PRODUCT DETAILS
============================= */
.product-title {
  font-size: 1.45rem;
  font-weight: 800;
  color: #333;
}

.product-price {
  font-size: 1.5rem;
  font-weight: 800;
  color: #2ecc71;
}

.section-title {
  font-weight: 700;
  font-size: 1.1rem;
}

/* BADGE */
.badge-premium {
  background-color: #2ecc71 !important;
}

/* =============================
   SELLER
============================= */
.avatar-seller {
  background: #2ecc71 !important;
  color: white !important;
  font-weight: 700;
  box-shadow: 0 3px 8px rgba(46,204,113,0.35);
}

.seller-name {
  font-weight: 700;
}

.seller-info-item {
  margin-bottom: 8px;
}

.icon-info {
  margin-right: 8px;
  color: #2ecc71;
}

/* =============================
   COMENTARIOS
============================= */
.comment-author {
  font-weight: 700;
}

.comment-text {
  margin-top: 3px;
}

/* TEXTAREA */
.textarea-premium :deep(.q-field__control) {
  border-radius: 10px !important;
}

/* =============================
   BOTONES PREMIUM
============================= */
.btn-primary {
  background-color: #2ecc71 !important;
  color: white !important;
  font-weight: 700;
  border-radius: 10px;
  padding: 9px 0;
}

.btn-primary:hover {
  background-color: #27ae60 !important;
}

.btn-outline {
  border-radius: 10px !important;
  font-weight: 600;
}

.label-star {
  width: 40px;
}

</style>
