# Mascota Backend


http://mascotaback-env.6fwzkv5gxr.us-east-1.elasticbeanstalk.com/mascotas/

https://s3.amazonaws.com/elasticbeanstalk-us-east-1-533832295765/imagenes/images.jpg

mostrar tipo tabla:
https://www.youtube.com/watch?v=aDpub3elQ9c


obtener todas las publicaciones:
curl -X GET \
  http://mascotaback-env.6fwzkv5gxr.us-east-1.elasticbeanstalk.com/ \
  -H 'cache-control: no-cache' \
  -H 'postman-token: d4be859c-09aa-8cf9-31aa-8f62c5aae656'

agregar una publicación:
curl -X POST \
  http://mascotaback-env.6fwzkv5gxr.us-east-1.elasticbeanstalk.com/ \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -H 'postman-token: 89d6ad1b-0b79-802e-d6df-3642af422644' \
  -d '    {
        "mascota": {
            "caracteristicas": "lo volvi a perder de nuevo",
            "raza": "chihuahua",
            "collar": true,
            "color": "negro",
            "genero": "machito",
            "nombre": "Jasinto",
            "edad": 4
        },
        "fecha": "08/07/2017",
        "id": 0,
        "persona": {
            "direccion": "mi casa",
            "appellido": "Perez",
            "telefono": "444-1234",
            "nombre": "Juan"
        },
        "busqueda": true
    }'
