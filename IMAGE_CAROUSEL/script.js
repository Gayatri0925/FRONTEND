const slides = document.querySelectorAll('.slide');
const prev = document.getElementById('prev');
const next = document.getElementById('next');
let index = 0;

function showSlide(i){
  slides.forEach(slide => slide.classList.remove('active'));
  slides[i].classList.add('active');
}

prev.addEventListener('click', () => {
  index = (index-1 + slides.length)%slides.length;
  showSlide(index);
});

next.addEventListener('click', () => {
  index = (index+1)%slides.length;
  showSlide(index);
});
