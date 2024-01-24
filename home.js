let currentPage = 1;

async function fetchAndDisplayData(page) {
  currentPage = page || 1;
  try {
    const response = await fetch(`https://reqres.in/api/users?page=${currentPage}`);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();

    const tableBody = document.getElementById('users-table-body');
    tableBody.innerHTML = '';

    data.data.forEach((user, index) => {
      const row = `
        <tr onclick="rowClick(${index + 1})">
          <td><img src="${user.avatar}" alt="User Image" width="50"></td>
          <td>${user.first_name}</td>
          <td>${user.last_name}</td>
        </tr>
      `;
      tableBody.innerHTML += row;
    });

    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = '';
    for (let i = 1; i <= data.total_pages; i++) {
      const listItem = document.createElement('li');
      listItem.classList.add('page-item');
      const link = document.createElement('a');
      link.classList.add('page-link');
      link.href = '#';
      link.textContent = i;
      link.addEventListener('click', () => fetchAndDisplayData(i));
      listItem.appendChild(link);
      paginationContainer.appendChild(listItem);
    }
  } catch (error) {
    console.error('Error fetching data:', error.message);
    showErrorToast();
  }
}

async function fetchAndDisplaySingleUser() {
  try {
    fetchSingleUserData(selectedIndex);
  } catch (error) {
    console.error('Error fetching single user data:', error.message);
    showErrorToast();
  }
}

async function fetchSingleUserData(userId) {
  try {
    const response = await fetch(`https://reqres.in/api/users/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    const user = await response.json();

    const singleUserContainer = document.getElementById('single-user-container');
    const userCard = `
      <div class="user-card">
        <img src="${user.data.avatar}" alt="User Image" width="100">
        <p>First Name: ${user.data.first_name}</p>
        <p>Last Name: ${user.data.last_name}</p>
      </div>
    `;
    singleUserContainer.innerHTML = userCard;
  } catch (error) {
    console.error('Error fetching user data:', error.message);
    showErrorToast();
  }
}

function rowClick(index) {
  selectedIndex = (currentPage - 1) * 6 + index;
  fetchAndDisplaySingleUser();
}

document.getElementById('user-form').addEventListener('submit', async function (event) {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const job = document.getElementById('job').value;

  try {
    const response = await fetch('https://reqres.in/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, job }),
    });
    if (!response.ok) {
      throw new Error('Failed to create user');
    }
    const responseData = await response.json();

    const createdUserContainer = document.getElementById('created-user-container');
    const createdUserCard = `
      <div class="user-card">
        <p>ID: ${responseData.id}</p>
        <p>Name: ${responseData.name}</p>
        <p>Job: ${responseData.job}</p>
        <p>Created At: ${responseData.createdAt}</p>
      </div>
    `;
    createdUserContainer.innerHTML = createdUserCard;
    showSuccessToast();
  } catch (error) {
    console.error('Error creating user:', error.message);
    showErrorToast(error.message);
  }
});
function showSuccessToast() {
const successToast = new bootstrap.Toast(document.getElementById('toast'));
successToast.show();
}
function showErrorToast(errorMessage) {
const errorToast = new bootstrap.Toast(document.getElementById('error-toast'));
const errorToastBody = document.querySelector('#error-toast .toast-body');
errorToastBody.textContent = errorMessage;
errorToast.show();
}

fetchAndDisplayData();