class Person {
    constructor(name, height, homeworld) {
        this.name = name;
        this.height = height;
        this.homeworld = homeworld;
    }
}

const peopleArr = [];
const itemsPerPage = 10;
let currentPage = 1;
const container = document.querySelector('.container');
const nextButton = document.getElementById('next');
const prevButton = document.getElementById('prev');
const spinner = document.querySelector('.spinner');

async function getPeoples(currentPage, itemsPerPage) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const response = await fetch(`https://swapi.dev/api/people/?page=${currentPage}`);
    const data = await response.json();
    const peopleData = data.results;

    const promises = [];

    peopleData.forEach(personData => {
        const promise = getHomeworld(personData.homeworld)
            .then(homeworldData => {
                const person = new Person(personData.name, personData.height, homeworldData.name);
                peopleArr.push(person);
            })
            .catch(err => {
                console.log(err);
            });

        promises.push(promise);
    });

    await Promise.all(promises);
}


function getHomeworld(url) {
    return fetch(url)
        .then(res => res.json());
}

function pagination(page){
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const paginatedPeople = peopleArr.slice(startIndex, endIndex);
    paginatedPeople.forEach(person => {
        createHtmlElements (person.name, person.height, person.homeworld);
    })
}

function createHtmlElements (name, height, homeworld){
    const peopleRowDiv = document.createElement('div');
    peopleRowDiv.classList.add("peoplerow");

    const nameDiv = document.createElement('div');
    nameDiv.classList.add('inline');

    const nameLabelH1 = document.createElement('h1');
    nameLabelH1.classList.add('label');
    nameLabelH1.textContent = 'Name:';

    const nameH1 = document.createElement('h1');
    nameH1.textContent = name;

    nameDiv.appendChild(nameLabelH1);
    nameDiv.appendChild(nameH1);


    const heightDiv = document.createElement('div');
    heightDiv.classList.add('inline');

    const heightLabelH1 = document.createElement('h1');
    heightLabelH1.classList.add('label');
    heightLabelH1.textContent = 'Height:';

    const heightH1 = document.createElement('h1');
    heightH1.textContent  = height;

    heightDiv.appendChild(heightLabelH1);
    heightDiv.appendChild(heightH1);


    const homeworldDiv = document.createElement('div');
    homeworldDiv.classList.add('inline');

    const homeworldLabelH1 = document.createElement('h1');
    homeworldLabelH1.classList.add('label');
    homeworldLabelH1.textContent = 'Homeworld:';

    const homeworldH1 = document.createElement('h1');
    homeworldH1.textContent = homeworld;

    homeworldDiv.appendChild(homeworldLabelH1);
    homeworldDiv.appendChild(homeworldH1);

    peopleRowDiv.appendChild(nameDiv);
    peopleRowDiv.appendChild(heightDiv);
    peopleRowDiv.appendChild(homeworldDiv);

    container.appendChild(peopleRowDiv);

}


async function renderPersonData() {
    spinner.style.display = 'block';
    await getPeoples(currentPage, itemsPerPage);
    console.log(peopleArr);
    await pagination(currentPage);
    spinner.style.display = 'none';
    if (currentPage != 1) {
      prevButton.style.display = 'block';
    } else {
      prevButton.style.display = 'none';
    }
    nextButton.style.display = 'block';
  }
  
  renderPersonData();
  
  nextButton.addEventListener('click', () => {
    currentPage += 1;
    container.innerHTML = '';
    renderPersonData();
  });
  
  prevButton.addEventListener('click', () => {
    currentPage -= 1;
    container.innerHTML = '';
    renderPersonData();
  });