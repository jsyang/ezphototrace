# ezPhotoTrace

**Trace photos, export STLs.**

Useful for adding extruded features to 3D prints. Written originally as part of "bikestats", a custom bike geometry-based builder that could trace frames.

## Features

- Use binary tracing operations to create complex shapes
- Mouse wheel + drag to reposition background image within viewport
- Export STLs

### todo

#### Exports
- export SVG only
- export as openSCAD module

#### Shapes
- redefine shape origin (auto-compute the centroid or set it manually)
- distance measurement between 2 points
- define the height of extrusions
- resize the tracings based on a known measurement (e.g. distance between these two points is known to be 150mm, resize everything else to fit this)
- rotate shape so edge lies flat

#### Targets
- macOS, windows, linux support via Proton Native

## Getting started

You can run it locally with `yarn`:

```
yarn
yarn start
```

OR simply open `dist/index.html` in your browser.

## Typical workflow

1. Vectorize a photo by tracing it within ezphototrace

![vectorize](1.png)

2. Export to STL

![vectorize](2.png)

3. Run [netfabb](https://service.netfabb.com) to fix any STL errors

4. Import into OpenSCAD for post-processing and export as a printable STL

5. Load into [Cura](https://ultimaker.com/en/products/cura-software) and slice it into gcode

![vectorize](5.png)

#### Further details

- [Using `autotrace` to vectorize images](http://autotrace.sourceforge.net/index.html#download)
- [`potrace` -- maintained `autotrace` alternative](http://potrace.sourceforge.net/#example)
- [Mesh repair software](http://www.meshrepair.org/)
- [Using MeshLabServer to fix STLs](https://sourceforge.net/p/meshlab/discussion/499532/thread/ee1fb697/?limit=25)

### MIT Licensed
