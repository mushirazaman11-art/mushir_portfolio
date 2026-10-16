const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
menu?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  document.body.style.overflow = open ? 'hidden' : '';
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
document.getElementById('year').textContent = new Date().getFullYear();

const indiaTime = document.getElementById('india-time');
if (indiaTime) {
  const updateIndiaTime = () => {
    indiaTime.textContent = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false
    }).format(new Date()) + ' · New Delhi (IST, UTC+5:30)';
  };
  updateIndiaTime();
  setInterval(updateIndiaTime, 60000);
}

const expertiseTabs = document.querySelectorAll('.expertise-tab');
const expertisePanels = document.querySelectorAll('.topic-panel');
expertiseTabs.forEach(tab => tab.addEventListener('click', () => {
  const topic = tab.dataset.topic;
  expertiseTabs.forEach(item => {
    const active = item === tab;
    item.classList.toggle('active', active);
    item.setAttribute('aria-selected', String(active));
  });
  expertisePanels.forEach(panel => {
    const active = panel.id === `topic-${topic}`;
    panel.hidden = !active;
    panel.classList.toggle('active', active);
  });
}));

// Small interactive examples for the two primary study areas.
const examples = {
  mathematics: {
    title: 'Quick reasoning example',
    text: 'If a proof uses a theorem, first check its assumptions, then verify each step follows from the previous one. A correct conclusion depends on both.'
  },
  coding: {
    title: 'Quick code-review example',
    text: 'For a loop, check three things: where it starts, when it stops, and how the value changes. This makes off-by-one errors easier to spot.'
  }
};
Object.entries(examples).forEach(([topic, example]) => {
  const panel = document.getElementById(`topic-${topic}`);
  const reference = panel?.querySelector('small');
  if (!panel || !reference) return;
  const button = document.createElement('button');
  button.className = 'example-toggle';
  button.type = 'button';
  button.setAttribute('aria-expanded', 'false');
  button.textContent = 'View a short example';
  const box = document.createElement('div');
  box.className = 'example-box';
  box.hidden = true;
  box.innerHTML = `<b>${example.title}</b><p>${example.text}</p>`;
  button.addEventListener('click', () => {
    const open = box.hidden;
    box.hidden = !open;
    button.setAttribute('aria-expanded', String(open));
    button.textContent = open ? 'Hide example' : 'View a short example';
  });
  reference.after(button, box);
});

// Project overview dialog.
const researchCopy = document.querySelector('.research-copy');
if (researchCopy) {
  const projectButton = document.createElement('button');
  projectButton.className = 'project-detail-button';
  projectButton.type = 'button';
  projectButton.textContent = 'Read project summary ↗';
  researchCopy.append(projectButton);
  const dialog = document.createElement('dialog');
  dialog.className = 'project-dialog';
  dialog.innerHTML = '<button class="dialog-close" type="button" aria-label="Close project summary">×</button><p class="dialog-kicker">PROJECT OVERVIEW</p><h2>Three Generalized Fixed Point Theorems</h2><p>This project studies how repeated mappings can lead to a stable point under suitable conditions. The work focuses on comparing hypotheses, following convergence arguments, and writing proofs with precision.</p><ul><li>Functional Analysis and Metric Spaces</li><li>Convergence and contractive-style conditions</li><li>Step-by-step proof writing</li></ul>';
  document.body.append(dialog);
  projectButton.addEventListener('click', () => dialog.showModal());
  dialog.querySelector('.dialog-close')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
}

// Copy contact email without leaving the page.
const contactLink = document.querySelector('.contact-link');
if (contactLink) {
  const copyButton = document.createElement('button');
  copyButton.className = 'copy-email';
  copyButton.type = 'button';
  copyButton.textContent = 'Copy email address';
  contactLink.after(copyButton);
  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('mushirazaman11@gmail.com');
      copyButton.textContent = 'Email copied ✓';
    } catch {
      copyButton.textContent = 'Copy: mushirazaman11@gmail.com';
    }
    setTimeout(() => { copyButton.textContent = 'Copy email address'; }, 2400);
  });
}

// A subtle reading-progress indicator and current page update label.
const progress = document.createElement('div');
progress.className = 'scroll-progress';
progress.setAttribute('aria-hidden', 'true');
document.body.append(progress);
const updateProgress = () => {
  const maximum = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${maximum > 0 ? window.scrollY / maximum : 0})`;
};
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();
const footer = document.querySelector('footer');
if (footer) {
  const updated = document.createElement('p');
  updated.className = 'site-updated';
  updated.textContent = 'UPDATED · OCTOBER 2026';
  footer.append(updated);
}
