document.addEventListener("DOMContentLoaded", function () {
  const toggler = document.querySelector(".navbar-toggler");
  const collapseEl = document.getElementById("navbarNav");

  if (toggler && collapseEl) {
    collapseEl.addEventListener("show.bs.collapse", () => {
      toggler.classList.add("active");
    });

    collapseEl.addEventListener("hide.bs.collapse", () => {
      toggler.classList.remove("active");
    });

    document.querySelectorAll("#navbarNav .nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        const instance = bootstrap.Collapse.getOrCreateInstance(collapseEl);
        instance.hide();
      });
    });
  }

  let filterButtons = document.querySelectorAll(".filter-btn");
  let cards = document.querySelectorAll(".cards-work");
  let loadMoreBtn = document.getElementById("load-more-projects");
  const maxVisible = 4;
  let currentFilter = "all";
  let expanded = false;

  function updateProjectVisibility() {
    let visibleCount = 0;
    let hiddenCount = 0;

    cards.forEach((card) => {
      const matchesFilter = currentFilter === "all" || card.classList.contains(currentFilter);

      if (!matchesFilter) {
        card.style.display = "none";
        return;
      }

      if (expanded || visibleCount < maxVisible) {
        card.style.display = "block";
        card.classList.add("visible");
        visibleCount++;
      } else {
        card.style.display = "none";
        card.classList.remove("visible");
        hiddenCount++;
      }
    });

    if (hiddenCount > 0 && !expanded) {
      loadMoreBtn.style.display = "inline-flex";
      loadMoreBtn.innerHTML = `Show more  <span class="load-more-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 10L12 14L16 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg></span>`;
    } else {
      loadMoreBtn.style.display = "none";
    }
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      currentFilter = button.getAttribute("data-filter");
      expanded = false;

      updateProjectVisibility();

      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
    });
  });

  loadMoreBtn.addEventListener("click", () => {
    expanded = true;
    updateProjectVisibility();
  });

  // Initial state
  updateProjectVisibility();

  // Section scroll entrance animations (visible area trigger)
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        sectionObserver.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: "0px 0px -15% 0px",
    threshold: 0.15,
  });

  document.querySelectorAll(".animate-on-scroll").forEach((el) => {
    sectionObserver.observe(el);
  });

  // Reveal cards when they are approaching the visible area, with staggered left-to-right delay
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        cardObserver.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: "0px 0px -10% 0px",
    threshold: 0.1,
  });

  cards.forEach((card, index) => {
    // delay for left-to-right stagger
    card.style.setProperty("--card-delay", `${(index % 4) * 0.12}s`);
    cardObserver.observe(card);
  });
});

function sendEmail() {
  var email = document.getElementById("email").value;

  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (email.trim() === "") {
    alert("Por favor, digite seu email.");
    return;
  }

  if (emailRegex.test(email)) {
    var mailtoLink =
      "mailto:gersondouglas2011@gmail.com?subject=Contato&body=Olá, Gerson Lima%0D%0A%0D%0ATenho interesse no seu trabalho gostaria de te propor o seguinte:%0D%0A%0D%0A%0D%0A%0D%0A%0D%0A%0D%0A%0D%0A%0D%0A%0D%0A%0D%0A%0D%0A%0D%0A";
    mailtoLink += "At.te, %0D%0A%0D%0A" + email + "%0D%0A%0D%0A";
    window.open(mailtoLink);
    return;
  }

  alert("Por favor, digite um email válido.");
}