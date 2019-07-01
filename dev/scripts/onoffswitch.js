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