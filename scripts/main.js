(function () {
  function renderCatalogCard(book) {
    return `
      <article class="book-card">
        <div class="book-card-grid">
          <img class="book-cover" src="${book.cover}" alt="Decorative cover for ${book.title}" loading="lazy" width="160" height="220">
          <div>
            <h3>${book.title}</h3>
            <div class="book-meta">
              <span>Author: ${book.author}</span>
              <span>Format: ${book.format}</span>
              <span>Audience: ${book.audience}</span>
            </div>
            <p>${book.summary}</p>
            <div class="tag-row">
              <span class="tag">${book.subject}</span>
              <span class="tag">${book.audience}</span>
            </div>
            <div class="book-actions">
              <button type="button" class="button open-detail" data-book-id="${book.id}">Open detail view</button>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  function setupCatalog() {
    const list = document.querySelector('#catalog-list');
    const form = document.querySelector('#catalog-filters');
    if (!list || !form || !window.books || !window.filterBooks) return;

    const search = form.querySelector('#search');
    const subject = form.querySelector('#subject');
    const audience = form.querySelector('#audience');
    const count = document.querySelector('#results-count');
    const emptyState = document.querySelector('#empty-state');
    const dialog = document.querySelector('#book-dialog');

    const updateResults = () => {
      const filters = { search: search.value, subject: subject.value, audience: audience.value };
      const results = window.filterBooks(window.books, filters);
      list.innerHTML = results.map(renderCatalogCard).join('');
      const summary = window.getQuerySummary ? window.getQuerySummary(filters) : '';
      count.textContent = summary
        ? `Showing ${results.length} result${results.length === 1 ? '' : 's'} for ${summary}.`
        : `Showing ${results.length} example titles.`;

      if (emptyState) emptyState.hidden = !!results.length;

      list.querySelectorAll('.open-detail').forEach((button) => {
        button.addEventListener('click', () => openDialog(button.dataset.bookId));
      });
    };

    const debouncedUpdate = window.debounce ? window.debounce(updateResults, 250) : updateResults;

    search.addEventListener('input', debouncedUpdate);
    subject.addEventListener('change', updateResults);
    audience.addEventListener('change', updateResults);

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      updateResults();
    });

    function openDialog(bookId) {
      const book = window.books.find((entry) => entry.id === bookId);
      if (!book) return;

      if (dialog && typeof dialog.showModal === 'function') {
        dialog.querySelector('#dialog-title').textContent = book.title;
        dialog.querySelector('#dialog-content').innerHTML = `
          <p><strong>Author:</strong> ${book.author}</p>
          <p><strong>Format:</strong> ${book.format}</p>
          <p><strong>Audience:</strong> ${book.audience}</p>
          <p><strong>Subject:</strong> ${book.subject}</p>
          <p>${book.detail}</p>
        `;
        dialog.showModal();
      } else {
        window.alert(
          `${book.title}\n\nAuthor: ${book.author}\nFormat: ${book.format}\nAudience: ${book.audience}\nSubject: ${book.subject}\n\n${book.detail}`
        );
      }
    }

    if (dialog) {
      const closeButton = dialog.querySelector('.close-dialog');

      if (closeButton) {
        closeButton.addEventListener('click', () => dialog.close());
      }

      dialog.addEventListener('click', (event) => {
        if (event.target === dialog) dialog.close();
      });
    }

    updateResults();
  }

  function setupContactForm() {
    const form = document.querySelector('#contact-form');
    if (!form || !window.validateContactForm) return;

    const status = document.querySelector('#contact-status');
    const fields = ['name', 'email', 'topic', 'message'];

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const values = {
        name: form.name.value,
        email: form.email.value,
        topic: form.topic.value,
        message: form.message.value
      };

      const errors = window.validateContactForm(values);

      fields.forEach((field) => {
        const errorNode = document.querySelector(`#${field}-error`);
        if (errorNode) errorNode.textContent = errors[field] || '';
      });

      if (Object.keys(errors).length > 0) {
        if (status) {
          status.textContent = 'Please correct the highlighted fields and try again.';
          status.className = 'contact-status error';
        }
        return;
      }

      if (status) {
        status.textContent = 'Thanks! Your request has been validated on the client side and is ready to send.';
        status.className = 'contact-status success';
      }

      form.reset();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupCatalog();
    setupContactForm();
  });
})();