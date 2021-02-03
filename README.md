# **Delilah Resto**


## **PASO 1 -  Levantar mysql**

### Opción A - Docker

Esta aplicación utiliza una imagen de docker para la base de datos. <br>
Es necesario instalar docker y docker-compose para iniciar la aplicación. <br>

Instalación de docker: 
- <img style="width: 18px;padding:0px 3px 0 0" width="18px" src="https://cdn1.iconfinder.com/data/icons/operating-system-flat-1/30/windows_7-512.png"/> https://docs.docker.com/docker-for-windows/ 
   - Para la instalación en windows, es probable que necesites habilitar virtualización en tu BIOS. Te dejo un link util https://docs.docker.com/docker-for-windows/troubleshoot/#virtualization
   - docker-for-windows, incluye docker-compose en su paquete de instalación
- <img  style="width: 18px;padding:0px 3px 0 0" width="18px" src="https://cdn2.iconfinder.com/data/icons/designer-skills/128/linux-server-system-platform-os-computer-penguin-512.png"> https://docs.docker.com/engine/install/
  - instalación de docker-compose:  https://docs.docker.com/compose/install/

Incluí un **docker-compose.yml** para que sea mucho mas facil levantar el servicio de mysql.


### Opción B - Utilizar una conexión de mysql existente

Si ya contás con un servidor mysql, o una conexión a la que quieras conectar el proyecto seguí estos pasos:

- Crear una base de datos en tu conexión (delilah_resto es el nombre por defecto)
  ```SQL
      CREATE DATABASE delilah_resto
  ```
- Editar el archivo /src/sql/conectionDB.js. y /src/admin.js.  Hay que editar la variable global.db para insertar los datos de tu conexión.

  ```javascript
    const config  = {
      DB_HOST:'localhost',
      DB_USER:'user',
      DB_PASS:'pass',
      DB_DATABASE:'delilah_resto'
    }
  ```


## **PASO 2 - Iniciar el proyecto**

#### (Opcional) Levantar docker
Si utilizaste la opción de docker en el paso anterior, seguí estos pasos. De lo contrario, continuá con NPM Y Node .

 ```bash
 docker-compose up -d # Inicializa el docker, en el puerto 3306
 docker-compose down  # Apaga el docker
 ```
Si necesitás acceder a la consola del docker
```bash
 docker exec -it delilahresto_db_1 bash
```

### **Npm y Node**

Para inicializar el proyecto, es necesario instalar las dependencias. 

```bash
npm install
```
Lo siguiente será crear las tablas necesarias con sus relaciones y algunos datos para que funcione correctamente.

```bash
npm run createDB 
```
Existen algunos endpoints con acceso a nivel administrador. Tendrás que 
contar con al menos un usuario administrador para poder acceder a ellos. 
*Corré este comando y cambia las variables $username$ y $password$ para crear tu usuario admin*

```bash 
npm run createAdmin username password 
```

Finalmente, inicializamos el servidor en node. Se inicializa en localhost:3000

```bash
npm start
```

## **PASO 3 - Usando la app**
Para poder utilizar la aplicación, es necesario un token Bearer. 
Éste se consigue iniciando sesión con tu usuario. 
Algunos endpoints utilizan acceso de administrador (para generar este usuario, lo deberás hacer por consola corriendo el comando listado anteriormente)

1. Utiliza el endpoint login para iniciar sesión con tu username y password admin para obtener tu token y luego, poder utilizarlo en algunos endpoints en los cuales es requerido.

2. Utiliza el endpoint POST /users para crear tu usuario no admin

3. Utiliza nuevamente el endpoint POST /login para obtener tu token

Utiliza tu token en el header Authentication: Bearer {tu_token} en los endpoints que lo requieran.


## **Documentación**
La documentación de los endpoints y sus accesos se encuentra aquí:
https://app.swaggerhub.com/apis/eugediazsegura/DelilahResto-API/1.0.1

*Diagrama de la base de Datos*

- <img style="width: 900px;padding:0px 3px 0 0" width="900px" src="https://www.mediafire.com/convkey/eb4b/nw5ac53ssoybaxmzg.jpg"/>

