let employees = [];
let roles = [];
let tbody;
let employeesFilter;

fetchDada();

async function fetchDada() {
  [employees, roles] = await Promise.all([
    fetchJson("http://localhost:3000/employees"),
    fetchJson("http://localhost:3000/roles"),
  ]);

  nameAsc();

  renderTbody(employees, roles);
  let filters = renderBoxFilter();
  document.getElementById("boxFilter").innerHTML = filters;

  selectCheckbox();
}

function fetchJson(url) {
  return fetch(url).then((resp) => {
    return resp.json();
  });
}

function renderTbody(employees, roles) {
  let amount = document.getElementById("amount");
  amount.textContent = employees.length;

  let rows = employees.map((employee) => {
    let role = roles.find((role) => role.id == employee.role_id);
    return `<tr>
              <td class="colId">${employee.id}</td>
              <td>${employee.name}</td>
              <td>${role.name}</td>
              <td class="colSalary">${employee.salary}</td>
            </tr>`;
  });
  tbody = rows.join("");
  return (document.getElementById("tbodyEmployees").innerHTML = tbody);
}

function renderBoxFilter() {
  let filters = roles.map((role) => {
    return `<div>
              <input type="checkbox" name="filter" id="${role.id}" value="${role.id}" />
              <label for="${role.id}">${role.name}</label>
            </div>`;
  });
  return filters.join("");
}

function nameAsc() {
  employees.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    } else if (a.name > b.name) {
      return 1;
    } else {
      return 0;
    }
  });
}

function salaryAsc() {
  employees.sort((a, b) => {
    if (a.salary < b.salary) {
      return -1;
    } else if (a.salary > b.salary) {
      return 1;
    } else {
      return 0;
    }
  });
}

function selectCheckbox() {
  const checkbox = document.querySelectorAll("[name=filter]");
  for (let i = 0; i < checkbox.length; i++) {
    checkbox[i].addEventListener("click", getFilter, false);
  }
}

function getFilter() {
  const filter = document.querySelectorAll("[name=filter]:checked");
  document.getElementById("tbodyEmployees").innerHTML = "";
  let checkFilter = [];
  for (let i = 0; i < filter.length; i++) {
    checkFilter.push(filter[i].value);
  }

  employeesFilter = employees.filter((item) => {
    let select;
    for (let i = 0; i < checkFilter.length; i++) {
      select = item.role_id == checkFilter[i] || select;
    }
    return select;
  });

  if (employeesFilter.length > 0) {
    renderTbody(employeesFilter, roles);
  } else {
    renderTbody(employees, roles);
  }
}

const comboSort = document.getElementById("sortBy");

comboSort.addEventListener("change", () => {
  let orderby = comboSort.value;

  if (orderby == 1) {
    nameAsc();
  }
  if (orderby == 2) {
    nameAsc();
    employees.reverse();
  }
  if (orderby == 3) {
    salaryAsc();
  }
  if (orderby == 4) {
    salaryAsc();
    employees.reverse();
  }
  renderTbody(employees, roles);
});
