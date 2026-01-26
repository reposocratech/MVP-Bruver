export function generarContrasena(
  longitud = 12,
  incluirMayusculas = true,
  incluirMinusculas = true,
  incluirNumeros = true,
  incluirSimbolos = true
) {
  let caracteres = "";
 
  if (incluirMayusculas) caracteres += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (incluirMinusculas) caracteres += "abcdefghijklmnopqrstuvwxyz";
  if (incluirNumeros) caracteres += "0123456789";
  if (incluirSimbolos) caracteres += "!@#$%^&*()_+-=[]{}|;:,.<>?";
 
  if (caracteres.length === 0) return "";
 
  let contrasena = "";
  for (let i = 0; i < longitud; i++) {
    const indice = Math.floor(Math.random() * caracteres.length);
    contrasena += caracteres[indice];
  }
 
  return contrasena;
}