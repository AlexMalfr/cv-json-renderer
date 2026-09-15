# CV HTML Generator

[English](#english) | [Français](#français)

<table>
  <tr>
    <td valign="center">
      By Alexandre MALFREYT (<a href="https://github.com/AlexMalfr">GitHub</a> | <a href="https://alexandre.malfre.yt/">Website</a>)
    </td>
    <td align="right">
      <img width="64" height="64" alt="profile_picture_512x512" src="https://github.com/user-attachments/assets/97947f3f-1437-45a0-9a78-568037c31e2d" />
    </td>
  </tr>
</table>

---

## Screenshot

<img width="1420" height="798" alt="image" src="https://github.com/user-attachments/assets/671735f2-d76a-485e-9321-69b355067522" />

---

<a name="english"></a>
## 🇬🇧 English

This project is a static site generator that creates a resume (CV) from a JSON configuration file. It renders the CV in HTML/CSS, allowing for easy updates and direct export to PDF or printing.

> [!WARNING]
> I made this generator solely for my personal use, so it is not designed to be a general-purpose tool (only supports one theme, a lot of hardcoded values, etc.)
> 
> I decided to make it public in case it can be useful to someone else, but I won't be providing extra support for it.
>
> However, feel free to use it to create your own CV, and to adapt the code to your needs! 😉

### 🔗 Link to my CV
You can find my CV on [this page](https://alexandre.malfre.yt/cv) of my personal website.

### 🚀 How to use (local)

> [!NOTE]
> To run this project locally, a server is required to bypass CORS protections that prevent browsers from loading JSON files and other local files directly from the filesystem.
> 
> (It does not need to be a Python server, any local server will work, but the included `start-server.bat` uses Python for simplicity)

1.  **Prerequisites**: You need Python installed to run the local server.
2.  **Start the Server**: Double-click on `start-server.bat`. This will start a local web server and open your default browser to `http://localhost:8080`.
3.  **Choose your CV**: Use the dropdown menu at the top of the page to select a JSON file from the `sources/cv-data/` directory.

### 🚀 How to deploy (online)

1.  **Prerequisites**: You need a web server capable of serving static files (via FTP, SFTP, or a web hosting service).
2.  **Deployment**: Copy all the project files into the root directory of your web server.

### 📝 Editing Data

*   **Data Location**: Place your JSON files in the `sources/cv-data/` folder.
*   **Template**: You can use [sources/cv-data/cv-data.template.json](sources/cv-data/cv-data.template.json) as a starting point.
*   **Default File**: The generator looks for `sources/cv-data/cv-data.json` by default.

### 🎨 Icons (FontAwesome)

This generator uses a local, minimal **Font Awesome Pro 7.1.0** subset containing only the icons currently used by the application and CV data.
*   Add one of the classes declared in `sources/css/fontawesome-minimal.css` to your JSON file (e.g., `"icon": "fas fa-phone"`).
*   When adding another icon, rebuild both the CSS mapping and the corresponding subset webfonts from `fontawesome-pro_v7.1.0.zip`.

---

<a name="français"></a>
## 🇫🇷 Français

Ce projet est un générateur de site statique qui crée un CV à partir d'un fichier de configuration JSON. Il génère le CV en HTML/CSS, permettant des mises à jour faciles et une exportation directe en PDF ou impression.

> [!WARNING]
> J'ai créé ce générateur uniquement pour mon usage personnel, il n'est donc pas conçu pour être un outil généraliste (ne supporte qu'un thème, beaucoup de valeurs en dur, etc.)
>
> J'ai décidé de le rendre public au cas où il pourrait être utile à quelqu'un d'autre, mais je ne fournirai pas de support supplémentaire pour celui-ci.
>
> Cependant, n'hésitez pas à l'utiliser pour créer votre propre CV, et à adapter le code à vos besoins ! 😉

### 🔗 Lien vers mon CV
Vous pouvez trouver mon CV sur [cette page](https://alexandre.malfre.yt/cv) de mon site personnel.

### 🚀 Comment l'utiliser (local)

> [!NOTE]
> Pour exectuer ce projet en local, un serveur est nécessaire pour contourner les protections CORS qui empêchent les navigateurs de charger les fichiers JSON et autres fichiers locaux directement depuis le système de fichiers.
> 
> (Il n'est pas nécessaire que ce soit un serveur Python, n'importe quel serveur local fonctionnera, mais le `start-server.bat` inclus utilise Python pour la simplicité)

1.  **Prérequis** : Vous avez besoin de Python installé pour lancer le serveur local.
2.  **Lancer le serveur** : Double-cliquez sur `start-server.bat`. Cela démarrera un serveur web local et ouvrira votre navigateur par défaut sur `http://localhost:8080`.
3.  **Choisir votre CV** : Utilisez le menu déroulant en haut de la page pour sélectionner un fichier JSON dans le dossier `sources/cv-data/`.

### 🚀 Comment déployer (en ligne)

1.  **Prérequis** : Vous devez avoir un serveur web capable de servir les fichiers statiques (via FTP, SFTP, ou un service d'hébergement web).
2.  **Déploiement** : Copiez tous les fichiers du projet dans le répertoire racine de votre serveur web.

### 📝 Édition des données

*   **Emplacement des données** : Placez vos fichiers JSON dans le dossier `sources/cv-data/`.
*   **Modèle** : Vous pouvez utiliser [sources/cv-data/cv-data.template.json](sources/cv-data/cv-data.template.json) comme point de départ.
*   **Fichier par défaut** : Le générateur cherche par défaut le fichier `sources/cv-data/cv-data.json`.

### 🎨 Icônes (FontAwesome)

Ce générateur utilise un sous-ensemble local et minimal de **Font Awesome Pro 7.1.0**, limité aux icônes actuellement utilisées par l’application et les données des CV.
*   Ajoutez dans vos JSON une classe déclarée dans `sources/css/fontawesome-minimal.css` (par exemple, `"icon": "fas fa-phone"`).
*   Pour ajouter une nouvelle icône, reconstruisez le mapping CSS et les fontes sous-ensembles correspondantes à partir de `fontawesome-pro_v7.1.0.zip`.
