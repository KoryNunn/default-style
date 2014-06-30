var defaultStyles,
    currentWindow;

if(typeof window !== 'undefined'){
    currentWindow = window;
}

function insertTag(){
    currentWindow.document.head.insertBefore(defaultStyles, currentWindow.document.head.childNodes[0]);
}

if(currentWindow){
    defaultStyles = currentWindow.document.createElement('style');
    if(currentWindow.document.head){
        insertTag();
    }else{
        currentWindow.addEventListener('load', insertTag);
    }
}

function DefaultStyle(cssText, dontInsert){
    this._node = currentWindow.document.createTextNode(cssText || '');

    if(!dontInsert){
        this.insert();
    }
}
DefaultStyle.prototype.insert = function(target){
    target || (target = defaultStyles);

    target.appendChild(this._node);
};
DefaultStyle.prototype.remove = function(){
    var parent = this._node.parentElement;
    if(parent){
        parent.removeChild(this._node);
    }
};
DefaultStyle.prototype.css = function(cssText){
    if(!arguments.length){
        return this._node.textContent;
    }

    this._node.textContent = cssText;
};

module.exports = DefaultStyle;