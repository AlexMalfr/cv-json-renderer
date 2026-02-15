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

<img width="1437" height="764" alt="image" src="https://github.com/user-attachments/assets/a97b5a0b-2812-41e1-9698-e9c66229011d" />

---

<a name="english"></a>
## 🇬🇧 English

This project is a static site generator that creates a resume (CV) from a JSON configuration file. It renders the CV in HTML/CSS, allowing for easy updates and direct export to PDF or printing.

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

This generator uses **FontAwesome** for icons. You can use any icon class from the included library directly.
*   Browse icons on [FontAwesome.com](https://fontawesome.com/search) (look for version 6 or compatible).
*   Add the icon class to your JSON file (e.g., `"icon": "fas fa-phone"`).

---

<a name="français"></a>
## 🇫🇷 Français

Ce projet est un générateur de site statique qui crée un CV à partir d'un fichier de configuration JSON. Il génère le CV en HTML/CSS, permettant des mises à jour faciles et une exportation directe en PDF ou impression.

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

Ce générateur utilise **FontAwesome** pour les icônes. Vous pouvez utiliser n'importe quelle classe d'icône directement.
*   Parcourez les icônes sur [FontAwesome.com](https://fontawesome.com/search) (cherchez la version 6 ou compatible).
*   Ajoutez la classe de l'icône dans votre fichier JSON (par exemple, `"icon": "fas fa-phone"`).
