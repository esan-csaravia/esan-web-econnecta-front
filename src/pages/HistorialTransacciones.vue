<template>
  <q-page class="q-pa-lg trans-page">

    <!-- TÍTULO -->
    <div class="text-h4 titulo-premium q-mb-xs">Historial de Transacciones</div>
    <div class="text-grey-7 q-mb-xl subtitulo-premium">
      Revisa todas tus compras y ventas realizadas en ECOCONECTA
    </div>

    <!-- ======================== -->
    <!--        RESUMEN CARDS     -->
    <!-- ======================== -->
    <div class="row q-col-gutter-md q-mb-xl">

      <!-- Total Compras -->
      <q-card class="col-12 col-md-3 card-resumen shadow-2">
        <div class="resumen-titulo">Total Compras</div>
        <div class="resumen-valor text-blue">S/ {{ totalCompras }}</div>
      </q-card>

      <!-- Total Ventas -->
      <q-card class="col-12 col-md-3 card-resumen shadow-2">
        <div class="resumen-titulo">Total Ventas</div>
        <div class="resumen-valor text-green">S/ {{ totalVentas }}</div>
      </q-card>

      <!-- Cantidad Transacciones -->
      <q-card class="col-12 col-md-3 card-resumen shadow-2">
        <div class="resumen-titulo">Transacciones</div>
        <div class="resumen-valor text-primary">{{ transacciones.length }}</div>
      </q-card>

      <!-- Balance -->
      <q-card class="col-12 col-md-3 card-resumen shadow-2">
        <div class="resumen-titulo">Balance</div>
        <div class="resumen-valor text-teal">S/ {{ balanceTotal }}</div>
      </q-card>

    </div>

    <!-- ======================== -->
    <!--        TABLA             -->
    <!-- ======================== -->
    <q-card class="shadow-3 tabla-premium">
      <div class="q-pa-lg">

        <div class="text-h6 table-title">Transacciones</div>

        <q-table
          :rows="transacciones"
          :columns="columns"
          row-key="idTransaccion"
          flat
          bordered
          class="tabla-estilizada"
          :pagination="{ rowsPerPage: 10 }"
        >

          <!-- CHIP TIPO -->
          <template v-slot:body-cell-tipo="props">
            <q-chip
              :color="props.row.tipo === 'compra' ? 'primary' : 'orange'"
              text-color="white"
              class="chip-tipo"
              dense
            >
              {{ props.row.tipo }}
            </q-chip>
          </template>

        </q-table>

      </div>
    </q-card>

  </q-page>
</template>

<script setup>
/* NO SE MODIFICÓ NADA DE LÓGICA */
import { ref, onMounted, computed } from "vue";
import { api } from "boot/axios";

const localUser = JSON.parse(localStorage.getItem("usuario") || "null");

const transacciones = ref([]);

const columns = [
  { name: "id", label: "ID Transacción", field: "idTransaccion", align: "left" },
  {
    name: "fecha",
    label: "Fecha",
    field: "fecha",
    align: "left",
    format: val => new Date(val).toLocaleDateString("es-PE")
  },
  { name: "producto", label: "Producto", field: "titulo", align: "left" },
  { name: "tipo", label: "Tipo", field: "tipo", align: "left" },
  {
    name: "precio",
    label: "Monto",
    field: "precio",
    align: "left",
    format: v => `S/ ${v}`
  }
];

const cargarHistorial = async () => {
  const res = await api.get(`/api/transacciones/historial/${localUser.idUsuario}`);
  transacciones.value = res.data;
};

onMounted(() => cargarHistorial());

const totalCompras = computed(() =>
  transacciones.value.filter(t => t.tipo === "compra").reduce((acc, t) => acc + t.precio, 0)
);

const totalVentas = computed(() =>
  transacciones.value.filter(t => t.tipo === "venta").reduce((acc, t) => acc + t.precio, 0)
);

const balanceTotal = computed(() =>
  totalVentas.value - totalCompras.value
);
</script>

<style scoped>

/* ==============================
   TITULOS
============================== */
.titulo-premium {
  font-weight: 800;
  color: #2ecc71;
}

.subtitulo-premium {
  font-size: 0.95rem;
}

/* ==============================
   CARDS RESUMEN
============================== */
.card-resumen {
  border-radius: 14px;
  padding: 20px;
  transition: 0.25s ease;
  background: white;
  border: 1px solid #e7e7e7;
}

.card-resumen:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 18px rgba(0,0,0,0.10);
}

.resumen-titulo {
  font-size: 0.9rem;
  color: #666;
}

.resumen-valor {
  margin-top: 6px;
  font-size: 1.4rem;
  font-weight: 700;
}

/* ==============================
   TABLA
============================== */
.tabla-premium {
  border-radius: 16px;
  overflow: hidden;
  background: white;
  border: 1px solid #eaeaea;
}

.table-title {
  font-weight: 700;
  color: #2ecc71;
  margin-bottom: 20px;
}

/* Fondo alternado filas */
.tabla-estilizada tbody tr:nth-child(even) {
  background: #fafafa;
}

.tabla-estilizada tbody tr:hover {
  background: #f0f9f4 !important; /* verde muy suave */
  transition: 0.2s ease;
}

/* CHIP TIPO */
.chip-tipo {
  font-weight: 600;
  text-transform: capitalize;
}

/* Bordes redondeados */
.rounded-borders {
  border-radius: 12px;
}
</style>
