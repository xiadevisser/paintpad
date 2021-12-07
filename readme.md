# PaintPad

Canvas component which allows freeform painting.

[![NPM Version](https://img.shields.io/npm/v/paintpad)](https://www.npmjs.com/package/paintpad)
[![build](https://github.com/xiadevisser/paintpad/actions/workflows/build.yaml/badge.svg?branch=main)](https://github.com/xiadevisser/paintpad)
[![License](https://img.shields.io/github/license/xiadevisser/paintpad)](/LICENSE)

**_[demo](https://xiadevisser.github.io/paintpad/)_**

## Installation

```
yarn add paintpad
```

or

```
npm install --save paintpad
```

## Usage

### HTML

```html
<paint-pad
  width="300px"
  height="300px"
  lineWidth="15"
  lineWidthMin="5"
  lineWidthMax="25"
  color="#ffdab9"
  hasSlider="true"
  hasColorPicker="true"
  isClearable="true"
  isDownloadable="true"
  isStateChangeable="true"
></paint-pad>
```

### JavaScript

```js
import { PaintPad } from "paintpad";

const paintPad = new PaintPad({
  width: "300px",
  height: "300px",
  lineWidth: 15,
  lineWidthMin: 5,
  lineWidthMax: 25,
  color: "#ffdab9",
  hasSlider: true,
  hasColorPicker: true,
  isClearable: true,
  isDownloadable: true,
  isStateChangeable: true,
});

document.getElementById("paint-pad-container").append(paintPad);
```

### Angular

```js
// app.module.ts

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  ...
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
  ...
})
```

```js
// app.component.html

<paint-pad #paintPad width="300px" color="#ffdab9"></paint-pad>
```

```js
// app.component.ts

import "paintpad";

export class AppComponent {
  @ViewChild('paintPad') public paintPad!: ElementRef;

  public clear(): void {
    this.paintPad.nativeElement.clear();
  }
}
```

### React

```js
import "paintpad";

function App() {
  const paintPad = useRef(null);

  const clear = () => paintPad.current.clear();

  return <paint-pad ref={paintPad} width="300px" color="#ffdab9"></paint-pad>;
}
```

## Options

| attribute           | type      | description                                                     | default      |
| ------------------- | --------- | --------------------------------------------------------------- | ------------ |
| `width`             | `string`  | width of the canvas                                             | `'500px'`    |
| `height`            | `string`  | height of the canvas                                            | `'500px'`    |
| `lineWidth`         | `number`  | initial thickness of the pencil                                 | `10`         |
| `lineWidthMin`      | `number`  | minimal thickness of the pencil                                 | `1`          |
| `lineWidthMax`      | `number`  | maximum thickness of the pencil                                 | `30`         |
| `color`             | `string`  | initial color of the pencil (must be a hexcode of 6 characters) | `'#000000'`  |
| `tool`              | `string`  | initial tool of the pencil (`'free'` or `'line'`)               | `'free'`     |
| `imageName`         | `string`  | name of the downloaded image                                    | `'paintpad'` |
| `hasSlider`         | `boolean` | if the user can change the thickness of the pencil              | `true`       |
| `hasColorPicker`    | `boolean` | if the user can change the color of the pencil                  | `true`       |
| `isClearable`       | `boolean` | if the user can clear the canvas                                | `true`       |
| `isDownloadable`    | `boolean` | if the user can download an image of the canvas                 | `true`       |
| `isStateChangeable` | `boolean` | if the user can undo and redo the state to the canvas           | `true`       |
| `isToolChangeable`  | `boolean` | if the user can change the tool of the pencil                   | `true`       |

## Methods

| method               | parameters                                                                     | description                                           |
| -------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------- |
| `setWidth`           | `width: string`                                                                | sets the width of the canvas                          |
| `setHeight`          | `height: string`                                                               | sets the height of the canvas                         |
| `setLineWidth`       | `lineWidth: number`                                                            | sets the thickness of the pencil                      |
| `setLineWidthMin`    | `lineWidth: number`                                                            | sets the minimal thickness of the pencil              |
| `setLineWidthMax`    | `lineWidth: number`                                                            | sets the maximum thickness of the pencil              |
| `setColor`           | `color: string`                                                                | sets the color of the pencil                          |
| `setTool`            | `tool: string`                                                                 | sets the tool of the pencil                           |
| `setImageName`       | `name: string`                                                                 | sets the name of the downloaded image                 |
| `setSlider`          | `isVisible: boolean`                                                           | if the user can change the thickness of the pencil    |
| `setColorPicker`     | `isVisible: boolean`                                                           | if the user can change the color of the pencil        |
| `setClearable`       | `isVisible: boolean`                                                           | if the user can clear the canvas                      |
| `setDownloadable`    | `isVisible: boolean`                                                           | if the user can download an image of the canvas       |
| `setStateChangeable` | `isVisible: boolean`                                                           | if the user can undo and redo the state to the canvas |
| `setToolChangeable`  | `isVisible: boolean`                                                           | if the user can change the tool of the pencil         |
| `clear`              |                                                                                | clears the canvas                                     |
| `download`           |                                                                                | downloads an image of the canvas                      |
| `undo`               |                                                                                | changes the state of the canvas to the previous state |
| `redo`               |                                                                                | changes the state of the canvas to the next state     |
| `getDataURL`         |                                                                                | returns the data url of the canvas                    |
| `getBlob`            | `callback: BlobCallback`<br>`type?: string \| undefined`<br>`quality?: number` | gets the blob of the canvas in a callback function    |
