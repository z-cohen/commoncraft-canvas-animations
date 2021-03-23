# commoncraft Canvas Animations

- `index.html` shows the main animation
- `animation2.html` and `animation3.html` show alternative animations
- `webflowCode/` contains an archive of custom Javascript written for the Webflow project
- A few other files show tests, examples, and tutorial Canvas code

### Using canvas custom attributes

- Add attributes to the canvas tag to override the defaults.

```
<canvas id="canvas" mobileTriangleLength="4" mobileGridCellSize="40" dotDivider="300"></canvas>
```

- The formatting always looks like: ` variableName="value"`

- Many variables have mobile options (for screens narrower than 600px). You can see which ones do below.

### Attributes list

Attribute | Description | Default
---- | ----------- | -------
`largeScreenTriangleSegmentLength` | Approximate size (in pixels) of each triangle's segments <br/>- On large screens | `9`
`mobileTriangleSegmentLength` | Approximate size (in pixels) of each triangle's segments <br/>- On mobile | `6`
`strokeColor` | Dot and triangle stroke color | `#83C382`
`triangleFillColor` | Triangle fill color | `#fff`
`largeScreenGridCellSize` | How large the columns and rows should be that split up the page into evenly-spaced triangles (on large screens) <br/>- On large screens | `75`
`mobileGridCellSize` | How large the columns and rows should be that split up the page into evenly-spaced triangles (on large screens) <br/>- On mobile | `55`
`largeScreenMovementRadius` | How large a radius to detect mouse movements <br/>- On large screens | `30`
`mobileMovementRadius` | How large a radius to detect mouse movements <br/>- On mobile | `23`
`relativeSpeed` | How quickly the objects should move away from the mouse <br/>- Smaller numbers move faster <br/>- Recommended: trying between ~10 and ~100 | `13`
`friction` | How much friction there should be. <br/>- The smaller the number, the slower they'll fly away. <br/>- 'Real' friction is approximately `0.94` | `0.84`
`dotDivider` | Dividing the given screen area (whatever size) to determine how many dots there should be. This ensures that no matter the screen area, the density stays the same. <br/>- Higher numbers mean fewer dots. <br/>- Recommended: trying between 100 and 1000 | `600`
`largeScreenDotLineWidth` | How large the dots should be. We automatically divide this by 2 on small screens to make the dots feel the same weight as on large screens | `1`
