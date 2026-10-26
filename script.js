/* ==========================================================================
   STACKLY - PREMIUM COWORKING SPACE
   Client-side JavaScript Interactivity
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header Scroll Effect
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // 2. Mobile Menu Drawer
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileNavDrawer');
  const closeMobileMenu = document.getElementById('closeMobileMenu');

  function openMobileNav() {
    if (mobileDrawer) {
      mobileDrawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMobileNav() {
    if (mobileDrawer) {
      mobileDrawer.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', openMobileNav);
  }

  if (closeMobileMenu) {
    closeMobileMenu.addEventListener('click', closeMobileNav);
  }

  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  // 3. FAQ Accordion Functionality
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');

    if (trigger && content) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close other items
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
            const otherContent = otherItem.querySelector('.faq-content');
            if (otherContent) otherContent.style.maxHeight = '0px';
            const otherTrigger = otherItem.querySelector('.faq-trigger');
            if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle current item
        if (isActive) {
          item.classList.remove('active');
          content.style.maxHeight = '0px';
          trigger.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('active');
          content.style.maxHeight = content.scrollHeight + 'px';
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });

  // Open first FAQ item by default if none active
  if (faqItems.length > 0) {
    const activeItem = document.querySelector('.faq-item.active') || faqItems[0];
    const activeTrigger = activeItem.querySelector('.faq-trigger');
    const activeContent = activeItem.querySelector('.faq-content');
    if (activeItem && activeTrigger && activeContent) {
      activeItem.classList.add('active');
      activeContent.style.maxHeight = activeContent.scrollHeight + 'px';
      activeTrigger.setAttribute('aria-expanded', 'true');
    }
  }

  // 4. Modal Dialogs (Tour Booking, Login, Article Reader)
  const tourModal = document.getElementById('tourModal');
  const loginModal = document.getElementById('loginModal');
  const articleModal = document.getElementById('articleReaderModal');

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    const firstInput = modal.querySelector('input, select, textarea');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  }

  function closeAllModals() {
    if (tourModal) tourModal.classList.remove('open');
    if (loginModal) loginModal.classList.remove('open');
    if (articleModal) articleModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Bind all "Book a tour" buttons across the site
  const tourTriggers = document.querySelectorAll('.open-tour-btn, [href="#book-tour"]');
  tourTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobileNav();
      openModal(tourModal);
    });
  });

  // Bind all "Member login" buttons
  const loginTriggers = document.querySelectorAll('.open-login-btn, [href="#login"]');
  loginTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobileNav();
      openModal(loginModal);
    });
  });

  // Bind all "Read article" cards/links
  const articleTriggers = document.querySelectorAll('.open-article-btn');
  articleTriggers.forEach(card => {
    card.addEventListener('click', (e) => {
      // If user clicked an internal link like book tour, let it bubble
      if (e.target.closest('.open-tour-btn')) return;

      const title = card.getAttribute('data-title');
      const author = card.getAttribute('data-author');
      const date = card.getAttribute('data-date');
      const category = card.getAttribute('data-category');

      const modalTitle = document.getElementById('readerArticleTitle');
      const modalMeta = document.getElementById('readerMeta');
      const modalCategory = document.getElementById('readerCategory');

      if (modalTitle && title) modalTitle.textContent = title;
      if (modalMeta && author && date) modalMeta.textContent = `By ${author} · ${date}`;
      if (modalCategory && category) modalCategory.textContent = `${category} · 5 Min Read`;

      openModal(articleModal);
    });
  });

  // Close buttons
  const closeBtns = document.querySelectorAll('.modal-close-btn');
  closeBtns.forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });

  // Close on backdrop click (outside dialog content)
  const backdrops = document.querySelectorAll('.modal-backdrop');
  backdrops.forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeAllModals();
      }
    });
  });

  // Escape key to close
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
      closeMobileNav();
    }
  });

  // 5. Toast Notifications
  const toast = document.getElementById('toastNotice');
  const toastMsg = document.getElementById('toastMsg');

  function showToast(message) {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  // 6. Tour Modal Form Submission (Checks constraints & works with validation.js)
  const tourForm = document.getElementById('tourBookingForm');
  if (tourForm) {
    tourForm.addEventListener('submit', (e) => {
      // Validate all required inputs
      const requiredInputs = tourForm.querySelectorAll('input[required], select[required]');
      let formValid = true;
      requiredInputs.forEach(inp => {
        if (!inp.value.trim() || inp.classList.contains('input-invalid')) {
          formValid = false;
        }
      });

      if (!formValid) {
        e.preventDefault();
        return;
      }

      e.preventDefault();
      const name = document.getElementById('tourName')?.value || 'Guest';
      const workspaceType = document.getElementById('tourSpaceType')?.value || 'workspace';
      
      closeAllModals();
      tourForm.reset();
      tourForm.querySelectorAll('.input-valid, .input-invalid').forEach(el => el.classList.remove('input-valid', 'input-invalid'));
      showToast(`Thank you ${name}! Your tour for ${workspaceType} at Salem Fairlands has been requested.`);
    });
  }

  // 7. Login Form Submission
  const loginForm = document.getElementById('memberLoginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      const emailInput = document.getElementById('loginEmail');
      const passwordInput = document.getElementById('loginPassword');
      if (!emailInput?.value.trim() || !passwordInput?.value.trim() || emailInput.classList.contains('input-invalid')) {
        e.preventDefault();
        return;
      }

      e.preventDefault();
      const email = emailInput.value.trim();
      closeAllModals();
      showToast(`Welcome back! Opening Stackly portal...`);
      setTimeout(() => {
        window.location.href = email.toLowerCase().includes('admin') ? 'admin-dashboard.html' : 'user-dashboard.html';
      }, 700);
    });
  }

  // 8. Contact Page Interactive Tabs & Form Handling
  const tabTour = document.getElementById('tabBookTour');
  const tabEnquiry = document.getElementById('tabGeneralEnquiry');
  const formHeaderTitle = document.getElementById('formHeaderTitle');
  const formHeaderSub = document.getElementById('formHeaderSub');
  const tourRow1 = document.getElementById('tourFieldsRow1');
  const tourRow2 = document.getElementById('tourFieldsRow2');
  const tourPrefNote = document.getElementById('tourPreferenceNote');
  const submitBtn = document.getElementById('contactSubmitBtn');
  const contactForm = document.getElementById('contactPageForm');

  if (tabTour && tabEnquiry) {
    tabTour.addEventListener('click', () => {
      tabTour.classList.add('active');
      tabTour.setAttribute('aria-selected', 'true');
      tabEnquiry.classList.remove('active');
      tabEnquiry.setAttribute('aria-selected', 'false');

      if (formHeaderTitle) formHeaderTitle.textContent = 'A better day starts with a visit.';
      if (formHeaderSub) formHeaderSub.textContent = 'Tell us a little about yourself. Fields marked * are required.';
      if (tourRow1) tourRow1.style.display = 'grid';
      if (tourRow2) tourRow2.style.display = 'grid';
      if (tourPrefNote) tourPrefNote.style.display = 'block';
      if (submitBtn) submitBtn.innerHTML = 'Request my tour <span class="arrow">↗</span>';
    });

    tabEnquiry.addEventListener('click', () => {
      tabEnquiry.classList.add('active');
      tabEnquiry.setAttribute('aria-selected', 'true');
      tabTour.classList.remove('active');
      tabTour.setAttribute('aria-selected', 'false');

      if (formHeaderTitle) formHeaderTitle.textContent = 'How can we help you today?';
      if (formHeaderSub) formHeaderSub.textContent = 'Send us a question or proposal. We respond promptly within business hours.';
      if (tourRow1) tourRow1.style.display = 'none';
      if (tourRow2) tourRow2.style.display = 'none';
      if (tourPrefNote) tourPrefNote.style.display = 'none';
      if (submitBtn) submitBtn.innerHTML = 'Send enquiry <span class="arrow">↗</span>';
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      const nameInp = document.getElementById('contactName');
      const emailInp = document.getElementById('contactEmail');
      const phoneInp = document.getElementById('contactPhone');
      const msgInp = document.getElementById('contactMessage');

      if (!nameInp?.value.trim() || !emailInp?.value.trim() || !phoneInp?.value.trim() || !msgInp?.value.trim() ||
          contactForm.querySelectorAll('.input-invalid').length > 0) {
        e.preventDefault();
        return;
      }

      e.preventDefault();
      const name = nameInp.value.trim();
      const isTour = tabTour?.classList.contains('active');
      contactForm.reset();
      contactForm.querySelectorAll('.input-valid, .input-invalid').forEach(el => el.classList.remove('input-valid', 'input-invalid'));
      showToast(isTour 
        ? `Thank you, ${name}! Your Salem visit request has been sent to our host.` 
        : `Thank you, ${name}! Your message has been received.`
      );
    });
  }

  // 9. Blog Filter Category Functionality
  const filterButtons = document.querySelectorAll('.blog-filter-btn');
  const articleCards = document.querySelectorAll('.article-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-category');
      articleCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat === category) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 10. Newsletter Form Submission
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      const emailInp = document.getElementById('newsletterEmail');
      if (!emailInp?.value.trim() || emailInp.classList.contains('input-invalid')) {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      const email = emailInp.value.trim();
      newsletterForm.reset();
      newsletterForm.querySelectorAll('.input-valid, .input-invalid').forEach(el => el.classList.remove('input-valid', 'input-invalid'));
      showToast(`Thank you! ${email} is now subscribed to The Stackly Dispatch.`);
    });
  }
});
