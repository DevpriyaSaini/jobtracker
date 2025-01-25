const signinBtn = document.querySelector(".signin-btn");
const signupBtn = document.querySelector(".signup-btn");
const singup = document.querySelector(".signup-form form");
const signin = document.querySelector(".signin-form form");
const formPage = document.querySelector(".form-page");
const body = document.querySelector("body");

signupBtn.addEventListener("click", () => {
  gsap.to(formPage, {
    // left: "50%",
    ease: "power4.out",
    keyframes: [
      { width: "50%", left: "0%" },
      { width: "100%" },
      { width: "50%", left: "50%" },
    ],
  });

  body.style.backgroundColor = "#5b6fa6";

  gsap.to(".signin-form", {
    delay: 0,
    left: "-100%",
  });

  gsap.to(".signup-form", {
    delay: 0.4,
    left: "0%",
  });
});

signinBtn.addEventListener("click", () => {
  gsap.to(formPage, {
    // left: "0%",
    ease: "power4.out",
    keyframes: [
      { left: "50%" },
      { left: "0%", width: "100%" },
      { width: "50%", left: "0%" },
    ],
  });

  body.style.backgroundColor = "#0D1428";

  gsap.to(".signin-form", {
    delay: 0.2,
    left: "0%",
  });

  gsap.to(".signup-form", {
    delay: 0,
    left: "100%",
  });
});

signin.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.querySelector("#username").value;
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  const data = {
    username,
    email,
    password,
  };

  const response = await fetch("http://localhost:3000/api/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const resdata = await response.json();

  alert(resdata.msg);
});

singup.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.querySelector("#username2").value;
  const password = document.querySelector("#pass2").value;
  const email = document.querySelector("#email").value;

  const data = {
    username,
    password,
    email,
  };

  try {
    const response = await fetch("http://localhost:3000/api/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const resdata = await response.json();
    alert(resdata.msg);
  } catch (error) {
    console.log(error);
  }
});
