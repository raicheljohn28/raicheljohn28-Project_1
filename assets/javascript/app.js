///////////////////////////////////////////////////////////// Index search button Local Storage ///////////////////////////////////////// 
var productSearch = '';
var productSearchLS = '';
$('#index-search-button').on('click', function() {

  productSearch = $('#index-input').val();
  window.localStorage.setItem('productSearchLS', productSearch);

  //go to testsearch page
  window.location = 'testsearch.html';      

});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////// Initial Onclick for Search Button testsearch.html ///////////////////////////////////////// 
$('#search-button').on('click', function() {

  productSearch = $('#productSearch').val();
  //remove the previous search
  $("#customers").find("tr:gt(0)").remove();

  //if Product Search is not Empty execute this API calls
  if(productSearch != ''){
    //Try BestBuy API call

    try{
      searchBestBuy(productSearch);
    }
    catch(error){  
      var errorMessage = error.name + ' ' + error.message;
      console.log(errorMessage);
    }

    //Try Wal-mart API call
    try{
      searchWalmart(productSearch);
    }
    catch(error){
      var errorMessage = error.name + ' ' + error.message;
      console.log(errorMessage);
    }
  } 
  });
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
/////////////////////////////////////////////////////////////// API Functions /////////////////////////////////////////////////////////////// 
//missing image
    var missingImage = 'assets/images/imagenotavailable.jpg';  
        
    //walmart function 
    function searchWalmart(productSearch){

    //variables for Wal-mart function 
    var walmart_query = productSearch;
    var walmart_apiKey = 'wymapcqzkbzwruabx9t3cefx';
    var walmart_logo = '<td><img class="vendor-logo" src="assets/images/walmart-logo-transparent.png" alt="walmart"></td>'

    //Wal-mart API function 
    $.ajax({
        url: "https://mighty-river-19291.herokuapp.com/cors",
        data: {
            url:'http://api.walmartlabs.com/v1/search?apiKey=' + walmart_apiKey + '&query=' + walmart_query,
            key:"8b5dcaf7cdfb9c46221d492eec6560c571d6ec218b2485c54075ab7840fa77f9"
        },
        method: "POST"
      }).then(function(walmart_response) {
        // Get reference to existing tbody element, create a new table row element
          //console.log("walmart", walmart_response);
          //console.log("walmart items", walmart_response.items);
          
          //constructor for items 
          const{items} = walmart_response; 
         
         //for loop to loop through wal-mart products 
         for (i = 0; i < 5; i++) {
            //console.log("item " + i +":  "+ items[i].name, "sales price:  " + items[i].salePrice, "medium image:   " + items[i].mediumImage)

            var walmartImage = items[i].mediumImage;

            if(walmartImage != null){
              walmartImage = walmartImage;
            }
            else{
              walmartImage = missingImage;
            }

            $('#customers').append(
              '<tr><td>' 
              + items[i].name + 
              '</td><td><img class="result-thumbnail" src="'
              + items[i].mediumImage +
              '" alt = "product" width="140"></td>' 
              + walmart_logo + 
              '<td>$' 
              + items[i].salePrice + 
              '</td></tr>');
        }
      });
    }

    //Best Buy function 
    function searchBestBuy(productSearch){

      //BestBuy API variables
      var bestbuy_query = productSearch;
      var bestbuy_apiKey = 'N45Lkw1tBElVvgFZZmAYoPaw';
      var bestbuy_queryURL = 'https://api.bestbuy.com/v1/products((search=' + bestbuy_query + '))?apiKey=' + bestbuy_apiKey + '&format=json';
      var bestbuy_logo = '<td><img class="vendor-logo" src="assets/images/best-buy-logo-transparent.png" alt="bestbuy"></td>'
  
      //BestBuy API Call
      $.ajax({
        url: bestbuy_queryURL,
        method: 'GET'
      }).then(function(bestbuy_response) {
        // Get reference to existing tbody element, create a new table row element
          //console.log("best buy", bestbuy_response);
          //console.log("best buy products", bestbuy_response.products);

          //constructor for products
          const{products} = bestbuy_response; 
          
          //for loop through Best Buy API
          for (i = 0; i < 5; i++) {
            //console.log("item " + i +":  "+ products[i].name, "sales price:  " + products[i].salePrice, "medium image:   " + products[i].image)
            
            var bestBuyImage = products[i].image;

            if(bestBuyImage != null){
              bestBuyImage = bestBuyImage;
            }
            else{
              bestBuyImage = missingImage;
            }
            
            $('#customers').append(
              '<tr><td>'
              + products[i].name + 
              '</td><td><img class="result-thumbnail" src="'
              + bestBuyImage +
              '" alt = "product" width="140"></td>' 
              + bestbuy_logo + 
              '<td>$' 
              + products[i].salePrice +
              '</td></tr>');
          }
      });
    }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////// Initial Cateogry Bins ///////////////////////////////////////////////////////    

var catBinsObj = {
  Household : ['bleach'], 
  Skincare : ['lotion'],
  HairCare : ['shampoo','styling gel'], 
  Clothes : ['jacket'], 
  PartySupplies : ['water']
};

localStorage.setItem("catBinsObjInitialLocal", JSON.stringify(catBinsObj));
var catBinsObjRLS = localStorage.getItem("catBinsObjInitialLocal");

var catBinsObj2 = JSON.parse(catBinsObjRLS);

var catBinsArray = Object.keys(catBinsObj2);

$.each(catBinsArray, function (index, value) {
  $('#bins').append($('<option/>', { 
      value: value,
      text : value 
  }));
});      
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////// Modal ///////////////////////////////////////////////////////////////////
      // Get the modal
      var modal = document.getElementById('myModal');
      
      // Get the button that opens the modal
      var btnModal = document.getElementById("create-bin-button");
      
      // Get the <span> element that closes the modal
      var span = document.getElementsByClassName("close")[0];
      
      // When the user clicks the button, open the modal 
      btnModal.onclick = function() {
          modal.style.display = "block";
      }
      
      // When the user clicks on <span> (x), close the modal
      span.onclick = function(event) {
          modal.style.display = "none";
      }
      
      // When the user clicks anywhere outside of the modal, close it
      window.onclick = function(event) {
          if (event.target == modal) {
              modal.style.display = "none";
          }
      }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////// Modal input /////////////////////////////////////////////



///////////////////////////////////////////////// Added Product to ßCateogry to Bins  //////////////////////////////////////////
var productToAddToBin;
var categoryBinToAddProduct; 

function addToCategoryBins(){
  productToAddToBin = $('#productSearch').val();
  categoryBinToAddProduct = $("#bins option:selected").text();

  if(productToAddToBin && categoryBinToAddProduct != ''){
  //alert("Product: " + productToAddToBin + " added to Category Bin:" + categoryBinToAddProduct);
  catBinsObjRLS = localStorage.getItem("catBinsObjInitialLocal");
  catBinsObjRLS = JSON.parse(catBinsObjRLS);

  //push the value to the bin
  catBinsObj2[categoryBinToAddProduct].push(productToAddToBin)
  }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////


for(var i = 0; i < catBinsArray.length ; i++){
  $('#div-for-category-bins').append(
    '<div id="bin-container">' +
  '<div class="category-header effect8">' +
    '<p id="user-category">' + catBinsArray[i] + '</p>' +
  '</div>' +
  '<div class="remove-bin hvr-grow-shadow">X</div>' +
  '<div id="bin-category-1">' +
    '<table class="customers-bin" id="tbl-' + catBinsArray[i] + '">' +
      '<tr id="bin-table-header-' + catBinsArray[i] + '">' +
        '<th>Product</th>' +
        '<th class="photo-column">Photo</th>' +
        '<th class="vendor-column">Vendor</th>' +
        '<th class="price-column">Price</th>' +
      '</tr>' +
    '</table>' +
  '</div>' +
  '</div>' );
}

// //loop through array of keys /// this is moving slowly. 
var singleProduct;
var prodArrayFromCatBins = []; 
for(var i = 0; i < catBinsArray.length; i++){
  var binKey = catBinsArray[i];
  prodArrayFromCatBins = catBinsObj2[binKey];
  
  if(prodArrayFromCatBins != ''){
    //console.log(binKey, prodArrayFromCatBins);
    for(var j = 0; j < prodArrayFromCatBins.length; j++){
      singleProduct = prodArrayFromCatBins[j];

      searchBestBuyGroup(binKey, singleProduct);
      searchWalmartGroup(binKey, singleProduct);


    }


  }
  
}

//////////////////////////////////////////////////////////// Best Buy Fncn Group /////////////////////////////////////////////////////////
// //Best Buy function 
function searchBestBuyGroup(binKey, singleProduct){

  //BestBuy API variables
  var bestbuy_query = singleProduct;
  var bestbuy_apiKey = 'N45Lkw1tBElVvgFZZmAYoPaw';
  var bestbuy_queryURL = 'https://api.bestbuy.com/v1/products((search=' + bestbuy_query + '))?apiKey=' + bestbuy_apiKey + '&format=json';
  var bestbuy_logo = '<img class="vendor-logo" src="assets/images/best-buy-logo-transparent.png" alt="bestbuy">'

  //BestBuy API Call
  $.ajax({
    url: bestbuy_queryURL,
    method: 'GET'
  }).then(function(bestbuy_response) {
    // Get reference to existing tbody element, create a new table row element
      //console.log("best buy", bestbuy_response);
      //console.log("best buy products", bestbuy_response.products);

      //constructor for products
      const{products} = bestbuy_response; 
      
      //for loop through Best Buy API
      for (i = 0; i < 5; i++) {
        //console.log("item " + i +":  "+ products[i].name, "sales price:  " + products[i].salePrice, "medium image:   " + products[i].image)
        
        var bestBuyImage = products[i].image;

        if(bestBuyImage != null){
          bestBuyImage = bestBuyImage;
        }
        else{
          bestBuyImage = missingImage;
        }
        var tag = "$('" + '#tbl-'+ binKey + "')"
        var filler = 
        "'" + '<tr>' +
        //product
        '<td>' + products[i].name  + '</td>'+
        //Product Image
        '<td><img class="result-thumbnail" src="' + bestBuyImage + '" alt = "product" width="140"></td>' +
        //Vendor
        '<td>' + bestbuy_logo + '</td>' +
        //Price
        '<td>$' + products[i].salePrice + '</td>'
        +'</tr>';
  
        $('#tbl-' + binKey).append("'" + filler + "'");
        

      }
  });
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //walmart function 
  function searchWalmartGroup(binKey, singleProduct){

    //variables for Wal-mart function 
    var walmart_query = singleProduct;
    var walmart_apiKey = 'wymapcqzkbzwruabx9t3cefx';
    var walmart_logo = '<td><img class="vendor-logo" src="assets/images/walmart-logo-transparent.png" alt="walmart"></td>'

    //Wal-mart API function 
    $.ajax({
        url: "https://mighty-river-19291.herokuapp.com/cors",
        data: {
            url:'http://api.walmartlabs.com/v1/search?apiKey=' + walmart_apiKey + '&query=' + walmart_query,
            key:"8b5dcaf7cdfb9c46221d492eec6560c571d6ec218b2485c54075ab7840fa77f9"
        },
        method: "POST"
      }).then(function(walmart_response) {
        // Get reference to existing tbody element, create a new table row element
          //console.log("walmart", walmart_response);
          //console.log("walmart items", walmart_response.items);
          
          //constructor for items 
          const{items} = walmart_response; 
         
         //for loop to loop through wal-mart products 
         for (i = 0; i < 5; i++) {
            console.log("item " + i +":  "+ items[i].name, "sales price:  " + items[i].salePrice, "medium image:   " + items[i].mediumImage)

            var walmartImage = items[i].mediumImage;

            if(walmartImage != null){
              walmartImage = walmartImage;
            }
            else{
              walmartImage = missingImage;
            }

            var tag = "$('" + '#tbl-'+ binKey + "')"
            var filler = 
            "'" + '<tr>' +
            //product
            '<td>' + items[i].name  + '</td>'+
            //Product Image
            '<td><img class="result-thumbnail" src="' + walmartImage  + '" alt = "product" width="140"></td>' +
            //Vendor
            walmart_logo +
            //Price
            '<td>$' + items[i].salePrice+ '</td>'
            +'</tr>';
      
            $('#tbl-' + binKey).append("'" + filler + "'");
            console.log($('#tbl-' + binKey).append("'" + filler + "'"));
        }
      });
    }
