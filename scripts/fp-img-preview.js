(function(){
    
    const FP = (function(){
        let currImg = null,
            wrapper = null,
            shadow = null,
            currPos = {},
            transitionDuration = 300,
            scrollSpaceHeight = 40,
            xMinPadding = 30;
            yMinPadding = 20;

        const wait = duration => new Promise(res => { setTimeout( res, duration ) });

        const scrollHandler = (function () {
            let previousTop = 0,
                currentTop;
            return function (e) {
                currentTop = this.scrollTop;

                // if scroll to edge
                if ( currentTop <= 0 || currentTop + this.clientHeight >= this.scrollHeight) {
                    zoomOut();
                }

                previousTop = currentTop;
            }
        })()

        function getObj () {
            if (!currImg) {
                currImg = new Image();
                currImg.classList.add('fp-curr-img');

                wrapper = document.createElement('div');
                wrapper.classList.add('fp-wrapper');
                wrapper.appendChild(currImg);

                shadow = document.createElement('div');
                shadow.classList.add('fp-shadow', 'hidden');
                shadow.appendChild(wrapper);

                document.body.appendChild(shadow);                

                shadow.onscroll = scrollHandler;

                shadow.onclick = function () {
                    zoomOut();
                } 

                currImg.onload = function () {}
            }

            return currImg;
        }

        function setInitAttrs (src, pos) {
            currImg.src = src;
            currPos = pos;

            let scale = currPos.width / currImg.width ;
            
            wrapper.style.height = '0';
            currImg.style.transform = `translate3d( ${currPos.left}px, ${currPos.top + scrollSpaceHeight}px, 0 ) scale(${scale})`;

            shadow.classList.remove('hidden');

            // body overflow hidden, seems better not to hide
            document.body.style.overflow = 'hidden';
        }

        function zoomOut () {
            let scale = currPos.width / currImg.width,
                topOffset = shadow.scrollTop;

            const transFunc = () => { currImg.style.transform = `translate3d( ${currPos.left}px, ${currPos.top + topOffset}px, 0 ) scale(${scale})`; }
            currImg.classList.remove('active')
        
            new Promise(res => {
                setTimeout(transFunc, 0)
                res();
            })
            .then(() => wait(transitionDuration))
            .then(() => {
                shadow.classList.add('hidden');
                document.body.style.overflow = 'auto';
                
            })
        }

        function zoomIn() {
            let screenW = window.innerWidth || 1,
                screenH = window.innerHeight || 1,
                imgOriginW = currImg.width || 0,
                imgOriginH = currImg.height || 0,
                scale = (screenW - imgOriginW - xMinPadding * 2) >= 0 ? 1 : (screenW - xMinPadding * 2) / imgOriginW,
                paddingTop = (imgOriginH * scale + 2 * yMinPadding) >= screenH ? yMinPadding : (screenH - imgOriginH * scale) / 2,
                x,
                y;

            // calculate position
            x = (screenW - imgOriginW) >= 0 ? (screenW - imgOriginW) / 2 : xMinPadding;
            y = paddingTop + scrollSpaceHeight;

            // set wrapper height
            wrapper.style.height = `${imgOriginH * scale + paddingTop * 2 + scrollSpaceHeight * 2}px`;

            // make scroll space;
            shadow.scrollTop = scrollSpaceHeight;

            // emit transition
            let transFunc = () => { currImg.style.transform = `translate3d( ${x}px, ${y}px, 0 ) scale(${scale})`; }
            setTimeout(transFunc, 0);

            // set class
            currImg.classList.add('active')

            return this;
        }

        return {
            init (src, pos) {
                const currImg = getObj();
                setInitAttrs(src, pos);

                zoomIn()
                return this;
            },
            zoomIn,
            zoomOut
        }
    })()

    const defaultOpt = {
        // selector: 'img[data-fp-img=true]',
    }

    const clickHandler = function () {
        if (!this.complete) return;
        const src = this.src,
            rect = this.getBoundingClientRect(),
            pos = {
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height
            }
        src && FP.init(src, pos);
    }

    const useFullPageImgPreview = function (opts = {}) {
        const o = Object.assign({}, defaultOpt, opts)

        document.addEventListener('click', function (e) {
            if ( e.target.nodeName === 'IMG' && e.target.dataset['fpImg'] ) {
                clickHandler.call(e.target);
            }
        })
    }

    const root = this;
    
    if (typeof exports !== 'undefined') {
        // CMD
        if (module && module.exports) {
            exports = module.exports = useFullPageImgPreview;
        }
        exports.useFullPageImgPreview = useFullPageImgPreview;
        console.log('FP could only be used in front end, dont use it in Node env :)');
    } else if (typeof define === 'function' && define.amd){
        // AMD
        define( 'FullPageImgPreview', function () {
            return useFullPageImgPreview;
        })
    } else {
        root['useFullPageImgPreview'] = useFullPageImgPreview;
    }

}).call(this)
