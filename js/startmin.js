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

//------------ ROUTES ------------------
/*PRODUCTS*/
    const PRODUCTS = "storage/products";
    const CATEGORY_PRODUCTS=  PRODUCTS+"/categories";

/*ORDERS*/
    const ORDERS = "storage/orders";
    const ORDER_PROFUCTS=  ORDERS+"/categories";


//---------- MANAGEMENT DATA METHODS -----------
//ADD NODES
const addData = (route, obj)=>{
  firebase.database()
          .ref(route)
          .set({...obj})
          .then(()=>console.log("Realizado con exito!"))
          .catch((error)=>console.log("Error: "+error));
}

//DELETE
const deleteData=(route)=>{
    alert(route);
}
//DISPLAY   
const loadDataTable=(route)=>{
  let val,category,subcategoria,content,id;
  firebase.database()
          .ref(route)
          .on('value', function(snapshot){
              if(snapshot.exists()) snapshot.forEach(function(data){ 
                  val= data.val();
                  category = Object.keys(val)[0];
                  category = Object.getOwnPropertyDescriptor(val, category);
                  subcategory = Object.keys(category.value)[0];
                  subcategory = Object.getOwnPropertyDescriptor(category.value, subcategory);
                  product = subcategory.value;
                  id =Object.keys(category.value)[0];
                  content +='<tr class="gradeX" >';
                  content += '<td class="center">' + id + '</td>';
                  content += '<td class="center">' + product.name + '</td>';
                  content += '<td class="center">' + product.description + '</td>';
                  content += '<td>' + product.lot + '</td>';
                  content += '<td>' + product.price + '</td>';
                  content += '</tr>';
                  
                  });
                //$('#dataTable').append(content); 
          });
                           
                      //$('#dataTables-example').append(content);
}                
                      /* 

                      */

          
         // $('#dataTables-example').append(content);

    /*
    
   <tr class="gradeA">
                                                <td>Misc</td>
                                                <td>NetFront 3.1</td>
                                                <td>Embedded devices</td>
                                                <td class="center">-</td>
                                                <td class="center">C</td>
                                            </tr>

    
     <tr class="odd gradeX">
                                                <td>Trident</td>
                                                <td>Internet Explorer 4.0</td>
                                                <td>Win 95+</td>
                                                <td class="center">4</td>
                                                <td class="center">X</td>
                                            </tr>
     */


           /*let data=snapshot.val();

      let category = Object.keys(data)[0];
      category = Object.getOwnPropertyDescriptor(data, category);
      data = category.value;
      let subCategory = Object.keys(data)[0];
      console.log(subCategory);
      subCategory = Object.getOwnPropertyDescriptor(data,subCategory);
      data = subCategory.value;
      let id = Object.keys(data)[0]
      id = Object.getOwnPropertyDescriptor(data,id);
      let product = id.value;
      console.log(product);
      }
   

                      //console.log(Object.keys("subcategory: " +subCategory));
                      //console.log(Object.entries(val))
                      //
                     /* new Array(rows)
                    .fill(null)
                    .map(
                      (e, i) => {
                        points=points-5;
                        top=top-5
                        return(
                          <StampsView key={i} stamps={points} top={top<5?top:5} />
                        )
                      }
                    )*/
 
          /*var content = '';
          content +='<tr class="gradeA" >';
                      content += '<td class="center">' + "subcategory "+ '</td>';
                      content += '<td class="center">' + "product.name" + '</td>';
                      content += '<td class="center">' + "product.description" + '</td>';
                      content += '<td>' + "product.lot" + '</td>';
                      content += '<td>' + "product.price "+ '</td>';
                    
                      content += '</tr>';

                      content +='<tr class="gradeX" >';
                      content += '<td class="center">' + "subcategory "+ '</td>';
                      content += '<td class="center">' + "product.name" + '</td>';
                      content += '<td class="center">' + "product.description" + '</td>';
                      content += '<td>' + "product.lot" + '</td>';
                      content += '<td>' + "product.price "+ '</td>';
                    
                      content += '</tr>';*/


//CONTROLLER METHODS

/*
    Clean inputs
 */
 function _reset(){
       $("#txt_productID").val("");
       $("#txt_barCode").val("");
       $("#txt_productName").val("");
       $("#txt_productModel").val("");
       $("#txt_price").val("");
       $("#txt_oldPrice").val("");
       $("#txt_trademark").val("");
       $("#txt_productSize").val("");
       $("#ta_descripPro").val("");
       location.reload(); 
  }

/*
    Listening page actions
 */function _onChangeStatusPage(catalog){
    //VARS
      let materials = {};
      let category,subCategory,id,barCode,name,model,lot,price,oldPrice,tradeMark,size,description;
    //KEYUP LISTENER   
      $("#txt_productID").keyup(()=>{id=$("#txt_productID").val()});
      $("#txt_barCode").keyup(()=>{ barCode=$("#txt_barCode").val()});
      $("#txt_productName").keyup(()=>{ name=$("#txt_productName").val()});
      $("#txt_productModel").keyup(()=>{ model=$("#txt_productModel").val()});
      $("#txt_lot").keyup(()=>{ lot=$("#txt_lot").val()});
      $("#txt_price").keyup(()=>{ price=$("#txt_price").val()});
      $("#txt_oldPrice").keyup(()=>{ oldPrice=$("#txt_oldPrice").val()});
      $("#txt_trademark").keyup(()=>{ tradeMark=$("#txt_trademark").val()});
      $("#txt_productSize").keyup(()=>{ size=$("#txt_productSize").val()});
      $("#ta_descripPro").keyup(()=>{ description=$("#ta_descripPro").val()});
    //CHANGE LISTENER 
      $('#dd_category').change(()=>{category=$('#dd_category').val()}); 
      $('#dd_subCategory').change(()=>{subCategory=$('#dd_subCategory').val()}); 
      $('#dd_materials').change(function () {
      $("#dd_materials option:selected" ).each(function(i) {
                                                              materials[i]=$( this ).text();
                                                              });
                                          })
                                          .change();
    //CLICKS LISTENER                                        
      $('#item_table').click(()=>{showPage("tbl_products",true)});
      $('#item_frm').click(()=>{showPage("frm_products",true)});
      $('#btn_goForm').click(()=>{showPage("frm_products",true)});
      $('#btn_reset').click(()=>{_reset()});
      $('#btn_push').click(()=> {_addProduct(category,subCategory,id,barCode,name,model,lot,price,oldPrice,tradeMark,size,description,materials,catalog)});
    //METHODS
    loadDataTable(CATEGORY_PRODUCTS);
    //DATATABLES
     $('#dataTables-example').DataTable({responsive: true});
  }   

/*
    Controller data Product to be added
 */function _addProduct(category,subCategory,id,barCode,name,model,lot,price,oldPrice,tradeMark,size,description,materials,catalog){
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
            catalog
        };
       let route = CATEGORY_PRODUCTS+"/"+product.category+"/"+product.subCategory+"/"+id+"/";
        console.log(route);
        console.log(product);
        addData(route,product)
         
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










