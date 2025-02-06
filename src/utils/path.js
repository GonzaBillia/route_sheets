import Path from 'path';

const path = {
  // Esto establece la carpeta raíz como la carpeta actual; puedes ajustarlo según tus necesidades.
  root: Path.resolve(),
  // Suponiendo que la carpeta 'src' está en la raíz del proyecto
  src: Path.join(Path.resolve(), "src"),
  public: Path.join(Path.resolve(), "src", "public"),
  images: Path.join(Path.resolve(), "src", "public", "images"),
  views: Path.join(Path.resolve(), "src", "views"),
};

export default path;