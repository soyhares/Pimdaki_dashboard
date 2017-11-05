//DATABASE
/*
Conexion
 */const config = {
        apiKey: "AIzaSyDzrlNuSRMeGYAqWvFS_3h53WeFsmMNxNg",
        authDomain: "pimdaki-e16a0.firebaseapp.com",
        databaseURL: "https://pimdaki-e16a0.firebaseio.com",
        projectId: "pimdaki-e16a0",
        storageBucket: "pimdaki-e16a0.appspot.com",
        messagingSenderId: "172646261705"
      };
     firebase.initializeApp(config)

//------------ VARS ------------------
/*PRODUCTS*/
    const PRODUCTS = "storage/products";
    const CATEGORY_PRODUCTS=  PRODUCTS+"/categories";

/*ORDERS*/
    const ORDERS = "storage/orders";
    const ORDER_PROFUCTS=  ORDERS+"/categories";

/*PROPS*/
    var screen="tbl_products"; 
    var action="GUARDAR";
    var form = {};
    var statusOrder="request";
    var tbl_order = $('#tbl_order').DataTable(
      { "bPaginate": true,
        "bFilter": true,
        "bInfo": true,
      });


//---------- MANAGEMENT DATA METHODS -----------
//ADD NODES
const addData = (route, obj)=>{
  firebase.database()
          .ref(route)
          .set({..._cleanObj(obj)})
          .then(()=>console.log("Realizado con exito!"))
          .catch((error)=>console.log("Error: "+error));
}
//almacenamiento
const updateData = (route, obj)=>{
  firebase.database()
          .ref(route)
          .update({..._cleanObj(obj)})
          .then(()=>console.log("Realizado con exito!"))
          .catch((error)=>console.log("Error: "+error));
          showPage("tbl_products",true);
          action="GUARDAR"
}

//DELETE
const deleteData=(route)=>{
    firebase.database()
          .ref(route)
          .remove()
          .then(()=>console.log("Realizado con exito!"))
          .catch((error)=>console.log("Error: "+error));
    console.log(route);
}
//DISPLAY table data  
const loadDataTable=(route="", hasAll=false)=>{ 
  let ref=route;
  let table= $('#tbl_storage').DataTable();
  hasAll?null:table.clear();
  firebase.database()
          .ref(ref)
          .on('child_added', function(snapshot){
              if(snapshot.exists()) {
                  let data = snapshot.val();
                  table.rows.add([{
                    0:snapshot.key,
                    1:data.name,
                    2:data.description,
                    3:data.lot,
                    4:data.price,
                    5:data.oldPrice,
                    6:data.barCode,
                    7:data.tradeMark,
                    8:data.model,
                    9:data.materials,
                    10:data.size,
                    11:data.catalog,
                    12:data.rating,
                    13:data.colors,
                    14:data.category,
                    15:data.subCategory
  
                  }]).draw();
              } 
             
         }); 
 }  

/**
 * load orders
 */
const loadOrder = (status="request") => {
  console.log("param:"+status +" ...Estado buscado --->"+ (status=="request"?"pendiente":status=="processed"?"procesados":status=="canceled"?"cancelados":"entregados"));
  statusOrder=status;//global var to capture status in realTime
  
 //acces keys
 let nextStatus = statusOrder == "request"? 
            "processed" : statusOrder == "processed"?//retorna processed
            "delivered" : statusOrder == "delivered"?//retorna delivered
            "canceled" : "request"; // retorna canceled
 nextStatus=status=="request"?"PROCESAR":"DESPACHAR";
 
  firebase.database()
        .ref("orders/"+status)
        .on("child_added",function(snap){    
                if(snap.exists()) {
                  let data = snap.val();
                  tbl_order.rows.add([{0:snap.key,1:snap.val().userData}]).draw();
                } 

        });
}

const iterableNodes = (data) =>{
  let key = data[0];
  let uid = data[1].id
   //maping vars
  let props = ["cashOrder","destination","purchase","shipping","users"];
  let path = null;//route
   for(i in props){
      path = "orders/"+props[i]+"/"+key;
      if(props[i]=="users"){
        path = "orders/"+props[i]+"/"+uid; 
      }     
     getNodes(props[i],path,key)

  }
  $("#pls_orders").fadeOut(500);
  $("#pls_orders").fadeIn(1000);
  $("#pl_carrito").html(null);
}

//Obtiene un articulo especifico y lo dibuja en el panel
const getArticle = (path,id,lot,key) =>{
  let body="";
  firebase.database()
        .ref("storage/products/categories/"+path+"/"+id)
        .on("value",function(snap){
            let data =snap.val();
            body="<ul>"+
                    "<li>ID: "+id+"</li>"+
                    "<li>Nombre: "+data.name+"</li>"+
                    "<li>Cantidad: "+lot+"</li>"+
                    "<li>Precio: ₡"+data.price+"</li>"+
                   
              "</ul>";
             drawPanels(body,key,"pl_carrito",true);
        }); 
       
}

//maping nodes PinDaki order
const getNodes = (node,path,id) =>{
   firebase.database()
        .ref(path)
        .on("value",function(snap){ 
          let data = snap.val();
          let body="";  
          switch(node){

            case "purchase": 
                            let list =data.shippingList;
                            for(i in list){
                              getArticle(list[i].route,list[i].id,list[i].lot,id);
                            } 
                             break;
            case "cashOrder": 
                            body="<ul>"+
                                          "<li>Monto: ₡"+data.fullPay+"</li>"+
                                          "<li>Total: $"+data.total+"</li>"+
                                          
                                  "</ul>";
                             drawPanels(body,id,"pl_cashOrder");
                             break;
            
            case "shipping": 
                             body="<ul>"+
                                          "<li>Código Postal: "+data.zip+"</li>"+
                                          "<li>País: "+data.address+"</li>"+
                                          "<li>Ciudad: "+data.city+"</li>"+
                                          "<li>Dirección: "+data.address+"</li>"+
                                          "<li>Mensajería: "+data.messenger+"</li>"+
                                          "<li>Costo: "+data.cost+"</li>"+
                                    "</ul>";
                             drawPanels(body,id,"pl_destination");
                             break;
            case "users":  
                              body="<ul>"+
                                          "<li>Nombre: "+data.name+" "+data.lastName+"</li>"+
                                          "<li>Email: "+data.email+"</li>"+
                                          "<li>Tel: "+data.phone+"</li>"+
                                    "</ul>";
                             drawPanels(body,id,"pl_customer");
                             break;
          }


        });

}
//drawing panels to order
const drawPanels = (body,footer, id, add=false) =>{
  add ? $("#"+id).append(body) :$("#"+id).html(body); 
  $("#"+id+"_id").html("N° "+footer);

}

//dispatcher
const dispatcher = (id, isCanceled=false)=>{
  let status = statusOrder == "request"? 
            "processed" : statusOrder == "processed"?//retorna processed
            "delivered" : "request";

 isCanceled ? status ="canceled":status;

  const oldRef=firebase.database().ref("orders/"+statusOrder+"/"+id);
  const newRef=firebase.database().ref("orders/"+status+"/"+id);
  oldRef.once('value', function(snap)  {
          newRef.set( snap.val(), function(error) {
               if( !error ) {  oldRef.remove(); }
               else if( typeof(console) !== 'undefined' && console.error ) {  console.error(error); }
          });
     });    

  console.log("old---"+ statusOrder+"/"+id);
  console.log("next---"+status+"/"+id)     
   $("#modalAnimation").modal("show");

}


function moveFbRecord(oldRef, newRef) {    
     oldRef.once('value', function(snap)  {
          newRef.set( snap.value(), function(error) {
               if( !error ) {  oldRef.remove(); }
               else if( typeof(console) !== 'undefined' && console.error ) {  console.error(error); }
          });
     });
}

//oculta o muestra el progress Bar
function toFade(){
  $("#myProgress").css("display", "none");
}


function progressbar(progress) {
    $("#myProgress").css("display", "none");
    //$("#btns_group").css("display", "none");
    $("#myProgress").fadeIn(1000)

    var elem = document.getElementById("myBar");   
    var width = 1;
    var id = setInterval(frame, progress);
    function frame() {
      if (width >= 100) {
        clearInterval(id);  
              
      } else {
        width++; 
        elem.style.width = width + '%'; 
      }
    }
 
}


 const loadCategories=(route)=>{ 
    firebase.database()
          .ref(route)
          .on('child_added', function(snapshot){
            $("#dd_category").append("<option>"+snapshot.key+"</option>") ; 
              for (var sub in snapshot.val()){
                  $("#dd_subCategory").append("<option>"+sub+"</option>");
                  _displayStorageTable(snapshot.key,sub,true)
              }

          }); 
       $("#dd_category").append("<option selected>Todas</option>") ; 
       $("#dd_subCategory").append("<option selected>Todas</option>");
 }      

//CONTROLLER METHODS

/**
 * capture table storage row and set to form
 */function _captureRowData(ID_TABLE="tbl_storage", modalView = 'modalForm', isForm=true){
   //TABLE LISTENER
    let table = $('#'+ID_TABLE).DataTable();
    $('#'+ID_TABLE+' tbody').on( 'click', 'tr', function () {
      let data = table.row( this ).data();
        if(data[0]!= undefined) {
          
         
          if(isForm){
            _write(data);
                 $('#'+modalView).modal('show');
          }else{
            iterableNodes(data);
          }
         

        }else{
         isForm?
                 _modalError("Selecione antes una categoria y sub-categoria de productos","Error")
              :
                _modalError("Problema para cargar su orden","Error")
              ;
          $('#modalError').modal('show');
        }
    } );
}

/**
 * load produc in form
 */function setDataTale(set){
      if(set){
        showPage("frm_products",true);
       }else{
        _reset();
       }
       action="ACTUALIZAR";      
  }


/**
 * Write data in form
 */ function _write(data){
     $("#txt_productID").val(data[0]);
     $("#txt_productName").val(data[1]);
     $("#ta_descripPro").val(data[2]);
     $("#txt_lot").val(data[3]);
     $("#txt_price").val(data[4]);
     $("#txt_barCode").val(data[6]);
     $("#txt_oldPrice").val(data[5]);
     $("#txt_productModel").val(data[8]);
     $("#txt_trademark").val(data[7]);
     $("#txt_productSize").val(data[10]);
     $("#txt_category").val(data[14]);
     $("#txt_subCategory").val(data[15]);
     //_imgPreview(data[0],data[11]);
     $("#btn_push").val("ACTUALIZAR");
     action="ACTUALIZAR"
     form=data;
     $("#btn_delete").css("visible",true);     
     _modalContent(data,data[1]);
  }

/*
    Clean inputs
 */ function _reset(){
       $("#txt_productID").val("");
       $("#txt_barCode").val("");
       $("#txt_productName").val("");
       $("#txt_productModel").val("");
       $("#txt_price").val("");
       $("#txt_oldPrice").val("");
       $("#txt_trademark").val("");
       $("#txt_productSize").val("");
       $("#ta_descripPro").val("");
       $("#txt_lot").val("");
       //location.reload(); 
  }


  /*
    lista los pedidos
 */function _displayStorageTable(category,subCategory, hasAll){
     let route = CATEGORY_PRODUCTS+"/"+category+"/"+subCategory;
     console.log(route);
     if(category !="Todas" && subCategory !="Todas"){
      loadDataTable(route,hasAll)
     }  ; 
  }

   
/*
    Listening page actions
 */function _onChangeStatusPage(catalog){
    //VARS
      let materials={},colors={};
      let category,subCategory;
       
    //CHANGE LISTENER 
      $('#dd_category').change(()=>{category=$('#dd_category').val()}); 
      $('#dd_subCategory').change(()=>{
                                        $("#btn_push").val(action);
                                        subCategory=$('#dd_subCategory').val();
                                        _displayStorageTable(category,subCategory);
                                      });
      $('#dd_materials').change(function () {
      $("#dd_materials option:selected" ).each(function(i) {
                                                              materials[i]=$( this ).text();
                                                              });
                                          })
                                          .change();
      $('#dd_colors').change(function () {
      $("#dd_colors option:selected" ).each(function(i) {
                                                              colors[i]=$( this ).text();
                                                              });
                                          })
                                          .change();
    //CLICKS LISTENER                                        
      $('#item_table').click(()=>{showPage("tbl_products",true)});
      $('#item_frm').click(()=>{showPage("frm_products",true)});
      //$('#btn_goForm').click(()=>{showPage("frm_products",true)});
      $('#btn_reset').click(()=>{_reset()});
      $('#btn_push').click(()=> {_addProduct(materials,catalog,colors)});
      $('#btn_delete').click(()=> {deleteData(CATEGORY_PRODUCTS+"/"+category+"/"+subCategory+"/"+form[0]+"/")});
      $("#btn_delete").css("visible",true);

      //orders access
      $('#btn_orderRequest').click(()=>{
        tbl_order.clear();
        loadOrder("request");
        showPage("tbl_orders",true);

      });
      $('#btn_orderProcessed').click(()=>{
        tbl_order.clear();
        loadOrder("processed");
        showPage("tbl_orders",true);
      });
      $('#btn_orderDelivered').click(()=>{
        tbl_order.clear();
        loadOrder("delivered");
        showPage("tbl_orders",true);
      });
      $('#btn_orderCanceled').click(()=>{
        tbl_order.clear();
        loadOrder("canceled");
        showPage("tbl_orders",true);
      });


      $("#btn_dispatcher").click(()=>{
          let id = $("#pl_carrito_id").text();
          id = id.replace("N° ","");
          dispatcher(id);
      });

     $("#btn_cancelar_orden").click(()=>{
        let id = $("#pl_carrito_id").text();
        id = id.replace("N° ","");
        dispatcher(id,true);
      
      });
      
      
    //METHODS TABLE
      _captureRowData();//products
      _captureRowData("tbl_order",'modalOrder',false);//cus
       loadCategories(CATEGORY_PRODUCTS);
       loadOrder(statusOrder);
  }   

/*
    Controller data Product to be added
 */function _addProduct(materials,catalog,colors){
        let id =document.getElementById('txt_productID').value ;
        let barCode =document.getElementById('txt_barCode').value ;
        let name =document.getElementById('txt_productName').value ;
        let model =document.getElementById('txt_productModel').value ;
        let lot =document.getElementById('txt_lot').value ;
        let price =document.getElementById('txt_price').value ;
        let oldPrice =document.getElementById('txt_oldPrice').value ;
        let tradeMark =document.getElementById('txt_trademark').value ;
        let size =document.getElementById('txt_productSize').value ;
        let description =document.getElementById('ta_descripPro').value;
        let category =document.getElementById('txt_category').value;
        let subCategory =document.getElementById('txt_subCategory').value;
        console.log(id);
        const product={
            category,
            subCategory,
            barCode,
            name,
            model,
            lot,
            price,
            oldPrice,
            tradeMark,
            size,
            description,
            materials,
            catalog,
            colors,
            rating:0
        };
       let route = CATEGORY_PRODUCTS+"/"+product.category+"/"+product.subCategory+"/"+id+"/";
        console.log(route+product);
         console.log(product);
        //console.log(product);
        if(action=="GUARDAR"){
          
          addData(route,product);
        }else{
          updateData(route,product); 
          location.reload();
          }  
          console.log(action);
          
    }
// --------------- FUNCTION UTIL ---------------

/**
 * Optimizador de informacion de objetos
 * -limpia los datos nulos o vacios
 * - retorna el objeto con la informacion necesaria
 */
function _cleanObj( obj )
  {
    for( let prop in obj ){
      if( obj[prop] == '' || obj[prop] == null ){ delete obj[prop]; }
    }
    return obj;
  } 

/**
 * traza el contenido del modal
 */
function _modalContent(data,title){
    // Create Cart Elemets
    // console.log(title);
    // console.log(data);

    var $img0 = $("<img>", {id:"", "class":"media-object", width:120, "alt":"Sample Image", src:data[11][0]});
    var $h0 = $("<h2>", {id:"", class:"media-heading text-warning", text: data[1]});
    var $h1 = $("<h4>", {id:"", class:"deleteText", text: data[2]});
    $("#modal-title-form").html(title)
    $("#modal-img-form").html($img0);
    $("#modal-body-form").html($h0);
    $("#modal-body-form").html($h1);
  
}

/**
 * traza el contenido del modalError
 */
function _modalError(msg,title){
    var $h1 = $("<h4>", {id:"", class:"deleteText", text: msg});
    $("#modal-title-error").html(title)
    $("#modal-msg").html($h1);
}


// --------------- NAVEGATION DASHBOARD ---------------

/*
  Animation to navigation page
 */const showPage=(id="tbl_orders",display="true")=>{//frm || tbl 
      //hide all page here!
       toFade();
      $("#frm_products").css("display", "none");
      $("#tbl_products").css("display", "none");
      $("#tbl_orders").css("display", "none");

      
      let page =$("#"+id);
      page.css("display", display?"display":"none");
      display?page.fadeIn(1000):page.fadeOut(1000);
      screen =id;
  
    }
      
/*
  main
 */
$(document).on('ready', function() {
    showPage();

    var catalog =[];
    _fileUpload(catalog);

          
//---------------------- DASHBOARD ADMINISTRATOR FORM LISTENER -------------------------------
    _onChangeStatusPage(catalog);
    $("#modalHome").modal("show");

});
//mantener aqui!!
loadSidebar();


//carga imagenes
function _fileUpload(catalog){
      $("#input-folder-2").fileinput({
        browseLabel: 'Selecciona imagenes...',
        previewFileType: "image",
        language: "es",
        showUpload: false,
        browseClass: "btn btn-success",
        browseLabel: "Catálogo",
        browseIcon: "<i class=\"glyphicon glyphicon-picture\"></i> ",
        removeClass: "btn btn-danger",
        removeLabel: "Eliminar",
        removeIcon: "<i class=\"glyphicon glyphicon-trash\"></i> ",
        uploadClass: "btn btn-info",
        uploadLabel: "Cargar",
        uploadIcon: "<i class=\"glyphicon glyphicon-upload\"></i> "
    });


    addImages(catalog);
    $("#myProgress").css("display", "none");
     $("#btns_group").css("display", "display");
}

//Loads the correct sidebar on window load,
//collapses the sidebar on window resize.
// Sets the min-height of #page-wrapper to window size
function loadSidebar(){
  $(function() {
    $(window).bind("load resize", function() {
        topOffset = 50;
        width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
        if (width < 768) {
            $('div.navbar-collapse').addClass('collapse');
            topOffset = 100; // 2-row-menu
        } else {
            $('div.navbar-collapse').removeClass('collapse');
        }

        height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
        height = height - topOffset;
        if (height < 1) height = 1;
        if (height > topOffset) {
            $("#page-wrapper").css("min-height", (height) + "px");
        }
    });

    var url = window.location;
    var element = $('ul.nav a').filter(function() {
        return this.href == url || url.href.indexOf(this.href) == 0;
    }).addClass('active').parent().parent().addClass('in').parent();
    if (element.is('li')) {
        element.addClass('active');
    }
});
}

function addImages(catalog){
  $('#input-folder-2').on('fileloaded', function(event, file, previewId, index, reader) {

      console.log(event)

        var storage = firebase.storage();
        var storageRef = storage.ref();
        var metadata = {
          contentType: 'image/jpeg'
        };
        var uploadTask = storageRef.child($("#txt_productID").val()+'/' + "img-"+index).put(file, metadata);
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
          function(snapshot) {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            
            progressbar(progress+10);
            
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
              case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                
                break;
            }
          }, function(error) {
          switch (error.code) {
            case 'storage/unauthorized':
              break;
            case 'storage/canceled':
              break;
            case 'storage/unknown':
              break;

              $("#myProgress").css("background","red");
              $("#btns_group").fadeIn(1000);
          }
        }, function() {
          var downloadURL = uploadTask.snapshot.downloadURL;
          console.log(downloadURL);
          catalog.push(downloadURL); 
    
        });
      
       
    });


}


function _imgPreview(key,catalog){
 var img = "";
 var btn="";
 var div = "";
  for (var i = 0; i < catalog.length; i++) {
    img = $("<img>", {id:"img-"+i, "class":"media-object", width:80,height:80,"alt":"Sample Image", src:catalog[i]});
    btn = $("<input>", {id:catalog[i], type:"button", value:"Borrar", "class":"btn btn-danger", onclick:"deleteImg("+i+")"});
    
    $("#img-preview").append(img);
    $("#img-preview").append(btn);
  }

}

function deleteImg(i){
   console.log(i);
  // console.log(id);
  var storage = firebase.storage();

    // Create a storage reference from our storage service
    var storageRef = storage.ref();
      // Create a reference to the file to delete
    var desertRef = storageRef.child(form[0]+'/img-'+i);

    // Delete the file
    desertRef.delete().then(function() {
      console.log("Borrado-->"+id+"/"+img);
    }).catch(function(error) {
          console.log(error);
    });
}




