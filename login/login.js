document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const btn = document.querySelector(".conti");
  
    loginForm.addEventListener("submit", function(e) {
      e.preventDefault();
  
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
  
      if (!email || !password) {
        alert("⚠️ Por favor, completa todos los campos.");
        return;
      }
  
      // Revisar si ya hay usuarios en localStorage
      let users = JSON.parse(sessionStorage.getItem("users")) || {};
  
      if (users[email]) {
        // El usuario existe → validar contraseña
        if (users[email] === password) {
          btn.textContent = "INICIANDO...";
          btn.style.background = "#4CAF50";
  
          setTimeout(() => {
            Swal.fire({
              icon: 'success',
              title: '¡Bienvenido de nuevo!',
              text: `Has iniciado sesión como ${email}`,
              confirmButtonText: "OK"
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.href = "../index.html";
              }
            });
          
            btn.textContent = "CONTINUAR";
            btn.style.background = "#444";
          }, 1500);
          
        } else {
          alert("❌ Contraseña incorrecta");
        }
      } else {
        // El usuario no existe → registrar
        users[email] = password;
        sessionStorage.setItem("users", JSON.stringify(users));
  
        btn.textContent = "REGISTRANDO...";
        btn.style.background = "#2196F3";
  
        setTimeout(() => {
            Swal.fire({
              icon: 'success',
              title: 'Usuario registrado',
              text: `🎉 Registro exitoso: ${email}`,
              confirmButtonText: "OK"
            });
            Swal.fire.style.display = "flex"
            btn.textContent = "CONTINUAR";
            btn.style.background = "#444";
          }, 1500);
      }
    });
  });
  