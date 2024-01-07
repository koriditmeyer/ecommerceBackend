document.querySelectorAll(".logout-form").forEach((form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const response = await fetch("/api/sessions/current", {
      method: "DELETE",
    });
    console.log(response.status);
    if (response.status === 200) {
      console.log("Redirecting to profile");
      window.location.href = "/login";
    } else {
      console.log("Handling error");
      const error = await response.json();
      alert(error.message);
    }
  });
});
