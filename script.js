document.addEventListener('DOMContentLoaded', () => {
    const welcomeScreen = document.getElementById('welcome-screen');
    const startButton = document.getElementById('start-button');
    const body = document.body;
    const themeToggleBtn = document.getElementById('theme-toggle');
    const formPanel = document.querySelector('.form-panel');
    const cvPreview = document.querySelector('.cv-document');
    const exportBtn = document.querySelector('.export-btn');

    const formFields = {
        personal: ['name', 'title', 'email', 'phone'],
        summary: ['summary'],
        experience: ['exp-title', 'exp-company', 'exp-city', 'exp-period', 'exp-description'],
        education: ['edu-school', 'edu-degree', 'edu-period'],
        skills: ['skill'],
        languages: ['language']
    };

    const data = {
        personal: {},
        summary: '',
        experience: [],
        education: [],
        skills: [],
        languages: []
    };

    const cvSections = {
        summary: document.getElementById('summary-section'),
        experience: document.getElementById('experience-section'),
        education: document.getElementById('education-section'),
        skills: document.getElementById('skills-section'),
        languages: document.getElementById('languages-section')
    };

    const updatePreview = () => {
        document.getElementById('cv-name').innerText = data.personal.name || '';
        document.getElementById('cv-title').innerText = data.personal.title || '';
        document.getElementById('cv-email').innerText = data.personal.email || '';
        document.getElementById('cv-phone').innerText = data.personal.phone || '';
        
        const personalHasData = Object.values(data.personal).some(val => val.trim() !== '');
        document.querySelector('.cv-header').style.display = personalHasData ? 'block' : 'none';


        document.getElementById('cv-summary').innerText = data.summary || '';
        cvSections.summary.classList.toggle('visible', data.summary.trim() !== '');


        const expList = document.getElementById('cv-experience-list');
        expList.innerHTML = '';
        data.experience.forEach((item) => {
            const div = document.createElement('div');
            div.className = 'cv-item';
            div.innerHTML = `
                <h4>${item.title || ''}</h4>
                <p>${item.company || ''}</p>
                <p>${item.city || ''} <span class="period">${item.period || ''}</span></p>
                <p>${item.description || ''}</p>
            `;
            expList.appendChild(div);
        });
        cvSections.experience.classList.toggle('visible', data.experience.length > 0);


        const eduList = document.getElementById('cv-education-list');
        eduList.innerHTML = '';
        data.education.forEach((item) => {
            const div = document.createElement('div');
            div.className = 'cv-item';
            div.innerHTML = `
                <h4>${item.school || ''}</h4>
                <p>${item.degree || ''}</p>
                <p class="period">${item.period || ''}</p>
            `;
            eduList.appendChild(div);
        });
        cvSections.education.classList.toggle('visible', data.education.length > 0);


        const skillsList = document.getElementById('cv-skills-list');
        skillsList.innerHTML = '';
        data.skills.forEach(skill => {
            if (skill.trim() !== '') {
                const li = document.createElement('li');
                li.innerText = skill;
                skillsList.appendChild(li);
            }
        });
        cvSections.skills.classList.toggle('visible', data.skills.length > 0);
        
        const languagesList = document.getElementById('cv-languages-list');
        languagesList.innerHTML = '';
        data.languages.forEach(language => {
            if (language.trim() !== '') {
                const li = document.createElement('li');
                li.innerText = language;
                languagesList.appendChild(li);
            }
        });
        cvSections.languages.classList.toggle('visible', data.languages.length > 0);
    };

    formFields.personal.forEach(field => {
        const input = document.getElementById(field);
        if (input) {
            input.addEventListener('input', (e) => {
                data.personal[field] = e.target.value;
                updatePreview();
            });
        }
    });

    const summaryInput = document.getElementById('summary');
    if (summaryInput) {
        summaryInput.addEventListener('input', (e) => {
            data.summary = e.target.value;
            updatePreview();
        });
    }

    const setupAddButton = (buttonId, sectionName, formIds, listId, isList = false) => {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', () => {
                const itemData = {};
                let hasContent = false;
                formIds.forEach(id => {
                    const input = document.getElementById(id);
                    if (input && input.value.trim() !== '') {
                        itemData[id.split('-')[1] || id] = input.value.trim();
                        hasContent = true;
                        input.value = '';
                    } else {
                        itemData[id.split('-')[1] || id] = '';
                    }
                });

                if (hasContent) {
                    if (isList) {
                        data[sectionName].push(itemData[formIds[0]]);
                    } else {
                        data[sectionName].push(itemData);
                    }
                    updatePreview();
                    renderItemList(sectionName, listId, isList);
                }
            });
        }
    };

    const renderItemList = (sectionName, listId, isList = false) => {
        const listContainer = document.getElementById(listId);
        listContainer.innerHTML = '';

        data[sectionName].forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'item';
            
            let displayHtml = '';
            if (isList) {
                displayHtml = `<span>${item}</span>`;
            } else {
                displayHtml = `
                    <h4>${item.title || item.school || 'Sem Título'}</h4>
                    <p>${item.company || item.degree || 'Sem Detalhes'} - ${item.period || 'Sem Período'}</p>
                `;
            }
            
            div.innerHTML = `
                ${displayHtml}
                <button class="remove-btn" data-index="${index}" data-section="${sectionName}">&times;</button>
            `;
            listContainer.appendChild(div);
        });
    };

    formPanel.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-btn')) {
            const index = e.target.getAttribute('data-index');
            const section = e.target.getAttribute('data-section');
            data[section].splice(index, 1);
            updatePreview();
            renderItemList(section, e.target.parentNode.parentNode.id, section === 'skills' || section === 'languages');
        }
    });

    setupAddButton('add-exp', 'experience', formFields.experience, 'exp-list');
    setupAddButton('add-edu', 'education', formFields.education, 'edu-list');
    setupAddButton('add-skill', 'skills', formFields.skills, 'skills-list', true);
    setupAddButton('add-lang', 'languages', formFields.languages, 'lang-list', true);


    if (startButton) {
        startButton.addEventListener('click', () => {
            welcomeScreen.classList.add('fade-out');
            setTimeout(() => {
                welcomeScreen.style.display = 'none';
                body.classList.add('app-started');
                updatePreview();
            }, 800);
        });
    }

    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'light') {
        body.classList.add('light-mode-active');
    }

    themeToggleBtn.addEventListener('click', () => {
        body.classList.toggle('light-mode-active');
        if (body.classList.contains('light-mode-active')) {
            localStorage.setItem('theme', 'light');
        } else {
            localStorage.setItem('theme', 'dark');
        }
    });

    exportBtn.addEventListener('click', () => {
        const isLightModeActive = body.classList.contains('light-mode-active');
        
        body.classList.add('print-mode');
        
        const formPanelElement = document.querySelector('.form-panel');
        const cvDocumentElement = document.querySelector('.cv-document');
        if (formPanelElement) formPanelElement.style.boxShadow = 'none';
        if (cvDocumentElement) cvDocumentElement.style.boxShadow = 'none';

        setTimeout(() => {
            html2canvas(cvPreview, { scale: 2 }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF('p', 'mm', 'a4');
                const imgWidth = 210;
                const pageHeight = 297;
                const imgHeight = canvas.height * imgWidth / canvas.width;
                let heightLeft = imgHeight;
                let position = 0;

                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }

                pdf.save('curriculo.pdf');

                body.classList.remove('print-mode');
                if (!isLightModeActive) {
                    if (formPanelElement) formPanelElement.style.boxShadow = '';
                    if (cvDocumentElement) cvDocumentElement.style.boxShadow = '';
                }
            });
        }, 50);
    });

    updatePreview();
});