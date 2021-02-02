# **Delilah Resto**

## *MySql*
Esta aplicación utiliza una imagen de docker para la base de datos. 
Incluí un docker-compose para que sea mucho mas facil levantar el servicio de mysql.

Instrucciones: 
 ```bash
 docker-compose up -d # Inicializa el docker, con el puerto 3306 binded
 docker-compose down  # Apaga el docker|
 ```
# **to do list**
1. crear node run para datos de tabla payment
2. crear node run para crear usuario admin
3. crear ruta 400 para cuando el cliente no pone una ruta existente
4. validar el usuario en el post