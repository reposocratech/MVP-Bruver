export function generarContrasena(
  longitud = 12,
  incluirMayusculas = true,
  incluirMinusculas = true,
  incluirNumeros = true,
  incluirSimbolos = true
) {

  // Asegurar un mínimo de 8 caracteres
  longitud = Math.max(8, longitud);

  // Definir los conjuntos de caracteres
  const mayusculas = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const minusculas = "abcdefghijklmnopqrstuvwxyz";
  const numeros = "0123456789";
  const simbolos = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  // Juntar todos los caracteres permitidos
  let caracteres = "";
  if (incluirMayusculas) caracteres += mayusculas;
  if (incluirMinusculas) caracteres += minusculas;
  if (incluirNumeros) caracteres += numeros;
  if (incluirSimbolos) caracteres += simbolos;

  // Validar que hay caracteres disponibles
  if (caracteres.length === 0) {
    throw new Error('Debe seleccionar al menos un tipo de carácter');
  }

  // Generar la contraseña
  let contrasena = "";
  for (let i = 0; i < longitud; i++) {
    const indice = Math.floor(Math.random() * caracteres.length);
    contrasena += caracteres[indice];
  }

  return contrasena;
}