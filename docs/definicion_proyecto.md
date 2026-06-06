# Definición del Proyecto: Kemepongo

Este documento sirve como base para definir y organizar las ideas principales de la aplicación web "Kemepongo". Lo iremos completando juntos para tener una visión clara antes de codificar a fondo.

## 1. Target (Público Objetivo)
*¿A quién va dirigida la aplicación? Define el perfil de tu usuario ideal.*
- **Perfil de usuario:**  
- general, seria cualquier persona que salga de una casa y tiene que vestire estando adentro con unclima y afuera con otro.

- **Problema principal a resolver:** 
- El problema seria cuando a la mañana generalmente o an cualquier hora, y no sabse estimar bien que clima es y que va a ser ene l futuro cercano, afuera de tu csasa, entonce sirve como una especie de indicador.
- De que tipo de ropa ponerte, queme va a dara calor frio, o si va a loover que usar que no usar,m 
- Una idea era una gui ux simple que tome datos de metertolgoia, de variasapis cerca o o las cerca posible,s carta estimados, y tener una sqlite o algo que vaya guyardando y poder tener ahi mi perfil de persona, y lo que necsito ponerme par estar comodo con la ropa del dia, poder tener mi historial dfe otros dias de ropa y tener una estadistica de comoprtamiento con feedback para ver si las sugerencias fue fue haciendo me sivierion, si anduvo bien, o fallaron y tiene que ser tenidas en cuenta a futuro.,

## 2. Casos de Uso
*¿Qué acciones principales realizará el usuario dentro de la app?*
- **Caso de Uso 1:**  
  - quiero saber que ropa tengo que ponerme antes de salir de casa, para no morirme de frio ni de calor. si llueve, estar listo, si hace calro o  va a ahcer calor en 2hrs y justo cvuando salgo esta el final del frio, saberlo, y tener la ropa necesaria para vivir el dia lo mas comodo posible.


- **Caso de Uso 2:**  
- quisiera poder guardar la ropa que tengo, que me sugiere, o ir agregndolas para tener "mi guararropas" , poder etiquetarla, ponerle alguna descripcion,  
- 
- **Caso de Uso 3:** 
- poder tener un registro de  "que me puse hoy", y que tanto me senti comodo, y poder dar un feedback a la app para decirle oka me dijiste cualquier cosa, o al reves , ok me sirvio lo que me dijste bien ahi.



## 3. Requerimientos
*¿Cuáles son las funcionalidades obligatorias que debe tener la primera versión (MVP)?*

### Requerimientos Funcionales
- [Ej. Integración con una API meteorológica para obtener la temperatura y condiciones]
- la idea es integrar con las apis varias cruzaralas y tener el mejor resultado, mas cercano de mi ubicaicon,
- que el sistema pueda entender umbrales minimos maximos de temperatura, humedad, viento, etc, y poder clasificar o tener clasificado o asociado estos parametros con las ropas posibles disponibles o del guarradopas delusuario 
- la ropa disponible tiene que ser un banco de ropa generica, y el usuario puede agregarla a su guarrarropas, selecionara, administra su guiararropas y personalizarla. tiene qu haber presets de ropa tambien, por ej, remera manga corta, manga larga ;;  buzo liviano y pesado, ;; campera tipo abrigada polar, o liviana ;; pantalones cortos, largos, de verano de invierno, par lalluvia, zapatillas, botas de lluvia, chancletas, y asi. bufandas, etc.

### Requerimientos No Funcionales
- compatible con mobile ux, 
- esttica tipo basica por ahora
- los datos en sqlite es lo que mas me cierra por ahora por que no quiero depender de nada, aunque quiero que se pueda tener en varios dispositivos
- posiblemente usar cookies para guardar datos basicos. 

## 4. Diseño y UI/UX
*¿Qué estilo visual queremos transmitir para lograr ese efecto "WOW"?*
dependiendo el dia podria ser, si es mas oscuro de noche, o es una idea.


## 5. Datos
*¿Qué información necesitamos almacenar y gestionar en el sistema?*
- **Entidades Principales:**
  - `Usuario`: no neceariamente, pero si cookies asociadas al dispositivo o navegador, pero alguien querer regisrate en algun futuro, v2
  - `Prenda`: (Categoría, color, nivel de abrigo, imagen), 
  - `Outfit`: (Combinación de prendas) es una asociacion de prendas, una combinacion, 
  - `mi guardarroas`: la persona puede asociar ropa a su guardarropas y el sistema puede sugirer despues rop de su guarrropas. 
- **Fuentes de Datos Externas:** [Ej. OpenWeather API] , buscar hay mas.

## 6. Arquitectura de Software
*¿Cómo estará estructurada la aplicación a nivel técnico?*
no esta definido aun. la idea que no tenemos sitios salgo github y podriamos probar en local, pero a futuro proximo corto plazo podemos buscar algun host o algo gratuito, para levantarlo y probar.