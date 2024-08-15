$(function() {
    let menu = $("ul");

    $("button").on("click", function() {
        let inp = $("input").val();
        if (inp.trim() !== "") {
            menu.append(`<li><span>${inp}</span> <i class='bx bx-trash'></i> <i class='bx bx-check'></i></li>`);
            $("input").val(''); 
        }
    });

    menu.on("click", ".silme", function() {
        $(this).parent().remove();
    });

    menu.on("click", ".bx-check", function() {
        $(this).siblings("span").css("text-decoration", "line-through");
    });


    const filters = $('.blog_filters li');
    const items = $('.blog_item');

    filters.on('click', function () {
       // filter_active faylını bütün filtrlərdən silir.
        filters.removeClass('filter_active');
        
       // Kliklənmiş filtrə filter_active əlavə edir.
        $(this).addClass('filter_active');

        const filterValue = $(this).data('filter');

        items.each(function () {
            // Blog öğeleri bu filtreye göre gösterilir veya gizlenir; filtre değeri * ise, tüm öğeler gösterilir.
            if (filterValue === '*' || $(this).hasClass(filterValue.substring(1))) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });

    

   let totalPrice = 0;   // Səbətdəki mehsulların ümumi qiyməti
    let cartCount = 0;   // Səbətdəki mehsulların ümumi sayı

    // Səbətə əlavə et düyməsi
    $('.add-to-cart').click(function() {
        let name = $(this).data('name');
        let price = parseFloat($(this).data('price'));

        let exists = $('#cart ul li[data-name="' + name + '"]');
        
        // Məhsul artıq səbətdədirsə  miqdarı artırır və qiyməti yeniləyir
        if (exists.length) {
            let quantityElem = exists.find('.quantity').eq(0);
            let quantity = parseInt(quantityElem.text()) + 1;
            quantityElem.text(quantity);

            let itemPrice = price * quantity;
            exists.find('.item-price').text(itemPrice.toFixed(2));

            // Məhsul səbətdə deyilsə yeni məhsul əlavə edir və onu səbətə əlavə edir.
        } else {
            $('#cart ul').append(`
                <li data-name="` + name + `" data-price="` + price + `">
                    <img src="` + $(this).parents('.product').find('img').attr('src') + `" alt="">
                    <div class="product-info">
                        ` + name + ` - $<span class="item-price">` + price.toFixed(2) + `</span>
                        (<span class="quantity">1</span> adet)
                        <div class="quantity-controls">
                            <button class="decrease-quantity">-</button>
                            <span class="quantity">1</span>
                            <button class="increase-quantity">+</button>
                        </div>
                    </div>
                    <button class="remove-item"><i class='bx bx-trash'></i></button>
                </li>
                
            `);
        }

         totalPrice += price;  //Səbətin ümumi qiyməti
       cartCount++;   // Sepetteki ürün sayısını artırır.
        

    //    Ümumi qiyməti yeniləyir
        $('#total-price').text(totalPrice.toFixed(2)); 
        // Məhsulların sayını yeniləyir
        $('#cart-count').text(cartCount);
    });

    // Səbəti Aç/Bağla
    $('.cart-icon').click(function() {
        $('#cart-overlay').toggleClass('open');
    });

    $('#close-cart').click(function() {
        $('#cart-overlay').removeClass('open');
    });

    // Məhsulun miqdarını artırın
    $('#cart').on('click', '.increase-quantity', function() {
        let quantityElem = $(this).siblings('.quantity').eq(0);
        // Dəyişən miqdar məlumatını yeniləyir.
        let quantity = parseInt(quantityElem.text()) + 1;
        // dəyişən yenilənmiş qiyməti hesablayır
        quantityElem.text(quantity);

        let price = parseFloat($(this).parents('li').attr('data-price'));
        let itemPrice = price * quantity;
        $(this).parents('li').find('.item-price').text(itemPrice.toFixed(2));

        totalPrice += price;
        $('#total-price').text(totalPrice.toFixed(2)); 
        cartCount++;
        $('#cart-count').text(cartCount);
    });
//Məhsulun miqdarını azaldın
    $('#cart').on('click', '.decrease-quantity', function() {
        let quantityElem = $(this).siblings('.quantity').eq(0);
        let quantity = parseInt(quantityElem.text()) - 1;

        if (quantity > 0) {
            quantityElem.text(quantity);

            let price = parseFloat($(this).parents('li').attr('data-price'));
            let itemPrice = price * quantity;
            $(this).parents('li').find('.item-price').text(itemPrice.toFixed(2));

            totalPrice -= price;
            $('#total-price').text(totalPrice.toFixed(2)); 
            cartCount--;
            $('#cart-count').text(cartCount);
        }
    });

    // Məhsulun silinməsi prosesi
    $('#cart').on('click', '.remove-item', function() {
    // Silinəcək parrent elementini tapır və silir
        let productItem = $(this).parent(); 
        // console.log(productItem);
        $($(this))
        
        let quantity = parseInt(productItem.find('.quantity').eq(0).text());
        let price = parseFloat(productItem.attr('data-price'));


// Ümumi qiyməti və məhsulların sayını yeniləyin
        totalPrice -= price * quantity;
        cartCount -= quantity;

        $('#total-price').text(totalPrice.toFixed(2)); 
        $('#cart-count').text(cartCount); 

     // Məhsulu səbətdən tamamilə çıxarın
        productItem.remove(); 
    });



    let currentRow;

// Axtarış funksiyası
    $("#search").on("keyup", function() {
        let value = $(this).val().toLowerCase();
        $("#data-table tbody tr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });

       
    });

    // Sətir əlavə etmək
    $("#add-row-btn").click(function() {
        $("#add-row-modal").css("display", "block");
        $("#create-btn").text("Create");
        $("#name, #surname, #age").val("");
        // currentRow = null;
    });

    
//Modal pəncərənin bağlanması
    $(".close").click(function() {
        $("#add-row-modal").css("display", "none");
    });

  // Bir sıra əlavə edin və ya yeniləyin
    $("#create-btn").click(function() {
        // İstifadəçidən daxil edilmiş dəyərləri alır
        let name = $("#name").val();
        let surname = $("#surname").val();
        let age = $("#age").val();

        // Mövcud sıra seçilibsə, onu yeniləyir
        if (currentRow) {
            // Seçilmiş sıranın ikinci xanasını (ad sütunu) yeniləyir
            currentRow.find("td:nth-child(2)").text(name);
            // Seçilmiş sıranın üçüncü xanasını (soyad sütunu) yeniləyir
            currentRow.find("td:nth-child(3)").text(surname);
            //Seçilmiş sıranın dördüncü xanasını (yaş sütunu) yeniləyir
            currentRow.find("td:nth-child(4)").text(age);
        } else {
            // Cədvəlin sıra nömrəsini hesablayır və növbəti sıra nömrəsini təyin edir
            let rowCount = $("#data-table tbody tr").length + 1;
            $("#data-table tbody").append(`
                <tr>
                    <td>${rowCount}</td>
                    <td>${name}</td>
                    <td>${surname}</td>
                    <td>${age}</td>
                    <td><i class='bx bxs-edit-alt'></i></td>
                    <td><i class='bx bx-trash'></i></td>
                </tr>
            `);
        }
        $("#add-row-modal").css("display", "none");
    });

//   sətir düzənləmə
    $(document).on("click", ".bxs-edit-alt", function() {
        currentRow = $(this).closest("tr");
        $("#name").val(currentRow.find("td:nth-child(2)").text());
        $("#surname").val(currentRow.find("td:nth-child(3)").text());
        $("#age").val(currentRow.find("td:nth-child(4)").text());
        $("#create-btn").text("Update");
        $("#add-row-modal").css("display", "block");
    });

    // Sətiri silmə
    $(document).on("click", ".bx-trash", function() {
        $(this).closest("tr").remove();
    });
});
