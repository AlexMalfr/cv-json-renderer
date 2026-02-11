// renderer.js - all DOM creation to render the CV

function displayCV(data) {
    const cvContainer = document.getElementById('cv');

    // empty the container
    while (cvContainer.firstChild) {
        cvContainer.removeChild(cvContainer.firstChild);
    }

    // Create header
    const headerElem = createHeader(data);
    cvContainer.appendChild(headerElem);

    const cvBody = document.createElement('div');
    cvBody.classList.add("cv-body");
    if (data.grid_template_columns) {
        cvBody.style.gridTemplateColumns = data.grid_template_columns;
    }
    
    // Handle zoom
    if (data.zoom) {
        let zoomVal = data.zoom;
        if (typeof zoomVal === 'string' && zoomVal.includes('%')) {
            zoomVal = parseFloat(zoomVal) / 100;
        } else {
            zoomVal = parseFloat(zoomVal);
        }

        if (zoomVal && !isNaN(zoomVal) && zoomVal !== 1) {
            cvContainer.style.zoom = zoomVal;
            // Compensate width and height to maintain A4 visual size
            cvContainer.style.width = `calc(210mm / ${zoomVal})`;
            cvContainer.style.height = `calc(297mm / ${zoomVal})`;
        }
    }

    cvContainer.appendChild(cvBody);

    // // create two colums
    // const leftColumn = document.createElement('div');
    // leftColumn.classList.add("left-column");
    // cvBody.appendChild(leftColumn);

    // const rightColumn = document.createElement('div');
    // rightColumn.classList.add("right-column");
    // cvBody.appendChild(rightColumn);

    // // Add education, experience and skills to left column
    // leftColumn.appendChild(createSection_Education(data));
    // leftColumn.appendChild(createSection_Experience(data));
    // leftColumn.appendChild(createSection_Awards(data));
    // rightColumn.appendChild(createSection_Projects(data));
    // rightColumn.appendChild(createSection_Skills(data));
    // rightColumn.appendChild(createSection_Languages(data));

    const columns_sections = [
        [createSection_Education(data),  0],
        [createSection_Experience(data), 0],
        [createSection_Awards(data),     0],
        [createSection_Projects(data),   1],
        [createSection_Skills(data),     1],
        [createSection_Languages(data),  1],
    ];

    // Create columns (not necessarily two columns, created depending on sections data)
    const columns = {};
    columns_sections.forEach(([section, colIndex]) => {
        if (section == null) return; // skip empty sections
        if (!columns[colIndex]) {
            columns[colIndex] = document.createElement('div');
            columns[colIndex].classList.add("column");
            cvBody.appendChild(columns[colIndex]);
        }
        columns[colIndex].appendChild(section);
    });

    // Create footer
    const footer = createFooter(data);
    if (footer != null) {
        cvContainer.appendChild(footer);
    }
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

    // Add summary to header
    if (data.text != null) {
        const summaryElem = document.createElement('p');
        summaryElem.classList.add("summary");
        summaryElem.textContent = data.text;
        headerElem.appendChild(summaryElem);
    }

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

    const rightElem = document.createElement('div');
    rightElem.classList.add("right");

    // Add name to header
    const nameElem = document.createElement('h1');
    nameElem.textContent = data.name;
    rightElem.appendChild(nameElem);

    // Add objective to header (split into multiple lines for every \n)
    if (data.bio != null) {
        const bioLines = data.bio.split("\n");
        bioLines.forEach(line => {
            const bioElem = document.createElement('p');
            bioElem.classList.add("bio");
            bioElem.textContent = line;
            rightElem.appendChild(bioElem);
        });
    }

    photoAndNameElem.appendChild(rightElem);

    return photoAndNameElem;
}

function createLinks(data, right = false) {
    return createListWithIcons(data.links, "links", right);
}

function createContact(data, right = true) {
    return createListWithIcons(data.contact, "contact", right);
}

function createListWithIcons(data, listClass, right = false) {
    const listElem = document.createElement('address');
    listElem.classList.add(listClass);

    data.forEach(item => {
        const listItemAnchor = document.createElement('a');
        listItemAnchor.title = item.name;
        listItemAnchor.href = item.url;
        listItemAnchor.target = "_blank";

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

function createSection(title, icon) {
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
    if (data.education == null || data.education.length === 0) return null;

    const icon = "fas fa-graduation-cap";
    const educationElem = createSection(i18next.t("education"), icon);
    educationElem.classList.add("section-education");

    data.education.forEach(item => {
        const educationItemElem = document.createElement('div');
        educationItemElem.classList.add("education-item", "item");
        educationElem.appendChild(educationItemElem);

        const linkElem = document.createElement('a');
        if (item.link) {
            linkElem.href = item.link; // if link is defined
            linkElem.target = "_blank";
        }
        educationItemElem.appendChild(linkElem);

        const titleElem = document.createElement('div');
        titleElem.classList.add("title-elem");
        linkElem.appendChild(titleElem);

        const institutionElem = document.createElement('h3');
        institutionElem.textContent = item.institution;
        titleElem.appendChild(institutionElem);

        if (item.years != null) {
            const yearsElem = document.createElement('p');
            yearsElem.classList.add("date");
            yearsElem.textContent = item.years;
            titleElem.appendChild(yearsElem);
        }

        if (item.degree != null) {
            const degreeElem = document.createElement('p');
            if (document.documentElement.lang === 'fr') {
                degreeElem.textContent = item.degree + (item.mention ? ` (Mention "${item.mention}")` : "");
            } else {
                degreeElem.textContent = item.degree + (item.mention ? ` - ${item.mention}` : "");
            }
            degreeElem.classList.add("education-degree");
            linkElem.appendChild(degreeElem);
        }

        if (item.specialization != null) {
            const specializationElem = document.createElement('p');
            specializationElem.textContent = item.specialization;
            specializationElem.classList.add("education-specialization");
            linkElem.appendChild(specializationElem);
        }

        if (item.skills != null) {
            let skillsElem;
            if (item.skills.length == 1) {
                skillsElem = document.createElement('p');
                skillsElem.textContent = item.skills[0];
            } else {
                skillsElem = document.createElement('ul');
                for (let i = 0; i < item.skills.length; i++) {
                    const liElem = document.createElement('li');
                    liElem.textContent = item.skills[i];
                    if (i !== item.skills.length - 1) liElem.textContent += ", ";
                    skillsElem.appendChild(liElem);
                }
            }
            skillsElem.classList.add("education-skills");
            linkElem.appendChild(skillsElem);
        }
    });

    return educationElem;
}

function createSection_Experience(data) {
    if (data.experience == null || data.experience.length === 0) return null;

    const icon = "fas fa-briefcase";
    const experienceElem = createSection(i18next.t("experience"), icon);
    experienceElem.classList.add("section-experience");

    data.experience.forEach(item => {
        const experienceItemElem = document.createElement('div');
        experienceItemElem.classList.add("experience-item", "item");
        experienceElem.appendChild(experienceItemElem);

        const linkElem = document.createElement('a');
        if (item.link) {
            linkElem.href = item.link; // if link is defined
            linkElem.target = "_blank";
        }
        experienceItemElem.appendChild(linkElem);

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

        const positionElem = document.createElement('p');
        positionElem.textContent = item.position;
        positionElem.classList.add("experience-position");
        linkElem.appendChild(positionElem);

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
    if (data.skills == null || data.skills.length === 0) return null;

    const icon = "fas fa-cogs";
    const skillsElem = createSection(i18next.t("skills"), icon);
    skillsElem.classList.add("section-skills");

    data.skills.forEach(item => {
        const skillsItem = document.createElement('div');
        skillsItem.classList.add("skills-item", "item");
        skillsElem.appendChild(skillsItem);

        const titleElem = document.createElement('div');
        titleElem.classList.add("title-elem");
        skillsItem.appendChild(titleElem);

        const skillsTitleElem = document.createElement('h3');
        skillsTitleElem.textContent = item.title;
        titleElem.appendChild(skillsTitleElem);

        const skillListElem = document.createElement('p');
        skillsItem.appendChild(skillListElem);
        for (let i = 0; i < item.skill_list.length; i++) {
            const linkElem = document.createElement('a');
            if (item.skill_list[i].link) {
                linkElem.href = item.skill_list[i].link;
                linkElem.target = "_blank";
            }
            linkElem.textContent = item.skill_list[i].name;
            if (i !== item.skill_list.length - 1) linkElem.textContent += ", ";
            skillListElem.appendChild(linkElem);
        }
    });

    return skillsElem;
}

function createSection_Projects(data) {
    if (data.projects == null || data.projects.length === 0) return null;

    const icon = "fas fa-project-diagram";
    const projectsElem = createSection(i18next.t("projects"), icon);
    projectsElem.classList.add("section-projects");

    data.projects.forEach(item => {
        const projectItemElem = document.createElement('div');
        projectItemElem.classList.add("project-item", "item");
        projectsElem.appendChild(projectItemElem);

        const linkElem = document.createElement('a');
        if (item.link) {
            linkElem.href = item.link; // if link is defined
            linkElem.target = "_blank";
        }
        projectItemElem.appendChild(linkElem);

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

        const descriptionElem = document.createElement('p');
        descriptionElem.textContent = item.description;
        linkElem.appendChild(descriptionElem);
    });

    return projectsElem;
}

function createSection_Awards(data) {
    if (data.awards == null || data.awards.length === 0) return null;
    
    const icon = "fas fa-award";
    const awardsElem = createSection(i18next.t("awards"), icon);
    awardsElem.classList.add("section-awards");

    data.awards.forEach(item => {
        const linkElem = document.createElement('a');
        linkElem.href = item.link;
        linkElem.target = "_blank";
        awardsElem.appendChild(linkElem);

        const awardItemElem = document.createElement('div');
        awardItemElem.classList.add("award-item", "item");
        linkElem.appendChild(awardItemElem);

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

        const achievementElem = document.createElement('p');
        achievementElem.textContent = item.achievement;
        awardItemElem.appendChild(achievementElem);
    });

    return awardsElem;
}

function createSection_Languages(data) {
    if (data.languages == null || data.languages.length === 0) return null;

    const icon = "fas fa-language";
    const languagesElem = createSection(i18next.t("languages"), icon);
    languagesElem.classList.add("section-languages");

    data.languages.forEach(item => {
        const languageItemElem = document.createElement('div');
        languageItemElem.classList.add("language-item", "item");
        languagesElem.appendChild(languageItemElem);

        const linkElem = document.createElement('a');
        if (item.link) {
            linkElem.href = item.link; // if link is defined
            linkElem.target = "_blank";
        }
        languageItemElem.appendChild(linkElem);

        const firstRowElem = document.createElement('div');
        firstRowElem.classList.add("title-elem");
        linkElem.appendChild(firstRowElem);

        const languageElem = document.createElement('h3');
        languageElem.textContent = item.name;
        firstRowElem.appendChild(languageElem);

        const proficiencyElem = document.createElement('p');
        proficiencyElem.textContent = item.proficiency;
        proficiencyElem.classList.add("language-proficiency");
        firstRowElem.appendChild(proficiencyElem);

        if (item.certificate != null) {
            const certificateElem = document.createElement('p');
            certificateElem.textContent = item.certificate;
            certificateElem.classList.add("language-certificate");
            languageItemElem.appendChild(certificateElem);
        }
    });

    return languagesElem;
}

function createFooter(data) {
    if (data.footer == null || data.footer.length === 0) return null;

    const footerElem = document.createElement('footer');
    footerElem.classList.add("cv-footer");

    const linkElem = document.createElement('a');
    if (data.footer.link) {
        linkElem.href = data.footer.link; // if link is defined
        linkElem.target = "_blank";
    }
    footerElem.appendChild(linkElem);

    const imageElem = document.createElement('img');
    imageElem.src = data.footer.image;
    imageElem.alt = "Logo";
    linkElem.appendChild(imageElem);

    const textElem = document.createElement('p');
    textElem.textContent = data.footer.text;
    linkElem.appendChild(textElem);

    return footerElem;
}
