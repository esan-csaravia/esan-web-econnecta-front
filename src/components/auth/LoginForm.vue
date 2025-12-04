<template>
  <div class="auth-wrapper">
    <div class="container">

      <!-- Sign In -->
      <div class="form-container sign-in-container active-panel">
        <form @submit.prevent="login">
          <h2>Iniciar Sesión</h2>

          <input v-model="email" type="email" placeholder="Email" />
          <input v-model="password" type="password" placeholder="Password" />

          <a href="#" class="forgot-link">¿Olvidaste tu contraseña?</a>

          <button type="submit">Iniciar Sesión</button>
        </form>
      </div>

      <!-- Panel derecho -->
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
<script>
export default {
  name: "LoginForm",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    iniciarSesion() {
      let endpointURL = "api/usuarios/login";
      let payload = {
        correo: this.email,
        contrasena: this.password
      };

      this.$api.post(endpointURL, payload)
        .then((response) => {
          const user = response.data;

          localStorage.setItem("usuario", JSON.stringify(user));

          this.$q.notify({
            type: 'positive',
            position: 'top',
            message: 'Inicio de sesión exitoso.'
          });

          if (user.rol === "administrador") {
            this.$router.push("/admin");
          } else {
            this.$router.push("/product");
          }
        })
        .catch((error) => {
          console.error("Error al iniciar sesión: ", error);
          this.$q.notify({
            type: 'negative',
            position: 'top',
            message: 'Credenciales incorrectas.'
          });
        });
    },

    login() {
      if (!this.email || !this.password) {
        this.$q.notify({
          type: "negative",
          position: "top",
          message: "Debes ingresar correo y contraseña."
        });
        return;
      }

      this.iniciarSesion();
    }

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
  background: #f4f6f7;
}

/* Contenedor principal */
.container {
  background-color: #ffffff;
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  position: relative;
  overflow: hidden;
  width: 768px;
  max-width: 100%;
  min-height: 480px;
}

/* Panel izquierdo */
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
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  padding: 0 50px;
  height: 100%;
  justify-content: center;
  align-items: center;
  text-align: center;
}

form h2 {
  margin-top: 0;
  margin-bottom: 12px;
  font-weight: 700;
  color: #2ecc71;
  font-size: 28px;
}

/* Inputs modernizados sin modificar el layout */
input {
  background-color: #f0f1f3;
  border: 2px solid transparent;
  border-radius: 8px;
  padding: 12px 14px;
  margin: 8px 0;
  width: 100%;
  font-size: 14px;
  transition: 0.25s ease;
}

input:focus {
  outline: none;
  border-color: #2ecc71;
  background: #ffffff;
  box-shadow: 0 0 6px rgba(46, 204, 113, 0.25);
}

/* Link */
.forgot-link {
  font-size: 13px;
  color: #666;
  margin-bottom: 10px;
}

.forgot-link:hover {
  color: #2ecc71;
}

/* Botón principal */
button {
  border-radius: 20px;
  border: 1px solid #2ecc71;
  background-color: #2ecc71;
  color: #ffffff;
  font-size: 13px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: 0.2s ease;
}

button:hover {
  background-color: #29b765;
  transform: translateY(-2px);
}

/* Overlay */
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
  background: linear-gradient(to right, #2ecc71, #29b765);
  color: #ffffff;
  height: 100%;
  width: 200%;
  position: relative;
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

/* Botón ghost */
button.ghost {
  background-color: transparent;
  border: 2px solid #ffffff;
}

button.ghost:hover {
  background: rgba(255,255,255,0.15);
  transform: translateY(-2px);
}
</style>
