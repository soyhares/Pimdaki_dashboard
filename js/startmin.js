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

//---------- MANAGEMENT DATA METHODS -----------
//ADD NODES
const addData = (route, obj)=>{
  firebase.database()
          .ref(route)
          .set({...obj})
          .then(()=>console.log("Realizado con exito!"))
          .catch((error)=>console.log("Error: "+error));
}

const updateData = (route, obj)=>{
  firebase.database()
          .ref(route)
          .update({...obj})
          .then(()=>console.log("Realizado con exito!"))
          .catch((error)=>console.log("Error: "+error));
          showPage("tbl_products",true);

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
//DISPLAY   
const loadDataTable=(route)=>{ 
  let table= $('#tbl_storage').DataTable();

  firebase.database()
          .ref(route)
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
                    10:data.size
  
                  }]).draw();
              }           
        }); 
 }  


//CONTROLLER METHODS

/**
 * capture table storage row and set to form
 */function _captureRowData(){
   //TABLE LISTENER
    let table = $('#tbl_storage').DataTable();
    $('#tbl_storage tbody').on( 'dblclick', 'tr', function () {
        console.log( table.row( this ).data() );
        _write(table.row( this ).data());
    } );
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
       $("#btn_push").val("ACTUALIZAR");
       showPage("frm_products",true);
       action="ACTUALIZAR"
       form=data;
       $("#btn_delete").css("visible",true);
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
       location.reload(); 
  }


  /*
    lista los pedidos
 */function _displayStorageTable(category,subCategory){
     let route = CATEGORY_PRODUCTS+"/"+category+"/"+subCategory;
     console.log(route);
     loadDataTable(route)
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
                                       if(screen=="tbl_products") _displayStorageTable(category,subCategory);
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
      $('#btn_push').click(()=> {_addProduct(category,subCategory,materials,catalog,colors)});
      $('#btn_delete').click(()=> {deleteData(CATEGORY_PRODUCTS+"/"+category+"/"+subCategory+"/"+form[0]+"/")});
      $("#btn_delete").css("visible",true);
    //METHODS
      _captureRowData();
      
    
  }   

/*
    Controller data Product to be added
 */function _addProduct(category,subCategory,materials,catalog,colors){
        let id =document.getElementById('txt_productID').value ;
        let barCode =document.getElementById('txt_barCode').value ;
        let name =document.getElementById('txt_productName').value ;
        let model =document.getElementById('txt_productModel').value ;
        let lot =document.getElementById('txt_lot').value ;
        let price =document.getElementById('txt_price').value ;
        let oldPrice =document.getElementById('txt_oldPrice').value ;
        let tradeMark =document.getElementById('txt_trademark').value ;
        let size =document.getElementById('txt_productSize').value ;
        let description =document.getElementById('ta_descripPro').value
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
        action=="GUARDAR"?addData(route,product):updateData(route,product);
        
    }
// --------------- NAVEGATION DASHBOARD ---------------

/*
  Animation to navigation page
 */const showPage=(id="tbl_products",display="true")=>{//frm || tbl 
      //hide all page here!
      $("#frm_products").css("display", "none");
      $("#tbl_products").css("display", "none");

      let page =$("#"+id);
      page.css("display", display?"display":"none");
      display?page.fadeIn(1000):page.fadeOut(1000);
      screen =id;
      action="GUARDAR"
    }
      
/*
  main
 */
$(document).on('ready', function() {
    showPage();
    $("#input-folder-2").fileinput({
        browseLabel: 'Selecciona imagenes...',
        previewFileType: "image",
        language: "es",
        showUpload: false,
        browseClass: "btn btn-success",
        browseLabel: "Agregar",
        browseIcon: "<i class=\"glyphicon glyphicon-picture\"></i> ",
        removeClass: "btn btn-danger",
        removeLabel: "Eliminar",
        removeIcon: "<i class=\"glyphicon glyphicon-trash\"></i> ",
        uploadClass: "btn btn-info",
        uploadLabel: "Cargar",
        uploadIcon: "<i class=\"glyphicon glyphicon-upload\"></i> "
    });
    // method chaining
    // $('#input-folder-2').fileinput('upload').fileinput('disable');
    var catalog =[];
    $('#input-folder-2').on('fileloaded', function(event, file, previewId, index, reader) {
        // Get a reference to the storage service, which is used to create references in your storage bucket
        var storage = firebase.storage();
        // Create a storage reference from our storage service
        var storageRef = storage.ref();
        //Create the file metadata
        var metadata = {
          contentType: 'image/jpeg'
        };
        //Upload file and metadata to the object 'images/mountains.jpg'
        var uploadTask = storageRef.child($("#txt_productID").val()+'/' + file.name).put(file, metadata);
        //Listen for state changes, errors, and completion of the upload.
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
          function(snapshot) {
            //Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
          //A full list of error codes is available at
          //https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case 'storage/unauthorized':
              //User doesn't have permission to access the object
              break;
            case 'storage/canceled':
              //User canceled the upload
              break;
            case 'storage/unknown':
              //Unknown error occurred, inspect error.serverResponse
              break;
          }
        }, function() {
          // Upload completed successfully, now we can get the download URL
          var downloadURL = uploadTask.snapshot.downloadURL;
          console.log(downloadURL);
          catalog.push(downloadURL);
         
          
        });
      
    });             

//---------------------- DASHBOARD ADMINISTRATOR FORM LISTENER -------------------------------
    _onChangeStatusPage(catalog);
    
});
//Loads the correct sidebar on window load,
//collapses the sidebar on window resize.
// Sets the min-height of #page-wrapper to window size
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










