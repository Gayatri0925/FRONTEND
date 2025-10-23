const quiz = [
  {q:"Capital of France?", options:["Paris","London","Rome","Berlin"], ans:"Paris"},
  {q:"2+2=?", options:["3","4","5","6"], ans:"4"},
  {q:"Color of sky?", options:["Blue","Red","Green","Yellow"], ans:"Blue"}
];

let index = 0;
let score = 0;

const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const nextBtn = document.getElementById('next');
const scoreEl = document.getElementById('score');

function loadQuestion(){
  questionEl.textContent = quiz[index].q;
  optionsEl.innerHTML = '';
  quiz[index].options.forEach(opt=>{
    const btn = document.createElement('div');
    btn.textContent = opt;
    btn.className = 'option';
    btn.addEventListener('click', ()=>{
      if(opt===quiz[index].ans) score++;
      Array.from(optionsEl.children).forEach(b=>b.style.pointerEvents='none');
    });
    optionsEl.appendChild(btn);
  });
}

nextBtn.addEventListener('click', ()=>{
  index++;
  if(index<quiz.length){
    loadQuestion();
  } else {
    questionEl.textContent="Quiz Completed!";
    optionsEl.innerHTML='';
    scoreEl.textContent=`Your Score: ${score} / ${quiz.length}`;
    nextBtn.style.display='none';
  }
});

loadQuestion();
