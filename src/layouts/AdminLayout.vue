<template>
  <q-layout view="lHh Lpr lFf">

    <!-- HEADER ADMIN -->
    <q-header elevated class="header-premium">
      <q-toolbar>

        <q-btn flat dense round icon="menu" @click="drawer = !drawer" class="menu-btn" />

        <q-toolbar-title class="text-bold title-admin">
          PANEL ADMINISTRADOR
        </q-toolbar-title>

        <!-- Avatar administrador -->
        <q-btn
          flat no-caps
          class="admin-avatar-btn"
          icon-right="arrow_drop_down"
          :label="admin.nombre"
        >
          <q-menu transition-show="jump-down" transition-hide="jump-up">
            <q-list separator style="min-width: 160px">

              <q-item clickable v-ripple @click="logout">
                <q-item-section avatar>
                  <q-icon name="logout" color="negative" />
                </q-item-section>
                <q-item-section class="text-negative text-bold">
                  Cerrar Sesión
                </q-item-section>
              </q-item>

            </q-list>
          </q-menu>
        </q-btn>

      </q-toolbar>
    </q-header>

    <!-- DRAWER ADMIN -->
    <q-drawer v-model="drawer" show-if-above bordered class="drawer-premium">

      <div class="q-pa-md row items-center drawer-header">
        <q-avatar size="48px" color="white" text-color="#2F5E4E" class="avatar-admin">
          AD
        </q-avatar>

        <div class="q-ml-sm text-h6 text-bold" style="color:#2F5E4E">
          Administrador
        </div>
      </div>

      <q-separator />

      <!-- MENÚ ADMIN -->
      <q-list padding class="menu-list">

        <q-item clickable v-ripple to="/admin/publicaciones" class="menu-item">
          <q-item-section avatar>
            <q-icon name="inventory" class="menu-icon" />
          </q-item-section>
          <q-item-section class="menu-text">Gestión Publicaciones</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/admin/campanas" class="menu-item">
          <q-item-section avatar>
            <q-icon name="campaign" class="menu-icon" />
          </q-item-section>
          <q-item-section class="menu-text">Campañas</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/admin/usuarios" class="menu-item">
          <q-item-section avatar>
            <q-icon name="groups" class="menu-icon" />
          </q-item-section>
          <q-item-section class="menu-text">Gestión de Usuarios</q-item-section>
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
import { ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
const drawer = ref(false)

// Obtener usuario
const admin = JSON.parse(localStorage.getItem("usuario") || "null")

// Validar rol ADMIN correctamente
if (!admin || admin.rol?.toLowerCase() !== "administrador") {
  router.push("/login")
}

// LOGOUT
const logout = () => {
  localStorage.removeItem("usuario")
  router.push("/login")
}
</script>

<style scoped>

/* ================================
   HEADER PREMIUM
================================ */
.header-premium {
  background: linear-gradient(90deg, #2F5E4E, #8FAF89);
  box-shadow: 0 2px 8px rgba(0,0,0,0.18);
}

.menu-btn {
  color: white;
}

.title-admin {
  letter-spacing: 1px;
  font-size: 18px;
}

/* ================================
   DRAWER
================================ */
.drawer-premium {
  background: #f7f7f7 !important;
  border-right: 1px solid #e5e5e5;
}

.drawer-header {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.avatar-admin {
  border: 2px solid #2F5E4E;
}

/* ================================
   MENU LATERAL
================================ */
.menu-list {
  padding-top: 4px;
}

.menu-item {
  border-radius: 10px;
  margin-bottom: 6px;
  transition: 0.25s ease;
}

.menu-item:hover {
  background: rgba(47, 94, 78, 0.14);
  transform: translateX(4px);
}

.menu-icon {
  color: #2F5E4E;
}

.menu-text {
  font-weight: 600;
  color: #333;
}

/* ACTIVO */
.q-drawer .q-item.q-router-link-active {
  background: rgba(47, 94, 78, 0.25) !important;
  color: #2F5E4E !important;
  font-weight: bold;
  box-shadow: 0 2px 6px rgba(47, 94, 78, 0.2);
}

/* ================================
   CONTENIDO
================================ */
.page-container-premium {
  background: #fafafa;
  padding: 20px;
}

/* Botones globales en #2F5E4E */
.q-btn.bg-primary, .q-btn.text-primary {
  background-color: #2F5E4E !important;
  color: white !important;
}

</style>
