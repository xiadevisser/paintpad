# PaintPad

Canvas component which allows freeform painting.

[![NPM Version](https://img.shields.io/npm/v/paintpad)](https://www.npmjs.com/package/paintpad)
[![build](https://github.com/xiadevisser/paintpad/actions/workflows/build.yaml/badge.svg?branch=main)](https://github.com/xiadevisser/paintpad)
[![License](https://img.shields.io/github/license/xiadevisser/paintpad)](/LICENSE)

<sub><sup>[demo](https://xiadevisser.github.io/paintpad/)</sup></sub>

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
  canClear="true"
  canDownload="true"
  canChangeState="true"
  hasSlider="true"
  hasColorPicker="true"
/>
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
  canClear: true,
  canDownload: true,
  canChangeState: true,
  hasSlider: true,
  hasColorPicker: true,
});

document.getElementById("paint-pad-container").append(paintPad);
```

## Options

The options can **not** be changed at runtime.

| attribute        | type      | description                                                     | default      |
| ---------------- | --------- | --------------------------------------------------------------- | ------------ |
| `width`          | `string`  | width of the canvas                                             | `'500px'`    |
| `height`         | `string`  | height of the canvas                                            | `'500px'`    |
| `lineWidth`      | `number`  | initial thickness of the pencil                                 | `10`         |
| `lineWidthMin`   | `number`  | minimal thickness of the pencil                                 | `1`          |
| `lineWidthMax`   | `number`  | maximum thickness of the pencil                                 | `30`         |
| `color`          | `string`  | initial color of the pencil (must be a hexcode of 6 characters) | `'#000000'`  |
| `imageName`      | `string`  | name of the downloaded image                                    | `'paintpad'` |
| `hasSlider`      | `boolean` | if the user can change the thickness of the pencil              | `true`       |
| `hasColorPicker` | `boolean` | if the user can change the color of the pencil                  | `true`       |
| `canClear`       | `boolean` | if the user can clear the canvas                                | `true`       |
| `canDownload`    | `boolean` | if the user can download an image of the canvas                 | `true`       |
| `canChangeState` | `boolean` | if the user can undo and redo the state to the canvas           | `true`       |

## Methods

| method         | parameters                                                                     | description                                           |
| -------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------- |
| `clear`        |                                                                                | clears the canvas                                     |
| `download`     |                                                                                | downloads an image of the canvas                      |
| `undo`         |                                                                                | changes the state of the canvas to the previous state |
| `redo`         |                                                                                | changes the state of the canvas to the next state     |
| `setColor`     | `color: string`                                                                | sets the color of the pencil                          |
| `setLineWidth` | `lineWidth: number`                                                            | sets the thickness of the pencil                      |
| `getDataURL`   |                                                                                | returns the data url of the canvas                    |
| `getBlob`      | `callback: BlobCallback`<br>`type?: string \| undefined`<br>`quality?: number` | gets the blob of the canvas in a callback function    |
