<template>
  <div class="auth-wrapper">
    <div class="container">

      <!-- Sign In (lado izquierdo) -->
      <div class="form-container sign-in-container active-panel">
        <form @submit.prevent="login">
          <h2>Iniciar Sesión</h2>

          <input v-model="email" type="email" placeholder="Email" />
          <input v-model="password" type="password" placeholder="Password" />

          <a href="#">¿Olvidaste tu contraseña?</a>

          <button type="submit" @click="iniciarSesion">Iniciar Sesión</button>
        </form>
      </div>

      <!-- Panel derecho invitando a registrarse -->
      <div class="overlay-container">
        <div class="overlay">
          <div class="overlay-panel overlay-left">

            <h2>Bienvenido de vuelta</h2>
            <p>¿No tienes cuenta?</p>

            <button class="ghost" @click="$router.push('/register')">
              Crear cuenta nueva
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>


<script setup>
/*
import { ref } from "vue";

const email = ref("");
const password = ref("");

const login = () => {
  console.log("Logging in:", email.value, password.value);
};
*/
</script>

<script>
export default {
    name: "LoginForm",
    data() {
        return {
            email: "",
            password: "",
        };
    },
    methods:{
        iniciarSesion(){
            console.log("El correo es: "+ this.email)
            let endpointURL = "api/usuarios/login"
            let payload = {
                correo: this.email,
                contrasena: this.password
            }
            this.$api.post(endpointURL, payload)
            .then((response)=>{
                console.log("Respuesta del servidor: ", response.data)
                this.$q.notify({
                    type: 'positive',
                    position: 'top',
                    message: 'Inicio de sesión exitoso. ¡Bienvenido!'
                });
                this.$router.push('/product')  
            })
            .catch((error) => {
                console.error("Error al iniciar sesión: ", error);
                this.$q.notify({
                    type: 'negative',
                    position: 'top',
                    message: 'Error al iniciar sesión. Por favor, verifica tus credenciales.'
                });
            });
        }
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

/* ========== COPY CSS FROM CODEPEN (Simplified for Register only) ========== */

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

input {
  background-color: #eee;
  border: none;
  padding: 12px 15px;
  margin: 8px 0;
  width: 100%;
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