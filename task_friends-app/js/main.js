const formFilter = document.getElementById('form-filter');
const inputsForm = formFilter.querySelectorAll('input');
const userList = document.querySelector('.user-list');
const btnSearchByName = document.querySelector('.search-name-btn');
const inputName = document.querySelector('.search-by-name');
const btnSearchByAge = document.querySelector('.search-age-btn');
const inputAge = document.querySelector('.search-by-age');
const reset = document.querySelector('.btn-reset');


const endpoint = 'https://randomuser.me/api/?';
const res = 'results=5';
const apiUrl = `${endpoint}${res}`;
console.log(apiUrl);

//get users from API
const fetchUsers = () =>
	fetch(apiUrl)
		.then(response => {
			if (response.ok) {
				return response.json();
			}
			throw new Error (
				'error while fetching: ' + response.statusText
			)
		})
		.then(data => data.results)
    .catch(error => console.log('error'));

console.log(fetchUsers());
    
//prepare data for using template
const source = document
.querySelector('#user-card')
.textContent
.trim();

console.log(source);
  
//compile data using template
const compiled = _.template(source);

//render users
const renderUsers = (items, template, parent) => {
  let htmlString = '';
  items.forEach(item => {
    htmlString += template(item);
  });
  parent.innerHTML = htmlString;
};

const users = fetchUsers();

users.then(data => { 
  const users = data.map(user => ({
      gender: user.gender,
      name: `${user.name.first} ${user.name.last}`,
      img: user.picture.thumbnail,
      age: user.dob.age,
      location: user.location.state,
      email: user.email,
      })
  );
  console.table(users);

  btnSearchByName.addEventListener('click', function(e) {
    e.preventDefault();
    let inputNameVal = inputName.value;
    const isFilteredUsers = users.filter(item => (
      item.name.toLowerCase().includes(inputNameVal))
    );
    console.log(isFilteredUsers);
    renderUsers(isFilteredUsers, compiled, userList);
  });

  btnSearchByAge.addEventListener('click', function(e) {
    e.preventDefault();
    console.log('age');
    let inputAgeVal = inputAge.value;
    const isFilteredUsers = users.filter(item => (
      String(item.age) === inputAgeVal)
    );
    renderUsers(isFilteredUsers, compiled, userList);
  });

  formFilter.addEventListener('click', function(e) {
    const target = e.target;
    const inputChecked = target.checked;
    if (target === 'INPUT' !== null && inputChecked) {
      const isFilteredUsers = users.filter(item => item.gender === target.value);
      renderUsers(isFilteredUsers, compiled, userList);
    }
  });

  formFilter.addEventListener('click', function(e) {
    const target = e.target;
    const inputChecked = target.checked;
    if (target === 'INPUT' !== null && inputChecked && target.value === 'up-age') {
      const isSortedUsers = users.sort((a, b) => a.age - b.age);
      renderUsers(isSortedUsers, compiled, userList);
    } else if (target === 'INPUT' !== null && inputChecked && target.value === 'down-age') {
      const isSortedUsers = users.sort((a, b) => b.age - a.age);
      renderUsers(isSortedUsers, compiled, userList);
    } else if (target === 'INPUT' !== null && inputChecked && target.value === 'up-name') {
      const isSortedUsers = users.sort((a, b) => ((a.name > b.name) - (a.name < b.name)));
      renderUsers(isSortedUsers, compiled, userList);
    } else if (target === 'INPUT' !== null && inputChecked && target.value === 'down-name') {
      const isSortedUsers = users.sort((a, b) => ((a.name < b.name) - (a.name > b.name)));
      renderUsers(isSortedUsers, compiled, userList);
    }
  });

  reset.addEventListener('click', function() {
    renderUsers(users, compiled, userList);
    inputName.value = '';
  });

  renderUsers(users, compiled, userList);
});

//filter users by gender
const filterByGender = (data, inputValue) => {
  return data.filter(item => item.gender === inputValue);
}




// formFilter.addEventListener('click', function(e) {
//   const targetInput = e.target.closest('input');
//   targetInput !== null
//   && targetInput.checked
//   && filterByGender();

// });

