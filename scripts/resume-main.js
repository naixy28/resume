;(function(context){
    // carousel
    const CarouselD = (function () {
        let defaultOpts = {
                containerSelector: '.carousel-container',
                itemSelector: '.carousel-item'
            },
            o = {},  
            $ = document.querySelector.bind(document),
            $$ = document.querySelectorAll.bind(document);

        function dragHandler (e) {
            console.log(e.clientX);
            e.DataTransfer.setDragImage(null, 0, 0);
        }

        return function (opts = {}) {
            o = this.opts = Object.assign({}, defaultOpts, opts);
            this.ct = $(o.containerSelector);
            this.items = $$(o.itemSelector);

            // this.ct.setAttribute('draggable', 'true');
            this.items.forEach((val, index) => {
                val.setAttribute('draggable', 'true');
            })
            

            this.ct.addEventListener('dragstart', dragHandler)
            // this.ct.addEventListener('drag', dragHandler)
        }
    })()

    // context.basicMsgCarousel = new CarouselD();
})(window)