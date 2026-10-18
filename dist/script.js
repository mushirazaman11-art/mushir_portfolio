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

// Short practice questions for the primary academic areas.
const quizzes = {
  mathematics: {
    label: 'QUICK PRACTICE · MATHEMATICS',
    question: 'Besides the four group axioms, which additional property makes a group Abelian?',
    choices: ['Closure', 'Associativity', 'Commutativity', 'Identity element'],
    answer: 2,
    feedback: 'Every group already has closure, associativity, identity, and inverses. An Abelian group additionally satisfies a · b = b · a.'
  },
  coding: {
    label: 'QUICK PRACTICE · CODING',
    question: 'What is the final value of sum? int sum = 0; for (int i = 1; i <= 4; i++) sum += i;',
    choices: ['4', '6', '10', '16'],
    answer: 2,
    feedback: 'The loop adds 1 + 2 + 3 + 4, so sum becomes 10.'
  },
  'computer-science': {
    label: 'QUICK PRACTICE · COMPUTER SCIENCE',
    question: 'Which data structure follows the FIFO principle?',
    choices: ['Stack', 'Queue', 'Tree', 'Graph'],
    answer: 1,
    feedback: 'FIFO means First In, First Out—this is the defining principle of a queue.'
  }
};
Object.entries(quizzes).forEach(([topic, quizData]) => {
  const panel = document.getElementById(`topic-${topic}`);
  const reference = panel?.querySelector('small');
  if (!panel || !reference) return;
  const quiz = document.createElement('section');
  quiz.className = 'practice-quiz';
  quiz.setAttribute('aria-label', `${topic} practice question`);
  quiz.innerHTML = `<span>${quizData.label}</span><h4>${quizData.question}</h4><div class="quiz-options"></div><p class="quiz-result" aria-live="polite"></p>`;
  const options = quiz.querySelector('.quiz-options');
  const result = quiz.querySelector('.quiz-result');
  const reset = document.createElement('button');
  reset.className = 'quiz-reset';
  reset.type = 'button';
  reset.textContent = 'Try again';
  reset.hidden = true;
  quizData.choices.forEach((choice, index) => {
    const option = document.createElement('button');
    option.type = 'button';
    option.className = 'quiz-option';
    option.textContent = choice;
    option.addEventListener('click', () => {
      const correct = index === quizData.answer;
      quiz.querySelectorAll('.quiz-option').forEach(item => item.classList.remove('wrong', 'correct'));
      option.classList.add(correct ? 'correct' : 'wrong');
      result.className = `quiz-result ${correct ? 'is-correct' : 'is-wrong'}`;
      result.textContent = correct ? `Correct ✓ ${quizData.feedback}` : 'Try again — that option is not correct.';
      if (correct) {
        quiz.querySelectorAll('.quiz-option').forEach(item => { item.disabled = true; });
        reset.hidden = false;
      }
    });
    options.append(option);
  });
  reset.addEventListener('click', () => {
    quiz.querySelectorAll('.quiz-option').forEach(item => {
      item.disabled = false;
      item.classList.remove('wrong', 'correct');
    });
    result.className = 'quiz-result';
    result.textContent = '';
    reset.hidden = true;
  });
  quiz.append(reset);
  reference.after(quiz);
});

// Project overview dialog.
const researchCopy = document.querySelector('.research-copy');
if (researchCopy) {
  const projectButton = document.createElement('button');
  projectButton.className = 'project-detail-button';
  projectButton.type = 'button';
  projectButton.textContent = 'Read project summary ↗';
  const projectLinks = document.createElement('div');
  projectLinks.className = 'project-actions';
  const githubLink = document.createElement('a');
  githubLink.className = 'project-github-link';
  githubLink.href = 'https://github.com/mushirazaman11-art';
  githubLink.target = '_blank';
  githubLink.rel = 'noreferrer';
  githubLink.textContent = 'View on GitHub ↗';
  projectLinks.append(projectButton, githubLink);
  researchCopy.append(projectLinks);
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

// Keep the WhatsApp number out of visible text and browser link previews.
document.querySelectorAll('.whatsapp-contact').forEach(button => {
  button.addEventListener('click', () => {
    const countryCode = '91';
    const contactNumber = ['9142', '1339', '12'].join('');
    const message = 'Hello Mushir, I visited your portfolio.';
    window.open(`https://wa.me/${countryCode}${contactNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  });
});

// Contact keeps its email destination on hover; a click reveals both contact choices.
const contactTrigger = document.querySelector('.nav-contact-trigger');
const contactMenu = document.querySelector('.nav-contact-menu');
if (contactTrigger && contactMenu) {
  contactTrigger.addEventListener('click', event => {
    event.preventDefault();
    const isOpen = contactMenu.classList.toggle('is-open');
    contactTrigger.setAttribute('aria-expanded', String(isOpen));
  });
  document.addEventListener('click', event => {
    if (!contactMenu.contains(event.target)) {
      contactMenu.classList.remove('is-open');
      contactTrigger.setAttribute('aria-expanded', 'false');
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      contactMenu.classList.remove('is-open');
      contactTrigger.setAttribute('aria-expanded', 'false');
    }
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

// X profile card.
const profilesGrid = document.querySelector('.profiles-grid');
if (profilesGrid) {
  const xProfile = document.createElement('a');
  xProfile.className = 'profile-card';
  xProfile.href = 'https://x.com/mushirjmi26';
  xProfile.target = '_blank';
  xProfile.rel = 'noreferrer';
  xProfile.innerHTML = '<span>06</span><h3>X</h3><p>Academic updates, coding practice &amp; learning</p><b>View profile &rarr;</b>';
  profilesGrid.append(xProfile);
  const profileOrder = ['LinkedIn', 'GitHub', 'Kaggle', 'HackerRank', 'LeetCode', 'X'];
  profileOrder.forEach(name => {
    const card = Array.from(profilesGrid.children).find(item => item.querySelector('h3')?.textContent.trim() === name);
    if (card) profilesGrid.append(card);
  });
}

// Keep the front-page profile row in the same professional-priority order.
const heroProfiles = document.querySelector('.hero-profiles');
if (heroProfiles) {
  const xLink = document.createElement('a');
  xLink.href = 'https://x.com/mushirjmi26';
  xLink.target = '_blank';
  xLink.rel = 'noreferrer';
  xLink.textContent = 'X ';
  const arrow = document.createElement('span');
  arrow.setAttribute('aria-hidden', 'true');
  arrow.textContent = '↗';
  xLink.append(arrow);
  heroProfiles.append(xLink);
  const heroOrder = ['LinkedIn', 'GitHub', 'Kaggle', 'HackerRank', 'LeetCode', 'X'];
  heroOrder.forEach(name => {
    const link = Array.from(heroProfiles.children).find(item => item.textContent.trim().startsWith(name));
    if (link) heroProfiles.append(link);
  });
}
