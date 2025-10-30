const emojis = document.querySelectorAll('.emoji');
const feedbackBox = document.getElementById('feedback');
const submitBtn = document.getElementById('submitBtn');
const thankYou = document.querySelector('.thankyou');

let selectedRating = 0;

emojis.forEach(emoji => {
  emoji.addEventListener('click', () => {
    emojis.forEach(e => e.classList.remove('active'));
    emoji.classList.add('active');
    selectedRating = emoji.getAttribute('data-value');
  });
});

submitBtn.addEventListener('click', () => {
  if (selectedRating === 0 || feedbackBox.value.trim() === "") {
    alert("Please select an emoji and write feedback before submitting!");
    return;
  }

  thankYou.classList.add('show');
  setTimeout(() => {
    thankYou.classList.remove('show');
    feedbackBox.value = "";
    emojis.forEach(e => e.classList.remove('active'));
    selectedRating = 0;
  }, 3000);
});
