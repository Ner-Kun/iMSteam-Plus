// ==UserScript==
// @name         iMSteam Mod Beta
// @version      0.4
// @description  Modified version of iMSteam, which adds other sites\trackers and more.
// @author       iMAboud. Mod by Ner_Kun
// @license MIT
// @match        https://store.steampowered.com/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    const sites = [
        {name: "Online Fix", url: "https://online-fix.me/index.php?do=search&subaction=search&story=", icon: "https://i.imgur.com/WAXRAUw.png"},
        {name: "Skidrow", url: "https://www.skidrowreloaded.com/?s=", icon: "https://i.imgur.com/sfzB2DE.png"},
        {name: "FitGirl", url: "https://fitgirl-repacks.site/?s=", icon: "https://i.imgur.com/GOFbweI.png"},
        {name: "SteamRIP", url: "https://steamrip.com/?s=", icon: "https://i.imgur.com/tmvOT86.png"},
        {name: "Dodi", url: "https://dodi-repacks.site/?s=", icon: "https://i.imgur.com/g71t1Ge.png"},
        {name: "Gload", url: "https://gload.to/?s=", icon: "https://gload.to/logo.png"},
        {name: "GOG", url: "https://www.gog-games.to/search/", icon: "https://i.imgur.com/wXfz72C.png"},
        {name: "Crack Status", url: "https://crackstatus.net/tracker.php?nm=", icon: "https://crackstatus.net/styles/templates/default/images/Hot_icons/rel/PNL2.png"},
        {name: "RuTracker", url: "https://rutracker.org/forum/tracker.php?nm=", icon: "https://i.imgur.com/FUojuvE.png"},
        {name: "f95zone", url: "https://f95zone.to/search/?q=", icon: "https://f95zone.to/assets/logo.png"}
    ];
    const translations = {
        en: {
            settings: "Settings",
            selectSites: "Select Sites to Display",
            language: "Language:",
            english: "English",
            ukrainian: "Українська",
            save: "Save",
            default: "Default",
            searchOn: "Search on"
        },
        uk: {
            settings: "Налаштування",
            selectSites: "Виберіть сайти для відображення",
            language: "Мова:",
            english: "Англійська",
            ukrainian: "Українська",
            save: "Зберегти",
            default: "За замовчуванням",
            searchOn: "Пошук на"
        }
    };

    let lang = localStorage.getItem('language') || (navigator.language.startsWith('uk')? 'uk' : 'en');

    function t(key) {
        return translations[lang][key] || key;
    }

    function createButton(site, gameName, container) {
        const linkButton = document.createElement("a");
        const searchURL = site.name === "f95zone" ? site.url + encodeURIComponent(gameName) + '&o=relevance' : site.url + encodeURIComponent(gameName);
        linkButton.href = searchURL;
        linkButton.setAttribute("target", "_blank");
        linkButton.title = `${t('searchOn')} ${site.name}`;
        linkButton.style.display = 'inline-block';
        linkButton.style.marginRight = '10px';
        linkButton.style.position = 'relative';

        const img = new Image();
        img.src = site.icon;
        img.alt = site.name;
        img.style.width = '64px';
        img.style.height = '32px';
        img.style.objectFit = 'contain';
        img.style.transition = 'transform 0.3s ease-in-out';
        img.style.borderRadius = '8px';
        img.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.3)';
        img.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';

        linkButton.appendChild(img);
        container.appendChild(linkButton);
    }

    function createButtonsContainer() {
        const gameNameElement = document.getElementById("appHubAppName");
        if (gameNameElement) {
            const buttonsContainer = document.createElement("div");
            buttonsContainer.id = "iMSteamButtonsContainer";
            buttonsContainer.style.marginTop = "10px";
            buttonsContainer.style.position = "relative";
            buttonsContainer.style.left = "0";
            buttonsContainer.style.width = "100%";
            gameNameElement.parentNode.insertBefore(buttonsContainer, gameNameElement.nextSibling);
            return buttonsContainer;
        }
        return null;
    }

    function createSettingsButton() {
        const buttonsContainer = createButtonsContainer();
        if (buttonsContainer) {
            const settingsLink = document.createElement("a");
            settingsLink.href = "#";
            settingsLink.title = t('settings');
            settingsLink.style.display = 'inline-block';
            settingsLink.style.marginRight = '10px';
            settingsLink.style.position = 'relative';
            settingsLink.onclick = () => {
                const panel = document.getElementById("settingsPanel");
                if (panel) {
                    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
                }
                return false;
            };

            const settingsImg = new Image();
            settingsImg.src = "https://cdn.icon-icons.com/icons2/933/PNG/512/settings-cogwheel-button_icon-icons.com_72559.png";
            settingsImg.alt = t('settings');
            settingsImg.style.width = '64px';
            settingsImg.style.height = '32px';
            settingsImg.style.objectFit = 'contain';
            settingsImg.style.transition = 'transform 0.3s ease-in-out';
            settingsImg.style.borderRadius = '8px';
            settingsImg.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.3)';
            settingsImg.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';

            settingsLink.appendChild(settingsImg);
            buttonsContainer.appendChild(settingsLink);
        }
    }

    function createSettingsPanel() {
        const panel = document.createElement("div");
        panel.id = "settingsPanel";
        panel.style.display = 'none';
        panel.style.position = 'fixed';
        panel.style.top = '20px';
        panel.style.right = '20px';
        panel.style.backgroundColor = '#222';
        panel.style.border = '1px solid #ccc';
        panel.style.padding = '10px';
        panel.style.zIndex = '1000';
        panel.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        panel.style.borderRadius = '10px';
        panel.style.color = '#fff';
        panel.style.fontFamily = 'Arial, sans-serif';
        panel.style.display = 'flex';
        panel.style.flexDirection = 'column';

        const title = document.createElement("h3");
        title.textContent = t('selectSites');
        title.style.margin = '0 0 10px 0';
        title.style.textAlign = 'center';
        panel.appendChild(title);

        const sitesContainer = document.createElement("div");
        sitesContainer.style.display = 'flex';
        sitesContainer.style.flexWrap = 'wrap';
        sitesContainer.style.gap = '10px';
        panel.appendChild(sitesContainer);

        const checkboxes = [];
        sites.forEach((site, index) => {
            const label = document.createElement("label");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = JSON.parse(localStorage.getItem(`show_${site.name}`) || 'true');
            checkboxes.push({site, checkbox});
            checkbox.style.marginRight = '5px';
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(site.name));
            label.style.display = 'block';
            label.style.marginBottom = '5px';
            sitesContainer.appendChild(label);
        });

        const controlsContainer = document.createElement("div");
        controlsContainer.style.display = 'flex';
        controlsContainer.style.justifyContent = 'space-between';
        controlsContainer.style.alignItems = 'center';
        panel.appendChild(controlsContainer);

        const saveButton = document.createElement("button");
        saveButton.textContent = t('save');
        saveButton.style.padding = '8px 15px';
        saveButton.style.backgroundColor = '#444';
        saveButton.style.color = '#fff';
        saveButton.style.border = 'none';
        saveButton.style.borderRadius = '5px';
        saveButton.style.cursor = 'pointer';
        saveButton.style.marginBottom = '5px';
        saveButton.onclick = () => {
            checkboxes.forEach(({site, checkbox}) => {
                localStorage.setItem(`show_${site.name}`, checkbox.checked);
            });
            window.location.reload();
        };
        controlsContainer.appendChild(saveButton);

        const languageLabel = document.createElement("label");
        languageLabel.textContent = t('language');
        languageLabel.style.display = 'block';
        languageLabel.style.marginBottom = '5px';
        controlsContainer.appendChild(languageLabel);

        const languageSelect = document.createElement("select");
        languageSelect.style.padding = '5px';
        languageSelect.style.backgroundColor = '#333';
        languageSelect.style.color = '#fff';
        languageSelect.style.border = '1px solid #ccc';
        languageSelect.style.borderRadius = '5px';
        languageSelect.style.marginBottom = '10px';
        languageSelect.onchange = function() {
            localStorage.setItem('language', this.value);
            window.location.reload();
        };
        ['en', 'uk'].forEach(code => {
            const option = document.createElement("option");
            option.value = code;
            option.text = t(code === 'en'? 'english' : 'ukrainian');
            if (code === lang) option.selected = true;
            languageSelect.add(option);
        });
        controlsContainer.appendChild(languageSelect);

        const defaultButton = document.createElement("button");
        defaultButton.textContent = t('default');
        defaultButton.style.padding = '8px 15px';
        defaultButton.style.backgroundColor = '#444';
        defaultButton.style.color = '#fff';
        defaultButton.style.border = 'none';
        defaultButton.style.borderRadius = '5px';
        defaultButton.style.cursor = 'pointer';
        defaultButton.onclick = () => {
            checkboxes.forEach(({site, checkbox}) => {
                checkbox.checked = true;
                localStorage.setItem(`show_${site.name}`, true);
            });
            window.location.reload();
        };
        controlsContainer.appendChild(defaultButton);

        document.body.appendChild(panel);
    }

    function loadButtons() {
        const buttonsContainer = createButtonsContainer();
        if (buttonsContainer) {
            const gameNameElement = document.getElementById("appHubAppName");
            const formattedGameName = gameNameElement.textContent.trim().toLowerCase().replace(/'/g, '').replace(/_/g, ' ');
            sites.forEach(site => {
                if (JSON.parse(localStorage.getItem(`show_${site.name}`) || 'true')) {
                    createButton(site, formattedGameName, buttonsContainer);
                }
            });
        }
    }

    GM_addStyle(`
        #appHubAppName::after {
            content: '';
            display: block;
            clear: both;
        }

        #iMSteamButtonsContainer {
            margin-top: 10px;
            position: relative;
            left: 0;
            width: 100%;
        }

        a {
            display: inline-block;
            transition: transform 0.3s ease-in-out;
            margin-right: 10px;
            position: relative;
        }

        a img {
            width: 64px;
            height: 32px;
            object-fit: contain;
            transition: transform 0.3s ease-in-out;
            border-radius: 8px;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
            background-color: rgba(0, 0, 0, 0.2);
        }

        a:hover img {
            transform: scale(1.1);
        }

        #settingsPanel {
            display: none;
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #222;
            border: 1px solid #ccc;
            padding: 10px;
            z-index: 1000;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            border-radius: 10px;
            color: #fff;
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
        }

        #settingsPanel h3 {
            margin: 0 0 10px 0;
            text-align: center;
        }

        #settingsPanel label {
            display: block;
            margin-bottom: 5px;
        }

        #settingsPanel select {
            padding: 5px;
            background-color: #333;
            color: #fff;
            border: 1px solid #ccc;
            border-radius: 5px;
            margin-bottom: 10px;
        }

        #settingsPanel button {
            padding: 8px 15px;
            background-color: #444;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin-bottom: 5px;
        }

        #settingsPanel .sites-container {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }

        #settingsPanel .controls-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
    `);

    createSettingsButton();
    createSettingsPanel();
    loadButtons();
})();