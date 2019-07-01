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