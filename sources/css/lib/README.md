# CSS Libraries

This folder contains external CSS libraries used by the CV generator.

## FontAwesome (Required)

FontAwesome is used for the icons in the CV. It is **not included** in this repository and must be downloaded manually.

### How to install

1.  **Download**: Go to [fontawesome.com/download](https://fontawesome.com/download) and download the "Free for Web" version (or Pro if you have a license).
2.  **Extract**: Extract the downloaded zip file into this folder (`sources/css/lib/`).
    *   You should end up with a folder structure like `sources/css/lib/fontawesome-free-6.x.x-web/`.
3.  **Configure**:
    *   Open `index.html` in the root directory.
    *   Update the `<link>` tag in the `<head>` section to point to your FontAwesome version.
    *   Example:
        ```html
        <!-- If you downloaded FontAwesome Free 6.5.1 -->
        <link href="./sources/css/lib/fontawesome-free-6.5.1-web/css/all.min.css" rel="stylesheet">
        ```
