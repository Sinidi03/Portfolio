// Magnetic effect
const magneticElements = document.querySelectorAll(".magnetic");

if (window.matchMedia("(pointer: fine)").matches) {
  magneticElements.forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const h = rect.width / 2;
      const w = rect.height / 2;
      const x = e.clientX - rect.left - h;
      const y = e.clientY - rect.top - w;
      
      el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });
    
    el.addEventListener("mouseleave", () => {
      el.style.transform = `translate(0px, 0px)`;
    });
  });
}

// Reveal on Scroll
const revealElements = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

revealElements.forEach(el => revealObserver.observe(el));

// Footer Year
const yearNode = document.getElementById("year");
if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

// Form handling logic
const contactForm = document.getElementById("contactForm");
const contactStatus = document.getElementById("contactStatus");

if (contactForm && contactStatus) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const endpoint = contactForm.getAttribute("action") || "";
    const formData = new FormData(contactForm);
    contactStatus.style.color = "var(--text-main)";
    contactStatus.textContent = "Sending message...";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error("Request failed");

      contactForm.reset();
      contactStatus.style.color = "var(--accent-primary)";
      contactStatus.textContent = "Message sent successfully. Thank you!";
    } catch {
      contactStatus.style.color = "#810B38";
      contactStatus.textContent = "Could not send message right now. Please try again.";
    }
  });
}
