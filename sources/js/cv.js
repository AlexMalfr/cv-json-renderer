function loadI18n() {
    let langs = ['en', 'fr'];
    let translations = {};
    let promises = langs.map(lang => {
        return new Promise((resolve, reject) => {
            let fileURL = "sources/i18n/" + lang + ".json";
            let request = new XMLHttpRequest();
            request.open("GET", fileURL, true);
            request.responseType = "json";
            request.onload = function () {
                if (request.status >= 200 && request.status < 300) {
                    translations[lang] = { "translation": request.response };
                    resolve();
                } else {
                    reject(new Error('Request failed: ' + request.statusText));
                }
            };
            request.onerror = function () {
                reject(new Error('Network error'));
            };
            request.send();
        });
    });

    return Promise.all(promises).then(() => translations);
}

function initI18n(translations) {
    i18next.init({
        lng: 'fr',
        debug: true,
        resources: translations
    }, function (err, t) {
    });
}

document.addEventListener('DOMContentLoaded', function () {
    loadI18n().then(translations => {
        initI18n(translations);
    }).catch(error => console.error('Failed to load translations:', error));

    // load JSON data from a file
    let cvData = null;
    // let fileURL = "sources/cv-data.template.json";
    let fileURL = "sources/cv-data.json";
    let request = new XMLHttpRequest();
    request.open("GET", fileURL, true);
    request.responseType = "json";
    request.send();
    request.onload = function () {
        cvData = request.response;
        console.log(cvData);

        displayCV(cvData);

        // Change favicon and title from the JSON data
        document.title = `${cvData.name} - CV`;
        let favicon = document.getElementById('favicon');
        favicon.href = cvData.profile_picture;
        let title = document.getElementById('title');
    };
    request.onloadend = function () {
        title.textContent = `${cvData.name} - CV`;
    }
});

function displayCV(data) {
    const cvContainer = document.getElementById('cv');

    // Create header
    const headerElem = createHeader(data);
    cvContainer.appendChild(headerElem);

    const cvBody = document.createElement('div');
    cvBody.classList.add("cv-body");
    cvContainer.appendChild(cvBody);

    // create two colums
    const leftColumn = document.createElement('div');
    leftColumn.classList.add("left-column");
    cvBody.appendChild(leftColumn);

    const rightColumn = document.createElement('div');
    rightColumn.classList.add("right-column");
    cvBody.appendChild(rightColumn);

    // Add education, experience and skills to left column
    leftColumn.appendChild(createSection_Education(data));
    leftColumn.appendChild(createSection_Experience(data));
    leftColumn.appendChild(createSection_Awards(data));
    rightColumn.appendChild(createSection_Projects(data));
    rightColumn.appendChild(createSection_Skills(data));
    rightColumn.appendChild(createSection_Languages(data));

    cvBody.appendChild(createFooter(data));
}



/* ---------- Header ---------- */

function createHeader(data) {
    const headerElem = document.createElement('header');
    headerElem.classList.add("cv-header");
    
    // Add photo and name to header
    const photoAndNameElem = createPhotoAndName(data);
    headerElem.appendChild(photoAndNameElem);

    // Add contact information to header
    const contactAndLinksElem = document.createElement('div');
    contactAndLinksElem.classList.add("contact-and-links");
    contactAndLinksElem.appendChild(createLinks(data, false));
    contactAndLinksElem.appendChild(createContact(data, true));
    headerElem.appendChild(contactAndLinksElem);

    return headerElem;
}

function createPhotoAndName(data) {
    const photoAndNameElem = document.createElement('div');
    photoAndNameElem.classList.add("photo-and-name");

    // Add photo to header
    const photoElem = document.createElement('img');
    photoElem.src = data.profile_picture;
    photoElem.alt = "Profile photo";
    photoAndNameElem.appendChild(photoElem);

    rightElem = document.createElement('div');
    rightElem.classList.add("right");

    // Add name to header
    const nameElem = document.createElement('h1');
    nameElem.textContent = data.name;
    rightElem.appendChild(nameElem);

    // Add objective to header
    const bioElem = document.createElement('p');
    bioElem.classList.add("bio");
    bioElem.textContent = data.bio;
    rightElem.appendChild(bioElem);

    photoAndNameElem.appendChild(rightElem);

    return photoAndNameElem;
}

function createLinks(data, right=false) {
    return createListWithIcons(data.links, "links", right);
}

function createContact(data, right=true) {
    return createListWithIcons(data.contact, "contact", right);
}

function createListWithIcons(data, listClass, right=false) {
    const listElem = document.createElement('address');
    listElem.classList.add(listClass);

    data.forEach(item => {
        const listItemAnchor = document.createElement('a');
        listItemAnchor.title = item.name;
        listItemAnchor.href = item.url;
        
        const listItemElem = document.createElement('p');
        listItemElem.textContent = item.label;
        listItemAnchor.appendChild(listItemElem);
        
        listElem.appendChild(listItemAnchor);

        const iconElem = document.createElement('i');
        iconElem.className = item.icon; // add Font Awesome icon
        iconElem.classList.add("icon");
        if (right) {
            listItemElem.appendChild(iconElem, listItemElem.firstChild);
        } else {
            listItemElem.insertBefore(iconElem, listItemElem.firstChild);
        }
    });

    return listElem;
}



/* ---------- Sections ---------- */

function createSection(data, title, icon) {
    const sectionElem = document.createElement('section');
    sectionElem.classList.add("section");

    // ajouter un titre de section
    const titleElem = document.createElement('h2');
    titleElem.textContent = title;

    // ajouter un icone à gauche
    const iconElem = document.createElement('i');
    iconElem.className = icon; // add Font Awesome icon
    iconElem.classList.add("icon");
    titleElem.insertBefore(iconElem, titleElem.firstChild);

    sectionElem.appendChild(titleElem);
    return sectionElem;
}

function createSection_Education(data) {
    const icon = data.icons.education;
    const educationElem = createSection(data, "Éducation", icon);
    educationElem.classList.add("section-education");

    data.education.forEach(item => {
        // Création de l'élément
        const educationItemElem = document.createElement('div');
        educationItemElem.classList.add("education-item");
        educationItemElem.classList.add("item");
        educationElem.appendChild(educationItemElem);

        // Création du lien
        const linkElem = document.createElement('a');
        item.link ? linkElem.href = item.link : null; // if link is defined
        educationItemElem.appendChild(linkElem);

        // Titre et date
        const titleElem = document.createElement('div');
        titleElem.classList.add("title-elem");
        linkElem.appendChild(titleElem);

        const institutionElem = document.createElement('h3');
        institutionElem.textContent = item.institution;
        titleElem.appendChild(institutionElem);
        
        const yearsElem = document.createElement('p');
        yearsElem.classList.add("date");
        yearsElem.textContent = item.years;
        titleElem.appendChild(yearsElem);
        
        // Diplôme
        const degreeElem = document.createElement('p');
        degreeElem.textContent = item.degree + (item.mention ? ` (Mention "${item.mention}")` : "")
        degreeElem.classList.add("education-degree");
        linkElem.appendChild(degreeElem);

        // Spécialisation
        const specializationElem = document.createElement('p');
        specializationElem.textContent = item.specialization;
        specializationElem.classList.add("education-specialization");
        linkElem.appendChild(specializationElem);

        // Compétences
        const skillsElem = document.createElement('p');
        skillsElem.textContent = item.skills.join(", ");
        skillsElem.classList.add("education-skills");
        linkElem.appendChild(skillsElem);
    });

    return educationElem;
}

function createSection_Experience(data) {
    const icon = data.icons.experience;
    const experienceElem = createSection(data, "Expérience", icon);
    experienceElem.classList.add("section-experience");

    data.experience.forEach(item => {
        // Création de l'élément
        const experienceItemElem = document.createElement('div');
        experienceItemElem.classList.add("experience-item");
        experienceItemElem.classList.add("item");
        experienceElem.appendChild(experienceItemElem);

        // Création du lien
        const linkElem = document.createElement('a');
        item.link ? linkElem.href = item.link : null; // if link is defined
        experienceItemElem.appendChild(linkElem);

        // Titre et date
        const titleElem = document.createElement('div');
        titleElem.classList.add("title-elem");
        linkElem.appendChild(titleElem);

        const companyElem = document.createElement('h3');
        companyElem.textContent = item.company;
        titleElem.appendChild(companyElem);
        
        const dateElem = document.createElement('p');
        dateElem.classList.add("date");
        dateElem.textContent = item.date;
        titleElem.appendChild(dateElem);

        // Poste
        const positionElem = document.createElement('p');
        positionElem.textContent = item.position;
        positionElem.classList.add("experience-position");
        linkElem.appendChild(positionElem);

        // Description
        if (item.tasks != null) {
            const tasksElem = document.createElement('p');
            tasksElem.textContent = item.tasks.join(", ");
            tasksElem.classList.add("experience-tasks");
            linkElem.appendChild(tasksElem);
        }
    });

    return experienceElem;
}

function createSection_Skills(data) {
    const icon = data.icons.skills;
    const skillsElem = createSection(data, "Compétences", icon);
    skillsElem.classList.add("section-skills");

    data.skills.forEach(item => {
        // Création de l'élément
        const skillsItem = document.createElement('div');
        skillsItem.classList.add("skills-item")
        skillsItem.classList.add("item")
        skillsElem.appendChild(skillsItem);
        
        // Titre de la catégorie
        const titleElem = document.createElement('div');
        titleElem.classList.add("title-elem");
        skillsItem.appendChild(titleElem);

        const skillsTitleElem = document.createElement('h3');
        skillsTitleElem.textContent = item.title;
        titleElem.appendChild(skillsTitleElem);
        
        // Liste des compétences
        const skillListElem = document.createElement('p');
        skillsItem.appendChild(skillListElem);
        for (let i = 0; i < item.skill_list.length; i++) {
            const linkElem = document.createElement('a');
            if (item.skill_list[i].link) {
                // if link is defined
                linkElem.href = item.skill_list[i].link;
            }
            linkElem.textContent = item.skill_list[i].name;
            i != item.skill_list.length - 1 ? linkElem.textContent += ", " : null;
            skillListElem.appendChild(linkElem);
        }
    });

    return skillsElem;
}

function createSection_Projects(data) {
    const icon = data.icons.projects;
    const projectsElem = createSection(data, "Projets", icon);
    projectsElem.classList.add("section-projects");

    data.projects.forEach(item => {
        // Création de l'élément
        const projectItemElem = document.createElement('div');
        projectItemElem.classList.add("project-item");
        projectItemElem.classList.add("item");
        projectsElem.appendChild(projectItemElem);

        // Lien
        const linkElem = document.createElement('a');
        item.link ? linkElem.href = item.link : null; // if link is defined
        projectItemElem.appendChild(linkElem);

        // Titre et date
        const titleElem = document.createElement('div');
        titleElem.classList.add("title-elem");
        linkElem.appendChild(titleElem);

        const nameElem = document.createElement('h3');
        nameElem.textContent = item.name;
        titleElem.appendChild(nameElem);

        const dateElem = document.createElement('p');
        dateElem.classList.add("date");
        dateElem.textContent = item.date;
        titleElem.appendChild(dateElem);

        // Description
        const descriptionElem = document.createElement('p');
        descriptionElem.textContent = item.description;
        linkElem.appendChild(descriptionElem);
    });

    return projectsElem;
}

function createSection_Awards(data) {
    const icon = data.icons.awards;
    const awardsElem = createSection(data, "Récompenses", icon);
    awardsElem.classList.add("section-awards");

    data.awards.forEach(item => {
        // Création du lien
        const linkElem = document.createElement('a');
        linkElem.href = item.link;
        awardsElem.appendChild(linkElem);

        // Création de l'élément
        const awardItemElem = document.createElement('div');
        awardItemElem.classList.add("award-item");
        awardItemElem.classList.add("item");
        linkElem.appendChild(awardItemElem);

        // Titre et date
        const titleElem = document.createElement('div');
        titleElem.classList.add("title-elem");
        awardItemElem.appendChild(titleElem);

        const nameElem = document.createElement('h3');
        nameElem.textContent = item.name;
        titleElem.appendChild(nameElem);

        const yearElem = document.createElement('p');
        yearElem.classList.add("date");
        yearElem.textContent = item.year;
        titleElem.appendChild(yearElem);

        // Description
        const achievementElem = document.createElement('p');
        achievementElem.textContent = item.achievement;
        awardItemElem.appendChild(achievementElem);
    });

    return awardsElem;
}

function createSection_Languages(data) {
    const icon = data.icons.languages;
    const languagesElem = createSection(data, "Langues", icon);
    languagesElem.classList.add("section-languages");

    data.languages.forEach(item => {
        // Création du lien
        const linkElem = document.createElement('a');
        item.link ? linkElem.href = item.link : null; // if link is defined
        languagesElem.appendChild(linkElem);
        
        // Création de l'élément
        const languageItemElem = document.createElement('div');
        languageItemElem.classList.add("language-item");
        languageItemElem.classList.add("item");
        linkElem.appendChild(languageItemElem);

        // Langue
        const languageElem = document.createElement('h3');
        languageElem.textContent = item.name;
        languageItemElem.appendChild(languageElem);

        // Niveau
        const proficiencyElem = document.createElement('p');
        proficiencyElem.textContent = item.proficiency;
        languageItemElem.appendChild(proficiencyElem);
    });

    return languagesElem;
}

function createFooter(data) {
    return document.createElement('footer');
}