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
> Use a local HTTP server so the browser can fetch the CV data and translations. The included `start-server.bat` uses Python.

1.  **Prerequisites**: You need Python installed to run the local server.
2.  **Start the Server**: Double-click on `start-server.bat`. This will start a local web server and open your default browser to `http://localhost:8080`.
3.  **Choose your CV**: Use the dropdown menu or open `http://localhost:8080/?file=sources/cv-data/cv-data.template.json`.

### 🚀 How to deploy (online)

Copy `index.html` and the `sources/` assets to a static web host, keeping the directory structure. Include the CV files you intend to publish. The dropdown relies on a directory listing for `sources/cv-data/`. Direct `?file=...` links also work on hosts with directory listings disabled.

### 📝 Editing Data

Copy the [example template](sources/cv-data/cv-data.template.json) to a new file under `sources/cv-data/`. Edit `data` for the CV content and `meta` for display settings. To select the CV that opens without a `?file` parameter, create `sources/cv-data/default.txt` with the filename on one line. The fallback is `sources/cv-data/cv-data.json`.

| Field | Purpose |
| --- | --- |
| `meta.title` | Labels the CV in the dropdown and contributes to the browser tab title. |
| `meta.lang` | Selects English (`en`) or French (`fr`) for shared section headings. |
| `meta.hidden` | Set to `true` to hide the variant from the dropdown unless it is already open. Direct links still work. |
| `meta.grid_template_columns` | Sets the CSS column widths, for example `"2fr 1fr"`. |
| `meta.zoom` | Scales the rendered CV, for example `"95%"`. Check the A4 print preview after adjusting it or the column widths. |

CV data files support `//` line comments, `/* ... */` block comments and trailing commas in both the renderer and the dropdown. You can comment out optional entries and restore them later. Strict JSON tools may reject this syntax.

### 🌐 Translations

Shared CV section headings live in [the English dictionary](sources/i18n/en.json) and [the French dictionary](sources/i18n/fr.json). Edit those files to change a heading across CVs in that language. Translate the text and links in each CV's `data` separately.

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
> Utilisez un serveur HTTP local pour que le navigateur puisse charger les données du CV et les traductions. Le script `start-server.bat` fourni utilise Python.

1.  **Prérequis** : Vous avez besoin de Python installé pour lancer le serveur local.
2.  **Lancer le serveur** : Double-cliquez sur `start-server.bat`. Cela démarrera un serveur web local et ouvrira votre navigateur par défaut sur `http://localhost:8080`.
3.  **Choisir votre CV** : Utilisez le menu déroulant ou ouvrez `http://localhost:8080/?file=sources/cv-data/cv-data.template.json`.

### 🚀 Comment déployer (en ligne)

Copiez `index.html` et les ressources de `sources/` chez un hébergeur de fichiers statiques, en conservant l’arborescence. Incluez les CV que vous souhaitez publier. Le menu déroulant s’appuie sur la liste des fichiers de `sources/cv-data/` fournie par le serveur. Les liens directs `?file=...` fonctionnent aussi si cette liste est désactivée.

### 📝 Édition des données

Copiez le [modèle d’exemple](sources/cv-data/cv-data.template.json) dans un nouveau fichier sous `sources/cv-data/`. Modifiez `data` pour le contenu du CV et `meta` pour les paramètres d’affichage. Pour choisir le CV ouvert en l’absence du paramètre `?file`, créez `sources/cv-data/default.txt` et inscrivez le nom du fichier sur une ligne. Le fichier de secours est `sources/cv-data/cv-data.json`.

| Champ | Rôle |
| --- | --- |
| `meta.title` | Nomme le CV dans le menu déroulant et contribue au titre de l’onglet. |
| `meta.lang` | Sélectionne l’anglais (`en`) ou le français (`fr`) pour les titres de rubrique communs. |
| `meta.hidden` | La valeur `true` masque la variante dans le menu, sauf si elle est déjà ouverte. Les liens directs restent accessibles. |
| `meta.grid_template_columns` | Règle la largeur des colonnes en CSS, par exemple `"2fr 1fr"`. |
| `meta.zoom` | Règle l’échelle du CV, par exemple `"95%"`. Vérifiez l’aperçu avant impression en A4 après avoir ajusté le zoom ou les colonnes. |

Le rendu et le menu déroulant acceptent les commentaires sur une ligne (`//`), les blocs de commentaire (`/* ... */`) et les virgules finales dans les fichiers de CV. Vous pouvez commenter des entrées facultatives pour les rétablir plus tard. Les outils qui exigent du JSON strict peuvent refuser cette syntaxe.

### 🌐 Traductions

Les titres de rubrique communs se trouvent dans le [dictionnaire anglais](sources/i18n/en.json) et le [dictionnaire français](sources/i18n/fr.json). Modifiez ces fichiers pour renommer une rubrique dans tous les CV de la langue concernée. Adaptez le texte et les liens de `data` dans chaque CV.

### 🎨 Icônes (FontAwesome)

Ce générateur utilise un sous-ensemble local et minimal de **Font Awesome Pro 7.1.0**, limité aux icônes actuellement utilisées par l’application et les données des CV.
*   Ajoutez dans vos JSON une classe déclarée dans `sources/css/fontawesome-minimal.css` (par exemple, `"icon": "fas fa-phone"`).
*   Pour ajouter une nouvelle icône, reconstruisez le mapping CSS et les fontes sous-ensembles correspondantes à partir de `fontawesome-pro_v7.1.0.zip`.
