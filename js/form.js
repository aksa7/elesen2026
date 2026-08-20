// ==========================================================================
// form.js — registracijos formos validacija + submit
// ==========================================================================

import { FORM_ENDPOINT } from './config.js';

const form = document.getElementById('reg-form');
const alertEl = document.getElementById('form-alert');
const submitBtn = document.getElementById('reg-submit');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+]?[\d\s()-]{6,}$/;
const THANKS_URL = '../aciu/';

function setError(name, message) {
  const input = form.elements[name];
  const errorEl = document.getElementById(`${name}-error`);
  if (!errorEl) return;

  if (message) {
    errorEl.textContent = message;
    errorEl.hidden = false;
    if (input && input instanceof HTMLElement && 'setAttribute' in input) {
      if (name === 'autobusas') {
        form.querySelectorAll('input[name="autobusas"]').forEach((el) => {
          el.setAttribute('aria-invalid', 'true');
        });
      } else {
        input.setAttribute('aria-invalid', 'true');
      }
    }
  } else {
    errorEl.textContent = '';
    errorEl.hidden = true;
    if (name === 'autobusas') {
      form.querySelectorAll('input[name="autobusas"]').forEach((el) => {
        el.removeAttribute('aria-invalid');
      });
    } else if (input) {
      input.removeAttribute('aria-invalid');
    }
  }
}

function clearErrors() {
  ['vardas', 'telefonas', 'elpastas', 'miestas', 'autobusas'].forEach((n) => setError(n, ''));
  alertEl.hidden = true;
  alertEl.textContent = '';
}

function validate() {
  clearErrors();
  let ok = true;

  const vardas = form.vardas.value.trim();
  const telefonas = form.telefonas.value.trim();
  const elpastas = form.elpastas.value.trim();
  const miestas = form.miestas.value.trim();
  const autobusasEl = form.querySelector('input[name="autobusas"]:checked');

  if (!vardas) {
    setError('vardas', 'Įveskite vardą ir pavardę.');
    ok = false;
  }
  if (!telefonas) {
    setError('telefonas', 'Įveskite telefono numerį.');
    ok = false;
  } else if (!PHONE_RE.test(telefonas)) {
    setError('telefonas', 'Neteisingas telefono numerio formatas.');
    ok = false;
  }
  if (!elpastas) {
    setError('elpastas', 'Įveskite el. pašto adresą.');
    ok = false;
  } else if (!EMAIL_RE.test(elpastas)) {
    setError('elpastas', 'Neteisingas el. pašto formatas.');
    ok = false;
  }
  if (!miestas) {
    setError('miestas', 'Įveskite miestą.');
    ok = false;
  }
  if (!autobusasEl) {
    setError('autobusas', 'Pasirinkite Taip arba Ne.');
    ok = false;
  }

  return ok;
}

function getPayload() {
  const autobusas = form.querySelector('input[name="autobusas"]:checked');
  return {
    vardas: form.vardas.value.trim(),
    telefonas: form.telefonas.value.trim(),
    elpastas: form.elpastas.value.trim(),
    miestas: form.miestas.value.trim(),
    autobusas: autobusas ? autobusas.value : '',
    company: form.company.value.trim(),
  };
}

function showSubmitError(message) {
  alertEl.textContent = message;
  alertEl.hidden = false;
}

/** Ar /exec viešas? Jei prašo Google login — diegimas neteisingas. */
async function assertEndpointPublic() {
  const res = await fetch(FORM_ENDPOINT, { method: 'GET', redirect: 'follow' });
  const text = await res.text();
  if (!text.includes('ELESEN forma veikia')) {
    const err = new Error('not_public');
    err.code = 'not_public';
    throw err;
  }
}

async function onSubmit(e) {
  e.preventDefault();
  if (!validate()) return;

  if (form.company.value.trim()) {
    window.location.href = THANKS_URL;
    return;
  }

  if (!FORM_ENDPOINT || FORM_ENDPOINT.includes('PASTE_') || FORM_ENDPOINT.includes('PLACEHOLDER')) {
    showSubmitError('Formos endpoint dar nesukonfigūruotas. Įrašykite Apps Script /exec URL faile js/config.js.');
    return;
  }

  const originalLabel = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Siunčiama...';

  try {
    // 1) Patikra: URL PRIVALO veikti be Google login
    await assertEndpointPublic();

    // 2) Siuntimas (no-cors — GAS redirect kitaip blokuoja JSON skaitymą)
    await fetch(FORM_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(getPayload()),
    });

    window.location.href = THANKS_URL;
  } catch (err) {
    const notPublic = err && err.code === 'not_public';
    showSubmitError(
      notPublic
        ? 'Web App URL nėra viešas. Diegti → spausk Diegti → nukopijuok NAUJĄ /exec URL. „Kas turi prieigą: Bet kas“. Patikra: atidaryk URL privačiame lange — turi matytis „ELESEN forma veikia“ BE prisijungimo.'
        : 'Nepavyko išsiųsti. Bandykite dar kartą.'
    );
    submitBtn.disabled = false;
    submitBtn.textContent = originalLabel;
  }
}

if (form) {
  form.addEventListener('submit', onSubmit);
}
