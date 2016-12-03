const { Manager, Swipe, Tap } = Hammer; // import Hammer;

const FUSE_LENGTH = 415;

class Game {
	constructor(
		inputId = 'wordInput',
		textId = 'letterSet',
		fuseId = 'fuse',
		bombId = 'bomb'
	) {
		this.valid = Promise.resolve(false);
		this.letters = '';
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this)

		const input = document.getElementById(inputId);
		const text = document.getElementById(textId);
		const fuse = document.getElementById(fuseId);
		fuse.style.strokeDashoffset = 0;

		const bomb = document.getElementById(bombId);
		const mc = new Manager(bomb);
		mc.add(new Swipe({ direction: Hammer.DIRECTION_ALL }));
		mc.add(new Tap());

		Object.assign(this, { input, text, fuse, bomb, mc });

		mc.on('swipe', this.handleSubmit);
		mc.on('tap', this.handleSubmit);

		input.addEventListener('keyup', this.handleChange);
		bomb.addEventListener('animationend',	() => this.bomb.style.animationName = '');
	}

	setText(newLetters) {
		this.letters = newLetters.toUpperCase();
		this.text.textContent = this.letters;
	}

	clearInput() {
		this.input.reset();
	}

	setFuse(percent) {
		this.fuse.style.strokeDashoffset = percent * this.fuseLength;
	}

	containsLetters(value) {
		return value.toUpperCase().includes(this.letters);
	}

	handleSubmit(e) {
		this.valid.then((isValid) => {
			if (!isValid) {
				this.bomb.style.animationName = 'shake';
				return;
			}

			socket.emit('bomb.pass')

			let animationName;
			switch (e.direction) {
				case Hammer.DIRECTION_LEFT:
					animationName = 'slideLeft';
					break;
				case Hammer.DIRECTION_RIGHT:
					animationName = 'slideRight';
					break;
				case Hammer.DIRECTION_UP:
					animationName = 'slideUp';
					break;
				case Hammer.DIRECTION_NONE:
				case Hammer.DIRECTION_DOWN:
				default:
					animationName = 'slideDown';
					break;
			}

			this.bomb.style.animationName = animationName;
		});
	}

	handleChange(e) {
		if (e.keyCode === 13) {
			this.handleSubmit({});
			return;
		}

		const value = e.target.value;
		//console.log(value);
		if (!this.containsLetters(value)) {
			this.valid = Promise.resolve(false);
			return;
		}

		this.valid = fetch(`../checkword/${value}`, { method: 'HEAD' })
			.catch(err => ({ ok: false }))
			.then(response => response.ok)
	}
}

new Game().setText('ke');
