'use strict';

var elementAccordeon = document.querySelectorAll('.e-accordion__short');

elementAccordeon.forEach(function(block, index) {
  block.addEventListener('click', function(event) {
    var hiddenBlock = event.currentTarget.nextElementSibling;
		var heightHiddenBlock = 0;
		
    if(!event.currentTarget.classList.contains('opened-accordeon')) {
      heightHiddenBlock = hiddenBlock.sizesElement().height;
		}
		
    event.currentTarget.classList.toggle('opened-accordeon');
    hiddenBlock.style.height = heightHiddenBlock + 'px';
  })
});

Element.prototype.sizesElement = function() {
  var newElement =  this.cloneNode(true);
  newElement.classList.add('element-for-check-sizes');
  newElement.style.height = 'auto';
  newElement.style.position = 'absolute';
  newElement.style.opacity = 0;
  newElement.style.zIndex = -1;
  this.parentNode.appendChild(newElement);
  
  var sizes = {
    width: newElement.clientWidth,
    height: newElement.clientHeight
  };
  
  newElement.parentNode.removeChild(newElement);
  
  return sizes;
}
'use strict';

var onoffswitches = document.querySelectorAll('.onoffswitch .onoffswitch__checkbox');

onoffswitches.forEach(function(onoffswitch) {
	onoffswitch.addEventListener('change', function(event) {
		const isChecked = event.currentTarget.checked;
		const wrapSwitch = onoffswitch.parentNode;
		const settings = JSON.parse(wrapSwitch.dataset.themes);
		Object.keys(settings).forEach(selector => {
			let targetElementsForChange = document.querySelectorAll(selector);
			targetElementsForChange.forEach(function(element) {
				element.classList.remove(settings[selector][+(!isChecked)]);
				element.classList.add(settings[selector][+isChecked]);
			});
		});
	})
});
'use strict';

fetch('./bem.json')
	.then(function(response) {
		return response.json();
	})
	.then(function(json) {
		createBEMLayout(json);
	});


Element.prototype.addMod = function(elem, modName = '', modValue = '') {
	this.classList.add(elem + modName + modValue);
}

Element.prototype.addMods = function(entity, mods) {
	Object.keys(mods).forEach(keyMod => {
		this.addMod(entity, '_' + keyMod, '_' + mods[keyMod]);
	});
};

Element.prototype.addMix = function(entity, mixes) {
	this.classList.add(entity);
	this.addMods(entity, mixes);
};

Element.prototype.addMixes = function(arrMix) {
	if (arrMix) {
		arrMix.forEach(mix => {
			if( mix.hasOwnProperty('elem') && mix.hasOwnProperty('elemMods') ) {
				this.addMix(`${mix.block}__${mix.elem}`, mix.elemMods);
			} else if( mix.hasOwnProperty('block') && mix.hasOwnProperty('mods') ) {
				this.addMix(mix.block, mix.mods);
			}
		});
	}
};

function createBEMElement(elemScheme) {
	const newElem = document.createElement('div');

	// element's class
	if( elemScheme.hasOwnProperty('block') ) {
		if( elemScheme.hasOwnProperty('elem') ) {
			newElem.classList.add(`${elemScheme.block}__${elemScheme.elem}`);
		} else {
			newElem.classList.add(elemScheme.block);
		}
	}

	// mods
	if( elemScheme.hasOwnProperty('block') ) {
		if( elemScheme.hasOwnProperty('elem') && elemScheme.hasOwnProperty('elemMods') ) {
			newElem.addMods(`${elemScheme.block}__${elemScheme.elem}`, elemScheme.elemMods);
		} else if(elemScheme.hasOwnProperty('mods')) {
			newElem.addMods(elemScheme.block, elemScheme.mods);
		}
	}

	// mixes
	if ( elemScheme.hasOwnProperty('mix') && elemScheme.mix.length ) {
		newElem.addMixes(elemScheme.mix);
	}

	// content
	if(Array.isArray(elemScheme.content) && elemScheme.hasOwnProperty('content') && elemScheme.content.length ) {
		elemScheme.content.forEach(elem => {
			newElem.appendChild(createBEMElement(elem));
		});
	} 
	
	if( elemScheme.hasOwnProperty('content') && elemScheme.content.hasOwnProperty('html') ) {
		newElem.innerHTML = elemScheme.content.html;
	}

	return newElem;
};

function createBEMLayout(structure) {
	const rootLayout = document.createElement('div');
	document.getElementById('app').appendChild(rootLayout);
	rootLayout.appendChild(createBEMElement(structure));
};