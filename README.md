# TerrariumBackend
Repositorio del back end del proyecto integrador del quinto semestre. (App Terrarium) 

--- Descripción de los archivos de configuración (carpeta config) ----

* El archivo "firebase-adminsdk.json" contiene las credenciales de servicio de Firebase necesarias para que la aplicación backend se autentique con Firebase. Es un archivo JSON generado desde la consola de Firebase. Este contiene información sensible, por lo tanto está incluido en el .gitignore, lo que quiere decir que el archivo no se verá reflejado en el repositorio.

* El archivo firebase.config.js inicializa la aplicación de Firebase Admin SDK en eL backend, utilizando las credenciales del archivo firebase-adminsdk.json.

* El archivo supabase.config.js configura y establece la conexión con Supabase, una base de datos relacional en la nube, en la cual se almacena la gran mayoría de información que se ingresa y muestra en la aplicación. 


