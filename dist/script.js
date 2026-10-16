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
    question: 'What is 2 + 3?',
    choices: ['4', '5', '6', '7'],
    answer: 1,
    feedback: '2 + 3 = 5. A small calculation is always a good way to start practising mathematical accuracy.'
  },
  coding: {
    label: 'QUICK PRACTICE · CODING',
    question: 'What is x after: int x = 2; x = x + 3; ?',
    choices: ['2', '3', '5', '6'],
    answer: 2,
    feedback: 'x starts at 2, then 3 is added, so the final value is 5.'
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
