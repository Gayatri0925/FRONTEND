const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('todo-list');

addBtn.addEventListener('click', () => {
  const value = input.value.trim();
  if(!value) return;
  const li = document.createElement('li');
  li.textContent = value;
  li.addEventListener('click', () => li.classList.toggle('completed'));
  const del = document.createElement('span');
  del.textContent = '❌';
  del.style.cursor = 'pointer';
  del.addEventListener('click', () => li.remove());
  li.appendChild(del);
  list.appendChild(li);
  input.value = '';
});
