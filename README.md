# **Delilah Resto**

## **Pasos previos**
---
### Docker
Esta aplicación utiliza una imagen de docker para la base de datos. <br>
Es necesario instalar docker y docker-compose para iniciar la aplicación. <br>

Instalación de docker: 
- <img style="width: 18px;padding:0px 3px 0 0" src="https://cdn1.iconfinder.com/data/icons/operating-system-flat-1/30/windows_7-512.png"/> https://docs.docker.com/docker-for-windows/ 
   - Para la instalación en windows, es probable que necesites habilitar virtualización en tu BIOS. Te dejo un link util https://docs.docker.com/docker-for-windows/troubleshoot/#virtualization
   - docker-for-windows, incluye docker-compose en su paquete de instalación
- <img  style="width: 18px;padding:0px 3px 0 0" src="https://cdn2.iconfinder.com/data/icons/designer-skills/128/linux-server-system-platform-os-computer-penguin-512.png"> https://docs.docker.com/engine/install/
  - instalación de docker-compose:  https://docs.docker.com/compose/install/

Incluí un <span style="color:yellow">docker-compose.yml</span> para que sea mucho mas facil levantar el servicio de mysql.


## **Iniciar el proyecto**

### Levantar mysql
 ```bash
 docker-compose up -d # Inicializa el docker, en el puerto 3306
 docker-compose down  # Apaga el docker
 ```
### Si necesitás acceder a la consola del docker
```bash
 docker exec -it delilahresto_db_1 bash
```

### Datos de acceso a la base de datos
```
user: root
pass: 1234
````

### Npm y node

```bash
npm install
```

```bash
npm run createDB 
#crea todas las bases de datos con sus relaciones y datos necesarios. 
```

```bash 
npm run createAdmin username password 
#cambia las username y password por tu acceso para el admin
```

```bash
npm start
# para inicializar el server en 127.0.0.1:3000
```