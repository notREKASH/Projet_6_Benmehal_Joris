const form = {
  email: document.querySelector("#email"),
  password: document.querySelector("#password"),
  submit: document.querySelector("#submit"),
};

let button = form.submit.addEventListener("click", (event) => {
  event.preventDefault();

  const login = "http://localhost:5678/api/users/login";

  fetch(login, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: form.email.value,
      password: form.password.value,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const token = data.token;
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("isAdmin", true);
      location.href = "./index.html";
    })
    .catch((error) => {
      if (error.status !== 200) {
        const passwordErrorMsg = document.createElement("div");
        passwordErrorMsg.classList.add("password-error");
        const errorMsg = document.createElement("p");
        errorMsg.innerHTML =
          "Oups, l'adresse e-mail ou le mot de passe que vous avez entré(e) ne sont pas correct. Veuillez vérifier et réessayer.";
        const crossClose = document.createElement("div");
        crossClose.innerHTML = `<i class="fa-solid fa-xmark password-error--cross"></i>`;

        passwordErrorMsg.appendChild(errorMsg);
        passwordErrorMsg.appendChild(crossClose);
        document.body.appendChild(passwordErrorMsg);

        crossClose.addEventListener("click", () => {
          document.body.removeChild(passwordErrorMsg);
        });
      } else {
        console.error(
          "Une erreur s'est produite lors de la tentative de connexion :",
          error
        );
      }
    });
});
