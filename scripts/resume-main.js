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

    const TopBtn = (function(){
        const btn = document.querySelector('.to-top'),
            scroller = window,
            scrollee = document.body,
            hideClassName = 'hide',
            duration = 300;

        let prevState = false, // true -> show, false -> hide
            height,
            top;

        scroller.addEventListener('scroll', scrollHandler);
        btn.addEventListener('click', clickHandler);

        function scrollHandler (e) {
            top = scrollee.scrollTop || 500;
            height = scroller.innerHeight || scroller.clientHeight;

            let currState = top > height;

            if ( currState === prevState ) return;
            prevState = currState;

            if ( !currState ) {
                btn.classList.add( hideClassName );
            } else {
                btn.classList.remove( hideClassName );
            }
        }

        function clickHandler (e) {
            let prevTop = top,
                step = prevTop / (duration / 16.6667); // linear

            let timer = requestAnimationFrame(function f(){
                scrollee.scrollTop -= step;
                prevTop -= step;

                if ( prevTop > 0) {
                    timer = requestAnimationFrame(f)
                } else {
                    scrollee.scrollTop = 0;
                }
            });

        }

        return {}
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