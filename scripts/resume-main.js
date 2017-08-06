;(function(context){
    const   log = console.log.bind(console);

    // init img preview plugin
    useFullPageImgPreview();

    // check grid support and add notification
    const isSupportGrid = (function(){
        let isSupportGrid = !!getComputedStyle(document.body).grid; 

        if ( !isSupportGrid ) {
            document.querySelector('.hello-gp').append('Browser does not support Grid!!');
            return false;
        }
        return true;
    })();

    const Skills = (function(){
        const dom = document.querySelector('#skills') || null;

        let isFirst = true;

        function startTransition () {
            if (isFirst) {
                // log('you just scroll skills in sight!')
                isFirst = false;

                const donuts = dom.querySelectorAll('.donut');
                donuts.forEach(function (el) {
                    let p = Number(el.dataset.percentage || 0 );
                    el.style.strokeDasharray = `calc( 251% * ${p} ) 300%`;
                });
            }
        }

        function isInSight () {
            if ( document.body.scrollTop + window.innerHeight > dom.offsetTop) {
                return true;
            }
            return false;
        }

        return {
            startTransition,
            isInSight
        }
    })()

    // scroll listener
    const _onscroll = window.onscroll || function(){};
    window.onscroll = function(e) {
        _onscroll(e);
        if (Skills.isInSight()) {
            Skills.startTransition()
        }
    };


})(window)