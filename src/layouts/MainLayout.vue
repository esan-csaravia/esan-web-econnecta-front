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

        <q-toolbar-title class="title-app row items-center">

              <!-- LOGO desde /public/icons -->
              <q-img
                src="/icons/EcoConectaLogo.png"
                width="32px"
                height="32px"
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
            :label="usuario.nombre"
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
          src="/icons/EcoConectaLogo.png"
          style="width:42px; height:42px"
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const drawer = ref(false)
const router = useRouter()

// Obtener usuario
const usuario = JSON.parse(localStorage.getItem("usuario") || "null")

// Iniciales
const inicialesUsuario = computed(() => {
  if (!usuario) return "?"
  const n = usuario.nombre?.charAt(0) || "?"
  const a = usuario.apellido?.charAt(0) || ""
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
  color: #2ecc71;
}

.title-app {
  font-weight: 800;
  letter-spacing: 1px;
  color: #2ecc71;
}

.user-section {
  padding-right: 8px;
}

.avatar-user {
  background: #2ecc71 !important;
  color: white !important;
  font-weight: bold;
  box-shadow: 0 2px 6px rgba(46,204,113,0.35);
}

.user-btn {
  font-weight: 600;
  color: #333;
}

/* ===============================
   DRAWER PREMIUM
================================ */
.drawer-premium {
  background: #f9f9f9 !important;
  border-right: 1px solid #e5e5e5 !important;
}

.drawer-header {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.drawer-title {
  color: #2ecc71;
}

.logo {
  border-radius: 8px;
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
  color: #333;
  transition: 0.25s ease;
}

.menu-item:hover {
  background: rgba(46, 204, 113, 0.15);
  transform: translateX(4px);
}

/* Estado activo */
.q-drawer .q-item.q-router-link-active {
  background: #e8f8ef !important;
  color: #2ecc71 !important;
  font-weight: bold;
  box-shadow: 0 2px 6px rgba(46,204,113,0.25);
}

/* ===============================
   CONTENIDO
================================ */
.page-container-premium {
  background: #fafafa;
  padding: 18px;
}

</style>
