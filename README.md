# PrettyPreview

<p>
  <a href="https://codecov.io/gh/humandetail/pretty-preview" > 
    <img src="https://codecov.io/gh/humandetail/pretty-preview/branch/main/graph/badge.svg?token=5X0OFEAMK3"/> 
  </a>
  <a href="https://github.com/humandetail/pretty-preview">
    <img src="https://img.shields.io/github/license/humandetail/pretty-preview.svg" />
  </a>
  <a href="https://github.com/humandetail/pretty-preview">
    <img src="https://img.shields.io/github/issues/humandetail/pretty-preview.svg" />
  </a>
  <a href="https://github.com/humandetail/pretty-preview">
    <img src="https://img.shields.io/github/forks/humandetail/pretty-preview.svg" />
  </a>
  <a href="https://github.com/humandetail/pretty-preview">
    <img src="https://img.shields.io/github/stars/humandetail/pretty-preview.svg" />
  </a>
</p>

## Install

Install with npm:

```bash
npm i pretty-preview
```

Install with yarn:

```bash
yarn add pretty-preview
```

Install with pnpm:

```base
pnpm add pretty-preview
```

## Usage

```js
import { PrettyPreview } from 'pretty-preview'
import 'pretty-preview/dist/pretty-preview.css'

const pp = new PrettyPreview({
  root: '.wrapper'
})
```

## Params

|param|type|default|description|
|:--|:--|-|-|
|root|HTMLElement \| string|document.body|The parent element to listen on.|
|selector|string|'img'|The element to listen on.|
|srcAttr|string|'src'|The property that need to be collected from the selector|
|useMask|boolean|true|-|

## License

[MIT License](https://github.com/humandetail/pretty-preview/blob/main/LICENSE) © 2022-PRESENT [Humandetail](https://github.com/humandetail)
