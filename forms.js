/**
 * يبعت أي فورم مربوط بـ Formspree عن طريق fetch،
 * ويعرض رسالة نجاح/خطأ جوه الصفحة من غير ما ينقّل المستخدم لموقع Formspree.
 *
 * الاستخدام: كل فورم لازم يكون له:
 *  - data-ajax-form   (عشان السكربت يلاقيه)
 *  - عنصر جوّاه بـ [data-form-status]  لعرض الرسالة
 *  - زرار submit عادي
 */
document.addEventListener('DOMContentLoaded', () => {
  const forms = document.querySelectorAll('[data-ajax-form]');

  forms.forEach((form) => {
    const statusEl = form.querySelector('[data-form-status]');
    const submitBtn = form.querySelector('button[type="submit"]');
    const submitLabel = submitBtn ? submitBtn.textContent : '';

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (statusEl) {
        statusEl.hidden = true;
        statusEl.classList.remove('is-success', 'is-error');
      }
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'جاري الإرسال...';
      }

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });

        if (response.ok) {
          form.reset();
          if (statusEl) {
            statusEl.textContent = form.dataset.successMessage || 'تم إرسال طلبك بنجاح، هنتواصل معك قريبًا.';
            statusEl.classList.add('is-success');
            statusEl.hidden = false;
          }
        } else {
          throw new Error('server-error');
        }
      } catch (err) {
        if (statusEl) {
          statusEl.textContent = 'حصل خطأ أثناء الإرسال، حاولي تاني أو تواصلي معنا عبر واتساب.';
          statusEl.classList.add('is-error');
          statusEl.hidden = false;
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = submitLabel;
        }
      }
    });
  });
});
