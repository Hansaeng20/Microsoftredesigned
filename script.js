document.addEventListener("DOMContentLoaded", () => {
  // Search functionality
  window.toggleSearch = () => {
    const searchOverlay = document.getElementById("searchOverlay")
    searchOverlay.classList.toggle("active")

    if (searchOverlay.classList.contains("active")) {
      const searchInput = searchOverlay.querySelector(".search-input")
      setTimeout(() => searchInput.focus(), 100)
    }
  }

  // Close search when clicking outside
  document.addEventListener("click", (e) => {
    const searchOverlay = document.getElementById("searchOverlay")
    const searchTrigger = document.querySelector(".search-toggle")

    if (searchOverlay && searchTrigger && !searchOverlay.contains(e.target) && !searchTrigger.contains(e.target)) {
      searchOverlay.classList.remove("active")
    }
  })

  // Mobile menu functionality
  window.toggleMobileMenu = () => {
    const mobileNav = document.getElementById("mobileNav")
    const mobileMenuBtn = document.querySelector(".mobile-menu-btn")

    if (mobileNav && mobileMenuBtn) {
      mobileNav.classList.toggle("active")
      mobileMenuBtn.classList.toggle("active")
    }
  }

  // Wishlist functionality
  document.querySelectorAll(".wishlist-btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation()
      if (this.textContent === "♡") {
        this.textContent = "♥"
        this.style.color = "#e74c3c"
        showNotification("Added to wishlist")
      } else {
        this.textContent = "♡"
        this.style.color = "#666"
        showNotification("Removed from wishlist")
      }
    })
  })

  // Notification system
  function showNotification(message) {
    // Remove existing notification
    const existingNotification = document.querySelector(".notification")
    if (existingNotification) {
      existingNotification.remove()
    }

    // Create notification element
    const notification = document.createElement("div")
    notification.className = "notification"
    notification.textContent = message
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #1a1a1a;
            color: #fff;
            padding: 12px 20px;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 300;
            letter-spacing: 0.5px;
            z-index: 10000;
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.3s ease;
        `

    document.body.appendChild(notification)

    // Animate in
    setTimeout(() => {
      notification.style.opacity = "1"
      notification.style.transform = "translateY(0)"
    }, 100)

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.opacity = "0"
      notification.style.transform = "translateY(-20px)"
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove()
        }
      }, 300)
    }, 3000)
  }

  // FAQ functionality
  document.querySelectorAll(".faq-question").forEach((question) => {
    question.addEventListener("click", function () {
      const faqItem = this.parentElement
      const isActive = faqItem.classList.contains("active")

      // Close all FAQ items
      document.querySelectorAll(".faq-item").forEach((item) => {
        item.classList.remove("active")
      })

      // Open clicked item if it wasn't active
      if (!isActive) {
        faqItem.classList.add("active")
      }
    })
  })

  // Product filtering functionality
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      // Remove active class from all buttons
      document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"))

      // Add active class to clicked button
      this.classList.add("active")

      const category = this.getAttribute("data-category")
      filterProducts(category)
    })
  })

  function filterProducts(category) {
    const products = document.querySelectorAll(".product-card")

    products.forEach((product) => {
      if (category === "all" || product.getAttribute("data-category") === category) {
        product.style.display = "block"
        product.style.opacity = "0"
        setTimeout(() => {
          product.style.opacity = "1"
        }, 100)
      } else {
        product.style.opacity = "0"
        setTimeout(() => {
          product.style.display = "none"
        }, 300)
      }
    })
  }

  // Product sorting functionality
  const sortSelect = document.querySelector(".sort-select")
  if (sortSelect) {
    sortSelect.addEventListener("change", function () {
      const sortBy = this.value
      sortProducts(sortBy)
    })
  }

  function sortProducts(sortBy) {
    const productsContainer = document.querySelector(".products-grid")
    if (!productsContainer) return

    const products = Array.from(productsContainer.querySelectorAll(".product-card"))

    products.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return getPrice(a) - getPrice(b)
        case "price-high":
          return getPrice(b) - getPrice(a)
        case "newest":
          return hasClass(b, "new") - hasClass(a, "new")
        case "popular":
          return getRating(b) - getRating(a)
        default:
          return 0
      }
    })

    // Re-append sorted products
    products.forEach((product) => {
      productsContainer.appendChild(product)
    })
  }

  function getPrice(productCard) {
    const priceElement = productCard.querySelector(".current-price")
    if (!priceElement) return 0

    const priceText = priceElement.textContent.replace(/[^0-9.]/g, "")
    return Number.parseFloat(priceText) || 0
  }

  function hasClass(element, className) {
    return element.querySelector(`.product-badge.${className}`) ? 1 : 0
  }

  function getRating(productCard) {
    const stars = productCard.querySelectorAll(".stars .fas.fa-star")
    return stars.length
  }

  // Form validation and submission
  const contactForm = document.querySelector(".contact-form")
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault()

      if (validateForm(this)) {
        submitForm(this)
      }
    })
  }

  function validateForm(form) {
    const requiredFields = form.querySelectorAll("[required]")
    let isValid = true

    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        showFieldError(field, "This field is required")
        isValid = false
      } else {
        clearFieldError(field)

        // Email validation
        if (field.type === "email" && !isValidEmail(field.value)) {
          showFieldError(field, "Please enter a valid email address")
          isValid = false
        }
      }
    })

    return isValid
  }

  function showFieldError(field, message) {
    clearFieldError(field)

    const errorElement = document.createElement("div")
    errorElement.className = "field-error"
    errorElement.textContent = message
    errorElement.style.cssText = `
            color: #e74c3c;
            font-size: 12px;
            margin-top: 4px;
            font-weight: 300;
        `

    field.style.borderColor = "#e74c3c"
    field.parentNode.appendChild(errorElement)
  }

  function clearFieldError(field) {
    const existingError = field.parentNode.querySelector(".field-error")
    if (existingError) {
      existingError.remove()
    }
    field.style.borderColor = "#ddd"
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  function submitForm(form) {
    const submitBtn = form.querySelector(".submit-btn")
    const originalText = submitBtn.textContent

    // Show loading state
    submitBtn.textContent = "SUBMITTING..."
    submitBtn.disabled = true
    submitBtn.style.opacity = "0.7"

    // Simulate form submission
    setTimeout(() => {
      showNotification("Your message has been sent successfully!")
      form.reset()

      // Reset button
      submitBtn.textContent = originalText
      submitBtn.disabled = false
      submitBtn.style.opacity = "1"
    }, 2000)
  }

  // Newsletter subscription
  const newsletterForms = document.querySelectorAll(".newsletter-form")
  newsletterForms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      e.preventDefault()

      const emailInput = this.querySelector(".email-input")
      const subscribeBtn = this.querySelector(".subscribe-btn")

      if (emailInput.value && isValidEmail(emailInput.value)) {
        const originalText = subscribeBtn.textContent
        subscribeBtn.textContent = "SUBSCRIBING..."
        subscribeBtn.disabled = true

        setTimeout(() => {
          showNotification("Successfully subscribed to newsletter!")
          emailInput.value = ""
          subscribeBtn.textContent = originalText
          subscribeBtn.disabled = false
        }, 1500)
      } else {
        showNotification("Please enter a valid email address")
      }
    })
  })

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      const targetElement = document.querySelector(targetId)

      if (targetElement) {
        const headerHeight = document.querySelector(".site-header").offsetHeight
        const targetPosition = targetElement.offsetTop - headerHeight - 20

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })

        // Close mobile menu if open
        const mobileNav = document.getElementById("mobileNav")
        const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
        if (mobileNav && mobileNav.classList.contains("active")) {
          mobileNav.classList.remove("active")
          mobileMenuBtn.classList.remove("active")
        }
      }
    })
  })

  // Cart functionality
  const cartItems = []

  document.querySelectorAll(".product-btn, .app-btn, .item-btn").forEach((btn) => {
    if (btn.textContent.includes("ADD TO CART")) {
      btn.addEventListener("click", function (e) {
        e.preventDefault()

        const productCard = this.closest(".product-card, .app-card, .grid-item")
        const productName = productCard.querySelector("h3").textContent
        const productPrice = productCard.querySelector(".current-price")?.textContent || "Free"

        addToCart({
          name: productName,
          price: productPrice,
          id: Date.now(),
        })
      })
    }
  })

  function addToCart(item) {
    cartItems.push(item)
    updateCartCount()
    showNotification(`${item.name} added to cart`)
  }

  function updateCartCount() {
    const cartCount = document.querySelector(".cart-count")
    if (cartCount) {
      cartCount.textContent = cartItems.length

      // Animate cart count
      cartCount.style.transform = "scale(1.2)"
      setTimeout(() => {
        cartCount.style.transform = "scale(1)"
      }, 200)
    }
  }

  // Keyboard navigation support
  document.addEventListener("keydown", (e) => {
    // Close search overlay with Escape key
    if (e.key === "Escape") {
      const searchOverlay = document.getElementById("searchOverlay")
      if (searchOverlay && searchOverlay.classList.contains("active")) {
        searchOverlay.classList.remove("active")
      }

      // Close mobile menu with Escape key
      const mobileNav = document.getElementById("mobileNav")
      const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
      if (mobileNav && mobileNav.classList.contains("active")) {
        mobileNav.classList.remove("active")
        mobileMenuBtn.classList.remove("active")
      }
    }

    // Open search with Ctrl+K or Cmd+K
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault()
      const searchOverlay = document.getElementById("searchOverlay")
      if (searchOverlay) {
        searchOverlay.classList.add("active")
        const searchInput = searchOverlay.querySelector(".search-input")
        setTimeout(() => searchInput.focus(), 100)
      }
    }
  })

  // Lazy loading for images
  const images = document.querySelectorAll("img[src]")
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.targe
        observer.unobserve(img)
      }
    })
  })

  images.forEach((img) => {
    imageObserver.observe(img)
  })

  // Scroll to top functionality
  const scrollToTopBtn = document.createElement("button")
  scrollToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>'
  scrollToTopBtn.className = "scroll-to-top"
  scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: #1a1a1a;
        color: #fff;
        border: none;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
    `

  document.body.appendChild(scrollToTopBtn)

  // Show/hide scroll to top button
  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      scrollToTopBtn.style.opacity = "1"
      scrollToTopBtn.style.visibility = "visible"
    } else {
      scrollToTopBtn.style.opacity = "0"
      scrollToTopBtn.style.visibility = "hidden"
    }
  })

  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  })

  // Performance optimization: Debounced scroll events
  let scrollTimeout
  window.addEventListener("scroll", () => {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout)
    }

    scrollTimeout = setTimeout(() => {
      // Add any scroll-based functionality here
      updateActiveNavigation()
    }, 100)
  })

  function updateActiveNavigation() {
    const sections = document.querySelectorAll("section[id]")
    const navLinks = document.querySelectorAll('.main-nav a[href^="#"]')

    let currentSection = ""

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100
      const sectionHeight = section.offsetHeight

      if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
        currentSection = section.getAttribute("id")
      }
    })

    navLinks.forEach((link) => {
      link.classList.remove("active")
      if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.add("active")
      }
    })
  }

  // Initialize tooltips for buttons
  document.querySelectorAll("[title]").forEach((element) => {
    element.addEventListener("mouseenter", function () {
      const tooltip = document.createElement("div")
      tooltip.className = "tooltip"
      tooltip.textContent = this.getAttribute("title")
      tooltip.style.cssText = `
                position: absolute;
                background-color: #1a1a1a;
                color: #fff;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 12px;
                white-space: nowrap;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s ease;
                pointer-events: none;
            `

      document.body.appendChild(tooltip)

      const rect = this.getBoundingClientRect()
      tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + "px"
      tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + "px"

      setTimeout(() => {
        tooltip.style.opacity = "1"
      }, 100)

      this.addEventListener(
        "mouseleave",
        () => {
          tooltip.remove()
        },
        { once: true },
      )
    })
  })

  console.log("Microsoft website scripts loaded successfully!")
})
document.addEventListener('DOMContentLoaded', function() {
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.dot');
  let currentSlide = 0;
  
  function showSlide(n) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }
  
  // Dot click events
  dots.forEach(dot => {
    dot.addEventListener('click', function() {
      showSlide(parseInt(this.dataset.slide));
    });
  });
  
  // Next/previous buttons
  document.querySelector('.carousel-next').addEventListener('click', () => showSlide(currentSlide + 1));
  document.querySelector('.carousel-prev').addEventListener('click', () => showSlide(currentSlide - 1));
  
  // Auto-rotate (optional)
  setInterval(() => showSlide(currentSlide + 1), 5000);
});