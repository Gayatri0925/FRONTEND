// Smooth scroll and button action
document.querySelector('.btn').addEventListener('click', () => {
  document.querySelector('#projects').scrollIntoView({ behavior: 'smooth' });
});
