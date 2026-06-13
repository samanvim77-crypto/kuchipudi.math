# NatyaGanitha - Project Architecture & Strict Rules

## 1. Authentication Flow (CRITICAL)
- **Landing Page**: `login.html` is the strict entry point of the app.
- **Experience Gateway**: `experience.html` is the intermediate transition page.
- **Main App**: `index.html` is the final authenticated app.

**Flow Rule**: `login.html` -> `experience.html` -> `index.html`.
*Do not redirect `login.js` directly to `index.html`.*

## 2. Auth Gate Enforcement
Both `index.html` and `experience.html` MUST contain the following script in their `<head>` to enforce the login wall:
```html
<script>
    if (!localStorage.getItem('natyaAuth')) {
        window.location.replace('login.html');
    }
</script>
```
*Never remove this gate.*

## 3. Persistent UI Elements
`index.html` relies on several global floating controls that are heavily referenced by `main.js`. 
- `id="homeBtn"`
- `id="logoutBtn"`
*Never delete these elements from the `.floating-controls` div.* 

## 4. Video Implementation
The main video element in `index.html` must remain fully optimized for mobile and desktop viewing:
`<video class="dancer-video" autoplay loop muted playsinline style="object-fit: contain; background: black;">`
