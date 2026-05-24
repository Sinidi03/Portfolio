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
const backgroundOrbs = document.querySelectorAll(".bg-orb");
const skillsTrack = document.getElementById("skillsTrack");
const skillsPrev = document.querySelector(".skills-nav.prev");
const skillsNext = document.querySelector(".skills-nav.next");
const projectsTrack = document.getElementById("projectsTrack");
const projectsPrev = document.querySelector(".projects-nav.prev");
const projectsNext = document.querySelector(".projects-nav.next");
const projectForm = document.querySelector(".project-form");
const contactForm = document.getElementById("contactForm");
const contactStatus = document.getElementById("contactStatus");
const customProjectsStorageKey = "customProjects";

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

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 0.06, 0.3)}s`;
  revealObserver.observe(item);
});

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

    if (backgroundOrbs.length > 0) {
      const y = window.scrollY;
      backgroundOrbs.forEach((orb, index) => {
        const speed = (index + 1) * 0.03;
        orb.style.transform = `translate3d(0, ${-y * speed}px, 0)`;
      });
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
    const rotateY = ((offsetX / bounds.width) - 0.5) * 5;
    const rotateX = (0.5 - (offsetY / bounds.height)) * 5;
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
    button.style.transform = `translate(${offsetX * 0.06}px, ${offsetY * 0.06}px)`;
  });

  button.addEventListener("mouseleave", () => {
    button.style.transform = "";
  });
});

if (skillsTrack && skillsPrev && skillsNext) {
  const getScrollAmount = () => Math.max(180, Math.floor(skillsTrack.clientWidth * 0.75));

  const updateSkillsNav = () => {
    const maxScrollLeft = skillsTrack.scrollWidth - skillsTrack.clientWidth;
    skillsPrev.disabled = skillsTrack.scrollLeft <= 2;
    skillsNext.disabled = skillsTrack.scrollLeft >= maxScrollLeft - 2;
  };

  skillsPrev.addEventListener("click", () => {
    skillsTrack.scrollBy({ left: -getScrollAmount(), behavior: "smooth" });
  });

  skillsNext.addEventListener("click", () => {
    skillsTrack.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
  });

  skillsTrack.addEventListener("scroll", updateSkillsNav);
  window.addEventListener("resize", updateSkillsNav);
  updateSkillsNav();
}

let refreshProjectsNavState = () => {};

if (projectsTrack && projectsPrev && projectsNext) {
  const getScrollAmount = () => Math.max(260, Math.floor(projectsTrack.clientWidth * 0.85));

  const updateProjectsNav = () => {
    const maxScrollLeft = projectsTrack.scrollWidth - projectsTrack.clientWidth;
    projectsPrev.disabled = projectsTrack.scrollLeft <= 2;
    projectsNext.disabled = projectsTrack.scrollLeft >= maxScrollLeft - 2;
  };
  refreshProjectsNavState = updateProjectsNav;

  projectsPrev.addEventListener("click", () => {
    projectsTrack.scrollBy({ left: -getScrollAmount(), behavior: "smooth" });
  });

  projectsNext.addEventListener("click", () => {
    projectsTrack.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
  });

  projectsTrack.addEventListener("scroll", updateProjectsNav);
  window.addEventListener("resize", updateProjectsNav);
  updateProjectsNav();

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let autoScrollTimer = null;
    let isHoveringProjects = false;

    const startAutoScroll = () => {
      clearInterval(autoScrollTimer);
      autoScrollTimer = setInterval(() => {
        if (isHoveringProjects) {
          return;
        }
        const maxScrollLeft = projectsTrack.scrollWidth - projectsTrack.clientWidth;
        const atEnd = projectsTrack.scrollLeft >= maxScrollLeft - 4;
        projectsTrack.scrollTo({
          left: atEnd ? 0 : projectsTrack.scrollLeft + getScrollAmount(),
          behavior: "smooth",
        });
      }, 4200);
    };

    projectsTrack.addEventListener("mouseenter", () => {
      isHoveringProjects = true;
    });
    projectsTrack.addEventListener("mouseleave", () => {
      isHoveringProjects = false;
    });

    startAutoScroll();
  }
}

function getNextProjectIndex() {
  if (!projectsTrack) {
    return "01";
  }
  const count = projectsTrack.querySelectorAll(".project-showcase-card").length + 1;
  return String(count).padStart(2, "0");
}

function createProjectCard(project) {
  const card = document.createElement("article");
  card.className = "project-showcase-card";

  const chips = project.techList
    .slice(0, 6)
    .map((tech) => `<span>${tech}</span>`)
    .join("");

  const githubMarkup = project.github
    ? `<p class="project-card-link"><a href="${project.github}" target="_blank" rel="noreferrer">View Repository</a></p>`
    : "";

  card.innerHTML = `
    <p class="project-index">${project.index}</p>
    <h3>${project.title}</h3>
    <p>${project.description}</p>
    <div class="project-chip-list">${chips}</div>
    ${githubMarkup}
  `;

  return card;
}

function loadStoredProjects() {
  if (!projectsTrack) {
    return;
  }

  try {
    const saved = localStorage.getItem(customProjectsStorageKey);
    if (!saved) {
      return;
    }
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) {
      return;
    }

    parsed.forEach((project) => {
      const index = getNextProjectIndex();
      const card = createProjectCard({ ...project, index });
      projectsTrack.append(card);
    });

    refreshProjectsNavState();
  } catch {
    // Ignore malformed localStorage content.
  }
}

function saveProject(project) {
  try {
    const saved = localStorage.getItem(customProjectsStorageKey);
    const parsed = saved ? JSON.parse(saved) : [];
    const safeList = Array.isArray(parsed) ? parsed : [];
    safeList.push(project);
    localStorage.setItem(customProjectsStorageKey, JSON.stringify(safeList));
  } catch {
    // Ignore storage write issues.
  }
}

loadStoredProjects();

if (projectForm && projectsTrack) {
  projectForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(projectForm);
    const title = String(formData.get("projectTitle") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const techRaw = String(formData.get("tech") || "").trim();
    const github = String(formData.get("github") || "").trim();

    if (!title || !description || !techRaw) {
      return;
    }

    const techList = techRaw
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (techList.length === 0) {
      return;
    }

    const project = {
      title,
      description,
      techList,
      github,
    };

    const index = getNextProjectIndex();
    const card = createProjectCard({ ...project, index });
    projectsTrack.append(card);
    saveProject(project);

    refreshProjectsNavState();
    projectsTrack.scrollTo({ left: projectsTrack.scrollWidth, behavior: "smooth" });
    projectForm.reset();
  });
}

if (contactForm && contactStatus) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const endpoint = contactForm.getAttribute("action") || "";
    if (endpoint.includes("your-form-id")) {
      contactStatus.className = "form-status error";
      contactStatus.textContent = "Set your Formspree form ID in the contact form action first.";
      return;
    }

    const formData = new FormData(contactForm);
    contactStatus.className = "form-status";
    contactStatus.textContent = "Sending message...";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      contactForm.reset();
      contactStatus.className = "form-status success";
      contactStatus.textContent = "Message sent successfully. Thank you!";
    } catch {
      contactStatus.className = "form-status error";
      contactStatus.textContent = "Could not send message right now. Please try again.";
    }
  });
}
