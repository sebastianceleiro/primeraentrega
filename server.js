import express from "express" ;
import fs from "fs" ;

const app = express () ;
const puerto = 8080 ;

const rutaProductos = express.Router() ;
const rutaCarrito = express.Router() ;

app.use("/api/productos", rutaProductos)
app.use("/api/carrito", rutaCarrito)

rutaProductos.use(express.json())
rutaProductos.use(express.urlencoded({ extended: true }))
rutaCarrito.use(express.json())
rutaCarrito.use(express.urlencoded({ extended: true }))
app.use(express.static('public'));

const server = app.listen(puerto, () => {
    console.log(`Servidor funcionando en el puerto ${puerto}`)
})

///////////// PRODUCTOS

const archivoProductos = fs.readFileSync("./productos.json", "utf-8")
const listaProductos = JSON.parse(archivoProductos)
let administrador = true ; // modificar variable para permisos admin

rutaProductos.get (("/"), (req,res) => {
    res.send (listaProductos)
})

rutaProductos.get (("/:id"), (req,res) => {
    res.send (listaProductos[req.params.id])
})


rutaProductos.put (("/:id"), (req,res) => {

    if (administrador == true) {
    listaProductos[req.params.id] = {
        id : req.params.id  ,
        nombre : req.body.nombre ,
        descripcion : req.body.descripcion ,
        codigo : req.body.codigo , 
        foto : req.body.foto ,
        precio : req.body.precio,
        stock : req.body.stock
    }
    res.send (`Se solicito modificar el ID ${req.params.id}`)}
    else { res.send ("sin permisos de administrador")}
    sobreescribirArchivo(listaProductos) ;
   
})

rutaProductos.post (("/agregarproducto"), (req,res) => {

    if (administrador == true) {
       const  nuevoProducto = {
        id : listaProductos.length ,
        timestamp: new Date ().toLocaleString(),
        nombre : req.body.nombre ,
        descripcion : req.body.descripcion ,
        codigo : req.body.codigo , 
        foto : req.body.foto ,
        precio : req.body.precio,
        stock : req.body.stock
      }
   listaProductos.push(nuevoProducto) ;
   console.log(listaProductos)
   res.redirect('/')}
   else { res.send ("sin permisos de administrador")};
   sobreescribirArchivo(listaProductos) ;
})

rutaProductos.delete (("/:id"), (req,res) => {
    if (administrador == true) {
    listaProductos.splice(req.params.id,1)
    res.send (`Se solicito borrar el ID ${req.params.id}`)}
    else { res.send ("sin permisos de administrador")}
    sobreescribirArchivo(listaProductos) ;
})
 

///////////// CARRITO

const carritos = [] ;

rutaCarrito.get (("/:id/productos"), (req,res) => {
    res.send (carritos[req.params.id] )
}) ;

rutaCarrito.post (("/"), (req,res) => {
    let carrito = {
        id: carritos.length ,
        timestamp: new Date ().toLocaleString(),
        productos: []
    }
    carritos.push(carrito) ;
    res.send (`Se creo el carrito ID ${carrito.id}`)
    console.log(carritos)
  
    
})

rutaCarrito.delete (("/:id"), (req,res) => {
    carritos.splice(req.params.id,1)
    res.send (carritos)

})

rutaCarrito.post (("/:id/productos/:idproducto"), (req,res) => {
    carritos[req.params.id].productos.push(listaProductos[req.params.idproducto])
    res.send ("Estamos agregando un producto al carrito")
    console.log( carritos[req.params.id])

})

rutaCarrito.delete (("/:id/productos/:idproducto"), (req,res) => {
    carritos[req.params.id].productos.splice(req.params.idproducto,1)
    console.log( carritos[req.params.id])
    res.send ("estamos eliminando uno de los productos del carrito ")

})

/////// escritura archivos

function sobreescribirArchivo (listaProductos) {
    let listajson = JSON.stringify(listaProductos) ;
    fs.writeFileSync ("./productos.json", listajson ) ;    
}

function sobreescribirArchivoCarrito (carritos) {
    console.log(carritos)
    let parseado =  JSON.stringify(carritos) ;
    console.log(parseado) ;
    fs.writeFileSync ("./carrito.json", parseado ) ;   
}