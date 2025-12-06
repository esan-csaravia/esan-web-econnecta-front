<template>
  <div class="auth-wrapper">
    <div class="container">

      <!-- Sign Up -->
      <div class="form-container sign-up-container active-panel">
        <form @submit.prevent="register">
          <h2>Crear cuenta</h2>

          <input v-model="nombre" type="text" placeholder="Nombre" />
          <input v-model="apellido" type="text" placeholder="Apellido" />
          <input v-model="correo" type="email" placeholder="Correo Electrónico" />
          <input v-model="contrasena" type="password" placeholder="Contraseña" />

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
            <img src="/icons/ECO_Conecta_image.png" alt="ECO Conecta" class="logo-image" />
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

const districts = [
  "Ancon", "Ate", "Barranco", "Brena", "Carabayllo", "Chaclacayo", "Chorrillos",
  "Cieneguilla", "Comas", "El Agustino", "Independencia", "Jesus Maria",
  "La Molina", "La Victoria", "Lince", "Los Olivos", "Lurigancho", "Lurin",
  "Magdalena del Mar", "Miraflores", "Pachacamac", "Pucusana", "Pueblo Libre",
  "Puente Piedra", "Punta Hermosa", "Punta Negra", "Rimac", "San Bartolo",
  "San Borja", "San Isidro", "San Juan de Lurigancho", "San Juan de Miraflores",
  "San Luis", "San Martin de Porres", "San Miguel", "Santa Anita",
  "Santa Maria del Mar", "Santa Rosa", "Santiago de Surco", "Surquillo",
  "Villa El Salvador", "Villa Maria del Triunfo"
];


const register = async () => {
  if (!contrasena.value || contrasena.value.length <= 7) {
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
    const response = await api.post('/api/usuarios/registro', payload);
    console.log('Usuario creado:', response.data);
    $q.notify({ type: 'positive', position: 'top', message: 'Usuario creado con éxito.' });
    router.push('/Login');
  } catch (error) {
    console.error('Error al crear usuario:', error);
    const serverMsg = error?.response?.data?.message || 'Error al crear usuario.';
    $q.notify({ type: 'negative', position: 'top', message: serverMsg });
  }
};
</script>
<style scoped>
/* Fondo */
.auth-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f1f3f4;
}

/* Caja principal */
.container {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 12px 32px rgba(0,0,0,0.15);
  position: relative;
  overflow: hidden;
  width: 768px;
  max-width: 100%;
  min-height: 480px;
}

/* Formulario */
.form-container {
  position: absolute;
  top: 0;
  height: 100%;
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

form {
  display: flex;
  flex-direction: column;
  padding: 0 50px;
  height: 100%;
  justify-content: center;
  align-items: center;
  text-align: center;
}

form h2 {
  margin: 0 0 12px 0;
  color: #2F5E4E;
  font-size: 28px;
  font-weight: 700;
}

/* Inputs modernos */
input,
select {
  background-color: #f3f4f5;
  border: 1px solid #dcdfe1;
  padding: 12px 15px;
  margin: 8px 0;
  width: 100%;
  border-radius: 8px;
  font-size: 14px;
  transition: 0.2s ease;
}

input:focus,
select:focus {
  outline: none;
  border-color: #2F5E4E;
  background: #ffffff;
  box-shadow: 0 0 6px rgba(47, 94, 78, 0.25);
}

/* Botón principal */
button {
  border-radius: 20px;
  border: 1px solid #2F5E4E;
  background-color: #2F5E4E;
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: 0.2s ease;
  margin-top: 5px;
}

button:hover {
  background-color: #8FAF89;
}

/* Overlay */
.overlay-container {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
}

.overlay {
  background: linear-gradient(to right, #2F5E4E, #8FAF89);
  color: #ffffff;
  height: 100%;
  width: 200%;
  position: relative;
}

/* Panel overlay */
.overlay-panel {
  position: absolute;
  display: flex;
  flex-direction: column;
  padding: 0 40px;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100%;
  width: 50%;
}

/* Logo image */
.logo-image {
  max-width: 180px;
  margin-bottom: 20px;
  filter: brightness(0) invert(1);
}

/* Botón ghost */
button.ghost {
  background-color: transparent;
  border: 2px solid #ffffff;
}

button.ghost:hover {
  background: rgba(255,255,255,0.12);
}
</style>
