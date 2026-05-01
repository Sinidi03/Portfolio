const yearNode = document.getElementById("year");
const backToTop = document.getElementById("backToTop");
const typewriterText = document.getElementById("typewriterText");
const revealItems = document.querySelectorAll(".reveal");
const navLinks = document.querySelectorAll(".nav a");
const tiltCards = document.querySelectorAll(".tilt-card");
const sections = document.querySelectorAll("main section[id]");
const zoomableImages = document.querySelectorAll(".zoomable-image");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");
const scrollProgress = document.getElementById("scrollProgress");
const statValues = document.querySelectorAll(".stat-value[data-target]");
const magneticButtons = document.querySelectorAll(".magnetic");

function makeFallbackImage(label) {
  const safeLabel = label.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="760" viewBox="0 0 1200 760"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#7c3aed"/><stop offset="100%" stop-color="#06b6d4"/></linearGradient></defs><rect width="1200" height="760" fill="#f7f4ff"/><rect x="22" y="22" width="1156" height="716" rx="24" fill="url(#g)" opacity="0.2"/><text x="50%" y="48%" font-family="Inter, Arial, sans-serif" font-size="44" text-anchor="middle" fill="#4c1d95">Screenshot unavailable</text><text x="50%" y="57%" font-family="Inter, Arial, sans-serif" font-size="28" text-anchor="middle" fill="#0f766e">${safeLabel}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function applyImageFallback(image) {
  const fallbackLabel = image.dataset.fallbackLabel || "Project screenshot coming soon";
  image.src = makeFallbackImage(fallbackLabel);
  image.alt = fallbackLabel;
  image.dataset.isFallback = "true";
  image.classList.add("image-fallback");
}

if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

if (typewriterText) {
  const fullText = typewriterText.textContent.trim();
  typewriterText.textContent = "";
  let index = 0;
  const typingInterval = setInterval(() => {
    typewriterText.textContent += fullText[index];
    index += 1;
    if (index >= fullText.length) {
      clearInterval(typingInterval);
    }
  }, 16);
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          const isMatch = link.getAttribute("href") === `#${sectionId}`;
          link.classList.toggle("active", isMatch);
        });
      }
    });
  },
  { threshold: 0.5 }
);

sections.forEach((section) => sectionObserver.observe(section));

if (backToTop) {
  window.addEventListener("scroll", () => {
    const shouldShow = window.scrollY > 280;
    backToTop.classList.toggle("show", shouldShow);

    if (scrollProgress) {
      const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = pageHeight > 0 ? (window.scrollY / pageHeight) * 100 : 0;
      scrollProgress.style.width = `${progress}%`;
    }
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

const statObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const el = entry.target;
      const target = Number(el.getAttribute("data-target") || "0");
      const suffix = el.getAttribute("data-suffix") || "";
      const duration = 1200;
      const start = performance.now();

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.round(target * (1 - Math.pow(1 - progress, 3)));
        el.textContent = `${value}${suffix}`;
        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      }

      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  },
  { threshold: 0.7 }
);

statValues.forEach((item) => statObserver.observe(item));

tiltCards.forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const bounds = card.getBoundingClientRect();
    const offsetX = event.clientX - bounds.left;
    const offsetY = event.clientY - bounds.top;
    const rotateY = ((offsetX / bounds.width) - 0.5) * 8;
    const rotateX = (0.5 - (offsetY / bounds.height)) * 8;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
  });
});

function openLightbox(image) {
  if (!lightbox || !lightboxImage) {
    return;
  }

  lightboxImage.src = image.getAttribute("src") || "";
  lightboxImage.alt = image.getAttribute("alt") || "Project image";
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  if (!lightbox || !lightboxImage) {
    return;
  }

  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
  document.body.style.overflow = "";
}

zoomableImages.forEach((image) => {
  image.addEventListener("error", () => applyImageFallback(image), { once: true });
  image.addEventListener("click", () => {
    if (image.dataset.isFallback === "true") {
      return;
    }
    openLightbox(image);
  });
});

if (lightboxClose) {
  lightboxClose.addEventListener("click", closeLightbox);
}

if (lightbox) {
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
  }
});

magneticButtons.forEach((button) => {
  button.addEventListener("mousemove", (event) => {
    const rect = button.getBoundingClientRect();
    const offsetX = event.clientX - rect.left - rect.width / 2;
    const offsetY = event.clientY - rect.top - rect.height / 2;
    button.style.transform = `translate(${offsetX * 0.1}px, ${offsetY * 0.1}px)`;
  });

  button.addEventListener("mouseleave", () => {
    button.style.transform = "";
  });
});
