// ===================================
// MOBILE NAVIGATION TOGGLE
// ===================================
document.addEventListener("DOMContentLoaded", () => {
  const burger = document.querySelector(".burger")
  const nav = document.querySelector(".nav")
  const navLinks = document.querySelectorAll(".nav-link")

  // Create overlay element
  const overlay = document.createElement("div")
  overlay.className = "nav-overlay"
  document.body.appendChild(overlay)

  // Toggle mobile menu
  const toggleMenu = () => {
    burger.classList.toggle("active")
    nav.classList.toggle("active")
    overlay.classList.toggle("active")
    document.body.style.overflow = nav.classList.contains("active") ? "hidden" : ""
  }

  // Event listeners
  burger.addEventListener("click", toggleMenu)
  overlay.addEventListener("click", toggleMenu)

  // Close menu when clicking on a link
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (nav.classList.contains("active")) {
        toggleMenu()
      }
    })
  })

  // ===================================
  // REVIEW CAROUSEL (Homepage only)
  // ===================================
  const reviewCards = document.querySelectorAll(".reviews-carousel .review-card")

  if (reviewCards.length > 0) {
    let currentReview = 0
    const intervalTime = 5000 // 5 seconds
    let autoPlayInterval

    // Create dots
    const dotsContainer = document.querySelector(".carousel-dots")
    if (dotsContainer) {
      reviewCards.forEach((_, index) => {
        const dot = document.createElement("div")
        dot.className = "carousel-dot"
        if (index === 0) dot.classList.add("active")
        dot.addEventListener("click", () => goToReview(index))
        dotsContainer.appendChild(dot)
      })
    }

    const dots = document.querySelectorAll(".carousel-dot")

    const showReview = (index, direction = "next") => {
      // Remove active class and add exit animation
      reviewCards[currentReview].classList.remove("active")
      if (direction === "next") {
        reviewCards[currentReview].classList.add("slide-out-left")
      } else {
        reviewCards[currentReview].classList.add("slide-in-right")
      }

      // Update dots
      dots[currentReview]?.classList.remove("active")

      // Update current index
      currentReview = index

      // Show new review
      setTimeout(() => {
        reviewCards.forEach((card) => {
          card.classList.remove("slide-out-left", "slide-in-right")
        })
        reviewCards[currentReview].classList.add("active")
        dots[currentReview]?.classList.add("active")
      }, 300)
    }

    const nextReview = () => {
      const nextIndex = (currentReview + 1) % reviewCards.length
      showReview(nextIndex, "next")
    }

    const prevReview = () => {
      const prevIndex = (currentReview - 1 + reviewCards.length) % reviewCards.length
      showReview(prevIndex, "prev")
    }

    const goToReview = (index) => {
      if (index !== currentReview) {
        const direction = index > currentReview ? "next" : "prev"
        showReview(index, direction)
        resetAutoPlay()
      }
    }

    const startAutoPlay = () => {
      autoPlayInterval = setInterval(nextReview, intervalTime)
    }

    const resetAutoPlay = () => {
      clearInterval(autoPlayInterval)
      startAutoPlay()
    }

    // Navigation buttons
    const prevBtn = document.querySelector(".prev-btn")
    const nextBtn = document.querySelector(".next-btn")

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        prevReview()
        resetAutoPlay()
      })
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        nextReview()
        resetAutoPlay()
      })
    }

    // Start carousel
    startAutoPlay()

    // Pause on hover
    const carouselWrapper = document.querySelector(".reviews-carousel-wrapper")
    if (carouselWrapper) {
      carouselWrapper.addEventListener("mouseenter", () => {
        clearInterval(autoPlayInterval)
      })

      carouselWrapper.addEventListener("mouseleave", () => {
        startAutoPlay()
      })
    }

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        prevReview()
        resetAutoPlay()
      } else if (e.key === "ArrowRight") {
        nextReview()
        resetAutoPlay()
      }
    })
  }

  // ===================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ===================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href")
      if (href !== "#" && href !== "") {
        e.preventDefault()
        const target = document.querySelector(href)
        if (target) {
          const headerHeight = document.querySelector(".header").offsetHeight
          const targetPosition = target.offsetTop - headerHeight - 20

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          })
        }
      }
    })
  })

  // ===================================
  // FORM VALIDATION (Contact page)
  // ===================================
  const contactForm = document.querySelector(".contact-form")

  if (contactForm) {
    const inputs = contactForm.querySelectorAll(".form-input, .form-textarea")

    // Real-time validation feedback
    inputs.forEach((input) => {
      input.addEventListener("blur", () => {
        validateField(input)
      })

      input.addEventListener("input", () => {
        const formGroup = input.closest(".form-group")
        if (formGroup.classList.contains("error")) {
          validateField(input)
        }
      })
    })

    const validateField = (field) => {
      const value = field.value.trim()
      const formGroup = field.closest(".form-group")
      let isValid = true
      let errorMsg = ""

      // Required field validation
      if (field.hasAttribute("required") && value === "") {
        isValid = false
        errorMsg = "Dieses Feld ist erforderlich"
      }

      // Email validation
      if (field.type === "email" && value !== "") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          isValid = false
          errorMsg = "Bitte geben Sie eine gültige E-Mail-Adresse ein"
        }
      }

      // Phone validation
      if (field.type === "tel" && value !== "") {
        const phoneRegex = /[+]?[0-9\s\-$$$$]{8,}/
        if (!phoneRegex.test(value)) {
          isValid = false
          errorMsg = "Bitte geben Sie eine gültige Telefonnummer ein"
        }
      }

      // Textarea minimum length
      if (field.tagName === "TEXTAREA" && value !== "") {
        const minLength = field.getAttribute("minlength") || 10
        if (value.length < minLength) {
          isValid = false
          errorMsg = `Bitte geben Sie mindestens ${minLength} Zeichen ein`
        }
      }

      // Update UI
      if (isValid) {
        formGroup.classList.remove("error")
        formGroup.classList.add("success")
        field.style.borderColor = "#4CAF50"
      } else {
        formGroup.classList.remove("success")
        formGroup.classList.add("error")
        field.style.borderColor = "#ff4444"
        const errorElement = formGroup.querySelector(".error-message")
        if (errorElement && errorMsg) {
          errorElement.textContent = errorMsg
        }
      }

      return isValid
    }

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()

      let isFormValid = true
      inputs.forEach((input) => {
        if (!validateField(input)) {
          isFormValid = false
        }
      })

      if (isFormValid) {
        // Success animation
        const submitBtn = contactForm.querySelector(".btn")
        const originalText = submitBtn.textContent
        submitBtn.textContent = "Wird gesendet..."
        submitBtn.style.opacity = "0.7"
        submitBtn.disabled = true

        setTimeout(() => {
          alert("Vielen Dank für Ihre Nachricht! Wir werden uns bald bei Ihnen melden.")
          contactForm.reset()
          inputs.forEach((input) => {
            const formGroup = input.closest(".form-group")
            formGroup.classList.remove("success", "error")
            input.style.borderColor = "#e0e0e0"
          })
          submitBtn.textContent = originalText
          submitBtn.style.opacity = "1"
          submitBtn.disabled = false
        }, 1500)
      } else {
        // Scroll to first error
        const firstError = contactForm.querySelector(".form-group.error")
        if (firstError) {
          firstError.scrollIntoView({ behavior: "smooth", block: "center" })
        }
        alert("Bitte füllen Sie alle Pflichtfelder korrekt aus.")
      }
    })
  }

  // ===================================
  // ACTIVE NAV LINK HIGHLIGHTING
  // ===================================
  const currentPage = window.location.pathname.split("/").pop() || "index.html"
  navLinks.forEach((link) => {
    const linkPage = link.getAttribute("href")
    if (linkPage === currentPage) {
      link.classList.add("active")
    }
  })

  // ===================================
  // SCROLL REVEAL ANIMATIONS
  // ===================================
  const revealElements = document.querySelectorAll("[data-scroll-reveal]")

  const revealOnScroll = () => {
    const windowHeight = window.innerHeight
    const revealPoint = 100

    revealElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top

      if (elementTop < windowHeight - revealPoint) {
        element.classList.add("revealed")
      }
    })
  }

  // Initial check
  revealOnScroll()

  // Check on scroll with throttling for performance
  let scrollTimeout
  window.addEventListener("scroll", () => {
    if (scrollTimeout) {
      window.cancelAnimationFrame(scrollTimeout)
    }
    scrollTimeout = window.requestAnimationFrame(() => {
      revealOnScroll()

      // Header scroll effect
      const header = document.querySelector(".header")
      if (window.scrollY > 50) {
        header.classList.add("scrolled")
      } else {
        header.classList.remove("scrolled")
      }
    })
  })
})
