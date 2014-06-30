var defaultStyles,
    validEnvironment;

function insertTag(){
    document.head.insertBefore(defaultStyles, document.head.childNodes[0]);
}

if(
    typeof window === 'undefined' ||
    typeof document === 'undefined' ||
    typeof document.createTextNode === 'undefined'
){
    console.warn('No approprate environment, no styles will be added.');
}else{
    validEnvironment = true;

    defaultStyles = document.createElement('style');

    if(document.head){
        insertTag();
    }else{
        addEventListener('load', insertTag);
    }
}

function DefaultStyle(cssText, dontInsert){
    if(!validEnvironment){
        return this;
    }

    this._node = document.createTextNode(cssText || '');

    if(!dontInsert){
        this.insert();
    }
}
DefaultStyle.prototype.insert = function(target){
    if(!validEnvironment){
        return;
    }

    target || (target = defaultStyles);

    target.appendChild(this._node);
};
DefaultStyle.prototype.remove = function(){
    if(!validEnvironment){
        return;
    }

    var parent = this._node.parentElement;
    if(parent){
        parent.removeChild(this._node);
    }
};
DefaultStyle.prototype.css = function(cssText){
    if(!validEnvironment){
        return;
    }

    if(!arguments.length){
        return this._node.textContent;
    }

    this._node.textContent = cssText;
};

module.exports = DefaultStyle;