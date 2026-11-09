# Updating CV templates

## Choose the source

- Start from a recent CV in the target language under `sources/cv-data/`. Create a separate JSON file for a new variant and set its `meta.title` and `meta.lang`.
- Keep personal CV data and local defaults out of GitHub. Use the tracked sample JSON files for public examples.

## Edit the content

- Link to the LinkedIn profile version that matches the CV language. Edit shared section headings in `sources/i18n/` and use natural wording in each language.
- Keep the visible software list relevant. Use JSON comments for optional tools that may be useful for another role. Both the renderer and the template picker accept comments.

## Preview and publish

- From the repository root, run `python -m http.server 8080 --bind 127.0.0.1` and open `http://127.0.0.1:8080/?file=sources/cv-data/<filename>.json`. Verify the headings, links and content in the renderer.
- For a one-page bento layout, tune `meta.zoom` and `meta.grid_template_columns` in the variant JSON. Check that the columns end at a similar height, the margins look balanced, and the CV prints on one A4 page.
- Use GitHub for renderer changes, shared translations and public examples. Keep private variants local. Publish personal CVs to OVH by SFTP only when requested, then verify the rendered CV at its public URL.
