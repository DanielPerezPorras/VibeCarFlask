export function recortarDireccion(dir) {
  const partes = dir.split(", ");
  const len = partes.length;
  return [
    partes[0], partes[1], partes[2],
    partes[len - 4]
  ].join(", ");
}