  // ✅ Guard page: must be logged in
    (function guard(){
      const ok = sessionStorage.getItem("limcoma_logged_in") === "true";
      if(!ok){
        window.location.href = "signin.html";
      }
    })();

    // Auto-fill email from login (nice touch)
    (function fillEmail(){
      const email = sessionStorage.getItem("limcoma_user_email") || "";
      const el = document.getElementById("autoEmail");
      if(el && email) el.value = email;
    })();

    // 2x2 photo preview (local only)
    (function photoPreview(){
      const input = document.getElementById("photoInput");
      const img = document.getElementById("photoPreview");
      if(!input || !img) return;

      input.addEventListener("change", () => {
        const file = input.files && input.files[0];
        if(!file) return;
        const url = URL.createObjectURL(file);
        img.src = url;
        img.style.display = "block";
      });
    })();

    // ✅ Logout with confirmation dialog
    document.getElementById("logoutBtn").addEventListener("click", () => {
      const sure = confirm("Are you sure you want to logout?");
      if(!sure) return;

      sessionStorage.removeItem("limcoma_logged_in");
      sessionStorage.removeItem("limcoma_user_email");
      window.location.href = "signin.html";
    });

    // Submit demo
    const submitBtn = document.getElementById("submitBtn");
    const submitMsg = document.getElementById("submitMsg");
    submitBtn.addEventListener("click", () => {
      submitMsg.style.display = "block";
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(()=> submitMsg.style.display = "none", 1800);
    });