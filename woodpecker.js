var woodpecker = woodpecker || (function() {

    var Woodpecker = {

        /*
         * Set up state constants
         *
         * NO SELECTION
         *   On event:
         *     Always move to BLOCK SELECTION
         */
        NO_SELECTION: 0,

        /* BLOCK_SELECTION
         *   State:
         *       Block of text is selected
         *   On event:
         *       If event is inside selection move to SINGLE WORD SELECTION
         *       If event is outside selection move to NO SELECTION
         */
        BLOCK_SELECTION: 1,

        /* SINGLE_WORD_SELECTION
         *   State:
         *     Single word is selected within block
         *   On event:
         *     If event is inside selection move to CURSOR ACTIVE
         *     If event is outside selection but inside block move to MULTIPLE WORD SELECTION
         *     If event is outside selection and block move to NO SELECTION
         */
        SINGLE_WORD_SELECTION: 3,

        /* MULTIPLE WORD SELECTION
         *   State:
         *     Multiple words are selected between previously selected and targeted word
         *   Attributes:
         *     Primary word: the first word selected
         *     Secondary word: the second word selected, at the opposite end of the selection from the primary word
         *   On event:
         *     If event is inside selection move to SINGLE WORD SELECTION
         *     If event is outside selection move to NO SELECTION
         */
        MULTIPLE_WORD_SELECTION: 4,

        /* CURSOR ACTIVE
         *   State:
         *       Cursor is active at position
         *   On event:
         *       If target is selected move to state 0
         *       If target is not selected move to state 2
         */
        CURSOR_ACTIVE: 5,

        getState: function(element) {
            return element.getAttribute('data-woodpecker-state') || 0;
        },

        nextState: function(element) {
            var state = this.getState(element);
        },

        resetState: function(element) {
            return;
        },

        /**
         * NB. this method is _deeply_ indebted to (by which I mean _copied from_)
         *     this fiddle: http://jsfiddle.net/Vap7C/80/
         */
        getSelection: function() {
            // Gets clicked on word (or selected text if text is selected)
            var t = "";
            if (window.getSelection && (sel = window.getSelection()).modify) {
                // Webkit, Gecko
                var s = window.getSelection();
                if (s.isCollapsed) {
                    s.modify('move', 'forward', 'character');
                    s.modify('move', 'backward', 'word');
                    s.modify('extend', 'forward', 'word');
                    t = s.toString();
                    s.modify('move', 'forward', 'character'); //clear selection
                } else {
                    t = s.toString();
                }
            }
            return t;
        },

        //
        handleTouch: function(e) {
            // what has been selected?
            selection = this.getSelection();
            alert(selection);
            this.nextState(e.target);
        },

        //
        handleBlur: function(e) {
            this.resetState(e.target);
        }
    };

    return {
        register: function(elements) {
            elements = elements instanceof Array ? elements : [elements];
            for (i in elements) {
                elements[i].addEventListener('touchend', (function() {
                    return function(e) {
                        Woodpecker.handleTouch(e);
                    };
                })());
                elements[i].addEventListener('blur', (function() {
                    return function(e) {
                        Woodpecker.handleBlur(e);
                    };
                })());
            }
        }
    }
})();
