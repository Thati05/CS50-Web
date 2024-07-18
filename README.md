### Notes on Common Mistakes and Solutions

#### 1. Incorrect Form Action URL for Image Search
**Mistake**:
```html
<form class="google-form" action="https://www.google.com/imghp">
```
**Solution**:
Use the correct action URL for image search:
```html
<form class="google-form" action="https://www.google.com/search">
  <input type="hidden" name="tbm" value="isch">
```
- `tbm=isch` is the parameter for image search.

#### 2. Multiple Input Fields with the Same Name
**Mistake**:
```html
<input type="text" name="q">
<input type="text" name="q">
```
**Solution**:
Each input should have a unique name corresponding to the search parameter:
```html
<input type="text" name="as_q">
<input type="text" name="as_epq">
<input type="text" name="as_oq">
<input type="text" name="as_eq">
```
- Use the correct names for advanced search parameters.

#### 3. Using a Button with a Link Inside
**Mistake**:
```html
<button class="btn btn-light"><a href="https://doodles.google/">I'm Feeling Lucky</a></button>
```
**Solution**:
Use a `button` element with a JavaScript function or change to an anchor tag styled as a button:
```html
<a class="btn btn-light" href="https://www.google.com/search?q=Harvard&btnI=I">I'm Feeling Lucky</a>
```
- Ensure the `href` correctly uses `btnI` for the "I'm Feeling Lucky" functionality.

#### 4. Improper Use of Datalist
**Mistake**:
```html
<input name="lr" list="languages" placeholder="any language">
<datalist>
  <option value="Afrikaans">
  <option value="English">
```
**Solution**:
Ensure data list has an ID and the `input` references it:
```html
<input name="lr" list="languages" placeholder="any language">
<datalist id="languages">
  <option value="Afrikaans">
  <option value="English">
```

#### 5. Preventing Autocomplete and Removing Outline
**Mistake**:
Not preventing autocomplete or not removing outline on focus.
**Solution**:
Add `autocomplete="off"` and custom CSS for focus:
```html
<input name="lr" list="languages" placeholder="any language" autocomplete="off">
```
CSS:
```css
input:focus {
    outline: none;
}
```

### Additional Tips
- **Experiment with GET Parameters**: Use the browser's network tools to inspect the parameters used by Google and understand their functionality.
- **Consistent Naming**: Ensure input fields have unique and meaningful names to avoid conflicts and ensure the correct parameters are sent.
- **Custom Styles**: Use CSS to customize input and button styles to match the intended design and improve user experience.
