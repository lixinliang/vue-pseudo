'use strict';

const noop = () => {};

const on = 'addEventListener';
const off = 'removeEventListener';

const mobile = /Android|webOS|iPhone|Windows Phone|iPod|iPad|BlackBerry|SymbianOS/i.test(navigator.userAgent);

export default function ( Vue ) {
    Vue.directive('pseudo', {
        bind () {
            let self = this;
            this._handler = noop;
            this._listener = function () {
                self._handler.apply(this, arguments);
            };
            let el = this.el;
            let _listener = this._listener;
            if (this.arg == 'active') {
                if (mobile) {
                    el[on]('touchstart', _listener, false);
                    el[on]('touchend', _listener, false);
                    el[on]('touchcancel', _listener, false);
                } else {
                    el[on]('mousedown', _listener, false);
                    el[on]('mouseup', _listener, false);
                }
            }
        },
        update ( value ) {
            let el = this.el;
            if (this.arg == 'active') {
                let classList = [];
                if (value && typeof value == 'object') {
                    if (value instanceof Array) {
                        classList = value;
                    } else {
                        for (let className in value) {
                            if (value[className]) {
                                classList.push(className);
                            }
                        }
                    }
                } else {
                    classList = ('' + value).split(' ');
                }
                this._handler = function ( event ) {
                    classList.forEach(( className ) => {
                        if (className) {
                            if (event.type == 'touchstart' || event.type == 'mousedown') {
                                el.classList.add(className);
                            } else {
                                el.classList.remove(className);
                            }
                        }
                    });
                };
            }
        },
        unbind () {
            let el = this.el;
            let _listener = this._listener;
            if (this.arg == 'active') {
                if (mobile) {
                    el[off]('touchstart', _listener, false);
                    el[off]('touchend', _listener, false);
                    el[off]('touchcancel', _listener, false);
                } else {
                    el[off]('mousedown', _listener, false);
                    el[off]('mouseup', _listener, false);
                }
            }
        },
    });
};
