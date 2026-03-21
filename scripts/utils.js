(function () {
  function debounce(fn, delay) {
    let timer = null;

    return function () {
      const args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(null, args);
      }, delay || 250);
    };
  }

  function normalizeText(value) {
    return (value || '').trim().toLowerCase();
  }

  function filterBooks(books, filters) {
    filters = filters || {};

    const search = normalizeText(filters.search);
    const subject = normalizeText(filters.subject);
    const audience = normalizeText(filters.audience);

    return books.filter(function (book) {
      const haystack = normalizeText(
        `${book.title} ${book.author} ${book.summary} ${book.subject} ${book.audience}`
      );

      const searchMatch = !search || haystack.includes(search);
      const subjectMatch = !subject || normalizeText(book.subject) === subject;
      const audienceMatch = !audience || normalizeText(book.audience) === audience;

      return searchMatch && subjectMatch && audienceMatch;
    });
  }

  function validateContactForm(values) {
    const errors = {};

    if (!values.name || !values.name.trim()) {
      errors.name = 'Please enter your full name.';
    }

    if (!values.email || !values.email.trim()) {
      errors.email = 'Please enter an email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!values.topic) {
      errors.topic = 'Please choose a topic.';
    }

    if (!values.message || values.message.trim().length < 10) {
      errors.message = 'Please enter at least 10 characters in your message.';
    }

    return errors;
  }

  function getQuerySummary(filters) {
    return [filters.search, filters.subject, filters.audience]
      .filter(Boolean)
      .join(' • ');
  }

  window.debounce = debounce;
  window.normalizeText = normalizeText;
  window.filterBooks = filterBooks;
  window.validateContactForm = validateContactForm;
  window.getQuerySummary = getQuerySummary;
})();