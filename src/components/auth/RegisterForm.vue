<template>
  <div class="auth-wrapper">
    <div class="container">

      <!-- Sign Up -->
      <div class="form-container sign-up-container active-panel">
        <form @submit.prevent="register">
          <h2>Crear cuenta</h2>
          <!-- NUEVOS CAMPOS -->
          <input v-model="nombre" type="text" placeholder="Nombre" />
          <input v-model="apellido" type="text" placeholder="Apellido" />
          <input v-model="correo" type="email" placeholder="Correo Electrónico" />
          <input v-model="contrasena" type="password" placeholder="Contraseña" />

          <!-- SELECT DE DISTRITOS -->
          <select v-model="distrito" class="input-select">
            <option disabled value="">Selecciona tu distrito</option>
            <option v-for="d in districts" :key="d" :value="d">{{ d }}</option>
          </select>

          <button type="submit">Registrarse</button>
        </form>
      </div>

      <!-- Left overlay -->
      <div class="overlay-container">
        <div class="overlay">
          <div class="overlay-panel overlay-left">
            <h2>Bienvenido a EcoConecta</h2>
            <p>¿Ya tienes cuenta?</p>
          <button class="ghost" @click="$router.push('/Login')">Iniciar Sesión</button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { api } from 'boot/axios'
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

const $q = useQuasar();
const router = useRouter();

const nombre = ref("");
const apellido = ref("");
const correo = ref("");
const contrasena = ref("");
const distrito = ref("");

// Lista completa de distritos de Lima
const districts = [
  "Ancón", "Ate", "Barranco", "Breña", "Carabayllo", "Chaclacayo", "Chorrillos",
  "Cieneguilla", "Comas", "El Agustino", "Independencia", "Jesús María",
  "La Molina", "La Victoria", "Lince", "Los Olivos", "Lurigancho", "Lurín",
  "Magdalena del Mar", "Miraflores", "Pachacamac", "Pucusana", "Pueblo Libre",
  "Puente Piedra", "Punta Hermosa", "Punta Negra", "Rímac", "San Bartolo",
  "San Borja", "San Isidro", "San Juan de Lurigancho", "San Juan de Miraflores",
  "San Luis", "San Martín de Porres", "San Miguel", "Santa Anita", "Santa María del Mar",
  "Santa Rosa", "Santiago de Surco", "Surquillo", "Villa El Salvador", "Villa María del Triunfo"
];

const register = async () => {
  // Validación: contraseña > 8 caracteres
  if (!contrasena.value || contrasena.value.length <= 8) {
    $q.notify({
      type: "negative",
      position: "top",
      message: "La contraseña debe tener más de 8 caracteres."
    });
    return;
  }

  const payload = {
    nombre: nombre.value,
    apellido: apellido.value,
    correo: correo.value,
    contrasena: contrasena.value,
    distrito: distrito.value,
  };

  try {
  // Usar el cliente API con baseURL configurado en src/boot/axios.js
  const response = await api.post('/api/usuarios/registro', payload);
    console.log('Usuario creado: ', response.data);
    $q.notify({ type: 'positive', position: 'top', message: 'Usuario creado con éxito.' });
    // Redirigir a login
  router.push('/Login');
  } catch (error) {
    console.error('Error al crear usuario:', error);
    const serverMsg = error?.response?.data?.message || 'Error al crear usuario.';
    $q.notify({ type: 'negative', position: 'top', message: serverMsg });
  }
};
</script>

<style scoped>
/* Wrapper */
.auth-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f6f5f7;
}

form h2 {
    margin-top: 0;        /* Reduce o elimina el espacio superior */
    margin-bottom: 10px;  /* Puedes ajustar este valor */
}

/* ========== TU CSS ORIGINAL (NO CAMBIÉ NADA) ========== */

.container {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25),
    0 10px 10px rgba(0, 0, 0, 0.22);
  position: relative;
  overflow: hidden;
  width: 768px;
  max-width: 100%;
  min-height: 480px;
}

.form-container {
  position: absolute;
  top: 0;
  height: 100%;
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.active-panel {
  left: 0;
  z-index: 2;
}

form {
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  padding: 0 50px;
  height: 100%;
  justify-content: center;
  align-items: center;
  text-align: center;
}

input, select {
  background-color: #eee;
  border: none;
  padding: 12px 15px;
  margin: 8px 0;
  width: 100%;
  font-size: 14px;
}

button {
  border-radius: 20px;
  border: 1px solid #2ecc71;
  background-color: #2ecc71;
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: transform 80ms ease-in;
  cursor: pointer;
}

button.ghost {
  background-color: transparent;
  border-color: #ffffff;
}

.overlay-container {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  z-index: 100;
}

.overlay {
  background: linear-gradient(to right, #2ecc71, #2ecc71);
  background-repeat: no-repeat;
  background-size: cover;
  color: #ffffff;
  position: relative;
  height: 100%;
  width: 200%;
  transform: translateX(0);
}

.overlay-panel {
  position: absolute;
  display: flex;
  flex-direction: column;
  padding: 0 40px;
  justify-content: center;
  align-items: center;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;
  left: 0;
}
</style>
