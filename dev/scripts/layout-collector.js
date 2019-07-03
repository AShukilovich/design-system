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