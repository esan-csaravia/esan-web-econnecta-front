<template>
  <q-layout view="lHh Lpr lFf">

    <!-- HEADER -->
    <q-header elevated class="header-premium">
      <q-toolbar>

        <q-btn
          flat
          dense
          round
          icon="menu"
          @click="drawer = !drawer"
          class="menu-btn"
        />

        <q-toolbar-title class="title-app row items-center cursor-pointer" @click="$router.push('/product')">

              <!-- LOGO desde /public/icons -->
              <q-img
                src="/icons/ECO_Conecta_image.png"
                width="40px"
                height="40px"
                class="q-mr-sm header-logo"
              />

              <span>ECOCONECTA</span>

        </q-toolbar-title>

        <!-- USUARIO (derecha) -->
        <div v-if="usuario" class="row items-center q-gutter-sm user-section">

          <!-- Círculo iniciales -->
          <q-avatar class="avatar-user">
            {{ inicialesUsuario }}
          </q-avatar>

          <!-- Nombre + menú -->
          <q-btn
            flat
            no-caps
            class="user-btn"
            :label="usuario?.nombre"
            icon-right="arrow_drop_down"
          >
            <q-menu transition-show="jump-down" transition-hide="jump-up">
              <q-list separator style="min-width: 160px">

                <q-item clickable v-ripple to="/miperfil">
                  <q-item-section avatar>
                    <q-icon name="person" />
                  </q-item-section>
                  <q-item-section>
                    Mi Perfil
                  </q-item-section>
                </q-item>

                <q-item clickable v-ripple @click="logout">
                  <q-item-section avatar>
                    <q-icon name="logout" color="negative"/>
                  </q-item-section>
                  <q-item-section class="text-negative text-bold">
                    Cerrar Sesión
                  </q-item-section>
                </q-item>

              </q-list>
            </q-menu>
          </q-btn>

        </div>

      </q-toolbar>
    </q-header>

    <!-- DRAWER MENU -->
    <q-drawer v-model="drawer" show-if-above bordered class="drawer-premium">

      <!-- Logo + título -->
      <div class="q-pa-md row items-center drawer-header">
        <q-img
          src="/icons/ECO_Conecta_image.png"
          style="width:50px; height:50px"
          class="q-mr-sm logo"
        />
        <div class="text-h6 text-bold drawer-title">
          ECOCONECTA
        </div>
      </div>

      <q-separator />

      <!-- MENÚ -->
      <q-list padding class="menu-list">

        <q-item clickable v-ripple to="/product" class="menu-item">
          <q-item-section avatar><q-icon name="store" /></q-item-section>
          <q-item-section>Marketplace</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/mis-productos" class="menu-item">
          <q-item-section avatar><q-icon name="inventory_2" /></q-item-section>
          <q-item-section>Mis Productos</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/notificaciones" class="menu-item">
          <q-item-section avatar><q-icon name="notifications" /></q-item-section>
          <q-item-section>Notificaciones</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/miperfil" class="menu-item">
          <q-item-section avatar><q-icon name="person" /></q-item-section>
          <q-item-section>Mi Perfil</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/transacciones" class="menu-item">
          <q-item-section avatar><q-icon name="history" /></q-item-section>
          <q-item-section>Transacciones</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/campanas" class="menu-item">
          <q-item-section avatar><q-icon name="campaign" /></q-item-section>
          <q-item-section>Campañas</q-item-section>
        </q-item>

      </q-list>
    </q-drawer>

    <!-- CONTENIDO -->
    <q-page-container class="page-container-premium">
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const drawer = ref(false)
const router = useRouter()

// Obtener usuario (reactivo)
const usuario = ref(JSON.parse(localStorage.getItem("usuario") || "null"))

// Función para actualizar el usuario
const actualizarUsuario = () => {
  usuario.value = JSON.parse(localStorage.getItem("usuario") || "null")
}

// Escuchar el evento de actualización
onMounted(() => {
  window.addEventListener('usuario-actualizado', actualizarUsuario)
})

onUnmounted(() => {
  window.removeEventListener('usuario-actualizado', actualizarUsuario)
})

// Iniciales
const inicialesUsuario = computed(() => {
  if (!usuario.value) return "?"
  const n = usuario.value.nombre?.charAt(0) || "?"
  const a = usuario.value.apellido?.charAt(0) || ""
  return (n + a).toUpperCase()
})

// Logout
const logout = () => {
  localStorage.removeItem("usuario")
  router.push("/login")
}
</script>

<style scoped>

.header-logo {
  border-radius: 8px;
  object-fit: contain;
  filter: none;
}


/* ===============================
   HEADER PREMIUM
================================ */
.header-premium {
  background: #ffffff;
  border-bottom: 1px solid #e8e8e8;
  box-shadow: 0 2px 10px rgba(0,0,0,0.07);
}

.menu-btn {
  color: #2F5E4E;
}

.title-app {
  font-weight: 800;
  letter-spacing: 1px;
  color: #2F5E4E;
  transition: 0.3s ease;
}

.title-app:hover {
  opacity: 0.8;
  transform: scale(1.02);
}

.user-section {
  padding-right: 8px;
}

.avatar-user {
  background: #2F5E4E !important;
  color: white !important;
  font-weight: bold;
  box-shadow: 0 2px 6px rgba(47,94,78,0.35);
}

.user-btn {
  font-weight: 600;
  color: #333;
}

/* ===============================
   DRAWER PREMIUM
================================ */
.drawer-premium {
  background: #f5f7f4 !important;
  border-right: 1px solid #C2C48A !important;
}

.drawer-header {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(47,94,78,0.2);
}

.drawer-title {
  color: #2F5E4E;
}

.logo {
  border-radius: 8px;
  filter: none;
}

/* ===============================
   MENÚ LATERAL
================================ */
.menu-list {
  padding-top: 6px;
}

.menu-item {
  border-radius: 10px;
  margin-bottom: 6px;
  font-weight: 600;
  color: #2F5E4E;
  transition: 0.25s ease;
}

.menu-item:hover {
  background: #C2C48A;
  color: #2F5E4E;
  transform: translateX(4px);
}

/* Estado activo */
.q-drawer .q-item.q-router-link-active {
  background: #8FAF89 !important;
  color: #2F5E4E !important;
  font-weight: bold;
  box-shadow: 0 2px 6px rgba(47,94,78,0.3);
}

/* ===============================
   CONTENIDO
================================ */
.page-container-premium {
  background: #fafafa;
  padding: 18px;
}

</style>
