;(function(context){
    useFullPageImgPreview();

    const checkSupport = (function(){
        let isSupportGrid = !!getComputedStyle(document.body).grid; 

        if ( !isSupportGrid ) {
            document.querySelector('.hello-gp').append('Browser does not support Grid!!');
        }
    })();


})(window)