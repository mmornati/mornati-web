function markeclaudioFlickrBox(id){
$.getJSON("https://api.flickr.com/services/feeds/photos_public.gne?id="+id+"&lang=it-it&format=json&jsoncallback=?", function(data){
        $.each(data.items, function(i,item){
            $("<img class='imgflikr' />").attr("src", item.media.m).appendTo("#flickrbox").wrap("<div class='imagesflickr'><a title='"+item.tags+"' rel='prettyPhoto[flickrgallery]' href='"+item.media.m.replace("_m.jpg", "_z.jpg")+"'></a></div>").mouseover(function() {
              $(this).css("filter","alpha(opacity=70)");
              $(this).css("-moz-opacity",".70");
              $(this).css("opacity",".70");

            }).mouseout(function(){
               $(this).css("filter","alpha(opacity=1)");
              $(this).css("-moz-opacity","1");
              $(this).css("opacity","1");

            });

            });
        $("a[rel^='prettyPhoto']").prettyPhoto();
    });

}
