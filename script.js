function CreateCalendar() {

	let date = new Date(),
		currentYear = date.getFullYear(),
		currentMonth = date.getMonth();
	const monthsInYear = 12

	const that = this;
	const dateShow = document.getElementById('date-show');
	const modalFastEvent = document.getElementById('modal-fast-event');
	const modalFastEventMonth = document.getElementById('modal-fast-event-selector-month');
	const modalFastEventYear = document.getElementById('modal-fast-event-selector-year');
	const modalFastEventDay = document.getElementById('modal-fast-event-selector-day');
	const calendar = document.querySelector('tbody');
	const modalDatePick = document.getElementById('modal-date-pick');
	const eventSearchInput = document.getElementById('search');
	const eventSearchWrapper = document.getElementById('search-events');

	const buttons = {
		modalFastEventOpen: document.getElementById('modal-fast-event-add'),
		modalFastEventCreate: document.getElementById('modal-fast-event-create'),
		modalFastEventClose: document.getElementById('modal-fast-event-close'),

		prev: document.getElementById('prev-button'),
		next: document.getElementById('next-button'),
		today: document.getElementById('today'),

		modalDatePickDone: document.getElementById('modal-date-pick-done'),
		modalDatePickClose: document.getElementById('modal-date-pick-close'),
		modalDatePickDelete: document.getElementById('modal-date-pick-delete')


	}

	const monthNames = ["January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"
	]

	daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

	const events = JSON.parse(localStorage.getItem('events')) || [];



	this.prevMonth = function () {
		currentMonth -= 1;
		incrementDates();
		this.update(currentYear, currentMonth);
	}

	this.nextMonth = function () {
		currentMonth += 1;
		incrementDates();
		this.update(currentYear, currentMonth);
	}


	document.addEventListener('click', (e) => {
		const target = e.target;


		switch (target) {

			case buttons.prev:
				this.prevMonth();
				break;

			case buttons.next:
				this.nextMonth();
				break;

			case buttons.modalFastEventOpen:
				this.fastAddEvent();
				break;

			case buttons.today:
				let today = new Date();
				currentYear = today.getFullYear();
				currentMonth = today.getMonth();
				this.update(currentYear, currentMonth);
				break;

		}

		if (target !== buttons.modalFastEventOpen && target !== modalFastEvent && !modalFastEvent.contains(target)) {
			modalFastEvent.classList.remove('active');
		}

		const clickOutsideModal = !calendar.contains(target) && target !== modalDatePick && target.parentNode != modalDatePick || target.classList.contains('no-border')
		if (clickOutsideModal) {
			calendar.querySelectorAll('td').forEach((elem) => elem.classList.remove('event-focus'));
			modalDatePick.classList.remove('active');
		}

	});


	this.fastAddEvent = function () {
		modalFastEvent.classList.add('active');

		modalFastEvent.onclick = (e) => {
			const target = e.target;

			if (target === document.getElementById('modal-fast-event-close')) {
				modalFastEvent.classList.remove('active');

			} else if (target === document.getElementById('modal-fast-event-create')) {

				const date = `${modalFastEventDay.value} . ${monthNames.indexOf(modalFastEventMonth.value) + 1} . ${modalFastEventYear.value}`
				if (event === '') {
					alert('event name required');
					return;
				}

				// if event with this date already exists, delete it
				for (let i = 0; i < events.length; i++) {
					if (events[i].date === date) {
						events.splice(i, 1);
					};
				};

				events.push({
					'event': document.getElementById('modal-fast-event-info').value,
					'date': date,
					'names': '',
					'description': ''
				});

				// modalFastEvent.classList.remove('active');
				this.update(currentYear, currentMonth);
			}
		}



	}

	//adding years to fast selection
	for (let i = currentYear - 10; i < currentYear + 10; i++) {
		const option = document.createElement('option');
		option.innerHTML = i;

		if (i === currentYear) {
			option.setAttribute('selected', '');
		};

		modalFastEventYear.appendChild(option);

	}

	//adding months to fast selection
	monthNames.forEach(function (value) {
		const option = document.createElement('option');
		option.innerHTML = value;

		if (value === monthNames[currentMonth]) {
			option.setAttribute('selected', '');
		};

		modalFastEventMonth.appendChild(option);
	})


	//adding days to fast selection
	for (let i = 1; i < daysInMonth(currentYear, currentMonth) + 1; i++) {
		const option = document.createElement('option');
		option.innerHTML = i;

		if (i === date.getDate()) {
			option.setAttribute('selected', '');
		};

		modalFastEventDay.appendChild(option);
	}


	// if selected month or year changes, change amount of days
	[modalFastEventMonth, modalFastEventYear].forEach((e) => e.onchange = function () {

		while (modalFastEventDay.firstChild) {
			modalFastEventDay.removeChild(modalFastEventDay.firstChild);
		};

		for (let i = 1; i < daysInMonth(modalFastEventYear.value, monthNames.indexOf(modalFastEventMonth.value)) + 1; i++) {
			const option = document.createElement('option');
			option.innerHTML = i;

			if (i === date.getDate()) {
				option.setAttribute('selected', '');
			};

			modalFastEventDay.appendChild(option);
		};

	});




	this.update = function (year, month) {

		while (calendar.firstChild) {
			calendar.removeChild(calendar.firstChild)
		};

		date = new Date(year, month, 1);

		let tr = document.createElement('tr');
		calendar.appendChild(tr);

		//space before first day of the month
		for (let i = 0; i < getDay(date); i++) {
			let td = document.createElement('td');
			tr.appendChild(td);

			td.classList.add('no-border');
		}


		for (let i = 0; i < daysInMonth(year, month); i++) {

			const td = document.createElement('td');
			td.innerHTML = `<div class="date">${date.getDate()}</div`;

			tr.appendChild(td);

			for (let j = 0; j < events.length; j++) {
				// if event with this date exists
				if ((date.getDate() + '.' + (month + 1) + '.' + year) === events[j].date) {
					td.innerHTML = '<div class="event-date">' + date.getDate() + "</div>" +
						'<div class="event-event">' + events[j].event + '</div>' + '<div class="event-names">' +
						events[j].names + '</div>' + '<div class="event-description">' + events[j].description + '</div>';


					td.classList.add('event-active');
				}
			}

			if (getDay(date) % 7 == 6) { // new row after sunday
				tr = document.createElement('tr');
				calendar.appendChild(tr);
			}

			date.setDate(date.getDate() + 1);

		}
		dateShow.innerHTML = monthNames[month] + ' ' + year;


		localStorage.events = JSON.stringify(events);
	}

	this.update(currentYear, currentMonth);




	this.eventsSearch = function () {
		eventSearchWrapper.classList.add('active');

		eventSearchInput.onkeyup = function () {

			while (eventSearchWrapper.firstChild) {
				eventSearchWrapper.removeChild(eventSearchWrapper.firstChild)
			};

			for (let i = 0; i < events.length; i++) {

				if (events[i].event.toLowerCase().includes(eventSearchInput.value.toLowerCase()) ||
					events[i].date.toLowerCase().includes(eventSearchInput.value.toLowerCase()) ||
					events[i].names.toLowerCase().includes(eventSearchInput.value.toLowerCase())) {

					const li = document.createElement('li');
					li.innerHTML = '<span class="search-event">' + events[i].event + '</span>' + ' ' +
						'<span class="search-date">' + events[i].date + '</span>' + ' ' + '<span class="search-names">' +
						events[i].names + '</span>';
					eventSearchWrapper.appendChild(li);

				};
			};
		};

	};


	// search events

	eventSearchInput.addEventListener('focus', this.eventsSearch);

	eventSearchWrapper.addEventListener('mousedown', updateSearchResults)

	eventSearchInput.addEventListener('blur', () => {
		eventSearchWrapper.classList.remove('active');
	})

	function updateSearchResults(e) {
		const target = e.target.closest('li');
		const searchDate = target.querySelector('.search-date').innerHTML.split('.');

		currentYear = Number(searchDate[2]);
		currentMonth = Number(searchDate[1]) - 1;

		that.update(currentYear, currentMonth);
	}




	calendar.addEventListener('click', (e) => {
		const target = e.target.closest('td');

		//removing focus from elements
		calendar.querySelectorAll('td').forEach((elem) => elem.classList.remove('event-focus'));

		if (target.classList.contains('no-border')) {
			return;
		}

		const date = `${target.firstChild.innerHTML}.${currentMonth + 1}.${currentYear}`;

		target.classList.add('event-focus');

		openModalDatePick(target, date);

	});


	function openModalDatePick(target, date) {
		modalDatePick.classList.add('active');

		// standart x position of modal and triangle
		modalDatePick.style.left = getCoords(target).left + parseInt(getComputedStyle(target).width) + 15 + 'px';
		modalDatePick.querySelector('.cor').style.left = '-25px';
		modalDatePick.querySelector('.cor').style.transform = '';

		//if modal overflows x
		if (parseInt(getComputedStyle(modalDatePick).left) + parseInt(getComputedStyle(modalDatePick).width) > parseInt(getComputedStyle(document.body).width)) {
			modalDatePick.style.left = getCoords(target).left - parseInt(getComputedStyle(modalDatePick).width) - 15 + 'px';
			modalDatePick.querySelector('.cor').style.left = '300px';
			modalDatePick.querySelector('.cor').style.transform = 'rotate(180deg)';
		}



		//standart y position of modal and triangle
		modalDatePick.style.top = getCoords(target).top - 20 + 'px';
		modalDatePick.querySelector('.cor').style.top = '20px';

		// if modal overflows y
		if (parseInt(getComputedStyle(modalDatePick).top) + parseInt(getComputedStyle(modalDatePick).height) > parseInt(getComputedStyle(document.body).height)) {
			modalDatePick.style.top = getCoords(target).top - parseInt(getComputedStyle(modalDatePick).height) + 40 + 'px';
			modalDatePick.querySelector('.cor').style.top = '260px';
		}

		fillFields(date, target);


		modalDatePick.onclick = (e) => {

			if (e.target === document.getElementById('modal-date-pick-done')) {
				const event = document.getElementById('modal-date-pick-event').value;
				const names = document.getElementById('modal-date-pick-names').value;
				const description = document.getElementById('modal-date-pick-description').value;

				if (event === '') {
					alert('event name required');
					return;
				}

				// if event with this date already exists, delete it
				events.find((value, i) => {
					if (value.date === date) {
						events.splice(i, 1);
					}
				});


				events.push({
					'event': event,
					'date': date,
					'names': names,
					'description': description
				});

				that.update(currentYear, currentMonth);


			} else if (e.target === document.getElementById('modal-date-pick-delete')) {

				//delete month
				events.find((value, i) => {
					if (value.date === date) {
						events.splice(i, 1);
					}
				});

				that.update(currentYear, currentMonth);

			} else if (e.target === document.getElementById('modal-date-pick-close')) {
				modalDatePick.classList.remove('active');
			}

			if (e.target.tagName === 'BUTTON') {
				modalDatePick.classList.remove('active');
				target.classList.remove('event-focus');
			}
		}

	}


	function fillFields(date, target) {

		if (isEventExists(date)) {
			document.getElementById('modal-date-pick-event').value = target.querySelector('.event-event').innerHTML;
			document.getElementById('modal-date-pick-names').value = target.querySelector('.event-names').innerHTML;
			document.getElementById('modal-date-pick-description').value = target.querySelector('.event-description').innerHTML;

			document.getElementById('modal-date-pick-delete').style.display = 'inline-block';
		} else {
			document.getElementById('modal-date-pick-event').value = '';
			document.getElementById('modal-date-pick-names').value = '';
			document.getElementById('modal-date-pick-description').value = '';

			document.getElementById('modal-date-pick-delete').style.display = 'none';
		}

	}

	function isEventExists(date) {

		for (let i = 0; i < events.length; i++) {

			if (events[i].date === date) {
				return true;
			}

		}
	}

	function getDay(date) { // get number of day in week, from 0(mon) to 6(su)
		let day = date.getDay();

		if (day == 0) {
			day = 7;
		}

		return day - 1;
	}

	function getCoords(elem) {
		const box = elem.getBoundingClientRect();

		return {
			top: box.top + pageYOffset,
			left: box.left + pageXOffset
		}
	}

	function incrementDates() {
		//properly increment year/month name when changed with arrows
		if (currentMonth === monthsInYear) {

			currentYear++;
			currentMonth = currentMonth - monthsInYear;

		} else if (currentMonth < 0) {

			currentYear--;
			currentMonth = currentMonth + monthsInYear;

		}

	}


}


const calendar = new CreateCalendar();